
DA.Tracker.ProjectUser = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Project User: {0}',
		listTitle: 'Tracker Project User',
		keyColumn: 'ProjectUserId',
		captionColumn: 'ProjectId',
		controller: 'Tracker_ProjectUser',
		quickSaveController: 'Tracker_ProjectUser',
		allowExport: false,
		gridConfig: {
			autoFilter: false,
			prefManager: false,
			custom: {
				loadComboTypes: true
			}
		},
		gridPlugins: [new DA.form.plugins.Inline({
			comboFields: ['SecurityUserId'],
			comboNameFieldSuffix: ''
		})],
		comboTypes: ['User']
	});
	DA.Tracker.ProjectUser.superclass.constructor.call(this, config);

};

Ext.extend(DA.Tracker.ProjectUser, DA.Tracker.Form, {
	listRecord: Ext.data.Record.create([
		{ name: 'ProjectUserId', type: 'int' },
		{ name: 'ProjectId', type: 'int' },
		{ name: 'SecurityUserId', type: 'int' },
		{ name: 'IsClient', type: 'int' },
		{ name: 'User', type: 'string' }
	]),
	comboStores: {
		User: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	cm: function () {
		var yesNoStore = [["1", "No"], ["2", "Yes"]]
		var userCombo = ExtHelper.CreateCombo({ baseParams: { comboType: 'User' }, controller: 'Tracker_Combo', listWidth: 250 });
		userCombo.allowBlank = false;
		userCombo.validate();
		var clientCombo = DA.combo.create({ store: yesNoStore, mode: 'local', allowBlank: false });
		userCombo.allowBlank = false;
		userCombo.validate();
		userCombo.store.on('beforeload', function (store, options) {
			userCombo.lastQuery = null;
			var securityUserIds = '';
			var gridStore = DA.Tracker.ProjectUser.grid.getStore();
			gridStore.each(function (record) {
				if (record.get('SecurityUserId')) {
					if (securityUserIds.length > 0) {
						securityUserIds += ',';
					}
					securityUserIds += record.get('SecurityUserId');
				}

			});
			if (securityUserIds.length == 0) {
				securityUserIds = 0;
			}
			if (DA.Tracker.ProjectMain.grid.getSelectionModel().getSelections()[0]) {
				var record = DA.Tracker.ProjectMain.grid.getSelectionModel().getSelections()[0];
				store.baseParams.projectId = record.get('LookupId');
				store.baseParams.securityUserIds = securityUserIds;
			}
			//delete store.baseParams.query;
		}, this);

		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'User', dataIndex: 'SecurityUserId', displayIndex: 'User', width: 280, renderer: ExtHelper.renderer.Proxy('User'), editor: userCombo, allowBlank: false },
			{ header: 'Is Client?', dataIndex: 'IsClient', width: 100, renderer: ExtHelper.renderer.Combo(clientCombo), editor: clientCombo, allowBlank: false }
		]);

		this.on('beforeQuickSave', this.onBeforeQuickSave, this);
		return cm;
	},
	onBeforeQuickSave: function (rmsForm, params) {
		var projectUserStore = DA.Tracker.ProjectUser.grid.getStore();
		var errorMessage = '';
		for (j = 0, len = projectUserStore.data.length; j < len; j++) {
			var targetRecord = projectUserStore.getAt(j);
			if (targetRecord.get('SecurityUserId') == 0) {
				DA.Tracker.ProjectUser.grid.getSelectionModel().select(j, 0);
				DA.Tracker.ProjectUser.grid.startEditing(j, 0);
				errorMessage = "Please select user.";
			}
		}

		if (errorMessage) {
			DA.Util.ShowError('Validation error', errorMessage);
			errorMessage = undefined;
			return false;
		}

	},

});

DA.Tracker.ProjectUser = new DA.Tracker.ProjectUser();

