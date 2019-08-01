/**
* @class Df.plugin.ComboStore
* @extends Ext.AbstractPlugin
* Plug-in to automatically specify the Lookup store for a given component
*/
Ext.define('Df.plugins.ComboStore', {
	extend: 'Ext.Component',
	alias: 'plugin.df-comboStore',
	init: function (component) {
		var comboType = component.comboType || component.config.comboType;
		if (!comboType && typeof component.getComboType === 'function') {
			comboType = component.getComboType();
		}
		var addAll = component.addAll;
		if (addAll === undefined) {
			addAll = component.config.addAll;
		}
		if (addAll === undefined && typeof component.getAddAll === 'function') {
			addAll = component.getAddAll();
		}
		var comboConfig = { comboType: comboType };
		Ext.applyIf(comboConfig, { storeId: component.storeId || component.config.storeId || (comboType + "Combo"), addAll: addAll });
		if (component.sorters)
			Ext.apply(comboConfig, { sorters: component.sorters });

		var store = Ext.getStore(comboConfig.storeId);
		if (!store) {
			store = Ext.factory(comboConfig, 'Df.store.Lookups');
			var extraParams = component.extraParams || component.config.extraParams;
			if (extraParams)
				Ext.apply(store.getProxy().getExtraParams(), extraParams);

			var autoLoad = component.autoLoad || component.config.autoLoad;
			if (autoLoad == undefined || autoLoad == true) {
				store.load();
			}
		}
		component.setStore(store);
	}
})