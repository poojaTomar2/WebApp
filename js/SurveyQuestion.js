Cooler.SurveyQuestion = new Cooler.Form({
	keyColumn: 'SurveyQuestionId',

	captionColumn: null,

	controller: 'SurveyQuestion',

	quickSaveController: 'SurveyQuestion',

	title: 'Survey Question',

	securityModule: 'Survey',

	comboTypes: ['QuestionCategory', 'ImageSelect', 'QuestionType', 'ChoiceType', 'SurveyConfig'],

	newListRecordData: { SurveyTypeId: '', QuestionCategoryId: '', ProductIds: '' },

	constructor: function (config) {
		Cooler.SurveyQuestion.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			custom: {
				loadComboTypes: true
			}
		});
	},

	comboStores: {
		QuestionCategory: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		ImageSelect: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		QuestionType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		ChoiceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SurveyConfig: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	hybridConfig: function () {
		var productCombo = new Ext.ux.form.LovCombo({
			valueField: 'LookupId',
			displayField: 'DisplayValue',
			displayFieldTpl: '{DisplayValue}',
			store: Cooler.comboStores.Product,
			mode: 'local',
			width: 250,
			allowBlank: true
		});
		this.productCombo = productCombo;
		return [
			{ dataIndex: 'SurveyQuestionId', type: 'int' },
			{ header: 'Category', dataIndex: 'QuestionCategoryName', type: 'string', width: 80 },
			{ header: 'Question', dataIndex: 'Question', width: 250, type: 'string' },
			//{ header: 'Type', dataIndex: 'QuestionType', type: 'string', width: 100 },
			{ header: 'Number', dataIndex: 'QuestionNumber', type: 'int', width: 60, align: 'right' },
			{ header: 'Yes/No', dataIndex: 'IsYesNoQuestion', type: 'bool', renderer: ExtHelper.renderer.Boolean, width: 50 },
			{ header: 'Options', dataIndex: 'Options', type: 'string', width: 200 },
			{ header: 'Custom Text', dataIndex: 'CustomText', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Survey Tag', dataIndex: 'TagType', type: 'string', width: 100 },
			//{ header: 'Min Length', dataIndex: 'MinLength', type: 'int', align: 'right' },
			//{ header: 'Max Length', dataIndex: 'MaxLength', type: 'int', align: 'right' },
			//{ header: 'Default Value', dataIndex: 'DefaultValue', type: 'string' },
			//{ header: 'Min Value', dataIndex: 'MinValue', type: 'int', align: 'right' },
			//{ header: 'Max Value', dataIndex: 'MaxValue', type: 'int', align: 'right' },
			//{ header: 'Allow Decimal', dataIndex: 'AllowDecimal', type: 'int', align: 'right' },
			//{ header: 'Required', dataIndex: 'Required', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			//{ header: 'RegEx', dataIndex: 'Regex', type: 'string', width: 200 },
			//{ header: 'Additional Text', dataIndex: 'AdditionalText', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			//{ header: 'Additional Text Required', dataIndex: 'AdditionalTextRequired', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			//{ header: 'Image', dataIndex: 'ImageSelect', type: 'string' },
			//{ header: 'Image Required', dataIndex: 'ImageRequired', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Product', dataIndex: 'ProductNames', type: 'string', width: 250},
			{ header: 'Red Score Point', dataIndex: 'RedScorePoint', type: 'int', align: 'right', width: 60 }
		];
	},

	createForm: function (config) {
		var questionTypeCombo = DA.combo.create({ fieldLabel: 'Question Type', hiddenName: 'QuestionTypeId', store: this.comboStores.QuestionType, mode: 'local', allowBlank: false });
		this.questionTypeCombo = questionTypeCombo;

		//var choiceTypeCombo = DA.combo.create({ fieldLabel: 'Choice Type', hiddenName: 'ChoiceTypeId', store: this.comboStores.ChoiceType, mode: 'local' });
		//this.choiceTypeCombo = choiceTypeCombo;

		var productCombo = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			name: 'ProductIds',
			displayField: 'DisplayValue',
			displayFieldTpl: '{DisplayValue}',
			fieldLabel: 'Product',
			hiddenName: 'ProductIds',
			store: Cooler.comboStores.Product,
			mode: 'local',
			allowBlank: true
		});
		this.productCombo = productCombo;
		productCombo.on('change', this.onProductComboChange, this);

		var productImageStore = new Ext.data.Store({ fields: [{ name: 'ProductId', type: 'int' }, { name: 'ProductName', type: 'string' }] });
		this.productImageStore = productImageStore;
		var imageDataViewTpl = new Ext.XTemplate(
		'<tpl for=".">',
		'<div>{[this.renderImage(values)]}</div>',
		'</tpl>', {
			renderImage: function (values) {
				var productId = values.ProductId;
				var productName = values.ProductName;
				var productImages = '';
				var productImageName = productId + '.png';
				productImages += '<div class="planogram-product planogram-product-border" >' +
					'<img src="./thumbnail.ashx?imagePath=products/Thumbnails/' + productImageName + '&v=' + new Date().getTime() + '"></img>' +
					'<div class="product-name">' + productName + '</div>' +
				'</div>';
				return '<div>' + productImages + '</div>';
			}
		}
		);
		var imageDataView = new Ext.DataView({
			tpl: imageDataViewTpl,
			store: productImageStore,
			emptyText: 'No images to display',
			itemSelector: 'div.planogram-product'
		});
		this.imageDataView = imageDataView;

		//var additionalText = new Ext.form.Checkbox({ fieldLabel: 'Additional Text', name: 'AdditionalText' });
		//this.additionalText = additionalText;

		//var additionalTextRequired = new Ext.form.Checkbox({ fieldLabel: 'Additional Text Required', name: 'AdditionalTextRequired' });
		//this.additionalTextRequired = additionalTextRequired;

		//var imageCombo = DA.combo.create({ fieldLabel: 'Image', hiddenName: 'Image', store: this.comboStores.ImageSelect, mode: 'local' });
		//this.imageCombo = imageCombo;

		var questionCategoryCombo = DA.combo.create({ fieldLabel: 'Question Category', hiddenName: 'QuestionCategoryId', store: this.comboStores.QuestionCategory, mode: 'local', allowBlank: false });
		this.questionCategoryCombo = questionCategoryCombo;
		var provideTextCheckbox = new Ext.form.Checkbox({ fieldLabel: 'Provide Text Box', name: 'CustomText' });
		this.provideTextCheckbox = provideTextCheckbox;
		var allowPhotoCheckbox = new Ext.form.Checkbox({ fieldLabel: 'Allow Photo Upload', name: 'Photo' });
		var yesNoCheckbox = new Ext.form.Checkbox({ fieldLabel: 'Yes/No Question', name: 'IsYesNoQuestion', checked: true });
		this.yesNoCheckbox = yesNoCheckbox;
		yesNoCheckbox.on('check', this.onYesNoCheckboxChecked, this);

		var provideTextInfo = new Ext.ux.Image({ height: 10, width: 10, src: "./images/icons/info.png", cls: 'infoImg', listeners: { render: function (field) { new Ext.ToolTip({ target: field.getEl(), html: 'If selected, provides an text filed to the user in the answer field' }); } } });
		var provideTextPanel = new Ext.Panel({
			layout: 'table',
			border: false,
			defaults: { border: false, layout: 'form' },
			items: [{ items: provideTextCheckbox }, provideTextInfo]
		});
		this.provideTextPanel = provideTextPanel;

		var allowPhotoInfo = new Ext.ux.Image({ height: 10, width: 10, src: "./images/icons/info.png", cls: 'infoImg', listeners: { render: function (field) { new Ext.ToolTip({ target: field.getEl(), html: 'If selected, provides an Image capture button to the user in the answer field for photo' }); } } });
		var allowPhototPanel = new Ext.Panel({
			layout: 'table',
			border: false,
			defaults: { border: false, layout: 'form' },
			items: [{ items: allowPhotoCheckbox }, allowPhotoInfo]
		});

		var yesNoInfo = new Ext.ux.Image({ height: 10, width: 10, src: "./images/icons/info.png", cls: 'infoImg', listeners: { render: function (field) { new Ext.ToolTip({ target: field.getEl(), html: 'Allows user to see Yes / No button to answer the question above' }); } } });
		var yesNoPanel = new Ext.Panel({
			layout: 'table',
			border: false,
			defaults: { border: false, layout: 'form' },
			items: [{ items: yesNoCheckbox }, yesNoInfo]
		});

		var tagsPanel = Cooler.Tag();
		this.tagsPanel = tagsPanel;

		var surveyTagCombo = DA.combo.create({ fieldLabel: 'Survey Tag', hiddenName: 'SurveyTagId', baseParams: { comboType: 'SurveyTag' }, listWidth: 220, controller: "Combo" });
		this.surveyTagCombo = surveyTagCombo;
		var redScorePoint = new Ext.form.NumberField({ fieldLabel: 'Red Score Point', name: 'RedScorePoint', mixValue: 1, maxValue: 25 });
		this.redScorePoint = redScorePoint;
		//var maxValueField = new Ext.form.NumberField({ fieldLabel: 'Max Value', name: 'MaxValue' });
		//this.maxValueField = maxValueField;

		//var minValueField = new Ext.form.NumberField({ fieldLabel: 'Min Value', name: 'MinValue' });
		//this.minValueField = minValueField;

		//var maxLengthField = new Ext.form.NumberField({ fieldLabel: 'Max Length', name: 'MaxLength' });
		//this.maxLengthField = maxLengthField;

		//var minLengthField = new Ext.form.NumberField({ fieldLabel: 'Min Length', name: 'MinLength' });
		//this.minLengthField = minLengthField;

		//var defaultValueField = new Ext.form.TextField({ fieldLabel: 'Default Value', name: 'DefaultValue' });
		//this.defaultValueField = defaultValueField;

		//var requiredValueField = new Ext.form.Checkbox({ fieldLabel: 'Required', name: 'Required' });
		//this.requiredValueField = requiredValueField;

		//var imageRequiredField = new Ext.form.Checkbox({ fieldLabel: 'Image Required', name: 'ImageRequired' });
		//this.imageRequiredField = imageRequiredField;

		var optionHiddenFields = new Ext.form.Hidden({ name: 'Options' });

		var surveyTypeIdHiddenField = new Ext.form.Hidden({ name: 'SurveyTypeId' });
		this.surveyTypeIdHiddenField = surveyTypeIdHiddenField;

		//var regexField = new Ext.form.TextField({ fieldLabel: 'RegEx', name: 'Regex' });
		//this.regexField = regexField;

		//var allowDecimalField = new Ext.form.NumberField({ fieldLabel: 'Allow Decimal', name: 'AllowDecimal', maxValue: 5 });
		//this.allowDecimalField = allowDecimalField;

		//var questionNumberHiddenField = new Ext.form.Hidden({ name: 'QuestionNumber' });
		//this.questionNumberHiddenField = questionNumberHiddenField;

		//var surveyConfigCombo = DA.combo.create({ fieldLabel: 'Survey Config', hiddenName: 'SurveyConfigId', store: this.comboStores.SurveyConfig, mode: 'local' });
		//this.surveyConfigCombo = surveyConfigCombo;

		this.on('dataLoaded', this.onDataLoaded, this);

		//questionTypeCombo.on('select', this.onQuestionComboSelect, this);

		//surveyConfigCombo.on('select', this.onSurveyConfigSelect, this);

		questionCategoryCombo.on('select', this.onSurveyCategorySelect, this);

		this.on('beforeLoad', this.onBeforeLoad, this);

		this.on('beforeSave', this.onBeforeSave, this);



		Ext.apply(config, {
			defaults: { width: 220, labelWidth: 102 },
			region: 'north',
			height: 280,
			items: [
				//surveyConfigCombo,
				questionCategoryCombo,
				{ fieldLabel: 'Question', name: 'Question', xtype: 'textfield', allowBlank: false },
				//questionTypeCombo,
				yesNoPanel,
				tagsPanel,
				//minValueField,
				//maxValueField,
				//minLengthField,
				//maxLengthField,
				//requiredValueField,
				//defaultValueField,
				//regexField,
				//allowDecimalField,
				//choiceTypeCombo,
				//imageCombo,
				//imageRequiredField,
				//additionalText,
				//additionalTextRequired,
				productCombo,
				optionHiddenFields,
				surveyTypeIdHiddenField,
				provideTextPanel,
				allowPhototPanel,
				surveyTagCombo,
				redScorePoint
			]
		});
		return config;
	},

	CreateFormPanel: function (config) {
		var productPanel = new Ext.Panel({
			title: 'Product Images',
			layout: 'fit',
			autoScroll: true,
			disabled: true,
			items: this.imageDataView
		});
		this.productPanel = productPanel;
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			defaults: {
				layout: 'fit',
				border: 'false'
			},
			items: productPanel
		});
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			width: 480,
			height: 500,
			items: [this.formPanel, tabPanel]
		});
	},

	//checkFieldVisiblity: function (value) {
	//	this.minLengthField.setFieldVisible(false);
	//	this.maxLengthField.setFieldVisible(false);
	//	this.maxValueField.setFieldVisible(false);
	//	this.minValueField.setFieldVisible(false);
	//	this.defaultValueField.setFieldVisible(false);
	//	this.requiredValueField.setFieldVisible(false);
	//	this.regexField.setFieldVisible(false);
	//	this.tagsPanel.setFieldVisible(false);
	//	this.allowDecimalField.setFieldVisible(false);
	//	this.choiceTypeCombo.setFieldVisible(false);
	//	switch (value) {
	//		case Cooler.Enums.QuestionType.Text:
	//		case Cooler.Enums.QuestionType.TextArea:
	//			this.minLengthField.setFieldVisible(true);
	//			this.maxLengthField.setFieldVisible(true);
	//			this.defaultValueField.setFieldVisible(true);
	//			this.requiredValueField.setFieldVisible(true);
	//			this.regexField.setFieldVisible(true);
	//			break;
	//		case Cooler.Enums.QuestionType.Date:
	//		case Cooler.Enums.QuestionType.Number:
	//			this.maxValueField.setFieldVisible(true);
	//			this.minValueField.setFieldVisible(true);
	//			this.defaultValueField.setFieldVisible(true);
	//			this.requiredValueField.setFieldVisible(true);
	//			if (value == Cooler.Enums.QuestionType.Number) {
	//				this.regexField.setFieldVisible(true);
	//				this.allowDecimalField.setFieldVisible(true);
	//			}
	//			break;
	//		case Cooler.Enums.QuestionType.Image:
	//			this.requiredValueField.setFieldVisible(true);
	//			break;
	//		case Cooler.Enums.QuestionType.Choice:
	//			this.tagsPanel.setFieldVisible(true);
	//			this.choiceTypeCombo.setFieldVisible(true);
	//			break;
	//	}
	//},

	onYesNoCheckboxChecked: function (checkBox, checked) {
		if (checked) {
			this.tagsPanel.removeAllItems();
			this.provideTextCheckbox.setValue(false);
		}
		this.tagsPanel.setFieldVisible(!checked);
		this.provideTextPanel.setVisible(!checked);
	},

	onProductComboChange: function (combo, newValue, oldValue) {
		var oldProductIdLen = newProductIdLen = 0, index, data;
		var store = combo.store; // we don't have getStore() in lovCombo
		if (oldValue) {
			var oldProductIds = oldValue.split(',');
			oldProductIdLen = oldProductIds.length;
		}
		if (newValue) {
			var newProductIds = newValue.split(',');
			newProductIdLen = newProductIds.length;
			this.productPanel.setDisabled(false);
		}
		else {
			this.productPanel.setDisabled(true);
		}
		// if newValue count is more then oldValue count then we insert the record in productImageStore
		if (newProductIdLen > oldProductIdLen) {
			var newProductId = parseInt(newProductIds[newProductIdLen - 1]);
			index = store.findExact('LookupId', newProductId);
			data = store.getAt(index);
			this.productImageStore.insert(newProductId, new Ext.data.Record({ 'ProductId': newProductId, 'ProductName': data.get('DisplayValue') }));
		}
			// if oldValue count is more then newValue count then we remove extra record from productImageStore
		else {
			var removedProductId = parseInt(oldProductIds.filter(function (obj) {
				if (newProductIds) {
					return newProductIds.indexOf(obj) == -1;
				}
				return obj;
			})[0]);
			this.productImageStore.removeAt(this.productImageStore.findExact('ProductId', removedProductId));
			this.imageDataView.refresh();
		}
	},

	onDataLoaded: function (coolerForm, data) {
		var record = data.data;
		this.surveyTypeIdHiddenField.setValue(coolerForm.showFormArgs.surveyTypeId);
		if (coolerForm.showFormArgs.categoryId === Cooler.Enums.SurveyType.Prospect) {
			this.questionCategoryCombo.setValue(Cooler.Enums.QuestionCategory.AdditionalInfo);
			this.questionCategoryCombo.disable();
			this.surveyTagCombo.setFieldVisible(false);
		} else {
			this.questionCategoryCombo.enable();
			this.surveyTagCombo.setFieldVisible(true);
		}
		this.tagsPanel.removeAllItems();
		this.tagsPanel.setFieldVisible(!record.IsYesNoQuestion);
		this.provideTextPanel.setVisible(!record.IsYesNoQuestion);
		if (!record.IsYesNoQuestion && record.Options) {
			var options = record.Options.split(',');
			var len = options.length;
			var storeItems = [];
			for (var j = 0; j < len; j++) {
				storeItems.push([j, options[j]]);
			}
			var store = new Ext.data.SimpleStore({ fields: ['LookupId', 'DisplayValue'], data: storeItems });
			if (!this.tagsPanel.store) {
				this.tagsPanel.store = store;
			}
			else {
				this.tagsPanel.store.loadData(storeItems)
			}
			for (var i = 0; i < len; i++) {
				this.tagsPanel.setValue(options[i]);
			}
		}
		var questionId = record.Id;
		if (questionId == 0) {
			this.yesNoCheckbox.setValue(true);
			this.productImageStore.removeAll();
		}
		else {
			var productIds = record.ProductIds;
			if (productIds) {
				this.productPanel.setDisabled(false);
				this.productImageStore.removeAll();
				var products = productIds.split(',');
				var store = this.productCombo.store;
				var productId = 0;
				for (var i = 0, len = products.length; i < len; i++) {
					productId = parseInt(products[i])
					index = store.findExact('LookupId', productId);
					if (index > -1) {
						data = store.getAt(index);
						this.productImageStore.insert(productId, new Ext.data.Record({ 'ProductId': productId, 'ProductName': data.get('DisplayValue') }));
					}
				}
			}
			else {
				this.productImageStore.removeAll();
				this.productPanel.setDisabled(true);
			}
		}

	},

	onBeforeLoad: function (param) {
		this.tagsPanel.setLabel("Options");
		this.tagsPanel.removeAllItems();
	},

	onBeforeSave: function (form, params, options) {
		this.questionCategoryCombo.enable();
		var yesNoCheckboxValue = this.yesNoCheckbox.getValue();
		var provideTextCheckboxValue = this.provideTextCheckbox.getValue();
		if (!yesNoCheckboxValue && !provideTextCheckboxValue) {
			var options = this.tagsPanel.getValue();
			if (options.split(',').length != Cooler.Enums.Options.Count) {
				Ext.Msg.alert('Alert', "Options count should be 4");
				return false;
			}
		}
		if (provideTextCheckboxValue) {
			this.tagsPanel.removeAllItems();
		}
		this.saveTags(this.tagsPanel, params);
	},

	//onQuestionComboSelect: function (combo, newValue, oldValue) {
	//	this.checkFieldVisiblity(combo.getValue());
	//},

	onSurveyCategorySelect: function (combo, newValue, oldValue) {
		var value = combo.getValue();
		if (value === Cooler.Enums.QuestionCategory.Availability) {
			this.productCombo.setFieldVisible(true);
			this.productPanel.setDisabled(false);
		} else {
			this.productCombo.reset();
			this.productCombo.setFieldVisible(false);
			this.productPanel.setDisabled(true);
			this.productImageStore.removeAll();
		}
	}

	//onSurveyConfigSelect: function (combo, newValue, oldValue) {
	//	var value = combo.getValue();
	//	var bool = false;
	//	switch (value) {
	//		case Cooler.Enums.SurveyConfig.Standard:
	//			this.tagsPanel.setFieldVisible(true);
	//			this.checkFieldVisiblity(value);
	//			bool = false;
	//			break;
	//		case Cooler.Enums.SurveyConfig.Advance:
	//			bool = true;
	//			this.checkFieldVisiblity(this.questionTypeCombo.getValue());
	//			break;
	//	}
	//	this.questionTypeCombo.allowBlank = !bool;
	//	this.questionTypeCombo.validate();
	//	this.questionTypeCombo.setFieldVisible(bool);
	//	this.imageCombo.setFieldVisible(bool);
	//	this.imageRequiredField.setFieldVisible(bool);
	//	this.additionalText.setFieldVisible(bool);
	//	this.additionalTextRequired.setFieldVisible(bool);
	//}
});

