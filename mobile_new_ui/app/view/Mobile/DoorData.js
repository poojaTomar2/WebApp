Ext.define('CoolerIoTMobile.view.Mobile.DoorData', {
	extend: 'Ext.dataview.List',
	xtype: 'doorDataList',
	config: {
		plugins: [
             {
             	xclass: 'Ext.plugin.ListPaging',
             	pullRefereshText: 'Pull To Refresh',
             	autoPaging: true
             }
		],
		title: 'Door Data',
		emptyText: 'No Data',
		store: 'DoorData',
		scrollToTopOnRefresh: true,
		cls: 'asset-item-list-container',
		striped: true,
		itemTpl: new Ext.XTemplate(
			'<div class="asset-item-container asset-item-health-container">',
                            '<ul class="cooleriot-list-view">',
							'<li class="asset-first-row cooleriot-display-table">',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class=" iot-icon iot-door-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class=" iot-icon iot-eventstart-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class=" iot-icon iot-doorduration-icon"></span>',
									'</span>',
								'</span>',
							'</li>',
							'<li class="cooleriot-display-table asset-second-row">',
								'<span class="cooleriot-table-cell text-center iot-col-12_5"><div >{[CoolerIoTMobile.util.Renderers.standardTime(values.DoorOpen)]}</div></span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5"><div >{[CoolerIoTMobile.util.Renderers.standardTime(values.EventTime)]}</div></span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5"> <div>{DoorOpenDuration}s</div></span>',
							'</li>',
						'</ul></div>'
		),
		grouped: true
	}
});