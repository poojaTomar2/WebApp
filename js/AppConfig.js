Cooler.AppConfig = new Cooler.Form({
	formTitle: 'AppConfig: {0}',
	keyColumn: 'AppConfigId',
	captionColumn: 'AppConfig',
	controller: 'AppConfig',
	title: 'App Config',
	disableAdd: true,
	securityModule: 'AppConfig',
	disableDelete: true,
	winConfig: {
		width: 700,
		height: 655,
		layout: 'border',
		defaults: { border: false }
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'AppConfigId', type: 'int' },
			{ header: 'Android App Must Update Version Code', dataIndex: 'AndroidAppMustUpdateVersionCode', type: 'int', width: 100, align: 'right' },
			{ header: 'Android App Should Update Version Code', dataIndex: 'AndroidAppShouldUpdateVersionCode', type: 'int', width: 100, align: 'right' },
			{ header: 'Allow Consumer Access?', dataIndex: 'AllowConsumerAccess', type: 'bool', width: 100 },
			{ header: 'Employee Email Sample', dataIndex: 'EmployeeEmailSample', type: 'string', width: 200 },
			{ header: 'Location Count', dataIndex: 'LocationCount', type: 'int', width: 100, align: 'right' },
			{ header: 'Location Radius', dataIndex: 'LocationRadius', type: 'int', width: 100, align: 'right' },
			{ header: 'Location Range', dataIndex: 'LocationRange', type: 'int', width: 100, align: 'right' },
			{ header: 'Location Distance Unit', dataIndex: 'LocationDistanceUnit', type: 'string', width: 200 },
			{ header: 'Location Search Range', dataIndex: 'LocationSearchRange', type: 'int', width: 100, align: 'right' },
			{ header: 'Enable Depth?', dataIndex: 'EnableDepth', type: 'bool', width: 100 },
			{ header: 'Min Asset Displacement (KM)', dataIndex: 'MinAssetDisplacement', type: 'float', renderer: ExtHelper.renderer.Float(2), allowDecimal: true, width: 100, align: 'right' },
			{ header: 'Min Movement Displacement (KM)', dataIndex: 'MinMovementDisplacement', type: 'float', renderer: ExtHelper.renderer.Float(2), allowDecimal: true, width: 100, align: 'right' },
			{ header: 'Min Movement Displacement 2nd (KM)', dataIndex: 'MinMovementDisplacementSecond', type: 'float', renderer: ExtHelper.renderer.Float(2), allowDecimal: true, width: 100, align: 'right' },
			{ header: 'Installation iOS App Version', dataIndex: 'InstallationAppVersion', type: 'float', renderer: ExtHelper.renderer.Float(2), width: 100, align: 'right' },
			{ header: 'Installation iOS App Version Must Update?', type: 'bool', dataIndex: 'InstallationAppVersionMustUpdate', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Installation Android App Version', dataIndex: 'InstallationAndroidAppVersion', type: 'int', width: 100, align: 'right' },
			{ header: 'Imbera Android App Version', dataIndex: 'ImberaAndroidAppVersion', type: 'int', width: 100, align: 'right' },
			{ header: 'Imbera Android App Version Must Update?', type: 'bool', dataIndex: 'ImberaAndroidAppVersionMustUpdate', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Imbera Android App Update link', dataIndex: 'ImberaAndroidAppUpdateLink', type: 'string', width: 200 },
			{ header: 'Imbera iOS App Version', dataIndex: 'ImberaiOSAppVersion', type: 'int', width: 100, align: 'right' },
			{ header: 'Imbera iOS App Version Must Update?', type: 'bool', dataIndex: 'ImberaiOSAppVersionMustUpdate', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Imbera iOS App Update link', dataIndex: 'ImberaiOSAppUpdateLink', type: 'string', width: 200 },
			{ header: 'Sollatek Android App Version', dataIndex: 'SollatekAndroidAppVersion', type: 'int', width: 100, align: 'right' },
			{ header: 'Sollatek Android App Version Must Update?', type: 'bool', dataIndex: 'SollatekAndroidAppVersionMustUpdate', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Sollatek Android App Update link', dataIndex: 'SollatekAndroidAppUpdateLink', type: 'string', width: 200 },
			{ header: 'Sollatek iOS App Version', dataIndex: 'SollatekiOSAppVersion', type: 'int', width: 100, align: 'right' },
			{ header: 'Sollatek iOS App Version Must Update?', type: 'bool', dataIndex: 'SollatekiOSAppVersionMustUpdate', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Sollatek iOS App Update link', dataIndex: 'SollatekiOSAppUpdateLink', type: 'string', width: 200 },
			{ header: 'Installation Android App Version Must Update?', type: 'bool', dataIndex: 'InstallationAndroidAppVersionMustUpdate', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Server Type', dataIndex: 'ServerType', type: 'string', width: 200 },
			{ header: 'Retailer App Notification', dataIndex: 'RetailerAppNotification', type: 'bool', renderer: ExtHelper.renderer.Boolean, width: 100 },
			{ header: 'Service Frequency(Mins)', dataIndex: 'RetailerAppServiceFrequency', type: 'int', align: 'right' },
			{ header: 'Run As Service', dataIndex: 'RetailerAppRunAsService', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Use Gps Service', dataIndex: 'RetailerAppUseGpsService', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Enable Push Notification', dataIndex: 'RetailerAppEnablePushNotification', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Push Notification Time', dataIndex: 'RetailerAppPushNotificationTime', type: 'date', renderer: Cooler.renderer.timeRenderer },
			{ header: 'Retailer App Min Temperature Threshold', dataIndex: 'RetailerAppMinTemperatureThreshold', type: 'int', align: 'right' },
			{ header: 'Retailer App Max Temperature Threshold', dataIndex: 'RetailerAppMaxTemperatureThreshold', type: 'int', align: 'right' },
			{ header: 'Retailer App Light Threshold', dataIndex: 'RetailerAppLightThreshold', type: 'int', align: 'right' },
			{ header: 'Retailer Terms & Conditions', dataIndex: 'RetailerAppTermsAndConditions', type: 'string', width: 200, renderer: ExtHelper.renderer.ToolTip() },
			{ header: 'Retailer Privacy Policy Url', dataIndex: 'RetailerPrivacyPolicyUrl', type: 'string', width: 200 },
			{ header: 'Retailer Terms And Conditions Url', dataIndex: 'RetailerTermsAndConditionsUrl', type: 'string', width: 200 },
			{ header: 'Retailer Help Link Url', dataIndex: 'RetailerHelpLinkUrl', type: 'string', width: 200 },
			{ header: '3rd Party Engagement Api Message Limit', dataIndex: 'MessageLimit', type: 'int', width: 200 },
			{ header: '3rd Party Engagement Api Message Hours', dataIndex: 'MessageHours', type: 'int', width: 200 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },
			{ header: 'IR SLA (Sec)', dataIndex: 'IRSLA', type: 'int', align: 'right' }
		]
	},

	comboStores: {
		DistanceUnit: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		RetailerAppServerType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},

	createForm: function (config) {
		var serverTypeCombo = ExtHelper.CreateCombo({ fieldLabel: 'Retailer App Server', hiddenName: 'RetailerAppServer', mode: 'local', store: this.comboStores.RetailerAppServerType, width: 200, allowBlank: false });
		var allowConsumerAccessCombo = DA.combo.create({ fieldLabel: 'Allow Consumer Access', hiddenName: 'AllowConsumerAccess', store: "yesno", allowBlank: false, editable: false });
		var enableDepthCombo = DA.combo.create({ fieldLabel: 'Enable Depth', hiddenName: 'EnableDepth', store: "yesno", allowBlank: false, editable: false });
		var distanceUnitCombo = DA.combo.create({ fieldLabel: 'Distance Unit', hiddenName: 'LocationDistanceUnitId', store: this.comboStores.DistanceUnit, mode: 'local', allowBlank: false, editable: false });
		var mustUpdateCombo = DA.combo.create({ fieldLabel: 'Installation iOS App Version Must Update?', hiddenName: 'InstallationAppVersionMustUpdate', store: "yesno", editable: false });
		var androidMustUpdateCombo = DA.combo.create({ fieldLabel: 'Installation Android App Version Must Update?', hiddenName: 'InstallationAndroidAppVersionMustUpdate', store: "yesno", editable: false });

		var ImberaAndroidAppMustUpdateCombo = DA.combo.create({ fieldLabel: 'Imbera Android App Version Must Update?', hiddenName: 'ImberaAndroidAppVersionMustUpdate', store: "yesno", editable: false });
		var ImberaiOSAppMustUpdateCombo = DA.combo.create({ fieldLabel: 'Imbera iOS App Version Must Update?', hiddenName: 'ImberaiOSAppVersionMustUpdate', store: "yesno", editable: false });
		var SollatekAndroidAppMustUpdateCombo = DA.combo.create({ fieldLabel: 'Sollatek Android App Version Must Update?', hiddenName: 'SollatekAndroidAppVersionMustUpdate', store: "yesno", editable: false });
		var SollatekiOSAppMustUpdateCombo = DA.combo.create({ fieldLabel: 'Sollatek iOS App Version Must Update?', hiddenName: 'SollatekiOSAppVersionMustUpdate', store: "yesno", editable: false });

		var enableNotificationCombo = DA.combo.create({ fieldLabel: 'Enable Notification', hiddenName: 'RetailerAppNotification', store: "yesno", allowBlank: false, editable: false });
		var enableRunAsServiceCombo = DA.combo.create({ fieldLabel: 'Enable Run As Service', hiddenName: 'RetailerAppRunAsService', store: "yesno", allowBlank: false, editable: false });
		var enableGpsServiceCombo = DA.combo.create({ fieldLabel: 'Enable GPS Service', hiddenName: 'RetailerAppUseGpsService', store: "yesno", allowBlank: false, editable: false });
		var enablePushNotificationCombo = DA.combo.create({ fieldLabel: 'Enable Push Notification', hiddenName: 'RetailerAppEnablePushNotification', store: "yesno", allowBlank: false, editable: false });
		var pushNotificationTime = new Ext.form.TimeField({ fieldLabel: 'Push Notification Time', allowBlank: false, format: 'h:i A', listWidth: 80, name: 'RetailerAppPushNotificationTime' });

		var firstColumn = [
			{ fieldLabel: 'Android App Must Update Version Code', name: 'AndroidAppMustUpdateVersionCode', maxLength: 3, allowBlank: false, xtype: 'numberfield', minValue: 0 },
			{ fieldLabel: 'Android App Should Update Version Code', name: 'AndroidAppShouldUpdateVersionCode', maxLength: 3, allowBlank: false, xtype: 'numberfield', minValue: 0 },
			allowConsumerAccessCombo,
			{ fieldLabel: 'Employee Email Sample', name: 'EmployeeEmailSample', xtype: 'textfield', maxLength: 250, allowBlank: false },
			{ fieldLabel: 'Location Count', name: 'LocationCount', xtype: 'numberfield', maxValue: 500, minValue: 1, allowDecimal: false, allowBlank: false },
			{ fieldLabel: 'Location Radius', name: 'LocationRadius', xtype: 'numberfield', maxValue: 500, minValue: 1, allowDecimal: false, allowBlank: false },
			{ fieldLabel: 'Location Range', name: 'LocationRange', xtype: 'numberfield', maxValue: 500, minValue: 1, allowDecimal: false, allowBlank: false },
			distanceUnitCombo,
			{ fieldLabel: 'Location Search Range', name: 'LocationSearchRange', xtype: 'numberfield', maxValue: 500, minValue: 1, allowDecimal: false, allowBlank: false },
			enableDepthCombo,
			{ fieldLabel: 'Min Asset Displacement (KM)', name: 'MinAssetDisplacement', xtype: 'numberfield', minValue: 0.1, maxValue: 100, allowBlank: false },
			{ fieldLabel: 'Min Movement Displacement (KM)', name: 'MinMovementDisplacement', xtype: 'numberfield', minValue: 0.1, maxValue: 100, allowBlank: false },
			{ fieldLabel: 'Min Movement Displacement 2nd (KM)', name: 'MinMovementDisplacementSecond', xtype: 'numberfield', minValue: 0.1, maxValue: 100, allowBlank: false },
			{ fieldLabel: 'Installation iOS App Version', name: 'InstallationAppVersion', allowBlank: false, xtype: 'numberfield', minValue: 0, maxValue: 100, allowDecimal: true },
			mustUpdateCombo,
			{ fieldLabel: 'Installation Android App Version', name: 'InstallationAndroidAppVersion', allowBlank: false, xtype: 'numberfield', minValue: 0, maxValue: 10000, allowDecimal: false },
			androidMustUpdateCombo,
			{ fieldLabel: 'Imbera iOS App Version', name: 'ImberaiOSAppVersion', allowBlank: false, xtype: 'numberfield', minValue: 0, maxValue: 10000, allowDecimal: false },
			ImberaiOSAppMustUpdateCombo,
			{ fieldLabel: 'Imbera iOS App Update Link', name: 'ImberaiOSAppUpdateLink', xtype: 'textfield', maxLength: 255 },
			{ fieldLabel: 'Sollatek iOS App Version', name: 'SollatekiOSAppVersion', allowBlank: false, xtype: 'numberfield', minValue: 0, maxValue: 10000, allowDecimal: false },
			SollatekiOSAppMustUpdateCombo,
			{ fieldLabel: 'Sollatek iOS App Update Link', name: 'SollatekiOSAppUpdateLink', xtype: 'textfield', maxLength: 255 },
			{ fieldLabel: 'IR SLA (Sec)', name: 'IRSLA', xtype: 'numberfield', minValue: 1, allowDecimal: false, allowBlank: false }
		];
		var secondColumn = [
			serverTypeCombo,
			enableNotificationCombo,
			{ fieldLabel: 'Service Frequency(Mins)', name: 'RetailerAppServiceFrequency', xtype: 'numberfield', maxValue: 1440, minValue: 1, allowDecimal: false, allowBlank: false },
			enableRunAsServiceCombo,
			enableGpsServiceCombo,
			enablePushNotificationCombo,
			pushNotificationTime,
			{ fieldLabel: 'Retailer App Min Temperature Threshold', name: 'RetailerAppMinTemperatureThreshold', xtype: 'numberfield', maxValue: 1440, minValue: 1, allowDecimal: false, allowBlank: false },
			{ fieldLabel: 'Retailer App Max Temperature Threshold', name: 'RetailerAppMaxTemperatureThreshold', xtype: 'numberfield', maxValue: 1440, minValue: 1, allowDecimal: false, allowBlank: false },
			{ fieldLabel: 'Retailer App Light Threshold', name: 'RetailerAppLightThreshold', xtype: 'numberfield', maxValue: 1440, minValue: 1, allowDecimal: false, allowBlank: false },
			{ fieldLabel: 'Retailer Terms & Conditions', name: 'RetailerAppTermsAndConditions', xtype: 'textarea', maxLength: 10000, allowBlank: false },
			{ fieldLabel: 'Retailer Privacy Policy Url', name: 'RetailerPrivacyPolicyUrl', xtype: 'textfield', maxLength: 250, allowBlank: false },
			{ fieldLabel: 'Retailer Terms And Conditions Url', name: 'RetailerTermsAndConditionsUrl', xtype: 'textfield', maxLength: 250, allowBlank: false },
			{ fieldLabel: 'Retailer Help Link Url', name: 'RetailerHelpLinkUrl', xtype: 'textfield', maxLength: 250, allowBlank: false },
			{ fieldLabel: 'Imbera Android App Version', name: 'ImberaAndroidAppVersion', allowBlank: false, xtype: 'numberfield', minValue: 0, maxValue: 10000, allowDecimal: false },
			ImberaAndroidAppMustUpdateCombo,
			{ fieldLabel: 'Imbera Android App Update Link', name: 'ImberaAndroidAppUpdateLink', xtype: 'textfield', maxLength: 255 },
			{ fieldLabel: 'Sollatek Android App Version', name: 'SollatekAndroidAppVersion', allowBlank: false, xtype: 'numberfield', minValue: 0, maxValue: 10000, allowDecimal: false },
			SollatekAndroidAppMustUpdateCombo,
			{ fieldLabel: 'Sollatek Android App Update Link', name: 'SollatekAndroidAppUpdateLink', xtype: 'textfield', maxLength: 255 },
			{ fieldLabel: '3rd Party Engagement Api Message Limit', name: 'MessageLimit', xtype: 'numberfield', maxValue: 10000, minValue: 1, allowDecimal: false, allowBlank: false },
			{ fieldLabel: '3rd Party Engagement Api Message Hours', name: 'MessageHours', xtype: 'numberfield', maxValue: 24, minValue: 1, allowDecimal: false, allowBlank: false }


		]
		var column = {
			layout: 'column',
			region: 'center',
			border: false,
			defaults: {
				layout: 'form',
				border: false
			},
			items: [
				{ items: firstColumn, defaults: { width: 200 }, columnWidth: .5 },
				{ items: secondColumn, defaults: { width: 200 }, columnWidth: .5 }
			]
		};
		Ext.apply(config, {
			items: column
		});
		return config;
	},

	CreateFormPanel: function (config) {
		Ext.apply(config, {
			region: 'center',
			autoScroll: true
		});
		this.formPanel = new Ext.FormPanel(config);

	}

});