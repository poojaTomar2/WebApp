Ext.define('CoolerIoTMobile.store.SmartDeviceMovement', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.SmartDeviceMovement',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('SmartDeviceMovement', true),
			enablePagingParams: true,
			extraParams: {
				action: 'list'
			},
			reader: {
				type: 'json',
				rootProperty: 'records',
				totalProperty: 'recordCount'
			}
		},
		groupTpl: new Ext.XTemplate('<div><table class="cooler-list-header"><tr><td><div class="asset-header device-form-font" style="text-align:left;"> Start Date : {[CoolerIoTMobile.util.Renderers.standardDate(values.StartTime)]}</div></td></tr></table></div>'),
		sorters: [
			{
				property: 'SmartDeviceMovementId',
				direction: 'DESC'
			}
		],
		grouper: {
			sortProperty: "StartTime",
			direction: "DESC",
			groupFn: function (record) {
				return Ext.Date.clearTime(record.data.StartTime, true);
			}
		},
		pageSize: 25
	}
});
