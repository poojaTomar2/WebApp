
Cooler.Tag = function (config) {

	var tagsStore = new Ext.data.SimpleStore({
		fields: ['LookupId', 'DisplayValue'],
		data: []
	});

	var select = new Ext.ux.BoxSelect({
		fieldLabel: 'Tags',
		resizable: true,
		name: 'TagsValue',
		itemId: 'tagsCombo',
		hiddenName: 'Tags',
		store: tagsStore,
		mode: 'local',
		displayField: 'DisplayValue',
		//displayFieldTpl: '{DisplayValue} ({LookupId})',
		valueField: 'DisplayValue',
		addUniqueValues: true,
	
	});

	return select;
};
