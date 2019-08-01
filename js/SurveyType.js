Cooler.SurveyType = new Cooler.Form({
	keyColumn: 'SurveyTypeId',

	captionColumn: null,

	controller: 'SurveyType',

	title: 'Survey Setup',

	securityModule: 'SurveySetup',

	comboTypes: ['Category', 'RegionLanguage'],

	comboStores: {
		Category: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		RegionLanguage: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'SurveyTypeId', type: 'int' },
			{ dataIndex: 'CategoryId', type: 'int' },
			{ header: 'Name', dataIndex: 'SurveyTypeName', width: 150, type: 'string' },
			{ header: 'Type', dataIndex: 'TypeName', type: 'string', width: 150 },
			{ header: 'Client', dataIndex: 'Client', type: 'string', width: 150 },
			{ header: 'Market', dataIndex: 'MarketsName', type: 'string', width: 250 },
			{ header: 'Trade Channel', dataIndex: 'ChannelName', type: 'string', width: 250 },
			//{ header: 'For Employee', dataIndex: 'ForEmployee', type: 'bool', width: 100, renderer: ExtHelper.renderer.Boolean }
			{ header: 'Category', dataIndex: 'Category', type: 'string' },
			{ header: 'Default', dataIndex: 'IsDefault', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Language', dataIndex: 'Language', type: 'string' },
			{ header: 'Active', dataIndex: 'IsActive', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		];
	},
	configureListTab: function (config) {
		var grid = this.grid;
		if (DA.Security.info.IsAdmin) {
			grid.getTopToolbar().splice(0, 0, { text: 'Copy Survey', iconCls: 'new', handler: this.onCopy, scope: this, tooltip: "It will copy the global Feedback/Prospect to the client" });
		}
	},

	onCopy: function () {
		Ext.Msg.confirm('Copy', 'Are you sure to assign the Feedback/Prospect to the client who don\'t have global(default)', function (btn) {
			if (btn == 'yes') {
				if (!this.mask) {
					var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
					this.mask = mask;
				}
				this.mask.show();
				Ext.Ajax.request({
					url: EH.BuildUrl('SurveyType'),
					params: { action: 'copySurvey' },
					success: this.onCopySuccess,
					failure: this.onCopyFailure,
					scope: this
				});
			}
		}, this);
	},

	onCopySuccess: function (response, success) {
		this.mask.hide();
		Ext.Msg.alert('Success', Ext.decode(response.responseText).data);
		this.grid.store.reload();
	},

	onCopyFailure: function () {
		this.mask.hide();
		Ext.Msg.alert('Error', ' Copy failed..Try again.');
	},

	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;

		var surveyCategoryCombo = DA.combo.create({ fieldLabel: 'Type', hiddenName: 'TypeId', baseParams: { comboType: 'SurveyCategory' }, listWidth: 220, controller: "Combo", allowBlank: false });
		this.surveyCategoryCombo = surveyCategoryCombo;
		this.surveyCategoryCombo.on('select', this.onSurveyCategorySelect, this);

		var marketComboForStore = DA.combo.create({ baseParams: { comboType: 'Market', limit: 0 }, controller: "Combo" });
		this.marketComboForStore = marketComboForStore;

		var locationTypeComboForStore = DA.combo.create({ baseParams: { comboType: 'LocationType', limit: 0 }, controller: "Combo" });
		this.locationTypeComboForStore = locationTypeComboForStore;

		var marketCombo = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			name: 'Markets',
			fieldLabel: 'Market',
			hiddenName: 'Markets',
			displayField: 'DisplayValue',
			store: marketComboForStore.getStore(),
			width: 250,
			allowBlank: true
		});
		this.marketCombo = marketCombo;

		var channelCombo = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Trade Channel',
			hiddenName: 'Channels',
			name: 'Channels',
			displayField: 'DisplayValue',
			store: locationTypeComboForStore.getStore(),
			width: 250,
			allowBlank: true
		});
		this.channelCombo = channelCombo;
		var categoryCombo = ExtHelper.CreateCombo({ fieldLabel: 'Category', name: 'CategoryId', hiddenName: 'CategoryId', store: Cooler.SurveyType.comboStores.Category, mode: 'local', allowBlank: false });
		this.categoryCombo = categoryCombo;

		var defaultCheckbox = new Ext.form.Checkbox({ fieldLabel: 'Default', name: 'IsDefault' });
		this.defaultCheckbox = defaultCheckbox;
		var defaultCheckboxInfo = new Ext.ux.Image({ height: 10, width: 10, src: "./images/icons/info.png", cls: 'infoImg', listeners: { render: function (field) { new Ext.ToolTip({ target: field.getEl(), html: 'If selected, Return\'s below questions in case no question assigned for the requested Outlet/Client' }); } } });
		var defaultCheckboxPanel = new Ext.Panel({
			layout: 'table',
			border: false,
			defaults: { border: false, layout: 'form' },
			items: [{ items: defaultCheckbox }, defaultCheckboxInfo]
		});
		this.defaultCheckboxPanel = defaultCheckboxPanel;
		var clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', name: 'ClientId', hiddenName: 'ClientId', mode: 'local', store: Cooler.comboStores.Client, width: 150 });
		this.clientCombo = clientCombo;

		var activeCheckbox = new Ext.form.Checkbox({ fieldLabel: 'Active', name: 'IsActive', type: 'bool' });
		this.activeCheckbox = activeCheckbox;
		var activeCheckboxInfo = new Ext.ux.Image({ height: 10, width: 10, src: "./images/icons/info.png", cls: 'infoImg', listeners: { render: function (field) { new Ext.ToolTip({ target: field.getEl(), html: 'If selected, Then only user will get below questions' }); } } });
		var activeCheckboxPanel = new Ext.Panel({
			layout: 'table',
			border: false,
			defaults: { border: false, layout: 'form' },
			items: [{ items: activeCheckbox }, activeCheckboxInfo]
		});
		this.activeCheckboxPanel = activeCheckboxPanel;
		var col1 = {
			columnWidth: .5,
			defaults: { width: 220, labelWidth: 102 },
			items: [
				{ fieldLabel: 'Name', name: 'SurveyTypeName', xtype: 'textfield', maxLength: 50, allowBlank: false },
				surveyCategoryCombo,
				marketCombo,
				defaultCheckboxPanel,
				activeCheckboxPanel
			]
		};

		var col2 = {
			columnWidth: .5,
			defaults: { width: 220, labelWidth: 102 },
			items: [
				channelCombo,
				clientCombo,
				categoryCombo,
				DA.combo.create({ fieldLabel: 'Language', name: 'LanguageCode', hiddenName: 'LanguageCode', valueField: 'CustomStringValue', displayField: 'DisplayValue', store: this.comboStores.RegionLanguage, allowBlank: false })
			]
		};
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			items: [col1, col2]
		});
		return config;
	},

	CreateFormPanel: function (config) {
		var surveyQuestionGrid = Cooler.SurveyQuestion.createGrid({ title: 'Survey Question', height: 300, editable: false, disabled: true });
		this.surveyQuestionGrid = surveyQuestionGrid;

		var grid = [surveyQuestionGrid];
		this.childGrids = grid;
		this.childModules = [Cooler.SurveyQuestion];
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			enableTabScroll: true,
			activeTab: 0,
			defaults: {
				layout: 'fit',
				border: 'false'
			},
			layoutOnTabChange: true,
			items: [surveyQuestionGrid]
		});
		Ext.apply(config, {
			region: 'north',
			height: 215
		});
		this.formPanel = new Ext.FormPanel(config);

		this.on('dataLoaded', this.onDataLoaded, this);

		this.on('beforeLoad', this.onBeforeLoad, this);

		this.on('beforeSave', this.onBeforeSave, this);
		this.formPanel.on('beforeException', this.onBeforeException, this);

		Cooler.SurveyQuestion.on('dataLoaded', this.onSurveyQuestionLoaded, this);

		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			width: 850,
			height: 650,
			items: [this.formPanel, tabPanel]
		});
	},

	onSurveyCategorySelect: function (combo, record, index) {
		var value = combo.getValue();
		//Checking either value is blank(in case of new form) or SurveyType is Feedback
		var isVisible = (Ext.isEmpty(value) || Cooler.Enums.SurveyType.Feedback == value);
		if (!isVisible && this.doChange) {
			this.channelCombo.reset();
			this.marketCombo.reset();
			this.defaultCheckbox.reset();
		}
		else {
			this.doChange = true;
		}
		this.channelCombo.setFieldVisible(isVisible);
		this.marketCombo.setFieldVisible(isVisible);
		this.defaultCheckboxPanel.setVisible(isVisible);

		//Set Employee as category in case of Prospect
		if (value == Cooler.Enums.SurveyType.Prospect) {
			this.categoryCombo.setValue(Cooler.Enums.Category.Employee);
		}
		this.categoryCombo.setDisabled(!isVisible);
	},

	onSurveyQuestionLoaded: function (form) {
		form.showFormArgs.surveyTypeId = this.surveyTypeId;
		form.showFormArgs.categoryId = this.surveyCategoryCombo.getValue();
	},

	onBeforeLoad: function (param) {
		this.marketComboForStore.getStore().load();
		this.locationTypeComboForStore.getStore().load();
	},

	onDataLoaded: function (surveyTypeForm, data) {
		this.surveyQuestionGrid.setDisabled(true);
		var data = data.data; 
		this.surveyTypeId = data.Id;
		var isDefault = data.IsDefault;
		if (DA.Security.info.IsAdmin) {
			isDefault = false;
		}
		surveyTypeForm.formButtons.del.setDisabled(isDefault);
		this.defaultCheckbox.setDisabled(isDefault);
		this.surveyQuestionGrid.store.baseParams.SurveyTypeId = this.surveyTypeId;
		if (this.surveyTypeId != 0) {
			this.surveyQuestionGrid.setDisabled(false);
		}
		this.clientCombo.setDisabled(parseInt(DA.Security.info.Tags.ClientId) != 0);
		this.doChange = false;
		this.isDefault = data.IsDefault;
		this.oldClientId = data.ClientId;
	},

	onBeforeSave: function () {
		var clientCombo = this.clientCombo;
		clientCombo.enable();
		var clientId = clientCombo.getValue();
		if (this.surveyCategoryCombo.getValue() == Cooler.Enums.SurveyType.Prospect && parseInt(DA.Security.info.Tags.ClientId) == 0 && (this.oldClientId == 0 || clientId != this.oldClientId)) {
			this.defaultCheckbox.setValue(Ext.isEmpty(clientId));
		}
		this.categoryCombo.enable();
	},

	//If exception comes we again set ClientCombo disable in case of client 
	onBeforeException: function () {
		this.clientCombo.setDisabled(parseInt(DA.Security.info.Tags.ClientId) != 0);
		this.categoryCombo.setDisabled(this.surveyCategoryCombo.getValue() == Cooler.Enums.SurveyType.Prospect);
		if (this.surveyCategoryCombo.getValue() == Cooler.Enums.SurveyType.Prospect && parseInt(DA.Security.info.Tags.ClientId) == 0) {
			this.defaultCheckbox.setValue(this.isDefault);
		}
	}
});