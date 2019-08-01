Ext.define('Df.field.Combo', {
	extend: 'Ext.field.Select',
	xtype: "df-combo",
	config: {
		plugins: [{ xclass: 'Df.plugins.ComboStore' }],
		displayField: 'DisplayValue',
		valueField: 'LookupId',
		comboType: null,
		autoSelect: false
	},
	applyComboType: function (newValue) {
		if (newValue !== null) {
			this.setStore(Ext.getStore(newValue + "Combo"));
		}
		return newValue;
	}
});