Ext.define('CoolerIoTMobile.view.Mobile.AlertActionWindow', {
	extend: 'Ext.form.Panel',
	xtype: 'mobile-alertaction-win',
	config: {
		callback: undefined,
		windowScope: undefined,
		alertActionId: 0,
		args: undefined,
		action : undefined,
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
				hidden: true,
				options: [
					{ text: 'Void', value: '1' },
					{ text: 'Completed', value: '255' },
					{ text: 'Planned', value: '254' }
				]
			},
			{
				xtype: 'df-combo',
				label: 'To-Do',
				itemId: 'toDoAction',
				name: 'ToDoActionId',
				storeId: 'ToDoActionTypeCombo',
				comboType: 'ToDoActionType',
				hidden: true
			},
			{
				xtype: 'textareafield',
				label: 'Notes',
				name: 'Notes'
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