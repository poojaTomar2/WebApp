Ext.define('CoolerIoTMobile.view.Mobile.Admin', {
	extend: 'Ext.Container',
	xtype: 'admin',
	config: {
		title: CoolerIoTMobile.Localization.Admin,
		layout: {
			type: 'vbox'
		},
		defaults: {
			margin: '5 5 5 5'
		},
		items: [
				{
					xtype: 'textfield',
					name: 'assetSerial',
					label: 'Device',
					itemId: 'assetSerial',
					required: true,
					iconCls: 'smart-device-barcode'
				},
			{
				xtype: 'selectfield',
				name: 'logsSelect',
				label: 'Logs',
				itemId: 'logsSelect',
				usePicker: 'true',
				required: true,
				iconCls: 'smart-device-barcode',
				options: [
							{ text: 'Raw Log', value: 'RawLogs' },
							{ text: 'Debug Log', value: 'LogDebugger' },
							{ text: 'Movement', value: 'SmartDeviceMovement' },
							{ text: 'Health', value: 'SmartDeviceHealthRecord' },
							{ text: 'Door Status', value: 'SmartDeviceDoorStatus' },
							{ text: 'Ping', value: 'SmartDevicePing' }
				]
			},
		{
			xtype: 'df-buttonplus',
			itemId: 'syncButton',
			ui: 'cooler-action-btn',
			padding: '10px',
			text: 'Sync'
		},
		{
			xtype: 'mobile-deviceSearchResult',
			itemId: 'deviceSearchResult',
			flex: 1
			
		}
		]
	}
});
