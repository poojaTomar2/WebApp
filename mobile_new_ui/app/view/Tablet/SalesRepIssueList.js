Ext.define('CoolerIoTMobile.view.Tablet.SalesRepIssueList', {
	extend: 'Ext.grid.Grid',
	xtype: 'tablet-SalesRepIssueList',
	config: {
		store: 'SalesRepIssue',
		scrollToTopOnRefresh: false,
		cls: 'df-autoHeight',
		titleBar: {
			hidden: true
		}
	},

	initialize: function () {
		var numberWidth = window.innerWidth <= 1024 ? 70 : 100;
		this.setColumns([
			{
				text: 'Sales Rep',
				dataIndex: 'FirstName',
				width: window.innerWidth <= 1024 ? 80: 150,
				renderer: function (value, record) {
					return (record.data.FirstName + ' ' + record.data.LastName);
				}
			},
			{
				text: 'Open Issues',
				dataIndex: 'OpenIssues',
				width: numberWidth
			},
			{
				text: 'Issues with Cycle > 5 days',
				dataIndex: 'OldOpenIssues',
				width: numberWidth
			},
			{
				text: 'Issues Closed Yesterday',
				dataIndex: 'IssuesClosedSinceYesterday',
				width: numberWidth
			},
			{
				text: 'Issues Closed in 5 days',
				dataIndex: 'IssuesClosedLast5Days',
				width: numberWidth
			},
			{
				text: 'Open High Priority Issues',
				dataIndex: 'OpenHighPriorityIssues',
				width: numberWidth
			},
			{
				text: 'High Priority Issues Closed in 5 days',
				dataIndex: 'ClosedHighPriorityIssues',
				width: numberWidth
			}
		]);
		this.callParent(arguments);
	}
});
