/**
* @author chander, adapted by SIDGEY
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------------- MULTI GROUPING STORE ----------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////
Ext.ux.MultiGroupingStore = Ext.extend(Ext.data.GroupingStore, {
	constructor: function (config) { Ext.ux.MultiGroupingStore.superclass.constructor.apply(this, arguments); },
	//sortInfo: [],
	groupBy: function (field, forceRegroup) {
		//alert("groupBy   " + field + "   " + forceRegroup);
		if (!forceRegroup && this.groupField == field) {
			return; // already grouped by this field
		}

		//if field passed in is an array, assume this is a complete replacement for the 'groupField'
		if (Ext.isArray(field)) {
			if (field.length == 0)
			// todo: field passed in is empty/null, assume this means group by nothing, ie remove all groups
				this.groupField = false;
			else
				this.groupField = field;
		} else {
			// Add the field passed as as an additional group
			if (this.groupField) {
				// If there is already some grouping, make sure this field is not already in here
				if (this.groupField.indexOf(field) == -1) {
					if (!Ext.isArray(this.groupField)) {
						this.groupField = [this.groupField];
					} else {
						this.groupField.push(field);
					}
				}
				else
					return; // Already grouped by this field  
			} else
			// If there is no grouping already use this field
				this.groupField = [field];
		}
		if (this.remoteGroup) {
			if (!this.baseParams) {
				this.baseParams = {};
			}
			if (this.baseParams.groupBy) {
				delete this.baseParams.groupBy;
			}
			if (this.baseParams.multiGroupBy) {
				delete this.baseParams.multiGroupBy;
			}

			this.baseParams['multiGroupBy'] = Ext.encode(this.groupField);
		}
		//console.debug("store.groupBy: data=", this.lastOptions);
		if (this.lastOptions != null) { // do nothing if the store has never been loaded
			if (this.groupOnSort) {
				this.sort(field);
				return;
			}
			if (this.remoteGroup) {
				this.reload();
			}
			else {
				var si = this.sortInfo || [];
				if (si.field != field) {
					this.applySort();
				}
				else {
					//  alert(field);
					this.sortData(field);
				}
				this.fireEvent('datachanged', this);
			}
		}
	},

	/** private - Overrides Ext.data.GroupingStore
	* Initially sort based on sortInfo (if set and not remote)
	* Then resort based on groupFields (if set and not remote)
	*/
	applySort: function () {
		var si = this.sortInfo;
		if (si && si.length > 0 && !this.remoteSort) {
			this.sortData(si, si[0].direction);
		}
		if (!this.groupOnSort && !this.remoteGroup) {
			var gs = this.getGroupState();
			if (gs && gs != this.sortInfo) {
				this.sortData(this.groupField);
			}
		}
	},

	/** private - Overrides Ext.data.Store
	* @param flist is an array of fields to sort by
	*/
	sortData: function (flist, direction) {
		//console.debug('Store.sortData: ',flist, direction);
		direction = direction || 'ASC';
		var st = [];
		var o;
		for (var i = 0, len = flist.length; i < len; ++i) {
			o = flist[i];
			st.push(this.fields.get(o.field ? o.field : o).sortType);
		}
		var fn = function (r1, r2) {
			var v1 = [];
			var v2 = [];
			var len = flist.length;
			var o;
			var name;

			for (var i = 0; i < len; ++i) {
				o = flist[i];
				name = o.field ? o.field : o;
				v1.push(st[i](r1.data[name]));
				v2.push(st[i](r2.data[name]));
			}

			var result;
			for (var i = 0; i < len; ++i) {
				result = v1[i] > v2[i] ? 1 : (v1[i] < v2[i] ? -1 : 0);
				if (result != 0)
					return result;
			}

			return result; //if it gets here, that means all fields are equal
		};

		this.data.sort(direction, fn);
		if (this.snapshot && this.snapshot != this.data) {
			this.snapshot.sort(direction, fn);
		}
	},

	/**
	* Sort the Records. Overrides Ext.data.store
	* If remote sorting is used, the sort is performed on the server, and the cache is
	* reloaded. If local sorting is used, the cache is sorted internally.
	* @param {String} field This is either a single field (String) or an array of fields [<String>] to sort by
	* @param {String} dir (optional) The sort order, "ASC" or "DESC" (case-sensitive, defaults to "ASC")
	*/
	/*sort: function (field, dir) {
	//console.debug('Store.sort: ',field,dir);
	var f = [];
	if (Ext.isArray(field)) {
	for (var i = 0, len = field.length; i < len; ++i) {
	f.push(this.fields.get(field[i]));
	}
	} else {
	f.push(this.fields.get(field));
	}

	if (f.length < 1) {
	return false;
	}

	if (!dir) {
	if (this.sortInfo && this.sortInfo.length > 0 && this.sortInfo[0].field == f[0].name) { // toggle sort dir
	dir = (this.sortToggle[f[0].name] || "ASC").toggle("ASC", "DESC");
	} else {
	dir = f[0].sortDir;
	}
	}

	var st = (this.sortToggle) ? this.sortToggle[f[0].name] : null;
	var si = (this.sortInfo) ? this.sortInfo : null;

	this.sortToggle[f[0].name] = dir;
	this.sortInfo = [];
	for (var i = 0, len = f.length; i < len; ++i) {
	this.sortInfo.push({
	field: f[i].name,
	direction: dir
	});
	}

	//console.debug("store.sort: data=", this.lastOptions);
	if (this.lastOptions != null) { // do nothing if the store has never been loaded
	if (!this.remoteSort) {
	this.applySort();
	this.fireEvent("datachanged", this);
	} else {
	this.nextKey = null;
	if (!this.reload()) {
	if (st) {
	this.sortToggle[f[0].name] = st;
	}
	if (si) {
	this.sortInfo = si;
	}
	}
	}
	}
	},*/

	/**
	* Returns an object describing the current sort state of this Store.
	* @return {Object} The sort state of the Store. An object with two properties:<ul>
	* <li><b>field : String<p class="sub-desc">The name of the field by which the Records are sorted.</p></li>
	* <li><b>direction : String<p class="sub-desc">The sort order, "ASC" or "DESC" (case-sensitive).</p></li>
	* </ul>
	*/
	/*getSortState: function () {
	return this.sortInfo && this.sortInfo.length > 0 ?
	{ field: this.sortInfo[0].field, direction: this.sortInfo[0].direction} :
	{};
	},*/

	/**
	* Sets the default sort column and order to be used by the next load operation.
	* Overrides Ext.data.Store     
	* @param {String} field The name of the field to sort by, or an array of fields
	* @param {String} dir (optional) The sort order, "ASC" or "DESC" (case-sensitive, defaults to "ASC")
	*/
	setDefaultSort: function (field, dir) {
		// alert('setDefaultSort '+ field);
		dir = dir ? dir.toUpperCase() : "ASC";
		this.sortInfo = [];

		if (!Ext.isArray(field))
			this.sortInfo.push({
				field: field,
				direction: dir
			});
		else {
			for (var i = 0, len = field.length; i < len; ++i) {
				this.sortInfo.push({
					field: field[i].field,
					direction: dir
				});
				this.sortToggle[field[i]] = dir;
			}
		}
	},


	removeGroupField: function (fld) {
		// todo
		if (this.groupField) {
			var i = this.groupField.length;
			this.groupField.remove(fld);
			// See if anything was really removed?
			if (this.groupField.length < i) {
				if (this.groupField.length == 0)
					this.groupField = false;
				// Fire event so grid can be re-drawn  
				this.fireEvent('datachanged', this);
			}
		}
	}

});

