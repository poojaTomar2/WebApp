Ext.define('CoolerIoTMobile.controller.Home', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			main: 'mobile-main',
			navigationbar: 'mobile-main titlebar',
			mainNavigationView: 'mobile-main #mainNavigationView',
			home: 'home',
			slideNavBtn: 'mobile-main button#homeSlideNavButton',			
			slideNavCustomer: 'mobile-main button#mobile-customerInfoSlideNavButton',
			debugButton: 'mobile-main button#debugButton',
			mainScreenButton: 'mobile-main button#mainScreenButton',
			debugDeviceContainer: 'debugDeviceContainer'
		},

		control: {
			slideNavBtn: {
				singletap: 'onTapNavigationButton'
			},
			mainScreenButton: {
				singletap: 'onTapNavigationButton'
			},
			debugButton: {
				singletap: 'onTapNavigationButton'
			},
			navigationbar: {
				back: 'onNavigationBack'
			}
		}
	},
	init: function () {
		//Until Touch has event domains, we have to manually set these event handlers
		Ext.Azure.on({
			scope: this,
			'pushregistrationsuccess': this.onPushRegistrationSuccess,
			'pushnotification': this.onPushNotification,
			'pushregistrationfailure': function (error) {
				Ext.Msg.alert('Error', 'Error registering the device for Push Notifications: ' + error);
			}
		});
	},
	onPushNotification: function (event) {
		switch (Ext.os.name) {
			case 'Android':
				if (event.message && event.message.length > 3) {
					CoolerIoTMobile.util.Utility.createPopoverNotification(event.message);
				}
				break;
			case 'iOS':
				if (event.alert && event.alert.length > 3) {
					CoolerIoTMobile.util.Utility.createPopoverNotification(event.alert);
				}
				break;
		}
	},
	onPushRegistrationSuccess: function (event) {
		//Ext.Msg.alert('Notification', 'Success');
		switch (Ext.os.name) {
			case 'Android':
				if (event.regid) {
					localStorage.setItem('regid', event.regid);
				}
				break;
			case 'iOS':
				if (event.deviceToken && event.deviceToken.length > 5) {
					localStorage.setItem('regid', event.deviceToken);
				}
				break;
		}
	},

	onBleButtonClick: function (button) {
		var debugDevicePanel = this.getDebugDeviceContainer();
		if (!debugDevicePanel) {
			debugDevicePanel = Ext.Viewport.add({ xtype: 'debugDeviceContainer' });
			button.setHidden(true);
		}

		this.getMainNavigationView().push(debugDevicePanel);
	},
	updateHomeData: function (data) {
		var navView = this.getMainNavigationView(), msgBtn = navView.down('#message'), alrtBtn = navView.down('#alert');
		if (msgBtn) {
			msgBtn.setHtml(Ext.String.format(msgBtn.getHtml(), data.MessageCount));
		} if (alrtBtn) {
			alrtBtn.setHtml(Ext.String.format(alrtBtn.getHtml(), data.AlertCount));
		}
	},
	onTapNavigationButton: function (button) {
		var container = '#mainNavigationSlide';
		var navView = this.getMainNavigationView();
		switch (button.getItemId()) {
			case "debugButton":
				this.onBleButtonClick(button);
				return;

		}

		var slideNav = this.getMain().query(container)[0];
		if (slideNav.isHidden()) {
			slideNav.show();
		} else {
			slideNav.hide();
		}
	},
	onNavigationBack: function () {
		history.back();
		return false;
	}
});
