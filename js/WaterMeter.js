Cooler.WaterMeter = new Cooler.Form({
	formTitle: 'Water Meter',
	listTitle: 'Water Meter',
	keyColumn: 'AssetPurityId',
	controller: 'WaterMeter',
	securityModule: 'WaterMeter',
	winConfig: {
		width: 900,
		height: 330,
		layout: 'border',
		defaults: { border: false }
	},
	//uniqueId: 'AssetPurityNew',
	disableAdd: true,
	disableDelete: true,
	editable: true,
	//comboTypes: [
	//	'Product',
	//	'AssetPurityStatus'
	//],

	//comboStores: {
	//    Product: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
	//    ProductList: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
	//    AssetPurityStatus: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	//},

	gridPlugins: [
        new DA.form.plugins.Inline({
        	modifiedRowOptions: {
        		fields: 'modified'
        	}
        })
	],

	gridConfig: {
		custom: {
			loadComboTypes: true,
			allowBulkDelete: true
		},
		defaults: { sort: { dir: 'DESC', sort: 'AssetPurityId' } },
		sm: new Ext.grid.RowSelectionModel({ singleSelect: true })
	},

	hybridConfig: function () {
		//var assetPurityStatusCombo = DA.combo.create({ store: this.comboStores.AssetPurityStatus });
		return [
			{ dataIndex: 'AssetId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ dataIndex: 'AssignedOn', type: 'date' },
            { dataIndex: 'AssetPurityId', type: 'int', header: 'Id', width: 50 },
			{ dataIndex: 'SerialNumber', type: 'string', header: 'Serial Number', width: 120 },
			{ dataIndex: 'PurityDateTime', type: 'date', header: 'Image Date/ Time', width: 140, renderer: ExtHelper.renderer.DateTime },
			//{ dataIndex: 'VerifiedOn', type: 'date', header: 'Recognition time', width: 140, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			//{ dataIndex: 'ModifiedByUser', type: 'string', header: 'Verified By', width: 150 },
			{ dataIndex: 'PurityStatus', type: 'string', header: 'OCR' },
			//{ dataIndex: 'PurityIssueStatus', type: 'string', header: 'Purity Issue' },
			{ dataIndex: "ImageName", type: "string" },
			{ dataIndex: 'DoorOpen', type: 'date', header: 'Created On', width: 140, renderer: ExtHelper.renderer.DateTime },
			//{ dataIndex: 'Columns', type: 'int' },
			//{ dataIndex: 'ItemsPerColumn', type: 'int' },
			//{ dataIndex: 'Priority', type: 'int' },
			//{ dataIndex: 'ImageName', type: 'string' },
			//{ dataIndex: 'Location', type: 'string', header: 'Outlet', width: 160 },
			//{ dataIndex: 'State', type: 'string', header: 'State' },
			//{ dataIndex: 'Country', type: 'string', header: 'Country' },
			//{ dataIndex: 'CountryId', type: 'int' },
			//{ dataIndex: 'FirstName', type: 'string', header: 'Operator Name' },
			//{ dataIndex: 'AssetImage', type: 'string', header: 'Assest Image' },
			//{ dataIndex: 'ImageCount', type: 'int' },
			//{ dataIndex: 'StateId', type: 'int' },
			//{ dataIndex: 'PlanogramId', type: 'int' },
			//{ dataIndex: 'DepthStatus', type: 'string' },
			//{ dataIndex: 'IsLightOn', type: 'bool' },
			//{ dataIndex: 'IsNonBeverageItem', type: 'bool' },
			//{ dataIndex: 'TotalStock', type: 'int', header: 'Total Stock', width: 80, align: 'right' },
			//{ dataIndex: 'ForeignProduct', type: 'int', header: 'Foreign Product', width: 80, align: 'right' },
			//{ dataIndex: 'TotalFacings', type: 'int', header: 'Total Facings', width: 80, align: 'right' },
			//{ dataIndex: 'OurStock', type: 'int', header: 'Our Stock', width: 80, align: 'right' },
			//{ dataIndex: 'CompliantFacings', type: 'int', header: 'Compliance Facings', width: 80, align: 'right' },
			//{ dataIndex: 'PurityPercentage', type: 'int', header: 'Purity Percentage', width: 80, align: 'right' },
			//{ dataIndex: 'StockPercentage', type: 'int', header: 'Stock Percentage', width: 80, align: 'right' },
			//{ dataIndex: 'PlanogramCompliance', type: 'int', header: 'Planogram Compliance', width: 80, align: 'right' },
			//{ dataIndex: 'Shelves', type: 'int', header: 'Shelves', width: 80, align: 'right' }
		];
	},

	currentComboRowIndex: 0,
	currentComboColIndex: 0,
	currentRecord: undefined,
	onRowClick: function (grid) {

		var store;
		var record = grid.getSelected();
		if (!record || record === this.selectedRecord) {
			return;
		}
		var imagePreview = this.imagePreview;
		// setting Image scouce to balnk first.
		var count = record.get('ImageCount');
		var imagePanel = this.imagePreview.getComponent('productComboContainer');

		imagePanel.removeAll(true);
		var image = "";
		var origImageName = record.get('ImageName');
		image = this.getNewImage(origImageName, record.get('AssetPurityId'), record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate));
		imagePanel.add(image);
		//if (count > 1) {
		//    for (var i = 1; i <= count; i++) {
		//        var imageName = origImageName.replace('.jpg', '_' + i + '.jpg');
		//        image = this.getNewImage(imageName, record.get('AssetPurityId'), record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate));
		//        imagePanel.add(image);
		//    }
		//}
		//else {
		//    image = this.getNewImage(origImageName.replace('.jpg', '_1.jpg'), record.get('AssetPurityId'), record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate));
		//    imagePanel.add(image);
		//}
		imagePanel.doLayout();


		//if (this.currentSelectedCombo) {
		//    this.currentSelectedCombo = null;
		//}
		//var store = grid.store;
		//var record = grid.getSelected();
		//if (!record) {
		//    return;
		//}
		//var imagePreview = this.imagePreview;
		//// setting Image scouce to balnk first.
		//var count = record.get('ImageCount');
		//var origImageName = record.get('ImageName');
		//if (count > 1) {
		//    for (var i = 1; i <= count; i++) {
		//        var imageName = origImageName.replace('.jpg', '_' + i + '.jpg');
		//        if (!this.src) {
		//            this.src = '<img src = "Controllers/CoolerImagePreview.ashx?AssetImageName=' + imageName + '&ImageId=' + record.get('AssetPurityId') + '&v=' + new Date() + '&PurityDateTime=' + record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate) + '"vertical-align= "middle" height = "50%"/>';
		//        }
		//        else {
		//            this.src = this.src + '<img src = "Controllers/CoolerImagePreview.ashx?AssetImageName=' + imageName + '&ImageId=' + record.get('AssetPurityId') + '&v=' + new Date() + '&PurityDateTime=' + record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate) + '" vertical-align= "middle" height = "50%"/>';
		//        }
		//    }
		//}
		//else {
		//    this.src = '<img src = "Controllers/CoolerImagePreview.ashx?AssetImageName=' + origImageName.replace('.jpg', '_1.jpg') + '&ImageId=' + record.get('AssetPurityId') + '&v=' + new Date() + '&PurityDateTime=' + record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate) + '"/>';
		//}
		//this.openNewWindow(this.src);
		//this.src = null;
		//this.newWindow = null;
		//var toolbarItems = this.imagePreview.topToolbar.items;
		//var recordData = record.data;
		//toolbarItems.item('btnAssetPurityId').setText("<b>Image Id:</b> " + record.get('AssetPurityId'));
		//toolbarItems.item('btnAsset').setText("<b>Asset Id: </b>" + record.get('AssetPurityId'));
		//toolbarItems.item('btnSerialNumber').setText("<b>Serial Number: </b>" + record.get('SerialNumber'));
		//toolbarItems.item('btnAssetLocation').setText("<b>Asset Location: </b>" + record.get('Location') + "," + record.get('Country'));
		//toolbarItems.item('IsLightOn').setValue(recordData.IsLightOn);
		//toolbarItems.item('IsNonBeverageItem').setValue(recordData.IsNonBeverageItem);
		//var planogramId = recordData.PlanogramId;
		//this.selectedRecord = record;
		//if (planogramId) {
		//    var creatingForm = !this.planogramForm;
		//    if (creatingForm) {
		//        var planogram = Cooler.CoolerImagePlanogram;
		//        this.planogramForm = planogram;
		//        planogram.on('dataLoaded', Cooler.CoolerImage.onPlanogramDataLoaded, this);
		//    }
		//    this.planogramForm.ShowForm(planogramId);
		//    if (creatingForm) {
		//        var planogramWin = this.planogramForm.win;
		//        this.planogramForm.panelProductsImage.setVisible(false);
		//        this.planogramForm.formPanel.setVisible(false);
		//        var itemWidth = this.planogramForm.item.getInnerWidth();
		//        if (itemWidth > 0) {
		//            planogramWin.setWidth(itemWidth + 10);
		//            planogramWin.center();
		//        }
		//        planogramWin.allowHide = true;
		//    }
		//} else {
		//    if (this.planogramForm) {
		//        var planogramWin = this.planogramForm.win;
		//        if (planogramWin && planogramWin.isVisible()) {
		//            this.planogramForm.hideFormWin();
		//        }
		//    }
		//    this.planogram = null;
		//    Cooler.CoolerImage.reloadCombos(this, record);
		//}
	},
	getNewImage: function (name, id, purityDatetime) {
		var img = new Ext.ux.Image({
			listeners: {
				render: function (image) {
					image.el.on('load', function (evt) {
						var me = Cooler.CoolerImage;

						var config = Ext.apply({ id: this.id, width: evt.target.width, height: evt.target.height });
						// me.transformations.defaultImageSize.push(config);
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
	openNewWindow: function (src) {
		//this.newWindow = window.open("", "pictureViewer",
		//    "scrollbars = 1, resizable = 1, height = 500, width = 500");
		//if (this.newWindow) {
		//    this.newWindow.document.writeln("<html><body>");
		//    this.newWindow.document.writeln("<div height = 60% width= 60%>" + src + "</div>");
		//    this.newWindow.document.writeln("</body></html>");
		//    this.newWindow.document.close();
		//} else {
		//    Ext.Msg.alert('Alert', 'Disable popup blocker to view images');
		//}
	},
	setCurrentCombo: function (combo) {
		//this.currentSelectedCombo = combo;
		//var container = this.imagePreview.getComponent('productComboContainer').getComponent('purityStatus');
		//var prevCombo = container.getComponent('product' + this.currentComboRowIndex + this.currentComboColIndex);
		//if (prevCombo) {
		//    prevCombo.removeClass('activeCombo');
		//}
		//var itemId = combo.itemId;
		//this.currentComboRowIndex = Number(itemId.substr(7, 1));
		//this.currentComboColIndex = Number(itemId.substr(8));
		//combo.addClass('activeCombo');
		//this.updateCounter();
	},

	onRowImageClick: function (grid, rowIndex, e) {
		//var record = grid.getStore().getAt(rowIndex);
		//Cooler.CoolerImageNew.grid.getSelectionModel().selectRow(rowIndex);
	},

	checkUnProcessedImage: function () {
		//var records = Cooler.CoolerImageNew.grid.getStore().data, toReturn = false;
		//for (var i = 0; i < records.items.length; i++) {
		//    if (!records.get(i).get('VerifiedOn') || records.get(i).get('VerifiedOn') === '') {
		//        toReturn = true;
		//        break;
		//    }
		//}
		//return toReturn;
	},

	interval: 60000,
	intervalImage: 180000,
	logoutInterval: 15000,
	afterShowList: function (config) {
		config.tab.on('activate', Cooler.CoolerImage.onTabActivate, this);
		config.tab.on('deactivate', Cooler.CoolerImage.onTabDeactivate, this);
	},
	onGridCreated: function (grid) {
		grid.store.on('load', Cooler.CoolerImage.onGridStoreLoad, this);
	},

	beforeShowList: function (config) {
		Cooler.CoolerImage.onBeforeShowList(this);
	},

	logoutFunction: function () {
		DCPLApp.warningMsg = false;  // to remove windows prompt message on logout
		__doPostBack('ctl00$btnLogout', '');

	},
	unAssignImage: function (btn) {
		//var records = Cooler.CoolerImageNew.grid.getStore().data, imageId = 0;
		//if (btn === 'yes') {
		//    clearTimeout(this.timeout);
		//    this.assignNewImage();
		//    for (var i = 0; i < records.items.length; i++) {
		//        if (!records.get(i).get('VerifiedOn') && records.get(i).get('VerifiedOn') === "") {
		//            imageId = records.get(i).get('AssetPurityId');
		//            break;
		//        }
		//    }
		//    Ext.Ajax.request({
		//        url: EH.BuildUrl('AssetPurity'),
		//        params: {
		//            action: 'other',
		//            otherAction: 'UnAssign',
		//            assignedImageId: imageId
		//        },
		//        success: function () {
		//            var imagePreview = this.imagePreview.items.items[0].getComponent('imagePreview');
		//            if (imagePreview) {
		//                imagePreview.removeAll();
		//            }
		//            this.stop = true;
		//            this.runner.start(this.updateClock);
		//            //this.updateClock.delay(this.interval);
		//        },
		//        failure: function () {
		//            Ext.Msg.alert('Error', 'An error occured during unassignment');
		//        },
		//        scope: this
		//    });
		//} else {
		//    this.stop = true;
		//    this.runner.start(this.updateClock);
		//    //this.updateClock.delay(this.interval);
		//}
	},
	updateCounter: function () {
		if (this.updateClock) {
			this.stop = true;
			this.runner.start(this.updateClock);
			//this.updateClock.delay(this.interval);//restart task runner	
		}
		if (this.updateAssetPurity) {
			this.stop = true;
			this.runnerStore.start(this.updateAssetPurity);
		}
	},

	getAssignedDateDiffrence: function (assignedTime) {
		var now = new Date();
		var nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()); // get current UTC time
		return Math.floor((nowUTC - assignedTime) / (1000 * 60)); // return minutes diffrence
	},
	secondsToHms: function (seconds) {
		seconds = Number(seconds);
		var h = Math.floor(seconds / 3600);
		var m = Math.floor(seconds % 3600 / 60);
		var s = Math.floor(seconds % 3600 % 60);
		return ((h < 10 ? "0" + h : h) + (m < 10 ? ":0" + m : ":" + m) + (s < 10 ? ":0" + s : ":" + s));
	},
	startAutoGridRefresh: function (grid) {
		this.gridRefreshTask = {
			run: function () {
				var store = grid.getStore();
				store.reload();
			},
			interval: 15000 //15 Second
		};

		Ext.TaskMgr.start(this.gridRefreshTask, this);
	},
	assignNewImage: function () {
		Ext.Ajax.request({
			url: EH.BuildUrl('WaterMeter'),
			params: {
				action: 'other',
				otherAction: 'AssignNewImage'
			},
			success: function (response) {
				var res = Ext.decode(response.responseText);
				if (!this.imageMask) {
					var imageMask = new Ext.LoadMask(this.imagePreview.getEl(), {
						msg: "Image not available for processing, Please wait..."
					});
					this.imageMask = imageMask;
				}
				if (res === "Image not available") {
					if (this.runner) {
						this.runner.stop(this.updateClock);
					}

					this.imageMask.show();
					if (!this.gridRefreshTask) {
						this.startAutoGridRefresh(this.grid);
					} else if (this.gridRefreshTask.start !== undefined) {
						this.gridRefreshTask.start();
					}
					return;
				} else {
					this.grid.getStore().reload();
					this.stop = true;
					if (this.runner) {
						this.runner.start(this.updateClock);
					}
					this.imageMask.hide();
				}
			},
			failure: function () {
				statisticsButton.setText("No statistic available");
			},
			scope: this
		});
	},
	onProductComboBlur: function (combo) {
		var comboStore = combo.store;
		if (comboStore.getRange().length === 0) {
			Ext.Msg.alert('Error', 'Product not found in the list.');
		}
		//combo.removeClass('activeCombo');
		comboStore.clearFilter();
	},

	setZoomSize: function (img, zoomType) {
		var oldSize = img.getSize();
		var zoomVal = 1.1;
		var width = 0, height = 0;

		switch (zoomType) {
			case 1:
				width = Math.round(oldSize.width * zoomVal);
				height = Math.round(oldSize.height * zoomVal);
				break;
			case 2:
				width = Math.round(oldSize.width / zoomVal);
				height = Math.round(oldSize.height / zoomVal);
				break;
			case 3:
				var sizeArray = this.transformations.defaultImageSize;
				for (var i = 0; i < sizeArray.length; i++) {
					var imgSize = sizeArray[i];
					if (imgSize.id === img.id) {
						width = imgSize.width;
						height = imgSize.height;
						break;
					}
				}
				break;
		}
		var parentWidth = this.getEl().getSize().width;
		if (width > parentWidth)
			img.el.setStyle('max-width', null);
		else
			img.el.setStyle('max-width', '98%');
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
	getEl: function () {
		return this.imagePreview.items.items[0].getComponent('imagePreview');
	},
	zoom: function (zoomType) {
		var images = this.getEl().items.items;
		for (var i = 0, len = images.length; i < len; i++) {
			this.setZoomSize(images[i], zoomType);
		}
		var imagePanel = this.imagePreview.items.items[0].getComponent('imagePreview');
		imagePanel.doLayout();
	},
	resetZoom: function () {
		this.zoom(3);
		this.transformations.zoom = 0;
	},
	myData: [],
	onAddMessage: function () {
		if (!this.notificationForm) {
			var notificationForm = new Ext.FormPanel({
				items: [{
					xtype: 'textfield',
					itemId: 'notificationTextField',
					name: 'Notification',
					fieldLabel: 'Notification',
					allowBlank: false
				}, {
					xtype: 'button',
					text: 'Send',
					handler: this.sendNotification,
					scope: this
				}
				]
			});
			this.notificationForm = notificationForm;
		}
		if (!this.win) {
			var window = new Ext.Window({
				width: 300,
				height: 150,
				layout: 'fit',
				plain: true,
				title: 'Notification',
				allowPaging: false,
				resizable: true,
				items: notificationForm,
				closeAction: 'hide'
			});
			this.win = window;
		}
		// to clear text value from text box when open second time
		this.notificationForm.items.get('notificationTextField').setValue('');
		this.win.show();
	},
	sendNotification: function () {
		var form = this.notificationForm.getForm();
		var notification = form.getValues().Notification;
		if (form.isValid()) {
			Ext.Ajax.request({
				url: EH.BuildUrl('WaterMeter'),
				params: {
					action: 'notification',
					notification: notification
				},
				success: function () {
					this.win.hide();
					Ext.Msg.alert('Success', 'Notification sent');
				},
				failure: function () {
					this.win.hide();
					Ext.Msg.alert('Error', 'Notification sending failed');
				},
				scope: this
			});
		} else {
			Ext.Msg.alert('Error', 'Please correct data errors before continuing.');
		}
	},

	productDataViewTpl: new Ext.XTemplate(
		'<tpl for=".">',
			'<div class="planogram-product planogram-product-border flip-container" ontouchstart= "this.classList.toggle("hover");" productId="{LookupId}" data-displayValue = "{DisplayValue}">',
				'<div class="flipper">',
					'<div class="front">',
						'<img src = "./products/thumbnails/{CustomStringValue}" alt = "{DisplayValue}"onerror="this.src = \'./products/imageNotFound.png\';" class = "productimage">',
						'<div class="product-name" style="color: {ReferenceValue}; background-color: {Description}">{DisplayValue}</div>',
					'</div>',
					'<div class="back">',
						'<img src = "./products/thumbnails/{CustomStringValue}" alt = "{DisplayValue}"onerror="this.src = \'./products/imageNotFound.png\';" class = "productimage">',
						'<div class="product-name" style="color: {ReferenceValue}; background-color: {Description}">{DisplayValue}</div>',
					'</div>',
				'</div>',
			'</div>',
		'</tpl>',
		'<div class="x-clear"></div>'
	),

	configureListTab: function (config) {
		this.transformations = {
			rotate: 0,
			zoom: 0,
			defaultImageSize: []
		};
		//var assetImagePanel = new Ext.Panel({
		//    region: 'center',
		//    autoScroll: true,
		//    title: 'Asset Image',
		//    bodyStyle: "text-align: center;",
		//    items: {
		//        itemId: 'assetPreview',
		//        xtype: 'xImage'
		//    }
		//});
		//this.assetImagePanel = assetImagePanel;

		var grid = this.grid;
		var westItems = [];
		westItems.push(this.grid);
		//if (DA.Security.HasPermission('Admin') || DA.Security.IsInRole("Operator") || DA.Security.IsInRole("Operator Admin")) {
		//    this.assetImagePanel.hidden = true;
		//    westItems.push(this.grid);
		//} else {
		//	//this.grid.hidden = true;
		//	//westItems.push(this.assetImagePanel);
		//	this.assetImagePanel.hidden = true;
		//    westItems.push(this.grid);
		//}
		var westPanel = new Ext.Panel({ region: 'west', width: '100%', split: true, hidden: false, items: westItems, layout: 'fit' })
		// grid.getTopToolbar().splice(0, 0, { text: 'Cooler Notification', iconCls: 'notificationIcon', handler: this.onAddMessage, scope: this });
		grid.getSelectionModel().on({
			'selectionchange': this.onRowClick,
			scope: this
		});

		//this.on('afterQuickSave', Cooler.CoolerImage.onAfterQuickSave, this);

		var btnSaveImage = new Ext.Toolbar.Button({ text: 'Save', handler: Cooler.CoolerImage.onBeforeSave, scope: this, iconCls: 'Save' });
		var btnSyncPlanogram = new Ext.Toolbar.Button({ text: 'Sync Planogram', handler: Cooler.CoolerImage.syncPlanogram, scope: this, iconCls: 'btn-icon-planogram' });
		var btnStatistics = new Ext.Toolbar.Button({ text: 'Show Statistics', scope: this });
		var btnAsset = new Ext.Toolbar.Button({ text: '<b>Asset Id: </b>', scope: this, itemId: 'btnAsset' });
		var btnCoolerImageId = new Ext.Toolbar.Button({ text: '<b>Image Id: </b>', scope: this, itemId: 'btnAssetPurityId' });
		var btnSerialNumber = new Ext.Toolbar.Button({ text: '<b>Serial Number: </b>', scope: this, itemId: 'btnSerialNumber' });
		var btnAssetLocation = new Ext.Toolbar.Button({ text: '<b>Asset Location: </b>', scope: this, itemId: 'btnAssetLocation' });
		var btnProcessedImages = new Ext.Toolbar.Button({ text: '<b>Total Processed Images: </b>', scope: this, itemId: 'btnProcessedImages' });
		var btnArrangeImages = new Ext.Toolbar.Button({ text: 'Arrange', handler: Cooler.CoolerImage.arrangeImages, iconCls: 'btn-icon-Arrange', scope: this });
		var lightOn = new Ext.form.Checkbox({ text: 'Light ON?', name: 'IsLightOn', scope: this, itemId: 'IsLightOn' });
		var nonBeverageItem = new Ext.form.Checkbox({ text: 'Non beverage items?', name: 'IsNonBeverageItem', scope: this, itemId: 'IsNonBeverageItem' });
		var dvStore = new Ext.data.Store({ fields: [{ name: 'Description', type: 'string' }, { name: 'DisplayValue', type: 'string' }, { name: 'CustomStringValue', type: 'string' }, { name: 'ReferenceValue', type: 'string' }] });
		var productsDataView = new Ext.DataView({
			id: 'my-data-view1',
			store: dvStore,
			tpl: this.productDataViewTpl,
			singleSelect: false,
			itemSelector: 'div.planogram-product',
			listeners: {
				'dblclick': {
					fn: this.onDblClickProductView,
					scope: this
				}
			}
		});
		this.productsDataView = productsDataView;
		var imagePreview = new Ext.Panel({
			title: 'Image',
			region: 'south',
			height: 200,
			layout: 'border',
			//tbar: [btnSaveImage, btnSyncPlanogram, btnArrangeImages, 'Light ON?', lightOn, 'Non beverage items?', nonBeverageItem, btnCoolerImageId, btnAsset, btnSerialNumber, btnAssetLocation, btnProcessedImages, btnStatistics],
			items: [

				{
					xtype: 'panel',
					region: 'center',
					autoScroll: true,
					itemId: 'productComboContainer',
					items: [

					]
				}
			]
		});

		this.imagePreview = imagePreview;
		var store = new Ext.data.Store({ fields: [{ name: 'CustomStringValue', type: 'string' }] });
		var imageTpl = new Ext.XTemplate(
				'<tpl for=".">',
				'<div class="wrap">',
				'<div class="thumb"><img src="./images/{CustomStringValue}" caption="Smiley face" class="thumbimg"></div>',
				'</div>',
				'</tpl>'
			);
		this.imageTpl = imageTpl;
		var productsImage = new Ext.DataView({
			id: 'my-data-view',
			store: store,
			tpl: imageTpl,
			multiSelect: true,
			overClass: 'x-view-over',
			itemSelector: 'div.wrap',
			selectedClass: "thumbSelected"
		});
		var panelProductsImage = new Ext.Panel({
			frame: true,
			region: 'center',
			autoScroll: true,
			items: productsDataView
		});
		this.productsImage = productsImage;
		productsImage.on({
			'click': this.onProductPreview
		});
		store.on('load', function (options) {
			image_width = 105, image_height = 15;
			Ext.getCmp('my-data-view').setWidth(this.data.items.length * image_width);
			Ext.getCmp('my-data-view').setHeight(image_width - image_height);

		})
		this.grid.getStore().on('load', Cooler.CoolerImage.showStatistics, this);
		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [westPanel, imagePreview, panelProductsImage]
		});
		Ext.EventManager.onWindowResize(function () {
			image_width = 105, image_height = 15;
			Ext.getCmp('my-data-view').setHeight(image_width - image_height);
			Ext.getCmp('my-data-view').setWidth(Cooler.CoolerImageNew.productsImage.getStore().data.items.length * image_width);
		})
	},
	onArrangeImageSuccess: function (response, options) {
		if (this.mask) {
			this.mask.hide();
		}
		if (!this.grid.getSelectionModel()) {
			return;
		}
		var record = this.grid.getSelectionModel().getSelected();
		// setting Image scouce to balnk first.
		var count = record.get('ImageCount');
		var origImageName = record.get('ImageName');
		if (count > 1) {
			for (var i = 1; i <= count; i++) {
				var imageName = origImageName.replace('.jpg', '_' + i + '.jpg');
				if (!this.src) {
					this.src = '<img src = "Controllers/CoolerImagePreview.ashx?AssetImageName=' + imageName + '&ImageId=' + record.get('AssetPurityId') + '&PurityDateTime=' + record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate) + '&v=' + new Date() + '"vertical-align= "middle" height = "50%"/>';
				}
				else {
					this.src = this.src + '<img src = "Controllers/CoolerImagePreview.ashx?AssetImageName=' + imageName + '&ImageId=' + record.get('AssetPurityId') + '&PurityDateTime=' + record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate) + '&v=' + new Date() + '" vertical-align= "middle" height = "50%"/>';
				}
			}
		}
		else {
			this.src = '<img src = "Controllers/CoolerImagePreview.ashx?AssetImageName=' + origImageName + '&ImageId=' + record.get('AssetPurityId') + '&PurityDateTime=' + record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate) + '&v=' + new Date() + '"/>';
		}
		this.openNewWindow(this.src);
		this.src = null;
		this.newWindow = null;
	},
	onDblClickProductView: function (container, item, record) {
		var container = this.imagePreview.getComponent('productComboContainer'), containerProductCombo;
		if (container) {
			containerProductCombo = container.getComponent('purityStatus');
			var currentRecord = this.comboStores.Product.find('DisplayValue', record.dataset.displayvalue);
			var count = containerProductCombo.items.getCount();
			currentRecord = this.comboStores.Product.getAt(currentRecord);
			if (currentRecord && this.currentSelectedCombo) {
				this.currentSelectedCombo.setValue(currentRecord.get("LookupId"));
				if (this.currentSelectedCombo.itemIndex < ((count / 2) - 1)) {
					containerProductCombo.items.get((this.currentSelectedCombo.itemIndex + 1) * 2).focus();
				}
			}
			else {
				Ext.Msg.alert('Alert', 'Please select a combo field first.');
			}
		}
	},
	onProductPreview: function (mainDiv, itemLeft, imageDiv) {
		window.open(imageDiv.getElementsByClassName('thumbimg')[0].src, '', 'width=400, height=400, left=800, top=300');
	},
	showNewWindow: false
});
