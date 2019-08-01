Cooler.SurveyDetail = new Cooler.Form({
	controller: 'SurveyDetail',

	keyColumn: 'SurveyDetailId',

	title: 'Survey Detail',

	disableAdd: true,

	securityModule: 'Survey',

	gridConfig: {
		defaults: { sort: { dir: 'ASC', sort: 'QuestionCategoryId' } }
	},


	hybridConfig: function () {
		return [
			{ dataIndex: 'SurveyDetailId', type: 'int' },
			{ dataIndex: 'ImageCount', type: 'int' },
			{ header: 'Survey Id', dataIndex: 'SurveyId', type: 'int' },
			{ header: 'Survey Date', dataIndex: 'SurveyDateTime', type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'User', dataIndex: 'PrimaryEmail', type: 'string', width: 200 },
			{ header: 'User Satisfaction', dataIndex: 'OverAllFeedback', type: 'string', width: 120 },
			{ header: 'Question Category', dataIndex: 'QuestionCategory', type: 'string', width: 120 },
			{ header: 'Question', dataIndex: 'Question', type: 'string', width: 200 },
			{ header: 'Question Number', dataIndex: 'QuestionNumber', type: 'int', width: 100, align: 'right' },
			{ header: 'Answer', dataIndex: 'Response', type: 'string', width: 120 },
			{ header: 'Point', dataIndex: 'Point', type: 'float', width: 120 },
			{ header: 'Image posted in Answer', dataIndex: 'SurveyDetailId', renderer: this.QuestionImageRenderer, sortable: false },
			{ header: 'Red Score Point', dataIndex: 'RedScorePoint', type: 'int', align: 'right', width: 60 }
		];
	},

	QuestionImageRenderer: function (value, model, record) {
		var data = record.data;
		var returnHtml = '';
		if (data.ImageCount > 0) {
			returnHtml += '<div class="alertIssues-div-container">';
			returnHtml += '<img src="./FileServer/SurveyQuestionImage/' + record.get('SurveyDetailId') + '.png" onerror="this.style.display=\'none\';" class="alertIssues-image"/>';
			returnHtml + '</div>';
		}
		return returnHtml;
	},

	onGridCreated: function (grid) {
		grid.on("rowdblclick", this.onSurveyDetailClick, this);
	},

	onSurveyDetailClick: function (grid, rowIndex, e, options) {
		var store = grid.getStore(),
		 record = store.getAt(rowIndex);
		var surveyDetailId = record.get('SurveyDetailId');
		var imagePath = './FileServer/SurveyQuestionImage/';
		if (record.data.ImageCount != 0) {
			Cooler.ShowMultiImageWindow(record.data.ImageCount, record, imagePath, surveyDetailId);
		}
	}
});