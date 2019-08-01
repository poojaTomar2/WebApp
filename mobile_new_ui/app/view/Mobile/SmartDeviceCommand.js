Ext.define('CoolerIoTMobile.view.Mobile.SmartDeviceCommand', {
	extend: 'Ext.dataview.List',
	xtype: 'commandList',
	requires: ['Ext.plugin.ListPaging'],
	config: {
		plugins: [
             {
             	xclass: 'Ext.plugin.ListPaging',
             	pullRefereshText: 'Pull To Refresh',
             	autoPaging: true
             }
		],
		title: 'Commands',
		emptyText: 'No Data',
		store: 'SmartDeviceCommand',
		striped: true,
		cls: 'asset-item-list-container',
		itemTpl: new Ext.XTemplate(
		'<div class="asset-item-container asset-item-health-container">',
			      '<ul >',
							'<li class="asset-first-row cooleriot-display-table">',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-large-span">',
										'<span class="cooleriot-table-cell text-center iot-col-12_5">{SmartDeviceTypeCommand}</span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class="cooleriot-table-cell text-center iot-col-12_5">{[CoolerIoTMobile.util.Renderers.standardDateTime(values.CreatedOn)]}</span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class="cooleriot-table-cell text-center iot-col-12_5">{[CoolerIoTMobile.util.Renderers.standardDateTime(values.ExecutedOn)]}</span>',
									'</span>',
								'</span>',
							'</li>',
							'<li class="cooleriot-display-table ">',
								'<span class="cooleriot-table-cell iot-col-12_5">{Result}</span>',
							'</li>',
						'</ul></div>'
		),
		grouped: true
	}
});