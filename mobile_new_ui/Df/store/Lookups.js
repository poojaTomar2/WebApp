Ext.define('Df.store.Lookups', {
	extend: 'Ext.data.Store',
	requires: [
		'Df.model.Lookup'
	],
	config: {
		comboType: null,
		addAll: false,
		model: 'Df.model.Lookup',
		proxy: {
			type: 'ajax',
			url: 'Combo',
			extraParams: {
				addAll: false,
				limit: 0,
				asArray: 0
			},
			reader: {
				type: 'json',
				rootProperty: 'records'
			}
		},
		listeners: {
			load: function (store, records, successful, operation, eOpts) {
				if (records) {
					var addAll = store.getAddAll();
					if (addAll) {
						store.insert(0, { LookupId: 0, DisplayValue: typeof addAll === 'boolean' ? 'All' : addAll })
					}
				}
			}
		}
	},

	constructor: function() {
		this.callParent();
		this.getProxy().setUrl(Df.data.Model.prototype.getController('Combo'));
	},

	applyModel: function (model) {
		if (model === 'Df.model.Lookup') {
			model = Ext.define('Df.model.' + (this.getStoreId() || Ext.id()) + 'Lookup', {
				extend: 'Df.model.Lookup'
			});
		}
		return this.callParent([model]);
	},

	updateAddAll: function () {
		this.getProxy().setExtraParam('addAll', this.getAddAll());
	},

	updateComboType: function () {
		this.getProxy().setExtraParam('comboType', this.getComboType());
	},

	applyData: function (data) {
		if (data) {
			var addAll = this.getAddAll();
			if (addAll) {
				data.splice(0, 0, { LookupId: 0, DisplayValue: typeof addAll === 'boolean' ? 'All' : addAll });
			}
		}
		return this.callParent(arguments);
	}
});