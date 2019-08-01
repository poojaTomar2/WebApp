Cooler.SmartDeviceDoorOpenTimeOut = Ext.extend(Cooler.Form, {

	controller: 'SmartDeviceDoorOpenTimeOut',

	//keyColumn: 'SmartDeviceInternalAlarmId',

	//useElastic: true,

	title: 'SmartDevice Door Open TimeOut',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'SmartDeviceDoorOpenTimeOut',
	constructor: function (config) {
		Cooler.SmartDeviceDoorOpenTimeOut.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'SmartDeviceInternalAlarmId' } },
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
			{ type: 'int', dataIndex: 'TimeZoneId' },
			{ header: 'Id', dataIndex: 'SmartDeviceInternalAlarmId', type: 'int', align: 'right' },
			{ header: 'Open Event Time', dataIndex: 'StartEventTime', width: 180, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			//{ header: 'Close Event Time', dataIndex: 'EndEventTime', width: 180, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			//{ header: 'Event Type', dataIndex: 'EventTypeId', width: 180, type: 'bool', renderer: this.eventTypeRenderer },
			{ header: 'Door Open Duration(sec)', dataIndex: 'Duration', width: 90, type: 'int', align: 'right' },
			{ header: 'Outlet Territory', dataIndex: 'SalesTerritoryName', width: 90, type: 'string' },
            { header: 'Capacity Type', dataIndex: 'AssetTypeCapacity', type: 'string', width: 150, align: 'right' },
            { header: 'Door Open Target', dataIndex: 'DoorOpenTarget', type: 'int', align: 'right', width: 150 },
			{ header: 'Event Id', type: 'int', dataIndex: 'EventId', width: 150 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Gateway Mac', dataIndex: 'GatewayMacAddress', type: 'string', width: 110 },
			{ header: 'Gateway#', dataIndex: 'GatewaySerialNumber', type: 'string', width: 110 },
			{ header: 'Asset Type', dataIndex: 'AssetTypeId', type: 'int', displayIndex: 'AssetType', renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AssetType }), store: this.comboStores.AssetType, width: 150 },
            { header: 'Asset Serial #', dataIndex: 'AssetSerialNumber', type: 'string', width: 120, sortable: false, hyperlinkAsDoubleClick: true },
			{ header: 'Technical Id', dataIndex: 'TechnicalIdentificationNumber', type: 'string', width: 150 },
			{ header: 'Equipment Number', dataIndex: 'EquipmentNumber', type: 'string', width: 150 },
			{ header: 'Smart Device Mac', dataIndex: 'MacAddress', width: 120, type: 'string', hyperlinkAsDoubleClick: true, sortable: false },
            { header: 'Smart Device#', dataIndex: 'SerialNumber', width: 120, type: 'string', sortable: false, hyperlinkAsDoubleClick: true },
			{ header: 'Smart Device Type', dataIndex: 'SmartDeviceTypeId', width: 120, type: 'int', displayIndex: 'SmartDeviceTypeName', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }), sortable: false },
			{ header: 'Outlet', dataIndex: 'Location', type: 'string', width: 160, sortable: false },
            { header: 'Outlet Code', dataIndex: 'LocationCode', type: 'string', width: 160, sortable: false, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Type', dataIndex: 'OutletType', type: 'string', width: 130, sortable: false },
			{ header: 'Month', dataIndex: 'SmartDeviceMonth', type: 'int', align: 'right' },
			{ header: 'Day ', dataIndex: 'SmartDeviceDay', type: 'int', align: 'right' },
			{ header: 'Day of Week', dataIndex: 'SmartDeviceWeekDay', type: 'string' },
			{ header: 'Week of Year', dataIndex: 'SmartDeviceWeek', type: 'int', align: 'right' },
			{ header: 'Time Zone', dataIndex: 'TimeZoneId', width: 200, type: 'int', displayIndex: 'TimeZone', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }) },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', width: 150 }
		];
	},

});
Cooler.SmartDeviceDoorOpenTimeOut = new Cooler.SmartDeviceDoorOpenTimeOut({ uniqueId: 'SmartDeviceDoorOpenTimeOut' });