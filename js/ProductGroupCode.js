Cooler.ProductGroupCode = new Cooler.Form({
	title: 'Product Group Code',
	keyColumn: 'ProductGroupCodeId',
	gridIsLocal: true,
	hybridConfig: function () {
		var productGroupCodeCombo = DA.combo.create({ itemId: 'groupingCodeCombo', allowBlank: false, name: 'GroupingCodeId', hiddenName: 'GroupingCodeId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'GroupingCode' } })
		this.productGroupCodeCombo = productGroupCodeCombo;
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'GroupingCodeTypeDescription', type: 'string' },
			{ dataIndex: 'GroupingTypeId', type: 'int' },
			{ header: 'Product Group Code', dataIndex: 'GroupingCodeId', displayIndex: 'GroupingCodeTypeDescription', editor: productGroupCodeCombo, width: 220, renderer: 'proxy' }
		];
	},
	setAssociation: function (data) {
		this.newListRecordData = data
	},
	onAfterEdit: function (e) {
		var record = e.record;
		var store = e.grid.getStore();
		var records = store.data.items;
		var prdouctGroupComboStore = this.productGroupCodeCombo.getStore();
		var selectedComboValue = this.productGroupCodeCombo.getValue();
		var comboRecord = prdouctGroupComboStore.findExact('LookupId', selectedComboValue);
		var selectedRecordGroupTypeId = this.productGroupCodeCombo.getStore().data.items[comboRecord].data.CustomStringValue;
		if (record.data.GroupingTypeId == 0) {
			record.data.GroupingTypeId = Number(selectedRecordGroupTypeId);
		}

		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			if ((records.length != 1 && record.data.GroupingTypeId == Number(selectedRecordGroupTypeId) && record != e.record)) {
				Ext.Msg.alert('Info', "Same Group Type can not assign");
				store.remove(e.record);
				return;
			}
		}
	},
	onGridCreated: function (grid) {
		grid.on('afterEdit', this.onAfterEdit, this);
	}
});