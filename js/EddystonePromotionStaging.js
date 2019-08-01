Cooler.EddystonePromotionStaging = new Cooler.Form({
	keyColumn: 'EddystonePromotionStagingId',
	captionColumn: 'EddystonePromotionStaging',
	controller: 'EddystonePromotionStaging',
	title: 'Eddystone Promotion Staging',
	logoUrl: './FileServer/EddystonePromotion/',
	logoUrlNew: './FileServer/EddystonePromotionStaging/',
	securityModule: 'EddystonePromotionStaging',
	comboTypes: [
		'Client'
	],
	gridConfig: {
		custom: {
			loadComboTypes: true
		}
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	saveAndNew: false,
	saveClose: false,
	disableDelete: true,
	disableAdd: true,
	hybridConfig: function () {
		return [
			{ dataIndex: 'EddystonePromotionId', type: 'int' },
			{ dataIndex: 'LocationId', type: 'int' },
			{ header: 'Id', dataIndex: 'EddystonePromotionStagingId', type: 'int' },
			{ header: 'Eddystone Promotion Old Text', dataIndex: 'EddystonePromotionOldText', type: 'string' },
			{ header: 'Eddystone Promotion New Text', dataIndex: 'EddystonePromotionNewText', type: 'string' },
			{ header: 'EddySton Promotion Outlet', dataIndex: 'EddystonePromotionStagingOutlet', width: 250, type: 'string' },
			{ header: 'Is Approved', dataIndex: 'IsApproved', width: 250, type: 'bool', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Client ', dataIndex: 'ClientId', displayIndex: 'Client', type: 'int', store: this.comboStores.Client, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		];
	},

	createForm: function (config) {
		var logoField = new Ext.ux.Image({ height: 400, width: 250, src: "" });
		var me = this;
		var eddystonePromotionNewText = {
			fieldLabel: 'Eddystone Promotion New Text',
			id: 'EddystonePromotionNewText',
			name: 'EddystonePromotionNewText',
			xtype: 'textfield',
			width: 200,
			allowBlank: false,
			disable: true,
			regex: new RegExp('^[0-9A-Fa-f]+$'),
			regexText: 'Only 64 Characters are allowed',
			maxLength: 64
		};
		var btnPreview = new Ext.Toolbar.Button({ text: 'Preview', handler: this.onPreviewButton, scope: this });
		//var eddystonePromotionOutlet = { fieldLabel: 'Eddystone Promotion Outlet', name: 'EddystonePromotionStagingOutlet', xtype: 'textfield', width: 250, allowBlank: false, disable: true };
		//var clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 160, baseParams: { comboType: 'Client' } });
		this.eddystonePromotionNewText = eddystonePromotionNewText;
		this.btnPreview = btnPreview;
		//this.eddystonePromotionOutlet = eddystonePromotionOutlet;
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			labelWidth: 150,
			items: [{
				border: false,
				layout: 'form',
				//defaultType: 'textfield',
				labelWidth: 160,
				bodyStyle: 'padding: 10px',
				items: [this.eddystonePromotionNewText, logoField]
			}, {
				border: false,
				layout: 'form',
				bodyStyle: 'padding: 10px',
				items: [this.btnPreview]
			}]
		});

		this.logoField = logoField;
		//this.clientCombo = clientCombo;

		this.on('dataLoaded', function (consumerForm, data) {
			var clientId = Number(DA.Security.info.Tags.ClientId);
			if (clientId != 0) {
				ExtHelper.SetComboValue(this.clientCombo, clientId);
				this.clientCombo.setDisabled(true);
			}

			var record = data.data;
			if (!this.mask) {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			Ext.Ajax.request({
				url: 'Controllers/EddystonePromotionStaging.ashx',
				params: {
					action: 'GetImageWithText', EddystonePromotionStagingId: record.Id, EddystonePromotionId: record.EddystonePromotionId, NewText: record.EddystonePromotionNewText
				},
				success: this.onImageWithTextSuccess,
				failure: function (result, request) {
					Cooler.loadThumbnail(this, record, this.logoUrl + "/userProfileNoImage.png");
				},
				scope: this
			});
		});

		return config;
	},

	onApproveButton: function (val, form) {
		var selectedRecords = this.grid.getSelectionModel().getSelections();
		if (selectedRecords != undefined) {
			var eddystonPromotionId;
			var eddystonPromotionStagingId;
			var locationId;
			var imageUrl;
			var newText;
			eddystonPromotionId = selectedRecords[0].data.EddystonePromotionId;
			eddystonPromotionStagingId = selectedRecords[0].data.EddystonePromotionStagingId;
			locationId = selectedRecords[0].data.LocationId;
			newText = Ext.getCmp('EddystonePromotionNewText').getValue();
			//newText = selectedRecords[0].data.EddystonePromotionNewText;
			imageUrl = this.imageUrl;
			//}
			if (!this.mask) {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			Ext.Ajax.request({
				url: 'Controllers/EddystonePromotionStaging.ashx',
				params: {
					action: 'Approve', EddystonePromotionStagingId: eddystonPromotionStagingId, EddystonePromotionId: eddystonPromotionId, NewText: newText, LocationId: locationId
				},
				success: this.onApproveSuccess,
				failure: function (result, request) {
					this.mask.hide();
					Ext.Msg.alert('Alert', JSON.parse(result.responseText));
				},
				scope: this
			});

		}
	},

	onApproveSuccess: function (result, request) {
		this.mask.hide();
		function processResult(btn) {
			this.win.allowHide = true;
			this.win.hide();
			this.grid.store.reload();
		}
		Ext.Msg.show({
			title: 'Success',
			msg: Ext.decode(result.responseText).data,
			buttons: Ext.Msg.OK,
			fn: processResult,
			width: 250,
			scope: this
		});
	},

	onPreviewButton: function (val, form) {
		var selectedRecords = this.grid.getSelectionModel().getSelections();
		if (selectedRecords != undefined) {
			var eddystonPromotionId;
			var eddystonPromotionStagingId;
			var imageUrl;
			var newText;

			eddystonPromotionId = selectedRecords[0].data.EddystonePromotionId;
			eddystonPromotionStagingId = selectedRecords[0].data.EddystonePromotionStagingId;
			newText = Ext.getCmp('EddystonePromotionNewText').getValue();//selectedRecords[0].data.EddystonePromotionNewText;
			imageUrl = this.imageUrl;

			if (!this.mask) {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			Ext.Ajax.request({
				url: 'Controllers/EddystonePromotionStaging.ashx',
				params: {
					action: 'GetImageWithText', EddystonePromotionStagingId: eddystonPromotionStagingId, EddystonePromotionId: eddystonPromotionId, NewText: newText
				},
				success: this.onImageWithTextSuccess,
				failure: function (result, request) {
					Cooler.loadThumbnail(this, record, this.logoUrl + "/userProfileNoImage.png");
				},
				scope: this
			});
		}
	},

	onImageWithTextSuccess: function (result, request) {
		this.mask.hide();
		var imageUrl = Ext.decode(result.responseText).data;
		var imageUrl = this.logoUrlNew + imageUrl + '.png';
		this.imageUrl = imageUrl;
		this.logoField.setSrc((this.imageUrl != undefined && this.imageUrl != '') ? this.imageUrl : this.logoUrl + "/userProfileNoImage.png", true);
	},


	onFailure: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},

	CreateFormPanel: function (config) {
		var approveButton = new Ext.Button({ text: 'Approve', handler: this.onApproveButton, scope: this });
		this.approveButton = approveButton;
		config.tbar.push(approveButton);
		Ext.apply(config, {
			region: 'Center',
			height: 280
		});
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			modal: 'false',
			defaults: {
				border: false,
				bodyStyle: 'padding: 5px'
			},
			height: 550,
			width: 500,
			items: [this.formPanel]
		});
	}
});

