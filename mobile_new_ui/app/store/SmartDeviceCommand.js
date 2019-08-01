Ext.define('CoolerIoTMobile.store.SmartDeviceCommand', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.SmartDeviceCommand',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('SmartDeviceCommand', true),
			enablePagingParams: true,
			extraParams: {
				action: 'list',
				limit: 0,
				sort: 'SmartDeviceCommandId',
				dir: 'DESC'
			},
			reader: {
				type: 'json',
				rootProperty: 'records',
				totalProperty: 'recordCount'
			}
		},
		groupTpl: new Ext.XTemplate('<div><table class="cooler-list-header"><tr><td><div class="asset-header device-form-font" style="text-align:left;"> Event Date : {[CoolerIoTMobile.util.Renderers.standardDate(values.CreatedOn)]}</div></td></tr></table></div>'),
		sorters: [
			{
				property: 'SmartDeviceCommandId',
				direction: 'DESC'
			}
		],
		grouper: {
			sortProperty: "CreatedOn",
			direction: "DESC",
			groupFn: function (record) {
				return Ext.Date.clearTime(record.data.CreatedOn, true);
			}
		},
		pageSize: 25
	}
});




