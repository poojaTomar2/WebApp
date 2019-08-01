DA.LookupType = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'LookupType: {0}',
		listTitle: 'Drop Downs',
		keyColumn: 'LookupTypeID',
		captionColumn: 'LookupType',
		controller: 'LookupType',
		disableAdd: true
	});
	DA.LookupType.superclass.constructor.call(this, config);
};

Ext.extend(DA.LookupType, DA.Form, {
	editLookupType: function () {
		var grid = this.grid;
		var record = grid.getSelectionModel().getSelected();
		if (record) {
			var id = record.get(this.keyColumn);
			DA.Form.prototype.ShowForm.call(this, id, { record: record, grid: grid, id: id });
		}
	},

	listRecord: Ext.data.Record.create([
		{ name: 'LookupTypeID', type: 'int' },
		{ name: 'Category', type: 'string' },
		{ name: 'LookupType', type: 'string' },
		{ name: 'ScopeID', type: 'int' },
		{ name: 'Description', type: 'string' },
		{ name: 'UseCustomValue', type: 'bool' },
		{ name: 'IsEditable', type: 'bool' },
		{ name: 'IsClientBased', type: 'bool' },
		{ name: 'DisplayValueCaption', type: 'string' },
		{ name: 'ScopeComboType', type: 'string' },
		{ name: 'CustomValueCaption', type: 'string' },
		{ name: 'CustomValueComboType', type: 'string' },
		{ name: 'CustomStringValueCaption', type: 'string' },
		{ name: 'CustomStringValueXType', type: 'string' },
		{ name: 'CustomValueMin', type: 'int' },
		{ name: 'CustomValueMax', type: 'int' },
		{ name: 'ScopeDescription', type: 'string' }
	]),

	cm: function () {
		if (DA.Security.IsSuperAdmin()) {
			this.gridConfig = {
				custom: {
					tbar: [
					{ text: 'Edit', handler: this.editLookupType, scope: this }
				]
				}
			};
		}

		var cm = [
			{ header: 'Setup Type', dataIndex: 'LookupType', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Description', dataIndex: 'Description', width: 200 }
        ];


		return Ext.ux.grid.ColumnModel(cm);
	},

	createForm: function (config) {
		config.items = [
			{ xtype: 'textfield', fieldLabel: 'Setup Type', name: 'Name', maxLength: 50, allowBlank: false },
			{ xtype: 'textfield', fieldLabel: 'Caption', name: 'DisplayValueCaption' },
			{ xtype: 'textfield', fieldLabel: 'Description', name: 'Description', maxLength: 50 },
			{ xtype: 'checkbox', fieldLabel: 'Editable', name: 'IsEditable' },
			{ xtype: 'textfield', fieldLabel: 'Scope Combo Type', name: 'ScopeComboType' },
			{ xtype: 'box', autoEl: { tag: 'div', cn: '<b>Custom Value</b>'} },
			{ xtype: 'checkbox', fieldLabel: 'Use?', name: 'UseCustomValue' },
			{ xtype: 'textfield', fieldLabel: 'Caption', name: 'CustomValueCaption' },
			{ xtype: 'textfield', fieldLabel: 'Combo Type', name: 'CustomValueComboType' },
			{ xtype: 'numberfield', fieldLabel: 'Min Value', allowDecimals: false, name: 'CustomValueMin' },
			{ xtype: 'numberfield', fieldLabel: 'Max Value', allowDecimals: false, name: 'CustomValueMax' },
			{ xtype: 'box', autoEl: { tag: 'div', cn: '<b>Custom String Value</b>'} },
			{ xtype: 'textfield', fieldLabel: 'Caption', name: 'CustomStringValueCaption' },
			{ xtype: 'textfield', fieldLabel: 'XType', name: 'CustomStringValueXType' }
		];
		return config;
	},

	ShowForm: function (id, args) {
	
		var record = args.record;
		var lookupTypeId = "LookupType" + record.get(this.keyColumn);

		var lookupModule = DA.Lookups[lookupTypeId]
		if (!lookupModule) {
			lookupModule = new DA.Lookup({ lookupType: record.data, securityModule: this.securityModule });
			lookupModule.init();

			DA.Lookups[lookupTypeId] = lookupModule;
		}

		lookupModule.ShowList();
	}
});

DA.Lookups = {};

DA.Lookup = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Lookup: {0}',
		listTitle: 'Lookup',
		keyColumn: 'LookupId',
		captionColumn: 'DisplayValue',
		controller: 'Lookup',
		winConfig: { height: 230, width: 600 },
		newListRecordData: { IsActive: true }
	});
	DA.Lookup.superclass.constructor.call(this, config);
};

