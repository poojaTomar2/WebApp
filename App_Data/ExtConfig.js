var s = {
	Controllers: {
		GridPreferenceManager: { Controller: "ExtJSHelper.Controllers.GridPreference, ExtJSHelper" },
		Lookup: { Controller: "ExtJSHelper.Controllers.Lookup<DCPLFramework.Business.Lookup, DCPLFramework>, ExtJSHelper" },
		Combo: { Controller: 'ExtJSHelper.Controllers.Combo<Cooler.Business.LookupList>, ExtJSHelper' },
		EmailQueue: { Controller: 'ExtJSHelper.Controllers.EmailQueue, ExtJSHelper' },
		EmailRecipient: { Controller: 'ExtJSHelper.Controllers.EmailRecipient, ExtJSHelper' },
		EmailTemplate: null,
		Login: { Controller: 'Cooler.Controller.Login' },
		LoginController: { Controller: "ExtJSHelper.Controllers.Login, ExtJSHelper" },
		LookupType: { Controller: 'ExtJSHelper.ExtController<DCPLFramework.Business.LookupType, DCPLFramework>, ExtJSHelper', Filters: [{ Parameter: 'IsEditable', Type: 'Int', Default: 1 }] },
		AssetInfo: { Controller: 'Cooler.Controllers.AssetInfo', BasicAuthentication: true },
		SecurityRole: { Controller: 'Cooler.Controllers.Role' },
		UserState: { Controller: "ExtJSHelper.Controllers.UserState, ExtJSHelper" },
		SystemStatus: { Controller: "ExtJSHelper.Controllers.SystemStatus, ExtJSHelper" },
		Asset: { Controller: 'Cooler.Controllers.Asset', BasicAuthentication: true },
		AssetVisitHistory: { Filters: [{ Parameter: 'AssetId', Type: 'Int', Default: -1 }] },
		MeasurementUnitType: null,
		Manufacturer: null,
		Brand: null,
		Distributor: null,
		PackagingType: null,
		Location: { Controller: 'Cooler.Controllers.LocationController' },
		CoolerInfoChild: { Filters: [{ Parameter: 'AssetId', Type: 'Int', Default: -1 }] },
		LinkedAssets: { Controller: 'Cooler.Controllers.LinkedAssets' },
		Customer: null,
		CoolerInfo: null,
		NotificationRecipient: { Controller: 'Cooler.Controllers.NotificationRecipient' },
		MacAddressGenerator: { Controller: 'Cooler.Controllers.MacAddressGenerator' },
		AssetPurityProduct: {
			BasicAuthentication: true,
			Filters: [{ Parameter: 'AssetPurityId', Type: 'Int' }]
		},
		AssetPurity: {
			Controller: 'Cooler.Controllers.AssetPurity',
			Filters: [
				{ Parameter: 'AssetId', Type: 'Int' },
				{ Parameter: 'PurityIssue', Type: 'Boolean' },
				{ Parameter: 'IsVerified', Type: 'Boolean' }
			],
			BasicAuthentication: true
		},
		CoolerSummary: {
			Controller: 'Cooler.Controller.CoolerSummary',
			BasicAuthentication: true
		},
		CoolerImagePreview: {
			Controller: 'Cooler.Controllers.CoolerImagePreview'
		},
		StackedChart: { Controller: 'StackedChart' },
		PieChart: { Controller: 'PieChart' },
		Alert: {
			Controller: "Controllers_Alert",
			Filters: [
				{ Parameter: 'AssetId', Type: 'Int' },
				{ Parameter: 'LocationId', Type: 'Int' },
				{ Parameter: 'SalesRepId', Type: 'Int' }
			],
			BasicAuthentication: true
		},
		Product: { Controller: 'Cooler.Controllers.Product' },
		SalesForceTest: { Controller: 'Cooler.Controllers.SalesForceTest' },
		ProductImage: {
			Controller: 'Cooler.Controllers.ProductImage',
			Filters: [
				{ Parameter: 'ProductId', Type: 'Int' }
			]
		},
		AppUser: { Controller: 'Cooler.Controllers.AppUser' },
		TaskScheduler: { Controller: "ExtJSHelper.Controllers.TaskScheduler, ExtJSHelper" },
		DownloadAttachment: { Controller: "ExtJSHelper.Controllers.Download, ExtJSHelper" },
		Attachment: { Controller: "ExtJSHelper.Controllers.Attachment, ExtJSHelper" },
		Note: { Controller: "ExtJSHelper.Controllers.Note, ExtJSHelper" },
		ClientAddress: null,
		SmartDevice: { Controller: 'Cooler.Controllers.SmartDeviceController', BasicAuthentication: true },
		SetupDevice: { Controller: 'Cooler.Controllers.SetupDevice', BasicAuthentication: true },
		SmartDeviceType: { Controller: 'Cooler.Controllers.SmartDeviceType', BasicAuthentication: true },
		SensorType: null,
		AssetType: null,
		Classification: { Controller: 'Controllers_Classification' },
		Tag: { Controller: 'Cooler.Controllers.Tag' },
		Client: { Controller: 'Cooler.Controllers.Client' },
		LocationType: { Controller: 'Cooler.Controllers.LocationType' },
		Help: { Controller: "ExtJSHelper.Controllers.Help, ExtJSHelper" },
		Territory: { Controller: 'Controllers_Territory' },
		RawLogs: { Controller: "Cooler.Controllers.RawLogs" },
		ApiLogs: { Controller: "Cooler.Controllers.ApiLogs" },
		RawFiles: { Controller: 'Cooler.Controllers.RawFiles' },
		Consumer: { Controller: 'Cooler.Controllers.ConsumerController' },
		UploadDataHandler: { Controller: 'Cooler.Controllers.UploadDataHandler' },
		AssetStock: {
			Filters: [{ Parameter: 'AssetId', Type: 'Int', Default: -1 }]
		},
		AlertAction: { Controller: "iOt.Controllers.AlertAction" },
		AssetSummaryBySupervisor: { Controller: "iOt.Controllers.AssetSummaryBySupervisor" },
		LocationListWithIssues: { Controller: "iOt.Controllers.LocationListWithIssues" },
		Visit: { Controller: "Controllers_Visit", BasicAuthentication: true },
		VisitHistory: { Controller: 'Controllers_VisitHistory' },
		AssetPurityInfo: { Controller: "Controllers_AssetPurityInfo" },
		SmartDeviceDoorStatus: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' },
				{ Parameter: 'AssetId', Type: 'Int' }
			],
			BasicAuthentication: true
		},
		SmartDeviceHealthRecord: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' },
				{ Parameter: 'AssetId', Type: 'Int' }
			],
			BasicAuthentication: true
		},
		SmartDevicePowerConsumption: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' },
				{ Parameter: 'AssetId', Type: 'Int' }
			],
			BasicAuthentication: true
		},
		SmartDevicePing: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' },
				{ Parameter: 'AssetId', Type: 'Int' }
			],
			BasicAuthentication: true
		},
		SmartDeviceMovement: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' },
				{ Parameter: 'AssetId', Type: 'Int' }
			],
			BasicAuthentication: true
		},
		SmartDeviceImage: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' }
			],
			BasicAuthentication: true
		},
		SmartDeviceEventAlarmError: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' },
				{ Parameter: 'AssetId', Type: 'Int' }
			]
		},
		SalesRepIssue: { Controller: "Controllers_SalesRepIssue" },
		Chart: { Controller: 'Chart' },
		LowestOutletPurityChartData: { Controller: 'LowestOutletPurityChartData' },
		Helper: { Controller: 'iOt.Controllers.HomeData' },
		Message: { Controller: 'Controllers_Message' },
		DeviceRawData: { Controller: 'Cooler.Controllers.DeviceRawData' },
		AlertDefinition: null,
		SmartDeviceSerial: { Controller: 'Cooler.Controllers.Controllers_SmartDeviceSerial' },
		SmartDeviceLog: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' }
			],
			BasicAuthentication: true
		},
		AssetPurityReadOnly: { Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>" },
		Country: { BusinessObject: 'Countries' },
		State: { BusinessObject: 'States' },
		SmartDeviceCommand: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' }
			]
		},
		DataUploadGMC0: { Controller: 'Cooler.Controllers.DataUploadGMC0' },
		DataUploadWellington: { Controller: 'Cooler.Controllers.DataUploadWellington' },
		DataUpload: { Controller: 'Cooler.Controllers.DataUpload' },
		DataUpload2: { Controller: 'Cooler.Controllers.DataUpload2' },
		DataUploader: { Controller: 'Cooler.Controllers.DataUploader' },
		CoolerTrackingDetail: { Controller: 'Cooler.Controllers.CoolerTrackingDetail', BasicAuthentication: true },
		DataUploadWindows: { Controller: 'Cooler.Controllers.DataUploadWindows', BasicAuthentication: true },
		DataModel: null,
		ImageTester: { Controller: 'Cooler.Controllers.ImageTester' },
		WithSessionImport: { Controller: "Controllers_Import" },
		AdminLog: null,
		VirtualHubLog: { Controller: 'VirtualHubLog' },
		LineCharts: { Controller: 'LineCharts' },
		AssetPlanogram: null,
		SmartDeviceCellLocation: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' },
				{ Parameter: 'AssetId', Type: 'Int' }
			]
		},
		SmartDevicePowerEvent: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' },
				{ Parameter: 'AssetId', Type: 'Int' }
			]
		},
		SmartDevicePowerRecord: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' }
			]
		},
		"mobileApi": {
			Controller: "Cooler.Controllers.Atos.Api"
		},
		"mobileApiV2": {
			Controller: "Cooler.Controllers.Atos.ApiV2"
		},
		"consumerApiV2": {
			Controller: "Cooler.Controllers.Consumer.ConsumerApiV2"
		},
		LogDebugger: { Controller: "Cooler.Controllers.LogDebugger", ModulesRequired: "RawLogs" },
		DataSummary: { Controller: "Cooler.Controllers.DataSummary" },
		AssetDataSummary: { Controller: "Cooler.Controllers.AssetDataSummary" },
		JsonData: { Controller: "Cooler.Controllers.JsonData", ModulesRequired: "Admin" },
		Planogram: { Controller: 'Cooler.Controllers.Planogram' },
		DashBoardAPI: { Controller: 'Cooler.Controllers.Charts.DashBoard' },
		AlertSummary: null,
		Contact: null,
		NotificationRecurrence: {
			Filters: [{ Parameter: 'ContactId', Type: 'Int', Default: -1 }]
		},
		"consumerApi": {
			Controller: "Cooler.Controllers.Consumer.ConsumerApi"
		},
		"iRApi": {
			Controller: "Cooler.Controllers.Consumer.IRApi"
		},
		ProductCategory: { Controller: 'Cooler.Controllers.ProductCategory' },
		SurveyCharts: { Controller: 'Cooler.Controllers.Consumer.SurveyCharts' },
		Market: null,
		MarketHierarchy: { Controller: 'Controllers_MarketHierarchy' },
		ConsumerPromotion: { Controller: 'Cooler.Controllers.ConsumerPromotion' },
		LocationPromotion: {
			Controller: 'Cooler.Controllers.ExtController<Insigma.Business.ConsumerApi.LocationPromotion>',
			Filters: [
				{ Parameter: 'PromotionId', Type: 'Int' },
				{ Parameter: 'LocationId', Type: 'Int' }
			]
		},
		EddystonePromotion: { Controller: 'Cooler.Controllers.EddystonePromotion' },
		EddystonePromotionStaging: { Controller: 'Cooler.Controllers.EddystonePromotionStaging' },
		EddystonePromotionLocation: {
			Controller: 'Cooler.Controllers.EddystonePromotionLocation',
			Filters: [
				{ Parameter: 'EddystonePromotionId', Type: 'Int' },
				{ Parameter: 'LocationId', Type: 'Int' }
			]
		},
		iBeaconPromotion: { Controller: 'Cooler.Controllers.iBeaconPromotion' },
		iBeaconPromotionLocation: {
			Controller: 'Cooler.Controllers.iBeaconPromotionLocation',
			Filters: [
				{ Parameter: 'iBeaconPromotionId', Type: 'Int' },
				{ Parameter: 'LocationId', Type: 'Int' }
			]
		},
		EddystoneUIDPromotion: { Controller: 'Cooler.Controllers.EddystoneUIDPromotion' },
		EddystoneUIDPromotionLocation: {
			Controller: 'Cooler.Controllers.EddystoneUIDPromotionLocation',
			Filters: [
				{ Parameter: 'EddystoneUIDPromotionId', Type: 'Int' },
				{ Parameter: 'LocationId', Type: 'Int' }
			]
		},
		LocationProduct: { Controller: 'Controllers_LocationProduct' },
		Feedback: { Controller: 'Cooler.Controllers.ExtController<Insigma.Business.ConsumerApi.ConsumerFeedback>' },
		CoolerUplift: null,
		EarnPoint: { Controller: 'Controllers_EarnPoint' },
		Media: { Controller: 'Cooler.Controllers.Media' },
		LocationMedia: { Controller: 'Controllers_LocationMedia' },
		LocationBusinessHour: {
			Filters: [{ Parameter: 'LocationId', Type: 'Int', Default: -1 }]
		},
		ConsumerInfo: { Controller: 'Cooler.Controllers.ConsumerInfo' },
		ConsumerLoyaltyPoint: {
			Controller: 'Cooler.Controllers.ExtController<Insigma.Business.ConsumerApi.ConsumerLoyaltyPoint>',
			Filters: [{ Parameter: 'ConsumerId', Type: 'Int' }]
		},
		Order: { Controller: 'Controllers_ConsumerOrder' },
		OrderDetail: {
			Controller: 'Cooler.Controllers.ExtController<Insigma.Business.ConsumerApi.ConsumerOrderProduct>',
			Filters: [{ Parameter: 'ConsumerOrderId', Type: 'Int' }]
		},
		OrderDetailRetailer: {
			Controller: 'Controllers_ConsumerOrderProduct',
			Filters: [{ Parameter: 'ConsumerOrderId', Type: 'Int' }]
		},
		ConsumerBooking: { Controller: 'Controllers_ConsumerBooking' },
		Jukebox: {
			Controller: 'Cooler.Controllers.ExtController<Insigma.Business.ConsumerApi.LocationJukebox>',
			Filters: [{ Parameter: 'LocationId', Type: 'Int' }]
		},
		LocationImage: {
			Controller: 'Cooler.Controllers.LocationImage',
			Filters: [{ Parameter: 'LocationId', Type: 'Int', Default: -1 }]
		},
		SurveyQuestion: {
			Controller: 'SurveyQuestion',
			Filters: [{ Parameter: 'SurveyTypeId', Type: 'Int' }]
		},
		Survey: { Controller: 'Cooler.Controllers.ExtController<Insigma.Business.ConsumerApi.Survey>' },
		SurveyDetail: {
			Controller: 'Controllers_SurveyDetail',
			Filters: [{ Parameter: 'SurveyId', Type: 'Int' }]
		},
		SurveyType: { Controller: 'SurveyType' },
		SurveyReport: { Controller: 'Cooler.Controllers.Reports.SurveyDetailReport' },
		AppConfig: null,
		ScanConfig: null,
		LocationReference: { Controller: 'Cooler.Controllers.LocationReference' },
		Token: { Controller: 'Cooler.Controllers.Token' },
		Prospect: { Controller: 'Cooler.Controllers.ExtController<Insigma.Business.ConsumerApi.Prospect>' },
		ProspectDetail: {
			Controller: 'Cooler.Controllers.ExtController<Insigma.Business.ConsumerApi.ProspectDetail>',
			Filters: [{ Parameter: 'ProspectId', Type: 'Int' }]
		},
		Opportunity: {
			Controller: 'Cooler.Controllers.ExtController<Insigma.Business.ConsumerApi.Opportunity>',
			Filters: [{ Parameter: 'SurveyId', Type: 'Int' }]
		},
		SurveyTag: { Controller: 'Cooler.Controllers.SurveyTag' },
		SalesReps: { Controller: 'Cooler.Controllers.SalesReps' },
		SupervisorSalesRep: { Controller: 'Cooler.Controllers.SupervisorSalesRep' },
		LocationClassification: null,
		ProductOutOfStock: { Controller: 'ProductOutOfStock' },
		OutletSurvey: { Controller: 'OutletSurvey' },
		BMXReport: { Controller: 'Cooler.Controllers.Reports.BMXReport' },
		AssetPurityProductRowWise: { Controller: 'AssetPurityProductRowWise' },
		SmartDeviceAdvertiseEvent: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' },
				{ Parameter: 'AssetId', Type: 'Int' },
				{ Parameter: 'ImberaHubId', Type: 'Int' }
			]
		},
		ProximityAPI: { Controller: 'ProximityAPI' },
		IotData: { Controller: 'IotData' },
		MarketDay: { Controller: 'Cooler.Controllers.ExtController<Insigma.Business.ConsumerApi.MarketDay>' },
		SalesOrder: null,
		SalesOrderDetail: {
			Controller: 'Cooler.Controllers.ExtController<Insigma.Business.SalesOrderDetail>',
			Filters: [{ Parameter: 'SalesOrderId', Type: 'Int' }]
		},

		ClientBeaconConfiguration: {
			Controller: 'Cooler.Controllers.ClientBeaconConfiguration',
			Filters: [{ Parameter: 'ClientBeaconConfigId', Type: 'Int' }]
		},
		ClientBeaconConfigDetail: {
			Controller: 'Cooler.Controllers.ClientBeaconConfigDetail',
			Filters: [{ Parameter: 'ClientBeaconConfigDetailId', Type: 'Int' }]
		},
		SubTradeChannelType: null,
		SalesOrganization: null,
		SalesOffice: null,
		SalesGroup: null,
		SalesTerritory: null,
		TerritoryDetail: null,
		SmartDeviceTypeConfiguration: null,
		SmartDeviceEventTypeRecord: {
			Controller: 'Cooler.Controllers.SQLLogController<Insigma.Business.SmartDeviceEventTypeRecord>',
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' }
			]
		},
		SmartDeviceAlarmTypeRecord: {
			Controller: 'Cooler.Controllers.SQLLogController<Insigma.Business.SmartDeviceAlarmTypeRecord>',
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' }
			]
		},
		SmartDeviceDiagnosticMessage: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' }
			]
		},
		SmartDeviceStockSensorData: {
			Controller: "Cooler.Controllers.SQLLogController<{BusinessObject}>",
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' },
				{ Parameter: 'AssetId', Type: 'Int' }
			]
		},
		DeviceReport: { Controller: 'Cooler.Controllers.Reports.DeviceReport' },
		"SyncData": {
			Controller: "Cooler.Controllers.API.SyncData"
		},
		ProductGroup: null,
		AssetTypeCapacity: null,
		DataSummaryReport: null,
		DoorSummaryReport: { Controller: 'Cooler.Controllers.Reports.DoorSummaryReport' },
		DoorAndTempLastReceivedReport: { Controller: 'Cooler.Controllers.Reports.DoorAndTempLastReceivedReport' },
		DataGapAnalysisReport: { Controller: 'Cooler.Controllers.Reports.DataGapAnalysisReport' },
		GroupingType: null,
		GroupingCode: null,
		SalesHierarchy: null,
		SalesHierarchyTreeView: { Controller: 'Cooler.Controllers.SalesHierarchyTreeView' },
		TemperatureAndLightReport: { Controller: 'Cooler.Controllers.Reports.TemperatureAndLightReport' },
		DevicesWithNoDataReport: { Controller: 'Cooler.Controllers.Reports.DevicesWithNoDataReport' },
		DevicesWithRemovedAssociationReport: { Controller: 'Cooler.Controllers.Reports.DevicesWithRemovedAssociationReport' },
		"mediaApi": {
			Controller: "Cooler.Controllers.Consumer.Media"
		},
		TemperatureAndLightReportDetail: null,
		DoorSummaryReportDetail: null,
		ImageRecognitionContentStatus: null,
		"ProductionToolDeviceRegistration": {
			Controller: "Cooler.Controllers.API.ProductionToolDeviceRegistration"
		},
		DeviceMajorMinorBulkUpdateReport: { Controller: 'Cooler.Controllers.DeviceMajorMinorBulkUpdateReport' },
		DataUploadReport: { Controller: 'Cooler.Controllers.Reports.DataUploadReport' },
		UserLocation: {
			Controller: null,
			Filters: [
				{ Parameter: 'UserId', Type: 'Int' }
			]
		},
		ProductOnboarding: {
			Controller: null,
			Filters: [
				{ Parameter: 'ProductId', Type: 'Int' }
			]
		},
		WaterMeter: { Controller: "Cooler.Controllers.WaterMeter" },
		AlertPurityImage: { Controller: "Cooler.Controllers.AlertPurityImage" },
		RemoteCommandReport: { Controller: "Cooler.Controllers.RemoteCommandReport" },
		PackTypeReport: { Controller: 'PackTypeReport' },
		RejectedPictureReport: { Controller: "Cooler.Controllers.RejectedPictureReport" },
		SolarDoorOpening: null,
		BatteryAnalysisReport: null,
		"iFSA": {
			Controller: "Cooler.Controllers.API.IFSAData"
		},
		"SESImage": {
			Controller: "Cooler.Controllers.API.SESImage"
		},
		"SmartDeviceTransaction": {
			Controller: "Cooler.Controllers.API.SmartDeviceTransaction"
		},
		SmartHubFirmwareUpgrade: null,
		RetailerReport: null,
		ConsolidatedClientReport: { Controller: 'Cooler.Controllers.Reports.ConsolidatedClientReport' },
		HarborLoadTestData: { Controller: 'Cooler.Controllers.API.HarborLoadTestData' },
		PowerStatusReport: { Controller: 'Cooler.Controllers.Reports.PowerStatusReport' },
		HealthDoorVisionSummaryReport: { Controller: 'Cooler.Controllers.Reports.HealthDoorVisionSummaryReport' },
		AssetDetailsReport: { Controller: 'Cooler.Controllers.Reports.AssetDetailsReport' },
		ChangeLogReport: null,
		FallenMagnetsReport: null,
		SmartDevicePowerEventWellington: null,
		SmartDeviceDoorOpenTimeOut: null,
		LocalizationFile: null,
		BatteryLevelReport: { Controller: 'Cooler.Controllers.Reports.BatteryLevelReport' },
		BatteryLevelReportByCountry: { Controller: 'Cooler.Controllers.Reports.BatteryLevelReportByCountry' },
		BatteryReportByDevice: null,
		PowerSavingCommandsReport: null,
		MDImportStatusReport: null,
		ExceptionHandler: { Controller: "Cooler.Controllers.ExceptionHandler" },
		ImageSizeReducer: { Controller: "Cooler.Controllers.ImageSizeReducer" },
		BatteryLevelByFWVersion: { Controller: 'Cooler.Controllers.Reports.BatteryLevelByFWVersion' },
		IFSAAPIReport: null,
		BeaconAPIReport: null,
		DataCheckReport: null,
		DataCheckReportDuplicate: null,
		RemovingAssociationsReport: { Controller: "Cooler.Controllers.RemovingAssociationsReport" },
		AssetLocationReport: { Controller: 'Cooler.Controllers.Reports.AssetLocationReport' },
		PowerSavingCommandReportByDevice: { Controller: 'Cooler.Controllers.Reports.PowerSavingCommandReportByDevice' },
		AssetTypeImage: {
			Controller: 'Cooler.Controllers.AssetTypeImage',
			Filters: [
				{ Parameter: 'AssetTypeId', Type: 'Int' }
			]
		},
		SmartDeviceWifiLocation: {
			Controller: 'Cooler.Controllers.SQLLogController<Insigma.Business.SmartDeviceWifiLocation>',
			Filters: [
				{ Parameter: 'GatewayId', Type: 'Int' },
				{ Parameter: 'SmartDeviceId', Type: 'Int' }
			]
		},
		AlternativeInstallReport: { Controller: 'Cooler.Controllers.Reports.AlternativeInstallReport' },
		EddystonePromotionHistory: null,
		InstalledAndNotInstalledReport: { Controller: 'Cooler.Controllers.Reports.InstalledAndNotInstalledReport' },
		NumberOfDevicesUploadingData: { Controller: 'Cooler.Controllers.Reports.NumberOfDevicesUploadingData' },
		ClientBaseMenu: null,
		EddystonePromotionRedemptionHistory: null,
		ThirdPartyPromotion: { Controller: 'Cooler.Controllers.ThirdPartyPromotion' },
		ThirdPartyPromotionLocation: {
			Controller: 'Cooler.Controllers.ThirdPartyPromotionLocation',
			Filters: [
				{ Parameter: 'ThirdPartyPromotionId', Type: 'Int' },
				{ Parameter: 'LocationId', Type: 'Int' }
			]
		},
		ThirdPartyApp: null,
		VendingMachineData: null,
		ThirdPartyPromotionHistory: { Controller: 'Cooler.Controllers.ThirdPartyPromotionHistory' },
		ScoreCardReport: null,
		ThirdPartyByAppUID: { Controller: 'Cooler.Controllers.Reports.ThirdPartyByAppUID' },
		ThirdPartyByOutlet: null,
		InstallReportFrigoVsClient: { Controller: 'Cooler.Controllers.Reports.InstallReportFrigoVsClient' },
		FactoryRemoveAssociation: { Controller: "Cooler.Controllers.FactoryRemoveAssociation" },
		AssetSummarizationReport: { Controller: 'Cooler.Controllers.Reports.AssetSummarizationReport' },
		MDImportStatusReportAssetDetail: null,
		MDImportStatusReportLocationDetail: null,
		MDImportStatusReportUserDetail: null,
		ThirdPartyPromotionOutlets: { Controller: 'Cooler.Controllers.ThirdPartyPromotionOutlets' },
		PromoCodeLog: { Controller: 'Cooler.Controllers.PromoCodeLog' },
		ThirdPartyPromotionAllLocation: null,
		SmartDeviceFirmwareVersionHistory: null,
		ShakeInfoAPI: { Controller: 'Cooler.Controllers.API.ShakeInfoAPI' },
		ShakeInfoAPIReport: null,
		AlertReport: null,
		ThirdPartyOutletByHoursReport: { Controller: 'Cooler.Controllers.Reports.ThirdPartyOutletByHoursReport' },
		AssetInstallationHistory: { Controller: 'Cooler.Controllers.AssetInstallationHistory' },
		ChangeLoginPasword: { Controller: 'Cooler.Controllers.ChangeLoginPasword' },

		ReportForAlerts: null,
		DashboardLogin: null,
		VisionPictureConfiguration: null,
		TemperatureReport: { Controller: 'Cooler.Controllers.TemperatureReport' },
		ADFReport: null,
		OutletsToUser: {
			Controller: 'Cooler.Controllers.OutletsToUser',
			Filters: [
				{ Parameter: 'UserId', Type: 'Int' }
			]
		},
		SurveyPurityImage: {
			Controller: 'SurveyPurityImage',
			Filters: [{ Parameter: 'SurveyId', Type: 'Int' }]
		},
		AssetPurityAccuracy: null,
		SKUCoverage: null,
		DownloadCoolerImage: {
			Controller: 'Cooler.Controllers.DownloadCoolerImage'
		},
		SmartDeviceCommandBulkInsert: {
			Controller: 'Cooler.Controllers.SmartDeviceCommandBulkInsert',
			Filters: [{ Parameter: 'SmartDeviceTypeId', Type: 'Int' }]
		},
		IRAppRewardApproval: { Controller: "Cooler.Controllers.IRAppRewardApproval" },
		RDCustomerMapping: null,
		AssetPurityImage: { Controller: 'Cooler.Controllers.AssetPurityImage' },
		BulkCommandByExcel: {
			Controller: 'Cooler.Controllers.BulkCommandByExcel',
			Filters: [
				{ Parameter: 'SmartDeviceId', Type: 'Int' }
			]
		}
	},
	LookupType: "Cooler.LookupType",
	LookupList: "Cooler.Business.LookupList",
	BusinessLibraryNamespace: "Insigma.Business.{0}",
	BaseController: "Cooler.Controllers.ExtController<{BusinessObject}>",
	BusinessObjectType: "Insigma.BusinessObjectType"
}
