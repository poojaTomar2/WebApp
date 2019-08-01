Cooler.Location = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Outlet: {0}',
		listTitle: 'Outlet',
		keyColumn: 'LocationId',
		captionColumn: 'Name',
		controller: 'Location',
		securityModule: 'Outlet',
		logoUrl: './FileServer/',
		comboTypes: ['LocationType', 'Zone', 'SalesPerson', 'Role', 'ContactType', 'Market', 'Promotion', 'ProductCategory', 'Media', 'PriceType', 'OutletType', 'Country', 'Client'],
		gridConfig: {
			sm: new Ext.grid.RowSelectionModel(),
			custom: {
				loadComboTypes: true
			}
		},
		winConfig: {
			width: 900,
			height: 650,
			layout: 'border',
			defaults: { border: false }
		}
	});
	Cooler.Location.superclass.constructor.call(this, config);
};
var onOutletImport = function (importButton) {
	Cooler.Import.Show();
};
Ext.extend(Cooler.Location, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'LocationId', type: 'int' },
		{ name: 'Name', type: 'string' },
		{ name: 'LocationTypeId', type: 'int' },
		{ name: 'LocationType', type: 'string' },
		{ name: 'ChannelCode', type: 'string' },
		{ name: 'SalesRepId', type: 'int' },
		{ name: 'Country', type: 'string' },
		{ name: 'CountryId', type: 'int' },
		{ name: 'State', type: 'string' },
		{ name: 'Code', type: 'string' },
		{ name: 'StateId', type: 'int' },
		{ name: 'City', type: 'string' },
		{ name: 'Zip', type: 'string' },
		{ name: 'Street', type: 'string' },
		{ name: 'Street2', type: 'string' },
		{ name: 'Street3', type: 'string' },
		{ name: 'PostalCode', type: 'string' },
		{ name: 'IsKeyLocation', type: 'bool' },
		{ name: 'Retailer', type: 'string' },
		{ name: 'ClassificationId', type: 'int' },
		{ name: 'DirectionNotes', type: 'string' },
		{ name: 'ClientId', type: 'int' },
		{ name: 'Client', type: 'string' },
		{ name: 'Latitude', type: 'float' },
		{ name: 'Longitude', type: 'float' },
		{ name: 'TimeZone', type: 'string' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedByUser', type: 'string' },
		{ name: 'MarketId', type: 'int' },
		{ name: 'SalesTarget', type: 'int' },
		{ name: 'MarketName', type: 'string' },
		{ name: 'PrimarySalesRep', type: 'string' },
		{ name: 'LocationSalesRep', type: 'string' },
		{ name: 'PrimaryPhone', type: 'string' },
		{ name: 'PriceTypeId', type: 'int' },
		{ name: 'LocationText', type: 'string' },
		{ name: 'PriceType', type: 'string' },
		{ name: 'OwnerId', type: 'int' },
		{ name: 'Classification', type: 'string' },
		{ name: 'CustomerTierCode', type: 'string' },
		{ name: 'IsSmart', type: 'bool' },
		{ name: 'SubTradeChannelTypeId', type: 'int' },
		{ name: 'SubTradeChannelName', type: 'string' },
		{ name: 'SubTradeChannelTypeCode', type: 'string' },
		{ name: 'SalesOrganizationName', type: 'string' },
		{ name: 'SalesOfficeName', type: 'string' },
		{ name: 'SalesGroupName', type: 'string' },
		{ name: 'SalesTerritoryName', type: 'string' },
		{ name: 'SalesTerritoryCode', type: 'string' },
		{ name: 'NearestLatitude', type: 'float' },
		{ name: 'NearestLongitude', type: 'float' },
		{ name: 'Technician', type: 'string' },
		{ name: 'OutletTypeId', type: 'int' },
		{ name: 'OutletType', type: 'string' },
		{ name: 'SalesOrganizationCode', type: 'string' },
		{ name: 'SalesOfficeCode', type: 'string' },
		{ name: 'SalesGroupCode', type: 'string' },
		{ name: 'SalesTerritoryCode', type: 'string' },
		{ name: 'TeleSellingTerritoryCode', type: 'string' },
		{ name: 'TeleSellingTerritoryName', type: 'string' },
		{ name: 'BD_TerritoryCode', type: 'string' },
		{ name: 'BD_TerritoryName', type: 'string' },
		{ name: 'CA_TerritoryCode', type: 'string' },
		{ name: 'CA_TerritoryName', type: 'string' },
		{ name: 'MC_TerritoryCode', type: 'string' },
		{ name: 'MC_TerritoryName', type: 'string' },
		{ name: 'P1_TerritoryCode', type: 'string' },
		{ name: 'P1_TerritoryName', type: 'string' },
		{ name: 'P2_TerritoryCode', type: 'string' },
		{ name: 'P2_TerritoryName', type: 'string' },
		{ name: 'P3_TerritoryCode', type: 'string' },
		{ name: 'P3_TerritoryName', type: 'string' },
		{ name: 'P4_TerritoryCode', type: 'string' },
		{ name: 'P4_TerritoryName', type: 'string' },
		{ name: 'P5_TerritoryCode', type: 'string' },
		{ name: 'P5_TerritoryName', type: 'string' },
		{ name: 'SalesHierrchy', type: 'string' }
	]),

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Name', dataIndex: 'Name', width: 200 },
            { header: 'Code', dataIndex: 'Code', width: 120 },
			{ header: 'Outlet Type', dataIndex: 'OutletTypeId', type: 'int', displayIndex: 'OutletType', renderer: 'proxy', store: this.comboStores.OutletType, width: 100 },
			{ header: 'Is Key Outlet?', dataIndex: 'IsKeyLocation', renderer: ExtHelper.renderer.Boolean, width: 120 },
			{ header: 'Is Smart?', dataIndex: 'IsSmart', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Country', dataIndex: 'CountryId', type: 'int', displayIndex: 'Country', renderer: 'proxy', store: this.comboStores.Country, width: 100 },
			{ header: 'State', dataIndex: 'State' },
			{ header: 'City', dataIndex: 'City' },
			{ header: 'Street', dataIndex: 'Street', width: 120 },
			{ header: 'Street 2', dataIndex: 'Street2', width: 120 },
			{ header: 'Street 3', dataIndex: 'Street3', width: 120 },
			{ header: 'Postal Code', dataIndex: 'PostalCode', width: 150 },
			{ header: 'Retailer', dataIndex: 'Retailer' },
			{ header: 'Primary Phone', dataIndex: 'PrimaryPhone', width: 120 },
			{ header: 'Primary Sales Rep', dataIndex: 'PrimarySalesRep', width: 120 },
			{ header: 'Sales Rep Name', dataIndex: 'LocationSalesRep', width: 120 },
			{ header: 'Technician', dataIndex: 'Technician', width: 120 },
			{ header: 'Market', dataIndex: 'MarketName' },
			{ header: 'Sales Target', dataIndex: 'SalesTarget', align: 'right' },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientId', type: 'int', displayIndex: 'Client', renderer: 'proxy', store: this.comboStores.Client, width: 120 },
			{ header: 'Latitude', dataIndex: 'Latitude', width: 60, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Longitude', dataIndex: 'Longitude', width: 70, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Trade Channel', dataIndex: 'LocationType' },
			{ header: 'Trade Channel Code', hidden: true, dataIndex: 'ChannelCode' },
			{ header: 'Customer Tier', dataIndex: 'Classification', width: 120 },
			{ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120 },
			{ header: 'Sub Trade Channel', dataIndex: 'SubTradeChannelName', width: 120 },
			{ header: 'Sub Trade Channel Code', hidden: true, dataIndex: 'SubTradeChannelTypeCode', width: 120 },
			{ header: 'Sales Organization', dataIndex: 'SalesOrganizationName', width: 150 },
			{ header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' },
			{ header: 'Sales Office', dataIndex: 'SalesOfficeName', width: 150 },
			{ header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' },
			{ header: 'Sales Group', dataIndex: 'SalesGroupName', width: 150 },
			{ header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
			{ header: 'Sales Territory', dataIndex: 'SalesTerritoryName', width: 150 },
			{ header: 'Sales Territory Code', hidden: true, dataIndex: 'SalesTerritoryCode', width: 150 },
			{ header: 'TeleSelling Territory Code', dataIndex: 'TeleSellingTerritoryCode', width: 150, hidden: true },
			{ header: 'TeleSelling Territory Name', dataIndex: 'TeleSellingTerritoryName', width: 150 },
			{ header: 'Business Developer Territory Code', dataIndex: 'BD_TerritoryCode', type: 'string', width: 150, hidden: true },
			{ header: 'Business Developer Territory Name', dataIndex: 'BD_TerritoryName', width: 150 },
			{ header: 'Credit Approver Territory Code', dataIndex: 'CA_TerritoryCode', width: 150, hidden: true },
			{ header: 'Credit Approver Territory Name', dataIndex: 'CA_TerritoryName', width: 150 },
			{ header: 'Merchandizer Territory Code', dataIndex: 'MC_TerritoryCode', width: 150, hidden: true },
			{ header: 'Merchandizer Territory Name', dataIndex: 'MC_TerritoryName', width: 150 },
			{ header: 'P1_Territory Code', dataIndex: 'P1_TerritoryCode', width: 150, hidden: true },
			{ header: 'P1_Territory Name', dataIndex: 'P1_TerritoryName', width: 150 },
			{ header: 'P2_Territory Code', dataIndex: 'P2_TerritoryCode', width: 150, hidden: true },
			{ header: 'P2_Territory Name', dataIndex: 'P2_TerritoryName', width: 150 },
			{ header: 'P3_Territory Code', dataIndex: 'P3_TerritoryCode', width: 150, hidden: true },
			{ header: 'P3_Territory Name', dataIndex: 'P3_TerritoryName', width: 150 },
			{ header: 'P4_Territory Code', dataIndex: 'P4_TerritoryCode', width: 150, hidden: true },
			{ header: 'P4_Territory Name', dataIndex: 'P4_TerritoryName', width: 150 },
			{ header: 'P5_Territory Code', dataIndex: 'P5_TerritoryCode', width: 150, hidden: true },
			{ header: 'P5_Territory Name', dataIndex: 'P5_TerritoryName', width: 150 },
			{ header: 'TimeZone', dataIndex: 'TimeZone', width: 250 },
			{ header: 'Nearest Latitude', dataIndex: 'NearestLatitude', width: 60, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Nearest Longitude', dataIndex: 'NearestLongitude', width: 70, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]);

		cm.defaultSortable = true;
		return cm;
	},
	comboStores: {
		LocationType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		SalesPerson: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Role: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		ContactType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Market: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Promotion: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		ProductCategory: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Media: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		PriceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		FeedbackOption: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		SubTradeChannelType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		OutletType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var filterFields = ['OutletCode'];
		this.filterFields = filterFields;
		this.outletCodeTextField = new Ext.form.TextField({ width: 150 });
		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				var outletCount = this.outletCodeTextField.getValue();
				var isComma = /[,\-]/.test(outletCount)	// To check comma exists or not in search string
				var array = [outletCount];
				var counts = '';
				if (isComma) {
					counts = (array.join().match(/,/g).length + 1)	// Count total commas + 1, in search string
					if (counts <= 1000) {
						outletCount = outletCount.replace(/,\s*$/, ""); // Remove Comma al the end of string
						this.resetGridStore();
						if (!Ext.isEmpty(this.outletCodeTextField.getValue())) {
							Ext.applyIf(this.grid.getStore().baseParams, { OutletCode: outletCount });
						}
						this.grid.loadFirst();
					}
					else {
						Ext.Msg.alert('Alert', "You can't search more then 1000 records.");
					}
				}
				if (!isComma) {
					outletCount = outletCount.replace(/,\s*$/, "");
					this.resetGridStore();
					if (!Ext.isEmpty(this.outletCodeTextField.getValue())) {
						Ext.applyIf(this.grid.getStore().baseParams, { OutletCode: outletCount });
					}
					this.grid.loadFirst();
				}
			}, scope: this
		});
		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: function () {
				this.resetGridStore();
				this.outletCodeTextField.reset();
				this.grid.loadFirst();
			}, scope: this
		});
		tbarItems.push('Outlet Code');
		tbarItems.push(this.outletCodeTextField);
		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	resetGridStore: function () {
		var stroeBaseParams = this.grid.getStore().baseParams, filterFieldsLength = this.filterFields.length, filterField;
		for (var i = 0; i < filterFieldsLength; i++) {
			filterField = this.filterFields[i];
			delete stroeBaseParams[filterField];
		}
	},
	configureListTab: function (config) {
		if (this.canAdd()) {
			this.grid.getTopToolbar().splice(1, 0, { text: 'Import', iconCls: 'import-icon', handler: onOutletImport, width: 75, scope: this });
		}
	},

	onBeforeQuery: function (obj) {
		obj.combo.baseParams.oldValue = obj.combo.getValue();
	},

	createForm: function (config) {
		var salesHierarchyAllLevels = DA.combo.create({ baseParams: { comboType: 'SalesHierarchyAll', limit: 0 }, listWidth: 180, controller: "Combo" });
		var salesTerritories = DA.combo.create({ baseParams: { comboType: 'SalesTerritoryAll', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.salesHierarchyAllLevels = salesHierarchyAllLevels;
		this.salesTerritories = salesTerritories;
		//this.salesHierarchyAllLevels.store.on('load', this.loadSalesHierarchyAllLevels, this);
		this.salesTerritories.store.on('load', this.loadsalesTerritories, this);
		var searchSaleshierarchyData = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 200,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true
		});
		searchSaleshierarchyData.on('keyup', this.onSearchSaleshierarchyDataDataKeyUp, this);

		var salesHierarchy_All = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Sales Hierarchy',
			hiddenName: 'SalesTerritoryAll',
			name: 'SalesTerritoryAll',
			displayField: 'DisplayValue',
			cls: 'clsSalesHierarchy',
			id: 'SalesTerritoryAll',
			store: salesTerritories.getStore(),
			width: 200,
			height: 130
		});
		var salesHierarchy = new Ext.form.Hidden({ name: 'SalesHierarchy' });
		this.salesHierarchy = salesHierarchy;
		salesHierarchy_All.on('change', this.onSalesHierarchyChange, this);
		this.salesHierarchy_All = salesHierarchy_All;
		var salesHierarchyCheckedvals = [];
		this.salesHierarchyCheckedvals = salesHierarchyCheckedvals;
		//salesHierarchy_All.on('change', this.onSalesHierarchyChange, this);

		var isFeedbackEnabled = DA.Security.info.Tags.FeedbackEnabled === "1";
		this.isFeedbackEnabled = isFeedbackEnabled;
		var tagsPanel = Cooler.Tag();
		this.tagsPanel = tagsPanel;
		var street = { xtype: 'textfield', fieldLabel: 'Street', name: 'Street', maxLength: 150, allowBlank: false },
			street2 = { xtype: 'textfield', fieldLabel: 'Street 2', name: 'Street2', maxLength: 150 },
			street3 = { xtype: 'textfield', fieldLabel: 'Street 3', name: 'Street3', maxLength: 150 },
			numberField = { xtype: 'textfield', fieldLabel: 'Code', name: 'Code', maxLength: 50, allowBlank: false, vtype: 'alphanum' },
			name = { xtype: 'textfield', fieldLabel: 'Name', name: 'Name', maxLength: 100, allowBlank: false },
			countryCombo = DA.combo.create({ fieldLabel: 'Country', name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', allowBlank: false, baseParams: { comboType: 'Country' }, listWidth: 220 }),
			locationTypeCombo = DA.combo.create({ fieldLabel: 'Trade Channel', name: 'LocationTypeId', hiddenName: 'LocationTypeId', baseParams: { comboType: 'LocationType' }, listWidth: 220 }),
			outletTypeCombo = DA.combo.create({ fieldLabel: 'Outlet Type', hiddenName: 'OutletTypeId', store: this.comboStores.OutletType, mode: 'local', width: 200 }),
			subTradeChannelTypeCombo = DA.combo.create({ fieldLabel: 'Sub Trade Channel Type', name: 'SubTradeChannelTypeId', hiddenName: 'SubTradeChannelTypeId', baseParams: { comboType: 'SubTradeChannelType' }, listWidth: 150 }),
			stateCombo = DA.combo.create({ fieldLabel: 'State', name: 'StateId', hiddenName: 'StateId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'State' } }),
			city = { xtype: 'textfield', fieldLabel: 'City', name: 'City', maxLength: 50, allowBlank: false, maskRe: /[a-z A-Z]/ },
			clientCombo = DA.combo.create({
				fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220,
				baseParams: { comboType: 'Client' }, listeners: {
					blur: Cooler.changeTimeZone,
					scope: this
				}
			}),
			feedbackOption = DA.combo.create({ fieldLabel: 'Feedback Option', hiddenName: 'FeedbackOptionId', store: this.comboStores.FeedbackOption, listWidth: 200, width: 200 }),
			priceTypeCombo = DA.combo.create({ fieldLabel: 'Price Type', hiddenName: 'PriceTypeId', store: this.comboStores.PriceType, width: 200 }),
			directionNotes = { xtype: 'textarea', fieldLabel: 'Direction Notes', name: 'DirectionNotes', maxLength: 4000 },
			isKeyLocation = DA.combo.create({ fieldLabel: 'Is Key Outlet?', hiddenName: 'IsKeyLocation', store: "yesno" }),
			classification = { xtype: 'button', text: 'Classification', iconCls: 'add', border: false, handler: function () { Cooler.Classification.show({ action: 'getClassification', id: 1, title: 'Location', subTitle: 'Grouping by Geography' }); }, scope: this, tabIndex: 9998 },
			latitude = { xtype: 'numberfield', fieldLabel: 'Latitude', name: 'Latitude', maxLength: 11, allowBlank: false, decimalPrecision: 6, maxValue: Cooler.Enums.ValidLatLong.Latitude, minValue: -Cooler.Enums.ValidLatLong.Latitude },
			longitude = { xtype: 'numberfield', fieldLabel: 'Longitude', name: 'Longitude', maxLength: 11, allowBlank: false, decimalPrecision: 6, maxValue: Cooler.Enums.ValidLatLong.Longitude, minValue: -Cooler.Enums.ValidLatLong.Longitude },
			postalCode = { xtype: 'textfield', fieldLabel: 'Postal Code', name: 'PostalCode', maxLength: 12, maskRe: /[a-z A-Z 0-9]/, allowDecimals: false },
			primaryPhone = { xtype: 'textfield', fieldLabel: 'Primary Phone', name: 'PrimaryPhone', maxLength: 15 },
			primaryMobile = { xtype: 'textfield', fieldLabel: 'Primary Mobile', name: 'PrimaryMobile', maxLength: 15 },
			primaryEmail = { xtype: 'textfield', fieldLabel: 'Primary Email', name: 'PrimaryEmail' },
			locationText = { xtype: 'textarea', fieldLabel: 'Location Description', name: 'LocationText', maxLength: 1000, width: 200 },
			locationImageField = new Ext.ux.Image({ height: 100, width: 100, src: "", style: { 'width': 'auto', 'max-width': 130 } }),
			logoImageField = new Ext.ux.Image({ height: 100, width: 100, src: "", style: { 'width': 'auto', 'max-width': 130 } }),
			backgroundImageField = new Ext.ux.Image({ height: 100, width: 100, src: "", style: { 'width': 'auto', 'max-width': 130 } }),
			market = DA.combo.create({ fieldLabel: 'Market', hiddenName: 'MarketId', store: this.comboStores.Market, mode: 'local', listWidth: 220 }),
			primaryRepId = new Ext.form.Hidden({ name: 'PrimaryRepId' });
		locationImage = new Ext.form.FileUploadField({
			fieldLabel: 'Outlet Image',
			width: 200,
			name: 'LocationImage',
			vtype: 'fileUpload'
		});
		logoImage = new Ext.form.FileUploadField({
			fieldLabel: 'Outlet Logo Image',
			width: 200,
			name: 'LocationLogo',
			vtype: 'fileUpload'
		});
		backgroundImage = new Ext.form.FileUploadField({
			fieldLabel: 'Outlet Background Image',
			width: 200,
			name: 'LocationBackground',
			vtype: 'fileUpload'
		});
		this.locationImageField = locationImageField;
		this.locationImage = locationImage;
		this.logoImageField = logoImageField;
		this.logoImage = logoImage;
		this.backgroundImage = backgroundImage;
		this.backgroundImageField = backgroundImageField;
		this.clientCombo = clientCombo;
		this.outletTypeCombo = outletTypeCombo;
		Cooler.Location.countryCombo = countryCombo;
		Cooler.Location.market = market;
		Cooler.Location.primaryRepId = primaryRepId;
		ExtHelper.SetCascadingCombo(countryCombo, stateCombo);

		Ext.apply(config, {
			layout: 'column',
			border: false,
			items: [
				{
					border: false,
					layout: 'form',
					defaultType: 'textfield',
					labelWidth: 90,
					bodyStyle: 'padding: 5px',
					defaults: {
						width: 200
					},
					items: [
						clientCombo,
						numberField,
						name,
						isKeyLocation,
						street,
						street2,
						street3,
						countryCombo,
						stateCombo,
						city,
						postalCode,
						latitude,
						longitude,
						DA.combo.create({ fieldLabel: 'Time Zone', hiddenName: 'TimeZoneId', itemId: 'TimeZoneId', baseParams: { comboType: 'TimeZone' }, listWidth: 280, allowBlank: false }),
						primaryRepId,
						primaryEmail
					]
				},
				{
					border: false,
					layout: 'form',
					defaultType: 'textfield',
					labelWidth: 90,
					bodyStyle: 'padding: 5px',
					defaults: {
						width: 130
					},
					items: [
						market,
						locationTypeCombo,
						outletTypeCombo,
						subTradeChannelTypeCombo,
						DA.combo.create({ fieldLabel: 'Customer Tier', hiddenName: 'ClassificationId', baseParams: { comboType: 'LocationClassification' }, listWidth: 220, controller: "Combo" }),
						{ xtype: 'textfield', fieldLabel: 'Sales Rep Name', name: 'LocationSalesRep', maxLength: 200 },
						directionNotes,
						tagsPanel,
						//DA.combo.create({ fieldLabel: 'Sales Territory', name: 'SalesHierarchyId', hiddenName: 'SalesHierarchyId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'SalesHierarchy' } }),
						{ xtype: 'numberfield', fieldLabel: 'Sales Target', name: 'SalesTarget', maxLength: 9, allowDecimals: false },
						DA.combo.create({
							fieldLabel: 'Retailer', name: 'RetailerId', hiddenName: 'RetailerId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Retailer' },
							listeners: {
								'beforequery': this.onBeforeQuery,
								scope: this
							}
						}),
						primaryMobile,
						primaryPhone
					]
				},
				{
					border: false,
					layout: 'form',
					defaultType: 'textfield',
					labelWidth: 90,
					bodyStyle: 'padding: 5px',
					items: [
						searchSaleshierarchyData,
						salesHierarchy_All,
					salesHierarchy
					]
				}
			],
			fileUpload: true
		});

		if (isFeedbackEnabled) {
			config.items.push({
				border: false,
				layout: 'form',
				defaultType: 'textfield',
				labelWidth: 90,
				bodyStyle: 'padding: 5px',
				items: [
					locationText,
					locationImageField,
					locationImage,
					logoImageField,
					logoImage,
					backgroundImageField,
					backgroundImage,
					priceTypeCombo,
					{ xtype: 'numberfield', fieldLabel: 'Price For Two', name: 'PriceForTwo', maxLength: 5, width: 200 },
					feedbackOption,
					{ xtype: 'numberfield', fieldLabel: 'Feedback Intake Days', name: 'FeedbackIntakeDay', minValue: 0, maxValue: 30, width: 200 },
					//salesHierarchy_All,
					//salesHierarchy
				]
			});
		}

		return config;
	},
	loadThumbnail: function (me, record, noImageUrl, fieldName, folder) {
		var isFeedbackEnabled = DA.Security.info.Tags.FeedbackEnabled === "1";
		if (isFeedbackEnabled) {
			if (record.Id != 0) {
				var logo = folder + '/' + record.Id + ".png",
					imageUrl = me.logoUrl + logo;
				Cooler.imageExists(imageUrl, function (exists) {
					fieldName.setSrc(exists ? imageUrl : noImageUrl, true);
				});
			}
			else {
				fieldName.setSrc("");
			}
		}
	},
	onSearchSaleshierarchyDataDataKeyUp: function (field) {
		var value = field.getValue();
		store = this.salesTerritories.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.salesHierarchy_All.setValue('' + this.salesHierarchyCheckedvals.join(',') + '');
		}
		if (value == "") {
			this.salesTerritories.getStore().clearFilter();
			this.salesHierarchy_All.setValue('' + this.salesHierarchyCheckedvals.join(',') + '');
		}
	},
	onFileSelected: function (field, action) {
		var fileInput = field.fileInput.dom, logoField;
		var files = fileInput.files;
		if (files.length > 0) {
			var file = files[0];
			var imageType = /image.*/;
			if (!file.type.match(imageType)) {
				return;
			}
			switch (fileInput.name) {
				case 'LocationImage': logoField = this.locationImageField;
					this.locationImageField.setVisible(true);
					break;
				case 'LocationLogo': logoField = this.logoImageField;
					this.logoImageField.setVisible(true);
					break;
				case 'LocationBackground': logoField = this.backgroundImageField;
					this.backgroundImageField.setVisible(true);
					break;
				default: break;
			}
			var img = document.getElementById(logoField.id);
			img.file = file;
			var reader = new FileReader();
			reader.onload = (function (image) {
				return function (e) {
					image.src = e.target.result;
				};
			})(img);
			reader.readAsDataURL(file);
		}
	},
	onZoneClick: function () {
		Cooler.Territory.show({ action: 'getTerritory', id: 1, title: 'Location', subTitle: 'Grouping by Geography', scope: this });
	},
	CreateFormPanel: function (config) {
		var isFeedbackEnabled = DA.Security.info.Tags.FeedbackEnabled === "1";
		this.locationImageField.setVisible(false);
		this.logoImageField.setVisible(false);
		this.backgroundImageField.setVisible(false);
		var grids = [];

		this.childGrids = grids;
		var notesGrid = new DA.Note({ AssociationTypeId: Cooler.Enums.AssociationType.Location });
		var attachmentObj = new DA.Attachment({ AssociationTypeId: Cooler.Enums.AssociationType.Location });

		var relationInfo = [
			//{ module: Cooler.SalesRep, gridConfig: { root: 'SalesRep' }, type: 'oneToMany', comboStores: this.comboStores, copy: true },
			//{ module: Cooler.Route, gridConfig: { root: 'Route' }, type: 'oneToMany', comboStores: this.comboStores, copy: true },
			{ module: Cooler.OutletAsset, type: 'oneToMany', copy: true },
			{ module: Cooler.LocationVisitHistory, type: 'oneToMany', copy: true },
			{ module: Cooler.LocationBusinessHour, type: 'oneToMany', copy: true },
			{ module: Cooler.Address, gridConfig: { root: 'Address', plugins: [new Ext.ux.ComboLoader()] }, type: 'oneToMany', copy: true },
			{ module: Cooler.ContactAddress, gridConfig: { root: 'Contact' }, type: 'oneToMany', copy: true },
			{ module: attachmentObj, type: 'manyToMany', copy: true },
			{ module: notesGrid, type: 'manyToMany', copy: true }
		];
		if (isFeedbackEnabled) {
			relationInfo.push(
				{ module: Cooler.OutletPromotion, type: 'oneToMany', copy: true },
				{ module: Cooler.LocationProduct, type: 'oneToMany', copy: true },
				{ module: Cooler.LocationMedia, type: 'oneToMany', copy: true },
				{ module: Cooler.LocationImage, type: 'oneToMany', copy: true }
			);
		}

		var relationInfo = this.createRelations({ relations: relationInfo, associationTypeId: Cooler.Enums.AssociationType.Location });
		relationInfo.tabPanel.enableTabScroll = true;

		this.relationInfo = relationInfo;

		Ext.apply(config, {
			region: 'north',
			height: 380,
			split: true,
			autoScroll: true
		});

		this.formPanel = new Ext.FormPanel(config);
		this.on('beforeLoad', function (param) {
			this.tagsPanel.removeAllItems();
			this.salesHierarchy_All.setValue('');
			this.salesHierarchyAllLevels.getStore().clearFilter();
		});
		this.on('beforeSave', function (rmsForm, params, options) {
			this.saveTags(this.tagsPanel, params);
			var salesHierarchy = {};
			salesHierarchy.SalesTerritoryId = 0;
			salesHierarchy.SalesGroupId = 0;
			salesHierarchy.SalesOfficeId = 0;
			salesHierarchy.SalesOrganizationId = 0;
			salesHierarchy.TelesellingTerritoryId = 0;
			salesHierarchy.BD_TerritoryId = 0;
			salesHierarchy.CA_TerritoryId = 0;
			salesHierarchy.MC_TerritoryId = 0;
			salesHierarchy.P1_TerritoryId = 0;
			salesHierarchy.P2_TerritoryId = 0;
			salesHierarchy.P3_TerritoryId = 0;
			salesHierarchy.P4_TerritoryId = 0;
			salesHierarchy.P5_TerritoryId = 0;

			if (this.salesHierarchyCheckedvals.length > 0) {
				var salesHierarchyArray = $.unique((this.salesHierarchyCheckedvals.join(',')).split(','));
				for (var i = 0; i < salesHierarchyArray.length; i++) {
					var currentRecord = null;
					var recordFound = this.salesHierarchy_All.store.findBy(function (record, id) {
						var r = record;
						if (record.get('LookupId') == salesHierarchyArray[i]) {
							currentRecord = jQuery.extend({}, record);
							return record;
						}
					});
					if (currentRecord != null && currentRecord != undefined) {
						var salesHierarchyTypeId = currentRecord.data.ReferenceValue;
						var isSalesTerritoryFound = false;
						switch (parseInt(salesHierarchyTypeId)) {
							case 0:
								salesHierarchy.SalesTerritoryId = currentRecord.data.LookupId;
								var parentSalesHierarchyId = currentRecord.data.CustomValue;
								if (parentSalesHierarchyId != undefined && parentSalesHierarchyId != null) {
									var salesGroupRecord = null;
									var salesGroupFound = this.salesHierarchyAllLevels.store.findBy(function (record, id) {
										if (record.get('LookupId') == parseInt(parentSalesHierarchyId)) {
											salesGroupRecord = jQuery.extend({}, record);
											return record;
										}
									});
									if (salesGroupRecord != null && salesGroupRecord != undefined) {
										salesHierarchy.SalesGroupId = salesGroupRecord.data.LookupId;
										var salesGroupParent = salesGroupRecord.data.CustomStringValue;
										var salesOfficeRecord = null;
										if (salesGroupParent != "" && salesGroupParent != undefined && salesGroupParent != null) {
											var salesOfficeFound = this.salesHierarchyAllLevels.store.findBy(function (record, id) {
												if (record.get('LookupId') == parseInt(salesGroupParent)) {
													salesOfficeRecord = jQuery.extend({}, record);
													return record;
												}
											});
											if (salesOfficeRecord != null && salesOfficeRecord != undefined) {
												salesHierarchy.SalesOfficeId = salesOfficeRecord.data.LookupId;
												var salesOfficeParent = salesOfficeRecord.data.CustomStringValue;
												var salesOrgRecord = null;
												if (salesOfficeParent != "" && salesOfficeParent != undefined && salesOfficeParent != null) {
													var salesOrgFound = this.salesHierarchyAllLevels.store.findBy(function (record, id) {
														if (record.get('LookupId') == parseInt(salesOfficeParent)) {
															salesOrgRecord = jQuery.extend({}, record);
															return record;
														}
													});
													if (salesOrgRecord != null && salesOrgRecord != undefined) {
														salesHierarchy.SalesOrganizationId = salesOrgRecord.data.LookupId;
													}
													else {
														salesHierarchy.SalesOrganizationId = 0;
													}
												}
												else {
													salesHierarchy.SalesOrganizationId = 0;
												}

											}
											else {
												salesHierarchy.SalesOfficeId = 0;
												salesHierarchy.SalesOrganizationId = 0;
											}
										}
										else {
											salesHierarchy.SalesOfficeId = 0;
											salesHierarchy.SalesOrganizationId = 0;
										}
									}
									else {
										salesHierarchy.SalesGroupId = 0;
										salesHierarchy.SalesOfficeId = 0;
										salesHierarchy.SalesOrganizationId = 0;
									}
								}
								else {
									salesHierarchy.SalesGroupId = 0;
									salesHierarchy.SalesOfficeId = 0;
									salesHierarchy.SalesOrganizationId = 0;
								}

								break;
							case 1:
								salesHierarchy.TelesellingTerritoryId = currentRecord.data.LookupId;
								break;
							case 2:
								salesHierarchy.BD_TerritoryId = currentRecord.data.LookupId;
								break;
							case 3:
								salesHierarchy.CA_TerritoryId = currentRecord.data.LookupId;
								break;
							case 4:
								salesHierarchy.MC_TerritoryId = currentRecord.data.LookupId;
								break;
							case 5:
								salesHierarchy.P1_TerritoryId = currentRecord.data.LookupId;
								break;
							case 6:
								salesHierarchy.P2_TerritoryId = currentRecord.data.LookupId;
								break;
							case 7:
								salesHierarchy.P3_TerritoryId = currentRecord.data.LookupId;
								break;
							case 8:
								salesHierarchy.P4_TerritoryId = currentRecord.data.LookupId;
								break;
							case 9:
								salesHierarchy.P5_TerritoryId = currentRecord.data.LookupId;
								break;

							default: break;
						}

						this.salesHierarchy.setValue(JSON.stringify(salesHierarchy));
					}

				}
			}
			else {
				this.salesHierarchy.setValue(JSON.stringify(salesHierarchy));
			}
		});
		this.on('dataLoaded', function (locationForm, data) {
			//this.relationInfo.tabPanel.setActiveTab(0);
			this.loadTags(this.tagsPanel, data);
			var locationId = data.data.Id;
			var latitude = data.data.Latitude;
			var longitude = data.data.Longitude;
			//this.salesHierarchyId.setValue(data.data.SalesHierarchyId);
			var relationInfo = this.relationInfo.config.relations;
			for (var i = 0, len = relationInfo.length; i < len; i++) {
				var relation = relationInfo[i];
				if (relation.type === 'oneToMany' && (!relation.gridConfig || !relation.gridConfig.root)) {
					relation.module.newListRecordData.LocationId = locationId;
					relation.module.newListRecordData.Latitude = latitude;
					relation.module.newListRecordData.Longitude = longitude;
					relation.module.grid.getStore().baseParams.LocationId = locationId;
				}
			}

			var clientId = Number(DA.Security.info.Tags.ClientId);
			if (clientId != 0) {
				ExtHelper.SetComboValue(this.clientCombo, clientId);
				this.clientCombo.setDisabled(true);
			}
			var record = data.data;
			var locationImageField = this.locationImageField,
				logoImageField = this.logoImageField,
				backgroundImageField = this.backgroundImageField,
				locationImage = this.locationImage,
				logoImage = this.logoImage,
				backgroundImage = this.backgroundImage,
				noImageUrl = this.logoUrl + "LocationLogo/imageNotFound.png";

			if (record) {
				this.loadThumbnail(this, record, noImageUrl, locationImageField, locationImage.name);
				this.loadThumbnail(this, record, noImageUrl, logoImageField, logoImage.name);
				this.loadThumbnail(this, record, noImageUrl, backgroundImageField, backgroundImage.name);
			}
			locationImage.on('fileselected', this.onFileSelected, this);
			logoImage.on('fileselected', this.onFileSelected, this);
			backgroundImage.on('fileselected', this.onFileSelected, this);
			if (record.Id == 0) {
				this.outletTypeCombo.setValue(this.outletTypeCombo.store.data.first().id);
				this.outletTypeCombo.allowBlank = false;
				this.outletTypeCombo.validate();
			}

			this.salesHierarchy_All.setValue('');
			this.salesHierarchyAllLevels.getStore().clearFilter();
			if (!this.mask) {
				var mask = new Ext.LoadMask(this.formPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			if (data != '' && data != undefined) {
				var salesHierarchyArray = [];
				var salesHierarchyIds = '';

				if (data.data.SalesHierarchy != null && data.data.SalesHierarchy != undefined && data.data.SalesHierarchy != '') {
					salesHierarchyArray = [];
					this.salesHierarchyValues = JSON.parse(data.data.SalesHierarchy);
					salesHierarchyArray.push(this.salesHierarchyValues.BD_TerritoryId);
					salesHierarchyArray.push(this.salesHierarchyValues.CA_TerritoryId);
					salesHierarchyArray.push(this.salesHierarchyValues.MC_TerritoryId);
					salesHierarchyArray.push(this.salesHierarchyValues.P1_TerritoryId);
					salesHierarchyArray.push(this.salesHierarchyValues.P2_TerritoryId);
					salesHierarchyArray.push(this.salesHierarchyValues.P3_TerritoryId);
					salesHierarchyArray.push(this.salesHierarchyValues.P4_TerritoryId);
					salesHierarchyArray.push(this.salesHierarchyValues.P5_TerritoryId);
					salesHierarchyArray.push(this.salesHierarchyValues.SalesGroupId);
					salesHierarchyArray.push(this.salesHierarchyValues.SalesOfficeId);
					salesHierarchyArray.push(this.salesHierarchyValues.SalesOrganizationId);
					salesHierarchyArray.push(this.salesHierarchyValues.SalesTerritoryId);
					salesHierarchyArray.push(this.salesHierarchyValues.TelesellingTerritoryId);
					salesHierarchyIds = salesHierarchyArray.join(',');
					this.salesHierarchyIds = salesHierarchyIds;

					this.salesHierarchy_All.setValue('');
					this.salesHierarchy_All.setValue(salesHierarchyIds);



				}
			}
			this.salesTerritories.getStore().load();
			this.salesHierarchyAllLevels.getStore().load();

		});
		Ext.apply(config, {
			region: 'north',
			height: 350
		});
		relationInfo.tabPanel = new Ext.TabPanel(relationInfo.tabPanel);

		this.winConfig = Ext.apply(this.winConfig, {
			items: [
				this.formPanel,
				relationInfo.tabPanel
			]
		});

	},
	loadsalesTerritories: function (a) {
		if (this.salesHierarchyIds != undefined && this.salesHierarchyIds != '') {
			this.salesHierarchy_All.setValue('');
			this.salesHierarchy_All.setValue(this.salesHierarchyIds);
			var saleshierarchyAllIds = $.unique((this.salesHierarchy_All.getValue()).split(','));
			this.salesHierarchyCheckedvals = [];
			this.salesHierarchyCheckedvals.push(saleshierarchyAllIds.join(','));
			//this.salesOrgCheckedvals.push(this.responsibleSalesHierarchyLevel_0.getValue());	
		}
		else {
			this.salesTerritories.getStore().clearFilter();
			this.salesHierarchyCheckedvals = [];

			this.salesHierarchy_All.setValue('');
		}
		if (this.mask) {
			this.mask.hide();
		}
	},
	onSalesHierarchyChange: function (combo, newValue, oldValue) {
		if (!this.mask) {
			var mask = new Ext.LoadMask(this.formPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		var tempST = this.salesHierarchyCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesHierarchyCheckedvals = [];
		this.salesHierarchyCheckedvals.push(tempST.join(','));
		if (newValue != '' && oldValue != '') {
			var newValueArr = newValue.split(',');
			var oldValueArr = oldValue.split(',');
			var selectedVal = null;
			if (newValueArr.length > oldValueArr.length) {
				for (var i = 0; i < newValueArr.length; i++) {
					if (oldValueArr.indexOf(newValueArr[i]) <= -1) {
						selectedVal = newValueArr[i];
					}
				}
				if (selectedVal != null || selectedVal != undefined) {

					var selectedRecord = null;
					var recordFound = combo.store.findBy(function (record, id) {
						var r = record;
						if (record.get('LookupId') == selectedVal) {
							selectedRecord = jQuery.extend({}, record);
							return record;
						}
					});
					//var selectedRecord = combo.store.getById(selectedVal);
					if (selectedRecord != null && selectedRecord != undefined) {

						var salesHierarchyTypeId = selectedRecord.data.ReferenceValue;
						var salesHierarchyChackedValArr = this.salesHierarchyCheckedvals.join(',').split(',');
						var isTypeIdFound = false;
						if (salesHierarchyChackedValArr.length > 0) {
							for (var i = 0; i < salesHierarchyChackedValArr.length; i++) {
								var sRecord = null;
								var record = this.salesHierarchyAllLevels.store.findBy(function (record, id) {
									var r = record;
									if (record.get('LookupId') == salesHierarchyChackedValArr[i]) {
										sRecord = jQuery.extend({}, record);
										return record;
									}
								});
								if (sRecord != null && sRecord != undefined) {
									var recordTypeId = sRecord.data.ReferenceValue;
									var recordLevel = sRecord.data.Description;
									if (salesHierarchyTypeId == recordTypeId && recordLevel == "3") {
										isTypeIdFound = true;
										break;
									}
								}
							}
						}

						if (isTypeIdFound == true) {
							var message = "";
							switch (parseInt(salesHierarchyTypeId)) {
								case 0:
									message = "Sales territory already selected."
									break;
								case 1:
									message = "Teleselling territory already selected."
									break;
								case 2:
									message = "Business Developer territory already selected."
									break;
								case 3:
									message = "Credit Approver territory already selected."
									break;
								case 4:
									message = "Merchandizer territory already selected."
									break;
								case 5:
									message = "Preseller 1 territory already selected."
									break;
								case 6:
									message = "Preseller 2 territory already selected."
									break;
								case 7:
									message = "Preseller 3 territory already selected."
									break;
								case 8:
									message = "Preseller 4 territory already selected."
									break;
								case 9:
									message = "Preseller 5 territory already selected."
									break;
								default: break;
							}
							this.salesHierarchy_All.setValue(oldValue);

							if (this.mask) {
								this.mask.hide();
							}
							Ext.Msg.alert('Alert', message);
							return;
						}
						else {
							this.salesHierarchyCheckedvals.push(newValue);
							var salesIds = $.unique((this.salesHierarchyCheckedvals.join(',')).split(','));
							this.salesHierarchyCheckedvals = [];
							this.salesHierarchyCheckedvals.push(salesIds.join(','));
						}
					}
				}


			}
			else if (newValueArr.length < oldValueArr.length) {
				for (var i = 0; i < oldValueArr.length; i++) {
					for (var j = 0; j < newValueArr.length; j++) {
						if (oldValueArr[i] == newValueArr[j]) {
							oldValueArr.splice(i, 1);
							newValueArr.splice(j, 1);
							i = -1;
							//j = 0;
							break;
						}
					}
				}

				var territorySelectedvals = this.salesHierarchyCheckedvals.join(',').split(',');
				for (var k = 0; k < territorySelectedvals.length; k++) {
					for (var l = 0; l < oldValueArr.length; l++) {
						if (territorySelectedvals[k] == oldValueArr[l]) {
							territorySelectedvals.splice(k, 1);
							break;
						}
					}
				}
				if (territorySelectedvals.length > 0) {
					this.salesHierarchyCheckedvals = [];
					this.salesHierarchyCheckedvals.push(territorySelectedvals.join(','));
					this.salesHierarchy_All.setValue('' + this.salesHierarchyCheckedvals.join(',') + '');

				}
				else {

					this.salesHierarchyCheckedvals = [];
				}
			}
		}
		else if (newValue != '' && oldValue == '') {
			this.salesHierarchyCheckedvals.push(newValue);
			var territoryIds = $.unique((this.salesHierarchyCheckedvals.join(',')).split(','));
			this.salesHierarchyCheckedvals = [];
			this.salesHierarchyCheckedvals.push(territoryIds.join(','));
		}
		else if (newValue == '' && oldValue != '') {
			var territorySelectedVals = this.salesHierarchyCheckedvals.join(',').split(',');
			var oldSelectedVals = oldValue.split(',');
			for (var i = 0; i < territorySelectedVals.length; i++) {
				for (var j = 0; j < oldSelectedVals.length; j++) {
					if (territorySelectedVals[i] == oldSelectedVals[j]) {
						territorySelectedVals.splice(i, 1);
						i - 1;
						break;
					}
				}
			}

			if (territorySelectedVals.length > 0) {
				this.salesHierarchyCheckedvals = [];
				this.salesHierarchyCheckedvals.push(territorySelectedVals.join(','));
				this.salesHierarchy_All.setValue('' + this.salesHierarchyCheckedvals.join(',') + '');


			}
			else {
				this.salesHierarchyCheckedvals = [];
			}
		}
		if (this.salesHierarchyCheckedvals.length == 0) {
			// For Sales Territory
			this.salesHierarchyAllLevels.getStore().clearFilter();
			this.salesHierarchy_All.setValue('');

		}

		this.mask.hide();
	}
});
Ext.ns("Cooler.LocationType");
Cooler.LocationType.MainLocation = new Cooler.Location({ uniqueId: 'MainLocation', listTitle: 'Outlet' });
Cooler.LocationType.Location = new Cooler.Location({ uniqueId: 'Location', listTitle: 'Outlet' });
Cooler.LocationType.OutletPromotion = new Cooler.Location({ uniqueId: 'OutletPromotion', listTitle: 'All Outlet', disableAdd: true, allowExport: false });
Cooler.LocationType.EddystonePromotionOutlet = new Cooler.Location({ uniqueId: 'EddystonePromotionOutlet', listTitle: 'All Outlet', disableAdd: true, allowExport: false });
Cooler.LocationType.EddystoneUIDPromotionOutlet = new Cooler.Location({ uniqueId: 'EddystoneUIDPromotionOutlet', listTitle: 'All Outlet', disableAdd: true, allowExport: false });
Cooler.LocationType.iBeaconPromotionOutlet = new Cooler.Location({ uniqueId: 'iBeaconPromotionOutlet', listTitle: 'All Outlet', disableAdd: true, allowExport: false });
Cooler.LocationType.UserOutlet = new Cooler.Location({ uniqueId: 'UserOutlet', listTitle: 'All Outlet', disableAdd: true, allowExport: false });
Cooler.LocationType.SalesTerritoryOutlet = new Cooler.Location({ uniqueId: 'SalesTerritoryOutlet', listTitle: 'Outlet', disableAdd: true, allowExport: true });
Cooler.LocationType.ThirdPartyPromotionOutlet = new Cooler.Location({ uniqueId: 'ThirdPartyPromotionOutlet', listTitle: 'All Outlet', disableAdd: true, allowExport: true });
