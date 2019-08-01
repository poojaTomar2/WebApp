Ext.define('Df.form.field.Lookup', {
	extend: 'Ext.form.field.ComboBox',
	alias: 'widget.df-lookup',
	displayField: 'DisplayValue',
	valueField: 'LookupId',
	queryMode: 'local',
	initComponent: function () {
		if (!this.store) {
			this.store = {
				model: 'Df.model.Lookup',
				autoDestroy: true,
				comboType: this.comboType
			};
		}
		this.callSuper();
	}
});