Ext.define('Df.data.AutoLoader', {
	mixins: [
		'Ext.util.Observable'
	],

	config: {
		comboStores: null,
		json: null,
		loginWindow: null
	},
	constructor: function (config) {
		this.initConfig(config);
	},
	start: function () {
		var storesToLoad = new Ext.util.HashMap();
		this.storesToLoad = storesToLoad;
		var comboStores = this.getComboStores();
		for (i = 0, len = comboStores.length; i < len; i++) {
			var comboType = comboStores[i], comboConfig = {};
			Ext.apply(comboConfig, {
				storeId: comboType + "Combo",
				model: 'Df.model.Lookup',
				proxy: {
					url: VuServer.Common.getUrl('Combo'),
					extraParams: { limit: 0, comboType: comboType, asArray: 0 }
				},
				autoLoad: true
			});

			var store = Ext.getStore(comboConfig.storeId);
			if (!store) {
				store = Ext.create('Df.data.Store', comboConfig);
			}
			storesToLoad.add(store.storeId, store);
			store.on('load', this.onStoreAutoLoad, this, { single: true });
			store.load();
		}
	},

	getTotalStores: function () {
		return this.storeCount;
	},

	getStoresRemaining: function () {
		return this.storesToLoad.getCount();
	},

	onStoreAutoLoad: function (store, records, operation, success, opt) {
		var storesToLoad = this.storesToLoad;
		storesToLoad.removeAtKey(store.storeId);
		if (storesToLoad.getCount() === 0) {
			var loginWindow = this.getLoginWindow();
			loginWindow.fireEvent('loadCompleted', { json: this.getJson(), loginWindow: loginWindow });
		}
	}
});
