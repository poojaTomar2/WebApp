Cooler.ADFReport = Ext.extend(Cooler.Form, {

	controller: 'ADFReport',


	title: 'ADF Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'ADFReport',
	constructor: function (config) {
		Cooler.ADFReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			custom: {
				loadComboTypes: true
			},
			defaults: { sort: { dir: 'ASC', sort: 'TableName' } }
		});
	},

	hybridConfig: function () {
		return [
			{ header: 'Table Name', type: 'string', dataIndex: 'TableName', width: 150 },
			{ header: 'Last Records Created On', type: 'date', dataIndex: 'CreatedOn', width: 200, renderer: Cooler.renderer.DateTimeWithTimeZone }
		];
	}

});
Cooler.ADFReport = new Cooler.ADFReport({ uniqueId: 'ADFReport' });