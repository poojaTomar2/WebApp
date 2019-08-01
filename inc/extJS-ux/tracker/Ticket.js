Ext.ns("DA");

DA.Tracker = {


};


DA.Tracker.Form = Ext.extend(DA.Form, {


});
Ext.ns("DA.TicketRenderer");

DA.PriorityStatus = {
	High: 18,
	Normal: 3,
	Medium: 17
};
DA.Enums = {},
DA.Enums.TicketStatus = {
	undefined: 0,
	close: 13
};
DA.TicketRenderer.UpdateStatus = function (v, m, r) {
	switch (r.get('PriorityId')) {
		case DA.PriorityStatus.High:
			m.css = "PriorityHigh";
			break;
		case DA.PriorityStatus.Normal:
			m.css = "PriorityNormal";
			break;
		case DA.PriorityStatus.Medium:
			m.css = "PriorityMedium";
			break;
		default:
			break;
	}
	return "<span ext:qtip='" + Ext.util.Format.htmlEncode(r.data['Priority']) + "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";
};

DA.TicketRenderer.ForCreatedOn = function (v, m, r) {
	m.css = "CreatedOnandModifiedOn";
	return "<span ext:qtip='" + Ext.util.Format.htmlEncode('Created On: ' + r.data['CreatedOn'].format(ExtHelper.ShortDateTimeFormat) + '<br>Modified On:' + r.data['ModifiedOn'].format(ExtHelper.ShortDateTimeFormat)) + "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";

};
DA.Tracker.Ticket = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Ticket: {0}',
		listTitle: 'Ticket',
		keyColumn: 'TicketId',
		captionColumn: 'TicketNumber',
		controller: 'Tracker_Ticket',
		disableDelete: true,
		defaultSearchField: 'TicketNumber',
		reloadAfterSave: true,
		options: {
			saveMask: true
		},
		gridConfig: {
			preserveSelection: false,
			autoFilter: true,
			prefManager: true,
			groupField: 'Status',
			viewConfig: { hideGroupedColumn: true },
			title: null,
			custom: {
				quickSearch: {
					addColumns: false,
					indexes: [
	                        { text: 'Status', dataIndex: 'Status' },
							{ text: 'Description', dataIndex: 'Description' }
					]
				}
			}
		},
		comboTypes: ['AssociationType', 'TicketList'],
		winConfig: { width: 1000, height: 640 }
	});
	DA.Tracker.Ticket.superclass.constructor.call(this, config);
};

