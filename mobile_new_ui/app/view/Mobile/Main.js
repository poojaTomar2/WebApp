Ext.define('CoolerIoTMobile.view.Mobile.Main', {
	extend: 'Ext.Container',
	xtype: 'mobile-main',
	config: {
		layout: 'fit',
		items: [{
			xtype: 'navigationview',
			layout: {
				type: 'card',
				animation: false
			},
			defaultBackButtonText: '',
			navigationBar: {
				backButton: {
					iconCls: 'arrow-left',
					//iconMask: true,
					ui: 'plain'
					//cls: 'backButton'
				},
				ui: 'cooler-flat',
				cls: 'navigation-bar-config',
				items: [{
					xtype: 'df-buttonplus',
					itemId: 'mainScreenButton',
					ui: 'plain',
					iconCls: 'menu-icon',
					align: 'right'
				}]
			},
			listeners: {
				activate: function (view) {
					view.down('main-navigation').setFilter(view.getActiveItem().xtype);
				},
				back: function (view) {
					view.down('#mainNavigationSlide').hide();
				},
				activeitemchange: function (view, value, oldvalue) {
					var navigation = view.down('main-navigation');
					if (navigation) {
						navigation.setFilter(value.xtype);
						if (value === 0)
							return;
						var icon = 'list';
						if (Df.App.isPhoneGap) {
							var navBar = view.getNavigationBar();
							var bottomToolbar = view.getComponent("debugDeviceBottomToolbar");
							// map icon
							//if (value.xtype == 'mobile-AlertList' || value.xtype == 'mobile-customer' || value.xtype == 'mobile-visit')
							//	value.down('#map').setHidden(false);
							//else
							//	value.down('#map').setHidden(true);
							var isDebugDeviceContainer = value.xtype === "debugDeviceContainer";
							var debugButton = navBar.down('#debugButton');
							debugButton.setHidden(isDebugDeviceContainer);
							bottomToolbar.setHidden(!isDebugDeviceContainer);
							navBar.down('#debugDeviceNavBtn').setHidden(!isDebugDeviceContainer);
						}
					}
				}
			},
			itemId: 'mainNavigationView',
			items: [{
				xtype: 'mainMenu'
			}, {
				xtype: 'container',
				top: 0,
				right: 0,
				modal: true,
				hideOnMaskTap: true,
				hidden: true,
				width: "12em",
				height: '100%',
				listeners: {
					hide: function (container) {
						this.down('main-navigation').deselectAll();
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
				itemId: 'mainNavigationSlide',
				items: [{
					xtype: 'main-navigation',
					itemId: 'mainNavigation'
				}]
			}, {
				xtype: 'toolbar',
				docked: 'bottom',
				itemId: 'debugDeviceBottomToolbar',
				hidden: true,
				layout: {
					pack: 'center',
					type: 'hbox'
				},
				defaults: {
					ui: 'plain'
				},
				items: [{
					icon: 'resources/icons/device-logs.png',
					itemId: 'deviceLogInfoBtn',
					width: '20%'
				}, {
					icon: 'resources/icons/device-scan.png',
					itemId: 'deviceScanBtn',
					width: '20%'
				}, {
					icon: 'resources/icons/no-wifi.png',
					itemId: 'connectionStateBtn',
					width: '20%'
				}, {
					icon: 'resources/icons/save-device-details.png',
					itemId: 'deviceDetailsSaveBtn',
					width: '20%',
					disabled: true
				}]
			}]
		}]
	}
});