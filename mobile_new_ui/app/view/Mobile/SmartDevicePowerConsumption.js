Ext.define('CoolerIoTMobile.view.Mobile.SmartDevicePowerConsumption', {
	extend: 'Ext.dataview.List',
	xtype: 'powerConsumptionList',
	requires: ['Ext.plugin.ListPaging'],
	config: {
		plugins: [
             {
             	xclass: 'Ext.plugin.ListPaging',
             	pullRefereshText: 'Pull To Refresh',
             	autoPaging: true
             }
		],
		title: 'Power Consumption',
		emptyText: 'No Data',
		store: 'SmartDevicePowerConsumption',
		striped: true,
		cls: 'asset-item-list-container',
		itemTpl: new Ext.XTemplate(
			'<div class="asset-item-container asset-item-health-container">',
                            '<ul class="cooleriot-list-view">',
							'<li class="asset-first-row cooleriot-display-table">',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class=" iot-icon iot-eventstart-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class=" iot-icon iot-eventend-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class=" iot-power2-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class=" iot-average-icon"></span>',
									'</span>',
								'</span>',
							'</li>',
							'<li class="cooleriot-display-table asset-second-row">',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">{[CoolerIoTMobile.util.Renderers.standardTime(values.StartTime)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">{[CoolerIoTMobile.util.Renderers.standardTime(values.EndTime)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">{PowerConsumption} /kW/hr</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">{Average} /day/kW/hr</div></span>',
							'</li>',
						'</ul></div>'
		),
		grouped: true
	}
});