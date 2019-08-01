Cooler.ProspectDetail = new Cooler.Form({
	controller: 'ProspectDetail',

	keyColumn: 'ProspectDetailId',

	title: 'Prospect Detail',

	securityModule: 'Survey',

	disableAdd: true,

	hybridConfig: function () {
		return [
			{ dataIndex: 'ProspectDetailId', type: 'int' },
			{ dataIndex: 'ProspectId', type: 'int' },
			{ header: 'Question', dataIndex: 'Question', type: 'string', width: 180 },
			{ header: 'Question Number', dataIndex: 'QuestionNumber', type: 'int', width: 100, align: 'right' },
			{ header: 'Answer', dataIndex: 'Response', type: 'string', width: 120 }
		];
	}
});