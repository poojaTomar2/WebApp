Ext.define('CoolerIoTMobile.controller.AlertActionWindow', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			alertActionWin: 'mobile-alertaction-win'
		},
		control: {
			'mobile-alertaction-win #confirmBtn': {
				singletap: 'onActioUpdateSave'
			},
			'mobile-alertaction-win #cancelBtn': {
				singletap: 'onActionUpdateCancel'
			}
		}
	},
	onActionUpdateCancel: function (doCallback) {
		var alerActionWin = this.getAlertActionWin()
		alerActionWin.hide();
		alerActionWin.destroy();
		if (doCallback === true) {
			Ext.callback(alerActionWin.getCallback(), alerActionWin.getWindowScope());
		}
	},

	onActioUpdateSave: function () {
		var updateWindow = this.getAlertActionWin(),
			form = updateWindow,
			statusId = form.getFields('StatusId').getValue(),
			notesValue = form.getFields('Notes').getValue(),
			updateWindowConfig = updateWindow.config,
			alertActionId = updateWindowConfig.alertActionId,
			alertId = updateWindowConfig.alertId,
			toDoActionId = form.getFields('ToDoActionId').getValue();

		Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Saving action..' });
		Ext.Ajax.request({
			url: Df.App.getController('Alert'),
			params: {
				alertActionId: alertActionId,
				statusId: statusId,
				toDoActionId: toDoActionId,
				notes: notesValue,
				alertId: alertId,
				action: 'other',
				otherAction: 'SaveToDoStatus'
			},
			success: function (response) { 
				var data = Ext.decode(response.responseText);
				Ext.Viewport.setMasked(false);
				if (!data.success) {
					Ext.Msg.alert('Error', data.info);
				}
				this.onActionUpdateCancel(true);
				var grid = Ext.ComponentQuery.query("alert-list")[0];
				if (grid) {
					var store = grid.getStore();
					var listPlugin = grid.getPlugins()[0];
					var list = listPlugin.getList();
					// count total loaded records here
					var totalItemloaded = list.itemsCount;
					var currentPage = list.getStore().currentPage;
					var storeProxy = store.getProxy();
					// load store with specific start and end 
					storeProxy.setExtraParams({ action: 'list', asArray: 0, limit: totalItemloaded });
					store.loadPage(1);
					Ext.Msg.alert('Success', 'Action completed');
					// again set limit 25 to make work List paging
					storeProxy.setExtraParams({ action: 'list', asArray: 0, limit: 25 });
					list.getStore().currentPage = currentPage;
				}
			},
			failure: function () {
				Ext.Viewport.setMasked(false);
				this.onActionUpdateCancel(true);
				Ext.Msg.alert('Error', 'Some error occured.');
			},
			scope: this
		});
	}
});