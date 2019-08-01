Ext.define('CoolerIoTMobile.view.Tablet.MyTeam', {
	extend: 'Ext.Container',
	xtype: 'tablet-MyTeam',
	config: {
		layout: 'hbox',
		items: [
			{
				xtype: 'tablet-SalesRepIssueList',
				flex: 1
			},
			{
				xtype: 'alert-list-base',
				itemId: 'tablet-alert-list',
				width: window.innerWidth < 1600 ? '19em' : '30em'
			}
		]
	}
});