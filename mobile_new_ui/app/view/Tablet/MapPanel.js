Ext.define('CoolerIoTMobile.view.Tablet.MapPanel', {
	extend: 'Ext.Container',
	xtype: 'tablet-mapPanel',
	config: {
		layout: 'vbox',
		items: [{
			xtype: 'toolbar',
			cls: 'iot-toolbar',
			layout: {
				type: 'hbox',
				pack: 'end'
			},
			items: [{
				xtype: 'df-combo',
				label: 'SR',
				itemId: 'mapSalesRepCombo',
				comboType: 'SalesRep',
				addAll: true,
				value: 0,
				align: 'right'
			}]
		}, {
			xtype: 'Df-Map',
			layout: 'fit',
			store: 'LocationWithIssues',
			flex: 1,
			itemId:'map-container',
			iconCls: 'locate'
		}
		]
	}
});