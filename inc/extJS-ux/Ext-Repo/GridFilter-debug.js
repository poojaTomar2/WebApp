Ext.namespace("Ext.ux.grid");
Ext.ux.grid.GridFilters = function(config){		
	this.filters = new Ext.util.MixedCollection();
	this.filters.getKey = function(o){return o ? o.dataIndex : null};
	
	for(var i=0, len=config.filters.length; i<len; i++)
		this.addFilter(config.filters[i]);
	
	this.deferredUpdate = new Ext.util.DelayedTask(this.reload, this);
	
	delete config.filters;
	Ext.apply(this, config);
};

Ext.extend(Ext.ux.grid.GridFilters, Ext.util.Observable, {
	
	
	updateBuffer: 500,
	
	paramPrefix: 'filter',
	
	filterCls: 'ux-filtered-column',
	
	local: false,
	
	autoReload: true,
	
	stateId: undefined,
	
	showMenu: true,
	
	menuFilterText: 'Filters',

	
	init: function(grid){
		if(grid instanceof Ext.grid.GridPanel){
			this.grid  = grid;
		  
			this.store = this.grid.getStore();
			if(this.local){
				this.store.on('load', function(store){
					store.filterBy(this.getRecordFilter());
				}, this);
			} else {
			  this.store.on('beforeload', this.onBeforeLoad, this);
			}
			  
			this.grid.filters = this;
			 
			this.grid.addEvents({"filterupdate": true});
			  
			grid.on("render", this.onRender, this);
			  
			grid.on("beforestaterestore", this.applyState, this);
			grid.on("beforestatesave", this.saveState, this);
					  
		} else if(grid instanceof Ext.PagingToolbar){
		  this.toolbar = grid;
		}
	},
		
	
	applyState: function(grid, state){
		this.applyingState = true;
		this.clearFilters();
		if(state.filters)
			for(var key in state.filters){
				var filter = this.filters.get(key);
				if(filter){
					filter.setValue(state.filters[key]);
					filter.setActive(true);
				}
			}
			
		this.deferredUpdate.cancel();
		if(this.local)
			this.reload();
			
		delete this.applyingState;
	},
	
	
	saveState: function(grid, state){
		var filters = {};
		this.filters.each(function(filter){
			if(filter.active)
				filters[filter.dataIndex] = filter.getValue();
		});
		return state.filters = filters;
	},
	
	
	onRender: function(){
		var hmenu;
		
		if(this.showMenu){
			hmenu = this.grid.getView().hmenu;
			
			this.sep  = hmenu.addSeparator();
			this.menu = hmenu.add(new Ext.menu.CheckItem({
					text: this.menuFilterText,
					menu: new Ext.menu.Menu()
				}));
			this.menu.on('checkchange', this.onCheckChange, this);
			this.menu.on('beforecheckchange', this.onBeforeCheck, this);
				
			hmenu.on('beforeshow', this.onMenu, this);
		}
		
		this.grid.getView().on("refresh", this.onRefresh, this);
		this.updateColumnHeadings(this.grid.getView());
	},
	
	
	onMenu: function(filterMenu){
		var filter = this.getMenuFilter();
		if(filter){
			this.menu.menu = filter.menu;
			this.menu.setChecked(filter.active, false);
		}
		
		this.menu.setVisible(filter !== undefined);
		this.sep.setVisible(filter !== undefined);
	},
	
	
	onCheckChange: function(item, value){
		this.getMenuFilter().setActive(value);
	},
	
	
	onBeforeCheck: function(check, value){
		return !value || this.getMenuFilter().isActivatable();
	},
	
	
	onStateChange: function(event, filter){
    	if(event == "serialize") return;
    
		if(filter == this.getMenuFilter())
			this.menu.setChecked(filter.active, false);
			
		if((this.autoReload || this.local) && !this.applyingState)
			this.deferredUpdate.delay(this.updateBuffer);
		
		var view = this.grid.getView();
		this.updateColumnHeadings(view);
			
		if(!this.applyingState)
			this.grid.saveState();
			
		this.grid.fireEvent('filterupdate', this, filter);
	},
	
	
	onBeforeLoad: function(store, options){
    options.params = options.params || {};
		this.cleanParams(options.params);		
		var params = this.buildQuery(this.getFilterData());
		Ext.apply(options.params, params);
	},
	
	
	onRefresh: function(view){
		this.updateColumnHeadings(view);
	},
	
	
	getMenuFilter: function(){
		var view = this.grid.getView();
		if(!view || view.hdCtxIndex === undefined)
			return null;
		
		return this.filters.get(
			view.cm.config[view.hdCtxIndex].dataIndex);
	},
	
	
	updateColumnHeadings: function(view){
		if(!view || !view.mainHd) return;
		
		var hds = view.mainHd.select('td').removeClass(this.filterCls);
		for(var i=0, len=view.cm.config.length; i<len; i++){
			var filter = this.getFilter(view.cm.config[i].dataIndex);
			if(filter && filter.active)
				hds.item(i).addClass(this.filterCls);
		}
	},
	
	
	reload: function(){
		if(this.local){
			this.grid.store.clearFilter(true);
			this.grid.store.filterBy(this.getRecordFilter());
		} else {
			this.deferredUpdate.cancel();
			var store = this.grid.store;
			if(this.toolbar){
				var start = this.toolbar.paramNames.start;
				if(store.lastOptions && store.lastOptions.params && store.lastOptions.params[start])
					store.lastOptions.params[start] = 0;
			}
			store.reload();
		}
	},
	
	
	getRecordFilter: function(){
		var f = [];
		this.filters.each(function(filter){
			if(filter.active) f.push(filter);
		});
		
		var len = f.length;
		return function(record){
			for(var i=0; i<len; i++)
				if(!f[i].validateRecord(record))
					return false;
				
			return true;
		};
	},
	
	
	addFilter: function(config){
		var filter = config.menu ? config : 
				new (this.getFilterClass(config.type))(config);
		this.filters.add(filter);
		
		Ext.util.Observable.capture(filter, this.onStateChange, this);
		return filter;
	},
	
	
	getFilter: function(dataIndex){
		return this.filters.get(dataIndex);
	},

	
	clearFilters: function(){
		this.filters.each(function(filter){
			filter.setActive(false);
		});
	},

	
	getFilterData: function(){
		var filters = [],
			fields  = this.grid.getStore().fields;
		
		this.filters.each(function(f){
			if(f.active){
				var d = [].concat(f.serialize());
				for(var i=0, len=d.length; i<len; i++)
					filters.push({
						field: f.dataIndex,
						data: d[i]
					});
			}
		});
		
		return filters;
	},
	
	
	buildQuery: function(filters){
		var p = {};
		for(var i=0, len=filters.length; i<len; i++){
			var f    = filters[i];
			var root = [this.paramPrefix, '[', i, ']'].join('');
			p[root + '[field]'] = f.field;
			
			var dataPrefix = root + '[data]';
			for(var key in f.data)
				p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
		}
		
		return p;
	},
	
	
	cleanParams: function(p){
		var regex = new RegExp("^" + this.paramPrefix + "\[[0-9]+\]");
		for(var key in p)
			if(regex.test(key))
				delete p[key];
	},
	
	
	getFilterClass: function(type){
		return Ext.ux.grid.filter[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
	}
});
Ext.namespace("Ext.ux.grid.filter");

Ext.ux.grid.filter.Filter = function(config){
	Ext.apply(this, config);
		
	this.addEvents(
		
		'activate',
		
		'deactivate',
		
		'serialize',
		
		'update'
	);
	Ext.ux.grid.filter.Filter.superclass.constructor.call(this);
	
	this.menu = new Ext.menu.Menu();
	this.init(config);
	
	if(config && config.value){
		this.setValue(config.value);
		this.setActive(config.active !== false, true);
		delete config.value;
	}
};

Ext.extend(Ext.ux.grid.filter.Filter, Ext.util.Observable, {
	
    
	active: false,
	
	dataIndex: null,
	
	menu: null,
	
	
	updateBuffer: 500,
	
	
	
	init: Ext.emptyFn,
	
	
	fireUpdate: function(){
		if(this.active)
			this.fireEvent("update", this);
			
		this.setActive(this.isActivatable());
	},
	
	
	isActivatable: function(){
		return true;
	},
	
	
	setActive: function(active, suppressEvent){
		if(this.active != active){
			this.active = active;
			if(suppressEvent !== true)
				this.fireEvent(active ? 'activate' : 'deactivate', this);
		}
	},
	
	
	getValue: Ext.emptyFn,
	
		
	setValue: Ext.emptyFn,
	
	
	serialize: Ext.emptyFn,
	
	
	 validateRecord: function(){return true;}
});

Ext.ux.grid.filter.StringFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
	
	icon: 'ux-gridfilter-text-icon',
	
	
	init: function(){
		var value = this.value = new Ext.ux.menu.EditableItem({iconCls: this.icon});
		value.on('keyup', this.onKeyUp, this);
		this.menu.add(value);
		
		this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
	},
	
	
	onKeyUp: function(event){
		if(event.getKey() == event.ENTER){
			this.menu.hide(true);
			return;
		}
			
		this.updateTask.delay(this.updateBuffer);
	},
	
	isActivatable: function(){
		return this.value.getValue().length > 0;
	},
	
	
	fireUpdate: function(){		
		if(this.active)
			this.fireEvent("update", this);
			
		this.setActive(this.isActivatable());
	},
	
	setValue: function(value){
		this.value.setValue(value);
		this.fireEvent("update", this);
	},
	
	getValue: function(){
		return this.value.getValue();
	},
	
	serialize: function(){
		var args = {type: 'string', value: this.getValue()};
		this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record){
		var val = record.get(this.dataIndex);
		
		if(typeof val != "string")
			return this.getValue().length == 0;
			
		return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
	}
});