Ext.ux.MultiGroupingView = Ext.extend(Ext.grid.GroupingView, {
	constructor: function (config) {
		Ext.ux.MultiGroupingView.superclass.constructor.apply(this, arguments);
		// Added so we can clear cached rows each time the view is refreshed
		this.on("beforerefresh", function () {
			if (this.rowsCache) delete this.rowsCache;
		}, this);

	}

  , displayEmptyFields: false

  , renderRows: function () {
  	var drag_active = this.grid.store.drag;
  	var drop_active = this.grid.store.drop;
  	var showGroup = this.grid.store.showGroup;
  	var groupField = 'undefined';
  	if (!drag_active && !drop_active && Ext.state.Manager.getProvider().state[this.grid.stateId] && !showGroup) { //If not coming from drag/drop its will consider user group state 
  		groupField = Ext.state.Manager.getProvider().state[this.grid.stateId].groupFields;
  	}
  	else {
  		groupField = this.getGroupField();
  	}

  	this.grid.store.groupField = groupField;
  	if (this.grid.getBottomToolbar()) {
  		this.grid.pageSize = this.grid.getBottomToolbar().pageSize;
  	}
  	var eg = !!groupField;
  	// if they turned off grouping and the last grouped field is hidden
  	if (groupField == false) {
  		delete this.grid.baseParams.multiGroupBy
  		delete this.grid.baseParams.groupBy
  	}
  	else {
  		Ext.state.Manager.set(this.grid.stateId, this.grid.getState());
  		this.fireEvent('statesave', this, this.grid.getState());
  	}
  	if (this.hideGroupedColumn) {
  		var colIndexes = [];
  		if (eg) {
  			for (var i = 0, len = groupField.length; i < len; ++i) {
  				var cidx = this.cm.findColumnIndex(groupField[i]);
  				if (cidx >= 0)
  					colIndexes.push(cidx);
  			}
  		}
  		if (!eg && this.lastGroupField !== undefined) {
  			this.mainBody.update('');
  			for (var i = 0, len = this.lastGroupField.length; i < len; ++i) {
  				var cidx = this.cm.findColumnIndex(this.lastGroupField[i]);
  				if (cidx >= 0)
  					this.cm.setHidden(cidx, false);
  			}
  			delete this.lastGroupField;
  			delete this.lgflen;
  		}

  		else if (eg && colIndexes.length > 0 && this.lastGroupField === undefined) {
  			this.lastGroupField = groupField;
  			this.lgflen = groupField.length;
  			for (var i = 0, len = colIndexes.length; i < len; ++i) {
  				this.cm.setHidden(colIndexes[i], true);
  			}
  		}

  		else if (eg && this.lastGroupField !== undefined && (groupField !== this.lastGroupField || this.lgflen != this.lastGroupField.length)) {
  			this.mainBody.update('');
  			for (var i = 0, len = this.lastGroupField.length; i < len; ++i) {
  				var cidx = this.cm.findColumnIndex(this.lastGroupField[i]);
  				if (cidx >= 0)
  					this.cm.setHidden(cidx, false);
  			}
  			this.lastGroupField = groupField;
  			this.lgflen = groupField.length;
  			for (var i = 0, len = colIndexes.length; i < len; ++i) {
  				this.cm.setHidden(colIndexes[i], true);
  			}
  		}
  	}
  	return Ext.ux.MultiGroupingView.superclass.renderRows.apply(this, arguments);
  }



	/** This sets up the toolbar for the grid based on what is grouped
	* It also iterates over all the rows and figures out where each group should appeaer
	* The store at this point is already stored based on the groups.
	*/

  , doRender: function (cs, rs, ds, startRow, colCount, stripe) {
  	//console.debug ("MultiGroupingView.doRender: ",cs, rs, ds, startRow, colCount, stripe);
  	var drag_active = this.grid.store.drag;
  	var drop_active = this.grid.store.drop;
  	var showGroup = this.grid.store.showGroup;
  	var ss = this.grid.getTopToolbar();
  	if (rs.length < 1) {
  		return '';
  	}
  	if (this.grid.getBottomToolbar()) {

  		var rs1 = [];
  		if (rs.length > this.grid.getBottomToolbar().pageSize) {
  			for (var k = 0; k < this.grid.getBottomToolbar().pageSize; k++) { // Set record as per page size
  				rs1[k] = rs[k];
  			}
  			rs = rs1;
  		}
  	}
  	var groupField = this.getGroupField();
  	if (groupField && (!Ext.isIE && !Array.isArray(groupField))) {//---don't check isArray for IE
  		groupField = [groupField];
  	}
  	if (!drag_active & !drop_active & !showGroup & Ext.state.Manager.getProvider().state[this.grid.stateId]) {
  		groupField = Ext.state.Manager.getProvider().state[this.grid.stateId].groupFields;
  	}
  	var gfLen = groupField ? groupField.length : 0;
  	// Remove all entries already in the toolbar
  	for (var hh = 0; hh < ss.items.length - 1; hh++) {
  		var tb = ss.items.itemAt(hh);
  		var filedName = tb.fieldName;
  		var innerHTML = tb.el.innerHTML;
  		var text = tb.text;
  		for (var i = 0; i < gfLen; i++) {
  			if (filedName == groupField[i]) {
  				if (Ext.getDom(tb.id)) {
  					Ext.removeNode(Ext.getDom(tb.id));
  					var nextNode = Ext.getDom(ss.items.itemAt(hh + 1));
  					var previousNode = Ext.getDom(ss.items.itemAt(hh - 1));
  					if (nextNode.iconCls != 'help')
  						Ext.removeNode(nextNode.id);
  					if (previousNode.iconCls != 'help')
  						Ext.removeNode(previousNode.id);
  				}
  			}
  		}
  		if (innerHTML == 'Grouped By:') {
  			for (var mm = hh; mm < ss.items.length - 1; mm++) {//it will remove Grouped By fields after Grouped By:- 
  				var afterGroupedByNode = Ext.getDom(ss.items.itemAt(mm));
  				var tb = ss.items.itemAt(mm);
  				if (afterGroupedByNode.iconCls == 'help') {
  					break;
  				}
  				Ext.removeNode(Ext.getDom(tb.id));
  			}
  		}
  		if (innerHTML == this.grid.emptyToolbarText) {
  			Ext.removeNode(Ext.getDom(tb.id));
  		}
  	}
  	if (gfLen == 0) {
  		ss.insertButton(ss.items.length - 2, new Ext.Toolbar.TextItem(this.grid.emptyToolbarText));
  		for (var i = 0; i < ss.items.length; i++) {
  			if (typeof ss.items.items[i].getText == 'function') {
  				for (var j = 0; j < this.grid.colModel.config.length; j++) {
  					var field = this.grid.colModel.config[j].header;
  					if (field == ss.items.items[i].getText()) {
  						Ext.removeNode(Ext.getDom(ss.items.itemAt(i).id));
  					}
  				}
  			}
  		}
  	} else {
  		//console.debug("MultiGroupingView.doRender: Set width to",gfLen," Groups");
  		// Add back all entries to toolbar from GroupField[]
  		ss.insertButton(ss.items.length - 2, new Ext.Toolbar.TextItem("Grouped By:"));
  		for (var gfi = 0; gfi < gfLen; gfi++) {
  			var t = groupField[gfi];
  			if (gfi > 0)
  				ss.insertButton(ss.items.length - 2, new Ext.Toolbar.Separator());
  			var b = new Ext.Toolbar.Button({
  				text: this.cm.getColumnHeader(this.cm.findColumnIndex(t))
  			});
  			b.fieldName = t;
  			ss.insertButton(ss.items.length - 2, b);
  			//console.debug("MultiGroupingView.doRender: Added Group to Toolbar :",this,t,'=',b.text);
  		}
  	}

  	this.enableGrouping = !!groupField;
  	var len = rs.length;
  	if (this.grid.getBottomToolbar()) {
  		if (rs.length > this.grid.getBottomToolbar().pageSize) {
  			len = this.grid.getBottomToolbar().pageSize;  // Set length as per page size
  		}
  	}

  	if (!this.enableGrouping || this.isUpdating) {
  		return Ext.grid.GroupingView.superclass.doRender.apply(this, arguments);
  	}

  	var gstyle = 'width:' + this.getTotalWidth() + ';';
  	var gidPrefix = this.grid.getGridEl().id;
  	var groups = [], curGroup, i, len, gid;
  	var lastvalues = [];
  	var added = 0;
  	var currGroups = [];

  	// Loop through all rows in record set
  	for (var i = 0; i < len; i++) {
  		added = 0;
  		var rowIndex = startRow + i;
  		var r = rs[i];
  		var differ = 0;
  		var gvalue = [];
  		var fieldName;
  		var fieldLabel;
  		var grpFieldNames = [];
  		var grpFieldLabels = [];
  		var v;
  		var changed = 0;
  		var addGroup = [];
  		var emptyGroupText = '(None)';
  		for (var j = 0; j < gfLen; j++) {
  			fieldName = groupField[j];
  			fieldLabel = this.cm.getColumnHeader(this.cm.findColumnIndex(fieldName));
  			var colId = this.cm.getColumnId(this.cm.findColumnIndex(fieldName));
  			var col = this.cm.getColumnById(colId);
  			v = r.data[fieldName];
  			var type = r.fields.map[fieldName].type;
  			if (v && typeof (v) !== "string" && typeof (v) !== "int" && typeof (v) !== "number") {
  				v = v.format('m/d/y');
  			}
  			var displayValue = v;
  			if (type = "date") { //3352 when Date iS NULL
  				if (v == 0) {
  					v = emptyGroupText;
  					displayValue = emptyGroupText;
  				}
  			} else {
  				if (v == 0) {
  					v = 'Undefined';
  				}
  			}

  			//Using displayIndex if provided
  			if (col.displayIndex && col.displayIndex.length > 0) {
  				displayValue = r.data[col.displayIndex];

  				//If displayValue is blank use the actual value (example the ID)
  				if (!displayValue) {
  					displayValue = v;
  				}
  			}

  			if (v) {
  				if (i == 0) {
  					// First record always starts a new group
  					addGroup.push({ idx: j, dataIndex: fieldName, header: fieldLabel, value: v, displayValue: displayValue });
  					lastvalues[j] = v;
  				} else {
  					if ((typeof (v) == "object" && (lastvalues[j].toString() != v.toString())) || (typeof (v) != "object" && (lastvalues[j] != v))) {
  						// This record is not in same group as previous one
  						//console.debug("Row ",i," added group. Values differ: prev=",lastvalues[j]," curr=",v);
  						addGroup.push({ idx: j, dataIndex: fieldName, header: fieldLabel, value: v, displayValue: displayValue });
  						lastvalues[j] = v;
  						changed = 1;
  					} else {
  						if (gfLen - 1 == j && changed != 1) {
  							// This row is in all the same groups to the previous group
  							curGroup.rs.push(r);
  							//console.debug("Row ",i," added to current group");
  						} else if (changed == 1) {
  							// This group has changed because an earlier group changed.
  							addGroup.push({ idx: j, dataIndex: fieldName, header: fieldLabel, value: v, displayValue: displayValue });
  							//console.debug("Row ",i," added group. Higher level group change");
  						} else if (j < gfLen - 1) {
  							// This is a parent group, and this record is part of this parent so add it
  							if (currGroups[fieldName])
  								currGroups[fieldName].rs.push(r);
  							//else
  							//    console.error("Missing on row ",i," current group for ",fieldName);
  						}
  					}
  				}
  			} else {
  				if (this.displayEmptyFields) {
  					addGroup.push({ idx: j, dataIndex: fieldName, header: fieldLabel, value: this.emptyGroupText || '(none)', displayValue: displayValue });
  				}
  			}
  		} //for j
  		//if(addGroup.length>0) console.debug("Added groups for row=",i,", Groups=",addGroup);
  		for (var k = 0; k < addGroup.length; k++) {
  			var grp = addGroup[k];
  			if (grp.value == null) {
  				grp.value == '';
  			}
  			gid = gidPrefix + '-gp-' + grp.dataIndex + '-' + Ext.util.Format.htmlEncode(grp.value);

  			// if state is defined use it, however state is in terms of expanded
  			// so negate it, otherwise use the default.
  			var isCollapsed = typeof this.state[gid] !== 'undefined' ? !this.state[gid] : this.startCollapsed;
  			var gcls = isCollapsed ? 'x-grid-group-collapsed' : '';
  			var rndr = this.cm.config[this.cm.findColumnIndex(grp.dataIndex)].renderer;
  			curGroup = {
  				group: rndr ? grp.displayValue : grp.displayValue
           , groupName: grp.dataIndex
           , gvalue: grp.value
           , text: grp.header
           , groupId: gid
           , startRow: rowIndex
           , rs: [r]
           , cls: gcls
           , style: gstyle + 'padding-left:' + (grp.idx * 12) + 'px;'
  			};
  			currGroups[grp.dataIndex] = curGroup;
  			groups.push(curGroup);

  			r._groupId = gid; // Associate this row to a group
  		} //for k
  	} //for i
  	// Flag the last groups as incomplete if more rows are available
  	//NOTE: this works if the associated store is a MultiGroupingPagingStore!
  	for (var gfi = 0; gfi < gfLen; gfi++) {
  		var c = currGroups[groupField[gfi]];
  		if (this.grid.store.nextKey) c.incomplete = true;
  		//console.debug("Final Groups are...",c);
  	}
  	var buf = [];
  	var toEnd = 0;
  	for (var ilen = 0, len = groups.length; ilen < len; ilen++) {
  		toEnd++;
  		var g = groups[ilen];
  		var leaf = g.groupName == groupField[gfLen - 1]
  		this.doMultiGroupStart(buf, g, cs, ds, colCount);
  		if (g.rs.length != 0 && leaf)
  			buf[buf.length] = Ext.grid.GroupingView.superclass.doRender.call(this, cs, g.rs, ds, g.startRow, colCount, stripe);

  		if (leaf) {
  			var jj;
  			var gg = groups[ilen + 1];
  			if (gg != null) {
  				for (jj = 0; jj < groupField.length; jj++) {
  					if (gg.groupName == groupField[jj])
  						break;
  				}
  				toEnd = groupField.length - jj;
  			}
  			for (var k = 0; k < toEnd; k++) {
  				this.doMultiGroupEnd(buf, g, cs, ds, colCount);
  			}
  			toEnd = jj;
  		}
  	}
  	// Clear cache as rows have just been generated, so old cache must be invalid
  	if (this.rowsCache) delete this.rowsCache;
  	return buf.join('');
  }

	/** Initialize new templates */
  , initTemplates: function () {
  	Ext.ux.MultiGroupingView.superclass.initTemplates.call(this);

  	if (!this.startMultiGroup) {
  		this.startMultiGroup = new Ext.XTemplate('<div id="{groupId}" class="x-grid-group {cls}">', '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div>', this.groupTextTpl, '</div></div>', '<div id="{groupId}-bd" class="x-grid-group-body">',
		{

			countTotal: function (options) {
				options.groupTotals = true;
				return this.totals(options);
			},
			recordTotal: function (options) {
				return this.totals(options);
			},
			formatDateValue: function (value) {
				value = new Date(value.replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d\d)$/, '$4:$5:$6 $2/$3/$1'));
				return value.getTime();
			},
			totals: function (options) {
				var length = 0;
				length = options.records.length;
				if (options.records.totals) {
					length = options.records.totals.length;
				}
				var opTotals = options.records.totals, opRecords = options.records, opGroup = options.records.group, opFirstGroup = options.records.firstgroup, opTotalsLen = length, col = options.columnName, isForGroupTotals = options.groupTotals, groupTotals, recordCount, totals = 0, totalcount = 0, isMainGroupTotals = false;
				if (opTotals) {
					for (i = 0; i < opTotalsLen; i++) {
						recordCount = opTotals[i].GroupRecords;
						groupTotals = opTotals[i][col];
						//-----------when  group by is applied on date fields, correct format of dates make them same, using time formate to compare fields
						var opRecord = opRecords[0], groupField = opRecord.fields.get(opGroup), groupFieldValue = opRecord.get(opGroup);
						firstGroupField = opRecord.fields.get(opFirstGroup), firstGroupFieldValue = opRecord.get(opFirstGroup);
						var opTotalGroupValue = opTotals[i][opGroup], opTotalFirstGroupValue = opTotals[i][opFirstGroup];
						if (groupField && groupField.type && groupField.type === 'date') {
							groupFieldValue = groupFieldValue ? groupFieldValue.getTime() : '';
							opTotalGroupValue = opTotalGroupValue ? this.formatDateValue(opTotalGroupValue) : '';
						}
						if (firstGroupField && firstGroupField.type && firstGroupField.type === 'date') {
							firstGroupFieldValue = firstGroupFieldValue ? firstGroupFieldValue.getTime() : '';
							opTotalFirstGroupValue = opTotalFirstGroupValue ? this.formatDateValue(opTotalFirstGroupValue) : '';
						}
						if ((groupFieldValue == opTotalGroupValue)) {
						if ((groupFieldValue == opTotalGroupValue) || (Ext.isEmpty(groupFieldValue) && Ext.isEmpty(opTotalGroupValue))) {
							if (groupFieldValue == opTotalFirstGroupValue || (Ext.isEmpty(groupFieldValue) && Ext.isEmpty(opTotalFirstGroupValue))) { //First Groups level
								if (isForGroupTotals) { // For Group Totals
									if (options.avg) {
										totals = opTotals[i][col + 'Totals'] + totals;
										totalcount = opTotals[i].TotalCount__ + totalcount;
										isMainGroupTotals = true;
									}
									else {
										if (typeof opTotals[i][col] == "string") {
											if (groupTotals.length == 0) {
												groupTotals = 'N/A';
											}
											totals = groupTotals;
										} else {
											totals = groupTotals + totals;
										}
									}
								}
								else { // For Record Count
									totals = recordCount + totals;
								}
							}
							else if ((groupFieldValue == opTotalGroupValue) && (firstGroupFieldValue == opTotalFirstGroupValue)) { //Next Groups level
								if (isForGroupTotals) {
									totals = groupTotals;
								}
								else {
									totals = recordCount;
								}
							}
						}
					}
				}
				if (isMainGroupTotals && options.avg) {
					totals = (totals / totalcount) * 100;
				}
				return totals;
			}
		}
		});
  	}
  	this.startMultiGroup.compile();
  	this.endMultiGroup = '</div></div>';
  }

	/** Private - Selects a custom group template if one has been defined
	*/
  , doMultiGroupStart: function (buf, g, cs, ds, colCount) {
  	var groupName = g.groupName, tpl = null;

  	if (this.groupFieldTemplates) {
  		tpl = this.groupFieldTemplates[groupName];
  		if (tpl && typeof (tpl) == 'string') {
  			tpl = new Ext.XTemplate('<div id="{groupId}" class="x-grid-group {cls}">', '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div>', tpl, '</div></div>', '<div id="{groupId}-bd" class="x-grid-group-body">');
  			tpl.compile();
  			this.groupFieldTemplates[groupName] = tpl;
  		}
  	}

  	g.rs.totals = this.grid.store.reader.jsonData.GroupTotals;
  	g.rs.firstgroup = this.grid.store.groupField[0];
  	g.rs.group = g.groupName;
  	if (tpl)
  		buf[buf.length] = tpl.apply(g);
  	else
  		buf[buf.length] = this.startMultiGroup.apply(g);
  }

  , doMultiGroupEnd: function (buf, g, cs, ds, colCount) {
  	buf[buf.length] = this.endMultiGroup;
  }

	/** Should return an array of all elements that represent a row, it should bypass
	*  all grouping sections
	*/
  , getRows: function () {
  	var r = [];
  	// This function is called may times, so use a cache if it is available
  	if (this.rowsCache) {
  		r = this.rowsCache;
  		//console.debug('View.getRows: cached');
  	} else {
  		//console.debug('View.getRows: calculate');
  		if (!this.enableGrouping) {
  			r = Ext.grid.GroupingView.superclass.getRows.call(this);
  		} else {
  			var groupField = this.getGroupField();
  			var g, gs = this.getGroups();
  			// this.getGroups() contains an array of DIVS for the top level groups
  			//console.debug("Get Rows", groupField, gs);

  			if (groupField && groupField.length > 0) {
  				r = this.getRowsFromGroup(r, gs, groupField[groupField.length - 1]);
  			}
  		}
  		// Clone the array, but not the objects in it
  		if (r.length >= 0) {
  			// Don't cache if there is nothing there, as this happens during a refresh
  			// TODO comment this to disble caching, incase of problems
  			this.rowsCache = r;
  		} // else   
  		//console.debug("No Rows to Cache!");
  	}
  	//console.debug("View.getRows: Found ", r.length, " rows",r[0]);
  	//console.trace();
  	return r;
  }


	/** Return array of records under a given group
	* @param r Record array to append to in the returned object
	* @param gs Grouping Sections, an array of DIV element that represent a set of grouped records
	* @param lsField The name of the grouping section we want to count
	*/
  , getRowsFromGroup: function (r, gs, lsField) {
  	var rx = new RegExp(".*-gp-" + lsField + "-.*");
  	// Loop over each section
  	for (var i = 0, len = gs.length; i < len; i++) {
  		// Get group name for this section
  		var groupName = gs[i].id;
  		if (rx.test(groupName)) {
  			//console.debug(groupName, " matched ", lsField);
  			g = gs[i].childNodes[1].childNodes;
  			for (var j = 0, jlen = g.length; j < jlen; j++) {
  				r[r.length] = g[j];
  			}
  			//console.debug("Found " + g.length + " rows for group " + lsField);
  		} else {
  			if (!gs[i].childNodes[1]) {
  				//console.error("Can't get rowcount for field ", lsField, " from ", gs, i);
  			} else
  			// if its an interim level, each group needs to be traversed as well
  				r = this.getRowsFromGroup(r, gs[i].childNodes[1].childNodes, lsField);
  		}
  	}
  	return r;
  }
	/** Override the onLoad, as it always scrolls to the top, we only
	*  want to do this for an initial load or reload. There is a new event registered in 
	*  the constructor to do this     
	*/
   , onLoad: function () { }
});

