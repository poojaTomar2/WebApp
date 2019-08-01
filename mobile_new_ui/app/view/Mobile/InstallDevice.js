Ext.define("CoolerIoTMobile.view.Mobile.InstallDevice", {
	extend: 'Ext.form.Panel',
	xtype: 'installDevice',
	cls: 'asset-item-list-container',
	config: {
		title: CoolerIoTMobile.Localization.InstallDevice,
		layout: {
			type: 'vbox'
		},
		defaults: {
			margin: '5 5 5 5'
		},
		items: [
			{
				xtype: 'fieldset',
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				items: [{
					xtype: 'textfield',
					itemId: 'assetLocation',
					label: 'Asset Location',
					readOnly : true,
					labelAlign: 'top',
					iconCls: 'smart-device-barcode',
					flex: 2,
					required: true
				}]
			}, {
				xtype: 'fieldset',
				layout: {
					align: 'stretch',
					type: 'hbox'
				},
				items: [{
					xtype: 'textfield',
					itemId: 'assetText',
					readOnly: true,
					label: 'Asset Serial No.',
					iconCls: 'smart-device-barcode',
					flex: 2,
					labelAlign: 'top',
					required: true,
					disabled: true
				}
				]
			}, {
				xtype: 'fieldset',
				layout: {
					align: 'stretch',
					type: 'hbox'
				},
				items: [{
					xtype: 'textfield',
					itemId: 'smartDeviceText',
					readOnly: true,
					label: 'Smart Device Serial',
					iconCls: 'smart-device-barcode',
					flex: 2,
					labelAlign: 'top',
					required: true,
					disabled: true
				}
				]
			},
			{
				xtype: 'df-buttonplus',
				itemId: 'assetInstallDevice',
				ui: 'cooler-action-btn',
				padding: '10px',
				docked: 'bottom',
				text: 'Install',
				disabled: true
			}
		]
	}
});
