
Ext.namespace('Ext.ux.grid');


Ext.ux.grid.GridFilters = Ext.extend(Ext.util.Observable, {
    
    autoReload : true,
    
    
    
    filterCls : 'ux-filtered-column',
    
    local : false,
    
    menuFilterText : 'Filters',
    
    paramPrefix : 'filter',
    
    showMenu : true,
    
    stateId : undefined,
    
    updateBuffer : 500,

    
    constructor : function (config) {		
        this.deferredUpdate = new Ext.util.DelayedTask(this.reload, this);
        this.filters = new Ext.util.MixedCollection();
        this.filters.getKey = function (o) {
            return o ? o.dataIndex : null;
        };
        this.addFilters(config.filters);
        delete config.filters;
        Ext.apply(this, config);
    },

    
    init : function (grid) {
        if (grid instanceof Ext.grid.GridPanel) {
            this.grid = grid;

            this.bindStore(this.grid.getStore(), true);
          
            this.grid.filters = this;
             
            this.grid.addEvents({'filterupdate': true});
              
            grid.on({
                scope: this,
                beforestaterestore: this.applyState,
                beforestatesave: this.saveState,
                beforedestroy: this.destroy,
                reconfigure: this.onReconfigure
            });
            
            if (grid.rendered){
                this.onRender();
            } else {
                grid.on({
                    scope: this,
                    single: true,
                    render: this.onRender
                });
            }
                      
        } else if (grid instanceof Ext.PagingToolbar) {
            this.toolbar = grid;
        }
    },
        
       
    applyState : function (grid, state) {
        var key, filter;
        this.applyingState = true;
        this.clearFilters();
        if (state.filters) {
            for (key in state.filters) {
                filter = this.filters.get(key);
                if (filter) {
                    filter.setValue(state.filters[key]);
                    filter.setActive(true);
                }
            }
        }
        this.deferredUpdate.cancel();
        if (this.local) {
            this.reload();
        }
        delete this.applyingState;
    },
    
    
    saveState : function (grid, state) {
        var filters = {};
        this.filters.each(function (filter) {
            if (filter.active) {
                filters[filter.dataIndex] = filter.getValue();
            }
        });
        return (state.filters = filters);
    },
    
        
    onRender : function () {
        this.grid.getView().on('refresh', this.onRefresh, this);
        this.createMenu();
    },

        
    destroy : function () {
        this.removeAll();
        this.purgeListeners();

        if(this.filterMenu){
            Ext.menu.MenuMgr.unregister(this.filterMenu);
            this.filterMenu.destroy();
             this.filterMenu = this.menu.menu = null;            
        }
    },

        
    removeAll : function () {
        if(this.filters){
            Ext.destroy.apply(Ext, this.filters.items);
            // remove all items from the collection 
            this.filters.clear();
        }
    },


    
    bindStore : function(store, initial){
        if(!initial && this.store){
            if (this.local) {
                store.un('load', this.onLoad, this);
            } else {
                store.un('beforeload', this.onBeforeLoad, this);
            }
        }
        if(store){
            if (this.local) {
                store.on('load', this.onLoad, this);
            } else {
                store.on('beforeload', this.onBeforeLoad, this);
            }
        }
        this.store = store;
    },

        
    onReconfigure : function () {
        this.bindStore(this.grid.getStore());
        this.store.clearFilter();
        this.removeAll();
        this.addFilters(this.grid.getColumnModel());
        this.updateColumnHeadings();
    },

    createMenu : function () {
        var view = this.grid.getView(),
            hmenu = view.hmenu;

        if (this.showMenu && hmenu) {
            
            this.sep  = hmenu.addSeparator();
            this.filterMenu = new Ext.menu.Menu({
                id: this.grid.id + '-filters-menu'
            }); 
            this.menu = hmenu.add({
                checked: false,
                itemId: 'filters',
                text: this.menuFilterText,
                menu: this.filterMenu
            });

            this.menu.on({
                scope: this,
                checkchange: this.onCheckChange,
                beforecheckchange: this.onBeforeCheck
            });
            hmenu.on('beforeshow', this.onMenu, this);
        }
        this.updateColumnHeadings();
    },

    
    getMenuFilter : function () {
        var view = this.grid.getView();
        if (!view || view.hdCtxIndex === undefined) {
            return null;
        }
        return this.filters.get(
            view.cm.config[view.hdCtxIndex].dataIndex
        );
    },

        
    onMenu : function (filterMenu) {
        var filter = this.getMenuFilter();

        if (filter) {

            this.menu.menu = filter.menu;
            this.menu.setChecked(filter.active, false);
            // disable the menu if filter.disabled explicitly set to true
            this.menu.setDisabled(filter.disabled === true);
        }
        
        this.menu.setVisible(filter !== undefined);
        this.sep.setVisible(filter !== undefined);
    },
    
    
    onCheckChange : function (item, value) {
        this.getMenuFilter().setActive(value);
    },
    
    
    onBeforeCheck : function (check, value) {
        return !value || this.getMenuFilter().isActivatable();
    },

       
    onStateChange : function (event, filter) {
        if (event === 'serialize') {
            return;
        }

        if (filter == this.getMenuFilter()) {
            this.menu.setChecked(filter.active, false);
        }

        if ((this.autoReload || this.local) && !this.applyingState) {
            this.deferredUpdate.delay(this.updateBuffer);
        }
        this.updateColumnHeadings();
            
        if (!this.applyingState) {
            this.grid.saveState();
        }    
        this.grid.fireEvent('filterupdate', this, filter);
    },
    
    
    onBeforeLoad : function (store, options) {
        options.params = options.params || {};
        this.cleanParams(options.params);		
        var params = this.buildQuery(this.getFilterData());
        Ext.apply(options.params, params);
    },
    
    
    onLoad : function (store, options) {
        store.filterBy(this.getRecordFilter());
    },

        
    onRefresh : function () {
        this.updateColumnHeadings();
    },

        
    updateColumnHeadings : function () {
        var view = this.grid.getView(),
            hds, i, len, filter;
        if (view.mainHd) {
            hds = view.mainHd.select('td').removeClass(this.filterCls);
            for (i = 0, len = view.cm.config.length; i < len; i++) {
                filter = this.getFilter(view.cm.config[i].dataIndex);
                if (filter && filter.active) {
                    hds.item(i).addClass(this.filterCls);
                }
            }
        }
    },
    
    
    reload : function () {
        if (this.local) {
            this.grid.store.clearFilter(true);
            this.grid.store.filterBy(this.getRecordFilter());
        } else {
            var start,
                store = this.grid.store;
            this.deferredUpdate.cancel();
            if (this.toolbar) {
                start = store.paramNames.start;
                if (store.lastOptions && store.lastOptions.params && store.lastOptions.params[start]) {
                    store.lastOptions.params[start] = 0;
                }
            }
            store.reload();
        }
    },
    
    
    getRecordFilter : function () {
        var f = [], len, i;
        this.filters.each(function (filter) {
            if (filter.active) {
                f.push(filter);
            }
        });
        
        len = f.length;
        return function (record) {
            for (i = 0; i < len; i++) {
                if (!f[i].validateRecord(record)) {
                    return false;
                }
            }
            return true;
        };
    },
    
    
    addFilter : function (config) {
        var Cls = this.getFilterClass(config.type),
            filter = config.menu ? config : (new Cls(config));
        this.filters.add(filter);
        
        Ext.util.Observable.capture(filter, this.onStateChange, this);
        return filter;
    },

    
    addFilters : function (filters) {
        if (filters) {
            var i, len, filter, cm = false, dI;
            if (filters instanceof Ext.grid.ColumnModel) {
                filters = filters.config;
                cm = true;
            }
            for (i = 0, len = filters.length; i < len; i++) {
                filter = false;
                if (cm) {
                    dI = filters[i].dataIndex;
                    filter = filters[i].filter || filters[i].filterable;
                    if (filter){
                        filter = (filter === true) ? {} : filter;
                        Ext.apply(filter, {dataIndex:dI});
                        // filter type is specified in order of preference:
                        //     filter type specified in config
                        //     type specified in store's field's type config
                        filter.type = filter.type || this.store.fields.get(dI).type;  
                    }
                } else {
                    filter = filters[i];
                }
                // if filter config found add filter for the column 
                if (filter) {
                    this.addFilter(filter);
                }
            }
        }
    },
    
    
    getFilter : function (dataIndex) {
        return this.filters.get(dataIndex);
    },

    
    clearFilters : function () {
        this.filters.each(function (filter) {
            filter.setActive(false);
        });
    },

    
    getFilterData : function () {
        var filters = [], i, len;

        this.filters.each(function (f) {
            if (f.active) {
                var d = [].concat(f.serialize());
                for (i = 0, len = d.length; i < len; i++) {
                    filters.push({
                        field: f.dataIndex,
                        data: d[i]
                    });
                }
            }
        });
        return filters;
    },
    
    
    buildQuery : function (filters) {
        var p = {}, i, f, root, dataPrefix, key, tmp,
            len = filters.length;

        if (!this.encode){
            for (i = 0; i < len; i++) {
                f = filters[i];
                root = [this.paramPrefix, '[', i, ']'].join('');
                p[root + '[field]'] = f.field;
                
                dataPrefix = root + '[data]';
                for (key in f.data) {
                    p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
                }
            }
        } else {
            tmp = [];
            for (i = 0; i < len; i++) {
                f = filters[i];
                tmp.push(Ext.apply(
                    {},
                    {field: f.field},
                    f.data
                ));
            }
            // only build if there is active filter 
            if (tmp.length > 0){
                p[this.paramPrefix] = Ext.util.JSON.encode(tmp);
            }
        }
        return p;
    },
    
    
    cleanParams : function (p) {
        // if encoding just delete the property
        if (this.encode) {
            delete p[this.paramPrefix];
        // otherwise scrub the object of filter data
        } else {
            var regex, key;
            regex = new RegExp('^' + this.paramPrefix + '\[[0-9]+\]');
            for (key in p) {
                if (regex.test(key)) {
                    delete p[key];
                }
            }
        }
    },
    
    
    getFilterClass : function (type) {
        // map the supported Ext.data.Field type values into a supported filter
        switch(type) {
            case 'auto':
              type = 'string';
              break;
            case 'int':
            case 'float':
              type = 'numeric';
              break;
        }
        return Ext.ux.grid.filter[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
    }
});

// register ptype
Ext.preg('gridfilters', Ext.ux.grid.GridFilters);


Ext.namespace('Ext.ux.grid.filter');


Ext.ux.grid.filter.Filter = Ext.extend(Ext.util.Observable, {
    
    active : false,
    
    
    dataIndex : null,
    
    menu : null,
    
    updateBuffer : 500,

    constructor : function (config) {
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
    },

    
    destroy : function(){
        if (this.menu){
            this.menu.destroy();
        }
        this.purgeListeners();
    },

    
    init : Ext.emptyFn,
    
    
    getValue : Ext.emptyFn,
    
    	
    setValue : Ext.emptyFn,
    
    
    isActivatable : function(){
        return true;
    },
    
    
    getSerialArgs : Ext.emptyFn,

    
    validateRecord : function(){
        return true;
    },

    
    serialize : function(){
        var args = this.getSerialArgs();
        this.fireEvent('serialize', args, this);
        return args;
    },

    
    fireUpdate : function(){
        if (this.active) {
            this.fireEvent('update', this);
        }
        this.setActive(this.isActivatable());
    },
    
    
    setActive : function(active, suppressEvent){
        if(this.active != active){
            this.active = active;
            if (suppressEvent !== true) {
                this.fireEvent(active ? 'activate' : 'deactivate', this);
            }
        }
    }    
});


Ext.ux.grid.filter.BooleanFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
	
	defaultValue : false,
	
	yesText : 'Yes',
	
	noText : 'No',

    
    init : function (config) {
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
	
    
    getValue : function () {
		return this.options[0].checked;
	},

    	
	setValue : function (value) {
		this.options[value ? 0 : 1].setChecked(true);
	},

    
    getSerialArgs : function () {
		var args = {type: 'boolean', value: this.getValue()};
		return args;
	},
	
    
    validateRecord : function (record) {
		return record.get(this.dataIndex) == this.getValue();
	}
});