Ext.ux.MultiGroupingPanelEditor = function (config) {
	config = config || {};
	config.tbar = new Ext.Toolbar({ id: 'grid-tbr' });
	Ext.ux.MultiGroupingPanelEditor.superclass.constructor.call(this, config);
};

Ext.extend(Ext.ux.MultiGroupingPanelEditor, Ext.grid.GridPanel, {
	isEditor: true,
	detectEdit: false,
	autoEncode: false,
	trackMouseOver: false,
	initComponent: function () {
		Ext.ux.MultiGroupingPanelEditor.superclass.initComponent.call(this);
		if (!this.selModel) {
			this.selModel = new Ext.grid.CellSelectionModel()
		}
		this.activeEditor = null;
		this.addEvents("beforeedit", "afteredit", "validateedit")
	}
    , initEvents: function () {
    	Ext.ux.MultiGroupingPanelEditor.superclass.initEvents.call(this);
    	this.on("bodyscroll", this.stopEditing, this, [true]);
    	if (this.clicksToEdit == 1) {
    		this.on("cellclick", this.onCellDblClick, this)
    	}
    	else {
    		if (this.clicksToEdit == "auto" && this.view.mainBody) { this.view.mainBody.on("mousedown", this.onAutoEditClick, this) }
    		this.on("celldblclick", this.onCellDblClick, this)
    	} this.getGridEl().addClass("xedit-grid")
    }
    , onCellDblClick: function (B, C, A) { this.startEditing(C, A) }
    , onAutoEditClick: function (C, B) {
    	if (C.button !== 0) { return }
    	var E = this.view.findRowIndex(B);
    	var A = this.view.findCellIndex(B);
    	if (E !== false && A !== false) {
    		this.stopEditing();
    		if (this.selModel.getSelectedCell) {
    			var D = this.selModel.getSelectedCell();
    			if (D && D.cell[0] === E && D.cell[1] === A) { this.startEditing(E, A) }
    		}
    		else { if (this.selModel.isSelected(E)) { this.startEditing(E, A) } }
    	}
    }
    , onEditComplete: function (B, D, A) {
    	this.editing = false;
    	this.activeEditor = null;
    	B.un("specialkey", this.selModel.onEditorKey, this.selModel);
    	var C = B.record; var F = this.colModel.getDataIndex(B.col);
    	D = this.postEditValue(D, A, C, F);
    	if (String(D) !== String(A)) {
    		var E = { grid: this, record: C, field: F, originalValue: A, value: D, row: B.row, column: B.col, cancel: false };
    		if (this.fireEvent("validateedit", E) !== false && !E.cancel) { C.set(F, E.value); delete E.cancel; this.fireEvent("afteredit", E) }
    	}
    	this.view.focusCell(B.row, B.col)
    }
    , startEditing: function (F, B) {
    	this.stopEditing();
    	if (this.colModel.isCellEditable(B, F)) {
    		this.view.ensureVisible(F, B, true);
    		var C = this.store.getAt(F);
    		var E = this.colModel.getDataIndex(B);
    		var D = { grid: this, record: C, field: E, value: C.data[E], row: F, column: B, cancel: false };
    		if (this.fireEvent("beforeedit", D) !== false && !D.cancel) {
    			this.editing = true; var A = this.colModel.getCellEditor(B, F); if (!A.rendered) { A.render(this.view.getEditorParent(A)) }
    			(function () { A.row = F; A.col = B; A.record = C; A.on("complete", this.onEditComplete, this, { single: true }); A.on("specialkey", this.selModel.onEditorKey, this.selModel); this.activeEditor = A; var G = this.preEditValue(C, E); A.startEdit(this.view.getCell(F, B), G) }).defer(50, this)
    		}
    	}
    }
    , preEditValue: function (A, B) { return this.autoEncode && typeof value == "string" ? Ext.util.Format.htmlDecode(A.data[B]) : A.data[B] }
    , postEditValue: function (C, A, B, D) { return this.autoEncode && typeof C == "string" ? Ext.util.Format.htmlEncode(C) : C }
    , stopEditing: function (A) { if (this.activeEditor) { this.activeEditor[A === true ? "cancelEdit" : "completeEdit"]() } this.activeEditor = null }
    , setUpDragging: function () {
    	this.dragZone = new Ext.dd.DragZone(this.getTopToolbar().getEl(), {
    		ddGroup: "grid-body"
           , panel: this
           , scroll: false
           , onInitDrag: function (e) {
           	var clone = this.dragData.ddel;
           	clone.id = Ext.id('ven');
           	this.proxy.update(clone);
           	return true;
           }
           , getDragData: function (e) {
           	var target = Ext.get(e.getTarget().id);
           	if (target.hasClass('x-toolbar x-small-editor')) { return false; }
           	d = e.getTarget().cloneNode(true);
           	d.id = Ext.id();
           	this.dragData = {
           		repairXY: Ext.fly(target).getXY(),
           		ddel: d,
           		btn: e.getTarget()
           	};
           	return this.dragData;
           }
           , getRepairXY: function () { return this.dragData.repairXY; }
    	});
    	this.dropTarget2s = new Ext.dd.DropTarget('grid-tbr', {
    		ddGroup: "gridHeader" + this.getGridEl().id
           , panel: this
           , notifyDrop: function (dd, e, data) {
           	var btname = this.panel.getColumnModel().getDataIndex(this.panel.getView().getCellIndex(data.header));
           	this.panel.store.groupBy(btname);
           	return true;
           }
    	});
    	this.dropTarget22s = new Ext.dd.DropTarget(this.getView().el.dom.childNodes[0].childNodes[1], {
    		ddGroup: "grid-body"
           , panel: this
           , notifyDrop: function (dd, e, data) {
           	var txt = Ext.get(data.btn).dom.innerHTML;
           	var tb = this.panel.getTopToolbar();
           	var bidx = tb.items.findIndexBy(function (b) {
           		return b.text == txt;
           	}, this);
           	if (bidx < 0) return;
           	var fld = tb.items.get(bidx).fieldName;
           	Ext.removeNode(Ext.getDom(tb.items.get(bidx).id));
           	if (bidx > 0) Ext.removeNode(Ext.getDom(tb.items.get(bidx - 1).id)); ;
           	var cidx = this.panel.view.cm.findColumnIndex(fld);
           	if (cidx < 0) { }
           	this.panel.view.cm.setHidden(cidx, false);
           	var temp = [];
           	for (var i = this.panel.store.groupField.length - 1; i >= 0; i--) {
           		if (this.panel.store.groupField[i] == fld) {
           			this.panel.store.groupField.pop();
           			break;
           		}
           		temp.push(this.panel.store.groupField[i]);
           		this.panel.store.groupField.pop();
           	}
           	for (var i = temp.length - 1; i >= 0; i--) { this.panel.store.groupField.push(temp[i]); }
           	if (this.panel.store.groupField.length == 0) { this.panel.store.groupField = false; }
           	this.panel.store.fireEvent('datachanged', this);
           	return true;
           }
    	});
    }
});
Ext.reg("editorgrid", Ext.ux.MultiGroupingPanelEditor);

