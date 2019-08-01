Ext.define('CoolerIoTMobile.view.Mobile.SmartDeviceMovement', {
	extend: 'Ext.dataview.List',
	xtype: 'smartDeviceMovement',
	config: {
		plugins: [
             {
             	xclass: 'Ext.plugin.ListPaging',
             	pullRefereshText: 'Pull To Refresh',
             	autoPaging: true
             }
		],
		title: 'Movement Data',
		emptyText: 'No Data',
		store: 'SmartDeviceMovement',
		striped: true,
		cls: 'asset-item-list-container',
		itemTpl: new Ext.XTemplate(
			'<div class="asset-item-container asset-item-health-container">',
                            '<ul class="cooleriot-list-view">',
							'<li class="asset-first-row cooleriot-display-table">',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class=" iot-icon iot-ping-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class=" iot-icon iot-eventstart-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class=" iot-icon iot-door-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class=" iot-icon iot-movementduration-icon"></span>',
									'</span>',
								'</span>',
							'</li>',
							'<li class="cooleriot-display-table asset-second-row">',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">{[CoolerIoTMobile.util.Renderers.standardTime(values.EventTime)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">{[CoolerIoTMobile.util.Renderers.standardTime(values.StartTime)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">{[CoolerIoTMobile.util.Renderers.getStatus(values.IsDoorOpen)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">{MovementDuration}s</div></span>',
							'</li>',
						'</ul></div>'
		),
		grouped: true
	}
});