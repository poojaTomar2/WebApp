Ext.define('CoolerIoTMobile.controller.Settings', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			settingsContainer: 'mobile-settings-container'
		},

		control: {
			'mobile-settings-container #cancelButton': {
				tap: 'onSettingsCancel'
			},
			'mobile-settings-container #applyButton': {
				tap: 'onApply'
			},
			'mobile-settings-container': {
				show: 'onSettingsShow'
			}
		}
	},
	onSettingsCancel: function () {
		var settingsWin = this.getSettingsContainer();
		settingsWin.hide();
		settingsWin.destroy();
	},

	onApply: function (button) {
		Ext.Msg.confirm('Apply Settings', 'Are you sure you want to apply these Settings ?', function (id, value) {
			if (id === 'yes') {
				var items = button.up().up();
				var values = items.getValues();
				ServerSettings.url = values.serverType;
				localStorage.setItem("SettingsData", JSON.stringify(values));
				Ext.StoreManager.each(function (store) {
					var storeProxy = store.getProxy(),
						url = storeProxy.config.url;
					if (url) {
						var splitData = url.split('.ashx')[0].split('/'),
						controller = splitData[splitData.length - 1];
						storeProxy.setUrl(Df.App.getController(controller, true));
					}
				});
				this.onSettingsCancel();
			}
		}, this);	
	},
	onSettingsShow: function (view) {
		history.pushState("data", "settings", "");
		var settingsData = JSON.parse(localStorage.SettingsData);
		view.setValues(settingsData);
	}
});