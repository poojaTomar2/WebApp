/**
 * Main DcplFramework object that should be made as required in application to include all necessary framework specific files
 */
Ext.define('Df.App', {
	singleton: true,
	requires: [
		'Df.data.Field',		
		'Df.data.Model',
		'Df.data.Store',
		'Df.data.AutoLoader',
		'Df.form.field.Lookup',
		'Df.store.Lookups',
		'Df.button.Button',
		'Df.button.LinkButton',
		'Df.grid.column.Combo',
		'Df.plugin.ComboLoader',
		'Df.plugin.AutoLoader',
		'Df.plugin.Security',
		'Df.plugin.ComboStore',
		'Df.plugin.EditableGrid'
	],
	config: {
		/**
		 * @cfg {Object} securityInfo Specifies the security information to be set for current session. Example: { modules: { User: { Add: true }  }, roles: ['Admin'] }
		 */
		securityInfo: null
	},

	loginMessage: 'Checking for Login',

	init: function(config) {
		Ext.apply(this, config);

		this.attachGlobalListeners();

		var app = this.app;

		this.login();
	},

	login: function(params) {
		Ext.get(document.body).mask(this.loginMessage);

		Ext.Ajax.request({
			url: this.getUrl('Login'),
			params: params,
			scope: this,
			callback: this.onInitalLoginSuccess
		});
	},

	onInitalLoginSuccess: function (options, success, response) {
		var result = {};
		Ext.get(document.body).unmask();
		if (success) {
			try {
				result = Ext.decode(response.responseText);
			} catch (ex) {
				result = {};
			}
		}
		this.getController('Login').processLoginResult(result);
	},

	processLoginResult: function(json) {
		this.setSecurityInfo({ role: json.roles, modules: json.modules });
		this.onLogin.call(this.scope || this);
	},

	loggedIn: false,

	getController: function(name) {
		return this.app.getController(name);
	},

	createView: function(name, config) {
		return Ext.create(this.app.name + '.view.' + name, config);
	},

	/**
	 * Keep alive duration in milliseconds
	 */
	keepAliveDuration: 5 * 60 * 1000,

	/**
	 * @private
	 */
	applySecurityInfo: function (value) {
		this.loggedIn = true;
		if (!this.keepAlive) {
			this.keepAlive = Ext.Function.createBuffered(this.invokeKeepAlive, this.keepAliveDuration);
		}
		this.keepAlive();
		return value || { modules: {}, roles: [] };
	},

	/**
	 * @private
	 */
	invokeKeepAlive: function () {
		if (!this.loggedIn) {
			return;
		}
		Ext.Ajax.request({
			url: this.getUrl('KeepAlive'),
			callback: function () {
				if (this.loggedIn) {
					this.keepAlive();
				}
			},
			scope: this
		});
	},

	/**
	 * Returns whether user has permission on a specific module
	 * @param {String} module Module name
	 * @param {String} permissionType Type of permission to check. Defaults to 'Module'
	 * @returns {Boolean} True if user has permission else false
	 */
	hasPermission: function (module, permissionType) {
		var securityInfo = this.getSecurityInfo();
		var modules = securityInfo.modules;
		if (modules[module] && modules[module][permissionType || 'Module'] === true) {
			return true;
		} else {
			return false;
		}
	},

	getUrl: function (controllerName) {
		return 'Controllers/' + controllerName + ".ashx";
	},

	getViewport: function() {
		return Ext.ComponentQuery.query("viewport")[0];
	},

	/**
	 * @private
	 */
	onRequestException: function (dataConn, response, options) {
		if (response.status === 401) {
			this.loggedIn = false;
			Ext.Msg.alert('Error', 'Your session has expired', this.redirectToLogin, this)
		} else {
			Ext.Msg.alert('Error', response.responseText);
		}
	},

	redirectToLogin: function () {
		this.app.getController('Login').onLogoutComplete();
	},


	attachGlobalListeners: function () {
		//Ext.util.Observable.observe(Ext.data.Connection);
		//Ext.data.Connection.on('requestexception', this.onRequestException);

		Ext.util.Observable.observe(Ext.Ajax);
		Ext.Ajax.on('requestexception', this.onRequestException, this);
	}
});