Ext.ux.grid.filter.StringFilter = Ext.extend(Ext.ux.grid.filter.Filter, {

    
    iconCls : 'ux-gridfilter-text-icon',

    emptyText: 'Enter Filter Text...',
    selectOnFocus: true,
    width: 125,
    
    
    init : function (config) {
        Ext.applyIf(config, {
            enableKeyEvents: true,
            iconCls: this.iconCls,
            listeners: {
                scope: this,
                keyup: this.onInputKeyUp
            }
        });

        this.inputItem = new Ext.form.TextField(config); 
        this.menu.add(this.inputItem);
        this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
    },
    
    
    getValue : function () {
        return this.inputItem.getValue();
    },
    
    	
    setValue : function (value) {
        this.inputItem.setValue(value);
        this.fireEvent('update', this);
    },

    
    isActivatable : function () {
        return this.inputItem.getValue().length > 0;
    },

    
    getSerialArgs : function () {
        return {type: 'string', value: this.getValue()};
    },

    
    validateRecord : function (record) {
        var val = record.get(this.dataIndex);

        if(typeof val != 'string') {
            return (this.getValue().length === 0);
        }

        return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
    },
    
    
    onInputKeyUp : function (field, e) {
        var k = e.getKey();
        if (k == e.RETURN && field.isValid()) {
            e.stopEvent();
            this.menu.hide(true);
            return;
        }
        // restart the timer
        this.updateTask.delay(this.updateBuffer);
    }
});



