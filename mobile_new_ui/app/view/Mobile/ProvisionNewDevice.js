Ext.define("CoolerIoTMobile.view.Mobile.ProvisionNewDevice", {
	extend: 'Ext.form.Panel',
	xtype: 'provisionNewDevice',
	cls: 'asset-item-list-container',
	config: {
		title: CoolerIoTMobile.Localization.ProvisionNewDeviceTitle,
		layout: {
			type: 'vbox'
		},
		defaults: {
			margin: '5 5 5 5'
		},
		items: [{
			xtype: 'fieldset',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [{
				xtype: 'textfield',
				name: 'assetSerial',
				label: 'Asset Serial',
				labelAlign: 'top',
				iconCls: 'smart-device-barcode',
				flex: 2,
				required: true
			}, {
				xtype: 'image',
				src: './resources/icons/scan_camera.png',
				itemId: 'assetSerialBarcode',
				width: '20%',
				margin: '5 5 5 5',
				docked: 'right'
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
				name: 'smartDeviceSerial',
				label: 'Smart Device Serial',
				iconCls: 'smart-device-barcode',
				flex: 2,
				labelAlign: 'top',
				required: true
			}, {

				xtype: 'image',
				src: './resources/icons/scan_camera.png',
				itemId: 'smartDeviceSerialBarcode',
				width: '20%',
				margin: '5 5 5 5',
				docked: 'right'
			}
			]
		}, {
			xtype: 'label',
			html: CoolerIoTMobile.Localization.InstallDeviceNote
		}
		, {
			xtype: 'df-buttonplus',
			itemId: 'submitButton',
			ui: 'cooler-action-btn',
			padding: '10px',
			docked: 'bottom',
			text: 'Submit'
		}
		]
	}
});
