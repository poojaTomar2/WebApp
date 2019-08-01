Ext.define('CoolerIoTMobile.view.Mobile.Visit', {
	extend: 'Ext.Container',
	xtype: 'mobile-visit',
	config: {
		layout: 'vbox',
		title: 'Visit',
		cls: 'asset-item-list-container',
		items: [
			{
				xtype: 'toolbar',
				cls: 'asset-list-toolbar',
				docked: 'top',
				layout: 'hbox',
				flex: 1,
				items: [
					{
						xtype: 'df-combo',
						itemId: 'dayfield',
						addAll: 'Today',
						comboType: 'Day',
						storeId: 'DayCombo',
						value: 0,
						width: '40%',
						docked: 'left',
						cls: 'white-color',
						sorters: [
							{
								property: 'LookupId',
								direction: 'ASC'
							}
						]

					},
					{
						xtype: 'searchfield',
						width: '45%',
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
				xtype: 'tabpanel',
				flex: 1,
				itemId: 'visitTabPanel',
				tabBarPosition: 'bottom',
				items: [
					{
						title: 'On Route',
						iconCls: 'star',
						cls: 'asset-item-list-container',
						xtype: 'mobile-location',
						itemId: 'onRouteVisitList',
						flex: 1,
						store: 'Visit'
					},
					{
						title: 'Off Route',
						iconCls: 'star',
						cls: 'asset-item-list-container',
						xtype: 'mobile-location',
						itemId: 'offRouteVisitList',
						flex: 1,
						store: 'Visit'
					}
				]
			}
		]
	}
});
