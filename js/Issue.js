Cooler.Issue = new Cooler.Form({
	controller: 'Opportunity',

	keyColumn: 'OpportunityId',

	title: 'Issue',

	securityModule: 'Survey',

	disableAdd: true,

	hybridConfig: function () {
		return [
			{ dataIndex: 'OpportunityId', type: 'int' },
			{ dataIndex: 'ImageCount', type: 'int' },
			{ dataIndex: 'SurveyId', type: 'int' },
			{ header: 'Issue Type', dataIndex: 'OpportunityType', type: 'string', width: 120 },
			{ header: 'Sub Issue Type', dataIndex: 'SubOpportunityType', type: 'string', width: 200 },
			{ header: 'Note', dataIndex: 'Note', type: 'string', width: 120 },
			{ header: 'Image posted in Answer', dataIndex: 'OpportunityId', renderer: this.issueImageRenderer, sortable: false }
		];
	},

	issueImageRenderer: function (value, model, record) {
		var data = record.data;
		var returnHtml = '';
		if (data.ImageCount > 0) {
			returnHtml += '<div class="alertIssues-div-container">';
			returnHtml += '<img src="./FileServer/Opportunity/' + record.get('OpportunityId') + '.png" onerror="this.style.display=\'none\';" class="alertIssues-image"/>';
			returnHtml + '</div>';
		}
		return returnHtml;
	},

	onGridCreated: function (grid) {
		grid.on("rowdblclick", this.onOpportunityClick, this);
	},

	onOpportunityClick: function (grid, rowIndex, e, options) {
		var store = grid.getStore(),
		 record = store.getAt(rowIndex);
		var opportunityId = record.get('OpportunityId');
		var imagePath = './FileServer/Opportunity/';
		if (record.data.ImageCount != 0) {
			Cooler.ShowMultiImageWindow(record.data.ImageCount, record, imagePath, opportunityId);
		}
	}
});