Ext.define('CoolerIoTMobile.controller.Attachment', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			attachment: 'mobile-attachment',
			attachmentWin: 'mobile-attachment-window'
		},
		control: {
			'mobile-attachment-window #confirmBtn': {
				singletap: 'onActionUpdateSave'
			},
			'mobile-attachment-window #cancelBtn': {
				singletap: 'onActionUpdateCancel'
			}
		}
	},
	onActionUpdateCancel: function (doCallback) {
		var attachmentWin = this.getAttachmentWin()
		attachmentWin.hide();
		attachmentWin.destroy();
	},

	onActionUpdateSave: function () {
		var updateWindow = this.getAttachmentWin(),
			form = updateWindow,
			attachmentTypeId = form.getFields('AttachmentTypeId').getValue(),
			associationType = 'Asset',
			assetId = updateWindow.getAssetId();

		Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Saving action..' });
		var request = {
			url: Df.App.getController('Attachment'),
			xhr2: true,
			method: 'POST',
			params: {
				AssociationType: associationType,
				AssociationId: assetId,
				action: 'save'
			},
			waitMsg: 'Uploading your file...',
			success: function (form, response) {
				Ext.Viewport.setMasked(false);
				if (!response.success) {
					Ext.Msg.alert('Error', response.info);
				}
				this.onActionUpdateCancel(true);
				var store = Ext.getStore('Attachment');
				store.load();
			},
			failure: function (form, response) {
				Ext.Viewport.setMasked(false);
				this.onActionUpdateCancel(true);
				Ext.Msg.alert('Error', 'Some error occured.');
			},
			scope: this
		}
		var input = Ext.Viewport.down("filefield").getComponent().input; var files = input.dom.files;
		request.binaryData = files[0];
		if (files.length == 0) {
			Ext.Viewport.setMasked(false);
			Ext.Msg.alert('Alert', 'Please select any file first.');
			return;
		}
		form.submit(request);
		
	}
});