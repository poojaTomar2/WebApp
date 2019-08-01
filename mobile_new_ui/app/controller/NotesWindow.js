Ext.define('CoolerIoTMobile.controller.NotesWindow', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			notesWin: 'mobile-notes-win'
		},
		control: {
			'mobile-notes-win #confirmBtn': {
				singletap: 'onActionUpdateSave'
			},
			'mobile-notes-win #cancelBtn': {
				singletap: 'onActionUpdateCancel'
			}
		}
	},
	onActionUpdateCancel: function (doCallback) {
		var notesWin = this.getNotesWin()
		notesWin.hide();
		notesWin.destroy();
	},

	onActionUpdateSave: function () {
		var updateWindow = this.getNotesWin(),
			form = updateWindow,
			title = form.getFields('Title').getValue(),
			notesValue = form.getFields('Notes').getValue(),
			associationId = updateWindow.getAssociationId(),
			noteTypeId = form.getFields('NoteTypeId').getValue(),
			notesId = form.getFields('NoteId').getValue(),
			id = 0,
			associationType = 'Asset'
		if (notesId == "") {
			notesId = 0;
		}
		if (title == "" || notesValue == "") {
			Ext.Msg.alert("Error", "Please fill value in title and notes");
			return true;
		}
		Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Saving action..' });
		Ext.Ajax.request({
			url: Df.App.getController('Note'),
			params: {
				id: notesId,
				Title: title,
				Notes: notesValue,
				AssociationType:associationType,
				NoteTypeId: noteTypeId,
				AssociationId: associationId,
				action: 'save'
			},
			success: function (response) { 
				var data = Ext.decode(response.responseText);
				Ext.Viewport.setMasked(false);
				if (!data.success) {
					Ext.Msg.alert('Error', data.info);
				}
				this.onActionUpdateCancel(true);
				var store = Ext.getStore('Notes');
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