Ext.ux.MultiGroupingPanel = function (config) {
	config = config || {};
	config.tbar = new Ext.Toolbar({ id: 'grid-tbr' });
	Ext.ux.MultiGroupingPanel.superclass.constructor.call(this, config);
};

Ext.extend(Ext.ux.MultiGroupingPanel, Ext.grid.GridPanel, {
	initComponent: function () {
		Ext.ux.MultiGroupingPanel.superclass.initComponent.call(this);
		this.on("render", this.setUpDragging, this);
	}
    , setUpDragging: function () {
    	this.dragZone = new Ext.dd.DragZone(this.getTopToolbar().getEl(), {
    		ddGroup: "grid-body"
           , panel: this
           , scroll: false
           , onInitDrag: function (e) {
           	var clone = this.dragData.ddel;
           	clone.id = Ext.id('ven');
           	this.proxy.update(clone);
           	return true;
           }
           , getDragData: function (e) {
           	var target = Ext.get(e.getTarget().id);
           	if (target.hasClass('x-toolbar x-small-editor')) {
           		return false;
           	}
           	d = e.getTarget().cloneNode(true);
           	d.id = Ext.id();
           	this.dragData = {
           		repairXY: Ext.fly(target).getXY(),
           		ddel: d,
           		btn: e.getTarget()
           	};
           	return this.dragData;
           }
           , getRepairXY: function () { return this.dragData.repairXY; }
    	});
    	this.dropTarget2s = new Ext.dd.DropTarget('grid-tbr', {
    		ddGroup: "gridHeader" + this.getGridEl().id
           , panel: this
           , notifyDrop: function (dd, e, data) {
           	var btname = this.panel.getColumnModel().getDataIndex(this.panel.getView().getCellIndex(data.header));
           	this.panel.store.groupBy(btname);
           	return true;
           }
    	});
    	this.dropTarget22s = new Ext.dd.DropTarget(this.getView().el.dom.childNodes[0].childNodes[1], {
    		ddGroup: "grid-body"
           , panel: this
           , notifyDrop: function (dd, e, data) {
           	var txt = Ext.get(data.btn).dom.innerHTML;
           	var tb = this.panel.getTopToolbar();
           	var bidx = tb.items.findIndexBy(function (b) {
           		return b.text == txt;
           	}, this);
           	if (bidx < 0) return;
           	var fld = tb.items.get(bidx).fieldName;
           	Ext.removeNode(Ext.getDom(tb.items.get(bidx).id));
           	if (bidx > 0) Ext.removeNode(Ext.getDom(tb.items.get(bidx - 1).id)); ;
           	var cidx = this.panel.view.cm.findColumnIndex(fld);
           	if (cidx < 0) { }
           	this.panel.view.cm.setHidden(cidx, false);
           	var temp = [];
           	for (var i = this.panel.store.groupField.length - 1; i >= 0; i--) {
           		if (this.panel.store.groupField[i] == fld) {
           			this.panel.store.groupField.pop();
           			break;
           		}
           		temp.push(this.panel.store.groupField[i]);
           		this.panel.store.groupField.pop();
           	}
           	for (var i = temp.length - 1; i >= 0; i--) { this.panel.store.groupField.push(temp[i]); }
           	if (this.panel.store.groupField.length == 0) { this.panel.store.groupField = false; }

           	this.panel.store.fireEvent('datachanged', this);
           	return true;
           }
    	});
    }
});
Ext.ux.MultiGroupingGrid = function (config) {
	config = config || {};
	// Cache the orignal column model, before state is applied
	/*if (config.cm)
	this.origColModel = Ext.ux.clone(config.cm.config);
	else if (config.colModel)
	this.origColModel = Ext.ux.clone(config.colModel.config);
	*/

	this.origColModel = config.cm.config;
	var tbar = [{
		xtype: 'tbtext'
      , text: this.emptyToolbarText
	}, {
		xtype: 'tbfill'
      , noDelete: true
	}/*, {
		xtype: 'tbbutton'
      , text: 'Options'
      , noDelete: true
      , menu: {
      	items: [{
      		text: 'Restore Default Columns',
      		scope: this,
      		disabled: !this.origColModel,
      		handler: function () {
      			this.getColumnModel().setConfig(this.origColModel, false);
      			this.saveState();
      			return true;
      		}
      	}, {
      		text: 'Show Group Columns'
          , checked: !config.view.hideGroupedColumn
          , scope: this
          , checkHandler: function (item, checked) {
          	this.view.hideGroupedColumn = !checked;
          	this.view.refresh(true);
          }
      	}, {
      		text: 'Clear Filters' // Labels.get('label.jaffa.jaffaRIA.jaffa.finder.grid.deactivateFilters')
          , scope: this
          , handler: function () {
          	//todo use the clearFilters() method!
          	config.plugins.filter().each(function (flt) {
          		flt.setActive(false);
          	});
          }
      	}]
      }
	}*/];
	if (config.tbar == 'undefined') {
		config.tbar = [];
	}
	if (config.groupField.length > 0) {
		tbar.remove(tbar[0]);
	}
	for (var i = 0; i < tbar.length; i++) {
		config.tbar.push(tbar[i]);
	}
	Ext.ux.MultiGroupingGrid.superclass.constructor.call(this, config);
	//console.debug("Create MultiGroupingGrid",config);
};
Ext.reg('multiGroupingGrid', Ext.ux.MultiGroupingGrid);

