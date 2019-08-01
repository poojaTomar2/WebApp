Ext.define('CoolerIoTMobile.view.Mobile.SmartDeviceConfig', {
	extend: 'Ext.dataview.List',
	xtype: 'configList',
	requires: ['Ext.plugin.ListPaging'],
	config: {
		title: 'Configuration',
		emptyText: 'No Data',
		store: 'SmartDeviceConfig',
		scrollToTopOnRefresh: true,
		striped: true,
		cls: 'asset-item-list-container',
		itemTpl: new Ext.XTemplate(
			'<div class="asset-item-container asset-item-health-container">',
			 '<ul>',
							'<li class="asset-first-row cooleriot-display-table">',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class="cooleriot-table-cell text-center iot-col-12_5">{Attribute}</span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-12_5">',
									'<span class="iot-mid-span">',
										'<span class="cooleriot-table-cell text-center iot-col-12_5">{Value}</span>',
									'</span>',
							'</li>',
						'</ul>',
			'</div>'
		)
	}
});