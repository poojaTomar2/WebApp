Cooler.IRAppRewardApproval = Ext.extend(Cooler.Form, {
	controller: 'IRAppRewardApproval',
	keyColumn: 'AssetPurityId',
	listTitle: 'IR App Reward Check',
	disableAdd: true,
	disableDelete: true,
	allowExport: true,
	securityModule: 'IRAppRewardApproval',
	constructor: function (config) {
		Cooler.IRAppRewardApproval.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'DESC', sort: 'AssetPurityId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'AssetPurityId', type: 'int', width: 150 },
			{ dataIndex: 'AssetId', type: 'int', width: 150 },
			{ header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150 },
			{ header: 'Technical Id', dataIndex: 'TechnicalIdentificationNumber', type: 'string', width: 150 },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'OutletName', width: 150 },
			{ header: 'Outlet Code', type: 'string', dataIndex: 'OutletCode', width: 150 },
			{ header: 'Store Type', type: 'string', dataIndex: 'RDCustomerName', width: 150 },
			{ header: 'UserName', type: 'string', dataIndex: 'UserName', width: 150 },
			{ header: 'Event Time', dataIndex: 'VerifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Earned Money', type: 'float', dataIndex: 'TotalEarnedMoney', width: 150 },
			{ header: 'Total Money', type: 'float', dataIndex: 'TotalMoney', width: 150, align: 'right' },
			{ dataIndex: 'PurityDateTime', type: 'date' },
			{ dataIndex: 'Columns', type: 'int' },
			{ dataIndex: 'Shelves', type: 'int' },
			{ dataIndex: 'ImageCount', type: 'int' },
			{ dataIndex: 'PurityStatus', type: 'string' },
			{ dataIndex: 'ImageName', type: 'string' }
		];
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var approveButton = new Ext.Button({ text: 'Approve', handler: this.onApproveButtonClick, scope: this });
		tbarItems.push(approveButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},

	resetGridStore: function () {
		var stroeBaseParams = this.grid.getStore().baseParams, filterFieldsLength = this.filterFields.length, filterField;
		for (var i = 0; i < filterFieldsLength; i++) {
			filterField = this.filterFields[i];
			delete stroeBaseParams[filterField];
		}
	},
	onGridCreated: function (grid) {
		grid.on("rowdblclick", this.showCoolerImageDetail, this);
	},
	cellclick: function (grid, rowIndex, e, options) {
		var cm = grid.getColumnModel();
		var column = this.cm.config[e]
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		var assetPurityId = rec.data.AssetPurityId;

	},
	onApproveButtonClick: function (sender) {
		var selectedRecord = this.grid.selModel.selections.items;
		if (selectedRecord.length < 1) {
			Ext.Msg.alert('Alert', 'Please Select One Row');
			return;
		}
		var assetPurityId = '';
		var assetPurityIds = [];
		var consumerName = '';
		var consumerNames = [];
		for (var i = 0; i < this.grid.selModel.selections.items.length; i++) {
			assetPurityId = selectedRecord[i].data.AssetPurityId;
			consumerName = selectedRecord[i].data.UserName;
			assetPurityIds.push(assetPurityId);
			consumerNames.push(consumerName);
			assetPurityId = assetPurityIds.join(",");
			consumerName = consumerNames.join(",");

		}

		Ext.Msg.confirm("Alert", "You want to Approve the Reward of  <b>" + consumerNames + "</b>&nbsp;&nbsp;?", function (btnText) {
			if (btnText === "yes") {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				mask.show();
				Ext.Ajax.request({
					url: EH.BuildUrl('IRAppRewardApproval'),
					params: {
						action: 'onRewardApprove',
						assetPurityId: assetPurityId
					},
					success: function (result, request) {
						mask.hide();
						mask.destroy();
						Ext.Msg.alert('Info', result.responseText.replace(/"/g, ''));
						Cooler.IRAppRewardApproval.grid.getStore().load();
					},
					failure: function (result, request) {
						mask.hide();
						mask.destroy();
						Ext.Msg.alert('Error', result.responseText.replace(/"/g, ''));
					},
					scope: this
				});
			}
		}, this);
	},
	zoomIn: function () {
		this.zoom(1);
	},

	zoomOut: function () {
		this.zoom(2);
	},

	zoom: function (zoomType) {
		var images = this.imagePanel.items.items;
		for (var i = 0, len = images.length; i < len; i++) {
			this.setZoomSize(images[i], zoomType);
		}

		this.imagePanel.doLayout();
	},

	setZoomSize: function (img, zoomType) {
		var oldSize = img.getSize(),
			zoomVal = 1.1,
			width = 0, height = 0,
			images, currImageIndex;
		switch (zoomType) {
			case 1:
				width = Math.round(oldSize.width * zoomVal);
				height = Math.round(oldSize.height * zoomVal);
				break;
			case 2:
				width = Math.round(oldSize.width / zoomVal);
				height = Math.round(oldSize.height / zoomVal);
				break;
		}
		var parentWidth = this.imagePanel.getSize().width;
		if (width > parentWidth) {
			img.el.setStyle('max-width', null);
		}
		else {
			img.el.setStyle('max-width', '98%');
		}
		images = this.imagePanel.items.items;
		currImageIndex = images.indexOf(img);
		if (currImageIndex > 0) {
			var prevImage = images[currImageIndex - 1], prevImageSize = prevImage.getSize();
			img.setPosition(0, prevImageSize.height);
		}
		img.setSize(width, height);
	},
	getSize: function () {
		if (!this.size) {
			this.size = this.getEl().getSize();
		}
		if (this.size.width === 0 || this.size.height === 0) {
			Ext.MsgBox.alert('Error', 'Browser not giving height or width');
		}
		return this.size;
	},

	showCoolerImageDetail: function (grid, rowIndex, e, options) {
		var cm = grid.getColumnModel();
		var column = this.cm.config[e]
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		var record = rec.data;
		this.getIRImageResult(record.AssetPurityId);
		var childItems = [];
		var btnZoomOut = new Ext.Toolbar.Button({ text: 'Zoom Out', handler: this.zoomOut, scope: this });
		var btnZoomIn = new Ext.Toolbar.Button({ text: 'Zoom In', handler: this.zoomIn, scope: this });
		var count = record.ImageCount;
		var imageId = record.AssetPurityId;
		var imageName = record.ImageName;
		var origImageName = record.StoredFilename;
		var purityDatetime = record.PurityDateTime.format('Ymd');
		if (imageName && !Ext.isEmpty(imageName)) {
			var imageNameArray = imageName.split(',');
			for (var j = 0; j < imageNameArray.length; j++) {
				var imageName = imageNameArray[j];
				var image = this.getNewImage(imageName, imageId, purityDatetime);
				childItems.push(image);
			}
		} else {
			if (origImageName && count > 1) {
				for (var i = 1; i <= count; i++) {
					var imageName = origImageName.replace('.jpg', '_' + i + '.jpg');
					var image = this.getNewImage(imageName, imageId, purityDatetime);
					childItems.push(image);
				}
			}
			else {
				if (origImageName && count == 1) {
					var origImageName = origImageName.replace('.jpg', '_' + count + '.jpg');
				}
				var image = this.getNewImage(origImageName, imageId, purityDatetime);
				childItems.push(image);
			}
		}
		childItems[0].region = 'center';
		if (childItems.length > 1) {
			childItems[1].region = 'south';
		}

		var imagePanel = new Ext.Panel({
			region: 'center',
			autoScroll: true,
			tbar: [btnZoomOut, btnZoomIn],
			items: childItems
		});
		this.imagePanel = imagePanel;
		this.calculatedResultPanel = this.getcalculatedResult();
		var iRproductList = [];
		this.iRproductList = iRproductList;

		var coolerImagePreviewWin = new Ext.Window({
			width: 1000,
			height: 650,
			layout: 'border',
			maximizable: true,
			modal: true,
			autoScroll: true,
			closeAction: 'hide',
			items: [
				imagePanel,
				this.calculatedResultPanel,
				{
					xtype: 'panel',
					itemId: 'detail',
					region: 'south',
					autoScroll: true,
					height: 110
				}]
		});
		this.coolerImagePreviewWin = coolerImagePreviewWin;
		coolerImagePreviewWin.setTitle(imageId);
		coolerImagePreviewWin.show();
	},
	getcalculatedResult: function () {
		this.calculationIRResultTemplate = new Ext.XTemplate(
			'<div class="">',
			'<table style= "border-collapse: collapse; border: 1px solid #000000;">',
			'<tpl for="ImageData">',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>ImageId</b></td>',
			'<td class = "tdIrRewardImage"> {AssetPurityId}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>UserName</b></td>',
			'<td class = "tdIrRewardImage">{IrUserName}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>OutletName</b> </td>',
			'<td class = "tdIrRewardImage">{Location}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>OutletCode </b></td>',
			'<td class = "tdIrRewardImage">{Code}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>StoreType</b></td>',
			'<td class = "tdIrRewardImage">{StoreType}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Asset Serial Number</b></td>',
			'<td class = "tdIrRewardImage">{SerialNumber}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Asset Technical Id</b></td>',
			'<td class = "tdIrRewardImage">{TechnicalIdentificationNumber}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Asset Equipment Number</b></td>',
			'<td class = "tdIrRewardImage">{EquipmentNumber}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Asset Capacity</b></td>',
			'<td class = "tdIrRewardImage">{AssetCapacity}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Image Capture Time</b></td>',
			'<td class = "tdIrRewardImage">{[this.onPurityDateTime(values)]}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Our Facings</b></td>',
			'<td class = "tdIrRewardImage">{CokeFacing}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Foreign Facings</b></td>',
			'<td class = "tdIrRewardImage">{ForeignFacing}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Empty</b></td>',
			'<td class = "tdIrRewardImage">{EmptyFacing}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Total</b></td>',
			'<td class = "tdIrRewardImage">{TotalFacing}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Occupancy/Purity</b> </td>',
			'<td class = "tdIrRewardImage">{OccupancyVsPurity}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Gold SKUs</b></td>',
			'<td class = "tdIrRewardImage">{GoldSku}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Silver SKUs</b></td>',
			'<td class = "tdIrRewardImage">{SilverSku}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Occupancy (€)</b></td>',
			'<td class = "tdIrRewardImage">{OccupancyInEuro}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Assortment (€)</b></td>',
			'<td class = "tdIrRewardImage">{AssortmentInEuro}</td>',
			'</tr>',
			'<tr>',
			'<td class = "tdIrRewardImage"><b>Total (€)</b></td>',
			'<td class = "tdIrRewardImage">{TotalMoneyInEuro}</td>',
			'</tr>',
			'</tpl>',
			'</table>',
			'</div>',

			{
				onPurityDateTime: function (record) {
					if (record.PurityDateTime) {
						//record.PurityDateTime.format(Cooler.Enums.DateFormat.PurityDate);
						var _purityDateTime = Date.parseDate(record.PurityDateTime, 'X').format('d/m/y g:i:s A');
						return Date.parseDate(record.PurityDateTime, 'X').format('d/m/y g:i:s A') + ' ' + record.GenericAbbreviation;
					}
					else {
						return '';
					}
				}
			}

		);
		var calculationIRResultPanel = new Ext.Panel({
			itemId: 'calculationIRResultPanel',
			width: '100%',
			height: '100%',
			tpl: this.calculationIRResultTemplate,
			border: false
		});
		this.calculationIRResultPanel = calculationIRResultPanel;

		var calculatedResultPanel = new Ext.Panel({
			title: 'Result',
			region: 'east',
			height: '100%',
			autoScroll: true,
			width: '35%',
			layout: 'column',
			collapsible: true,
			split: true,
			items: [
				calculationIRResultPanel
			]
		});
		return calculatedResultPanel;
	},
	getIRImageResult: function (assetPurityId) {
		Ext.Ajax.request({
			url: EH.BuildUrl('IRAppRewardApproval'),
			params: {
				action: 'onImageCalculation',
				AssetPurityId: assetPurityId
			},
			success: function (response, data) {
				if (this.saveMask)
					this.saveMask.hide();
				var iRproductList = [];
				if (response.responseText) {
					var calculationIRResultData = Ext.decode(response.responseText);
					this.calculationIRResultPanel.body.update(this.calculationIRResultTemplate.apply(calculationIRResultData));
					if (calculationIRResultData.ImageData) {
						var imageData = calculationIRResultData.ImageData[0];
						this.ImageId = imageData.AssetPurityId;
						var productData = calculationIRResultData.ProductData[0];
					}
					if (calculationIRResultData.ProductData.length > 0) {
						for (var i = 0; i < calculationIRResultData.ProductData.length; i++) {
							iRproductList.push(calculationIRResultData.ProductData[i]);

						}
					}
					if (iRproductList.length > 0) {
						var rows = [], pos = 0;
						var shelf = [];
						for (var i = 0; i < iRproductList.length; i++) {
							shelf.push(iRproductList[i].Shelf);
						}
						var maxShelf = Math.max.apply(Math, shelf);
						var rowData = [''];
						for (var index = 0; index <= iRproductList[index].Position; index++) {
							rowData.push(index);
						}
						rows.push("<td>" + rowData.join("</td><td>") + "</td>");
						for (var row = 0; row < maxShelf; row++) {
							rowData = [row + 1];
							for (var column = 0; column < iRproductList[column].Position; column++) {
								var productInfo = iRproductList[pos];
								var productClusterId = productInfo.ProductClusterId;
								var productName = productInfo.Product;
								rowData.push((productClusterId == Cooler.Enums.IRProductCluster.Gold ? '<div class="goldProduct">' : productClusterId == Cooler.Enums.IRProductCluster.Silver ? '<div class="silverProduct">' : '') + productName + (productClusterId ? '</div>' : ''));
								pos++;
							}
							rows.push("<td>" + rowData.join("</td><td>") + "</td>");
						}
						this.coolerImagePreviewWin.getComponent('detail').body.update('<table class="borderTable"><tr>' + rows.join('</tr><tr>') + '</tr></table>');
					}

				}
			},

			failure: function () {
				Ext.Msg.alert('Error', 'An error occured during loading Accuracy result.');
			},
			scope: this
		});
	},
	getNewImage: function (name, id, purityDatetime) {
		var img = new Ext.ux.Image({
			//style: {
			//	'display': 'block'
			//},
			style: 'max-width: 98%; margin: 5px; vertical-align: middle; float: inherit;',
			src: 'Controllers/CoolerImagePreview.ashx?AssetImageName=' + name + '&ImageId=' + id + '&v=' + new Date() + '&PurityDateTime=' + purityDatetime
		});
		return img;
	}
});
Cooler.IRAppRewardApproval = new Cooler.IRAppRewardApproval({ uniqueId: 'IRAppRewardApproval' });