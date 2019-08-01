Ext.namespace("Ext.ux.menu");

Ext.ux.menu.EditableItem = Ext.extend(Ext.menu.BaseItem, {
	itemCls: "x-editable-menu-item",
	hideOnClick: false,

	initComponent: function() {

		Ext.ux.menu.EditableItem.superclass.initComponent.call(this);
		this.addEvents({ keyup: true });
		this.editor = this.editor || new Ext.form.TextField();
		if (this.text)
			this.editor.setValue(this.text);
	},

	onRender: function(container) {
		this.el = container.createChild(Ext.apply({
			cls: this.itemCls,
			cn: [{ tag: 'img',
				src: this.icon || Ext.BLANK_IMAGE_URL,
				cls: this.itemCls + '-icon' + (this.iconCls ? ' ' + this.iconCls : '')
			},
                 { tag: 'div', cls: this.itemCls + '-editor x-form-field' }
                 ]
		}, !!this.tooltip ? { qtip: this.tooltip} : false));

		Ext.apply(this.config, { width: 125 });

		Ext.ux.menu.EditableItem.superclass.onRender.apply(this, arguments);

		this.editor.render(this.el.child('.' + this.itemCls + '-editor'));
		this.relayEvents(this.editor.el, ["keyup"]);

		this.el.swallowEvent(['keydown', 'keypress']);
		Ext.each(["keydown", "keypress"], function(eventName) {
			this.el.on(eventName, function(e) {
				if (e.isNavKeyPress())
					e.stopPropagation();
			}, this);
		}, this);

	},

	getValue: function() {
		return this.editor.getValue();
	},

	setValue: function(value) {
		this.editor.setValue(value);
	},

	isValid: function(preventMark) {
		return this.editor.isValid(preventMark);
	}
}); 
Ext.namespace("Ext.ux.menu");
Ext.ux.menu.RangeMenu = function(){
	Ext.ux.menu.RangeMenu.superclass.constructor.apply(this, arguments);
	this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);

	var cfg = this.fieldCfg;
	var cls = this.fieldCls;
	var fields = this.fields = Ext.applyIf(this.fields || {}, {
		'gt': new Ext.ux.menu.EditableItem({
			iconCls:  this.icons.gt,
			editor: new cls(typeof cfg == "object" ? cfg.gt || '' : cfg)}),
		'lt': new Ext.ux.menu.EditableItem({
			iconCls:  this.icons.lt,
			editor: new cls(typeof cfg == "object" ? cfg.lt || '' : cfg)}),
		'eq': new Ext.ux.menu.EditableItem({
			iconCls:   this.icons.eq, 
			editor: new cls(typeof cfg == "object" ? cfg.gt || '' : cfg)})
	});
	this.add(fields.gt, fields.lt, '-', fields.eq);
	
	for(var key in fields)
		fields[key].on('keyup', function(event, input, notSure, field){
			if(event.getKey() == event.ENTER && field.isValid()){
				this.hide(true);
				return;
			}
			
			if(field == fields.eq){
				fields.gt.setValue(null);
				fields.lt.setValue(null);
			} else {
				fields.eq.setValue(null);
			}
			
			this.updateTask.delay(this.updateBuffer);
		}.createDelegate(this, [fields[key]], true));

	this.addEvents(
		
		'update'
	);
};

 Ext.extend(Ext.ux.menu.RangeMenu, Ext.menu.Menu, {
	
	fieldCls:     Ext.form.NumberField,
	
 	fieldCfg:     '',
	
	updateBuffer: 500,
	
	icons: {
		gt: 'ux-rangemenu-gt', 
		lt: 'ux-rangemenu-lt',
		eq: 'ux-rangemenu-eq'},
		
	
	fireUpdate: function(){
		this.fireEvent("update", this);
	},
	
	setValue: function(data){
		for(var key in this.fields)
			this.fields[key].setValue(data[key] !== undefined ? data[key] : '');
		
		this.fireEvent("update", this);
	},
	
	getValue: function(){
		var result = {};
		for(var key in this.fields){
			var field = this.fields[key];
			if(field.isValid() && String(field.getValue()).length > 0)
				result[key] = field.getValue();
		}
		
		return result;
	}
});
Ext.namespace("Ext.ux.menu");
Ext.ux.menu.ListMenu = function(cfg){
	this.addEvents('checkchanged');
	Ext.ux.menu.ListMenu.superclass.constructor.call(this, cfg = cfg || {});

	if(!cfg.store && cfg.options){
		var options = [];
		for(var i=0, len=cfg.options.length; i<len; i++){
			var value = cfg.options[i];
			switch(Ext.type(value)){
				case 'array':  options.push(value); break;
				case 'object': options.push([value.id, value[this.labelField]]); break;
				case 'string': options.push([value, value]); break;
			}
		}
		
		this.store = new Ext.data.Store({
			reader: new Ext.data.ArrayReader({id: 0}, ['id', this.labelField]),
			data:   options,
			listeners: {
				'load': this.onLoad,
				scope:  this
			}
		});
		this.loaded = true;
	} else {
		this.add({text: this.loadingText, iconCls: 'loading-indicator'});
		this.store.on('load', this.onLoad, this);
	}
};



