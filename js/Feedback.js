Cooler.Feedback = new Cooler.Form({
	controller: 'Feedback',
	keyColumn: 'ConsumerFeedbackId',
	title: 'Feedback',
	disableAdd: true,
	securityModule: 'Feedback',
	hybridConfig: function () {
		return [
			{ dataIndex: 'ConsumerFeedbackId', type: 'int'},
			{ header: 'Consumer Name', dataIndex: 'Username', type: 'string', width: 150 },
			{ header: 'Comment', dataIndex: 'Comment', type: 'string', width: 150 },
			{ header: 'FileName', dataIndex: 'FileName', type: 'string', width: 150 },
			{ header: 'Issue', dataIndex: 'Issue', type: 'string', width: 150 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime }
		];
	}
});