Ext.ux.grid.filter.DateFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
    
    afterText : 'After',
    
    beforeText : 'Before',
    
    compareMap : {
        before: 'lt',
        after:  'gt',
        on:     'eq'
    },
    
    dateFormat : 'm/d/Y',

    
    
    
    menuItems : ['before', 'after', '-', 'on'],

    
    menuItemCfgs : {
        selectOnFocus: true,
        width: 125
    },

    
    onText : 'On',
    
    
    pickerOpts : {},

    
    init : function (config) {
        var menuCfg, i, len, item, cfg, Cls;

        menuCfg = Ext.apply(this.pickerOpts, {
            minDate: this.minDate, 
            maxDate: this.maxDate, 
            format:  this.dateFormat,
            listeners: {
                scope: this,
                select: this.onMenuSelect
            }
        });

        this.fields = {};
        for (i = 0, len = this.menuItems.length; i < len; i++) {
            item = this.menuItems[i];
            if (item !== '-') {
                cfg = {
                    itemId: 'range-' + item,
                    text: this[item + 'Text'],
                    menu: new Ext.menu.DateMenu(
                        Ext.apply(menuCfg, {
                            itemId: item
                        })
                    ),
                    listeners: {
                        scope: this,
                        checkchange: this.onCheckChange
                    }
                };
                Cls = Ext.menu.CheckItem;
                item = this.fields[item] = new Cls(cfg);
            }
            //this.add(item);
            this.menu.add(item);
        }
    },

    onCheckChange : function () {
        this.setActive(this.isActivatable());
        this.fireEvent('update', this);
    },

    
    onInputKeyUp : function (field, e) {
        var k = e.getKey();
        if (k == e.RETURN && field.isValid()) {
            e.stopEvent();
            this.menu.hide(true);
            return;
        }
    },

    
    onMenuSelect : function (menuItem, value, picker) {
        var fields = this.fields,
            field = this.fields[menuItem.itemId];
        
        field.setChecked(true);
        
        if (field == fields.on) {
            fields.before.setChecked(false, true);
            fields.after.setChecked(false, true);
        } else {
            fields.on.setChecked(false, true);
            if (field == fields.after && fields.before.menu.picker.value < value) {
                fields.before.setChecked(false, true);
            } else if (field == fields.before && fields.after.menu.picker.value > value) {
                fields.after.setChecked(false, true);
            }
        }
        this.fireEvent('update', this);
    },

    
    getValue : function () {
        var key, result = {};
        for (key in this.fields) {
            if (this.fields[key].checked) {
                result[key] = this.fields[key].menu.picker.getValue();
            }
        }
        return result;
    },

    	
    setValue : function (value, preserve) {
        var key;
        for (key in this.fields) {
            if(value[key]){
                this.fields[key].menu.picker.setValue(value[key]);
                this.fields[key].setChecked(true);
            } else if (!preserve) {
                this.fields[key].setChecked(false);
            }
        }
        this.fireEvent('update', this);
    },

    
    isActivatable : function () {
        var key;
        for (key in this.fields) {
            if (this.fields[key].checked) {
                return true;
            }
        }
        return false;
    },

    
    getSerialArgs : function () {
        var args = [];
        for (var key in this.fields) {
            if(this.fields[key].checked){
                args.push({
                    type: 'date',
                    comparison: this.compareMap[key],
                    value: this.getFieldValue(key).format(this.dateFormat)
                });
            }
        }
        return args;
    },

    
    getFieldValue : function(item){
        return this.fields[item].menu.picker.getValue();
    },
    
    
    getPicker : function(item){
        return this.fields[item].menu.picker;
    },

    
    validateRecord : function (record) {
        var key,
            pickerValue,
            val = record.get(this.dataIndex);
            
        if(!Ext.isDate(val)){
            return false;
        }
        val = val.clearTime(true).getTime();
        
        for (key in this.fields) {
            if (this.fields[key].checked) {
                pickerValue = this.getFieldValue(key).clearTime(true).getTime();
                if (key == 'before' && pickerValue <= val) {
                    return false;
                }
                if (key == 'after' && pickerValue >= val) {
                    return false;
                }
                if (key == 'on' && pickerValue != val) {
                    return false;
                }
            }
        }
        return true;
    }
});


