Cooler.SmartDevicePowerEventWellington = Ext.extend(Cooler.Form, {

	controller: 'SmartDevicePowerEventWellington',

	keyColumn: 'SmartDevicePowerEventWellingtonId',

	useElastic: true,

	title: 'Power',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'SmartDevicePowerEventWellington',
	constructor: function (config) {
		Cooler.SmartDevicePowerEventWellington.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'SmartDevicePowerEventWellingtonId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	comboTypes: [
	'AssetType',
	'SmartDeviceType',
	'TimeZone'
	],
	comboStores: {
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		TimeZone: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [
            { type: 'int', dataIndex: 'SmartDevicePowerEventWellingtonId', header: 'Id', width: 65 },
			{ type: 'int', dataIndex: 'TimeZoneId' },
			{ header: 'Compressor Power(Watt)', type: 'int', dataIndex: 'CompressorPower', width: 150 },
            { header: 'Evap Power(Watt)', type: 'int', dataIndex: 'EvapPower', width: 150 },
            { header: 'Condensor Power(Watt)', type: 'int', dataIndex: 'CondensorPower', width: 150 },
            { header: 'Lighting Power(Watt)', type: 'int', dataIndex: 'LightingPower', width: 150 },
            { header: 'Defrost Power(Watt)', type: 'int', dataIndex: 'DefrostPower', width: 150 },
			{ header: 'Event Id', type: 'int', dataIndex: 'EventId', width: 150 },
			{ header: 'Event Time', dataIndex: 'EventTime', width: 180, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, type: 'date' },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
            { header: 'Interval', type: 'string', dataIndex: 'Interval', width: 150 },
            { header: 'Asset Serial #', dataIndex: 'AssetSerialNumber', type: 'string', width: 120, sortable: false, hyperlinkAsDoubleClick: true }, // hyperlinkAsDoubleClick: true Commented as per the ticket #752
			{ header: 'Technical Id', dataIndex: 'TechnicalIdentificationNumber', type: 'string', width: 150 },
			{ header: 'Asset Type', dataIndex: 'AssetTypeId', type: 'int', displayIndex: 'AssetType', renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AssetType }), store: this.comboStores.AssetType, width: 150 },
			{ header: 'Equipment Number', dataIndex: 'EquipmentNumber', type: 'string', width: 150 },
            { header: 'Smart Device# ', dataIndex: 'SerialNumber', type: 'string', width: 150, hyperlinkAsDoubleClick: true },
			{ dataIndex: 'MacAddress', header: 'Smart Device Mac', width: 120, type: 'string', sortable: false },
			{ header: 'Device Type', dataIndex: 'SmartDeviceTypeId', type: 'int', displayIndex: 'SmartDeviceType', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }), width: 130 },
			{ header: 'Gateway Mac', dataIndex: 'GatewayMacAddress', type: 'string', width: 110, elasticDataIndex: 'GatewayMac' },
			{ header: 'Gateway#', dataIndex: 'GatewaySerialNumber', type: 'string', width: 110 },
			{ dataIndex: 'Location', type: 'string', header: 'Outlet', width: 160, sortable: false },
            { dataIndex: 'LocationCode', type: 'string', header: 'Outlet Code', width: 160, sortable: false, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Type', dataIndex: 'OutletType', type: 'string', width: 130, sortable: false },
			{ header: 'Time Zone', dataIndex: 'TimeZoneId', width: 200, type: 'int', displayIndex: 'TimeZone', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }) },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', width: 150 },
			{ header: 'App Name', dataIndex: 'AppName', width: 160, type: 'string', align: 'right' },
			{ header: 'App Version', dataIndex: 'AppVersion', width: 160, type: 'string', align: 'right' },
			{ header: 'SDK Version', dataIndex: 'SDKVersion', width: 160, type: 'string', align: 'right' }
		];
	},

});
Cooler.SmartDevicePowerEventWellington = new Cooler.SmartDevicePowerEventWellington({ uniqueId: 'Power' });