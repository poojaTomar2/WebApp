DA.AppUser = new DA.Form({
	formTitle: 'User: {0}',
	listTitle: 'Users',
	keyColumn: 'UserId',
	captionColumn: 'Username',
	controller: 'AppUser',
	winConfig: { width: 900, height: 300 },
	hybridConfig: [
		{ header: 'First Name', dataIndex: 'FirstName', width: 100, type: 'string' },
		{ header: 'Middle Name', dataIndex: 'MiddleName', width: 100, type: 'string' },
		{ header: 'Last Name', dataIndex: 'LastName', width: 100, type: 'string' },
		{ header: 'Nick Name', dataIndex: 'NickName', width: 100, type: 'string' },
		{ header: 'Username', dataIndex: 'Username', width: 100, type: 'string' },
		{ header: 'Email', dataIndex: 'PrimaryEmail', width: 100, type: 'string' },
		{ header: 'Role', dataIndex: 'Role', width: 100, type: 'string' },
		{ header: 'Impersonate', dataIndex: 'UserId', type: 'int', renderer: ExtHelper.renderer.ImpersonateHyperlink("<a href='Login.aspx?impersonate={0}'>Impersonate</a>") }
	],

	onDataLoaded: function(form, data) {
		var formData = data.data;
		var id = formData.Id;

		if (isNaN(id)) {
			id = 0;
		}

		this.fields.passwordField.allowBlank = id != 0;
	},

	fields: {},

	createForm: function(config) {
		var roleCombo = ExtHelper.CreateCombo({ fieldLabel: 'Role', hiddenName: 'RoleId', baseParams: { comboType: 'Role' }, width: 150, allowBlank: false });
		var passwordField = new Ext.form.TextField({ fieldLabel: 'Password', name: 'Password', minLength: 5, maxLength: 50, inputType: 'password', width: 150, allowBlank: false, regex: /^\w*(?=\w*\d)(?=\w*[a-zA-Z])\w*$/, regexText: 'Password must be alphanumeric' });
		this.fields.passwordField = passwordField;

		this.on('dataLoaded', this.onDataLoaded, this);

		var col1 = {
			items: [
				{ fieldLabel: 'First Name', name: 'FirstName', allowBlank: false, maxLength: 25 },
	            { fieldLabel: 'Middle Name', name: 'MiddleName', maxLength: 25 },
	            { fieldLabel: 'Last Name', name: 'LastName', allowBlank: false, maxLength: 25 },
				{ fieldLabel: 'Username', name: 'Username', allowBlank: false, maxLength: 25 },
	            passwordField,
				roleCombo,
	            { fieldLabel: 'Email Address', name: 'PrimaryEmail', vtype: 'email', maxLength: 50 }
			]
		};

		var col2 = {
			items: [
	            { fieldLabel: 'Nick Name', name: 'NickName', maxLength: 50 },
	            { fieldLabel: 'Phone Number', name: 'PrimaryPhone', maxLength: 50 },
	            { fieldLabel: 'Notes', name: 'Notes', xtype: 'textarea' }
			]
		};

		Ext.apply(config, {
			layout: 'column',
			defaults: { columnWidth: .5, layout: 'form', defaultType: 'textfield', labelWidth: 90, defaults: { width: 250 }, border: false },
			border: false,
			items: [col1, col2]
		});
		return config;
	}
});