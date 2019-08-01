Ext.ns("DA");

DA.Hosting = {

};

DA.Hosting.Form = Ext.extend(DA.Form, {

});
DA.Hosting.Domain = function(config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Domain: {0}',
		listTitle: 'Domain',
		keyColumn: 'DomainId',
		captionColumn: 'Name',
		controller: 'Hosting/Domain'
	});
	DA.Hosting.Domain.superclass.constructor.call(this, config);
};

Ext.extend(DA.Hosting.Domain, DA.Hosting.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'ClientId', type: 'int' },
		{ name: 'CPPassword', type: 'string' },
		{ name: 'CPUsername', type: 'string' },
		{ name: 'CPHost', type: 'string' },
		{ name: 'HostingWith', type: 'string' },
		{ name: 'DomainWith', type: 'string' },
		{ name: 'Name', type: 'string' },
		{ name: 'DomainUpto', type: 'date' },
		{ name: 'HostingUpto', type: 'date' },
		{ name: 'IsHosting', type: 'bool' },
		{ name: 'IsDomain', type: 'bool' },
		{ name: 'DomainId', type: 'int' }
	]),

	cm: function() {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'CP Username', dataIndex: 'CPUsername', width: 100 },
			{ header: 'CP Host', dataIndex: 'CPHost', width: 100 },
			{ header: 'Hosting With', dataIndex: 'HostingWith', width: 100 },
			{ header: 'Domain With', dataIndex: 'DomainWith', width: 100 },
			{ header: 'Domain Upto', dataIndex: 'DomainUpto', width: 100, renderer: ExtHelper.renderer.Date },
			{ header: 'Hosting Upto', dataIndex: 'HostingUpto', width: 100, renderer: ExtHelper.renderer.Date },
			{ header: 'Is Hosting?', dataIndex: 'IsHosting', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Domain?', dataIndex: 'IsDomain', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Name', dataIndex: 'Name', width: 100 }
        ]);

		return cm;
	},

	createForm: function(config) {

	var Name = new Ext.form.TextField({ fieldLabel: 'Name', name: 'Name', xtype: 'textarea', maxLength: 100, allowBlank: false });
		var isDomain = ExtHelper.CreateCombo({ fieldLabel: 'Is Domain?', hiddenName: 'IsDomain', store: "yesno", width: 60 });
		var isHosting = ExtHelper.CreateCombo({ fieldLabel: 'Is Hosting?', hiddenName: 'IsHosting', store: "yesno", width: 60 });
		var hostingUpto = new Ext.form.DateField({ fieldLabel: 'Hosting Upto', name: 'HostingUpto', xtype: 'datefield', width: 125 });
		var domainUpto = new Ext.form.DateField({ fieldLabel: 'Domain Upto', name: 'DomainUpto', xtype: 'datefield', width: 125 });
		var domainWith = new Ext.form.TextField({ fieldLabel: 'Domain With', name: 'DomainWith', xtype: 'textarea', maxLength: 255, width: 160 });
		var hostingWith = new Ext.form.TextField({ fieldLabel: 'Hosting With', name: 'HostingWith', xtype: 'textarea', maxLength: 255 });
		var cpHost = new Ext.form.TextField({ fieldLabel: 'CP Host', name: 'CPHost', xtype: 'textarea', maxLength: 100 });
		var cpUserName = new Ext.form.TextField({ fieldLabel: 'CP Username', name: 'CPUsername', xtype: 'textarea', maxLength: 50 });
		var cpPassword = new Ext.form.TextField({ fieldLabel: 'CP Password', name: 'CPPassword', inputType: 'password', xtype: 'textarea', maxLength: 255 });
		var Client = ExtHelper.CreateCombo({ fieldLabel: 'Client', hiddenName: 'ClientId', baseParams: { comboType: 'Client'} });


		Ext.apply(config, {
			layout: 'table',
			layoutConfig: { columns: 3 },
			border: false,
			defaults: { bodyStyle: 'padding:2px', border: false, layout: 'form', defaultType: 'textfield', labelWidth: 100 },
			items: [
				{ items: [Name] },
				{ items: [isDomain] },
				{ items: [isHosting] },
				{ items: [hostingUpto] },
				{ items: [domainUpto] },
				{ items: [domainWith] },
				{ items: [hostingWith] },
				{ items: [cpHost] },
				{ items: [Client] },
				{ items: [cpUserName] },
				{ items: [cpPassword] }
	         ]
		});
		return config;
	},

	CreateFormPanel: function(config) {
		var domainFtp = DA.Hosting.DomainFtp.createGrid({ title: 'Domain Ftp', root: 'DomainFtps', allowPaging: false, editable: true, height: 100 });
		var grids = [];
		grids.push(domainFtp);
		this.childGrids = grids;
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			defaults: { layout: 'fit', border: false },
			items: [
					domainFtp
				]
		});

		Ext.apply(config, {
			region: 'north',
			height: 200
		});
		this.formPanel = new Ext.FormPanel(config);

		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			defaults: { border: false, bodyStyle: 'padding: 4x' },
			height: 450,
			items: [this.formPanel, tabPanel]
		});
	}
});

DA.Hosting.Domain = new DA.Hosting.Domain();
//----------------
// DomainFtp
//----------------

DA.Hosting.DomainFtp = function(config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Domain Ftp: {0}',
		listTitle: 'Domain Ftp',
		keyColumn: 'Id',
		captionColumn: null,
		controller: 'DomainFtp',
		gridIsLocal: true
	});
	DA.Hosting.DomainFtp.superclass.constructor.call(this, config);
};

Ext.extend(DA.Hosting.DomainFtp, DA.Hosting.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'DomainId', type: 'int' },
		{ name: 'Host', type: 'string' },
		{ name: 'Username', type: 'string' },
		{ name: 'Password', type: 'string' }
	]),

	cm: function() {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Host', dataIndex: 'Host', width: 100, editor: new Ext.form.TextField({ maxLength: 255, allowBlank: false }) },
			{ header: 'Username', dataIndex: 'Username', width: 100, editor: new Ext.form.TextField({ maxLength: 255, allowBlank: false }) },
			{ header: 'Password', dataIndex: 'Password', width: 100, renderer: function(v, m, r) { return '*****'; }, editor: new Ext.form.TextField({ inputType: 'password', allowBlank: false }) }
        ]);

		return cm;
	}
});

DA.Hosting.DomainFtp = new DA.Hosting.DomainFtp();
	