//Ext.extend(Ext.ux.MultiGroupingGrid, Ext.grid.GridPanel, {
//modified by jesus, extend a  Ext.grid.EditorGridPanel class
Ext.extend(Ext.ux.MultiGroupingGrid, Ext.grid.GridPanel, {


	initComponent: function () {
		//console.debug("MultiGroupingGrid.initComponent",this);
		Ext.ux.MultiGroupingGrid.superclass.initComponent.call(this);
		// Initialise DragZone
		this.on("render", this.setUpDragging, this);
	}

	/** @cfg emptyToolbarText String to display on tool bar when there are no groups
	*/
  , emptyToolbarText: "Drop Columns Here To Group"
	/** Extend basic version so the Grouping Columns State is remebered
	*/
  , getState: function () {
  	var s = Ext.ux.MultiGroupingGrid.superclass.getState.call(this);
  	s.groupFields = this.store.getGroupState();
  	return s;
  }

	/** Extend basic version so the Grouping Columns State is applied
	*/
  , applyState: function (state) {
  	Ext.ux.MultiGroupingGrid.superclass.applyState.call(this, state);
  	if (state.groupFields) {
  		this.store.groupBy(state.groupFields, true);
  		//console.debug("Grid.applyState: Groups=", state.groupFields);
  	}
  }
  , setUpDragging: function () {
  	//console.debug("SetUpDragging", this);
  	this.dragZone = new Ext.dd.DragZone(this.getTopToolbar().getEl(), {
  		ddGroup: "grid-body" + this.getGridEl().id //FIXME - does this need to be unique to support multiple independant panels on the same page
      , panel: this
      , scroll: false
  		// todo - docs
      , onInitDrag: function (e) {
      	// alert('init');
      	var clone = this.dragData.ddel;
      	clone.id = Ext.id('ven'); //FIXME??
      	// clone.class='x-btn button';
      	this.proxy.update(clone);
      	return true;
      }

  		// todo - docs
      , getDragData: function (e) {
      	var target = Ext.get(e.getTarget().id);
      	//console.debug("DragZone: ",e,target);
      	if (!target || target.hasClass('x-toolbar x-small-editor')) {
      		return false;
      	}

      	d = e.getTarget().cloneNode(true);
      	d.id = Ext.id();

      	this.dragData = {
      		repairXY: Ext.fly(target).getXY(),
      		ddel: d,
      		btn: e.getTarget()
      	};
      	return this.dragData;
      }

  		//Provide coordinates for the proxy to slide back to on failed drag.
  		//This is the original XY coordinates of the draggable element.
      , getRepairXY: function () {
      	return this.dragData.repairXY;
      }
  	});

  	// This is the target when columns are dropped onto the toolbar (ie added to the group)
  	this.dropTarget2s = new Ext.dd.DropTarget(this.getTopToolbar().getEl(), {
  		ddGroup: "gridHeader" + this.getGridEl().id
      , panel: this
      , notifyDrop: function (dd, e, data) {
      	var check = this.panel.getColumnModel().config[this.panel.getView().getCellIndex(data.header)];
      	var isReturn = false;
      	var dataIndex = check.dataIndex;
      	if (check.displayIndex) {
      		dataIndex = check.displayIndex;
      	}
      	if (this.panel.getState().sort && this.panel.getState().sort.field == dataIndex) {
      		isReturn = true;
      	}
      	if (this.panel.getState().sort && this.panel.getState().sort.sorters) {
      		for (var i = 0; i < this.panel.getState().sort.sorters.length; i++) {
      			if (this.panel.getState().sort.sorters[i].field == dataIndex) {
      				isReturn = true;
      			}
      		}
      	}
      	if (check && !check.summaryType && !isReturn) {

      		var btname;
      		btname = this.panel.getColumnModel().getDataIndex(this.panel.getView().getCellIndex(data.header));
      		this.panel.store.groupBy(btname);
      		this.panel.store.drag = true;
      		this.panel.view.columnDrop.proxyBottom.hide();
      		this.panel.view.columnDrop.proxyTop.hide()
      		return true;
      	}
      	else {
      		this.panel.view.columnDrop.proxyBottom.hide();
      		this.panel.view.columnDrop.proxyTop.hide()
      		return false;
      	}
      }
       , notifyOver: function (dd, e, data) {
       	var check = this.panel.getColumnModel().config[this.panel.getView().getCellIndex(data.header)];
       	var isReturn = false;
       	var dataIndex = check.dataIndex;
       	if (check.displayIndex) {
       		dataIndex = check.displayIndex;
       	}
       	if (this.panel.getState().sort && this.panel.getState().sort.field == dataIndex) {
       		Ext.Msg.alert('Alert', 'Remove the sort before you drag this column');
       		isReturn = true;
       		return this.dropNotAllowed;
       	}
       	if (this.panel.getState().sort && this.panel.getState().sort.sorters) {
       		for (var i = 0; i < this.panel.getState().sort.sorters.length; i++) {
       			if (this.panel.getState().sort.sorters[i].field == dataIndex) {
       				Ext.Msg.alert('Alert', 'Remove the sort before you drag this column');
       				isReturn = true;
       				return this.dropNotAllowed;
       			}
       		}
       	}
       	if (check && !check.summaryType && !isReturn) {
       		return this.dropAllowed;
       	}
       	else {
       		return this.dropNotAllowed;
       	}
       }
  	});

  	// This is the target when columns are dropped onto the grid (ie removed from the group)
  	this.dropTarget22s = new Ext.dd.DropTarget(this.getView().el.dom.childNodes[0].childNodes[1], {
  		ddGroup: "grid-body" + this.getGridEl().id  //FIXME - does this need to be unique to support multiple independant panels on the same page
      , panel: this
      , notifyDrop: function (dd, e, data) {
      	var txt = Ext.get(data.btn).dom.innerHTML;
      	var tb = this.panel.getTopToolbar();

      	var bidx = tb.items.findIndexBy(function (b) {
      		return b.text == txt;
      	}, this);

      	if (bidx < 0) return; // Error!
      	var fld = tb.items.get(bidx).fieldName;
      	// Remove from toolbar
      	if (!Ext.getDom(tb.items.get(bidx).id)) {
      		Ext.removeNode(Ext.getDom(data.btn.id));
      		Ext.removeNode(Ext.getDom(tb.items.get(bidx + 1).id));
      	}
      	else {
      		Ext.removeNode(Ext.getDom(tb.items.get(bidx).id));
      	}
      	if (bidx > 0) Ext.removeNode(Ext.getDom(tb.items.get(bidx - 1).id)); ;


      	//console.dir(button);
      	var cidx = this.panel.view.cm.findColumnIndex(fld);



      	this.panel.view.cm.setHidden(cidx, false);

      	//Ext.removeNode(Ext.getDom(data.btn.id));

      	// Remove this group from the groupField array
      	// todo - replace with method on store
      	// this.panel.store.removeGroupField(fld);
      	var temp = [];
      	for (var i = this.panel.store.groupField.length - 1; i >= 0; i--) {
      		if (this.panel.store.groupField[i] == fld) {
      			this.panel.store.groupField.pop();
      			this.panel.store.drop = true;
      			break;
      		}
      		temp.push(this.panel.store.groupField[i]);
      		this.panel.store.groupField.pop();
      	}

      	for (var i = temp.length - 1; i >= 0; i--) {
      		this.panel.store.groupField.push(temp[i]);
      	}

      	if (this.panel.store.groupField.length == 0) {
      		this.panel.store.groupField = false;
      		delete this.panel.store.baseParams.multiGroupBy;
      	}
      	if (this.panel.store.groupField.length > 0) {
      		this.panel.store.baseParams.multiGroupBy = this.panel.store.groupField;
      	}
      	this.panel.store.load();
      	this.panel.store.fireEvent('datachanged', this);
      	return true;
      }
  	});
  }

  , buildFilters: function (columns, record) {
  	//console.debug("Grid.buildFilters: Created Filters from ", columns, record);
  	var config = [];
  	for (var i = 0; i < columns.length; i++) {
  		var col = columns[i];
  		var meta = record.getField(col.dataIndex);
  		//console.debug("Meta Data For ", col.dataIndex, meta)
  		if (meta && (meta.filter || meta.filterFieldName)) {
  			var dt = meta.dataType || 'string';
  			if (dt == 'int' || dt == 'long' || dt == 'float' || dt == 'double')
  				dt = 'numeric';
  			else if (dt == 'dateonly' || dt == 'datetime')
  				dt = 'date';
  			//FIXME pass caseType on this filter definition, so it can be applied to the filter field  
  			var f = { dataIndex: col.dataIndex, type: dt, paramName: col.filterFieldName };
  			config[config.length] = f;
  		}
  	}
  	//console.debug("Grid.buildFilters: Created Filters for ", config);
  	if (config.length == 0)
  		return null;
  	else
  		return new Ext.ux.grid.GridFilters({ filters: config, local: false });
  }

  , buildColumnModel: function (columns, record) {
  	var config = [];
  	for (var i = 0; i < columns.length; i++) {
  		var col = columns[i];
  		var meta = record.getField(col.dataIndex);
  		var cm = Ext.apply({}, col);
  		if (meta) {
  			// Apply stuff from the Record's Meta Data
  			if (!cm.hidden && meta.hidden == true) cm.hidden = true;
  			if (!cm.header && meta.label) cm.header = meta.label;
  			if (!cm.renderer && meta.renderer) cm.renderer = meta.renderer;
  			cm.sortable = (meta.sortable === true || (meta.sortFieldName && meta.sortFieldName != ''));

  			// Apply more metadata from associated ClassMetaData
  			var mc = meta.metaClass || record.defaultMetaClass;
  			var mfn = (meta.mapping || col.dataIndex).match(/.*\b(\w+)$/)[1];
  			var mf = ClassMetaData[mc] ? ClassMetaData[mc].fields[mfn] : undefined;
  			if (!mf) mf = ClassMetaData[mc] ? ClassMetaData[mc].fields[col.dataIndex] : undefined;
  			//console.debug("Meta Class=", mc, ClassMetaData[mc], ', dataIndex=', col.dataIndex, ', mapping=', meta.mapping, ', mfn=', mfn, ', mf=', mf, ', meta=', meta);
  			if (mf) {
  				// Default the header text
  				if (!cm.header && mf.label) cm.header = mf.label;
  				// Default the column width
  				if (!cm.width) {
  					if (mf.maxLength) cm.width = Math.min(Math.max(mf.maxLength, 5), 40) * 8;
  					else if (mf.type) {
  						if (mf.type == 'dateonly') cm.width = 100;
  						else if (mf.type == 'datetime') cm.width = 140;
  						else if (mf.type == 'boolean') cm.width = 50;
  					}
  				}
  				// Default the alignment
  				if (!cm.align && mf.type && (mf.type == 'float' || mf.type == 'int'))
  					cm.align = 'right';
  				// Default standard renderers  
  				if (!cm.renderer && mf.type) {
  					if (mf.type == 'dateonly') cm.renderer = Ext.util.Format.dateRenderer();
  					else if (mf.type == 'datetime') cm.renderer = Ext.util.Format.dateTimeRenderer();
  				}
  				if (mf.hidden == true) cm.hidden = true;
  			}
  		}
  		if (!cm.header) cm.header = col.dataIndex;
  		cm.groupable = (cm.groupable == true || cm.sortable == true);
  		config[config.length] = cm;
  		//console.debug("Grid.buildColumnModel: Width", cm.dataIndex, cm.width);

  	}
  	//console.debug("Grid.buildColumnModel: Created Columns for ", config);
  	return new Ext.grid.ColumnModel(config);
  }
});

