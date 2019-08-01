Ext.define('CoolerIoTMobile.controller.Login', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'mobile-main',
			login: 'login',
			bottomBar: 'login #bottomBar',
			version: 'login #version',
			userNameField: 'login #addUsername',
			passwordField: 'login #password',
			mainNavigationView: 'login #loginNavigationView',
			mainScreenButton: 'login button#loginScreenButton',
			'loginNavigationSlide': 'login #loginNavigationSlide',
			loginManu: 'login #login-Navigation',
			serviceBtn: 'login button#runAsService'
		},
		control: {
			'login button#loginButton': {
				tap: 'onLogin'
			},
			login: {
				activate: 'onFormActivate',
				show: 'onLoginShow'
			},
			userNameField: {
				keyup: 'onLoginFieldValueEnter',
				blur: 'onLoginFieldValueEnter'
			},
			passwordField: {
				keyup: 'onLoginFieldValueEnter',
				blur: 'onLoginFieldValueEnter'
			},
			mainScreenButton: {
				singletap: 'onTapNavigationButton'
			},
			'login #login-Navigation': {
				itemsingletap: 'onLoginMenuTap'
			},
			'login button#runAsService': {
				singletap: 'onServiceRunTap'
			}
		}
	},
	onServiceRunTap: function () {
		var btnText = "Stop Service";
		if (CoolerIoTMobile.UploadDataService.running) {
			CoolerIoTMobile.UploadDataService.stop();
			btnText = "Run Service";
		} else {
			CoolerIoTMobile.UploadDataService.run();
		}
		this.getServiceBtn().setText(btnText);

	},
	onLoginFieldValueEnter: function (field) {
		var currentCls = field.getCls();
		field.getValue() === '' ? field.setCls(currentCls[0].replace('blue', 'red')) : field.setCls(currentCls[0].replace('red', 'blue'));
	},
	onLoginShow: function () {
		this.onLoginFieldValueEnter(this.getUserNameField());
		this.onLoginFieldValueEnter(this.getPasswordField());
	},
	onFormActivate: function () {

		//** add exit button dynamic for andoid device
		var hidden = !Df.App.isPhoneGap || Ext.os.is.iOS;
		var loginMenu = this.getLoginManu();
		var items = [];
		if (!hidden) {

			items.push({
				title: CoolerIoTMobile.Localization.Exit,
				itemId: 'exit',
				ImgURL: './resources/icons/menu/logout.png'
			});
			loginMenu.setData(items);
		}

		Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Logging In' });
		Ext.Ajax.request({
			url: Df.App.getController('Login', false, true),
			params: {},
			success: function (response, opts) {
				Ext.Viewport.setMasked(false);
				var data = Ext.decode(response.responseText);
				this.setVersion(data.version);
				if (data.success === true && data.info != "Session has expired!") {
					this.onLoginCallSuccess(null, data);
				}
			},
			failure: function (response, opts) {
				Ext.Viewport.setMasked(false);
			},
			scope: this
		});
	},
	setVersion: function (version) {
		if (!Df.App.isPhoneGap) {
			this.getVersion().setHtml("v-" + version);
		} else {
			cordova.getAppVersion(function (version) {
				var navigationView = Ext.ComponentQuery.query('#version')[0];
				navigationView.setHtml("v-" + version);
			}, this);
		}
	},
	onLoginCallSuccess: function (options, data) {
		if (data.data === 0) {
			Ext.Msg.alert('Error', 'Incorrect login');
		} else if (data) {
			//To do load from Df
			//Applying security
			Df.SecurityInfo = {};
			this.getBottomBar().setHidden(true);
			Ext.apply(Df.SecurityInfo, data);
			Df.SecurityInfo.IsInRole = function (roleName) {
				for (var i = 0; i < Df.SecurityInfo.roles.length; i++) {
					if (Df.SecurityInfo.roles[i] == roleName) {
						return true;
					}
				}
				return false;
			}
			if (!Ext.os.is.Phone && Df.SecurityInfo.IsInRole('Supervisor')) {
				var win = Ext.Viewport.add(Ext.create('CoolerIoTMobile.view.Tablet.Dashboard'));
				win.show();
			} else {
				var win = Ext.Viewport.add(Ext.create('CoolerIoTMobile.view.Mobile.Main'));
				win.show();
			}
			var userId = Df.SecurityInfo.userId;
			if (localStorage.regid && userId) {
				CoolerIoTMobile.util.Utility.sendRegistrationRequest(localStorage.regid, userId);
			}
			var comboTypes = {
				comboStores: ['ToDoActionType', 'Day']
			};
			Df.App.applyAutoLoad(comboTypes);
		}
	},
	onExitClick: function () {
		navigator.app.exitApp();
	},
	loadHomeData: function () {
		Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Loading data..' });
		Ext.Ajax.request({
			url: Df.App.getController('HomeData'),
			params: { action: 'GetHomeData' },
			success: function (response, opts) {
				Ext.Viewport.setMasked(false);
				var data = Ext.decode(response.responseText);
				if (data.data) {

				}
			},
			failure: function (response, opts) {
				Ext.Viewport.setMasked(false);
			},
			scope: this
		});
	},
	onLoginCallBack: function (options, success, response) {
		var data;
		if (success) {
			data = Ext.decode(response);
			success = data.success === true;
		}
		if (success) {
			this.onLoginCallSuccess(null, data);
		} else {
			Ext.Msg.alert('Error', 'Incorrect login');
		}
	},
	onLoginApiCallBack: function (options, success, response) {
		if (options.status != 401) {
			var data = Ext.decode(options.responseText);
			if (success) {
				localStorage.authToken = data.authToken;
			}
			var win = Ext.Viewport.add(Ext.create('CoolerIoTMobile.view.Mobile.OrderMain'));
			win.show();
		} else {
			Ext.Msg.alert('Error', 'Incorrect login');
		}
	},
	onLogin: function () {
		var loginForm = this.getLogin();
		var formValues = this.getLogin().getValues();
		if (!formValues.userName || !formValues.password) {
			Ext.Msg.alert('Validation', 'You must specify both username and password');
			return;
		}
		var url = Df.App.getController('consumer/user/login');
		url = url.replace(".ashx", "");
		if (formValues.userName.charAt(0) == "#") {
			var userName = formValues.userName.substr(1);
			Ext.Ajax.request({
				url: url,
				waitMsg: 'Validating...',
				params: {
					email: userName,
					password: formValues.password
				},
				success: this.onLoginApiCallBack,
				failure: this.onLoginApiCallBack,
				scope: this
			});
		}
		else {
			loginForm.submit({
				url: Df.App.getController('Login', false, true),
				waitMsg: 'Validating...',
				params: {
					menu: 'false'
				},
				success: this.onLoginCallBack,
				failure: this.onLoginCallBack,
				scope: this
			});
		}
	},
	logout: function (button) {
		Ext.Msg.confirm('Confirmation', 'Are you sure you want to log out?', function (btn) {
			if (btn === 'yes') {
				this.doLogout();
			}
		}, this);
		return false;
	},
	onLogoutComplete: function () {
		var viewport = Ext.Viewport;
		viewport.unmask();
		Ext.Viewport.removeAll(true);
		var main = Ext.create('CoolerIoTMobile.view.Main');
		if (this.getBottomBar().isHidden()) {
			this.getBottomBar().setHidden(false);
		}
		Ext.Viewport.add(main);

	},
	doLogout: function () {
		var viewport = Ext.Viewport;
		viewport.setMasked({ xtype: 'loadmask', message: 'Logging out' });
		Ext.Ajax.request({
			url: Df.App.getController('Login', false, true),
			params: {
				signout: true
			},
			scope: this,
			callback: this.onLogoutComplete
		});
	},
	onTapNavigationButton: function (button) {
		var container = '#loginNavigationSlide';
		var navView = this.getMainNavigationView();
		var slideNav = this.getLogin().query(container)[0];
		if (slideNav.isHidden()) {
			slideNav.show();
		} else {
			slideNav.hide();
		}
	},
	onLoginMenuTap: function (list, index, target, record) {
		switch (record.get('itemId')) {
			case 'setting':
				this.onSetting();
				break;
			case 'forgotPassword':
				this.onForgotPassword();
				break;
			case 'exit':
				this.onExitClick();
				break;
			default:
				break;
		}
		this.getLoginNavigationSlide().hide();
	},
	onSetting: function () {
		CoolerIoTMobile.Util.showFormBeforeLogin(CoolerIoTMobile.view.Mobile.Settings);
	},
	onForgotPassword: function () {
		var forgotPasswordWin = Ext.Viewport.add(Ext.create('CoolerIoTMobile.view.ForgotPassword'));
		forgotPasswordWin.show();
	}
});
