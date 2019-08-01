Cooler.ContactAddress = new Cooler.Form({
	title: 'Contact',
	keyColumn: 'ContactId',
	gridIsLocal: true,
	newListRecordData: { ContactTypeId: ''},
	hybridConfig: function () {
		var contactTypeCombo = DA.combo.create({ store: Cooler.LocationType.Location.comboStores.ContactType, mode: 'local' });
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'AssociationTypeId', type: 'int' },
			{ header: 'Contact Type', dataIndex: 'ContactTypeId', type: 'int', renderer: ExtHelper.renderer.Combo(contactTypeCombo), editor: contactTypeCombo, scope: this },
			{ header: 'First Name', dataIndex: 'FirstName', type: 'string', editor: new Ext.form.TextField({ maxLength: 100, allowBlank: false }) },
			{ header: 'Middle Name', dataIndex: 'MiddleName', type: 'string', editor: new Ext.form.TextField({ maxLength: 100 }) },
			{ header: 'Last Name', dataIndex: 'LastName', type: 'string', editor: new Ext.form.TextField({ maxLength: 100, allowBlank: false }) },
			{ header: 'Home Phone', dataIndex: 'HomePhone', type: 'string', editor: new Ext.form.TextField({ maxLength: 15, vtype: 'phone' }) },
			{ header: 'Work Phone', dataIndex: 'WorkPhone', type: 'string', editor: new Ext.form.TextField({ maxLength: 15, vtype: 'phone' }) },
			{ header: 'Cell Phone', dataIndex: 'CellPhone', type: 'string', editor: new Ext.form.TextField({ maxLength: 15, vtype: 'phone' }) },
			{ header: 'Personal Email Address', dataIndex: 'PersonalEmailAddress', type: 'string', editor: new Ext.form.TextField({ maxLength: 100, vtype: 'email' }) },
			{ header: 'Corporate Email Address', dataIndex: 'CorporateEmailAddress', type: 'string', editor: new Ext.form.TextField({ maxLength: 100, vtype: 'email' }) }
		];
	},
	setAssociation: function (data) {
		this.newListRecordData = data
	}
});