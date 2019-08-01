Cooler.UnprocessedCoolerImage = Ext.extend(Cooler.Form, {
	formTitle: 'Schedule Images: {0}',
	listTitle: 'Schedule Images',
	keyColumn: 'AssetPurityId',
	controller: 'AssetPurity',
	disableAdd: true,
	disableDelete: true,
	securityModule: 'ScheduleImages',
	constructor: function (config) {
		Cooler.UnprocessedCoolerImage.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'PurityDateTime' } },
			sm: new Ext.grid.RowSelectionModel({ singleSelect: true })
		});
	},
	hybridConfig: function () {
		var assetPurityStatusCombo = DA.combo.create({ store: this.comboStores.AssetPurityStatus });
		var items = [
			{ dataIndex: 'AssetPurityId', type: 'int' },
			{ dataIndex: 'AssetId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ dataIndex: 'AssignedOn', type: 'date' },
			{ dataIndex: 'SerialNumber', type: 'string' },
			{ dataIndex: 'PurityDateTime', type: 'date' },
			{ dataIndex: 'VerifiedOn', type: 'date' },
			{ dataIndex: 'ImageName', type: 'string' },
			{ dataIndex: 'ImageCount', type: 'int' },
			{ dataIndex: 'Location', type: 'string' }
		];

		if (this.uniqueId == "AssetPurity") {
			items.push({ dataIndex: 'ModifiedByUser', type: 'string', header: 'Verified By', width: 150 });
		}

		return items;
	},
	onTabActivate: function (tab) {
		if (this.grid) {
			this.grid.store.load();
		}
	},
	afterShowList: function (config) {
		config.tab.on('activate', this.onTabActivate, this);
	},
	onRowClick: function (grid, record) {
		var store;
		var record = grid;
		if (!record) {
			return;
		}
		var imagePreview = this.imagePreview;
		// setting Image scouce to balnk first.
		var count = record.get('ImageCount');
		var imagePanel = this.imagePreview.items.items[0].getComponent('imagePreview');
		imagePanel.removeAll(true);
		var image = "";
		var origImageName = record.get('ImageName');
		if (origImageName && origImageName.split(',').length > 1) {
			var sceneImageArray = origImageName.split(',');
			var totalImagesInScene = sceneImageArray.length;
			for (var i = 0; i < totalImagesInScene; i++) {
				var imageName = sceneImageArray[i];
				image = this.getNewImage(imageName, record.get('AssetPurityId'), record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate), count);
				imagePanel.add(image);
			}
		} else if (origImageName && origImageName.split('_') > 1) {
			image = this.getNewImage(origImageName, record.get('AssetPurityId'), record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate), count);
			if (image != undefined) {
				imagePanel.add(image);
			}
		}
		else {

			if (count > 1) {
				for (var i = 1; i <= count; i++) {
					var imageName = origImageName.replace('.jpg', '_' + i + '.jpg');
					image = this.getNewImage(imageName, record.get('AssetPurityId'), record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate));
					imagePanel.add(image);
				}
			}
			else {
				image = this.getNewImage(origImageName.replace('.jpg', '_1.jpg'), record.get('AssetPurityId'), record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate));
				imagePanel.add(image);
			}
		}
		imagePanel.doLayout();
		this.transformations.zoom = 0;
		this.transformations.defaultImageSize = [];
		var toolbarItems = this.imagePreview.topToolbar.items;
		var recordData = record.data;
	},
	Referesh: function () {
		this.grid.store.load();
	},
	configureListTab: function (config) {

		this.transformations = {
			rotate: 0,
			zoom: 0,
			defaultImageSize: []
		};

		var grid = this.grid;
		this.scheduleImageCount = new Ext.form.Label({ html: '' });
		this.imageId = new Ext.form.Label({ html: '' });
		this.coolerSerialNumber = new Ext.form.Label({ html: '' });
		this.outletname = new Ext.form.Label({ html: '' });
		this.imageDateTime = new Ext.form.Label({ html: '' });
		var btnRefresh = new Ext.Toolbar.Button({ text: '<b>&nbsp;Refresh</b>', scope: this, itemId: 'btnSerialNumber', handler: this.Referesh, iconCls: 'refresh' });
		var imagePreview = new Ext.Panel({
			title: 'Image',
			region: 'center',
			layout: 'border',
			autoScroll: true,
			overflowX: 'scroll',
			cls: 'tbarCls',
			tbar: ['<b>Scheduled Images Count:</b> ', this.scheduleImageCount, '&nbsp;|', ' <b>Image ID:</b> ', this.imageId, '|', ' <b>Cooler Serial Number:</b> ', this.coolerSerialNumber, '|', ' <b>Outlet Name:</b> ', this.outletname, '|', ' <b>Image Date/ Time:</b> ', this.imageDateTime, '| ', btnRefresh],   //, 'Scheduled Images Count: ', this.scheduleImage
			items: [
				new Ext.Panel({
					region: 'center',
					layout: 'fit',
					bodyStyle: "text-align: center;",
					items: [
						{
							itemId: 'imagePreview',
							autoScroll: true,
							xtype: 'panel',
							layout: 'column'
						}
					]
				})
			]
		});
		this.imagePreview = imagePreview;
		var westItems = [];
		var imageRecognitionContentStatusItems = Cooler.comboStores.ImageRecognitionContentStatus.data.items;
		var len = imageRecognitionContentStatusItems.length;

		var btnHTML = '';
		for (var i = 0; i < len; i++) {
			var btnText = imageRecognitionContentStatusItems[i].data.DisplayValue;
			var btnId = imageRecognitionContentStatusItems[i].data.LookupId;
			btnHTML += '<div style="margin-top: 13%; text-align: center;"><button type="button" class="responciveTextSize" onclick="Cooler.UnprocessedCoolerImage.onShowButtonClick(this)" id=' + btnId + ' style = " width: 80%; line-height: 150%;">' + btnText + '</button></div>';
		}
		var westPanel = new Ext.Panel(
			{
				region: 'east',
				width: 400,
				autoScroll: true,
				split: true,
				pack: 'center',
				hidden: false,
				html: btnHTML,
				items: westItems,
				layout: 'anchor',
				listeners: { resize: this.resizeButtonTest }
			});
		this.westPanel = westPanel;

		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [imagePreview, westPanel]
		});
		grid.store.on('beforeload', function () {
			this.startIndex = 0;
			var record = this.grid.getStore().data.items[0];
			this.grid.baseParams.limit = 1;
		}, this);
		grid.store.on('load', function () {
			this.startIndex = 0;
			this.record = null;
			var comboStore = Cooler.comboStores.ImageRecognitionContentStatus.data.items;
			var len = comboStore.length;
			if (this.grid.getStore().data.items.length == 0) {
				var imagePreview = this.imagePreview;
				var westPanel = this.westPanel;
				var imagePanel = this.imagePreview.items.items[0].getComponent('imagePreview');
				imagePanel.removeAll(true);
				for (var i = 0; i < len; i++) {
					var btnId = comboStore[i].data.LookupId;
					if (document.getElementById(btnId)) {
						document.getElementById(btnId).setAttribute('disabled', true);
					}
				}
				if (document.getElementById('0')) {
					document.getElementById('0').setAttribute('disabled', true);
				}
				var scheduleImages = 0;
				if (this.grid.getStore != undefined) {
					scheduleImages = this.grid.getStore().totalLength;
				}
				this.imageId.setText('');
				this.coolerSerialNumber.setText('');
				this.outletname.setText('');
				this.imageDateTime.setText('');
				this.scheduleImageCount.setText(scheduleImages);
				Ext.Msg.alert('Info', 'No Schedule image found');
			}
			else {
				for (var j = 0; j < len; j++) {
					var btnId = comboStore[j].data.LookupId;
					if (document.getElementById(btnId)) {
						document.getElementById(btnId).removeAttribute('disabled', true);
					}
				}
				if (document.getElementById('0')) {
					document.getElementById('0').removeAttribute('disabled', true);
				}
				var scheduleImages = this.grid.getStore().totalLength;
				var record = this.grid.getStore().data.items[0];
				this.imageId.setText(record.data.AssetPurityId);
				this.coolerSerialNumber.setText(record.data.SerialNumber);
				this.outletname.setText(record.data.Location);
				this.imageDateTime.setText(ExtHelper.renderer.DateTime(record.data.PurityDateTime));
				this.record = record;
				this.onRowClick(record);
				this.scheduleImageCount.setText(scheduleImages);

			}
		}, this);
		Ext.EventManager.onWindowResize(function () {
			image_width = 105, image_height = 15;
		})
	},

	onShowButtonClick: function (me, e) {
		var id = Number(me.getAttribute('id'));
		if (id == 10) {
			this.updateSubStatus(this.record.data.AssetPurityId, -1, false, false, '', id);
		}
		else {
			var comboRecordIndex = Cooler.comboStores.ImageRecognitionContentStatus.find('LookupId', id);
			var selectedimageRecognitionContentStatusItems = Cooler.comboStores.ImageRecognitionContentStatus.data.items[comboRecordIndex].json;

			if (selectedimageRecognitionContentStatusItems.DeleteFlag) {
				this.updateSubStatus(this.record.data.AssetPurityId, id, true, true, '', id);

			}
			else if (selectedimageRecognitionContentStatusItems.ImageProcessFlag) {
				this.updateSubStatus(this.record.data.AssetPurityId, id, false, false, '', id);
			}
			else if (!selectedimageRecognitionContentStatusItems.ImageProcessFlag && !selectedimageRecognitionContentStatusItems.ImageProcessFlag) {
				this.updateSubStatus(this.record.data.AssetPurityId, id, false, true, '', id);
			}
		}

	},
	updateSubStatus: function (purityId, statusId, imageDelete, rejected, reasonText, imageStatusId) { // statusId == imageStatusId
		purityId = this.record.data.AssetPurityId;
		if (typeof (imageStatusId) === "object") {
			if (this.imageQualityCombo.getValue() == "") {
				Ext.Msg.alert('info', 'Please correct data');
				return;
			}
			else {
				imageStatusId = this.imageQualityCombo.getValue();
			}
		}
		if (imageDelete === undefined) {
			imageDelete = false;
		}
		if (rejected === undefined) {
			rejected = true;
		}
		if (reasonText === undefined) {
			reasonText = this.notes.getValue();
		}


		Ext.Ajax.request({
			url: EH.BuildUrl('AssetPurity'),
			params: {
				action: 'other',
				otherAction: 'UpdateImageWithSubStatus',
				assetPurityId: purityId,
				subStatusId: imageStatusId,
				deleteImage: imageDelete,
				isRejected: rejected,
				notes: reasonText
			},
			success: function () {
				this.grid.store.load();
				if (this.notes) {
					this.notes = null;
				}
				if (this.imageQualityCombo) {
					this.imageQualityCombo = null
				}
				if (this.qualityStatusWindow) {
					this.qualityStatusWindow.destroy();
				}
			},
			failure: function () {
				Ext.Msg.alert('Error', 'An error occured during status update');
			},
			scope: this
		});
	},
	getNewImage: function (name, id, purityDatetime) {
		var img = new Ext.ux.Image({
			listeners: {
				render: function (image) {
					image.el.on('load', function (evt) {
						var me = Cooler.UnprocessedCoolerImage;
						var config = Ext.apply({ id: this.id, width: evt.target.width, height: evt.target.height });
						me.transformations.defaultImageSize.push(config);
						var imagePanel = me.imagePreview.items.items[0].getComponent('imagePreview');
						imagePanel.doLayout();
					});
				}
			},
			style: 'max-width: 98%; margin: 5px; vertical-align: middle; float: inherit;',
			src: 'Controllers/CoolerImagePreview.ashx?AssetImageName=' + name + '&ImageId=' + id + '&v=' + new Date() + '&PurityDateTime=' + purityDatetime
		});
		return img;
	},

	resizeButtonTest: function (obj) {
		$(".responciveTextSize").fitText();
	}
});

Cooler.UnprocessedCoolerImage = new Cooler.UnprocessedCoolerImage({ uniqueId: 'UnprocessedAssetPurity' });