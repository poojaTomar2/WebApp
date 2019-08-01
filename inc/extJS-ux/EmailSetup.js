//----------------------------------------------
//  EmailTemplate
//----------------------------------------------

DA.EmailTemplate = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Email Template: {0}',
		listTitle: 'Email Templates',
		keyColumn: 'EmailTemplateId',
		captionColumn: 'Subject',
		controller: 'EmailTemplate',
		comboTypes: ['RecipientType']
	});
	DA.EmailTemplate.superclass.constructor.call(this, config);
};

Ext.extend(DA.EmailTemplate, DA.Form, {

    listRecord: Ext.data.Record.create([
		{ name: 'EmailTemplateId', type: 'int' },
		{ name: 'IsHtml', type: 'bool' },
		{ name: 'Subject', type: 'string' },
		{ name: 'Body', type: 'string' },
		{ name: 'FromName', type: 'string' },
		{ name: 'FromEmailAddress', type: 'string' },
		{ name: 'AddlTo', type: 'string' },
		{ name: 'AddlCc', type: 'string' },
		{ name: 'AddlBcc', type: 'string' },
		{ name: 'EmailTemplateType', type: 'string' },
        { name: 'TemplateName',type:'string' }
   
		
		
	]),

	comboStores: {
	    RecipientType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	cm: function () {
		var cm = new Ext.grid.ColumnModel([
			{ header: 'Id', dataIndex: 'EmailTemplateId', width: 50, hidden: true },
			{ header: 'Subject', dataIndex: 'Subject', width: 300 },
			{ header: 'Email Template Type', dataIndex: 'EmailTemplateType', width: 300 },
            { header: 'Email Template Name', dataIndex: 'TemplateName', width: 300 }
		]);

		return cm;
	}(),

	createForm: function (config) {

		var row1 = {
			columnWidth: 1,
			layout: 'column',
			defaults: { border: false, columnWidth: 1, layout: 'form', defaultType: 'textfield' },
			items: [
	      	{ items: [this.defaultField = new Ext.form.TextField({ fieldLabel: 'Subject', name: 'Subject', xtype: 'textfield', maxLength: 100, width: 300, allowBlank: false })] }
			]
		};
		var row2 = {
			columnWidth: 1,
			layout: 'column',
			defaults: { border: false, columnWidth: 1, layout: 'form' },
			items: [
	        { items: [new Ext.form.HtmlEditor({ fieldLabel: 'Body', name: 'Body', width: 600, height: 250, allowBlank: false })] }
			]
		};
		var row3 = {
			columnWidth: 1,
			layout: 'column',
			defaults: { border: false, columnWidth: 1, layout: 'form', defaultType: 'textfield' },
			items: [
	      	{ items: [new Ext.form.TextField({ fieldLabel: 'SMS Body', name: 'SmsBody', xtype: 'textfield', maxLength: 160, width: 300 })] }
			]
		};

		var row4 = {
			columnWidth: 1,
			layout: 'column',
			defaults: { border: false, columnWidth: 1, layout: 'form' },
			items: [
	        { items: [{ fieldLabel: 'To', name: 'AddlTo', xtype: 'textfield', width: 300, maxLength: 200 }] }
			]
		};
		var row5 = {
			columnWidth: 1,
			layout: 'column',
			defaults: { border: false, columnWidth: 1, layout: 'form' },
			items: [
	        { items: [{ fieldLabel: 'Cc', name: 'AddlCc', xtype: 'textfield', width: 300, maxLength: 200 }] }
			]
		};
		var row6 = {
			columnWidth: 1,
			layout: 'column',
			defaults: { border: false, columnWidth: 1, layout: 'form' },
			items: [
	        { items: [{ fieldLabel: 'Bcc', name: 'AddlBcc', xtype: 'textfield', width: 300, maxLength: 200 }] }
			]
		};
		var row7 = {
			columnWidth: 1,
			layout: 'column',
			defaults: { border: false, columnWidth: .4, layout: 'form', defaultType: 'textfield' },
			items: [
	          { items: [{ fieldLabel: 'From name', name: 'FromName', xtype: 'textfield', width: 167, maxLength: 100 }] },
	          { items: [{ fieldLabel: 'Email address', name: 'FromEmailAddress', xtype: 'textfield', width: 150, maxLength: 100 }] }
			]
		};
		var row8 = {
			columnWidth: 1,
			layout: 'column',
			defaults: { border: false, columnWidth: .4, layout: 'form', defaultType: 'textfield' },
			items: [
	          { items: [{ fieldLabel: 'Is Html?', name: 'IsHtml', xtype: 'checkbox' }] },
			  { items: [{ fieldLabel: 'Template Name', name: 'TemplateName', xtype: 'textfield', width: 200, maxLength: 100, allowBlank: false }] }
			]
		};		

		var emailTemplateCombo = DA.combo.create({ fieldLabel: 'Email Template Type', name: 'EmailTemplateTypeId', hiddenName: 'EmailTemplateTypeId', controller: 'combo', baseParams: { comboType: 'EmailTemplateType' }, listWidth: 220, allowBlank: false });
		this.emailTemplateCombo = emailTemplateCombo
		Ext.apply(config, {
			defaults: { border: false },
			items: [row1, row2, row3, row4, row5, row6, row7, row8, emailTemplateCombo]
		});
		return config;
	},
	CreateFormPanel: function (config) {
		var emailTemplateRecipientGrid = DA.EmailTemplateRecipient.createGrid({ title: 'Recipients', root: 'EmailTemplateRecipients', allowPaging: false, height: 100, editable: true, plugins: [new Ext.ux.ComboLoader()] });
		var grids = [];
		grids.push(emailTemplateRecipientGrid);

		this.childGrids = grids;

		var tabPanel = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			defaults: { layout: 'fit', border: false },
			items: [
                emailTemplateRecipientGrid
			]
		});

		config.region = 'center';
		config.height = 500;
		this.formPanel = new Ext.FormPanel(config);

		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			defaults: { border: false },
			height: 630,
			items: [this.formPanel, tabPanel]
		});
	}

});

