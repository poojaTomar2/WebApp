Ext.define('CoolerIoTMobile.view.Tablet.Toolbar', {
	extend: 'Ext.TitleBar',
	xtype: 'tablet-toolbar',
	requires: [
        'Ext.field.Select'
	],
	config: {
		cls: 'iot-toolbar',
		title: 'Dashboard',
		items: [
			{
				xtype: 'df-combo',
				comboType: 'AlertType',
				label: 'Alert',
				itemId: 'alertCombo',
				addAll: true,
				value: 0,
				align: 'right'
			}
		]
	}
});