Ext.extend(DA.Tracker.Ticket, DA.Tracker.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'TicketId', type: 'int' },
		{ name: 'ProjectId', type: 'int' },
		{ name: 'Project', type: 'string' },
		{ name: 'TicketNumber', type: 'int' },
		{ name: 'TicketTypeId', type: 'int' },
		{ name: 'TicketType', type: 'string' },
		{ name: 'Title', type: 'string' },
		{ name: 'Description', type: 'string' },
		{ name: 'StatusId', type: 'int' },
		{ name: 'Status', type: 'string' },
		{ name: 'PriorityId', type: 'int' },
		{ name: 'Priority', type: 'string' },
		{ name: 'MilestoneId', type: 'int' },
		{ name: 'Milestone', type: 'string' },
		{ name: 'AssignedToUserId', type: 'int' },
		{ name: 'AssignedToUser', type: 'string' },
		{ name: 'CreatedBy', type: 'string' },
		{ name: 'CreatedByUserId', type: 'int' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedBy', type: 'string' },
		{ name: 'ModifiedByUserId', type: 'int' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'Company', type: 'string' },
		{ name: 'DurationFromCreated', type: 'string' },
		{ name: 'DurationFromLastModified', type: 'string' },
		{ name: 'EstimatedHours', type: 'float' },
		{ name: 'ActualHours', type: 'float' },
		{ name: 'Component', type: 'string' },
		{ name: 'AttachmentCount', type: 'int' },
		{ name: 'EstimatedCompletedDate', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'Type', type: 'string' },
		{ name: 'TypeId', type: 'int' },
		{ name: 'CommentTypeId', type: 'int' },
		{ name: 'CommentType', type: 'string' },
		{ name: 'FeedBackText', type: 'string' },
		{ name: 'Rating', type: 'string' }

	]),
	beforeShowList: function (config) {
		if (!config.projectId) {
			config.disableAdd = true;
		}
	},
	comboStores: {
		AssociationType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		TicketList: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	formItems: [],

	init: function () {
		var projectId = this.projectId;
		var projectName = this.projectName;
		var hasProjectId = true;
		if (!projectId) {
			hasProjectId = false;
			projectName = 'All';
		}
		this.formTitle = 'Ticket: ' + projectName + ' - {0}';
		this.listTitle = 'Tickets: ' + projectName;
		this.uniqueId = "Tickets-" + projectId;
		this.baseParams = { ProjectId: projectId };
		var cols = [
			{ header: 'Ticket#', dataIndex: 'TicketNumber', width: 40 }
		];
		//if (!hasProjectId) {
		if (DA.Security.info.Tags.HasMoreThanOneProject == 'true') {
			cols.push({ header: 'Project', dataIndex: 'Project', width: 100 });
		}

		cols = cols.concat([
			{ header: 'Title', dataIndex: 'Title', width: 375 },
			{ header: 'Status', dataIndex: 'Status', width: 75 },
			{ header: 'Priority', dataIndex: 'Priority', width: 50, renderer: DA.TicketRenderer.UpdateStatus, align: 'center' },
			{ header: 'Milestone', dataIndex: 'Milestone', width: 60 },
			{ header: 'Assigned To', dataIndex: 'AssignedToUser', width: 120 },
			{ header: 'Component', dataIndex: 'Component', width: 60 },
			{ header: 'Type', dataIndex: 'TicketType', width: 60 },
			{ header: 'Comment Type', dataIndex: 'CommentType', width: 60 },
			{ header: 'Rating', dataIndex: 'Rating', width: 60 },
		//{ header: 'Created On', dataIndex: 'CreatedOn', width: 100, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created by', dataIndex: 'CreatedBy', width: 100 },
		//{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 100, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Days since creation', dataIndex: 'DurationFromCreated', width: 35 },
			{ header: 'Days since update', dataIndex: 'DurationFromLastModified', width: 35 },
		    { header: 'Dates', dataIndex: 'DurationFromLastModified', width: 30, renderer: DA.TicketRenderer.ForCreatedOn, align: 'center' },
			{ header: 'Att.', dataIndex: 'AttachmentCount', width: 30 },
			{ header: 'Feed Back', dataIndex: 'FeedBackText', width: 50 },
			{ header: 'Last Modified By', dataIndex: 'ModifiedBy', width: 50 }
		]);

		var cm = new Ext.grid.ColumnModel(cols);

		this.cm = cm;

	},
	show: function (associationId, associationTypeId, primaryKeyId) {
		var additionalItems;
		var comboValues;

		var loadFormInfo = function (options) {
			var scope = options.scope;
			delete options.scope;

			fillFormParams = {};
			fillFormParams.action = 'loadAdditionalform';
			fillFormParams.associationId = associationId;
			fillFormParams.associationTypeId = 1;
			fillFormParams.primaryKeyId = primaryKeyId;
			ExtHelper.GenericConnection.request({

				url: 'Controllers/Ticket.ashx',
				params: fillFormParams,
				callback: function (o, success, response) {
					if (!success) {
						canContinue = false;
						Ext.Msg.alert('An error occurred', 'An error occurred');
					}
					else {
						var container = this.additionalPanel.items.items;
						if (container.length > 1) {
							return;
						}

						var fillFormParams = {};
						Ext.apply(fillFormParams, Ext.util.JSON.decode(response.responseText));
						additionalItems = fillFormParams.data;

						var options = {};
						options.additionalItems = additionalItems;
						options.scope = scope;
						//We've got the data now prepare form
						createFormItems(options);


						//TODO: Remove previous form fields
						/*
						for (var i = 0; i < container.length; i++) {
						var obj = Ext.getCmp(container[i].id);
						alert(obj.id);
						container.remove(obj);
						}
						*/
						for (var i = 0; i < this.formItems.length; i++) {
							this.additionalPanel.add(this.formItems[i]);
						}
						this.additionalPanel.doLayout();

						this.formPanel.doLayout();
					}

				}, scope: scope
			}, scope);
		}

		var createFormItems = function (options) {
			var records = options.additionalItems;
			var scope = options.scope;
			var items = [];

			for (var i = 0; i < records.length; i++) {
				var rConfig = records[i];
				var field;
				switch (rConfig.fieldType) {
					case WA.Defaults.FieldType.TextBox: // TextBox
						field = new Ext.form.TextField(rConfig);
						break;
					case WA.Defaults.FieldType.DateField: // DateField
						field = new Ext.form.DateField(rConfig);
						break;
					case WA.Defaults.FieldType.DropDown: // DropDown
						field = DA.combo.create(rConfig);
						ExtHelper.SetComboValue(field, rConfig.value);
						break;
					case WA.Defaults.FieldType.CheckBox: // Checkbox
						field = new Ext.form.Checkbox(rConfig);
						field.checked = rConfig.isChecked;
						break;
					case WA.Defaults.FieldType.TextArea: // TextArea
						field = new Ext.form.TextArea(rConfig);
						break;
					case WA.Defaults.FieldType.NumberField: // NumberField
						field = new Ext.form.NumberField(rConfig);
						break;
				}
				items.push(field);
			}
			scope.formItems = items; //Temporary - fix with this
		}

		loadFormInfo({ scope: this });
	},

	saveAdditionalPanel: function (associationId, associationTypeId, primaryKeyId) {
		saveFormParams = {};
		saveFormParams.action = 'saveAdditionalform';
		saveFormParams.associationId = associationId;
		saveFormParams.associationTypeId = 1;
		saveFormParams.primaryKeyId = primaryKeyId;
		ExtHelper.GenericConnection.request({
			url: 'Controllers/Ticket.ashx',
			params: saveFormParams,
			callback: function (o, success, response) {
				if (!success) {
					canContinue = false;
					Ext.Msg.alert('An error occurred', 'An error occurred');
				}
			}
		});
	},

	addlFormFields: {},
	onCloseStatus: function () {
		if (!this.statusFormPanel.form.isValid()) {
			Ext.MessageBox.alert('Alert', 'Please correct data');
			return;
		}
		var params = {};
		params.action = 'dataSaved';
		params.RatingId = this.ratingId.getValue();
		params.Feedback = this.feedback.getValue();
		params.Id = this.activeRecordId;
		ExtHelper.GenericConnection.request({
			url: EH.BuildUrl('Tracker_Ticket'),
			params: params,
			scope: this,
			callback: function (o, success, response) {
				var data = Ext.util.JSON.decode(response.responseText);
				if (data.info) {
					Ext.Msg.alert('Error', data.info);
				}
				else {
					this.win.allowHide = true;
					this.hideFormWin();
					Ext.MessageBox.alert('Message', 'Thanks for your feedback');
					this.statusWin.hide();
					this.grid.getStore().load();
				}
			}
		});
	},
	fields: {},
	createForm: function (config) {

		var additionalPanel = new Ext.Panel({
			autoScroll: true,
			border: false,
			layout: 'form',
			columnWidth: .5,
			items: []
		});
		this.additionalPanel = additionalPanel;
		var projectId = this.projectId = 0 ? DA.Tracker.ProjectReport.grid.getSelectionModel().getSelections()[0].data.ProjectId : this.projectId;

		var assignedToCombo = new ExtHelper.CreateCombo({ colspan: 2, fieldLabel: 'Assigned To', hiddenName: 'asignedToUserId', width: 250, baseParams: { comboType: 'ProjectUser' }, disabled: true });
		var statusCombo = new ExtHelper.CreateCombo({ fieldLabel: 'Status', hiddenName: 'statusId', allowBlank: false, baseParams: { comboType: 'Status' }, disabled: true });
		var title = new Ext.form.TextField({ colspan: 3, fieldLabel: 'Title', name: 'Title', xtype: 'textfield', maxLength: 255, allowBlank: false, width: 486 });
		var typeCombo = new ExtHelper.CreateCombo({ fieldLabel: 'Type', hiddenName: 'TicketTypeId', baseParams: { comboType: 'TicketType' } });
		var ratingCombo = new ExtHelper.CreateCombo({ fieldLabel: 'Rating', hiddenName: 'RatingId', baseParams: { comboType: 'RatingType' }, disabled: true });
		var commentType= new ExtHelper.CreateCombo({ fieldLabel: 'Comment', hiddenName: 'CommentTypeId', baseParams: { comboType: 'CommentType' } });
		DA.Tracker.Ticket.typeCombo = typeCombo;
		var items = [
			 title,
            { colspan: 3, fieldLabel: 'Description', name: 'Description', xtype: 'htmleditor', maxLength: 50, width: 486, height: 120, enableFont: false, enableColor: false },
			assignedToCombo,
			statusCombo,
			ExtHelper.CreateCombo({ fieldLabel: 'Priority', hiddenName: 'PriorityId', allowBlank: false , baseParams: { comboType: 'Priority' } }),
			ExtHelper.CreateCombo({ fieldLabel: 'Milestone', hiddenName: 'MilestoneId', baseParams: { comboType: 'Milestone' } }),
			ExtHelper.CreateCombo({ fieldLabel: 'Component', hiddenName: 'ComponentId',allowBlank: false , baseParams: { comboType: 'Component' } }),
			typeCombo,
			commentType,
			ratingCombo
		];
		var ticketAssociationGrid = DA.Tracker.TicketAssociation.createGrid({ title: 'Association', height: 300, region: 'center', root: 'TicketAssociations', allowPaging: false, editable: true });
		var grids = [];
		grids.push(ticketAssociationGrid);
		this.commentType=commentType;
		var formConfig = {
			autoScroll: true,
			items: items,
			layout: 'tableform',
			bodyStyle: 'padding: 5px;',
			layoutConfig: { columns: 3 },
			labelAlign: 'top'
		};
		var attachmentObj = new DA.Attachment();
		var attachmentGrid = attachmentObj.createGrid({ title: 'Attachments ({0})', plugins: [new DA.plugins.GridTitleCount()] });
		var privateActivityPanel = new Ext.Panel({ title: 'Private Activity', autoScroll: true, flex: 2 });
		var savePanel = new Ext.Panel({ title: 'Save', autoScroll: true, html: '<b>Save the ticket to enable other options</b>' });
		var activityPanel = new Ext.Panel({
			title: 'Activity',
			layout: 'border',
			id: 'tabPanel',
			flex: 1,
			items: [
				{
					xtype: 'panel',
					title: 'Public Activity',
					id: 'fristPanel',
					height: 240,
					autoScroll: true,
					region: 'north',
					split: true
				}, {
					xtype: 'panel',
					title: 'Private Activity',
					id: 'secondPanel',
					autoScroll: true,
					region: 'center'
				}
			]
		});
		this.activityPanel = activityPanel;
		var tabPanel = new Ext.TabPanel({
			activeTab: 0,
			defaults: { border: false },
			items: [
			savePanel,
			activityPanel,
			attachmentGrid
			// ticketAssociationGrid
			]
		});
		var assignedToComboInBottomPanel = ExtHelper.CreateCombo({ fieldLabel: 'Assign To', hiddenName: 'AssignedToUserId', baseParams: { comboType: 'ProjectUser' }, listWidth: 230, controller: "combo", allowBank: false });
		assignedToComboInBottomPanel.store.on('beforeload', function (store, options) {
			assignedToComboInBottomPanel.lastQuery = null;
			if (DA.Tracker.ProjectReport.grid.getSelectionModel().getSelections()[0]) {
				var projectId = DA.Tracker.ProjectReport.grid.getSelectionModel().getSelections()[0].data.ProjectId;
				store.baseParams.projectId = projectId;
				store.baseParams.isAssigenedUser = true;
			}
			delete store.baseParams.query;
		}, this);

		var statuscomboInBottomPanel = ExtHelper.CreateCombo({ fieldLabel: 'Status', hiddenName: 'StatusId', allowBlank: false, baseParams: { comboType: 'Status' } });
		var estimatedHours = new Ext.form.NumberField({ fieldLabel: 'Estimated Hours', name: 'EstimatedHours', width: 70, region: 'west', allowNegative: false, minValue: 0, maxValue: 999 });
		var actualHours = new Ext.form.NumberField({ fieldLabel: 'Actual Hours', name: 'ActualHours', width: 70, region: 'center', allowNegative: false, minValue: 0, maxValue: 999 });
		var estimatedCompletedDate = new Ext.form.DateField({ fieldLabel: 'Estimated Completed Date', name: 'EstimatedCompletedDate', xtype: 'datefield', width: 153 });
		var commentsBox = new Ext.form.TextArea({ name: 'comments', maxLength: 50, width: 486, height: 120, border: true, valign: 'top', enableFont: false, enableColor: false });
		this.fields.assignedToComboInBottomPanel = assignedToComboInBottomPanel;
		this.fields.statuscomboInBottomPanel = statuscomboInBottomPanel;

		var commentsPanel = {
			layout: 'tableform',
			layoutConfig: { columns: 3 },
			autoScroll: true,
			title: 'Comments',
			defaults: { border: false, labelWidth: 50, layout: 'form' },
			labelAlign: 'top',
			bodyStyle: 'padding: 5px;',
			items: [
		{
			layout: 'table',
			colspan: 3,
			items: [commentsBox]
		}, {
			colspan: 2,
			items: [assignedToComboInBottomPanel]
		}, {
			labelWidth: 92,
			items: [statuscomboInBottomPanel]
		}, {
			items: [estimatedHours]
		}, {
			items: [actualHours]
		}, {
			colspan: 3,
			labelWidth: 92,
			items: [estimatedCompletedDate]
		}, {
			colspan: 3,
			labelWidth: 92,
			items: [additionalPanel]
		}
			]
		};
		statuscomboInBottomPanel.on('Change', function (combo, newValue, oldValue) {
			var ratingId = ExtHelper.CreateCombo({ fieldLabel: 'Rating', hiddenName: 'RatingId', width: 200, allowBlank: false, baseParams: { comboType: 'RatingType' }, controller: "Combo" });
			var feedback = new Ext.form.TextArea({ fieldLabel: 'Feedback', name: 'Feedback', maxLength: 50, width: 475, height: 120,allowBlank: false });
			this.ratingId = ratingId;
			this.feedback = feedback;
			var submitBtn = new Ext.Button({
				xtype: 'button',
				text: 'Send',
				scope: this,
				handler: this.onCloseStatus
			});

			this.feedback = feedback;
			var statusFormPanel = new Ext.form.FormPanel({
				collapsible: false,
				items: [ratingId, feedback, submitBtn]
			});

			this.statusFormPanel = statusFormPanel;
			if (newValue == DA.Enums.TicketStatus.close) {
				var win = new Ext.Window({
					width: 600,
					height: 200,
					modal: true,
					title: 'Send Feedback',
					border: true,
					layoutConfig: {
						animate: true,
					},
					items: statusFormPanel
				})
				this.statusWin = win;
				this.statusWin.show();
			}
		}, this);
		this.childGrids = grids;
		this.childModules = [DA.Tracker.TicketAssociation];

		this.on('afterSave', function (obj, form, action) {
			commentsBox.setValue('');
			//this.saveAdditionalPanel(action.result.data.Id);
		});
		this.on('beforeSave', function (obj, form, action) {
			if (commentsBox.getValue().length>0 && this.commentType.getValue() == 0)
			{
				var focusField, errorMessage = 'Select a Comment Type.';
				focusField = this.commentType.focus();
				if (errorMessage) {
					if (focusField) {
						Ext.Msg.alert('Validation error', errorMessage, function () { focusField.focus(); });
						return false;
					} else {
						DA.Util.ShowError('Validation error', errorMessage);
						errorMessage = undefined;
					}
				}
			}
			//this.saveAdditionalPanel(action.result.data.Id);
		});
		this.on('dataLoaded', function (shikharForm, data) {
			commentsBox.setValue('');
			var formData = data.data;
			commentsBox.focus(true, 300);

			DA.Tracker.Ticket.myId = formData.Id;

			assignedToCombo.setValue(formData.AssignedToUser)
			ExtHelper.SelectComboValue(statusCombo, statuscomboInBottomPanel.getValue());
			this.ProjectId = data.data.ProjectId;

			var ticketId = data.data.Id;
			if (isNaN(data.data.Id)) {
				ticketId = 0;
			}
			var isNew = ticketId == 0;
			commentsBox.setDisabled(isNew);
			tabPanel.setDisabled(isNew);
			tabPanel.activate(isNew ? 0 : 1);
			if (isNew) {
				tabPanel.unhideTabStripItem(savePanel);
				title.focus(true, 300);
			} else {
				tabPanel.hideTabStripItem(savePanel);
				commentsBox.focus(true, 300);
				Ext.apply(attachmentGrid.baseParams, {
					AssociationType: 'Ticket',
					AssociationId: ticketId
				});
				attachmentObj.SetAssociationInfo('Ticket', ticketId);
				attachmentGrid.loadFirst();
				//assignedToComboInBottomPanel.getStore().baseParams.ProjectId = projectId;
			}
			if (data.moreInfo) {
				var privateCommentData = { commentData: data.moreInfo.PrivateComment || [] };
				var publicCommentData = { commentData: data.moreInfo.PublicComment || [] };
				this.commentTpl.overwrite(Ext.getCmp('fristPanel').body, publicCommentData);
				if (DA.Security.info.Tags.IsEligibleForPrivateComment == 1) {
					this.commentTpl.overwrite(Ext.getCmp('secondPanel').body, privateCommentData);
				}
			}
		});

		Ext.apply(formConfig, {
			region: 'north',
			height: 330,
			split: true
		});

		Ext.apply(commentsPanel, {
			region: 'center'
		});

		Ext.apply(tabPanel, {
			region: 'center'
		});

		Ext.apply(config, {
			layout: 'border',
			items: [
				{ region: 'west', width: 517, layout: 'border', defaults: { border: false }, split: true, items: [formConfig, commentsPanel] },
				tabPanel
			]
		});

		return config;
	},
	commentTpl: function () {
		var tpl = new Ext.XTemplate(
			'<tpl for="commentData">',
			'<tpl if="xindex &gt; 1">',
			'<hr />',
			'</tpl>',
			'By <b>{CreatedByUser}</b> on <b>{[this.formatDate(values)]}</b>: Reassigned to <b>{ReassignedTo}</b> Status changed to <b>{NewStatus}</b><br />',
			'<p>{Comments}</p>',
			'</tpl>', {
				formatDate: function (v) {
					return Date.parseDate(v.CreatedOn, 'X').format('m/d/y g:i:s a');
				}
			}
		).compile();

		return tpl;
	}()

});

