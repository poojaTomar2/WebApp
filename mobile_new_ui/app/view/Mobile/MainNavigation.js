Ext.define('CoolerIoTMobile.view.Mobile.MainNavigation', {
	extend: 'Ext.List',
	xtype: 'main-navigation',
	config: {
		itemTpl: "<span class='menu-list-items'><img src='{ImgURL}'></img><div>{title}</div></span>",
		style: 'background-color: white;',
		data: [
			{
				itemId: 'addtoRoute',
				screens: ['mobile-customerInfo'],
				title: CoolerIoTMobile.Localization.AddToRoute,
				ImgURL: 'resources/icons/menu/addtoroute.png'
			}, {
				itemId: 'inStore',
				screens: ['mobile-customerInfo'],
				title: CoolerIoTMobile.Localization.InStore,
				ImgURL: 'resources/icons/menu/store.png'
			}, {
				itemId: 'phoneOrder',
				screens: ['mobile-customerInfo'],
				title: CoolerIoTMobile.Localization.PhoneOrder,
				ImgURL: 'resources/icons/menu/phone_order.png'
			}, {
				itemId: 'pictures',
				screens: [
					'mobile-coolerSummary'
				],
				ImgURL: 'resources/icons/menu/view_images.png',
				title: 'View pictures'
			}, {
				itemId: 'healthData',
				screens: [
					'mobile-coolerSummary'
				],
				ImgURL: 'resources/icons/asset/Health.png',
				title: 'View health data'
			}, {
				itemId: 'movement',
				screens: [
					'mobile-coolerSummary'
				],
				ImgURL: 'resources/icons/assetDetail/moment.png',
				title: 'View movement data'
			}, {
				itemId: 'doorData',
				screens: [
					'mobile-coolerSummary'
				],
				ImgURL: 'resources/icons/asset/Door.png',
				title: 'View door data'
			}, {
				itemId: 'power',
				screens: [
					'mobile-coolerSummary'
				],
				ImgURL: 'resources/icons/asset/on_off.png',
				title: 'View power consumption'
			}, {
				itemId: 'commands',
				screens: [
					'mobile-coolerSummary'
				],
				ImgURL: 'resources/icons/menu/command.png',
				title: 'Commands'
			}, {
				itemId: 'ping',
				screens: [
					'mobile-coolerSummary'
				],
				ImgURL: 'resources/icons/asset/last_data.png',
				title: 'Pings'
			}, {
				itemId: 'configuration',
				screens: [
					'mobile-coolerSummary'
				],
				ImgURL: 'resources/icons/menu/config.png',
				title: 'Configuration'
			}, {
				itemId: 'installDevice',
				ImgURL: './resources/icons/menu/new_device.png',
				title: ' Install Device'
			}, {
				itemId: 'provision',
				screens: [
					'mobile-coolerSummary'
				],
				ImgURL: './resources/icons/menu/new_device.png',
				title: 'Provision New Device'
			}, {
				title: CoolerIoTMobile.Localization.CustomerTitle,
				itemId: 'customer',
				ImgURL: './resources/icons/menu/customer_icon.png'
			}, {
				title: CoolerIoTMobile.Localization.AlertTitle,
				itemId: 'alert',
				ImgURL: './resources/icons/menu/alert_icon.png'
			}, {
				title: CoolerIoTMobile.Localization.AssetTitle,
				itemId: 'assets',
				ImgURL: './resources/icons/menu/assets.png'
			}, {
				title: CoolerIoTMobile.Localization.VisitTitle,
				itemId: 'visit',
				module: "Visit",
				ImgURL: './resources/icons/menu/visit_icon.png'
			}, {
				title: CoolerIoTMobile.Localization.ToDoListTitle,
				itemId: 'toDoList',
				module: "ToDo",
				ImgURL: './resources/icons/menu/to_do_icon.png'
			}, {
				title: CoolerIoTMobile.Localization.MessageTitle,
				itemId: 'message',
				module: "Messages",
				ImgURL: './resources/icons/menu/msg.png'
			}, {
				title: CoolerIoTMobile.Localization.ObjectiveTitle,
				itemId: 'objective',
				module: "Objectives",
				ImgURL: './resources/icons/menu/objectives_icon.png'
			}, {
				title: 'Change Password',
				itemId: 'changePasswordButon',
				ImgURL: './resources/icons/menu/change_password.png'
			}, {
				title: CoolerIoTMobile.Localization.Admin,
				itemId: 'admin',
				ImgURL: './resources/icons/menu/admin.png'
			}, {
				title: 'Visit History',
				itemId: 'visitHistory',
				screens: [
					'mobile-coolerSummary'
				],
				ImgURL: './resources/icons/menu/visit_icon.png'
			},{
			 	title: 'Document',
			 	itemId: 'mobile-attachment',
			 	screens: [
					'mobile-coolerSummary'
			 	],
			 	ImgURL: './resources/icons/menu/to_do_icon.png'
			},{
				title: 'Notes',
				itemId: 'notes',
				screens: [
					'mobile-coolerSummary'
				],
				ImgURL: './resources/icons/menu/to_do_icon.png'
			},{
				title: CoolerIoTMobile.Localization.LogoffTitle,
				itemId: 'logOffButton',
				ImgURL: './resources/icons/menu/logout.png'
			}
		]
	},
	setSecurity: function (modules) {
		var data = this.getData();
		var menuData = [], mainModule;
		for (var i = 0, len = data.length; i < len; i++) {
			var menuItem = data[i];
			mainModule = modules[menuItem.module];
			if (menuItem.module && mainModule) {
				if (mainModule.Module)
					menuData.push(menuItem);
			}
			if (!menuItem.module) {
				menuData.push(menuItem);
			}
		}
		this.getStore().removeAll();
		this.setData(menuData);
	},
	setFilter: function (activeScreen) {
		var store = this.getStore();
		this.activeScreen = activeScreen;
		this.listItems.forEach(function (item) {
			var showItem = false;
			var rec = item.getRecord();
			var validScreens = rec.get('screens');
			if (!validScreens) {
				showItem = true;
			}
			else {
				showItem = validScreens && validScreens.indexOf(this.activeScreen) > -1;
			}
			item.setHidden(!showItem);
		}, this);
	},

	getMenuItem: function (itemId) {
		this.itemId = itemId;
		return this.listItems.filter(function (i) {
			return i.getRecord().get('itemId') === this.itemId
		}, this)[0];
	}
});