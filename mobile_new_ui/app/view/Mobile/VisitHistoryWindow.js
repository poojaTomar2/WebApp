Ext.define('CoolerIoTMobile.view.Mobile.VisitHistoryWindow', {
	extend: 'Ext.form.Panel',
	xtype: 'mobile-visit-history-window-win',
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
				label: 'Status',
				itemId: 'actionStatus',
				usePicker: 'true',
				name: 'StatusId',
				options: [
					{ text: 'Found', value: '157' },
					{ text: 'Missing', value: '158' },
					{ text: 'Wrong Location', value: '159' }
				]
			},
			{
				xtype: 'textareafield',
				label: 'Notes',
				name: 'Notes'
			},
			{
				xtype: 'hiddenfield',
				name: 'VisitDateTime'
			},
			{
				xtype: 'hiddenfield',
				name: 'VisitByUserId'
			},
			{
				xtype: 'hiddenfield',
				name: 'VisitId'
			},
			{
				xtype: 'hiddenfield',
				name: 'AssetVisitHistoryId'
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