//------------------
// Associations
//------------------

DA.Tracker.TicketAssociation = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Tracker Ticket Association: {0}',
		listTitle: 'Tracker Ticket Association',
		keyColumn: 'Id',
		captionColumn: null,
		gridIsLocal: true
	});
	DA.Tracker.TicketAssociation.superclass.constructor.call(this, config);
};

Ext.extend(DA.Tracker.TicketAssociation, DA.Tracker.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'AssociationTypeId', type: 'int' },
		{ name: 'OldTicket0Id', type: 'int' },
		{ name: 'NewTicketId', type: 'int' }
	]),
	cm: function () {
		var associationTypeCombo = DA.combo.create({ store: this.comboStores.AssociationType, mode: 'local', allowBlank: false });
		var ticketListCombo = DA.combo.create({ store: this.comboStores.TicketList, mode: 'local', allowBlank: false });
		var cm = new Ext.ux.grid.ColumnModel([
				{ header: 'AssociationType', dataIndex: 'AssociationTypeId', width: 100, renderer: ExtHelper.renderer.Combo(associationTypeCombo), editor: associationTypeCombo },
				{ header: 'Ticket No.', dataIndex: 'NewTicketId', width: 100, renderer: ExtHelper.renderer.Combo(ticketListCombo), editor: ticketListCombo }
		]);
		return cm;
	}
});

DA.Tracker.TicketAssociation = new DA.Tracker.TicketAssociation();

DA.Tracker.TicketAll = new DA.Tracker.Ticket();
