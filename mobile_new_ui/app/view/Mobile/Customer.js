Ext.define('CoolerIoTMobile.view.Mobile.Customer', {
	extend: 'Ext.Container',
	xtype: 'mobile-customer',
	config: {
		layout: 'fit',
		title: 'Customer',
		cls: 'asset-item-list-container',
		items: [
			{
				xtype: 'toolbar',
				docked: 'top',
				layout: 'hbox',
				flex: 1,
				cls: 'asset-list-toolbar',
				items: [
					{
						xtype: 'searchfield',
						width: '80%',
						name: 'Name',
						cls: 'search-field-white-bg',
						placeHolder: 'Search',
						docked: 'left',
						itemId: 'searcNameField'
					},
					{
						xtype: 'df-buttonplus',
						iconCls: 'map',
						itemId: 'map',
						docked: 'right',
						cls: 'white-color'
					}
				]
			},
			{
				xtype: 'mobile-location',
				itemId: 'customerList',
				cls: 'asset-item-list-container',
				flex: 1,
				store: 'Customer'
			}
		]
	},

	load: function () {
		var list = this.down("#customerList")
		var store = list.getStore();
		store.load();
	}
});
