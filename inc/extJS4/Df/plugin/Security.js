/**
 * Plug-in to hide/disable the component based on security permissions for logged in user
 */
Ext.define('Df.plugin.Security', {
	extend: 'Ext.AbstractPlugin',

	alias: 'plugin.df-security',

	config: {
		modules: null,
		hideOnNoPermission: true
	},

	init: function (component) {
		if (!this.hasPermission()) {
			if (this.getHideOnNoPermission()) {
				component.setVisible(false);
				component.show = Ext.emptyFn;
			} else {
				component.setDisabled(true);
				component.enable = Ext.emptyFn;
			}
		}
	},

	hasPermission: function () {
		var modules = this.getModules();
		if (typeof modules === 'string') {
			modules = [modules];
		}
		var hasPermission = true;
		for (var i = 0, len = modules.length; i < len; i++) {
			if (!Df.App.hasPermission(modules[i])) {
				hasPermission = false;
				break;
			}
		}
		return hasPermission;
	},

	destroy: function () {
		//this.component = null;
	}
})