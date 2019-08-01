Cooler.Address = new Cooler.Form({
	title: 'Address',
	keyColumn: 'AddressId',
	gridIsLocal: true,
	newListRecordData: { CountryId: '', StateId: ''},

	hybridConfig: function () {
		var countryCombo = DA.combo.create({ controller: 'combo', baseParams: { comboType: 'Country' }, listWidth: 220 }),
			stateCombo = DA.combo.create({ controller: 'combo', listWidth: 220, baseParams: { comboType: 'State' } });
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'CustomerId', type: 'int' },
			{ dataIndex: 'AssociationTypeId', type: 'int' },
			{ dataIndex: 'StateName', type: 'string' },
			{ dataIndex: 'CountryName', type: 'string' },
			{ header: 'Address', dataIndex: 'Address1', type: 'string', editor: new Ext.form.TextField({ maxLength: 100, allowBlank: false }) },
			{ header: 'Address2', dataIndex: 'Address2', type: 'string', editor: new Ext.form.TextField({ maxLength: 100, allowBlank: false }) },
			{ header: 'Zip Code', dataIndex: 'PostalCode', type: 'string', editor: new Ext.form.TextField({ maxLength: 100 }) },
			{ header: 'City', dataIndex: 'City', type: 'string', editor: new Ext.form.TextField({ maxLength: 100, allowBlank: false }) },
			{ header: 'Country', dataIndex: 'CountryId', displayIndex: 'CountryName', editor: countryCombo, renderer: 'proxy' },
			{ header: 'State', dataIndex: 'StateId', displayIndex: 'StateName', editor: stateCombo, renderer: 'proxy' },
			{ header: 'Phone', dataIndex: 'Phone', type: 'string', editor: new Ext.form.NumberField({ maxLength: 15, allowDecimals: false, vtype: 'phone' }) },
			{ header: 'Fax', dataIndex: 'Fax', type: 'string', editor: new Ext.form.NumberField({ maxLength: 15, allowDecimals: false, vtype: 'phone' }) }
		];
	},
	setAssociation: function (data) {
		this.newListRecordData = data
	}
});