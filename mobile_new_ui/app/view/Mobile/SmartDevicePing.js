Ext.define('CoolerIoTMobile.view.Mobile.SmartDevicePing', {
	extend: 'Ext.dataview.List',
	xtype: 'pingList',
	requires: ['Ext.plugin.ListPaging'],
	config: {
		plugins: [
             {
             	xclass: 'Ext.plugin.ListPaging',
             	pullRefereshText: 'Pull To Refresh',
             	autoPaging: true
             }
		],
		title: 'Pings',
		emptyText: 'No Data',
		store: 'SmartDevicePing',
		striped: true,
		cls: 'asset-item-list-container',
		itemTpl: new Ext.XTemplate(
			'<div class="asset-item-container asset-item-health-container">',
			      '<ul >',
							'<li class="asset-first-row cooleriot-display-table">',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span style = "padding: 0.2em;">',
										'<span class="cooleriot-table-cell text-center iot-col-12_5">{GatewaySerialNumber}</span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span style = "padding: 0.2em;">',
										'<span class="cooleriot-table-cell text-center iot-col-12_5">{[CoolerIoTMobile.util.Renderers.standardTime(values.EventTime)]}</span>',
									'</span>',
						'</ul></div>'
		),
		grouped: true
	}
});