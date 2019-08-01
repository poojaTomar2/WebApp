Cooler.ContactReport = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Contact: {0}',
		listTitle: 'Notification Subscription',
		keyColumn: 'ContactId',
		controller: 'Contact',
		captionColumn: null,
		allowExport: false,
		securityModule: 'NotificationSubscription',
		quickSaveController: 'Contact',
		gridPlugins: [new DA.form.plugins.Inline({
			comboFields: ['ContactTypeId'],
			comboNameFieldSuffix: ''
		})],
		gridConfig:
			{
				custom:
				  {
				  	tbar:
					  [new Ext.Toolbar.Button({ text: 'Cancel', handler: cancelContact, iconCls: 'delete', scope: this })]
				  }
			},
		comboTypes: ['ContactType']
	});
	Cooler.ContactReport.superclass.constructor.call(this, config);
	this.on('afterQuickSave', this.onAfterQuickSave, this);
};

var cancelContact = function () {
	DA.cancelInlineEditableGrid({ grid: this.grid, keyColumn: this.keyColumn });
};

Ext.extend(Cooler.ContactReport, Cooler.Form, {

	listRecord: Ext.data.Record.create([

		{ name: 'Id', type: 'int' },
		{ name: 'ContactId', type: 'int' },
		{ name: 'ContactTypeId', type: 'int' },
		{ name: 'ContactType', type: 'string' },
		{ name: 'FirstName', type: 'string' },
		{ name: 'LastName', type: 'string' },
		{ name: 'MiddleName', type: 'string' },
		{ name: 'HomePhone', type: 'string' },
		{ name: 'WorkPhone', type: 'string' },
		{ name: 'CellPhone', type: 'string' },
		{ name: 'IsPrimary', type: 'int' },
		{ name: 'PersonalEmailAddress', type: 'string' },
		{ name: 'CorporateEmailAddress', type: 'string' },
		{ name: 'Fax', type: 'string' },
		{ name: 'AssociationTypeId', type: 'int' },
		{ name: 'AssociationId', type: 'int' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedByUser', type: 'string' }
	]),
	comboStores: {
		ContactType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	newListRecordData: function () {
		var grid = this.grid;
		var store = grid.getStore();
		var associationTypeId = 0;
		var associationId = 0;
		associationId = DA.Security.info.UserId;
		associationTypeId = DA.Security.info.Tags.ClientId;
		var data = { AssociationTypeId: associationTypeId, AssociationId: associationId, ContactTypeId: '' };
		this.notificationSubscriptionGrid.setDisabled(true);
		this.notificationSubscriptionGrid.store.removeAll();
		return data;
	},
	cm: function () {
		var contactTypeCombo = DA.combo.create({ store: this.comboStores.ContactType, mode: 'local', allowBlank: false });

		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Contact Type', dataIndex: 'ContactTypeId', width: 80, displayIndex: 'ContactType', renderer: 'proxy', displayIndex: 'ContactType', editor: contactTypeCombo },
			{ header: 'First Name', dataIndex: 'FirstName', width: 100, editor: new Ext.form.TextField({ maxLength: 50 }) },
			{ header: 'Last Name', dataIndex: 'LastName', width: 100, editor: new Ext.form.TextField({ maxLength: 50 }) },
			{ header: 'Middle Name', dataIndex: 'MiddleName', width: 100, editor: new Ext.form.TextField({ maxLength: 50 }) },
			{ header: 'Work Phone', dataIndex: 'WorkPhone', width: 80, editor: new Ext.form.TextField({ maxLength: 15 }) },
			{ header: 'Fax', dataIndex: 'Fax', width: 80, editor: new Ext.form.TextField({ maxLength: 15 }) },
			{ header: 'Corporate Email Address', dataIndex: 'CorporateEmailAddress', width: 125, editor: new Ext.form.TextField({ maxLength: 100, vtype: 'email' }) },
			{ header: 'Cell Phone', dataIndex: 'CellPhone', width: 80, editor: new Ext.form.TextField({ maxLength: 15 }) },
			{ header: 'Home Phone', dataIndex: 'HomePhone', width: 80, editor: new Ext.form.TextField({ maxLength: 15 }) },
			{ header: 'Personal Email Address', dataIndex: 'PersonalEmailAddress', width: 120, editor: new Ext.form.TextField({ maxLength: 100, vtype: 'email' }) },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }

		])
		return cm;
	},

	notificationCaption: null,
	alertSubscriptionGrid: undefined,
	notificationSubscriptionGrid: undefined,
	afterShowList: function () {
		if (!this.notificationCaption) {
			this.grid.setTitle(this.grid.tabTitle);
		} else {
			this.grid.setTitle(this.notificationCaption);
		}
		this.notificationSubscriptionGrid.setDisabled(true);
		this.notificationSubscriptionGrid.store.removeAll();
		this.notificationCaption = null;
	},
	onAfterQuickSave: function (obj, options) {
		this.grid.getStore().reload();
	},
	configureListTab: function (config) {
		var businessObjectTypeId = this.businessObjectTypeId;
		var recordId = this.recordId;

		Ext.apply(this.grid, {
			region: 'center'
		});

		var contactId = 0;

		this.notificationSubscriptionGrid = Cooler.NotificationRecurrence.createGrid({ title: 'Subscription', allowPaging: true, editable: true });
		Ext.apply(this.notificationSubscriptionGrid, {
			region: 'south',
			split: true,
			height: 300
		});

		var subscriptionGrid = this.notificationSubscriptionGrid;

		subscriptionGrid.getStore().on('add', function (store, records, index) {
			if (contactId == 0 || contactId == undefined) {
				store.removeAll();
				Ext.Msg.alert('Error', 'Select a contact to add subscription');
				return;
			}
		});

		// Disable applicant grid by default
		ExtHelper.DisableGrid(subscriptionGrid);
		subscriptionGrid.setDisabled(true);
		var subscriptionStore = subscriptionGrid.getStore();

		subscriptionStore.baseParams.ContactId = 0;


		// On selection of row in the main grid, reload the child grid
		this.grid.on('rowclick', function (grid, rowIndex, e) {
			subscriptionGrid.setDisabled(false);
			var record = grid.getStore().getAt(rowIndex);
			if (record.get("ContactId") > 0) {
				if (!this.baseParams.businessObjectTypeId || this.baseParams.businessObjectTypeId === 0) {
					this.baseParams.businessObjectTypeId = DA.Security.info.Tags.AssociationTypeId;
					this.businessObjectTypeId = DA.Security.info.Tags.AssociationTypeId;
				}
				subscriptionStore.baseParams.ContactId = record.get("ContactId");
				ExtHelper.EnableGrid(subscriptionGrid);
				subscriptionGrid.loadFirst();
				contactId = record.get('ContactId');
				Cooler.ContactReport.businessObjectTypeId = this.baseParams.businessObjectTypeId;
				Cooler.ContactReport.activeContactId = contactId;
				Cooler.ContactReport.activeContactRecord = record;
			} else {
				ExtHelper.DisableGrid(subscriptionGrid);
				subscriptionGrid.setDisabled(true);
				subscriptionGrid.store.removeAll();
			}
		});
		subscriptionGrid.loadFirst();
		config.layout = 'border';
		config.items.push(this.notificationSubscriptionGrid);

		return config;
	}
});

Cooler.ContactReport = new Cooler.ContactReport();