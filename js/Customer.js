Cooler.Customer = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Customer: {0}',
		listTitle: 'Customers',
		keyColumn: 'CustomerId',
		captionColumn: 'CustomerName',
		controller: 'Customer',
		securityModule: 'Customer',
		gridConfig: {
			sm: new Ext.grid.RowSelectionModel()
		},
		winConfig: {
			width: 600,
			height: 500,
			layout: 'border',
			defaults: { border: false }
		}
	});
	Cooler.Customer.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.Customer, Cooler.Form, {
	listRecord: Ext.data.Record.create([
		{ name: 'CustomerId', type: 'int' },
		{ name: 'RevenueCurrencyId', type: 'int' },
		{ name: 'RevenueCurrency', type: 'string' },
		{ name: 'Category', type: 'string' },
		{ name: 'CategoryId', type: 'int' },
		{ name: 'LocationCount', type: 'int' },
		{ name: 'CustomerName', type: 'string' },
		{ name: 'Revenue', type: 'string' },
		{ name: 'IsKeyAccount', type: 'bool' },
		{ name: 'LocationId', type: 'int' },
		{ name: 'ClientId', type: 'int' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedByUser', type: 'string' }
	]),

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Customer Name', dataIndex: 'CustomerName' },
			{ header: 'Revenue', dataIndex: 'Revenue', align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Revenue Currency', dataIndex: 'RevenueCurrency' },
			{ header: 'Category', dataIndex: 'Category' },
			{ header: 'Outlet Count', dataIndex: 'LocationCount', align: 'right' },
			{ header: 'Is Key Account?', dataIndex: 'IsKeyAccount', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }

		]);
		cm.defaultSortable = true;
		return cm;
	},
	comboStores: {
		RevenueCurrency: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		CategoryType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		AddressType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		ContactType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
	},
	createForm: function (config) {
		var tagsPanel = Cooler.Tag();
		this.tagsPanel = tagsPanel;
		var AddressType = DA.combo.create({ store: this.comboStores.AddressType });
		var revenueCurrencyCombo = DA.combo.create({ fieldLabel: 'Revenue Currency', hiddenName: 'RevenueCurrencyId', store: this.comboStores.RevenueCurrency });
		var categoryCombo = DA.combo.create({ fieldLabel: 'Category', hiddenName: 'CategoryId', store: this.comboStores.CategoryType });
		var classification = new Ext.Button({ text: 'Classification', iconCls: 'add', border: false, handler: function () { Cooler.Classification.show({ action: 'getCategory', id: 1, title: 'Category', subTitle: 'Grouping by Category' }) }, scope: this, tabIndex: 9998 });
		this.categoryCombo = categoryCombo;
		Cooler.Customer.categoryCombo = categoryCombo;
		var items = [
			{ fieldLabel: 'Customer Name', name: 'CustomerName', xtype: 'textfield', maxLength: 50, allowBlank: false },
			{ fieldLabel: 'Revenue', name: 'Revenue', xtype: 'numberfield', maxLength: 20, allowBlank: false },
			revenueCurrencyCombo,
			categoryCombo,
			{ fieldLabel: 'Is Key Account?', name: 'IsKeyAccount', xtype: 'checkbox', maxLength: 50, allowBlank: false },
			//{ fieldLabel: 'Owner', name: 'ClientName', xtype: 'textfield', maxLength: 50, allowBlank: false },
			tagsPanel,
			classification
		];

		Ext.apply(config, {
			defaults: { width: 150 },
			items: items
		});
		return config;
	},
	CreateFormPanel: function (config) {
		var locationGrid = Cooler.LocationType.Location.createGrid({ title: 'Outlets', height: 300, region: 'center', editable: true }, true);
		var grids = [];
		this.locationGrid = locationGrid;
		this.childGrids = grids;

		config.region = 'north';
		config.height = 220;
		this.on('beforeSave', function (rmsForm, params, options) {
			this.saveTags(this.tagsPanel, params);
		});
		this.on('beforeLoad', function (param) {
			this.tagsPanel.removeAllItems();
		});
		var relationInfo = this.createRelations([
			{ module: Cooler.Address, gridConfig: { root: 'Address' }, type: 'oneToMany', combostore: this.comboStores, copy: true },
			{ module: Cooler.ContactAddress, gridConfig: { root: 'Contact' }, type: 'oneToMany', comboStores: this.comboStores, copy: true }
		]);
		Cooler.Address.setAssociation({ CountryId: '', StateId: '', AssociationTypeId: Cooler.Enums.AssociationType.Customer });
		Cooler.ContactAddress.setAssociation({ AssociationTypeId: Cooler.Enums.AssociationType.Customer });
		relationInfo.tabPanel.items.push(locationGrid);
		this.on('dataLoaded', function (customerForm, data) {
			var locationId = data.data.locationId,
			locationStore = this.locationGrid.getStore();
			locationStore.baseParams.locationId = locationId;
			this.SetAssociationInfo(data.data.id, relationInfo);
			locationStore.load();
			this.loadTags(this.tagsPanel, data);
		});
		this.formPanel = new Ext.FormPanel(Ext.apply(config, { region: 'north', height: 210 }));
		this.winConfig = Ext.apply(this.winConfig, {
			items: [
				this.formPanel,
				relationInfo.tabPanel
			]
		});
	}
});

Cooler.Customer = new Cooler.Customer();