DA.EmailTemplate = new DA.EmailTemplate();

//---------------------------------------
//EmailTemplateRecipient
//--------------------------------------
DA.EmailTemplateRecipient = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'EmailTemplateRecipient: {0}',
		listTitle: 'Email Template Recipient',
		keyColumn: 'EmailTemplateRecipientId',
		captionColumn: null,
		gridIsLocal: true,
		newListRecordData: { RecipientTypeId: '' }
	});
	DA.EmailTemplateRecipient.superclass.constructor.call(this, config);
};

Ext.extend(DA.EmailTemplateRecipient, DA.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'EmailTemplateId', type: 'int' },
		{ name: 'Name', type: 'string' },
		{ name: 'EmailAddress', type: 'string' },
		{ name: 'RecipientTypeId', type: 'int' },
		{ name: 'AssociationTypeId', type: 'int' },
		{ name: 'AssociationId', type: 'int' },
		{ name: 'Resource', type: 'string' }
	]),
	cm: function () {
		var recipientTypeCombo = ExtHelper.CreateCombo({ store: DA.EmailTemplate.comboStores.RecipientType, mode: 'local', allowBlank: false });
		var resourceCombo = ExtHelper.CreateCombo({ baseParams: { comboType: 'Resource' }, controller: "Combo" });
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Name', dataIndex: 'Name', width: 100, editor: new Ext.form.TextField({ maxLength: 100 }) },
			{ header: 'Email Address', dataIndex: 'EmailAddress', width: 100, editor: new Ext.form.TextField({ maxLength: 100, vtype: 'email' }) },
			{ header: 'Recipient Type', dataIndex: 'RecipientTypeId', width: 100, renderer: ExtHelper.renderer.Combo(recipientTypeCombo), editor: recipientTypeCombo },
			{ header: 'Resource', dataIndex: 'AssociationId', displayIndex: 'Resource', width: 100, editor: resourceCombo }
		]);

		return cm;
	}
});

