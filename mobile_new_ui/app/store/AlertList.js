Ext.define('CoolerIoTMobile.store.AlertList', {
	extend: 'Df.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.AlertList',
		proxy: {
			enablePagingParams: true,
			reader: {
				type: 'json',
				rootProperty: 'records',
				totalProperty: 'recordCount'
			}
		},
		sorters: [
			{
				property: 'StatusId,AlertAt',
				direction: 'ASC'
			}
		],
		listeners: {
			'load': function (store, records, success, options) {
				if (records.length > 0) {
					var alertList = Ext.ComponentQuery.query('alert-list')[0],
					 response = store.getProxy().getReader().rawData,
				 	 alerts = response.records,
					 actions = response.actions.records, dictionary = {}, alert, action, i, len;
					for (i = 0, len = alerts.length; i < len; i++) {
						alert = alerts[i];
						alert.actions = [];
						dictionary[alert.AlertId] = alert;
					}
					for (i = 0, len = actions.length; i < len; i++) {
						action = actions[i];
						var data = dictionary[action.AlertId];
						if (data)
							dictionary[action.AlertId].actions.push(action);
					}
					for (i = 0, len = alerts.length; i < len; i++) {
						alert = alerts[i];
						outer:
							for (j = 0, lenAction = alert.actions.length ; j < lenAction; j++) {
								switch (alert.actions[j].StatusId) {
									case CoolerIoTMobile.Enums.ActionStatus.Planned:
										alerts[i].StatusId = CoolerIoTMobile.Enums.AlertStatus.Planned;
										alerts[i].Status = "Planned";
										break outer;
									case CoolerIoTMobile.Enums.ActionStatus.Completed:
										alerts[i].StatusId = CoolerIoTMobile.Enums.AlertStatus.Complete;
										alerts[i].Status = "Complete";
										break outer;
									case CoolerIoTMobile.Enums.ActionStatus.Void:
										alerts[i].StatusId = CoolerIoTMobile.Enums.AlertStatus.New;
										alerts[i].Status = "New";
										break;
								}
							}
					}
					if (store.getData().length == store.getPageSize()) {
						store.setData(alerts)
						alertList.refresh();
					}
					else {
						store.add(alerts);
						alertList.refresh();
					}
				}
			}
		}, 
		pageSize: 25,
		remoteSort: true
	}
});
