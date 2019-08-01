/*global Ext:false, DA: true, document: false */
Ext.BLANK_IMAGE_URL = (function () {
	var baseUrl = "inc/ExtJS";
	if (Ext.version >= "3") {
		baseUrl += Ext.version.substr(0, 1);
	}
	return baseUrl + '/resources/images/default/s.gif';
}());

Ext.ns("DA.ForgotPassword");
Ext.ns("DA.specialFn");

Ext.ux.EnterHandler = function (cfg) {
	Ext.apply(this, cfg);
};

Ext.ux.EnterHandler.prototype = {
	init: function (component) {
		component.on('render', this.setKeymap, this);
	},

	setKeymap: function (cmp) {
		var map = new Ext.KeyMap(
			cmp.el,
			[
				{
					key: [10, Ext.EventObject.ENTER],
					scope: this.scope,
					fn: this.fn
				}
			],
			"keydown"
		);
	}
};

DA.Login = {
	setDefaultFocus: function () {
		this.username.focus(true, true);
	},

	timeZoneMapping: {
		AST: 'Atlantic Standard Time',
		ADT: 'Atlantic Daylight Time',
		EDT: 'Eastern Daylight Time',
		EST: 'Eastern Standard Time',
		CST: 'Central Standard Time',
		CDT: 'Central Daylight Time',
		MST: 'Mountain Standard Time',
		MDT: 'Mountain Daylight Time',
		PST: 'Pacific Standard Time',
		PDT: 'Pacific Daylight Time'
	},

	getTimeZone: function () {
		var d = new Date().toString();
		var i = d.indexOf("(");
		var timeZone;
		if (i > -1) {
			timeZone = d.substr(i + 1, d.length - i - 2);
		} else {
			// IE
			var parts = d.split(' ');
			timeZone = this.timeZoneMapping[parts[parts.length - 2]];
		}
		return timeZone;
	},

	createForm: function () {
		var username = new Ext.form.TextField({
			fieldLabel: 'Username',
			name: 'Username',
			allowBlank: false
		});

		this.username = username;

		var password = new Ext.form.TextField({
			fieldLabel: 'Password',
			name: 'Password',
			inputType: 'password',
			allowBlank: false
		});

		var rememberMe = new Ext.form.Checkbox({
			boxLabel: 'Keep me logged in',
			hideLabel: true,
			name: 'RememberMe'
		});

		var htmlContent = "<br /><div style='float:left;'><a href='javascript:DA.ForgotPassword.Show()' tabIndex='-1'>Forgot Password</a></div>";

		var loc = document.location.href;

		if (loc.indexOf('checksystemhealth', 0) > -1) {
			htmlContent += "<div style='float:right;'><a href='javascript:DA.SystemStatus.Show()' tabIndex='-2' title='System Information'><img src='images/info.gif' alt='System Information' style='border-collapse:collapse; border:none;' /></a></div><div style='clear:both;'></div>";
		}

		// create form panel
		var formPanel = {
			labelWidth: 50,
			bodyStyle: "padding:15px;",
			onSubmit: Ext.emptyFn,
			xtype: 'form',
			submit: function () {
				this.getForm().getEl().dom.submit();
			},
			items: [
				username,
				password,
				rememberMe,
				{ xtype: 'hidden', name: 'timezone', value: this.getTimeZone() },
				new Ext.BoxComponent({ autoEl: { tag: 'div', cn: htmlContent } })
			],
			buttons: [
				{
					id: 'LoginButton',
					text: 'Login',
					handler: function () {
						if (formPanel.form.isValid()) {
							formPanel.submit();
						} else {
							Ext.MessageBox.alert('Errors', 'Please enter username and password', this.setDefaultFocus, this);
						}
					},
					scope: this
				}
			],
			plugins: [new Ext.ux.EnterHandler({ fn: this.onEnter, scope: this })]
		};

		var container = Ext.get('loginFormContainer');
		if (container) {
			formPanel.title = 'Login';
			formPanel = new Ext.form.FormPanel(formPanel);
			formPanel.render(container);
		} else {
			formPanel = new Ext.form.FormPanel(formPanel);
			// define window
			var window = new Ext.Window({
				title: 'Login',
				width: 250,
				height: 210,
				layout: 'fit',
				closable: false,
				plain: true,
				resizable: false,
				closeAction: 'hide',
				items: formPanel
			});

			this.window = window;
		}

		this.formPanel = formPanel;

	},

	onEnter: function () {
		var form = this.formPanel.getForm();
		if (form.isValid()) {
			form.getEl().dom.submit();
		} else {
			Ext.Msg.alert('Error', 'Please enter both username and password', this.setDefaultFocus, this);
		}
	},

	show: function () {
		this.createForm();
		if (this.window) {
			this.window.show();
		}

		if (DA.errorMessage) {
			if (DA.loginResultCode == 2) {
				if (DA.otherSessionCount > 0) {
					Ext.Msg.show({
						buttons: Ext.Msg.YESNO,
						title: 'Logout',
						msg: 'You are already logged in at another instance. Do you want to log out so you can log back in?',
						animEl: 'elId',
						icon: Ext.MessageBox.QUESTION,
						scope: this,
						fn: function (btn) {
							if (btn === 'yes') {
								Ext.Ajax.request({
									url: 'Controllers/LoginCount.ashx',
									params: { action: 'Logout', Username: DA.userName },
									callback: function (o, success, response) {
										if (!success) {
											Ext.MessageBox.alert('Error', 'Logout failed');
										} else {
											var form = this.formPanel.getForm();
											form.setValues({ Username: DA.userName, Password: DA.password });
											this.formPanel.submit();
										}
									},
									scope: this
								});
							}
						}
					});
				} else {
					Ext.Msg.alert('Error', 'No more user licenses are available to login.', this.setDefaultFocus, this);
				}
			} else {
				Ext.Msg.alert('Info', DA.errorMessage, this.setDefaultFocus, this);
			}

		} else if (DA.TimedOut) {
			Ext.Msg.alert('Info', 'Due to inactivity, your session has timed out. Please login again.', this.setDefaultFocus, this);
		} else {
			this.setDefaultFocus();
		}
	}
};



