Cooler.AssetDetailsReport = Ext.extend(Cooler.Form, {

	controller: 'AssetDetailsReport',

	keyColumn: 'AssetId',

	title: 'Asset Details Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'AssetDetailsReport',
	constructor: function (config) {
		Cooler.AssetDetailsReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'AssetId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},

	hybridConfig: function () {
		return [
					{ type: 'int', dataIndex: 'AssetId' },
					{ header: 'Asset Type', dataIndex: 'AssetType', type: 'string', width: 150 },
					{ header: 'Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
					{ header: 'Technical Id', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
                    { header: 'Serial Number', type: 'string', dataIndex: 'SerialNumber', width: 150, hyperlinkAsDoubleClick: true },
					{ header: 'Outlet', dataIndex: 'Location', type: 'string', width: 150 },
                    { header: 'Outlet Code', dataIndex: 'LocationCode', type: 'string', hyperlinkAsDoubleClick: true },
					{ header: 'Outlet Type', dataIndex: 'OutletType', type: 'string' },
					{ header: 'Trade Channel', dataIndex: 'LocationType', width: 120, type: 'string' },
					{ header: 'Trade Channel Code', hidden: true, dataIndex: 'ChannelCode', width: 120, type: 'string' },
					{ header: 'Customer Tier', dataIndex: 'Classification', width: 120, type: 'string' },
					{ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' },
					{ header: 'Sub Trade Channel', dataIndex: 'SubTradeChannelName', width: 120, type: 'string' },
					{ header: 'Sub Trade Channel Code', hidden: true, dataIndex: 'SubTradeChannelTypeCode', width: 120, type: 'string' },
					{ header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 },
					{ header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' },
					{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
					{ header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' },
					{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
					{ header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
					{ header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
					{ header: 'Sales Territory Code', hidden: true, type: 'string', dataIndex: 'SalesTerritoryCode' },
					{ header: 'LocationId', type: 'string', dataIndex: 'LocationId', width: 150, hidden: true },
                    { header: 'Smart Device SerialNumber', type: 'string', dataIndex: 'SmartDeviceSerialNumber', width: 180, align: 'right', hyperlinkAsDoubleClick: true },
					{ header: 'Smart Device Type', dataIndex: 'SmartDeviceType', type: 'string', width: 130 },
					{ header: 'City', type: 'string', dataIndex: 'City', width: 150, align: 'left' },
					{ header: 'Country', dataIndex: 'Country', type: 'string', width: 100 },
					{ header: 'Capacity Type', dataIndex: 'AssetTypeCapacity', type: 'string', width: 150, align: 'right' },
					{ header: 'Door Open Target', dataIndex: 'DoorOpenTarget', type: 'int', align: 'right', width: 150 },
					{ header: 'Last 30 day Door Threshold', dataIndex: 'Last30DayDoorThreshold', type: 'int', align: 'right', width: 150 },
					{ header: 'Last 30 day Active Door Threshold', dataIndex: 'Last30DayActiveDoorThreshold', type: 'int', align: 'right', width: 150 },
					{ header: 'CoolerIot Client', type: 'string', dataIndex: 'ClientName', width: 150 }
		];
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	}

});
Cooler.AssetDetailsReport = new Cooler.AssetDetailsReport({ uniqueId: 'AssetDetailsReport' });