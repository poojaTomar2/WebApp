/*
	This file is generated and updated by Sencha Cmd. You can edit this file as
	needed for your application, but these edits will have to be merged by
	Sencha Cmd when it performs code generation tasks such as generating new
	models, controllers or views and when running "sencha app upgrade".

	Ideally changes to this file would be limited and most work would be done
	in other places (such as Controllers). If Sencha Cmd cannot merge your
	changes and its generated code, it will produce a "merge conflict" that you
	will need to resolve manually.
*/
Ext.application({
	name: 'CoolerIoTMobile',

	requires: [
		'Ext.MessageBox',
		'Ext.Label',
		'Df.App',
		'Df.model.Lookup',
		'Ext.Img',
		'Ext.field.Select',
		'Ext.field.Search',
		'CoolerIoTMobile.Localization',
		'CoolerIoTMobile.BleCommands',
		'CoolerIoTMobile.RecordTypes',
		'CoolerIoTMobile.Templates',
		'CoolerIoTMobile.widget.CollapsibleTitlebar',
		'CoolerIoTMobile.widget.OpenAlertsChart',
		'CoolerIoTMobile.widget.AgingChart',
		'CoolerIoTMobile.Util',
		'CoolerIoTMobile.UtilChart',
		'CoolerIoTMobile.Enums',
		'Ext.grid.Grid',
		'Ext.grid.HeaderGroup',
		'Ext.grid.plugin.Editable',
		'Ext.grid.plugin.ViewOptions',
		'Ext.grid.plugin.MultiSelection',
		'Ext.grid.plugin.ColumnResizing',
		'Ext.grid.plugin.SummaryRow',
		'CoolerIoTMobile.util.Renderers',
		'CoolerIoTMobile.util.Utility',
		'CoolerIoTMobile.widget.DistributionChart',
		'CoolerIoTMobile.widget.DistributionData',
		'CoolerIoTMobile.widget.HealthLineChart',
		'Ext.navigation.View',
		'Ext.tab.Panel',
		'Ext.ActionSheet',
		'Ext.util.DelayedTask',
		'Ext.field.Number',
		'Ext.DateExtras',
		'Ext.plugin.PullRefresh',
		'Ext.plugin.ListPaging',
		'Ext.dataview.List',
		'Ext.TitleBar',
		'CoolerIoTMobile.view.Mobile.CommandsNavigation',
		'CoolerIoTMobile.view.Mobile.DebugDevicePanel',
		'CoolerIoTMobile.view.Mobile.ResponsePanel',
		'CoolerIoTMobile.view.Mobile.CommandInputPanel',
		'Df.store.Lookups',
		'Ext.ux.mgd.device.Scanner',
		'CoolerIoTMobile.CommandFormItems',
		'CoolerIoTMobile.view.Mobile.Settings',
		'CoolerIoTMobile.widget.SummaryChart',
		'CoolerIoTMobile.widget.ProductDistributionChart',
		'CoolerIoTMobile.UploadDataService',
		'Ext.azure.Azure'
	],

	views: [
		'Tablet.Dashboard',
		'Tablet.SalesRepIssueList',
		'Tablet.MyTeam',
		'Login',
		'Main',
		'ForgotPassword',
		'Mobile.Main',
		'Mobile.Dashboard',
		'Mobile.AlertList',
		'Tablet.Main',
		'Mobile.Visit',
		'Mobile.CustomerInfo',
		'Mobile.Map',
		'Mobile.CoolerSummary',
		'Mobile.Customer',
		'Mobile.TaskList',
		'Mobile.ToDoList',
		'Mobile.CoolerSummaryMatrix',
		'Mobile.Location',
		'Mobile.AssetPurityList',
		'Mobile.DebugDeviceContainer',
		'Mobile.DeviceDataList',
		'Mobile.ScanningDevice',
		'Mobile.ScanningDevicePanel',
		'ListItem',
		'Mobile.Object',
		'Mobile.DoorData',
		'Mobile.SmartDeviceHealthRecord',
		'Mobile.SmartDeviceMovement',
		'Mobile.AlertActionWindow',
		'Mobile.AlertListBase',
		'Mobile.Message',
		'Tablet.Toolbar',
		'Tablet.CoachingToolbar',
		'Tablet.MapPanel',
		'Mobile.FullScreenImage',
		'Mobile.AssetList',
		'Mobile.Assets',
		'Mobile.SmartDevicePowerConsumption',
		'Mobile.SmartDeviceCommand',
		'Mobile.SmartDevicePing',
		'Mobile.SmartDeviceConfig',
		'Mobile.ProvisionNewDevice',
		'Mobile.CoolerMenuScreen',
		'Mobile.MainNavigation',
		'Mobile.DeviceConfiguration',
		'ChangePassword',
		'Mobile.DeviceDataResponseWindow',
		'Mobile.CoolerImage',
		'Mobile.DeviceLogInfoPanel',
		'Mobile.DeviceFactorySetup',
		'Mobile.Settings',
		'Mobile.Admin',
		'Mobile.DeviceSearchResult',
		'Mobile.MainMenu',
		'Mobile.Order',
		'Mobile.OrderMain',
		'Mobile.OrderDetail',
		'Mobile.VisitHistory',
		'Mobile.VisitHistoryWindow',
		'Mobile.Notes',
		'Mobile.NotesWindow',
		'Mobile.Attachment',
		'Mobile.AttachmentWindow',
		'Mobile.AssetLocation',
		'Mobile.AssetLocationList',
		'Mobile.InstallDevice',
		'Mobile.AssetInstallList'
	],

	stores: [
		'SalesRepIssue',
		'Visit',
		'BleTag',
		'CommandData',
		'DeviceData',
		'CustomerInfo',
		'Location',
		'CoolerSummary',
		'Customer',
		'ToDoList',
		'AssetDetail',
		'CoolerSummaryMatrix',
		'AssetPurity',
		'Components',
		'DoorData',
		'SmartDeviceHealthRecord',
		'SmartDeviceMovement',
		'SalesRepLocation',
		'Message',
		'LocationWithIssues',
		'AssetList',
		'SmartDevicePowerConsumption',
		'SmartDeviceCommand',
		'SmartDevicePing',
		'SmartDeviceConfig',
		'DeviceLogs',
		'AlertList',
		'DeviceSearchResult',
		'Order',
		'VisitHistory',
		'Notes',
		'Attachment',
		'AssetLocation'
	],

	controllers: [
		'Login',
		'Dashboard',
		'TabletDashboard',
		'DebugDevice',
		'ForgotPassword',
		'Visit',
		'Customer',
		'Home',
		'CustomerInfo',
		'ToDoList',
		'AlertActionWindow',
		'SalesRepIssueList',
		'Message',
		'FullScreenImage',
		'CoolerSummary',
		'ProvisionNewDevice',
		'BlueToothLeDeviceActor',
		'DeviceConfiguration',
		'Settings',
		'Admin',
		'Order',
		'OrderDetail',
		'VisitHistoryWindow',
		'NotesWindow',
		'Attachment',
		'InstallDevice'

	],
	models: [
		'SalesRepIssue',
		'Alerts',
		'Visit',
		'BleTag',
		'CommandData',
		'DeviceData',
		'CustomerInfo',
		'CoolerSummary',
		'Customer',
		'AlertAction',
		'CoolerSummaryMatrix',
		'AssetPurity',
		'Components',
		'DoorData',
		'SmartDeviceHealthRecord',
		'SmartDeviceMovement',
		'SalesRepLocation',
		'Message',
		'LocationWithIssues',
		'AssetList',
		'SmartDevicePowerConsumption',
		'SmartDeviceCommand',
		'SmartDevicePing',
		'DeviceLogs',
		'AlertList',
		'DeviceSearchResult',
		'Order',
		'VisitHistory',
		'Notes',
		'Attachment',
		'AssetLocation'
	],

	azure: {
		appKey: '5bJBkM7+mv/2Bqyq1ITW5hVM1sHey3hOiJ3zCGP2b9Q=',
		appUrl: 'coolerpushnotificationservicebus-ns.servicebus.windows.net/coolerpushnotificationservicebus',
		pushConfig: {
			windowsphone: 'channel_name',
			android: '500694744982',
			ios: true
		}
	},

	icon: {
		'57': 'resources/icons/Icon.png',
		'72': 'resources/icons/Icon~ipad.png',
		'114': 'resources/icons/Icon@2x.png',
		'144': 'resources/icons/Icon~ipad@2x.png'
	},

	isIconPrecomposed: true,

	startupImage: {
		'320x460': 'resources/startup/320x460.jpg',
		'640x920': 'resources/startup/640x920.png',
		'768x1004': 'resources/startup/768x1004.png',
		'748x1024': 'resources/startup/748x1024.png',
		'1536x2008': 'resources/startup/1536x2008.png',
		'1496x2048': 'resources/startup/1496x2048.png'
	},
	setCommonData: function () {
		$D = function (v) { return Ext.Date.parse(v, 'X'); }
		Ext.DateExtras.parseCodes.X = {
			g: 1,
			c: "y = parseInt(results[1], 10); m = parseInt(results[2], 10) - 1; d = parseInt(results[3], 10); h = parseInt(results[4], 10); i = parseInt(results[5], 10); s = parseInt(results[6], 10); ms = parseInt(results[7], 10);",
			s: "(\\d{4})(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{3})"
		};
		Ext.data.Field.prototype._dateFormat = 'X';
		Number.prototype.toHourMinute = function () {
			var value = this;
			var negative = value < 0;
			value = Math.abs(value);
			var hours = Math.floor(value / 60);
			var minutes = Math.floor(value - hours * 60);
			var rValue = (negative ? "-" : "") + Ext.util.Format.leftPad(hours.toString(), 2, '0') + ':' + Ext.util.Format.leftPad(minutes.toString(), 2, '0');
			rValue = rValue.indexOf("NaN") > -1 ? "0:00" : rValue;
			return rValue;
		};
	},
	fixOverflowChangedIssue: function () {
		if (Ext.browser.is.WebKit) {
			Ext.override(Ext.util.SizeMonitor, {
				constructor: function (config) {
					var namespace = Ext.util.sizemonitor;
					return new namespace.Scroll(config);
				}
			});

			Ext.override(Ext.util.PaintMonitor, {
				constructor: function (config) {
					return new Ext.util.paintmonitor.CssAnimation(config);
				}
			});
		}
	},
	launch: function () {
		Ext.Azure.init(this.config.azure);
		this.fixOverflowChangedIssue(); // for scrolling issue in touch application due to chrome upgrade.
		this.setCommonData();
		// Destroy the #appLoadingIndicator element
		Ext.fly('appLoadingIndicator').destroy();
		// Initialize the main view
		Ext.Viewport.add(Ext.create('CoolerIoTMobile.view.Main'));

		//Alert box not hidding 
		//http://www.sencha.com/forum/showthread.php?262324-Sencha-Messagebox-and-Overlay-Problems-on-HTC-One-Browser
		Ext.Msg.defaultAllowedConfig.showAnimation = false;
		Ext.Msg.defaultAllowedConfig.hideAnimation = false;
		if (Ext.os.is.iOS && Df.App.isPhoneGap) {
			document.body.style.marginTop = "15px";
			Ext.Viewport.setHeight(Ext.Viewport.getWindowHeight() - 15);
		}
	},

	onUpdated: function () {
		Ext.Msg.confirm(
			"Application Update",
			"This application has just successfully been updated to the latest version. Reload now?",
			function (buttonId) {
				if (buttonId === 'yes') {
					window.location.reload();
				}
			}
		);
	},
	onFollowUpClick: function (data) {
		var navigationView = Ext.ComponentQuery.query('#mainNavigationView')[0];
		navigationView.push({ xtype: 'mobile-customerInfo', data: data });
	}
});

Ext.override('Ext.util.PositionMap', {
	config: {
		minimumHeight: 30
	}
});

Ext.Loader.setConfig({
	enabled: true,
	paths: {
		'Ext.ux': './Ext.ux'
	}
});