DA.EmailTemplateRecipient = new DA.EmailTemplateRecipient();

//-------------------------------------------
//Email Queue
//-------------------------------------------

DA.EmailQueue = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Email Queue: {0}',
		listTitle: 'Email Queue',
		keyColumn: 'EmailQueueId',
		captionColumn: null,
		controller: 'EmailQueue',
		disableAdd: true,
		gridConfig: {
			groupField: 'CreatedOn',
			plugins: [new Ext.grid.GroupSummary(), new Ext.ux.grid.GridSummary()],
			viewConfig: {
				startCollapsed: true,
				hideGroupedColumn: true,
				groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]} )'
			},
			custom: {
				tbar: [
		            { text: 'Release Queue', iconCls: 'history-icon', handler: function () { DA.EmailQueue.fnReleaseQueue() }, scope: this }
				]
			}
		}
	});
	DA.EmailQueue.superclass.constructor.call(this, config);
};
DA.renderer = {};
DA.renderer.TextAsLink = function (v, m, r) {
	m.css += "document";
	if (v) {
		return "<a href=javascript:DA.EmailTemplate.ShowForm('" + v + "');>&nbsp;&nbsp;&nbsp;&nbsp;</a>";
	}
	return " ";
};
Ext.extend(DA.EmailQueue, DA.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'EmailQueueId', type: 'int' },
		{ name: 'TemplateId', type: 'int' },
		{ name: 'EventId', type: 'int' },
		{ name: 'IsHtml', type: 'bool' },
		{ name: 'Subject', type: 'string' },
		{ name: 'Body', type: 'string' },
		{ name: 'FromName', type: 'string' },
		{ name: 'Event', type: 'string' },
		{ name: 'FromEmailAddress', type: 'string' },
		{ name: 'AddlTo', type: 'string' },
		{ name: 'AddlCc', type: 'string' },
		{ name: 'AddlBcc', type: 'string' },
		{ name: 'Subject', type: 'string' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'Tags', type: 'string' },
		{ name: 'StatusId', type: 'int' },
		{ name: 'EmailTemplateTypeId', type: 'int' },
		{ name: 'TemplateName', type: 'string' }
		
	]),

	fnReleaseQueue: function () {
		// check form value
		var params = { action: 'releaseemails' };
		var waitObj = Ext.MessageBox.wait('Sending request...', 'Sending');
		ExtHelper.GenericConnection.request({
			url: EH.BuildUrl('EmailQueue'),
			params: params,
			callback: function (o, success, response) {
				waitObj.hide();
				if (!success) {
					Ext.Msg.alert('Error', 'An error occured');
				}
				else {
					var data = Ext.util.JSON.decode(response.responseText);
					var info = data.data.info;
					if (info.length > 0) {
						Ext.Msg.alert('Release Queue', info);
					} else {
						Ext.Msg.alert('Error', 'An error occured');
					}
				}
			},
			scope: this
		});
	},

	cm: function () {
		var cm = new Ext.grid.ColumnModel([
			{ header: 'Is Html', dataIndex: 'IsHtml', width: 70, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Event', dataIndex: 'Event', width: 100 },
			{ header: 'From Name', dataIndex: 'FromName', width: 100 },
			{ header: 'From Email Address', dataIndex: 'FromEmailAddress', width: 100 },
			{ header: 'Add To', dataIndex: 'AddlTo', width: 100 },
			{ header: 'Add Cc', dataIndex: 'AddlCc', width: 100 },
			{ header: 'Add Bcc', dataIndex: 'AddlBcc', width: 100 },
			{ header: 'Tags', dataIndex: 'Tags', width: 100 },
			{ header: 'Subject', dataIndex: 'Subject', width: 125 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 125, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Template', dataIndex: 'TemplateId', width: 50, renderer: DA.renderer.TextAsLink },
			{ name: 'EmailTemplateTypeId', type: 'int' },
			{ name: 'TemplateName', type: 'string' }
		    

		]);

		return cm;
	}(),


	emailRecipientGrid: undefined,
	configureListTab: function (config) {
		Ext.apply(this.grid, {
			region: 'center'
		});

		var contactId = 0;

		// Allow only single selection
		var sm = this.grid.getSelectionModel();
		sm.singleSelect = true;
		// Create subscription grid - a copy
		var childGridConfig = {};
		var tBar = [];
		childGridConfig.tBar = [];
		childGridConfig.tbar = tBar;
		childGridConfig.disableDblClickHandler = true;
		childGridConfig.defaultPlugins = true;

		this.emailRecipientGrid = DA.EmailRecipient.createGrid(childGridConfig, true);
		Ext.apply(this.emailRecipientGrid, {
			region: 'south',
			height: 200
		});

		var recipientGrid = this.emailRecipientGrid;

		// Disable applicant grid by default
		ExtHelper.DisableGrid(recipientGrid);
		var childGridStore = recipientGrid.getStore();
		childGridStore.baseParams.ContactId = 0;

		// On load of main grid, select first row
		this.grid.getStore().on('load', function (store, records, options) {
			if (records.length == 0) {
				ExtHelper.DisableGrid(recipientGrid);
			}
			else {
				ExtHelper.EnableGrid(recipientGrid);
			}
			if (records.length > 0) {
				sm.selectRow(0);
			}
		});

		// On selection of first row in the main grid, reload the child grid
		sm.on('rowselect', function (sm, rowIndex, record) {
			childGridStore.baseParams.EmailQueueId = record.get("EmailQueueId");
			ExtHelper.EnableGrid(recipientGrid);
			recipientGrid.loadFirst();
			emailQueueId = record.get('EmailQueueId');
		});

		config.layout = 'border';
		config.items.push(this.emailRecipientGrid);

		return config;
	}

});
DA.EmailQueue = new DA.EmailQueue();

