/**
 * DcplFramework specific data model. It adds the capability to automatically pick the Proxy details based on the ServerController property or class name
 */
Ext.define('Df.data.Model', {
	extend: 'Ext.data.Model',

	proxy: 'rest',

	/**
	 * @property {String} serverController
	 * Name of the server controller from which to build the proxy url.
	 */
	serverController: null,

	inheritableStatics: {
		/**
		 * Returns the default server controller based on class name
		 */
		getDefaultServerController: function (url) {
			if (!url) {
				var className = this.$className;
				var parts = className.split(".");
				url = parts[parts.length - 1];
			}
			return url;
		},


		/**
		 * Returns the server controller name
		 */
		getServerController: function () {
			if (!this.serverController) {
				this.serverController = this.getDefaultServerController();
			}
			return this.serverController;
		},

		/**
		 * Overrides the proxy functionality to assign serverController based proxy if none defined
		 */
		setProxy: function (proxy) {
			if (!(proxy instanceof Ext.data.proxy.Proxy)) {
				if (typeof proxy === 'string') {
					proxy = { type: proxy };
				} else {
					proxy = proxy || {};
				}
				Ext.applyIf(proxy, {
					type: 'rest',
					url: 'Controllers/' + this.getServerController() + ".ashx",
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
			return Ext.data.Model.prototype.setProxy.call(this, proxy);
		}
	},

	// override to handle dependencies
	set: function (fieldName, value) {

		var wasEditing = this.editing;
		if (!wasEditing) {
			this.beginEdit();
		}

		this.callParent(arguments);

		var fields = this.fields;
		var data = this.getData();
		for (var i = 0, len = fields.getCount() ; i < len; i++) {
			var field = fields.getAt(i);
			if (field.dependencies && field.dependencies.indexOf(fieldName) > -1) {
				this.set(field.name, field.convert(null, this));
			}
		}
		if (!wasEditing) {
			this.endEdit();
		}
	}
});