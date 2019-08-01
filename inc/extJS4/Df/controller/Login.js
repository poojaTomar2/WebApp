Ext.define('Df.controller.Login', {
	extend: 'Ext.app.Controller',

	loggingInMsg: 'Loggin in...',
	windowTitle: 'Login',
	loginFormValidationErrorMsg: 'Please enter both username and password',
	loginFailedMsg: 'Login failed!',
	loggingOutMsg: 'Logging out...',
	
	init: function () {
		this.control({
			'loginwindow': {
				render: this.onPanelRendered
			},
			'loginwindow button#login': {
				click: this.login
			},
			'loginwindow textfield': {
				specialkey: this.keyenter
			},
			'#logout': {
				click: this.logout
			}
		});
	},

	refs: [
		{
			ref: 'loginForm',
			selector: 'loginwindow #loginForm'
		},
		{
			ref: 'loginwindow',
			selector: 'loginwindow'
		},
		{
			ref: 'loginBtn',
			selector: 'loginwindow button[action=login]'
		},
		{
			ref: 'userNameField',
			selector: 'loginwindow textfield[name=userName]'
		}
	],

	/**
	 * Focuses the cursor on the first field
	 * @param {App.view.Login} panel Login panel
	 */
	onPanelRendered: function (panel) {
		this.getUserNameField().focus(false, 500);
	},

	/**
	 * Validates the login form and does the form submit
	 * @param {Ext.button.Button} button Login button
	 */
	login: function (button) {
		var form = this.getLoginForm();
		if (!form.isValid()) {
			Ext.Msg.alert(this.windowTitle, this.loginFormValidationErrorMsg);
			return;
		}
		form.submit({
			waitMsg: this.loggingInMsg,
			success: this.onLoginSuccess,
			failure: this.onLoginFailure,
			scope: this
		});
	},

	/**
	 * After login call is successful, process the login result
	 * @param {Ext.form.Basic} form Basic form
	 * @param {Ext.form.action.Submit} action Action
	 */
	onLoginSuccess: function (form, action) {
		this.processLoginResult(action.result);
	},

	/**
	 * After login call fails, show error message
	 * @param {Ext.form.Basic} form Basic form
	 * @param {Ext.form.action.Submit} action Action
	 */
	onLoginFailure: function (form, action) {
		this.processLoginResult({ success: false });
	},

	/**
	 * Processes the login Json to see if logic was successful. If yes, shows the main viewport otherwise displays the Login screen
	 * @param {Object} json Json from login Ajax call
	 */
	processLoginResult: function (json) {
		var window = this.getLoginwindow();
		if (!json.success) {
			// coming from login screen
			if (window) {
				Ext.Msg.alert(this.windowTitle, this.loginFailedMsg);
				return;
			} else {
				var loginWindow = Df.App.createView('Login');
				loginWindow.show();
				return;
			}
		}

		if (window) {
			window.close();
			Ext.destroy(window);
		}
		Df.App.processLoginResult(json);
	},

	keyenter: function (field, event) {
		if (event.keyCode === 13) {
			var btn = this.getLoginBtn();
			this.login(btn);
		}
	},

	logout: function (button) {
		var viewport = Df.App.getViewport();

		viewport.mask(this.loggingOutMsg);
		Ext.Ajax.request({
			url: Df.App.getUrl('Login'),
			params: {
				signout: true,
			},
			scope: this,
			callback: this.onLogoutComplete
		});
	},

	/**
	 * Processes the login Json to see if logic was successful. If yes, shows the main viewport otherwise displays the Login screen
	 * @param {Object} json Json from login Ajax call
	 */
	onLogoutComplete: function () {
		var viewport = Df.App.getViewport();
		viewport.unmask();
		Ext.destroy(viewport);
		var login = Df.App.createView('Login');
		login.show();
	}
});