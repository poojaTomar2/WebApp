
/**
 * @class Ext.ux.grid.MultiGroupingPagingStore
 * @extends Ext.ux.grid.MultiGroupingStore
 * A specialized {@link Ext.data.Store} that allows data to be appended a page at
 * a time as the user scrolls through. It is based on performing server-side sorting
 * and grouping and should be used in conjunction with a {@link Ext.ux.grid.MultiGroupPagingGrid}  
 * @constructor
 * Create a new MultiGroupingPagingStore
 * @param {Object} config The config object
 * 
 * @author PaulE  
 */
Ext.ux.MultiGroupingPagingStore = Ext.extend(Ext.ux.MultiGroupingStore, {

	/** When creating the store, register an internal callback for post load processing
	*/
	constructor: function (config) {
		Ext.ux.MultiGroupingPagingStore.superclass.constructor.apply(this, arguments);
		// When loading has finished, need to see if there are more records
		/*  
		this.on("load", function(store, r, options) {
		return this.loadComplete(r, options);
		}, this);*/
		this.remoteSort = true;
		this.remoteGroup = true;
	}

	/**
	* @cfg {Number} pageSize
	* The number of records to read/display per page (defaults to 20)
	*/
   , pageSize: 10

	/** Private: The Key of the extra record read if there is more that the page size
	*/
   , nextKey: null

	/** Override the load method so it can merge the groupFields and sortField
	* into a single sort criteria (group fields need to be sorted by first!)
	*/
   , load: function (options) {
   	//console.debug("Store.load: ", options, this.isLoading);
   	options = options || {};
   	if (this.fireEvent("beforeload", this, options) !== false) {
   		this.storeOptions(options);
   		if (options.initial == true) {
   			delete this.nextKey;
   			delete this.totalCount;
   		}
   		delete this.baseParams.groupBy;
   		var p = Ext.apply(options.params || {}, this.baseParams);
   		var sort = [];
   		var meta = this.recordType.getField;
   		var f;
   		if (this.groupField && this.remoteGroup) {
   			if (Ext.isArray(this.groupField))
   				for (var i = 0; i < this.groupField.length; i++) {
   					f = meta(this.groupField[i]);
   					if (f) {
   						sort[sort.length] = (f.name || f.sortFieldName || this.groupField[i]) + ' ' + (f.sortDir || '');
   					}
   				}
   			else {
   				f = meta(this.groupField);
   				sort[sort.length] = (f.name || f.sortFieldName || this.groupField) + ' ' + (f.sortDir || '');
   			}
   		}
   		if (this.sortInfo && this.remoteSort) {
   			if (Ext.isArray(this.sortInfo))
   				for (var i = 0; i < this.sortInfo.length; i++) {
   					f = meta(this.sortInfo[i].field);
   					if (f) {
   						sort[sort.length] = (f.name || f.sortFieldName || this.sortInfo[i].field) + " " + this.sortInfo[i].direction;
   					}
   				}
   			else {
   				f = meta(this.sortInfo.field);
   				sort[sort.length] = (f.name || f.sortFieldName || this.sortInfo.field) + " " + this.sortInfo.direction;
   			}
   		}
   		p[this.paramNames.sort] = sort.join(",");

   		if (this.sortInfo) {
   			if (Ext.isArray(this.sortInfo)) {
   				//console.debug("Store.load : Query Parameters ", p, sort, this.sortInfo[0].field, this.sortInfo[0].direction, this);
   			} else {
   				if (this.sortInfo.field) {
   					//console.debug("Store.load : Query Parameters ", p, sort, this.sortInfo.field, this.sortInfo.direction, this);
   				}
   			}
   		}
   		this.proxy.load(p, this.reader, this.loadRecords, this, options);
   		return true;
   	} else {
   		return false;
   	}
   }

	/** Reload the current set of record, using by default the current options
	* This will reload the same number of records that have currently been loaded, not
	* just the initial page again.       
	* @param options, additional query options that can be provided if needed
	*/
   , reload: function (options) {
   	var o = Ext.applyIf(options || {}, this.lastOptions);
   	var pn = this.paramNames;
   	if (!o.params) o.params = [];
   	o.params[pn.start] = 0;
   	o.params[pn.limit] = Math.max(this.pageSize, this.data.length) + 1;
   	o.add = false;
   	o.initial = false;
   	//console.debug("Store.reload :", o, this.sortInfo);
   	return this.load(o);
   }
	/** Load the next page of records, if there are more available
	* @param initial, set to true if this should be a initial load
	*/
   , loadMore: function (initial) {
   	if (!initial && !this.nextKey) {
   		//console.debug("Store.loadMore : Reject load, no more records left");
   		return;
   	}

   	var o = {}, pn = this.paramNames;
   	o[pn.start] = initial ? 0 : this.getCount();
   	o[pn.limit] = this.pageSize + 1;
   	//console.debug("Store.loadMore : Loading based on ", o);
   	this.load({ params: o, add: !initial, initial: initial });
   }

	/** Private - Override default callback handler once records have been loaded.
	* Looks to see if we are able to find more that just the page size, if so
	* it removes the extra one, but keeps it for consistency checking for when the
	* next page is loaded
	* @param r, array of records read from the server
	* @param options, the options that were used by the load operation to do the query
	*/
   , loadRecords: function (o, options, success) {
   	if (o && success && o.records) {
   		var r = o.records;
   		//console.debug("Store.loadRecords : rows=", r.length, options);
   		var nextKey = this.nextKey;
   		delete this.nextKey;
   		// Need to compare the prior next key, to the first row that was added
   		// This could trigger a complete reload
   		if (nextKey) {
   			var id = this.reader.meta.id; // Get key field name from reader
   			//console.debug("Store.loadRecords : Refresh Check...", id, r[0].data[id], nextKey.data[id]);
   			if (r[0].data[id] != nextKey.data[id]) {
   				//console.debug("Store.loadRecords : Need to refresh all records as they are out of sync");
   				var pn = this.paramNames;
   				options.params[pn.limit] = options.params[pn.limit] + options.params[pn.start] - 1;
   				options.params[pn.start] = 0;
   				options.add = false;
   				options.initial = false;
   				delete this.nextKey;
   				this.fireEvent("loadexception", this);
   				//console.debug("Store.loadRecords : Reload Using ", options);
   				//this.load.defer(20, this, [options]);
   				this.load(options);
   				return;
   			}
   		}
   		// Need to remove the extra record, and put it in the next key.
   		if (r.length >= options.params[this.paramNames.limit]) {
   			//console.debug("Store.loadRecords : More records exist, remove extra one");
   			this.nextKey = r[r.length - 1];
   			// remove this last record
   			r.remove(this.nextKey);
   			//console.debug("Store.loadRecords : Total=", this.data.length, this.getCount());
   		} else
   		// Set the total count as we now know what it is
   			this.totalCount = r.length + (options.add == true ? this.getCount() : 0);
   	}
   	Ext.ux.MultiGroupingStore.superclass.loadRecords.call(this, o, options, success);
   }
});  