//---------------------------------------------
//Emai Recipient
//---------------------------------------------
DA.EmailRecipient = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Email Recipient: {0}',
		listTitle: 'Email Recipient',
		keyColumn: 'EmailRecipientId',
		captionColumn: null,
		controller: 'EmailRecipient'

	});
	DA.EmailRecipient.superclass.constructor.call(this, config);
};

Ext.extend(DA.EmailRecipient, DA.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'EmailRecipientId', type: 'int' },
		{ name: 'EmailQueueId', type: 'int' },
		{ name: 'RecipientName', type: 'string' },
		{ name: 'RecipientId', type: 'int' },
		{ name: 'RecipientEmail', type: 'string' },
		{ name: 'RecipientTypeId', type: 'int' },
		{ name: 'Tries', type: 'int' },
		{ name: 'Tags', type: 'string' },
		{ name: 'SentOn', type: 'date', convert: Ext.ux.DateLocalizer }
	]),

	rowDblClickHandler: function (grid, rowIndex, e, options) {
		//		var r = grid.getStore().getAt(rowIndex);
		//		var emailRecipientId = r.get('EmailRecipientId');
		//		DA.EmailRecipient.ShowForm(emailRecipientId);
	},

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Email Queue ID', dataIndex: 'EmailQueueId', width: 100, align: 'right' },
			{ header: 'Recipient Name', dataIndex: 'RecipientName', width: 125 },
			{ header: 'Recipient Email', dataIndex: 'RecipientEmail', width: 125 },
			{ header: 'Recipient ID', dataIndex: 'RecipientId', width: 100, align: 'right' },
			{ header: 'Tries', dataIndex: 'Tries', width: 60, align: 'right' },
			{ header: 'Tags', dataIndex: 'Tags', width: 100 },
			{ header: 'Sent On', dataIndex: 'SentOn', width: 130, renderer: ExtHelper.renderer.DateTime }
		]);

		return cm;
	},
	fields: {},

	onGridCreated: function (grid) {
		grid.on('rowdblclick', this.rowDblClickHandler, this);
	}
});

DA.EmailRecipient = new DA.EmailRecipient();
