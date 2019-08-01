Ext.define('Df.App', {
	singleton: true,
	config: {
		autoLoad: null,
		securityInfo: null
	},
	isPhoneGap: document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1,
	requires: [
		'Df.field.Combo',
		'Df.plugins.ComboStore',
		'Df.ux.ButtonPlus',
		'Df.data.Connection',
		'Df.fusion.Chart',
		'Df.Map',
		'Df.fusion.Chart',
		'Df.data.Model',
        'Df.data.Store',
        'Df.data.writer.SinglePost',
		'Df.overrides.Store',
		'Df.overrides.NavigationView',
		'Df.overrides.GridColumnOverride'
	],
	constructor: function (config) {
		// todo: fix this
		this.applyDateFunction();
		this.initConfig(config);
	},

	parse$D: function (v) {
		return Ext.Date.parse(v, 'X');
	},

	applyDateFunction: function () {
		$D = this.parse$D;
		Ext.DateExtras.parseCodes.X = {
			g: 1,
			c: "y = parseInt(results[1], 10); m = parseInt(results[2], 10) - 1; d = parseInt(results[3], 10); h = parseInt(results[4], 10); i = parseInt(results[5], 10); s = parseInt(results[6], 10); ms = parseInt(results[7], 10);",
			s: "(\\d{4})(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{3})"
		};

		// Don't use browsers decode function, use eval (eval is evil)
		Ext.JSON.decode = function (s) { return eval("(" + s + ")"); }

		// Shortcut the function again
		Ext.decode = Ext.JSON.decode;
	},

	applySecurityInfo: function (value) {
		if (value.Modules) {
			value.modules = value.Modules;
		}
		if (value.Roles) {
			value.roles = value.Roles;
		}
		return value || { modules: {}, roles: [] };
	},
	hasPermission: function (module, permissionType) {
		var securityInfo = this.getSecurityInfo();
		var modules = securityInfo.modules;
		return modules[module] && modules[module][permissionType || 'Module'] === true;
	},

	getController: function (controllerName) {
		return Df.data.Model.prototype.getController(controllerName);
	},
	applyAutoLoad: function (value) {
		var comboStores = value.comboStores;
		for (i = 0, len = comboStores.length; i < len; i++) {
			var comboType = comboStores[i], comboConfig;
			if (typeof comboType === 'object') {
				comboConfig = comboStores[i];
				comboType = comboConfig.comboType;
			} else {
				comboConfig = { comboType: comboType };
			}
			Ext.applyIf(comboConfig, { storeId: comboType + "Combo" });

			var store = Ext.getStore(comboConfig.storeId);
			if (!store) {
				store = Ext.factory(comboConfig, 'Df.store.Lookups');
				if (!store.getComboType()) {
					store.setComboType(comboConfig.comboType);
					store.setStoreId(comboConfig.storeId);
					store.updateComboType();
				}
				store.load();
			}
			comboStores[i] = store;
		}
		return value;
	},

	getComboTypesToLoad: function () {
		var autoLoad = this.getAutoLoad();
		var comboStores = autoLoad.comboStores;
		var toLoad = [];
		for (i = 0, len = comboStores.length; i < len; i++) {
			toLoad.push({ type: comboStores[i].getComboType(), loaded: false });
		}
		return toLoad;
	},

	setComboData: function (data) {
		var autoLoad = this.getAutoLoad();
		var comboStores = autoLoad.comboStores;
		for (i = 0, len = comboStores.length; i < len; i++) {
			var store = comboStores[i];
			var comboType = store.getComboType();
			if (data[comboType]) {
				store.setData(data[comboType]);
			}
		}
	},

	loadComboData: function (options) {
		var data = options.data;
		if (!data) {
			var store = options.store;
			var reader = store.getProxy().getReader();
			data = reader.rawData;
		}
		if (data && data.combos) {
			var comboData = data.combos;
			for (var o in comboData) {
				var comboStore = Ext.getStore(o + 'Combo');
				if (comboStore) {
					comboStore.setData(comboData[o]);
				}
			}
		}
	},

	parseDates: function (data, dateFields) {
		for (var i = 0, len = dateFields.length; i < len; i++) {
			var dateField = dateFields[i];
			var value = data[dateField];
			data[dateField] = value ? Ext.Date.parse(value, 'X') : value;
		}
		return data;
	}
});
