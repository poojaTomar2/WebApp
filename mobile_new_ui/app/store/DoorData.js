Ext.define('CoolerIoTMobile.store.DoorData', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.DoorData',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('SmartDeviceDoorStatus', true),
			enablePagingParams: true,
			extraParams: {
				action: 'list',
				limit: 0,
				sort: 'SmartDeviceDoorStatusId',
				dir: 'DESC'
			},
			reader: {
				type: 'json',
				rootProperty: 'records',
				totalProperty: 'recordCount'
			}
		},
		pageSize: 25,
		groupTpl: new Ext.XTemplate('<div><table class="cooler-list-header"><tr><td><div class="asset-header device-form-font" style="text-align:left;"> Door Date : {[CoolerIoTMobile.util.Renderers.standardDate(values.DoorOpen)]}</div></td></tr></table></div>'),
		remoteSort: false,
		sorters: [
			{
				property: 'SmartDeviceDoorStatusId',
				direction: 'DESC'
			}
		],
		grouper: {
			sortProperty: "DoorOpen",
			direction: "DESC",
			groupFn: function (record) {
				return Ext.Date.clearTime(record.data.DoorOpen, true);
			}
		}
	}
});