Ext.extend(Ext.ux.menu.ListMenu, Ext.menu.Menu, {
	
	labelField:  'text',
	
	loadingText: 'Loading...',
	
	loadOnShow:  true,
	
	single:      false,

	
	selected:    [],
	
	
	show: function(){
		var lastArgs = null;
		return function(){
			if(arguments.length == 0){
				Ext.ux.menu.ListMenu.superclass.show.apply(this, lastArgs);
			} else {
				lastArgs = arguments;
				if(this.loadOnShow && !this.loaded) this.store.load();
				Ext.ux.menu.ListMenu.superclass.show.apply(this, arguments);
			}
		};
	}(),
	
	
	onLoad: function(store, records){
		var visible = this.isVisible();
		this.hide(false);
		
		this.removeAll();
		
		var gid = this.single ? Ext.id() : null;
		for(var i=0, len=records.length; i<len; i++){
			var item = new Ext.menu.CheckItem({
				text:    records[i].get(this.labelField), 
				group:   gid,
				checked: this.selected.indexOf(records[i].id) > -1,
				hideOnClick: false});
			
			item.itemId = records[i].id;
			item.on('checkchange', this.checkChange, this);
						
			this.add(item);
		}
		
		this.loaded = true;
		
		if(visible)
			this.show();
			
		this.fireEvent('load', this, records);
	},
	
	
	setSelected: function(value){
		var value = this.selected = [].concat(value);

		if(this.loaded)
			this.items.each(function(item){
				item.setChecked(false, true);
				for(var i=0, len=value.length; i<len; i++)
					if(item.itemId == value[i]) 
						item.setChecked(true, true);
			}, this);
	},
	
    
	checkChange: function(item, checked){
		var value = [];
		this.items.each(function(item){
			if(item.checked)
				value.push(item.itemId);
		},this);
		this.selected = value;
		
		this.fireEvent("checkchange", item, checked);
	},
	
    
	getSelected: function(){
		return this.selected;
	}
});
Ext.namespace('Ext.ux.menu');
Ext.ux.menu.TreeMenu = function(cfg){
	Ext.ux.menu.TreeMenu.superclass.constructor.call(this, {
		plain: false,
		items: [new Ext.ux.menu.TreeMenuItem(cfg)],
		cls: 'ux-tree-menu'
	});
	this.relayEvents(this.items.get(0), ["select", "search"]);
	this.tree = cfg.tree;
};

Ext.extend(Ext.ux.menu.TreeMenu, Ext.menu.Menu);

Ext.ux.menu.TreeMenuItem = function(cfg){
	
	this.addEvents({select: true, search: true});
	Ext.ux.menu.TreeMenu.superclass.constructor.call(this, cfg);
	
	this.qTask = new Ext.util.DelayedTask(this.doQuery, this);
	this.searchBox = new Ext.form.TextField({
		cls: 'ux-tree-menu-search',
		emptyText: this.emptyText
	});
	
	this.tree.getSelectionModel().on('selectionchange', this.onSelect, this);
};



Ext.extend(Ext.ux.menu.TreeMenuItem, Ext.menu.BaseItem, {
	minHeight:   240,
	minWidth:    200,
	hideOnClick: false,
	
	searchDelay: 500,
	
	tree:        undefined,
	
	searchFn: undefined,
	emptyText: 'Search...',
	handelOffset: 3,
	
	
    onRender : function(container){
        var el = this.el = container.createChild({
			cls:      'ux-tree-menu-wrap',
			children: [{cls: 'ux-tree-menu-search-icon'}]
		});
		
		if(this.searchFn){
			this.searchBox.render(el);
			this.searchBox.getEl().setStyle('margin-bottom', '3px');
			this.searchBox.el.on('keyup', function(){this.qTask.delay(this.searchDelay);}, this);
		}	
		
		this.tree.autoScroll = true;
		this.tree.render(el);
		
		var resizer = new Ext.Resizable(el, {
			pinned:true, 
			handles:'se',
			listeners: {
				'resize': function(rsz, w, h){
					this.resize(w, h);
					this.parentMenu.autoWidth();
					this.parentMenu.el.show();
				},
				scope: this
			}
		});
		this.resize(this.minWidth, this.minHeight);
		
		if(this.searchFn)
			this.doQuery();
	},
	
	onSelect: function(model, node){
		this.fireEvent('select', node.id, node);
	},
	
	doQuery: function(callback){
		var value = this.searchBox.getValue();
		
		this.searchFn(value.length > 0 ? value : null, callback);
			
		this.fireEvent('search', value);
	},
	
	resize: function(w, h){
		var search    = this.searchBox.getEl();
			padding   = this.el.getFrameWidth('tb'),
			searchOff = 0;
		
		if(search){
			search.setWidth(w - this.el.getFrameWidth('lr'));
			searchOff = search.getHeight();
		}
		this.tree.setWidth(w);
		this.tree.setHeight(h - searchOff - padding - this.handelOffset);
	}
});
