Ext.define('CoolerIoTMobile.controller.SalesRepIssueList', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			'salesRepList': 'tablet-main #salesRepListItem',
			'alertList': 'alert-list'
		},
		control: {
			'tablet-SalesRepIssueList': {
				itemsingletap: 'onSalesRepListClick'
			}
		}
	},
	onSalesRepListClick: function (dataview, index, target, record, e, eOpts) {
		//TODO: load Alert List data
		var me = this;
		switch (e.target.className) {
			case 'OpenIssues-field':
				break;
			case 'OpenPurityIssues':
				break;
			case 'OldOpenIssues':
				break;
			case 'OpenMissingCoolerIssues':
				break;
			case 'IssuesClosedSinceYesterday':
				break;
			case 'IssuesClosedLast5Days':
				break;
		}
		// when click on sales rep cell
		if (e.target.$column && e.target.$column.getDataIndex() == 'FirstName')
			this.getAlertList().loadData(record.data.RepId);
	}
});