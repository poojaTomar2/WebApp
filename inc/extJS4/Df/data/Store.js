/**
 * DcplFramework specific store. It adds the capability to automatically pick the Proxy details based on the ServerController property or class name of the model
 */
Ext.define('Df.data.Store', {
	extend: 'Ext.data.Store',
	alias: 'store.Df',
	remoteSort: true,
	setProxy: function (proxy) {
		if (!(proxy instanceof Ext.data.proxy.Proxy)) {
			if (typeof proxy === 'string') {
				proxy = { type: proxy };
			} else {
				proxy = proxy || {};
			}
			Ext.applyIf(proxy, {
				type: 'rest',
				url: 'Controllers/' + this.model.getServerController() + ".ashx",
				reader: {
					type: 'json',
					root: 'records',
					totalProperty: 'recordCount'
				},
				writer: {
					allowSingle: false
				}
			});
		};
		return Ext.data.Store.prototype.setProxy.call(this, proxy);
	}
});