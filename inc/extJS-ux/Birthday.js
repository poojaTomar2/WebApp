/// <reference path="DA.js" />
DA.Birthday = function(config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Resource: {0}',
		listTitle: 'Resources',
		keyColumn: 'Id',
		captionColumn: 'Name',
		controller: 'Birthday'
	});
	DA.Birthday.superclass.constructor.call(this, config);
};

Ext.extend(DA.Birthday, DA.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'Name', type: 'string' },
		{ name: 'Id', type: 'int' }
	]),

	resourceUserId: null,

	doNotShowBirthDayNotification: function(options) {
		DA.UpdatePreference({ associationTypeId: 999, info: 'Birthday Do Not Show', successMessage: 'Birthday(s) for this month will not be shown again' });
	},
	cm: function() {
		var config = [];

		config.push({ header: 'Resource Id', dataIndex: 'Id', width: 80 });

		var cm = new Ext.grid.ColumnModel(config)

		return cm;
	},

	// to store fields locally for easy access later
	fields: {},

	createForm: function(config) {

		return config;
	},

	CreateFormPanel: function(config) {

	}
});

DA.Birthday = new DA.Birthday();

