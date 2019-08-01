Ext.define('CoolerIoTMobile.view.Login', {
	extend: 'Ext.form.Panel',
	xtype: 'login',
	requires: [
        'Ext.field.Password'
	],
	config: {
		layout: 'fit',
		scrollable: false,
		url: '',
		items: [
			{
				xtype: 'navigationview',
				navigationBar: {
					ui: 'cooler-flat',
					cls: 'navigation-bar-config',
					items: [{
						xtype: 'df-buttonplus',
						itemId: 'loginScreenButton',
						ui: 'plain',
						iconCls: 'menu-icon',
						align: 'right'
					}]
				},
				itemId: 'loginNavigationView',
				items: [{
					xtype: 'container',
					layout: {
						type: 'vbox',
						pack: 'center',
						align: 'center'
					},
					cls: 'home-background',
					defaults: {
						width: '80%'
					},
					scrollable: false,
					items: [{
						xtype: 'img',
						src: 'resources/icons/insigma-Logo.png',
						height: '2.5em',
						width: '70%',
						margin: '0 0 2em 0 '
					}, {
						xtype: 'textfield',
						name: 'userName',
						itemId: 'addUsername',
						value: '',
						placeHolder: 'Username',
						cls: 'cooler-login-field login-field-red username'
					}, {
						xtype: 'passwordfield',
						name: 'password',
						itemId: 'password',
						value: '',
						placeHolder: 'Password',
						cls: 'cooler-login-field login-field-red password'
					},{
						xtype: 'button',
						text: 'SIGN IN',
						ui: 'cooler-action-btn',
						margin: '1em 0 0 0',
						itemId: 'loginButton',
						labelCls: 'button-font'
					},
					{
						xtype: 'df-buttonplus',
						margin: 5,
						itemId: 'runAsService',
						hidden: !Df.App.isPhoneGap,
						text: 'Run Service',
						cls: 'modus-button default'
					}
					]
				},
				 {
				 	xtype: 'container',
				 	top: 0,
				 	right: 0,
				 	hideOnMaskTap: true,
				 	hidden: true,
				 	width: "12em",
				 	height: '100%',
				 	listeners: {
				 		hide: function (container) {
				 			this.down('#login-Navigation').deselectAll();
				 		}
				 	},
				 	layout: {
				 		type: 'fit'
				 	},
				 	showAnimation: {
				 		type: "slide",
				 		direction: "left"
				 	},

				 	hideAnimation: {
				 		type: "slideOut",
				 		direction: "right"
				 	},
				 	itemId: 'loginNavigationSlide',
				 	items: [{
				 		xtype: 'list',
				 		itemId: 'login-Navigation',
				 		itemTpl: "<span class='menu-list-items'><img src='{ImgURL}'></img><div>{title}</div></span>",
				 		style: 'background-color: white;',
				 		data: [
							{
								title: CoolerIoTMobile.Localization.Settings,
								itemId: 'setting',
								ImgURL: './resources/icons/menu/config.png'
							}, {
								title: CoolerIoTMobile.Localization.ForgotPassword,
								itemId: 'forgotPassword',
								ImgURL: './resources/icons/menu/change_password.png'
							}]
				 	}]
				 },
				{
					docked: 'bottom',
					xtype: 'container',
					itemId: 'bottomBar',
					height: '8%',
					style: 'border-top: 1px solid red;',
					layout: {
						type: 'hbox',
						align: 'center'
					},
					items: [{
						xtype: 'button',
						html: 'Version',
						style: 'color:white',
						iconMask: true,
						ui: 'plain',
						itemId: 'version',
						height: '100%',
						docked: 'right',
						width: 130,
						labelCls: 'button-font button-font-color-black'
					}]
				},
				{
					xtype: 'dataview',
					docked: 'bottom',
					itemId: 'serviceLogDataView',
					hidden: !Df.App.isPhoneGap,
					itemTpl: '<div>{message}</div>',
					height: '22vh',
					store: {
						fields: ['message'],
						data: []
					}
				}
				]
			}
		]
	}
});