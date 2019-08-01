Ext.define('CoolerIoTMobile.view.Mobile.DeviceFactorySetup', {
	extend: 'Ext.form.Panel',
	xtype: 'deviceFactorySetup',
	config: {
		modal: true,
		centered: true,
		scrollable: false,
		hideOnMaskTap: true,
		width: '80%',
		height: '18em',
		cls: 'device-form-panel',
		floatingCls: 'device-form-panel-floating',
		frame: true,
		showAnimation: {
			type: 'popIn',
			duration: 250,
			easing: 'ease-out'
		},
		hideAnimation: {
			type: 'popOut',
			duration: 250,
			easing: 'ease-out'
		},
		defaults: {
			labelWidth: '68%'
		},
		layout: 'fit',
		items: [
			{
				xtype: 'label',
				docked: 'top',
				width: '100%',
				html: 'Factory Setup',
				cls: 'device-details-form-top-bar'
			},
		{
			xtype: 'fieldset',
			width: '90%',
			height: '90%',
			items: [
			{
				xtype: 'textfield',
				labelWidth: '64%',
				name: 'SmartDevicePrefix',
				label: 'Smart Device Prefix'
			},
			{
				xtype: 'numberfield',
				labelWidth: '64%',
				name: 'CurrentRoomTemp',
				label: 'Current Room Temperature'
			},
			{
				xtype: 'numberfield',
				labelWidth: '64%',
				name: 'StartingSerial',
				label: 'Starting Serail#'
			},
			{
				xtype: 'checkboxfield',
				labelWidth: '64%',
				name: 'ReadCurrentSensorData',
				label: 'Read current sensor data',
				checked: true
			}
			]
		},
		{
			xtype: 'fieldset',
			docked: 'bottom',
			itemId: 'commonItems',
			style: 'margin: 0em;',
			defaults: {
				xtype: 'button',
				cls: 'device-details-button',
				width: '50%'
			},
			items: [

				{
					text: 'Set',
					itemId: 'deviceFactorySetupSetBtn',
					style: 'border-right: none;',
					docked: 'right'
				},
				{
					text: 'Cancel',
					docked: 'right',
					style: 'border-left: none;border-right: none;',
					handler: function (button) {
						button.up().up().destroy();
						if (CoolerIoTMobile.util.Utility.isManualFactorySetup) {
							CoolerIoTMobile.util.Utility.isManualFactorySetup = false;
						}
					}
				}
			]
		}
		]
	}
});