Ext.ux.grid.filter.DateFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
	
	dateFormat: 'm/d/Y',
	
	pickerOpts: {},
	
    beforeText: 'Before',
	
    afterText:  'After',
	
    onText:     'On',
	
	
	init: function(){
		var opts = Ext.apply(this.pickerOpts, {
			minDate: this.minDate, 
			maxDate: this.maxDate, 
			format:  this.dateFormat
		});
		var dates = this.dates = {
			'before': new Ext.menu.CheckItem({text: this.beforeText, menu: new Ext.menu.DateMenu(opts)}),
			'after':  new Ext.menu.CheckItem({text: this.afterText, menu: new Ext.menu.DateMenu(opts)}),
			'on':     new Ext.menu.CheckItem({text: this.onText, menu: new Ext.menu.DateMenu(opts)})};
				
		this.menu.add(dates.before, dates.after, "-", dates.on);
		
		for(var key in dates){
			var date = dates[key];
			date.menu.on('select', function(date, menuItem, value, picker) {
				date.setChecked(false);
				date.setChecked(true);
				
				if(date == dates.on){
					dates.before.setChecked(false, true);
					dates.after.setChecked(false, true);
				} else {
					dates.on.setChecked(false, true);
					
					if(date == dates.after && dates.before.menu.picker.value < value)
            dates.before.setChecked(false, true);
          else if (date == dates.before && dates.after.menu.picker.value > value)
            dates.after.setChecked(false, true);
				}
				
				this.fireEvent("update", this);
			}.createDelegate(this, [date], 0));
			
			date.on('checkchange', function(){
				this.setActive(this.isActivatable());
			}, this);
		};
	},
	
    
	getFieldValue: function(field){
		return this.dates[field].menu.picker.getValue();
	},
	
    
	getPicker: function(field){
		return this.dates[field].menu.picker;
	},
	
	isActivatable: function(){
		return this.dates.on.checked || this.dates.after.checked || this.dates.before.checked;
	},
	
	setValue: function(value){
		for(var key in this.dates)
			if(value[key]){
				this.dates[key].menu.picker.setValue(value[key]);
				this.dates[key].setChecked(true);
			} else {
				this.dates[key].setChecked(false);
			}
	},
	
	getValue: function(){
		var result = {};
		for(var key in this.dates)
			if(this.dates[key].checked)
				result[key] = this.dates[key].menu.picker.getValue();
				
		return result;
	},
	
	serialize: function(){
		var args = [];
		if(this.dates.before.checked)
			args = [{type: 'date', comparison: 'lt', value: this.getFieldValue('before').format(this.dateFormat)}];
		if(this.dates.after.checked)
			args.push({type: 'date', comparison: 'gt', value: this.getFieldValue('after').format(this.dateFormat)});
		if(this.dates.on.checked)
			args = {type: 'date', comparison: 'eq', value: this.getFieldValue('on').format(this.dateFormat)};

    this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record){
		var val = record.get(this.dataIndex).clearTime(true).getTime();
		
		if(this.dates.on.checked && val != this.getFieldValue('on').clearTime(true).getTime())
			return false;
		
		if(this.dates.before.checked && val >= this.getFieldValue('before').clearTime(true).getTime())
			return false;
		
		if(this.dates.after.checked && val <= this.getFieldValue('after').clearTime(true).getTime())
			return false;
			
		return true;
	}
});

