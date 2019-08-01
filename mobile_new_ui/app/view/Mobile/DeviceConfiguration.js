Ext.define('CoolerIoTMobile.view.Mobile.DeviceConfiguration', {
	extend: 'Ext.form.Panel',
	xtype: 'deviceConfiguration',
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
		]
	}
});
