Ext.define('CoolerIoTMobile.controller.ForgotPassword', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			'mainNavigationView': 'mobile-main #mainNavigationView',
			'forgotPassword': 'forgotPassword',
			'changePassword': 'changePassword'
		},
		control: {
			'forgotPassword': {
				show: 'onForgotPasswordShow'
			},
			'forgotPassword button#okButton': {
				singletap: 'forgotPassword'
			},
			'forgotPassword button#cancelButton': {
				singletap: 'onCancel'
			},
			'changePassword  #okButton': {
				singletap: 'changePassword'
			},
			'changePassword  #cancelButton': {
				singletap: 'onChangePasswordCancel'
			}
		}
	},
	onForgotPasswordShow: function () {
		history.pushState("data", "forgotPassword", "");
	},
	onCancel: function () {
		this.getForgotPassword().destroy();
	},
	onChangePasswordCancel: function () {
		this.getChangePassword().destroy();
	},
	forgotPassword: function () {
		var formPanel = this.getForgotPassword();
		var formValues = formPanel.getValues();
		if (!formValues.userName && !formValues.email) {
			Ext.Msg.alert('Validation', 'You must specify username or email');
			return;
		} else if (formValues.userName.length > 0 && formValues.email.length > 0) {
			Ext.Msg.alert('Validation', 'You must specify any of username or email, not both');
			return;
		}
		else {
			formPanel.submit({
				params: {
					action: 'recoverpassword',
					isMobile: true
				},
				url: Df.App.getController('LoginController', false, true),
				waitMsg: 'Loading...',
				success: this.onSuccess,
				failure: this.onFailure,
				scope: this
			});
			return;
		}
	},
	changePassword: function () {
		var formPanel = this.getChangePassword()
		var formValues = formPanel.getValues();
		if (formValues.OldPassword.length === 0 || formValues.NewPassword === 0 || formValues.NewPasswordConfirm === 0) {
			Ext.Msg.alert('Validation', 'Please fill all fields');
			return;
		}
		else if (formValues.NewPassword != formValues.NewPasswordConfirm) {
			Ext.Msg.alert('Validation', 'New Password and Confirm password doesn\'t match');
			return;
		}
		else {
			var viewport = Ext.Viewport;
			formPanel.submit({
				url: Df.App.getController('LoginController', false, true),
				waitMsg: 'Saving...',
				params: {
					action: 'changepassword'
				},
				success: this.onSuccess,
				failure: this.onFailure,
				scope: this
			});
		}

	},
	onSuccess: function (response, data) {
		Ext.Viewport.setMasked(false);
		Ext.Msg.alert('Successful', data.info);
		if (this.getChangePassword()) {
			this.getChangePassword().destroy();
		}
	},
	onFailure: function (response, data) {
		Ext.Viewport.setMasked(false);
		Ext.Msg.alert('Failed', data.info);
	}
});