Ext.ux.grid.filter.ListFilter = Ext.extend(Ext.ux.grid.filter.Filter, {

    
    
    phpMode : false,
    

    
    init : function (config) {
        this.dt = new Ext.util.DelayedTask(this.fireUpdate, this);

        // if a menu already existed, do clean up first
        if (this.menu){
            this.menu.destroy();
        }
        this.menu = new Ext.ux.menu.ListMenu(config);
        this.menu.on('checkchange', this.onCheckChange, this);
    },
    
    
    getValue : function () {
        return this.menu.getSelected();
    },
    	
    setValue : function (value) {
        this.menu.setSelected(value);
        this.fireEvent('update', this);
    },

    
    isActivatable : function () {
        return this.getValue().length > 0;
    },
    
    
    getSerialArgs : function () {
        var args = {type: 'list', value: this.phpMode ? this.getValue().join(',') : this.getValue()};
        return args;
    },

    
    onCheckChange : function(){
        this.dt.delay(this.updateBuffer);
    },
    
    
    
    validateRecord : function (record) {
        return this.getValue().indexOf(record.get(this.dataIndex)) > -1;
    }
});


Ext.ux.grid.filter.NumericFilter = Ext.extend(Ext.ux.grid.filter.Filter, {

    
    fieldCls : Ext.form.NumberField,
    
    
    
    iconCls : {
        gt : 'ux-rangemenu-gt',
        lt : 'ux-rangemenu-lt',
        eq : 'ux-rangemenu-eq'
    },

    
    menuItemCfgs : {
        emptyText: 'Enter Filter Text...',
        selectOnFocus: true,
        width: 125
    },

    
    menuItems : ['lt', 'gt', '-', 'eq'],

    
    init : function (config) {
        // if a menu already existed, do clean up first
        if (this.menu){
            this.menu.destroy();
        }        
        this.menu = new Ext.ux.menu.RangeMenu(Ext.apply(config, {
            // pass along filter configs to the menu
            fieldCfg : this.fieldCfg || {},
            fieldCls : this.fieldCls,
            fields : this.fields || {},
            iconCls: this.iconCls,
            menuItemCfgs: this.menuItemCfgs,
            menuItems: this.menuItems,
            updateBuffer: this.updateBuffer
        }));
        // relay the event fired by the menu
        this.menu.on('update', this.fireUpdate, this);
    },
    
    
    getValue : function () {
        return this.menu.getValue();
    },

    	
    setValue : function (value) {
        this.menu.setValue(value);
    },

    
    isActivatable : function () {
        var values = this.getValue();
        for (key in values) {
            if (values[key] !== undefined) {
                return true;
            }
        }
        return false;
    },
    
    
    getSerialArgs : function () {
        var key,
            args = [],
            values = this.menu.getValue();
        for (key in values) {
            args.push({
                type: 'numeric',
                comparison: key,
                value: values[key]
            });
        }
        return args;
    },

    
    validateRecord : function (record) {
        var val = record.get(this.dataIndex),
            values = this.getValue();
        if (values.eq !== undefined && val != values.eq) {
            return false;
        }
        if (values.lt !== undefined && val >= values.lt) {
            return false;
        }
        if (values.gt !== undefined && val <= values.gt) {
            return false;
        }
        return true;
    }
});
