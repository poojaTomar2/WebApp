Cooler.Consumer = new Cooler.Form({
	keyColumn: 'ConsumerId',
	captionColumn: 'FirstName',
	controller: 'ConsumerInfo',
	title: 'Smart Rewards User',
	securityModule: 'SmartRewardsUser',
	logoUrl: './FileServer/ConsumerProfile/',
	comboTypes: ['Category'],

	comboStores: {
		Category: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		RegionLanguage: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'ConsumerId', type: 'int' },
			{ dataIndex: 'AccountVerificationTokenGuid', type: 'string' },
			{ dataIndex: 'CountryId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ header: 'Primary Email', dataIndex: 'PrimaryEmail', width: 150, type: 'string' },
			{ header: 'First Name', dataIndex: 'FirstName', type: 'string' },
			{ header: 'Last Name', dataIndex: 'LastName', type: 'string' },
			{ header: 'User Name', dataIndex: 'Username', width: 150, type: 'string' },
			{ header: 'Contact Number', dataIndex: 'ContactNumber', width: 100, type: 'string' },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', width: 150 },
			{ header: 'Country', dataIndex: 'Country', type: 'string', width: 100 },
			{ header: 'Category', dataIndex: 'Category', type: 'string' },
			{ header: 'Language', dataIndex: 'Language', type: 'string' },
			{ header: 'Reward Balance', dataIndex: 'Balance', type: 'float', width: 100 },
			{ header: 'Last Login', dataIndex: 'LastUsed', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		];
	},
	onCategorySelect: function (combo, record, index) {
		var isRetailer = false;
		if (combo.fieldLabel == 'Category' && record && record.data.LookupId == Cooler.Enums.Category.Retailer) {
			isRetailer = true;
		}
		else {
			isRetailer = false;
		}
		this.clientCombo.allowBlank = !isRetailer;
		this.clientCombo.validate();
	},
	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var uploadImage = new Ext.form.FileUploadField({
			fieldLabel: 'Image Upload',
			width: 250,
			name: 'selectFile'
		});
		var logoField = new Ext.ux.Image({ height: 120, src: "" });
		var longitude = new Ext.form.NumberField({ fieldLabel: 'Longitude', name: 'Longitude', maxLength: 11, allowBlank: false, decimalPrecision: 6, maxValue: Cooler.Enums.ValidLatLong.Longitude, minValue: -Cooler.Enums.ValidLatLong.Longitude });
		var latitude = new Ext.form.NumberField({ fieldLabel: 'Latitude', name: 'Latitude', maxLength: 11, allowBlank: false, decimalPrecision: 6, maxValue: Cooler.Enums.ValidLatLong.Latitude, minValue: -Cooler.Enums.ValidLatLong.Latitude });
		var ipAddress = new Ext.form.TextField({ fieldLabel: 'IP Address', name: 'IpAddress' });
		var activateButton = new Ext.Button({ text: 'Activate', handler: this.onActivate, scope: this });
		var activateMailButton = new Ext.Button({ text: 'Activation email', handler: this.onActivationMail, scope: this });
		var category = new ExtHelper.CreateCombo({ fieldLabel: 'Category', name: 'CategoryId', hiddenName: 'CategoryId', store: Cooler.SurveyType.comboStores.Category, mode: 'local', allowBlank: false });
		var clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' }, disabled: disableFieldsOnClientId });
		config.tbar.push(activateButton, activateMailButton);
		this.activateButton = activateButton;
		this.activateMailButton = activateMailButton
		this.category = category;
		this.clientCombo = clientCombo;
		category.on('select', this.onCategorySelect, this);
		var col1 = {
			columnWidth: .5,
			labelWidth: 100,
			defaults: {
				width: 165
			},
			items: [
				{ fieldLabel: 'User Name', name: 'UserName', xtype: 'textfield', maxLength: 50, value: String.Empty },
				{ fieldLabel: 'First Name', name: 'FirstName', xtype: 'textfield', maxLength: 50, allowBlank: false },
				{ fieldLabel: 'Last Name', name: 'LastName', xtype: 'textfield', maxLength: 50, allowBlank: false },
				{ fieldLabel: 'Password', name: 'Password', xtype: 'textfield', inputType: 'password', maxLength: 50, allowBlank: false },
				{ fieldLabel: 'Primary Email', name: 'PrimaryEmail', xtype: 'textfield', vtype: 'email', maxLength: 50, allowBlank: false },
				{ fieldLabel: 'Contact Number', name: 'ContactNumber', xtype: 'textfield', vtype: 'phone', maxLength: 15 },
				uploadImage,
				category,
				clientCombo,
				DA.combo.create({ fieldLabel: 'Country', name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', baseParams: { comboType: 'Country' }, listWidth: 220 }),
				DA.combo.create({ fieldLabel: 'Language', name: 'LanguageCode', hiddenName: 'LanguageCode', valueField: 'CustomStringValue', displayField: 'DisplayValue', store: this.comboStores.RegionLanguage, allowBlank: false })
			]
		};
		var col2 = {
			columnWidth: .5,
			defaults: {
				width: 165
			},
			items: [
				logoField,
				longitude,
				latitude,
				ipAddress,
				{ fieldLabel: 'Custom Values', name: 'CustomValues', xtype: 'textarea', listeners: { render: function (field) { new Ext.ToolTip({ target: field.getEl(), html: "Allowed Values:<br> Location : [Lat,Long] <br> e.g: Location :[28.6139,77.2190]" }); } } },
			]
		};
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			labelWidth: 150,
			items: [col1, col2],
			fileUpload: true
		});

		this.logoField = logoField;
		this.uploadImage = uploadImage;

		this.on('dataLoaded', function (consumerForm, data) {
			var record = data.data;
			if (record) {
				Cooler.loadThumbnail(this, record, this.logoUrl + "/userProfileNoImage.png");
			}
			this.uploadImage.on('fileselected', Cooler.onFileSelected, this);
		});

		return config;
	},
	CreateFormPanel: function (config) {
		var consumerLoyaltyPointGrid = Cooler.ConsumerLoyaltyPoint.createGrid({ title: 'Loyalty Point', height: 300, region: 'center', editable: false, allowPaging: true });
		var grid = [consumerLoyaltyPointGrid];
		this.childGrids = grid;
		this.childModules = [Cooler.ConsumerLoyaltyPoint];
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			enableTabScroll: true,
			activeTab: 0,
			defaults: {
				layout: 'fit',
				border: 'false'
			},
			layoutOnTabChange: true,
			items: [consumerLoyaltyPointGrid]
		});
		Ext.apply(config, {
			region: 'north',
			height: 275
		});
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			modal: 'false',
			defaults: { border: false },
			height: 500,
			items: [this.formPanel, tabPanel]
		});
		this.on('dataLoaded', function (consumerForm, data) {
			var isAdmin = (DA.Security.IsInRole('Client Admin') || DA.Security.IsInRole('Admin'));
			var isActive = ((data.data.Id == 0) || (data.data.AccountStatus == 4200));
			var isDisabled = true;
			if (isAdmin && !isActive) {
				isDisabled = false;
			}
			this.activateButton.setDisabled(isDisabled);
			//this.activateMailButton.setDisabled(isDisabled);
		});
	},

	onActivate: function (me) {
		var userId = this.activeRecordId;
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		Ext.Ajax.request({
			url: 'Controllers/Consumer.ashx',
			params: { consumerId: userId, action: 'onActivate' },
			success: function (result, request) {
				Ext.Msg.alert('Alert', JSON.parse(result.responseText).msg);
				this.activateButton.setDisabled(true);
				this.mask.hide();
			},
			failure: function (result, request) {
				Ext.Msg.alert('Alert', JSON.parse(result.responseText));
				this.mask.hide();
			},
			scope: this
		});

	},
	onActivationMail: function (me) {
		var userId = this.activeRecordId;
		var clickedData = this.showFormArgs.record.data;
		var accountTokenGuid = clickedData.AccountVerificationTokenGuid;
		var clientId = clickedData.ClientId;
		var countryId = clickedData.CountryId;
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		Ext.Ajax.request({
			url: 'Controllers/Consumer.ashx',
			params: { consumerId: userId, id: accountTokenGuid, action: 'OnResendActivationMail', clientId: clientId, countryId: countryId },
			success: function (result, request) {
				Ext.Msg.alert('Alert', JSON.parse(result.responseText).msg);
				this.mask.hide();
			},
			failure: function (result, request) {
				Ext.Msg.alert('Alert', JSON.parse(result.responseText));
				this.mask.hide();
			},
			scope: this
		});

	}
});

Cooler.ConsumerLoyaltyPoint = new Cooler.Form({
	formTitle: 'Consumer LoyaltyPoint: {0}',
	listTitle: 'Consumer LoyaltyPoint',
	captionColumn: null,
	controller: 'ConsumerLoyaltyPoint',
	disableAdd: true,
	hybridConfig: function () {
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'ConsumerLoyaltyPointId', type: 'int' },
			{ dataIndex: 'ConsumerId', type: 'int' },
			{ header: 'Location', dataIndex: 'LocationName', displayIndex: 'LocationName', width: 300, type: 'string' },
			{ header: 'Reason', dataIndex: 'Reason', displayIndex: 'Reason', width: 90, type: 'string' },
			{ dataIndex: 'EventId', header: 'Event Id', type: 'int' },

			{ header: 'Event Time', dataIndex: 'EventTime', type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Record Uploaded ON', dataIndex: 'EventCreatedOn', type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Note', dataIndex: 'Note', width: 90, type: 'string' },
			{ header: 'Points', dataIndex: 'Points', width: 60, type: 'int', align: 'right' },
			{ header: 'Points Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime }
		];
	}
});