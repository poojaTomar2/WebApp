Ext.define('CoolerIoTMobile.model.SalesRepIssue', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'UserId',
		fields: [
			{ name: 'FirstName', type: 'string' },
			{ name: 'LastName', type: 'string' },
			{ name: 'RepId', type: 'int' },
			{ name: 'OpenIssues', type: 'int' },
            { name: 'OpenPurityIssues', type: 'int' },
			{ name: 'OpenMissingCoolerIssues', type: 'int' },
			{ name: 'OldOpenIssues', type: 'int' },
			{ name: 'IssuesClosedSinceYesterday', type: 'int' },
			{ name: 'IssuesClosedLast5Days', type: 'int' },
			{ name: 'OpenHighPriorityIssues', type: 'int' },
			{ name: 'ClosedHighPriorityIssues', type: 'int' },
			{ name: 'UserId', type: 'int' }
		]
	}
});
