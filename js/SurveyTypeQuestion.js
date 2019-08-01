Cooler.SurveyTypeQuestion = new Cooler.Form({
	controller: 'SurveyTypeQuestion',

	quickSaveController: 'SurveyTypeQuestion',

	keyColumn: 'SurveyTypeQuestionId',

	title: 'Survey Type Question',

	gridPlugins: [new DA.form.plugins.Inline()],

	newListRecordData: { SurveyQuestionId: '' },

	hybridConfig: function () {
		var surveyQuestionCombo = DA.combo.create({ controller: 'combo', listWidth: 300, baseParams: { comboType: 'SurveyQuestion' } });
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'SurveyTypeId', type: 'int' },
			{ dataIndex: 'SurveyTypeQuestionId', type: 'int' },
			{ dataIndex: 'SurveyQuestion', type: 'string' },
			{ header: 'Survey Question', dataIndex: 'SurveyQuestionId', displayIndex: 'SurveyQuestion', type: 'int', editor: surveyQuestionCombo, renderer: 'proxy', width: 350 }
		];
	}
});