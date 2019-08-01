Ext.define('CoolerIoTMobile.store.SmartDevicePowerConsumption', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.SmartDevicePowerConsumption',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('SmartDevicePowerConsumption', true),
			enablePagingParams: true,
			extraParams: {
				action: 'list',
				limit: 0,
				sort: 'SmartDevicePowerConsumptionId',
				dir: 'DESC'
			},
			reader: {
				type: 'json',
				rootProperty: 'records',
				totalProperty: 'recordCount'
			}
		},
		groupTpl: new Ext.XTemplate('<div><table class="cooler-list-header"><tr><td><div class="asset-header device-form-font" style="text-align:left;">{[CoolerIoTMobile.util.Renderers.standardDate(values.EventTime)]}</div></td></tr></table></div>'),
		sorters: [
			{
				property: 'SmartDevicePowerConsumptionId',
				direction: 'DESC'
			}
		],
		grouper: {
			sortProperty: "EventTime",
			direction: "DESC",
			groupFn: function (record) {
				return Ext.Date.clearTime(record.data.EventTime, true);
			}
		},
		pageSize: 25
	}
});
