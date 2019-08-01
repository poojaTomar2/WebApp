Ext.define('CoolerIoTMobile.view.Mobile.Settings', {
	extend: 'Ext.form.Panel',
	xtype: 'mobile-settings-container',

	config: {
		layout: 'vbox',
		items: [
			{
				docked: 'top',
				xtype: 'titlebar',
				title: "Settings"
			},
			{
				xtype: 'selectfield',
				name: 'serverType',
				label: 'Server',
				usePicker: 'true',
				labelWidth: '60%',
				options: [
					{ text: 'Pilots', value: CoolerIoTMobile.Localization.PilotUrl },
					{ text: 'Production - Azure', value: CoolerIoTMobile.Localization.ProductionAzureUrl },
					{ text: 'Production - V2', value: CoolerIoTMobile.Localization.ProductionV2Url },
					{ text: 'Debug', value: CoolerIoTMobile.Localization.DebugUrl },
					{ text: 'QA', value: CoolerIoTMobile.Localization.QAUrl },
					{ text: 'Staging', value: CoolerIoTMobile.Localization.StagingUrl }
				]
			},
			{
				xtype: 'selectfield',
				label: 'Enable Notification',
				name: 'enableNotification',
				usePicker: 'true',
				labelWidth: '60%',
				options: [
					{ text: 'Enable', value: 'Enable' },
					{ text: 'Disable', value: 'Disable' }
				]
			},
			{
				xtype: 'selectfield',
				label: 'Language',
				name: 'language',
				usePicker: 'true',
				labelWidth: '60%',
				options: [
					{ text: 'English', value: 'English' },
					{ text: 'Hindi', value: 'Hindi' }
				]
			},
			{
				xtype: 'label',
				html: 'Image / log Folder',
				width: '60%',
				margin: '0 0 2% 2%'
			},
			{
				xtype: 'button',
				text: '/storage/emulated/0/SmartCooler//',
				labelCls: 'customCls',
				margin: '0 0 2 2',
				width: '96%',
				name: 'storageButton'
			},
			{
				xtype: 'numberfield',
				name: 'serviceFrequency',
				label: 'Service frequency (minutes)',
				labelWidth: '60%'
			},
			{
				xtype: 'numberfield',
				name: 'dataRecord',
				label: 'Fetch Data Record Count',
				labelWidth: '60%'
			},
			{
				xtype: 'checkboxfield',
				name: 'serviceCheckBox',
				label: 'Run as Service',
				labelWidth: '60%'
			},
			{
				xtype: 'checkboxfield',
				name: 'qaModeCheckBox',
				label: 'QA Mode',
				labelWidth: '60%'
			},
			{
				xtype: 'fieldset',
				layout: {
					align: 'stretch',
					type: 'hbox'
				},
				items: [{
					xtype: 'button',
					text: 'Apply',
					itemId: 'applyButton',
					width: '50%',
					ui: 'cooler-action-btn'
				}, {
					xtype: 'button',
					text: 'Cancel',
					itemId: 'cancelButton',
					width: '50%',
					ui: 'cooler-action-btn'
				}
				]
			},
			{
				xtype: 'button',
				text: 'Sync Now',
				itemId: 'syncButton',
				width: '96%',
				ui: 'cooler-action-btn',
				margin: '0 0 2% 2%',
				docked: 'bottom'
			}
		]
	}

});
