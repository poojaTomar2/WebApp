Ext.define('CoolerIoTMobile.view.ChangePassword', {
	extend: 'Ext.form.Panel',
	xtype: 'changePassword',
	cls: 'asset-item-list-container',
	requires: [
        'Ext.form.FieldSet'
	],
	config: {
		cls: 'login',	
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			items: [{
				xtype: 'df-buttonplus',
				margin: 5,
				width: 80,
				itemId: 'okButton',
				text: 'OK',				
				cls: 'modus-button default'
			}, {
				xtype: 'df-buttonplus',
				margin: 5,
				width: 80,
				itemId: 'cancelButton',
				text: 'Cancel',				
				cls: 'modus-button default'
			}]

		}, {
			xtype: 'fieldset',
			items: [{
				xtype: 'passwordfield',
				name: 'OldPassword',
				placeHolder: 'Old Password'
			}, {
				xtype: 'passwordfield',
				name: 'NewPassword',
				placeHolder: 'New Password'

			}, {
				xtype: 'passwordfield',
				name: 'NewPasswordConfirm',
				placeHolder: 'Confirm New Password'

			}]
		}]
	}
});