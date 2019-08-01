Ext.define('Df.model.Lookup', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'LookupId',
		fields: [
			{ name: 'LookupId', type: 'int' },
			{ name: 'DisplayValue', type: 'auto' },
			{ name: 'CustomStringValue', type: 'string' },
			{ name: 'CustomValue', type: 'int' },
			{ name: 'SortOrder', type: 'int' }
		]
	}
});