Ext.ux.MultiGroupingPagingGrid = Ext.extend(Ext.ux.MultiGroupingGrid, {

	/** When creating the store, register an internal callback for post load processing
	*/
	constructor: function (config) {
		config = config || {};
		config.bbar = [].concat(config.bbar);
		config.bbar = config.bbar.concat([
        { xtype: 'tbfill' }
       , { xtype: 'tbtext', id: 'counter', text: '? of ?' }
       , { xtype: 'tbspacer' }
       , { xtype: 'tbbutton', id: 'loading', hidden: true, iconCls: "x-tbar-loading" }
       , { xtype: 'tbseparator' }
       , { xtype: 'tbbutton', id: 'more', text: '>>', handler: function () { this.store.loadMore(false); }, scope: this }
      ]);

		Ext.ux.MultiGroupingPagingGrid.superclass.constructor.apply(this, arguments);

		// Create Event that asks for more data when we scroll to the end
		this.on("bodyscroll", function () {
			var s = this.view.scroller.dom;
			if ((s.offsetHeight + s.scrollTop + 5 > s.scrollHeight) && !this.isLoading) {
				//console.debug("Grid.on.bodyscroll: Get more...");
				this.store.loadMore(false);
			}
		}, this);

		// When the grid start loading, display a loading icon    
		this.store.on("beforeload", function (store, o) {
			if (this.isLoading) {
				//console.debug("Store.on.beforeload: Reject Load, one is in progress");
				return false;
			}
			this.isLoading = true;
			if (this.rendered) {
				this.barLoading.show();
			}
			//console.debug("Store.on.beforeload: options=",o, this);
			return true;
		}, this);

		// When loading has finished, disable the loading icon, and update the row count  
		this.store.on("load", function () {
			delete this.isLoading;
			if (this.rendered) {
				this.barLoading.hide();
				//console.debug("Store.on.load: Finished loading.. ",this.store.totalCount);
				this.barCounter.getEl().innerHTML = "Showing " + this.store.getCount() + ' of ' +
                (this.store.totalCount ? this.store.totalCount : '?');
				if (this.store.totalCount)
					this.barMore.disable();
				else
					this.barMore.enable();
			}
			return true;
		}, this);

		// When a loading error occurs, disable the loading icon and display error  
		this.store.on("loadexception", function (store, e) {
			//console.debug("Store.loadexception.Event:",arguments);
			delete this.isLoading;
			if (this.rendered) {
				this.barLoading.hide();
			}
			if (e)
				Ext.Msg.show({
					title: 'Show Details',
					msg: "Error cargando registros - " + e,
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
			return false;
		}, this);

		// As the default onLoad to refocus on the first row has been disabled,
		// This has been added so if a load does happen, and its an initial load
		// it refocuses. If this is a refresh caused by a sort/group or a new page
		// of data being loaded, it does not refocus  
		this.store.on("load", function (r, o) {
			if (o && o.initial == true)
				Ext.ux.MultiGroupingView.superclass.onLoad.call(this);
		}, this.view);
	}

	// private
   , onRender: function (ct, position) {
   	Ext.ux.MultiGroupingPagingGrid.superclass.onRender.call(this, ct, position);
   	var bb = this.getBottomToolbar();
   	this.barCounter = bb.items.itemAt(bb.items.length - 5);
   	this.barMore = bb.items.itemAt(bb.items.length - 1);
   	this.barLoading = bb.items.itemAt(bb.items.length - 3);
   }
});

Ext.reg('multigroupingpaginggrid', Ext.ux.MultiGroupingPagingGrid);