Ext.onReady(function () {
	DA.Login.show();
});

DA.ForgotPassword = {
	createForm: function () {
		var username = new Ext.form.TextField({
			fieldLabel: 'Username',
			name: 'Username'
		});
		this.username = username;
		var email = new Ext.form.TextField({
			fieldLabel: 'E-mail',
			name: 'Email',
			vtype: 'email'
		});

		// create form panel
		var formPanel = new Ext.form.FormPanel({
			labelWidth: 75,
			bodyStyle: "padding:5px;",
			url: 'Controllers/LoginController.ashx',
			items: [
			{ html: 'Please enter <b>either</b> username or email<br />&nbsp;', border: false },
			username,
			email
			]
		});

		// define window
		var window = new Ext.Window({
			title: 'Forgot password',
			width: 300,
			height: 150,
			layout: 'fit',
			modal: true,
			plain: true,
			closeAction: 'hide',
			resizable: false,
			items: formPanel,
			buttons: [
				{
					text: 'Ok',
					handler: function () {
						// check form value 
						if (formPanel.form.isValid()) {
							if (username.getValue().length === 0 && email.getValue().length === 0) {
								Ext.Msg.alert('Missing data', 'You must enter username or email');
								return;
							}
							formPanel.form.submit({
								params: { action: 'recoverpassword' },
								waitMsg: 'Checking...',
								failure: function (form, action) {
									if (action.result) {
										Ext.MessageBox.alert('Error', action.result.info);
									}
									else {
										Ext.MessageBox.alert('Error', 'Un-expected error');
									}
								},
								success: function (form, action) {
									window.hide();
									Ext.Msg.alert('Password recovery', action.result.info);
								}
							});
						} else {
							Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
						}
					}
				}, {
					text: 'Cancel',
					handler: function () { window.hide(); }
				}
			]
		});

		this.formPanel = formPanel;
		this.win = window;
	},

	Show: function () {
		if (!this.win) {
			this.createForm();
		}
		this.win.show();
		this.username.focus(true, true);
	}
};