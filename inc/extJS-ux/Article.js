DA.Article = function(config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Article: {0}',
		listTitle: 'Article',
		keyColumn: 'ArticleId',
		captionColumn: 'Title',
		controller: 'Article',
		winConfig: { width: 725, height: 350 },
		gridConfig: {
			custom: {
				loadComboTypes: true
			}
		},
		comboTypes: ['SecurityRole', 'ArticlePreference'],
		securityModule: 'Announcement'
	});
	DA.Article.superclass.constructor.call(this, config);
};

Ext.extend(DA.Article, DA.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'ArticleId', type: 'int' },
		{ name: 'Title', type: 'string' },
		{ name: 'Body', type: 'string' },
		{ name: 'Organization', type: 'string' },
		{ name: 'Preference', type: 'string' },
		{ name: 'StartDate', type: 'date' },
		{ name: 'EndDate', type: 'date' },
		{ name: 'CreatedBy', type: 'string' },
		{ name: 'CreatedOn', type: 'date' },
		{ name: 'PreferenceTypeId', type: 'int' }
	]),

	comboStores: {
		SecurityRole: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		ArticlePreference: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	cm: function() {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Title', dataIndex: 'Title', width: 100, hyperlinkAsDoubleClick: true },
			{ header: 'Organization', dataIndex: 'Organization', width: 125 },
			{ header: 'Preference', dataIndex: 'PreferenceTypeId', width: 125, renderer: ExtHelper.renderer.Proxy('Preference'), store: DA.Article.comboStores.ArticlePreference },
			{ header: 'Start Date', dataIndex: 'StartDate', width: 100, renderer: ExtHelper.renderer.Date },
			{ header: 'End Date', dataIndex: 'EndDate', width: 100, renderer: ExtHelper.renderer.Date }
        ]);

		return cm;
	},

	createForm: function(config) {

		var startDate = new Ext.form.DateField({ fieldLabel: 'Start Date', name: 'StartDate', xtype: 'datefield' });
		var endDate = new Ext.form.DateField({ fieldLabel: 'End Date', name: 'EndDate', xtype: 'datefield' });

		/*
		if (DA.App && DA.App.hasDateCheck) {
		DA.App.addDateCheck({ dateField: startDate });
		DA.App.addDateCheck({ dateField: endDate });
		}
		*/

		ExtHelper.CompareValidator({
			field: endDate,
			compareTo: startDate,
			operator: ">=",
			message: "End date must be equal or greater than Start date"
		});

		Ext.apply(config, {
			layout: 'table',
			layoutConfig: { columns: 2 },
			border: false,
			defaults: { bodyStyle: 'padding:2px', border: false, layout: 'form', defaultType: 'textfield', labelWidth: 90 },
			items: [
			// Row 1
	              {colspan: 2, items: [this.defaultField = new Ext.form.TextField({ fieldLabel: 'Title', name: 'Title', xtype: 'textfield', maxLength: 255, width: 550 })] },

			// Row 2
	             {items: [DA.combo.create({ fieldLabel: 'Organization', hiddenName: 'OrganizationId', baseParams: { comboType: 'Organization'} })] },
	             { colspan: 2, items: [DA.combo.create({ fieldLabel: 'Type', hiddenName: 'PreferenceTypeId', baseParams: { comboType: 'ArticlePreference' }, allowBlank: false })] },

			//Row 3

	             {items: [startDate] },
	             { items: [endDate] },

			//Row 4
	             {colspan: 2, items: [new Ext.form.HtmlEditor({ fieldLabel: 'Body', name: 'Body', xtype: 'textarea', maxLength: 4000, width: 550 })] }
	        ]
		});

		return config;
	},
	CreateFormPanel: function(config) {
		var articleRoleGrid = DA.ArticleRole.createGrid({ title: 'Role', root: 'ArticleRoles', allowPaging: false, editable: true });

		var grids = [];
		grids.push(articleRoleGrid);
		this.childGrids = grids;

		this.requiredGrids = grids;

		var tabPanel = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			defaults: { layout: 'fit', border: false },
			layoutOnTabChange: true,
			items: [
				articleRoleGrid
            ]
		});

		config.region = 'north';
		config.height = 300;
		this.formPanel = new Ext.FormPanel(config);

		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			defaults: { border: false },
			height: 550,
			items: [this.formPanel, tabPanel]
		});
	}
});

DA.Article = new DA.Article();
	
//-----------------------
// Article Role
//-----------------------

DA.ArticleRole = function(config){
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Article Role: {0}',
		listTitle: 'Article Role',
		keyColumn: 'ArticleRoleId',
		captionColumn: null,
		gridIsLocal: true
	});
	DA.ArticleRole.superclass.constructor.call(this, config);
};
	
Ext.extend(DA.ArticleRole, DA.Form, {

	listRecord: Ext.data.Record.create([
		{name: 'ArticleId', type: 'int'},
		{name: 'ArticleRoleId', type: 'int'},
		{name: 'RoleId', type: 'int'}
	]),

    cm: function() {

    var roleCombo = ExtHelper.CreateCombo({ store: DA.Article.comboStores.SecurityRole, mode: 'local', allowBlank: false });
        var cm = new Ext.ux.grid.ColumnModel([
            { header: 'Role', dataIndex: 'RoleId', width: 210, hiddenName: 'RoleId', renderer: ExtHelper.renderer.Combo(roleCombo), editor: roleCombo }
        ]);
        
        return cm;
    }()
	
});

DA.ArticleRole = new DA.ArticleRole();
	
