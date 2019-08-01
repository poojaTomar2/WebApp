/**
 * DcplFramework specific Lookup store
 */
Ext.define('Df.model.Lookup', {
	extend: 'Df.data.Model',
	idProperty: 'LookupId',
	fields: [
		{ name: 'LookupId', type: 'int' },
		{ name: 'DisplayValue', type: 'auto' },
		{ name: 'CustomStringValue', type: 'string' },
		{ name: 'CustomValue', type: 'int' },
		{ name: 'SortOrder', type: 'int' }
	]
});