Ext.define('CoolerIoTMobile.controller.Dashboard', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			'mainNavigationView': 'mobile-main #mainNavigationView',
			'coolerPanel': 'mobile-customerInfo #coolerPanel',
			'customerMap': 'mobile-customer #map',
			'alertListbase': 'alert-list-base',
			'customerList': 'mobile-customer',
			'coolerSummaryPanel': 'mobile-coolerSummary',
			'visitTabPanel': 'mobile-visit #visitTabPanel',
			'visitMap': 'mobile-visit #map',
			'assetPurityList': 'purityImageList',
			'doorData': 'doorDataList',
			'visitHistory': 'visitHistory',
			'smartDeviceHealthRecord': 'smartDeviceHealthRecord',
			'smartDeviceMovement': 'smartDeviceMovement',
			'powerConsumption': 'powerConsumptionList',
			'alertList': 'alert-list',
			'salesRepList': 'tablet-SalesRepIssueList',
			'alertAction': 'mobile-alertaction-win',
			'mainNavigationSlide': 'mobile-main #mainNavigationSlide',
			'mobileNote': 'mobile-Note',
			'attachment':'mobile-attachment',
			homeView: 'main',
			mainMenu: 'mainMenu',
			mainMenuItems: 'mainMenu button[ui=home-btn]',
			logOut: 'mobile-ordermain #logout',
			'attachmentWindow': 'mobile-attachment-window',
			'visitHistoryWindow': 'mobile-visit-history-window-win',
			'notesWindow': 'mobile-notes-win'
		},
		control: {
			'main-navigation': {
				itemsingletap: 'onMainMenuTap'
			},
			'mobile-main': {
				show: 'onMainActivate'
			},
			mainMenu:{
                show: 'onMainMenuShow'
			},
			mainMenuItems: {
			    tap: 'onMainMenuItemTap'
			},
			'mainNavigationView': {
				push: 'setMainMenuButton',
				pop: 'setMainMenuButton'
			},
			'customerMap': {
				tap: 'openMap'
			},
			'visitMap': {
				tap: 'openMap'
			},
			'mobile-actionPlan': {
				activate: 'onOpenActionPlan'
			},
			'mobile-actionPlan #openActionPlan': {
				activate: 'onOpenActionPlan'
			},
			'mobile-actionPlan #closeActionPlan': {
				activate: 'onCloseActionPlan'
			},
			'alert-list': {
				actiontap: 'onAlertListTap'
			},
			'mobile-Dashboard': {
				activate: 'onOpenAlertsList'
			},
			'mobile-Dashboard #openAlertsList': {
				activate: 'onOpenAlertsList'
			},
			'mobile-Dashboard #closeAlertsList': {
				activate: 'onClosedAlertsList'
			},
			'visitHistory': {
				itemsingletap: 'onVisitHistoryClick'
			},
			'visitHistory #addVisit': {
				tap: 'onVisitHistoryClick'
			},
			'mobile-Note': {
				itemsingletap: 'onAddNote'
			},
			'mobile-Note #add-note': {
				tap: 'onAddNote'
			},
			'mobile-attachment #addAttachment': {
				tap: 'onAttachmentListClick'
			},
			'logOut':{
				tap: 'onLogOut'
			}
		}
	},
	onMainMenuShow: function () {
	    //var navBar = this.getMainNavigationView().getNavigationBar();
	    //if (!Ext.isEmpty(navBar)) {
	    //    navBar.setTitle('Menu');           
	    //}	 
	},
	onMainMenuItemTap: function (record) {
	    this.onMainMenuTap('', '', '', record);
	},
	onMainMenuTap: function (list, index, target, record) {
		var coolerPanel = this.getCoolerSummaryPanel(), assetId, data, smartDeviceId;
		if (coolerPanel) {
			assetId = coolerPanel.getAssetId();
			data = coolerPanel.getData();
			smartDeviceId = data.SmartDeviceId ? data.SmartDeviceId : data.Id;
		}		
		switch (record.get('itemId')) {
			case 'customer':
				this.onCustomer();
				break;
			case 'visit':
				this.onVisit();
				break;
			case 'alert':
				this.onAlert();
				break;
			case 'assets':
				this.onAssets();
				break;
			case 'toDoList':
				this.onToDoTap();
				break;
			case 'message':
				this.onMessage();
				break;
			case 'objective':
				this.onOjective();
				break;
			case 'logOffButton':
				this.onLogOut();
				break;
			case "pictures":
				this.onViewPicture(assetId, this.isComingfromFilterScreen);
				break;
			case "healthData":
				this.loadView(smartDeviceId, 'SmartDeviceHealthRecord', 'smartDeviceHealthRecord');
				break;
			case "movement":
				this.loadView(smartDeviceId, 'SmartDeviceMovement', 'smartDeviceMovement');
				break;
			case "doorData":
				this.onViewDoorData(smartDeviceId, this.isComingfromFilterScreen);
				break;
			case "power":
				this.loadView(smartDeviceId, 'SmartDevicePowerConsumption', 'powerConsumptionList');
				break;
			case "commands":
				this.loadView(smartDeviceId, 'SmartDeviceCommand', 'commandList');
				break;
			case "ping":
				this.loadView(smartDeviceId, 'SmartDevicePing', 'pingList');
				break;
			case "configuration":
				this.loadConfiguration('SmartDeviceConfig', 'configList');
				break;
			case "provision":
				this.onViewProvisionNewDevice(assetId);
				break;
			case 'installDevice':
				this.onInstallDevice();
				break;
			case "changePasswordButon":
				CoolerIoTMobile.Util.showFormBeforeLogin('CoolerIoTMobile.view.ChangePassword');
				history.pushState("data", "changePassword", "");
				break;
			case 'admin':
				this.onAdmin();
				break;
			case 'visitHistory':
				this.onVisitHistory(assetId);
				break;
			case 'notes':
				this.onNotes(assetId);
				break;
			case 'mobile-attachment':
				this.onAttachment(assetId);
				break;
			default:
				break;
		}
		this.getMainNavigationSlide().hide();
	},
	onVisitHistoryClick: function (grid, index, target, record, e, eopts) {
		var grid = this.getVisitHistory(),
			assetId = grid.getAssetId();
		if (record.data) {
			assetId = record.data.AssetId;
		}
		var updateWindow = this.getVisitHistoryWindow();
		if (!updateWindow) {
			updateWindow = Ext.Viewport.add({
				xtype: 'mobile-visit-history-window-win',
				assetId: assetId,
				args: record,
				windowScope: this
			});
		} else {
			updateWindow.config.assetId = assetId;
		}
		if (record)
			updateWindow.setValues(record.data);

		updateWindow.show();

	},
	onAttachmentListClick: function (grid, index, target, record, e, eopts) {
		var grid = this.getAttachment();
		var	assetId = grid.getAssetId();
		if (record.data) {
			assetId = record.data.AssetId;
		}
		updateWindow = this.getAttachmentWindow();

		if (!updateWindow) {
			updateWindow = Ext.Viewport.add({
				xtype: 'mobile-attachment-window',
				assetId: assetId,
				args: record,
				windowScope: this
			});
		} else {
			updateWindow.config.assetId = assetId;
		}

		if (record)
			updateWindow.setValues(record.data);

		updateWindow.show();
	},
	onLogOut: function () {
		this.getApplication().getController('Login').logout();
	},
	setMainMenuButton: function (navView, view) {	  
		var navBar = navView.getNavigationBar();
		history.pushState("data", view.xtype, "");
		if (navView.getActiveItem().xtype === 'coolerMenuScreen') {
			navBar.down('#mainScreenButton').setHidden(true);
		} else {
			navBar.down('#mainScreenButton').setHidden(false);
		}
	},
	doSmartDeviceSearch: function () {
		var value = this.getSmartDeviceSearchField().getValue();
		var smartDeviceList = this.getSmartDeviceList();
		var store = smartDeviceList.getStore();
		smartDeviceList.setLoadingText("");
		store.getProxy().setExtraParam('SerialNumber', '%' + value);
		store.getProxy().setExtraParam('IncludeSummaryInList', 1);
		store.load();
	},
	onAssets: function () {
		this.show('mobile-assets', true);
	},
	loadConfiguration: function (storeId, view) {
		var coolerPanel = this.getCoolerSummaryPanel();
		var data = coolerPanel.getData();
		var attributes = Ext.decode(data.Attributes || "{}");
		var attr = [];
		for (var key in attributes) {
			attr.push({ Attribute: key, Value: attributes[key] });
		}
		var store = Ext.getStore(storeId);
		store.setData(attr);
		this.show(view);
	},
	loadView: function (smartDeviceId, storeId, view) {
		if (smartDeviceId) {
			var store = Ext.getStore(storeId);
			var storeProxy = store.getProxy();
			storeProxy.setExtraParams({ action: 'list', limit: 25, AsArray: 0, SmartDeviceId: smartDeviceId });
			store.removeAll();
			store.loadPage(1);
			this.show(view);
		}
	},
	onVisitHistory: function (assetId) {
		if (assetId) {
			var store = Ext.getStore('VisitHistory');
			var storeProxy = store.getProxy();
			storeProxy.setExtraParams({ action: 'list', limit: 25, AsArray: 0, assetId: assetId });
			var view = this.getMainNavigationView();
			var list = Ext.ComponentMgr.create({ xtype: 'visitHistory', assetId: assetId});
			view.push(list);
			list.renderColumnPercentage(list.element);
			list.getStore().load();
		}
	},
	onNotes: function (assetId) {
		if (assetId) {
			var store = Ext.getStore('Notes'),
				storeProxy = store.getProxy();
			storeProxy.setExtraParams({ action: 'list', limit: 25, AsArray: 0, AssociationType: 'Asset', AssociationId: assetId });
			var view = this.getMainNavigationView(),
			list = Ext.ComponentMgr.create({ xtype: 'mobile-Note', associationId: assetId });
			view.push(list);
			list.renderColumnPercentage(list.element);
			list.getStore().load();
		}
	},
	onAddNote: function (grid, index, target, record, e, eopts) {
		var grid = this.getMobileNote(),
			assetId = grid.getAssociationId();

		var updateWindow = this.getNotesWindow();
		if (!updateWindow) {
			updateWindow = Ext.Viewport.add({
				xtype: 'mobile-notes-win',
				associationId: assetId,
				args: record,
				windowScope: this
			});
		} else {
			updateWindow.config.assetId = assetId;
		}

		if (record)
			updateWindow.setValues(record.data);

		updateWindow.show();
	},
	onAttachment: function (assetId) {
		if (assetId) {
			var store = Ext.getStore('Attachment');
			var storeProxy = store.getProxy();
			storeProxy.setExtraParams({ action: 'list', limit: 25, AsArray: 0, AssociationId: assetId,AssociationType : 'Asset' });
			var view = this.getMainNavigationView();
			var list = Ext.ComponentMgr.create({ xtype: 'mobile-attachment', assetId: assetId });
			view.push(list);
			list.renderColumnPercentage(list.element);
			list.getStore().load();
		}
	},
	onViewDoorData: function (smartDeviceId, isComingfromFilterScreen) {
		if (smartDeviceId) {
			var store = Ext.getStore('DoorData');
			var storeProxy = store.getProxy();
			storeProxy.setExtraParams({ action: 'list', limit: 25, AsArray: 0, SmartDeviceId: smartDeviceId });
			store.removeAll();
			store.loadPage(1);
			this.show('doorDataList');
		}
	},
	onViewPicture: function (assetId, isComingfromFilterScreen) {
		if (assetId) {
			var store = Ext.getStore('AssetPurity');
			var storeProxy = store.getProxy();
			storeProxy.setExtraParams({ action: 'list', limit: 25, AsArray: 0, sort: 'AssetPurityId', dir: 'DESC', assetId: assetId });
			store.removeAll();
			store.loadPage(1);

			var assetPurityList = this.getAssetPurityList();
			if (!assetPurityList) {
				assetPurityList = Ext.Viewport.add({ xtype: 'purityImageList' });
			}
			this.show('purityImageList');
		}
	},
	loadAssetDetail: function (id, controller, record) {
		Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'loading detail..' });
		Ext.Ajax.request({
			url: Df.App.getController(controller),
			params: {
				action: 'load',
				Id: id,
				IncludeSummaryInList: 1,
				clientTime: Ext.Date.clearTime(new Date()).toISOString()
			},
			success: function (response, config) {
				Ext.Ajax.request({
					url: Df.App.getController('CoolerTrackingDetail'),
					params: {
						action: 'TrackingSummary',
						AssetId: id,
						IgnoreOutOfBusinessHours: false,
						IsWeeklyData: true
					},
					success: function (response, config) {
						this.onAssetDetailStore(response,id);
					},
					failure: function () {
						Ext.Viewport.setMasked(false);
						Ext.Msg.alert('Error', 'Some error occured.');
					}
					, scope: this
				})
				this.onAssetDetailStoreLoad(response, record);
				Ext.Ajax.request({
					url: Df.App.getController('Alert'),
					params: {
						action: 'alertSummaryInfo', otherAction: 'alertSummaryInfo', assetId: id
					},
					success: function (response) {
						var responseData = Ext.decode(response.responseText);
						this.onActionCompleteAlert(responseData.data);
					},
					failure: function () {
						Ext.Msg.alert('Error', 'Data not loaded');
					},
					scope: this
				});
			},
			failure: function () {
				Ext.Viewport.setMasked(false);
				Ext.Msg.alert('Error', 'Some error occured.');
			},
			scope: this
		});
	},
	onAssetDetailStoreLoad: function (response, records) {
		var data = Ext.decode(response.responseText).data;
		if (records) {
			Ext.Object.merge(data, records.data);
		}
		var navigationView = Ext.ComponentQuery.query('#mainNavigationView')[0];
		navigationView.push({ xtype: 'mobile-coolerSummary', data: data });
		Ext.Viewport.setMasked(false);
	},
	onAssetDetailStore: function (response,assetId) {
		var data = Ext.decode(response.responseText);
		if (data.records && data.records.length > 0) {
			Ext.each(data.records, function (item) {
				item.AssetId = assetId
			});
			data.records.reverse();
		}
		var healthSummaryPanel = Ext.ComponentQuery.query('#healthSummaryNew')[0];
		healthSummaryPanel.setData(data);
	},
	onActionCompleteAlert: function (record) {
		var data = record, alertSummary = Ext.ComponentQuery.query('#alertSummary')[0],
			activeAlerts = Ext.decode(data.activeAlerts), closedAlerts = Ext.decode(data.closedAlerts);
		if (closedAlerts.length > 0 || activeAlerts.length > 0) {
			alertSummary.setHidden(false);
			Ext.ComponentQuery.query('#alerts')[0].setHidden(false);
		}
		var records = { record: Ext.decode(data.summaryData), activeAlerts: activeAlerts, closedAlerts: closedAlerts };
		alertSummary.setData(records);
	},
	onToDoTap: function () {
		var view = this.getMainNavigationView();
		var list = Ext.ComponentMgr.create({ xtype: 'mobile-toDoList' });
		view.push(list);
		list.renderColumnPercentage(list.element);
		list.getStore().load();
	},
	onClosedAlertsList: function () {
		var store = Ext.getStore('Alerts');
		store.clearFilter();
		store.filterBy(function (record) {
			var id = record.get('Status');
			return id == 'Closed';
		});
	},

	onOpenAlertsList: function () {
		var store = Ext.getStore('Alerts');
		store.clearFilter();
		store.filterBy(function (record) {
			var id = record.get('Status');
			return id != 'Closed';
		});
	},
	onCoolerLatestInformation: function () {
		var args = this.actionSheet.config.actionArgs;
		this.loadAssetDetail(args.data.getAt(args.alertIndex).raw.AssetId, 'AssetInfo');
		this.actionSheet.hide();
	},
	onViewProvisionNewDevice: function (assetId) {
		if (assetId) {
			var navigationView = Ext.ComponentQuery.query('#mainNavigationView')[0];
			navigationView.push({ xtype: 'provisionNewDevice' });
			//assetPurityList = Ext.Viewport.add({ xtype: 'provisionNewDevice' });
		}
	},
	onInstallDevice: function () {
		var navigationView = this.getMainNavigationView();
		navigationView.push({ xtype: 'installDevice' });
	},
	onAlertListTap: function (list, args) {
		if (args.alertAction) {
			if (!this.actionSheet) {
				var actionSheet = Ext.create('Ext.ActionSheet', {
					actionArgs: args,
					cls: 'action-sheet-cls',
					defaults: {
						ui: 'cooler-action-btn',
						scope: this
					},
					items: [
						{
							text: 'Cooler Latest Information',
							handler: this.onCoolerLatestInformation
						},
						{
							text: 'Add to To-Do list',
							handler: this.onActionToDoList
						},
						{
							text: 'Call and mark Complete',
							handler: this.onMarkCompleteAction
						},
						{
							text: 'SMS',
							handler: this.onSMSAction
						},
						{
							text: 'eMail',
							handler: this.onEmailAction
						},
						{
							text: 'Send to Call Center',
							handler: this.onCallCenter
						},
						{
							text: 'Cancel',
							ui: 'confirm',
							handler: this.onAction
						}
					]
				});
				this.actionSheet = actionSheet;
			}
			else {
				this.actionSheet.config.actionArgs = args;
			}
			Ext.Viewport.add(this.actionSheet);
			this.actionSheet.show();
			return;
		}

		if (args.actionAction) {
			CoolerIoTMobile.Util.showActionUpdateWindow(false, false, args);
		}
	},

	doAction: function (args, action) {

		var alertWin = this.getAlertAction();

		if (alertWin) {
			var toDoActionId = this.getAlertAction().getFields('ToDoActionId').getValue(),
				notes = this.getAlertAction().getFields('Notes').getValue();
			alertWin.hide();
		}

		var data = args.alert;
		Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Saving action..' });
		var salesRepId;
		if (this.getSalesRepList() && this.getSalesRepList().getSelection()) {
			var salesRepListSelected = this.getSalesRepList().getSelection()[0];
			salesRepId = salesRepListSelected.data.RepId;
		}

		Ext.Ajax.request({
			url: Df.App.getController('Alert'),
			params: {
				action: 'other',
				otherAction: action,
				alertId: data.AlertId,
				notes: notes,
				toDoActionId: toDoActionId
			},
			userId: salesRepId,
			success: function (response, config) {
				Ext.Viewport.setMasked(false);
				var grid = Ext.ComponentQuery.query("alert-list")[0];
				var store = grid.getStore();
				var listPlugin = grid.getPlugins()[0];
				var list = listPlugin.getList();
				// count total loaded records here
				var totalItemloaded = list.itemsCount;
				var currentPage = list.getStore().currentPage;
				var storeProxy = store.getProxy();
				// load store with specific start and end 
				storeProxy.setExtraParams({ action: 'list', asArray: 0, limit: totalItemloaded });
				store.loadPage(1);
				Ext.Msg.alert('Success', 'Action completed');
				// again set limit 25 to make work List paging
				storeProxy.setExtraParams({ action: 'list', asArray: 0, limit: 25 });
				list.getStore().currentPage = currentPage;
			},
			failure: function () {
				Ext.Viewport.setMasked(false);
				Ext.Msg.alert('Error', 'Some error occurred.');
			}
		});
	},
	onActionToDoList: function () {
		var args = this.actionSheet.config.actionArgs;
		//this.doAction(args, 'AddToDoList');
		this.actionSheet.hide();
		CoolerIoTMobile.Util.showActionUpdateWindow(true, false, args);

	},
	onComplete: function () {
		this.getToDoList().getStore().load();
	},
	onMarkCompleteAction: function () {
		var args = this.actionSheet.config.actionArgs;
		this.doAction(args, 'CallAndMarkComplete');
		this.actionSheet.hide();
	},
	onSMSAction: function () {
		var args = this.actionSheet.config.actionArgs;
		this.doAction(args, 'AddSMSAction');
		this.actionSheet.hide();
	},
	onEmailAction: function () {
		var args = this.actionSheet.config.actionArgs;
		this.doAction(args, 'AddEmailAction');
		this.actionSheet.hide();
	},
	onCallCenter: function () {
		var args = this.actionSheet.config.actionArgs;
		this.doAction(args, 'AddCallCenterAction');
		this.actionSheet.hide();
	},
	onAction: function () {
		this.actionSheet.hide();
	},
	onOpenActionPlan: function () {
		var store = Ext.getStore('ActionPlan');
		store.clearFilter();
		store.filterBy(function (record) {
			var id = record.get('Status');
			return id != 'Completed';
		});
	},
	onCloseActionPlan: function () {
		var store = Ext.getStore('ActionPlan');
		store.clearFilter();
		store.filterBy(function (record) {
			var id = record.get('Status');
			return id == 'Completed';
		});
	},
	onMainActivate: function () {	 
		var view = this.getMainNavigationView();
		var navBar = view.getNavigationBar();
		navBar.add({ itemId: 'debugDeviceNavBtn', ui: 'plain', iconCls: 'device-setup-menu', hidden: true, align: 'right', iconMask: true });
		if (Df.App.isPhoneGap) {
			navBar.add({ xtype: 'df-buttonplus', itemId: 'debugButton', ui: 'plain', iconCls: 'location-list-image debug', align: 'right', iconMask: true });
		}

		navBar.add({ itemId: 'assestDetailBtn', margin: '.3em 0 .3em .3em', ui: 'plain', iconCls: 'list', align: 'right', iconMask: true, hidden: true });
		//navBar.add({ xtype: 'df-buttonplus', itemId: 'mainScreenButton', margin: '.3em 0 .3em .3em', ui: 'plain', iconCls: 'list', align: 'right', iconMask: true });
		if (Ext.os.is.iOS) {
			Ext.select(".x-toolbar.x-docked-top").applyStyles("height: 62px; padding-top: 15px;");
		}
	},
	showMap: function (view) {
		view.push({
			xtype: 'Df-Map',
			store: 'Customer'
		});
	},
	show: function (item, clearAll) {
		var view = this.getMainNavigationView();
		var item = typeof item === 'object' ? item : { xtype: item };
		//if (clearAll) {// Commentted due to #639 
		//	view.setRoot(item);
		//} else {
		//view.push(item);
	    //}		
		var items = view.items.items;
				var addItem = true;
				Ext.each(items, function (i) {
					if (i.xtype == item.xtype)
					{
								addItem = false;
					}
					});
				if (addItem) {
						view.push(item);
				}
				else {
					view.setRoot(item);
				}
	},

	onVisit: function () {
		this.show('mobile-visit', true);
	},
	onAlert: function () {
		var view = this.getMainNavigationView();
		var item = { xtype: 'alert-list-base' };
		var getAlertListbase = this.getAlertListbase();
		if (!getAlertListbase) {
			this.show('alert-list-base');
		}
		else {
			view.setRoot(item);
		}
		//this.getAlertList().loadData();
	},
	onCustomer: function () {
		var store = Ext.getStore('Customer');
		var item = { xtype: 'mobile-customer' };
		store.load();
		var view = this.getMainNavigationView();
		var customerList = this.getCustomerList();
		if (!customerList) {
			this.show('mobile-customer');
		}
		else
		{
		view.setRoot(item);
		}
	},

	onMessage: function () {
		this.show('mobile-MessageList', true);
	},

	onOjective: function () {
		this.show('mobile-objective', true);
	},
	onAdmin: function () {
		this.show('admin', true);
	},

	openMap: function () {
		var view = this.getMainNavigationView();
		if (Ext.getStore('Customer').getCount() === 0) {
			Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Loading location..' });
			Ext.getStore('Customer').load({
				callback: function (records, operation, success) {
					Ext.Viewport.setMasked(false);
					this.showMap(view);
				}, scope: this
			});
		}
		else {
			this.showMap(view);
		}
	},
	launch: function () {
	    var me = this;
		window.addEventListener('popstate', function () {
			var navigationView = Ext.ComponentQuery.query('#mainNavigationView')[0];
			if (navigationView) {
				var currentXtype = navigationView.getActiveItem().xtype;
				var navigationBar = navigationView.getNavigationBar();
				var backButton = navigationBar.getActiveItem().getAt(0);
				if (navigationView && navigationView.xtype === "navigationview" && !backButton.isHidden()) {
					navigationView.pop();
				} else if (Ext.Viewport.down('changePassword')) {
					Ext.Viewport.down('changePassword').destroy();
				}
				else {
					if (currentXtype === "mobile-assets") {
						history.back();
					}
					else {
						navigationView.pop();
					}
				}
			}
			else if (Ext.Viewport.down('forgotPassword')) {
			    me.getHomeView().setActiveItem(0);
			}
			else if (Ext.Viewport.down('mobile-settings-container')) {
				var settingsView = Ext.Viewport.down('mobile-settings-container');
				if(settingsView){
					settingsView.destroy();
				}				
			}
		}, false);
	}
});
