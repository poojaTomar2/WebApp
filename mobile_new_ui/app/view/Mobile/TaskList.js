Ext.define('CoolerIoTMobile.view.Mobile.TaskList', {
	extend: 'Ext.form.Panel',
	xtype: 'mobile-taskList',
	cls: 'asset-item-list-container',
	config: {
		title: 'Task List',
		defaultType: 'button',
		defaults: {
			margin: '10 0 0 0',
			ui: 'cooler-action-btn'
		},
		items: [
			{
				text: 'Survey'
			},
			{
				text: 'Stock Count'

			},
			{
				text: 'Order Taking'
			},
			{
				text: 'Cooler List'
			}
		]
	}
});