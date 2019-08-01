Cooler.AssetLocationReport = Ext.extend(Cooler.Form, {
	controller: 'AssetLocationReport',
	keyColumn: 'AssetId',
	listTitle: 'Asset Location Report',
	disableAdd: true,
	disableDelete: true,
	securityModule: 'AssetLocationReport',
	comboTypes: [
		'AssetType',
		'State',
		'Country',
		'SmartDeviceType',
		'OutletType',
		'Client'
	],
	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			//groupField: 'Location',
			custom: {
				loadComboTypes: true
			}
		};
		Cooler.AssetLocationReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'AssetId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},

	comboStores: {
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		OutletType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		State: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},

	hybridConfig: function () {
		return [
            { type: 'int', dataIndex: 'AssetId' },
			{ dataIndex: 'OutletType', type: 'string' },
			{ dataIndex: 'AssetType', type: 'string' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ dataIndex: 'ClientName', type: 'string' },
			{ dataIndex: 'State', type: 'string' },
			{ dataIndex: 'Country', type: 'string' },
			{ header: 'CCH Solution', dataIndex: 'CCHSolution', type: 'string', width: 150 },
			{ header: 'Asset Type', dataIndex: 'AssetTypeId', type: 'int', displayIndex: 'AssetType', renderer: 'proxy', store: this.comboStores.AssetType, width: 150 },
			{ header: 'Equipment Number', dataIndex: 'EquipmentNumber', type: 'string', width: 150 },
			{ header: 'Outlet', dataIndex: 'Location', type: 'string', width: 150 },
            { header: 'Outlet Code', dataIndex: 'LocationCode', type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Displacement', dataIndex: 'Displacement', width: 100, align: 'right', type: 'float', renderer: ExtHelper.renderer.Float(3) },
			{ header: 'GPS Received On', dataIndex: 'GPSreceived', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Cell Id Received On', dataIndex: 'CellIdReceived', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'GPS Verified On', dataIndex: 'GPSverified', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Latitude', dataIndex: 'Latitude', type: 'float', width: 80, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Longitude', dataIndex: 'Longitude', type: 'float', width: 80, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Latest GPS Latitude', dataIndex: 'LatestLatitude', type: 'float', width: 160, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Latest GPS Longitude', dataIndex: 'LatestLongitude', type: 'float', width: 160, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Latest Cell Location Latitude', dataIndex: 'LatestCellLocationLatitude', type: 'float', width: 160, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Latest Cell Location Longitude', dataIndex: 'LatestCellLocationLongitude', type: 'float', width: 180, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Calculated Asset Latitude', type: 'float', dataIndex: 'CalculatedAssetLattitude', width: 160, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Calculated Asset Longitude', type: 'float', dataIndex: 'CalculatedAssetLongitude', width: 160, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Accuracy', type: 'string', width: 80, dataIndex: 'Accuracy', align: 'right' },
			{ header: 'Technical Id', dataIndex: 'TechnicalIdentificationNumber', type: 'string', width: 150 },
            { header: 'Serial Number', dataIndex: 'SerialNumber', type: 'string', width: 130, hyperlinkAsDoubleClick: true },
			//{ header: 'Smart Device Type', dataIndex: 'SmartDeviceTypeId', type: 'int', displayIndex: 'SmartDeviceType', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }), width: 130 },
			{ header: 'Smart Device Type', dataIndex: 'SmartDeviceType', type: 'string', width: 130 },
            { header: 'Smart Device Serial Number', dataIndex: 'SmartDeviceSerialNumber', type: 'string', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Type', dataIndex: 'OutletTypeId', type: 'int', displayIndex: 'OutletType', renderer: 'proxy', store: this.comboStores.OutletType, width: 100 },
			{ header: 'Trade Channel', dataIndex: 'LocationType', width: 120, type: 'string' },
			{ header: 'Trade Channel Code', hidden: true, dataIndex: 'ChannelCode', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel', dataIndex: 'SubTradeChannelName', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel Code', hidden: true, dataIndex: 'SubTradeChannelTypeCode', width: 120, type: 'string' },
			{ header: 'Customer Tier', dataIndex: 'Classification', width: 120, type: 'string' },
			{ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' },
			{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
			{ header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
			{ header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' },
			{ header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientId', type: 'int', displayIndex: 'ClientName', renderer: 'proxy', store: this.comboStores.Client, width: 120 },
			{ header: 'Street', dataIndex: 'Street', type: 'string', width: 150 },
			{ header: 'Street 2', dataIndex: 'Street2', type: 'string', width: 80 },
			{ header: 'Street 3', dataIndex: 'Street3', type: 'string', width: 80 },
			{ header: 'State', dataIndex: 'StateId', type: 'int', displayIndex: 'State', renderer: 'proxy', store: this.comboStores.State, width: 50 },
			{ header: 'City', dataIndex: 'City', type: 'string', width: 80 },
			{ header: 'Country', dataIndex: 'CountryId', type: 'int', displayIndex: 'Country', renderer: 'proxy', store: this.comboStores.Country, width: 100 }
		];
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	}

});
Cooler.AssetLocationReport = new Cooler.AssetLocationReport({ uniqueId: 'AssetLocationReport' });