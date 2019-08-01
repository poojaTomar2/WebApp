Cooler.ThirdPartyByOutlet = Ext.extend(Cooler.Form, {

	keyColumn: 'LocationId',

	title: 'Third Party By Outlet',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'ThirdPartyAggregatedStatsOutletReport',
	constructor: function (config) {
		Cooler.ThirdPartyByOutlet.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'LocationId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	ShowList: function () {
		DCPLApp.AddTab(this.createFilterPanel());
	},

	createFilterPanel: function () {
		if (!this.panel) {
			var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
			var limitCountryFilter = DA.Security.info.Tags.LimitCountry;
			var defaultValue = '';
			if (limitCountryFilter != 1) {
				defaultValue = 'All';
			}
			var submitButton = new Ext.Button({ text: 'Show', handler: this.onShowButtonClick, scope: this });
			var promotionNameCombo = DA.combo.create({ fieldLabel: 'Promotion Name', name: 'ThirdPartyPromotionId', width: 180, hiddenName: 'ThirdPartyPromotionId', controller: 'combo', baseParams: { comboType: 'ThirdPartyPromotionName' }, listWidth: 250, disabled: true });
			var appNameCombo = DA.combo.create({ fieldLabel: 'Application', itemId: 'appNameCombo', name: 'ThirdPartyAppId', width: 180, hiddenName: 'ThirdPartyAppId', controller: 'combo', listWidth: 250, baseParams: { comboType: 'ThirdPartyAppName' }, allowBlank: false });
			this.appNameCombo = appNameCombo;
			this.promotionNameCombo = promotionNameCombo;
			appNameCombo.on('select', function (combo, newValue) {
				this.getPromotionNameValue(newValue);
			}, this);
			var clientCombo = DA.combo.create({ fieldLabel: 'Client', name: 'ClientId', hiddenName: 'ClientId', width: 180, controller: 'combo', baseParams: { comboType: 'Client' }, listWidth: 250, disabled: disableFieldsOnClientId });
			var countryCombo = DA.combo.create({
				fieldLabel: 'Country',
				name: 'CountryId',
				width: 180,
				hiddenName: 'CountryId',
				controller: 'combo',
				baseParams: { comboType: 'CountryForThirdParty' },
				listWidth: 250,
				value: defaultValue

			});
			var startDate = new Ext.form.DateField({ name: 'PeriodOneFromDate', fieldLabel: 'Start Date', width: 180, value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var endDate = new Ext.form.DateField({ name: 'PeriodOneToDate', fieldLabel: 'End Date', width: 180, value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var platformStore = [[1, 'All'], [2, 'android'], [3, 'iOS']];
			var platformCombo = DA.combo.create({ fieldLabel: 'Platform ', value: 1, name: 'PlatformId', hiddenName: 'PlatformId', store: platformStore, width: 180 });
			this.platformCombo = platformCombo;
			var detectionFrequencyStore = [[1, 'Daily'], [2, 'Weekly'], [3, 'Monthly']];
			var detectionFrequencyCombo = DA.combo.create({ fieldLabel: 'Interval', value: 1, name: 'DetectionFrequencyId', hiddenName: 'DetectionFrequencyId', store: detectionFrequencyStore, width: 180 });
			this.detectionFrequencyCombo = detectionFrequencyCombo;
			//platformCombo.on('select', function (combo, newValue) {
			//	this.getplatformComboValue(newValue)
			//}, this);
			this.promotionName = promotionNameCombo;
			this.applicationName = appNameCombo;
			this.clientName = clientCombo;
			this.countryName = countryCombo;
			this.startDate = startDate;
			this.endDate = endDate;

			var reportFilter = {
				xtype: 'fieldset',
				bodyStyle: 'padding: 5px;',
				height: window.innerHeight - 420,
				items: [appNameCombo, promotionNameCombo, clientCombo, countryCombo, platformCombo, detectionFrequencyCombo, startDate, endDate, submitButton]
			};

			var filterPanel = new Ext.Panel({
				layout: 'form',
				region: 'center',
				height: window.innerHeight - 420,
				resizable: true,
				defaults: { border: false, defaults: { labelWidth: 80 } },
				items: [reportFilter]
			});

			var thirdPartyByOutletResultGrid = Cooler.ThirPartyByOutletResult.createGrid({
				title: 'Result',
				editable: false,
				resizable: true,
				region: 'south',
				split: true,
				tbar: [],
				showDefaultButtons: true,
				height: (window.innerHeight - 40) / 2
			});
			this.thirdPartyByOutletResultGrid = thirdPartyByOutletResultGrid;

			var resultPanel = new Ext.Panel({
				title: 'Third Party Aggregated Stats By Outlet',
				region: 'east',
				layout: 'border',
				closable: true,
				items: [filterPanel, thirdPartyByOutletResultGrid],
				id: 'ThirdPartybyOutlet'
			});
			this.resultPanel = resultPanel;
		}
		if (disableFieldsOnClientId) {
			clientCombo.setValue(DA.Security.info.Tags.ClientName);
		}
		return this.resultPanel;
	},
	stringToDate: function (dateStr) {
		dateStr = dateStr.toString(); //force conversion
		var parts = dateStr.split("-");
		parts = dateStr.split("/");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	},
	datediffindays: function (reportFromDate, reportToDate) {
		from = new Date(reportFromDate);
		to = new Date(reportToDate);
		return Math.floor((Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / (1000 * 60 * 60 * 24));
	},
	onShowButtonClick: function (button) {
		if (this.countryName.getValue() == 'All') {
			this.countryName.value = 0;
		}
		if (this.applicationName.getValue() == '') {
			Ext.Msg.alert('Error', 'Please Select Application');
		}
		var sDate = this.stringToDate(this.startDate.value);
		var eDate = this.stringToDate(this.endDate.value);
		var periodDiffInDays = this.datediffindays(sDate, eDate);
		if (periodDiffInDays > 31) {
			Ext.Msg.alert('Alert', 'Period is not more than one months');
			return;
		}
		this.thirdPartyByOutletResultGrid.store.baseParams.ThirdPartyPromotionId = this.promotionName.getValue();
		this.thirdPartyByOutletResultGrid.store.baseParams.ClientId = this.clientName.getValue();
		this.thirdPartyByOutletResultGrid.store.baseParams.ApplicationId = this.applicationName.getValue();
		this.thirdPartyByOutletResultGrid.store.baseParams.CountryId = this.countryName.getValue();
		this.thirdPartyByOutletResultGrid.store.baseParams.StartDate = this.startDate.getValue();
		this.thirdPartyByOutletResultGrid.store.baseParams.EndDate = this.endDate.getValue();
		this.thirdPartyByOutletResultGrid.store.baseParams.PlatformId = this.platformCombo.getValue();
		this.thirdPartyByOutletResultGrid.store.baseParams.IntervalId = this.detectionFrequencyCombo.getValue();
		this.thirdPartyByOutletResultGrid.store.load();
	},
	getPromotionNameValue: function (record) {
		this.promotionNameCombo.enable();
		var promotionNameComboStore = this.promotionNameCombo.store;
		if (promotionNameComboStore) {
			promotionNameComboStore.baseParams.thirdPartyAppId = record.get('LookupId');
		}
	}
});
Cooler.ThirPartyByOutletResult = new Cooler.Form({
	controller: 'ThirdPartyByOutlet',

	listTitle: 'Outlet',
	resizable: true,
	disableAdd: true,

	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'LocationId' } }
	},

	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'LocationId' },
			{ header: 'Outlet Code', type: 'string', dataIndex: 'OutletCode', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'OutletName', width: 150 },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 150 },
			{ header: 'Customer Tier', type: 'string', dataIndex: 'CustomerTier', width: 150 },
			{ header: 'Customer Tier Code', type: 'string', dataIndex: 'CustomerTierCode', width: 150, hidden: true },
			{ header: 'Trade Channel', type: 'string', dataIndex: 'TradeChannel', width: 150 },
			{ header: 'Trade Channel Code', type: 'string', dataIndex: 'TradeChannelCode', width: 150, hidden: true },
			{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
			{ header: 'Sales Group Code', type: 'string', dataIndex: 'SalesGroupCode', width: 150, hidden: true },
			{ header: 'Sales Office Code', type: 'string', dataIndex: 'SalesOfficeCode', width: 150, hidden: true },
			{ header: 'Total Unique Devices', type: 'int', dataIndex: 'TotalUniqueDevice', width: 150 },
			{ header: 'Total Messages Opened', type: 'int', dataIndex: 'PushNotificationCount', width: 150 },
			{ header: 'Total Messages Sent', type: 'int', dataIndex: 'MessageSentCount', width: 150 },
			{ header: 'Total Number Beacon Detections', type: 'int', dataIndex: 'TotalUniqueDeviceDetection', width: 150 },
			{ header: 'PromoCodes', type: 'int', dataIndex: 'PromoCodes', width: 150 },
			{ header: 'Conversion(%)', type: 'float', dataIndex: 'Conversion', width: 150 }
		];
	},

});
Cooler.ThirdPartyByOutlet = new Cooler.ThirdPartyByOutlet({ uniqueId: 'ThirdPartyByOutlet' });