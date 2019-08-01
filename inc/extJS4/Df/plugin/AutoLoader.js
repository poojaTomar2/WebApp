Ext.define('Df.plugin.AutoLoader', {

	extend: 'Ext.AbstractPlugin',

	alias: 'plugin.autoloader',

	loadOnRender: true,

	loadOnActivate: false,

	recursive: false,

	proxy: null,

	/**
	 * Only need to set this to false if you want to setup Proxy only and do not want to load the store itself
	 **/
	autoLoad: true,

	applyMask: true,

	init: function (component) {
		this.component = component;
		if (this.loadOnRender) {
			component.on('render', this.loadStores, this);
		}
		if (this.loadOnActivate) {
			component.on('activate', this.loadStores, this);
		}
	},

	onDestroy: function () {
		this.component = null;
	},

	loadStores: function (component) {

		var proxy = this.proxy;
		if (typeof proxy === 'object' && proxy != null && component.store) {
			component.store.setProxy(proxy);
			delete this.proxy;
		}

		if (!this.autoLoad) {
			return;
		}
		// we cannot apply mask to DataView itself
		var applyMask = this.applyMask && component.isXType('panel');
		if (applyMask) {
			component.getEl().mask('Loading...');
		}

		this.storeCount = 0;
		var storesLoaded = [];
		this.loadStore(component, storesLoaded);
		if (this.recursive) {
			component.cascade(function (component) {
				this.loadStore(component, storesLoaded);
			}, this);
		}
	},

	loadStore: function (component, storesLoaded) {
		var store = component.store;
		if (store && storesLoaded.indexOf(store) === -1 && store.proxy && store.proxy.url) {
			this.storeCount = this.storeCount + 1;
			storesLoaded.push(store);
			var loadOptions;
			var applyMask = this.applyMask && component.isXType('panel');
			if (applyMask) {
				loadOptions = {
					callback: this.onStoreLoad,
					scope: this
				};
			} else {
				loadOptions = {};
			}
			store.load(loadOptions);
		}
	},

	onStoreLoad: function () {
		this.storeCount = this.storeCount - 1;
		if (this.storeCount <= 0) {
			var component = this.component;
			if (component.rendered) {
				component.getEl().unmask();
			}
		}
	}
});