Ext.define('CoolerIoTMobile.view.Mobile.AttachmentWindow', {
	extend: 'Ext.form.Panel',
	xtype: 'mobile-attachment-window',
	config: {
		windowScope: undefined,
		assetId: 0,
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
		height: '15em',
		padding: '5 5 5 5',
		defaults: {
			margin: '0 0 5 0',
			labelWidth: '45%'
		},
		items: [
			{
				xtype: 'selectfield',
				label: 'Attachment type',
				name: 'AttachmentTypeId',
				usePicker: 'true',
				options: [
					{ text: 'Location', value: '10' }
				]
			},
			{
				xtype: 'filefield',
				accept:"image/*",
				label: 'Select File',
				name: 'selectFile',
				itemId: 'selectFile',
				capture: "camera"
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