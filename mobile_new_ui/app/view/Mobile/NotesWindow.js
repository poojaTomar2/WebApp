Ext.define('CoolerIoTMobile.view.Mobile.NotesWindow', {
	extend: 'Ext.form.Panel',
	xtype: 'mobile-notes-win',
	config: {
		windowScope: undefined,
		associationId: 0,
		args: undefined,
		modal: true,
		hideOnMaskTap: true,
		showAnimation: {
			type: 'popIn',
			duration: 250,
			easing: 'ease-out'
		},
		hideAnimation: {
			type: 'popOut',
			duration: 250,
			easing: 'ease-out'
		},
		centered: true,
		width: '85%',
		height: '16.5em',
		padding: '5 5 5 5',
		defaults: {
			margin: '0 0 5 0',
			labelWidth: '45%'
		},
		items: [
			{
				xtype: 'selectfield',
				label: 'Note Type',
				itemId: 'noteType',
				name: 'NoteTypeId',
				usePicker: 'true',
				options: [
					{ text: 'Pdf', value: '9' }
				]
			},
			{
				xtype: 'textareafield',
				label: 'Title',
				name: 'Title',
				cls: 'note-text-title'
			},
			{
				xtype: 'textareafield',
				label: 'Notes',
				name: 'Notes'
			},
			{
				xtype: 'hiddenfield',
				name: 'NoteId'
			},
			{
				xtype: 'container',
				layout: 'hbox',
				items: [
					{
						xtype: 'df-buttonplus',
						text: 'Cancel',
						ui: 'decline',
						itemId: 'cancelBtn'
					},
					{
						xtype : 'spacer'
					},
					{
						xtype: 'df-buttonplus',
						text: 'Save',
						ui: 'confirm',
						itemId: 'confirmBtn'
					}
				]
			}
		]
	}
});