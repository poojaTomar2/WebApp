Ext.define('CoolerIoTMobile.controller.VisitHistoryWindow', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			visitHistoryWin: 'mobile-visit-history-window-win'
		},
		control: {
			'mobile-visit-history-window-win #confirmBtn': {
				singletap: 'onActionUpdateSave'
			},
			'mobile-visit-history-window-win #cancelBtn': {
				singletap: 'onActionUpdateCancel'
			}
		}
	},
	onActionUpdateCancel: function (doCallback) {
		var visitHistoryWin = this.getVisitHistoryWin()
		visitHistoryWin.hide();
		visitHistoryWin.destroy();
	},

	onActionUpdateSave: function () {
		var updateWindow = this.getVisitHistoryWin(),
			form = updateWindow,
			statusId = form.getFields('StatusId').getValue(),
			notesValue = form.getFields('Notes').getValue(),
			visitDateTime = form.getFields('VisitDateTime').getValue(),
			visitByUserId = form.getFields('VisitByUserId').getValue(),
			assetVisitHistoryId = form.getFields('AssetVisitHistoryId').getValue(),
			assetId = updateWindow.getAssetId();

		visitDateTime = Ext.Date.format(new Date(visitDateTime), "Y-m-d g:i:s.z");
		if (assetVisitHistoryId == "") {
			assetVisitHistoryId = 0;
			visitDateTime = new Date();
			visitByUserId = Df.SecurityInfo.userId;
		}
		if (statusId == "" && notesValue == "") {
			Ext.Msg.alert("Error", "Please Enter Any Text");
			return true;
		}
		Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Saving action..' });
		Ext.Ajax.request({
			url: Df.App.getController('AssetVisitHistory'),
			params: {
				id: assetVisitHistoryId,
				StatusId: statusId,
				Notes: notesValue,
				VisitDateTime: visitDateTime,
				VisitByUserId: visitByUserId,
				AssetId: assetId,
				action: 'save'
			},
			success: function (response) { 
				var data = Ext.decode(response.responseText);
				Ext.Viewport.setMasked(false);
				if (!data.success) {
					Ext.Msg.alert('Error', data.info);
				}
				this.onActionUpdateCancel(true);
				var store = Ext.getStore('VisitHistory');
				store.load();
				
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