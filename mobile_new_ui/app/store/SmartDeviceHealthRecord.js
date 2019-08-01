Ext.define('CoolerIoTMobile.store.SmartDeviceHealthRecord', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.SmartDeviceHealthRecord',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('SmartDeviceHealthRecord', true),
			enablePagingParams: true,
			extraParams: {
				action: 'list',
				limit: 0
			},
			reader: {
				type: 'json',
				rootProperty: 'records',
				totalProperty: 'recordCount'
			}
		},
		groupTpl: new Ext.XTemplate('<div><table class="cooler-list-header"><tr><td><div class="asset-header device-form-font" style="text-align:left;"> Event Date : {[CoolerIoTMobile.util.Renderers.standardDate(values.EventTime)]}</div></td></tr></table></div>'),
		sorters: [
			{
				property: 'SmartDeviceHealthRecordId',
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