Ext.extend(DA.Lookup, DA.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'LookupId', type: 'int' },
		{ name: 'LookupTypeId', type: 'int' },
		{ name: 'DisplayValue', type: 'string' },
		{ name: 'ScopeId', type: 'int' },
		{ name: 'CustomValue', type: 'int' },
		{ name: 'SortOrder', type: 'int' },
		{ name: 'CustomStringValue', type: 'string' },
		{ name: 'CustomDisplayValue', type: 'string' },
		{ name: 'SystemValue', type: 'bool' },
		{ name: 'ReferenceValue', type: 'string' },
		{ name: 'IsActive', type: 'bool' },
		{ name: 'ScopeDisplayValue', type: 'string' },
		{ name: 'IsDefault', type: 'bool' }
	]),
	cols: function (cols) {
		return cols;
	},
	items: function (items) {
		return items;
	},
	init: function () {
		var lookupType = this.lookupType;

		lookupType.Caption = lookupType.DisplayValueCaption.length > 0 ? lookupType.DisplayValueCaption : lookupType.LookupType;

		this.formTitle = lookupType.LookupType + ': {0}';
		this.listTitle = lookupType.LookupType;
		this.uniqueId = "Lookup" + lookupType.LookupTypeID + "x";
		this.baseParams = { LookupTypeId: lookupType.LookupTypeID };

		var cols = [];
		if (lookupType.ScopeID != 0) {
			cols.push({ header: lookupType.ScopeDescription, dataIndex: 'ScopeDisplayValue', width: 150, hyperlinkAsDoubleClick: true });
		}
		cols.push({ header: lookupType.Caption, dataIndex: 'DisplayValue', width: 150, hyperlinkAsDoubleClick: true });
		if (lookupType.CustomValueCaption.length > 0) {
			if (lookupType.CustomValueComboType && Number(lookupType.CustomValueComboType) > 0) {
				cols.push({ header: lookupType.CustomValueCaption, dataIndex: 'CustomDisplayValue', width: 150, hyperlinkAsDoubleClick: true });
			} else if (lookupType.CustomValueComboType.length > 0) {
				cols.push({ header: lookupType.CustomValueCaption, dataIndex: 'CustomValue', width: 150, renderer: ExtHelper.renderer.Boolean });
			} else {
				cols.push({ header: lookupType.CustomValueCaption, dataIndex: 'CustomValue', width: 150, align: 'right' });
			}
		}

		if (lookupType.CustomStringValueCaption.length > 0) {
			var col = { header: lookupType.CustomStringValueCaption, dataIndex: 'CustomStringValue', width: 150, hyperlinkAsDoubleClick: true };
			if (lookupType.CustomStringValueXType == 'checkbox') {
				col.renderer = ExtHelper.renderer.Boolean;
				col.hyperlinkAsDoubleClick = false;
			}
			if (lookupType.CustomStringValueXType == 'datefield') {
				col.renderer = ExtHelper.renderer.Date;
				col.hyperlinkAsDoubleClick = false;
			}
			cols.push(col);
		}
		if (!lookupType.IsClientBased) {
			var showAdminColumns = DA.Security.info.IsSuperAdmin;
			if (showAdminColumns) {
				if (DCPLApp.initialConfig.showLookupReferenceValue) {
					cols.push({ header: 'Reference Value', dataIndex: 'ReferenceValue', width: 150 });
				}
				if (DCPLApp.initialConfig.showLookupSystemValue) {
					cols.push({ header: 'System Value', dataIndex: 'SystemValue', width: 150, renderer: ExtHelper.renderer.Boolean });
				}
			}
		}
	
		var defaultTitle = 'Is Default?';
		if (lookupType.Category && lookupType.Category.indexOf('.') == -1) {
			defaultTitle = lookupType.Category;
		}
		cols.push({ header: 'Active?', dataIndex: 'IsActive', width: 50, renderer: ExtHelper.renderer.Boolean });
		cols.push({ header: 'Display order', dataIndex: 'SortOrder', width: 100, align: 'right' });
		cols.push({ header: defaultTitle, dataIndex: 'IsDefault', width: 100, renderer: ExtHelper.renderer.Boolean });
		this.cols(cols);

		var cm = new Ext.grid.ColumnModel(cols);

		this.cm = cm;
	},

	createForm: function (config) {
		var items = [];
		var lookupType = this.lookupType;
		var defaultTitle = 'Is Default?';
		if (lookupType.Category && lookupType.Category.indexOf('.') == -1) {
			defaultTitle = lookupType.Category;
		}
		var isDefault = ExtHelper.CreateCombo({ fieldLabel: defaultTitle, name: 'IsDefault', hiddenName: 'IsDefault', store: 'yesno' });

		lookupType.Caption = lookupType.DisplayValueCaption.length > 0 ? lookupType.DisplayValueCaption : lookupType.LookupType;

		if (lookupType.ScopeID != 0) {
			var scopeCombo = ExtHelper.CreateCombo({ fieldLabel: lookupType.ScopeDescription, hiddenName: 'ScopeId', baseParams: { comboType: lookupType.ScopeID} });
			items.push(scopeCombo);
			if (!this.defaultField) {
				this.defaultField = scopeCombo;
			}
		}

		var displayValueTextBox = new Ext.form.TextField({ fieldLabel: lookupType.Caption, name: 'DisplayValue', width: 350 });
		items.push(displayValueTextBox);
		if (!this.defaultField) {
			this.defaultField = displayValueTextBox;
		}

		if (lookupType.CustomValueCaption.length > 0) {
			if (lookupType.CustomValueComboType && Number(lookupType.CustomValueComboType) > 0) {
				var customValueCombo = ExtHelper.CreateCombo({ fieldLabel: lookupType.CustomValueCaption, hiddenName: 'CustomValue', baseParams: { comboType: lookupType.CustomValueComboType} });
				items.push(customValueCombo);
			} else if (lookupType.CustomValueComboType.length > 0) {
				if (lookupType.CustomValueComboType == 'checkbox') {
					items.push(DA.combo.create({ fieldLabel: lookupType.CustomValueCaption, hiddenName: 'CustomValue', store: 'yesnoint' }));
				}
			} else {
				items.push(new Ext.form.NumberField({ fieldLabel: lookupType.CustomValueCaption, name: 'CustomValue', minValue: lookupType.CustomValueMin, maxValue: lookupType.CustomValueMax, allowDecimals: false }));
			}
		}
		if (lookupType.CustomStringValueCaption.length > 0) {
			if (lookupType.CustomStringValueXType == 'checkbox') {
				items.push(new Ext.form.Checkbox({ fieldLabel: lookupType.CustomStringValueCaption, name: 'CustomStringValue', renderer: ExtHelper.renderer.Boolean }));
			}
			else if (lookupType.CustomStringValueXType == 'datefield') {
				items.push(new Ext.form.DateField({ fieldLabel: lookupType.CustomStringValueCaption, name: 'CustomStringValue', renderer: ExtHelper.renderer.Date }));
			}
			else {
				items.push(new Ext.form.TextField({ fieldLabel: lookupType.CustomStringValueCaption, name: 'CustomStringValue' }));
			}

		}
		if (!lookupType.IsClientBased) {
			var showAdminColumns = DA.Security.info.IsSuperAdmin;
			if (showAdminColumns) {
				if (DCPLApp.initialConfig.showLookupReferenceValue) {
					items.push(new Ext.form.TextField({ fieldLabel: 'Reference Value', name: 'ReferenceValue' }));
				}
				if (DCPLApp.initialConfig.showLookupSystemValue) {
					items.push({ fieldLabel: 'System Value', name: 'SystemValue', xtype: 'checkbox' });
				}
			}
		}
		items.push({ fieldLabel: 'Active', name: 'IsActive', xtype: 'checkbox' });
		items.push({ fieldLabel: 'Display order', name: 'SortOrder', xtype: 'numberfield', minValue: 0, maxValue: 255, allowDecimals: false });
		items.push(isDefault);
		items.push({ html: lookupType.Notes, border: false });

		var onMapping = function () {
			if (typeof eval(lookupType.Category) == 'object') {
				var obj = eval(lookupType.Category);
				obj.ShowForm(this.activeRecordId, { pkId: this.activeRecordId, displayValue: displayValueTextBox.getValue() });
			}
		}

		if (lookupType.Category && lookupType.Category.indexOf('.') > -1 && typeof eval(lookupType.Category) == 'object') {
			items.push(new Ext.Button({ text: 'Mappings', handler: onMapping, scope: this }));
		}
		this.items(items);
		Ext.apply(config, {
			items: items
		});

		return config;
	}
});