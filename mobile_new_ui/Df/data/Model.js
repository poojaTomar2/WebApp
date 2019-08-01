Ext.define('Df.data.Model', {
	extend: 'Ext.data.Model',
	requires: [
		'Df.data.writer.SinglePost'
	],

	//baseUrl: document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 ? ServerSettings.url : "..",

	controllerFormat: "/Controllers/{0}.ashx",

	getController: function (controllerName) {
	var baseUrl = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 ? ServerSettings.url : ".."
		return baseUrl + Ext.String.format(this.controllerFormat, controllerName);
	},

	config: {
		idProperty: 'Id',
		idFieldName: null,
		serverController: null
	},

	applyIdFieldName: function (fieldName) {
		if (!fieldName) {
			var className = this.self.getName();
			var parts = className.split(".");
			fieldName = parts[parts.length - 1] + "Id";
		}
		return fieldName;
	},

	applyServerController: function (url) {
		if (!url) {
			var className = this.self.getName();
			var parts = className.split(".");
			url = parts[parts.length - 1];
		}
		return url;
	},

	applyProxy: function (proxy, currentProxy) {
		if (!proxy) {
			proxy = {};
		}
		Ext.applyIf(proxy, {
			type: 'ajax',
			url: this.getController(this.getServerController()),
			extraParams: {},
			reader: {},
			writer: {}
		});
		Ext.applyIf(proxy.reader, {
			rootProperty: 'data'
		});
		Ext.applyIf(proxy.writer, {
			type: 'df-singlepost'
		});
		return this.callParent([proxy, currentProxy]);
	},

	applyFields: function (fields) {
		if (fields) {
			var idFieldName = this.getIdFieldName();
			fields.unshift({
				name: 'Id',
				convert: function (value, record) {
					return value || record.raw[record.getIdFieldName()];
				}
			});
		}
		return this.callParent([fields]);
	}
});