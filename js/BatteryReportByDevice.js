Cooler.BatteryReportByDevice = Ext.extend(Cooler.Form, {

	controller: 'BatteryReportByDevice',

	keyColumn: 'SmartDeviceId',

	title: 'Battery Report By Device',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'BatteryReportByDevice',
	constructor: function (config) {
		Cooler.BatteryReportByDevice.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'SmartDeviceId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	comboTypes: ['Client'],
	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'SmartDeviceId' },
			{ type: 'int', dataIndex: 'TimeZoneId' },
			{ header: 'Device Type', dataIndex: 'SmartDeviceType', type: 'string' },
			{ header: 'Manufacturer', dataIndex: 'ManufacturerName', width: 120, type: 'string' },
			{ header: 'Mac Address', dataIndex: 'MacAddress', width: 120, type: 'string' },
            { header: 'Serial Number', dataIndex: 'SerialNumber', width: 120, type: 'string', hyperlinkAsDoubleClick: true },
            { header: 'Order Serial Number', dataIndex: 'OrderSerialNumber', width: 120, type: 'string' },
			{ header: 'Shipped Country', dataIndex: 'ShippedCountry', width: 100, type: 'string' },
			{ header: 'Asset Equipment Number', dataIndex: 'EquipmentNumber', width: 120, type: 'string' },
			{ header: 'Technical Identification Number', dataIndex: 'TechnicalIdentificationNumber', width: 120, type: 'string' },
			{ header: 'CoolerIoT Client', dataIndex: 'Client', width: 120, type: 'string' },
			{ header: 'Asset Type', dataIndex: 'AssetType', width: 170, type: 'string' },
            { header: 'Linked with Asset', dataIndex: 'LinkedWithAsset', width: 120, type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Asset Associated On', dataIndex: 'AssetAssociatedOn', type: 'date', width: 160, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Association', dataIndex: 'AssociationStatus', type: 'string', width: 60 },
			{ header: 'Associated By BD User Name', dataIndex: 'AssetAssociatedByBDUserName', type: 'string', width: 120 },
			{ header: 'Associated By BD Name', dataIndex: 'AssetAssociatedByBDName', type: 'string', width: 120 },
			{ header: 'Associated By App Version', dataIndex: 'AssociatedByAppVersion', type: 'string', width: 120 },
			{ header: 'Associated By App Name', dataIndex: 'AssociatedByAppName', type: 'string', width: 120 },
			{ header: 'Outlet', dataIndex: 'OutletName', width: 170, type: 'string' },
            { header: 'Outlet Code', dataIndex: 'OutletCode', width: 170, type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Type', dataIndex: 'OutletType', type: 'string' },
			{ header: 'Trade Channel', dataIndex: 'TradeChannel', width: 120, type: 'string' },
			{ header: 'Trade Channel Code', hidden: true, dataIndex: 'TradeChannelCode', width: 120, type: 'string' },
			{ header: 'Customer Tier', dataIndex: 'CustomerTier', width: 120, type: 'string' },
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
			{ header: 'Sales Territory Code', hidden: true, type: 'string', dataIndex: 'SalesTerrotoryCode' },
			{ header: 'Street', dataIndex: 'Street', width: 170, type: 'string' },
			{ header: 'City', dataIndex: 'City', width: 170, type: 'string' },
			{ header: 'Country', dataIndex: 'CountryName', width: 100, type: 'string' },
			{ header: 'Time Zone', dataIndex: 'TimeZone', width: 200, type: 'string' },
			{ header: 'Latest Health Record Event Time', dataIndex: 'LatestHealthRecordEventTime', width: 200, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Battery Level', dataIndex: 'BatteryLevel', type: 'string', width: 70, align: 'right' }
		];
	},

	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	}

});
Cooler.BatteryReportByDevice = new Cooler.BatteryReportByDevice({ uniqueId: 'BatteryReportByDevice' });