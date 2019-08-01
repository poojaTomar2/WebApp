Cooler.AlertSummary = new Cooler.Form({
	formTitle: 'Alert Summary: {0}',
	keyColumn: 'AlertSummaryId',
	controller: 'AlertSummary',
	captionColumn: 'AlertSummaryId',
	title: 'Alert Summary',
	securityModule: 'AlertSummary',
	hybridConfig: function () {
		return [
			{ dataIndex: 'AlertSummaryId', type: 'int' },
			{ dataIndex: 'TemplateId', type: 'int' },
			{ dataIndex: 'AlertDefinitionIds', type: 'string' },
			{ header: 'Email', dataIndex: 'Email', type: 'string', width: 250 },
			{ header: 'Alert Definitions', dataIndex: 'AlertDefinitionName', type: 'string', width: 150 },
			{ header: 'Email Template', dataIndex: 'EmailTemplate', type: 'string', width: 250 },
			{ header: 'Is Active', dataIndex: 'IsActive', type: 'bool', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 200 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 200 }
		]
	},

	createForm: function (config) {
		var templateCombo = DA.combo.create({ fieldLabel: 'Email Template', hiddenName: 'TemplateId', baseParams: { comboType: 'EmailTemplate' }, controller: "Combo", allowBlank: false });
		var alertDefinition = DA.combo.create({ baseParams: { comboType: 'AlertDefinition', limit: '0' }, controller: "Combo" });
		this.alertDefinition = alertDefinition;
		var alertDefinitionMultiselect = new Ext.ux.Multiselect({
			fieldLabel: 'Alert Definitions',
			name: 'AlertDefinitionIds',
			hiddenName: 'AlertDefinitionIds',
			valueField: 'LookupId',
			displayField: 'DisplayValue',
			store: alertDefinition.getStore(),
			allowBlank: false,
			maxLength: 10
		});
		this.alertDefinitionMultiselect = alertDefinitionMultiselect;
		Ext.apply(config, {
			defaults: { width: 250 },
			items: [
				{ fieldLabel: 'Email', name: 'Email', xtype: 'textarea', allowBlank: false },
				alertDefinitionMultiselect,
				templateCombo,
				DA.combo.create({ fieldLabel: 'Is Active', hiddenName: 'IsActive', store: "yesno", allowBlank: false })
			]
		});
		return config;
	},

	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
		this.on('beforeLoad', function (param) {
			this.alertDefinition.getStore().load(); // because if we delete any alertdefination then store will be updated
		});
		this.on('beforeSave', this.validateForm, this);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 400,
			height: 300,
			constrain: true,
			resizable: false,
			items: [this.formPanel]
		});
	},
	validateForm: function () {
		var form = this.formPanel.getForm();
		var emailAddressField = form.findField('Email');
		var emailAddress = emailAddressField.getValue().replace(/\s/g, "");
		var uniqueEmailAddressList = emailAddress.split(',').filter(function (item, i, allItems) {
			return i == allItems.indexOf(item);
		}).join(',');
		emailAddressField.setValue(uniqueEmailAddressList)
		var allMailAddress = uniqueEmailAddressList.split(','),
			emailregX = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
			isFormValidate = true;
		for (var i = 0, len = allMailAddress.length; i < len; i++) {
			isFormValidate = emailregX.test(allMailAddress[i]);
			if (!isFormValidate) {
				var msg = allMailAddress[i] + ' is not valid email address';
				emailAddressField.markInvalid(msg);
				Ext.Msg.alert('Email Validation Alert', msg);
				break;
			}
		}
		return isFormValidate;
	}
});