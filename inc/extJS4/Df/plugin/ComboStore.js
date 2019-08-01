/**
 * Plug-in to automatically specify the Lookup store for a given component
 */
Ext.define('Df.plugin.ComboStore', {
	extend: 'Ext.AbstractPlugin',
	alias: 'plugin.df-comboStore',
	init: function (component) {
		component.store = Ext.create('Df.data.Store', {
			model: 'Df.model.Lookup',
			proxy: {
				url: VuServer.Common.getUrl('Combo'),
				extraParams: { limit: 0, comboType: component.comboType, asArray: 0 }
			},
			autoLoad: component.autoLoad || true
		});
		if (component.addAll) {
			component.store.on('load', function (store, rec) {				
				store.insert(0, { LookupId: -1, DisplayValue: component.addAll });
			});
		}


	}
})