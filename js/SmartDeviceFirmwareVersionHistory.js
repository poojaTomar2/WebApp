Cooler.SmartDeviceFirmwareVersionHistory = new Cooler.Form({
	controller: 'SmartDeviceFirmwareVersionHistory',
	title: 'FW History',
	disableAdd: true,
	comboTypes: [
	'SmartDeviceType'
	],
	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'SmartDeviceFirmwareVersionHistoryId' } },
		custom: {
			loadComboTypes: true
		}
	},
	comboStores: {
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	hybridConfig: function () {
		return [
			{ header: 'Id', dataIndex: 'SmartDeviceFirmwareVersionHistoryId', type: 'int' },
            { header: 'Firmware Version', type: 'string', dataIndex: 'FirmwareVersion', width: 150 },
            { header: 'Firmware Version Add On', dataIndex: 'FirmwareRemovedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Smart Device Serial Number', type: 'string', dataIndex: 'SerialNumber', width: 150 },
			{ header: 'Smart Device Type', dataIndex: 'SmartDeviceTypeId', type: 'int', displayIndex: 'Name', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }), width: 130 },
		    { header: 'Previous Firmware Version', type: 'string', dataIndex: 'PrevFirmwareVersion', width: 150 }

		];
	}
});