Ext.ux.grid.filter.ListFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
	
	phpMode:     false,
	
	
	init: function(config){
		this.dt = new Ext.util.DelayedTask(this.fireUpdate, this);

		this.menu = new Ext.ux.menu.ListMenu(config);
		this.menu.on('checkchange', this.onCheckChange, this);
	},
	
	
	onCheckChange: function(){
		this.dt.delay(this.updateBuffer);
	},
	
	isActivatable: function(){
		return this.menu.getSelected().length > 0;
	},
	
	setValue: function(value){
		this.menu.setSelected(value);
			
		this.fireEvent("update", this);
	},
	
	getValue: function(){
		return this.menu.getSelected();
	},
	
	serialize: function(){
	    var args = {type: 'list', value: this.phpMode ? this.getValue().join(',') : this.getValue()};
	    this.fireEvent('serialize', args, this);
		
		return args;
	},
	
	validateRecord: function(record){
		return this.getValue().indexOf(record.get(this.dataIndex)) > -1;
	}
});

Ext.ux.grid.filter.NumericFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
	
	init: function(){
		this.menu = new Ext.ux.menu.RangeMenu({updateBuffer: this.updateBuffer});
		
		this.menu.on("update", this.fireUpdate, this);
	},
	
	
	fireUpdate: function(){
		this.setActive(this.isActivatable());
		this.fireEvent("update", this);
	},
	
	isActivatable: function(){
		var value = this.menu.getValue();
		return value.eq !== undefined || value.gt !== undefined || value.lt !== undefined;
	},
	
	setValue: function(value){
		this.menu.setValue(value);
	},
	
	getValue: function(){
		return this.menu.getValue();
	},
	
	serialize: function(){
		var args = [];
		var values = this.menu.getValue();
		for(var key in values)
			args.push({type: 'numeric', comparison: key, value: values[key]});

		this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record){
		var val    = record.get(this.dataIndex),
			values = this.menu.getValue();
			
		if(values.eq != undefined && val != values.eq)
			return false;
		
		if(values.lt != undefined && val >= values.lt)
			return false;
		
		if(values.gt != undefined && val <= values.gt)
			return false;
			
		return true;
	}
});

Ext.ux.grid.filter.BooleanFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
	
	defaultValue: false,
	
	yesText: "Yes",
	
	noText:  "No",

	
	init: function(){
    var gId = Ext.id();
		this.options = [
			new Ext.menu.CheckItem({text: this.yesText, group: gId, checked: this.defaultValue === true}),
			new Ext.menu.CheckItem({text: this.noText, group: gId, checked: this.defaultValue === false})];
		
		this.menu.add(this.options[0], this.options[1]);
		
		for(var i=0; i<this.options.length; i++){
			this.options[i].on('click', this.fireUpdate, this);
			this.options[i].on('checkchange', this.fireUpdate, this);
		}
	},
	
	isActivatable: function(){
		return true;
	},
	
	fireUpdate: function(){		
		this.fireEvent("update", this);			
		this.setActive(true);
	},
	
	setValue: function(value){
		this.options[value ? 0 : 1].setChecked(true);
	},
	
	getValue: function(){
		return this.options[0].checked;
	},
	
	serialize: function(){
		var args = {type: 'boolean', value: this.getValue()};
		this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record){
		return record.get(this.dataIndex) == this.getValue();
	}
});
