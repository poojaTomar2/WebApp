Ext.define('CoolerIoTMobile.view.ForgotPassword', {
	extend: 'Ext.form.Panel',
	xtype: 'forgotPassword',
	requires: [
        'Ext.form.FieldSet'
	],
	config: {
        layout: {
            type: 'vbox',
            pack: 'center',
            align: 'center'
        },
        defaults: { width: '90%' },
        cls: 'home-background',
        url: '',
        items: [
            {
                docked: 'top',
                xtype: 'toolbar',             
                title: 'Forgot Password',
                width: '100%',
                ui: 'cooler-flat'              
            },
		    {
		        xtype: 'textfield',
		        name: 'userName',
		        itemId: 'userName',
		        placeHolder: 'Username',
		        cls: 'cooler-login-field'

		    },
		    {
		        xtype: 'container',
		        cls: 'login-forgot-password',
		        html: 'OR'
		    },
		    {
		        xtype: 'textfield',
		        name: 'email',
		        itemId: 'email',
		        placeHolder: 'Email address',
		        cls: 'cooler-login-field'

		    },
		    {
		        xtype: 'df-buttonplus',
		        margin: '1em 0 0 0',
		        itemId: 'okButton',
		        text: 'OK',
		        ui: 'cooler-action-btn',
		        labelCls: 'button-font'
		    },
		    {
		        xtype: 'df-buttonplus',
		        margin: 5,
		        itemId: 'cancelButton',
		        text: 'Cancel',
		        ui: 'cooler-action-btn',
		        labelCls: 'button-font'
		    }
        ]
    }
});