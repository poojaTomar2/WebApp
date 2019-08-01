Cooler.CoolerImageForIRForm = Ext.extend(Cooler.Form, {
	formTitle: 'Cooler Image For IR: {0}',
	listTitle: 'Cooler Images For IR',
	keyColumn: 'AssetPurityId',
	uniqueId: 'AssetPurityForIR',
	controller: 'AssetPurity',
	disableAdd: true,
	disableDelete: true,
	editable: true,
	securityModule: 'CoolerImagesForIR',
	comboTypes: [
		'Product',
		'AssetPurityStatus'
	],
	constructor: function (config) {
		Cooler.CoolerImageForIRForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true,
				allowBulkDelete: true
			},
			defaults: { sort: { dir: 'DESC', sort: 'AssetPurityId' } },
			sm: new Ext.grid.RowSelectionModel({ singleSelect: true })
		});
	},
	comboStores: {
		Product: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		ProductList: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		AssetPurityStatus: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},

	hybridConfig: function () {
		var assetPurityStatusCombo = DA.combo.create({ store: this.comboStores.AssetPurityStatus });
		var items = [
			{ dataIndex: 'PurityDateTimeUtc', type: 'date' },
			{ dataIndex: 'TimeZoneId', type: 'int', width: 50 },
			{ dataIndex: 'AssetPurityId', type: 'int', header: 'Id' },
			{ dataIndex: 'ConsumerEmail', type: 'string', header: 'Email' },
			{ dataIndex: 'IrUserName', type: 'string', header: 'UserName' },
			{ dataIndex: 'AssetId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ dataIndex: 'AssignedOn', type: 'date' },
			{ dataIndex: 'SerialNumber', type: 'string', header: 'Serial Number', width: 120 },
			{ dataIndex: 'Location', type: 'string', header: 'Outlet', width: 100 },
			{ dataIndex: 'SceneTypeName', type: 'string', header: 'Subscene Type', width: 100 },
			{ dataIndex: 'SceneTypeCategory', type: 'string', header: 'Scene', width: 100 },
			{ dataIndex: 'PurityDateTime', type: 'date', header: 'Image Date/ Time', width: 140, rendererInfo: 'TimeZoneRenderer', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ dataIndex: 'CreatedOn', type: 'date', header: 'Image Received On', width: 140, renderer: Cooler.renderer.DateTimeWithLocalTimeZone, convert: Ext.ux.DateLocalizer },
			{ dataIndex: 'VerifiedOn', type: 'date', header: 'Recognition time', width: 140, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ dataIndex: 'ModifiedOn', type: 'date', header: 'IR Modified time', width: 140, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer }
		];

		if (this.uniqueId == "AssetPurity") {
			items.push({ dataIndex: 'ModifiedByUser', type: 'string', header: 'Verified By', width: 150 });
		}
		items.push({ dataIndex: 'PurityStatus', type: 'string' },
			{ dataIndex: 'PurityIssueStatus', type: 'string', header: 'Purity Issue' },
			{ dataIndex: "StatusId", type: "int", header: 'Status', width: 100, xtype: 'combocolumn', editor: assetPurityStatusCombo, renderer: ExtHelper.renderer.Combo(assetPurityStatusCombo), displayIndex: 'AssetPurityStatus' },
			{ dataIndex: "SubStatus", type: "string", header: 'Sub Status', width: 200 },
			{ dataIndex: "Notes", type: "string", header: 'Notes', width: 200 },
			{ dataIndex: 'DoorOpen', type: 'date', header: 'Door Open', width: 140, renderer: ExtHelper.renderer.DateTime },
			{ dataIndex: 'Columns', type: 'int' },
			{ dataIndex: 'ItemsPerColumn', type: 'int' },
			{ dataIndex: 'Priority', type: 'int' },
			{ dataIndex: 'ImageName', type: 'string' },
			//{ dataIndex: 'Location', type: 'string', header: 'Outlet', width: 160 },
			{ dataIndex: 'State', type: 'string', header: 'State' },
			{ dataIndex: 'Country', type: 'string', header: 'Country' },
			{ dataIndex: 'CountryId', type: 'int' },
			{ dataIndex: 'ImageCount', type: 'int' },
			{ dataIndex: 'StateId', type: 'int' },
			{ dataIndex: 'PlanogramId', type: 'int' },
			{ dataIndex: 'DepthStatus', type: 'string' },
			{ dataIndex: 'IsLightOn', type: 'bool' },
			{ dataIndex: 'IsNonBeverageItem', type: 'bool' },
			{ dataIndex: 'TotalStock', type: 'int', header: 'Total Stock', width: 80, align: 'right' },
			{ dataIndex: 'ForeignProduct', type: 'int', header: 'Foreign Product', width: 80, align: 'right' },
			//{ dataIndex: 'TotalFacings', type: 'int', header: 'Total Facings', width: 80, align: 'right' },
			{ dataIndex: 'OurStock', type: 'int', header: 'Our Stock', width: 80, align: 'right' },
			{ dataIndex: 'CompliantFacings', type: 'int', header: 'Compliance Facings', width: 80, align: 'right' },
			{ dataIndex: 'PurityPercentage', type: 'int', header: 'Purity Percentage', width: 80, align: 'right' },
			{ dataIndex: 'StockPercentage', type: 'int', header: 'Stock Percentage', width: 80, align: 'right' },
			{ dataIndex: 'PlanogramCompliance', type: 'int', header: 'Planogram Compliance', width: 80, align: 'right' },
			{ dataIndex: 'Shelves', type: 'int', header: 'Shelves', width: 80, align: 'right' },
			{ dataIndex: 'SessionUid', type: 'string', header: 'Session Uid' },
			{ dataIndex: 'SceneUid', type: 'string', header: 'Scene Uid' },
			{ dataIndex: 'ImageName', type: 'string', header: 'Image File Name' })
		return items;
	},
	currentComboRowIndex: 0,
	currentComboColIndex: 0,
	currentRecord: undefined,
	sortProduct: function (obj1, obj2) {
		if (obj1.SystemValue < obj2.SystemValue) {
			return -1;
		} else if (obj1.SystemValue > obj2.SystemValue) {
			return 1;
		}
		return obj1.DisplayValue.localeCompare(obj2.DisplayValue);
	},

	productComboTpl: new Ext.XTemplate(
		'<tpl for=".">',
		'<div class="x-combo-list-item">',
		'<div {[this.productColor(values)]}>{DisplayValue}</div>',
		'</div>',
		'</tpl>', {
			productColor: function (record) {
				if (record.SystemValue) {
					return parseInt(record.SystemValue) == -1 ? 'style="font-weight: bold;"' : '';
				}
				else {
					return '';
				}
			}
		}
	),

	onComboLoad: function (me, countryId, stateId, clientId) {
		var productList = [];
		var productData = Cooler.comboStores.Product.reader.jsonData, priority = ["Empty", "Foreign"];
		var planogramValues = me.planogram, planogramProducts = {}, isValidProduct = false;
		if (planogramValues) {
			var len = planogramValues.length, shelve, shelveLen;
			for (var i = 0; i < len; i++) {
				shelve = planogramValues[i].products;
				shelveLen = shelve.length;
				for (var j = 0; j < shelveLen; j++) {
					planogramProducts[shelve[j].id] = true;
				}
			}
		}
		if (productData) {
			for (var i = 0, len = productData.length; i < len; i++) {
				var record = Ext.apply({}, productData[i]);
				if (planogramProducts[record.LookupId]) {
					record.SystemValue = -1;
					isValidProduct = true;
				}
				else if ((Ext.isEmpty(clientId) && Ext.isEmpty(countryId)) || (clientId = 0 || countryId == 0)) {
					isValidProduct = false;
				}
				else if ((Ext.isEmpty(clientId) || record.ClientId === 0 || record.ClientId === clientId) && (Ext.isEmpty(countryId) || countryId === 0 || record.CountryId === 0 || record.CountryId === countryId) && (Ext.isEmpty(stateId) || stateId === 0 || record.StateId === 0 || record.StateId === stateId)) {
					var priorityIndex = priority.indexOf(record.DisplayValue);
					record.SystemValue = priorityIndex === -1 ? 999 : priorityIndex;
					isValidProduct = true;
				} else {
					isValidProduct = false;
				}
				if (isValidProduct) {
					productList.push(record);
				}
			}
		}

		productList.sort(me.sortProduct);
		var comboContainer = me.imagePreview.getComponent('productComboContainer');
		if (comboContainer.items) {
			comboContainer.remove('purityStatus', true);
		}
		var comboStore = me.comboStores.Product;
		comboStore.loadData(productList);
		var listTitle = me.listTitle;
		if (listTitle == "Cooler Images New") {
			var productsDataViewStore = me.productsDataView.getStore();
			productsDataViewStore.data = comboStore.data;
			var productCount = productsDataViewStore.data.length;
			for (var i = 0; i < productCount; i++) {
				var productDetail = productsDataViewStore.data.itemAt(i);
				if (productDetail.get('CustomStringValue')) {
					var images = productDetail.get('CustomStringValue').split(',');
					if (images.length > 0) {
						productDetail.set('CustomStringValue', images[0]);
					}
				}
			}
			me.productsDataView.refresh();
		}
		var record = me.currentRecord;
		var enableDepth = parseInt(DA.Security.info.Tags.EnableDepth) != 0;
		var purityCombos = [];
		var shelves = record.get('Shelves');
		var purityStatus = record.get('PurityStatus').indexOf(',') > 0 ? record.get('PurityStatus').split(',') : record.get('PurityStatus');
		var depthStatus = record.get('DepthStatus').indexOf(',') > 0 ? record.get('DepthStatus').split(',') : record.get('DepthStatus');
		var columns = record.get('Columns');
		var pos = 0;
		for (var row = 0; row < shelves; row++) {
			for (var column = 0; column < columns; column++) {
				var productCombo = DA.combo.create({
					store: comboStore,
					itemId: 'product' + row + column,
					itemIndex: pos,
					value: Number(purityStatus[pos] || Cooler.Enums.Product.Unknown),
					tpl: me.productComboTpl,
					listWidth: 200,
					width: (comboContainer.el.getWidth() - (enableDepth ? (37 * columns) : 0)) / columns,
					listeners: {
						focus: me.setCurrentCombo,
						blur: me.onProductComboBlur,
						scope: me
					}
				});
				var depthSpinner = new Ext.ux.form.SpinnerField({
					minValue: 0,
					maxValue: 20,
					width: 37,
					allowDecimals: false,
					hidden: !enableDepth,
					value: Number(depthStatus[pos] || 0),
					itemId: 'depth' + row + column
				});
				if (row === shelves - 1 && column === columns - 1) { // to stop tab key event on last combo
					productCombo.addListener('specialkey', function (field, e) {
						if (e.getKey() === e.TAB) {
							e.stopEvent();
						}
					});
				}
				pos++;
				purityCombos.push(productCombo);
				purityCombos.push(depthSpinner);
			}
		}

		comboContainer.add({
			itemId: 'purityStatus',
			layout: 'table',
			autoScroll: true,
			layoutConfig: {
				columns: (columns * 2)
			},
			items: purityCombos
		});
		comboContainer.doLayout();

		//Focus on first combo
		if (purityCombos.length > 0) { // if combo available then set focus
			comboContainer = comboContainer.getComponent('purityStatus');
			comboContainer.getComponent('product00').focus('', 500);
		}
	},
	reloadCombos: function (me, record) {
		if (!record) {
			return;
		}
		me.currentRecord = record;
		Cooler.CoolerImageForIR.onComboLoad(me, record.get('CountryId'), record.get('StateId'), record.get('ClientId'));
	},
	onRowClick: function (grid) {
		var store;
		var record = grid.getSelected();
		if (!record || record === this.selectedRecord) {
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
				image = this.getNewImage(imageName, record.get('AssetPurityId'), record.get('PurityDateTimeUtc').format(Cooler.Enums.DateFormat.PurityDate), count);
				imagePanel.add(image);
			}
		} else if (origImageName && origImageName.split('_') > 1) {
			image = this.getNewImage(origImageName, record.get('AssetPurityId'), record.get('PurityDateTimeUtc').format(Cooler.Enums.DateFormat.PurityDate), count);
			if (image != undefined) {
				imagePanel.add(image);
			}
		}
			if (count > 1) {
				for (var i = 1; i <= count; i++) {
					var imageName = origImageName.replace('.jpg', '_' + i + '.jpg');
					image = this.getNewImage(imageName, record.get('AssetPurityId'), record.get('PurityDateTimeUtc').format(Cooler.Enums.DateFormat.PurityDate), count);
					imagePanel.add(image);
				}
			}
			else {
				image = this.getNewImage(origImageName,record.get('AssetPurityId'), record.get('PurityDateTimeUtc').format(Cooler.Enums.DateFormat.PurityDate), count);
				if (image != undefined) {
					imagePanel.add(image);

				}
			}
		imagePanel.doLayout();
		this.transformations.zoom = 0;
		this.transformations.defaultImageSize = [];
		//setTimeout(function () { imagePanel.doLayout();}, 500);		
		var toolbarItems = this.imagePreview.topToolbar.items;
		var recordData = record.data;
		toolbarItems.item('btnAssetPurityId').setText("<b>Image Id:</b> " + record.get('AssetPurityId'));
		toolbarItems.item('btnAsset').setText("<b>Asset Id: </b>" + record.get('AssetPurityId'));
		toolbarItems.item('btnSerialNumber').setText("<b>Serial Number: </b>" + record.get('SerialNumber'));
		toolbarItems.item('btnAssetLocation').setText("<b>Asset Location: </b>" + record.get('Location') + "," + record.get('Country'));
		//toolbarItems.item('IsLightOn').setValue(recordData.IsLightOn);
		//toolbarItems.item('IsNonBeverageItem').setValue(recordData.IsNonBeverageItem);
		var planogramId = recordData.PlanogramId;
		this.selectedRecord = record;
	},
	onPlanogramDataLoaded: function (form, data) {
		var record = data.data;
		if (record.Id !== 0 && record.FacingDetails) {
			this.planogram = Ext.decode(record.FacingDetails);
		}
		this.currentRecord = this.selectedRecord;
		Cooler.CoolerImageForIR.onComboLoad(this, this.currentRecord.get('CountryId'), this.currentRecord.get('StateId'), this.currentRecord.get('ClientId'));
	},

	getNewImage: function (name, id, purityDatetime, count) {
		if (count > 0) {
			var img = new Ext.ux.Image({
				listeners: {
					render: function (image) {
						image.el.on('load', function (evt) {
							var me = Cooler.CoolerImageForIR;
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

		}
	},
	setCurrentCombo: function (combo) {
		var container = this.imagePreview.getComponent('productComboContainer').getComponent('purityStatus');
		var prevCombo = container.getComponent('product' + this.currentComboRowIndex + this.currentComboColIndex);
		if (prevCombo) {
			prevCombo.removeClass('activeCombo');
		}
		var itemId = combo.itemId;
		this.currentComboRowIndex = Number(itemId.substr(7, 1));
		this.currentComboColIndex = Number(itemId.substr(8));
		combo.addClass('activeCombo');
		this.updateCounter();
	},

	onRowImageClick: function (grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		Cooler.CoolerImageForIR.grid.getSelectionModel().selectRow(rowIndex);

	},

	checkUnProcessedImage: function () {
		var records = Cooler.CoolerImageForIR.grid.getStore().data, toReturn = false;
		for (var i = 0; i < records.items.length; i++) {
			if (!records.get(i).get('VerifiedOn') || records.get(i).get('VerifiedOn') === '') {
				toReturn = true;
				break;
			}
		}
		return toReturn;
	},

	interval: 60000,
	intervalImage: 180000,
	logoutInterval: 15000,
	onTabActivate: function (tab) {
		if (this.runner) {
			this.runner.start(this.updateClock);
		}
		if (this.runnerStore) {
			this.runnerStore.start(this.updateAssetPurity);
		}
	},
	onTabDeactivate: function (tab) {
		if (this.runner) {
			this.runner.stop(this.updateClock);
		}
		if (this.runnerStore) {
			this.runnerStore.stop(this.updateAssetPurity);
		}
	},
	afterShowList: function (config) {
		config.tab.on('activate', this.onTabActivate, this);
		config.tab.on('deactivate', this.onTabDeactivate, this);
	},
	beforeShowList: function (config) {
		this.onBeforeShowList(this);
	},

	onGridCreated: function (grid) {
		grid.store.on('load', this.onGridStoreLoad, this);
	},

	onGridStoreLoad: function (store) {
		delete store.baseParams.start;
		delete store.baseParams.limit;
	},

	onBeforeShowList: function (scope) {
		scope.stop = true;
		scope.updateAssetPurity = {
			run: function () {
				if (!scope.stop) {
					var grid = scope.grid;
					var store = grid.getStore();
					var bottomToolbar = grid.getBottomToolbar();
					if (bottomToolbar) {
						var pageSize = bottomToolbar.pageSize;
						var lastRecordCount = bottomToolbar.cursor;
						var currentPage = Math.ceil((lastRecordCount + pageSize) / pageSize);
						store.baseParams.start = currentPage == 1 ? 0 : (currentPage - 1) * pageSize;
						store.baseParams.limit = pageSize;
					}
					store.load();
				}
				else {
					scope.stop = false;
				}
			},
			interval: scope.intervalImage,
			scope: scope
		};
		scope.runnerStore = new Ext.util.TaskRunner();
		scope.runnerStore.start(scope.updateAssetPurity);

		if (DA.Security.info.IsAdmin || DA.Security.IsInRole("Operator") || DA.Security.IsInRole("Operator Admin")) {
			return;
		}
		scope.updateClock = {
			run: function () {
				if (!scope.stop) {
					if (scope.checkUnProcessedImage() && scope.updateClock) {
						var alrt = Ext.Msg;
						alrt.buttonText = { yes: 'Keep Working', no: 'Log out' };
						alrt.confirm('Alert', 'You will be logged out due to inactivity', scope.unAssignImage, scope);
						scope.runner.stop(scope.updateClock);
						scope.timeout = setTimeout(scope.logoutFunction, scope.logoutInterval, scope);
						return;
					}
				} else {
					scope.stop = false;
					scope.runner.start(scope.updateClock); // we can stop the task here if we need to.
				}
			},
			interval: scope.interval,
			scope: scope
		};
		scope.runner = new Ext.util.TaskRunner();
		scope.runner.start(scope.updateClock);
	},
	logoutFunction: function () {
		DCPLApp.warningMsg = false;  // to remove windows prompt message on logout
		__doPostBack('ctl00$btnLogout', '');

	},
	unAssignImage: function (btn) {
		var records = Cooler.CoolerImageForIR.grid.getStore().data, imageId = 0;
		if (btn === 'yes') {
			clearTimeout(this.timeout);
			this.assignNewImage();
			for (var i = 0; i < records.items.length; i++) {
				if (!records.get(i).get('VerifiedOn') && records.get(i).get('VerifiedOn') === "") {
					imageId = records.get(i).get('AssetPurityId');
					break;
				}
			}
			Ext.Ajax.request({
				url: EH.BuildUrl('AssetPurity'),
				params: {
					action: 'other',
					otherAction: 'UnAssign',
					assignedImageId: imageId
				},
				success: function () {
					var imagePreview = this.imagePreview.items.items[0].getComponent('imagePreview');
					if (imagePreview) {
						imagePreview.removeAll();
					}
					this.stop = true;
					this.runner.start(this.updateClock);
					//this.updateClock.delay(this.interval);
				},
				failure: function () {
					Ext.Msg.alert('Error', 'An error occured during unassignment');
				},
				scope: this
			});
		} else {
			this.stop = true;
			this.runner.start(this.updateClock);
			//this.updateClock.delay(this.interval);
		}
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

	showStatistics: function () {
		var sm = this.grid.getSelectionModel();
		var store = this.grid.getStore();
		var records = store.data;
		if (this.grid.title == "Water Meter") {
			if (store.data.length <= 0) {
				this.assignNewImage(); // if No image assign then it will assign new Image to operator
			} else {
				if (this.imageMask) {
					this.imageMask.hide();
				}
				if (this.gridRefreshTask && this.gridRefreshTask.stop !== undefined) {
					this.gridRefreshTask.stop();
				}
			}
			return;
		}
		var toolbarItems = this.imagePreview.topToolbar.items;

		for (var i = 0; i < records.items.length; i++) {
			if (records.get(i).get('VerifiedOn') === '' && records.get(i).get('StatusId') != Cooler.Enums.AssetPurityStatus.Rejected) {
				sm.selectRow(i);
				if (records.get(i).get('AssetPurityId') > 0) {
					toolbarItems.item('btnAssetPurityId').setText("<b>Image Id:</b> " + records.get(i).get('AssetPurityId'));
				}
				if (records.get(i).get('AssetId') > 0) {
					toolbarItems.item('btnAsset').setText("<b>Asset Id: </b>" + records.get(i).get('AssetId'));
				}
				if (records.get(i).get('SerialNumber') != '') {
					toolbarItems.item('btnSerialNumber').setText("<b>Serial Number: </b>" + records.get(i).get('SerialNumber'));
				}
				if (records.get(i).get('Location') != '') {
					toolbarItems.item('btnAssetLocation').setText("<b>Asset Location: </b>" + records.get(i).get('Location') + "," + records.get(i).get('Country'));
				}
				break;
			}
		}
		if (store.data.length <= 0) {
			this.assignNewImage(); // if No image assign then it will assign new Image to operator
		} else {
			if (this.imageMask) {
				this.imageMask.hide();
			}
			if (this.gridRefreshTask && this.gridRefreshTask.stop !== undefined) {
				this.gridRefreshTask.stop();
			}
		}
		this.statisticsButton = toolbarItems.last();
		Ext.Ajax.request({
			url: EH.BuildUrl('AssetPurity'),
			params: {
				action: 'other',
				otherAction: 'GetStatistics'
			},
			success: function (response) {
				var res = Ext.decode(response.responseText);
				if (res) {
					this.statisticsButton.setText(this.secondsToHms(res.split(',')[0]) + " (HH:MM:SS)/Image");
					toolbarItems.item('btnProcessedImages').setText("<b>Total Processed Images: </b>" + res.split(',')[1]);
				}
			},
			failure: function () {
				this.statisticsButton.setText("No statistic available");
			},
			scope: this
		});
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
	onBeforeSave: function (btn) {
		var record = this.grid.getSelectionModel().getSelected();
		if (record) {
			record.set('Priority', 1);
		}
		Cooler.CoolerImageForIR.onSave(btn, record, this);
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
	onSave: function (btn, record, me) {
		var btnText = btn.text;
		if (!record) {
			return;
		}
		var imagePreview = me.imagePreview;
		var comboContainer = imagePreview.getComponent('productComboContainer');
		comboContainer = comboContainer.getComponent('purityStatus');
		var purityStatus = [];
		var isPure = true;
		var depthValues = [];
		var shelves = record.get('Shelves');
		var columns = record.get('Columns');
		var statusId = record.get('StatusId');
		var verifiedOn = record.get('VerifiedOn');

		var store = me.comboStores.Product;
		for (var row = 0; row < shelves; row++) {
			for (var column = 0; column < columns; column++) {
				var product = comboContainer.getComponent('product' + row + column);
				var productId = product && product.getValue() ? product.getValue() : 0;
				purityStatus.push(productId);
				// To Do need to review this code
				store.findBy(function (record) {
					if (record.get('LookupId') === productId && record.get('CustomValue') === 1) {
						ispure = false;
					}
				});
				var depthSpinner = comboContainer.getComponent('depth' + row + column);
				if (!depthSpinner.isValid()) {
					//depthSpinner.setValue(0);
					Ext.Msg.alert('Validation Alert', 'Depth value should be between 0 to 20');
					return false;
				}
				var depth = depthSpinner.getValue() || 0;
				depthValues.push(depth);
			}
		}
		var now = new Date();
		var now_utc = null;
		if (statusId != Cooler.Enums.AssetPurityStatus.Provisioned) {
			now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
		}
		var toolbarItems = me.imagePreview.topToolbar.items;
		var isLightOn = toolbarItems.item('IsLightOn').getValue();
		var isNonBeverageItem = toolbarItems.item('IsNonBeverageItem').getValue();

		Ext.Ajax.request({
			url: EH.BuildUrl('AssetPurity'),
			params: {
				action: 'save',
				id: record.get('AssetPurityId'),
				PurityStatus: purityStatus.join(','),
				VerifiedOn: now_utc,
				PurityIssue: isPure ? 1 : 255,
				Priority: record.get('Priority'),
				DepthStatus: depthValues.join(','),
				IsLightOn: isLightOn,
				IsNonBeverageItem: isNonBeverageItem
			},
			success: function (response) {
				var data = Ext.decode(response.responseText);
				if (!data.success) {
					Ext.MessageBox.alert('Error', data.info);
				}
				else {
					DA.cancelInlineEditableGrid({ grid: me.grid, keyColumn: 'AssetPurityId' });
					me.updateCounter();
					me.grid.store.reload();
				}
			},
			failure: function () {
				Ext.Msg.alert('Error', 'Save failed');
			},
			scope: me
		});
	},
	assignNewImage: function () {
		Ext.Ajax.request({
			url: EH.BuildUrl('AssetPurity'),
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
				this.statisticsButton.setText("No statistic available");
			},
			scope: this
		});
	},
	onProductComboBlur: function (combo) {
		var comboStore = combo.store;
		if (comboStore.getRange().length === 0) {
			Ext.Msg.alert('Error', 'Product not found in the list.');
		}
		combo.removeClass('activeCombo');
		comboStore.clearFilter();
	},

	zoomIn: function () {
		this.zoom(1);
		this.transformations.zoom += 0.1;
	},

	zoomOut: function () {
		this.zoom(2);
		this.transformations.zoom -= 0.1;
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
		if (width > parentWidth) {
			img.el.setStyle('max-width', null);
		} else {
			img.el.setStyle('max-width', '98%');
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
		if (form.isValid()) {
			var notification = form.getValues().Notification;

			Ext.Ajax.request({
				url: EH.BuildUrl('AssetPurity'),
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
		}
		else {
			Ext.Msg.alert('Error', 'Please correct data errors before continuing.');
		}

	},
	configureListTab: function (config) {
		this.transformations = {
			rotate: 0,
			zoom: 0,
			defaultImageSize: []
		};
		var assetImagePanel = new Ext.Panel({
			region: 'center',
			autoScroll: true,
			title: 'Asset Image',
			bodyStyle: "text-align: center;",
			items: {
				itemId: 'assetPreview',
				xtype: 'xImage'
			}
		});
		this.assetImagePanel = assetImagePanel;

		var grid = this.grid;
		var westItems = [];
		if (DA.Security.HasPermission('Admin') || DA.Security.IsInRole("Operator") || DA.Security.IsInRole("Operator Admin")) {
			this.assetImagePanel.hidden = true;
			westItems.push(this.grid);
		} else {
			this.grid.hidden = true;
			westItems.push(this.assetImagePanel);
		}
		var westPanel = new Ext.Panel({ region: 'west', width: 400, split: true, hidden: false, collapsible: true, items: westItems, layout: 'fit' });
		grid.getTopToolbar().splice(0, 0, { text: 'Cooler Notification', iconCls: 'notificationIcon', handler: this.onAddMessage, scope: this });
		grid.getSelectionModel().on({
			'selectionchange': this.onRowClick,
			scope: this
		});

		grid.store.on('beforeload', function () {
			this.startIndex = 0;
		}, this);

		this.on('afterQuickSave', this.onAfterQuickSave, this);
		var btnZoomOut = new Ext.Toolbar.Button({ text: 'Zoom Out', handler: this.zoomOut, scope: this });
		var btnZoomIn = new Ext.Toolbar.Button({ text: 'Zoom In', handler: this.zoomIn, scope: this });
		var btnStatistics = new Ext.Toolbar.Button({ text: 'Show Statistics', scope: this });
		var btnAsset = new Ext.Toolbar.Button({ text: '<b>Asset Id: </b>', scope: this, itemId: 'btnAsset' });
		var btnCoolerImageId = new Ext.Toolbar.Button({ text: '<b>Image Id: </b>', scope: this, itemId: 'btnAssetPurityId' });
		var btnSerialNumber = new Ext.Toolbar.Button({ text: '<b>Serial Number: </b>', scope: this, itemId: 'btnSerialNumber' });
		var btnAssetLocation = new Ext.Toolbar.Button({ text: '<b>Asset Location: </b>', scope: this, itemId: 'btnAssetLocation' });
		var btnProcessedImages = new Ext.Toolbar.Button({ text: '<b>Total Processed Images: </b>', scope: this, itemId: 'btnProcessedImages' });

		var imagePreview = new Ext.Panel({
			title: 'Image',
			region: 'center',
			//Fabric 
			//html: '<canvas id="mycanvas" width="400" height="260" ></canvas>',
			layout: 'border',
			autoScroll: true,
			overflowX: 'scroll',
			cls: 'tbarCls',
			tbar: [btnZoomOut, btnZoomIn, btnCoolerImageId, btnAsset, btnSerialNumber, btnAssetLocation, btnProcessedImages, btnStatistics],
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

						},
					]
				}),
				{
					xtype: 'panel',
					region: 'south',
					height: 135,
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
			'<div class="thumb"><img src="{CustomStringValue}" caption="Smiley face" class="thumbimg"></div>',
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
		this.productsImage = productsImage;
		productsImage.on({
			'click': this.onProductPreview
		});
		store.on('load', function (options) {
			image_width = 105, image_height = 15;
			Ext.getCmp('my-data-view').setWidth(this.data.items.length * image_width);
			Ext.getCmp('my-data-view').setHeight(image_width - image_height);

		})
		this.grid.getStore().on('load', this.showStatistics, this);

		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [westPanel, imagePreview]
		});
		Ext.EventManager.onWindowResize(function () {
			image_width = 105, image_height = 15;
			Ext.getCmp('my-data-view').setHeight(image_width - image_height);
			Ext.getCmp('my-data-view').setWidth(Cooler.CoolerImageForIR.productsImage.getStore().data.items.length * image_width);
		})
	},

	//After quick save load the grid again
	onAfterQuickSave: function () {
		this.grid.getStore().load();
	},

	onProductPreview: function (mainDiv, itemLeft, imageDiv) {
		window.open(imageDiv.getElementsByClassName('thumbimg')[0].src, '', 'width=400, height=400, left=800, top=300');
	},
	arrangeImages: function () {
		//If record not selected and user press the crop button
		if (!this.grid.getSelectionModel() || !this.grid.getSelectionModel().getSelected()) {
			Ext.Msg.alert('Alert', 'No record is selected in the grid to enable this feature.');
			return;
		}
		if (!this.arrangeImageFrom) {
			var image = [
				[Cooler.Enums.Image.First, '1st Image'], [Cooler.Enums.Image.Second, '2nd Image']
			];
			var imageCombo = ExtHelper.CreateCombo({ fieldLabel: 'Crop Image', name: 'image', mode: 'local', store: image, width: 145 });
			this.imageCombo = imageCombo;
			var switchImages = new Ext.form.Checkbox({ fieldLabel: 'Switch images', name: 'switchImages' });
			var rotateFirstImg = new Ext.form.Checkbox({ fieldLabel: 'Rotate 1st image', name: 'rotateFirstImg' });
			var rotateSecondImg = new Ext.form.Checkbox({ fieldLabel: 'Rotate 2nd image', name: 'rotateSecondImg' });
			var arrangeImageFrom = new Ext.FormPanel({
				items: [
					{
						xtype: 'fieldset',
						title: 'Images custom settings',
						width: 280,
						height: 90,
						defaults: {
							labelStyle: 'width: 110px;'
						},
						items: [
							switchImages,
							rotateFirstImg,
							rotateSecondImg
						]
					},
					{
						xtype: 'fieldset',
						title: 'Crop Image',
						width: 280,
						height: 80,
						defaults: {
							labelStyle: 'width: 110px;'
						},
						items: [
							imageCombo,
							{
								xtype: 'button',
								text: 'Crop',
								handler: Cooler.CoolerImageForIR.cropImage,
								iconCls: 'btn-icon-crop',
								scope: this
							}
						]
					}
				]
			});
			this.arrangeImageFrom = arrangeImageFrom;
		}
		if (!this.arrangeImageWin) {
			var window = new Ext.Window({
				width: 300,
				height: 260,
				layout: 'fit',
				padding: 10,
				title: 'Arrange Images',
				resizable: false,
				constrain: true,
				items: arrangeImageFrom,
				closeAction: 'hide',
				tbar: [
					{
						xtype: 'button',
						text: 'Ok',
						handler: Cooler.CoolerImageForIR.updateImages,
						iconCls: 'save',
						scope: this
					},
					{
						xtype: 'button',
						text: 'Cancel',
						iconCls: 'cancel',
						handler: function () {
							this.arrangeImageWin.hide();
						},
						scope: this
					}
				],
				modal: true
			});
			this.arrangeImageWin = window;
		}
		this.arrangeImageWin.show();
	},
	cropImage: function () {
		//If record not selected and user press the crop button
		if (!this.grid.getSelectionModel() || !this.grid.getSelectionModel().getSelected()) {
			Ext.Msg.alert('Alert', 'No record is selected in the grid to enable this feature.');
			return;
		}
		var value = this.imageCombo.getValue();
		this.imageCombo.setValue();
		//If no image is selected then we are showing alert
		if (Ext.isEmpty(value)) {
			Ext.Msg.alert('Alert', 'First select the Image for crop.');
			return;
		}
		this.arrangeImageWin.hide();
		var record = this.grid.getSelectionModel().getSelected();
		var count = record.get('ImageCount');
		if (count > 0) {
			//Here we are checking either the second image exists if user select the second image for crop
			if (value > Cooler.Enums.Image.First && count == 1) {
				Ext.Msg.alert('Alert', 'Second image is not available for current selected purity.');
				return;
			}
			var origImageName = record.get('ImageName');
			var purityDate = record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate);
			var imageName = origImageName.replace('.jpg', '_' + value + '.jpg');
			this.image = "./thumbnail.ashx?imagePath=processed/" + purityDate + "/" + imageName + "&ignoreSetHeight=true&isStockimages=true&v=" + Math.random(1000) * 10000;
			//we are destroying window everytime. as we need to show the actual image everytime.
			var cropWindow = new Ext.ux.CropWindow({
				imageUrl: this.image,
				imageName: imageName,
				purityDate: purityDate,
				parent: this,
				listeners: {
					saveCrop: Cooler.CoolerImageForIR.onSaveCrop,
					activate: function (win) {
						if (!this.imageCropWinMask) {
							var imageCropWinMask = new Ext.LoadMask(this.getEl(), { msg: 'Image loading, Please wait...' });
							this.imageCropWinMask = imageCropWinMask;
						}
						this.imageCropWinMask.show();
					}
				}
			});
			cropWindow.show();
		}
	},
	//This event is call from the crop image window when save is clicked
	onSaveCrop: function (copWin, coodinates) {
		if (!this.imageCropMask) {
			var imageCropMask = new Ext.LoadMask(this.getEl(), { msg: 'Image cropping in processing, Please wait...' });
			this.imageCropMask = imageCropMask;
		}
		this.imageCropMask.show();
		if (!this.parent.grid.getSelectionModel()) {
			return;
		}
		var params = { action: 'other', otherAction: 'cropImage', imageName: copWin.imageName, purityDate: copWin.purityDate };
		Ext.apply(params, coodinates);
		Ext.Ajax.request({
			url: EH.BuildUrl('AssetPurity'),
			params: params,
			success: Cooler.CoolerImageForIR.onCropSucces,
			failure: function () {
				Ext.Msg.alert('Error', 'Cropping failed, try again..');
			},
			scope: this
		});
	},
	onCropSucces: function () {
		this.imageCropMask.hide();
		this.hide();
		this.parent.onArrangeImageSuccess();
		//Here we are frocefully destroying the component
		this.destroy();

		Ext.Msg.alert('Success', 'Image cropping done');
	},
	updateImages: function () {
		if (this.grid.getSelectionModel()) {
			this.arrangeImageWin.hide();
			var record = this.grid.getSelectionModel().getSelections()[0];
			var form = this.arrangeImageFrom.getForm();
			var formValues = form.getValues();
			var params = {
				action: 'other',
				otherAction: 'arrangeImage',
				switchImages: formValues.switchImages,
				rotateFirstImg: formValues.rotateFirstImg,
				rotateSecondImg: formValues.rotateSecondImg,
				imageName: record.get('ImageName'),
				imageCount: record.get('ImageCount'),
				purityDateTime: record.get('PurityDateTime').format(Cooler.Enums.DateFormat.PurityDate)

			};
			Ext.Ajax.request({
				url: EH.BuildUrl('AssetPurity'),
				params: params,
				success: this.onArrangeImageSuccess,
				failure: Cooler.CoolerImageForIR.onArrangeImageFailure,
				scope: this
			});
			if (!this.mask) {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			form.reset();
		}
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
		var imagePanel = this.imagePreview.items.items[0].getComponent('imagePreview');
		imagePanel.removeAll(true);
		var image = "";
		var origImageName = record.get('ImageName');
		if (count > 1) {
			for (var i = 1; i <= count; i++) {
				var imageName = origImageName.replace('.jpg', '_' + i + '.jpg');
				image = this.getNewImage(imageName, record.get('AssetPurityId'), record.get('PurityDateTimeUtc').format(Cooler.Enums.DateFormat.PurityDate));
				imagePanel.add(image);
			}
		}
		else {
			image = this.getNewImage(origImageName, record.get('AssetPurityId'), record.get('PurityDateTimeUtc').format(Cooler.Enums.DateFormat.PurityDate));
			imagePanel.add(image);
		}
		imagePanel.doLayout();
	},
	onArrangeImageFailure: function () {
		this.mask.hide();
		Ext.Msg.alert('Error', 'Some error occured');
	},
	syncPlanogram: function () {
		if (!this.planogram) {
			Ext.Msg.alert('Alert', 'Planogram is not assigned');
			return;
		}
		var productStore = this.comboStores.Product;
		var planogramValues = this.planogram;
		var comboContainer = this.imagePreview.getComponent('productComboContainer');
		comboContainer = comboContainer.getComponent('purityStatus');
		var totalColumns = comboContainer.layout.columns
		var totalRows = comboContainer.layout.currentRow + 1;
		for (var i = 0; i < totalRows; i++) {
			for (var j = 0; j < totalColumns; j++) {
				var comp = comboContainer.getComponent('product' + i + j);
				if (comp) {
					comp.setValue("");
				}
			}
		}
		var planogramRows = planogramValues.length;
		for (var i = 0; i < planogramRows && i < totalRows; i++) {
			var prod = planogramValues[i].products;
			planogramColumns = prod.length;
			for (var j = 0; j < planogramColumns && j < totalColumns; j++) {
				var comp = comboContainer.getComponent('product' + i + j);
				if (comp) {
					comp.setValue(prod[j].id);
				}
			}
		}
	},
	showNewWindow: false,
	onFocusProductImage: function (grid) {
		var record = productGrid.getSelectionModel().getSelected();
		var imageGridList = this.productsImage.getStore();
		var RecordType = Ext.data.Record.create([{ name: 'CustomStringValue', type: 'string' }]);
		imageGridList.removeAll();
		var imageLocation = location.href.indexOf('default.aspx') == -1 ? location.href.concat('products/') : location.href.replace('default.aspx', 'products/');
		var csvFileNames = record.json.ProductImages;//record.get('CustomStringValue');
		if (csvFileNames.length > 0) {
			if (this.showNewWindow) {
				var productWin = window.open('', 'productWin', 'width = 500, height = 500 left=800, top=300');
				productWin.document.body.innerHTML = "";
			}
			var filenames = csvFileNames.split(',');
			for (var i = 0; i < filenames.length; i++) {
				var newImageRecord = new RecordType({
					CustomStringValue: filenames[i].trim()
				});
				if (record.get('CustomStringValue') === newImageRecord.data.CustomStringValue) {
					newImageRecord.data.CustomStringValue = imageLocation + "thumbnails/" + newImageRecord.data.CustomStringValue;
				}
				else {
					newImageRecord.data.CustomStringValue = imageLocation + newImageRecord.data.CustomStringValue;
				}
				imageGridList.add(newImageRecord);
				if (this.showNewWindow) {
					productWin.document.write("<div style='float:left'><img src=" + imageLocation.concat(newImageRecord.get('CustomStringValue')) + " height=200px /></div>");
				}
			}
		}
		image_width = 105, image_height = 15;
		Ext.getCmp('my-data-view').setWidth(imageGridList.data.items.length * image_width);
		Ext.getCmp('my-data-view').setHeight(image_width - image_height);

	},

	onProductGridDblClick: function (e) {
		var record = grid.getSelectionModel().getSelected();
		if (!record) {
			return;
		}

		var imagePreview = this.imagePreview;
		if (imagePreview) {
			var comboContainer = imagePreview.getComponent('productComboContainer');
			comboContainer = comboContainer.getComponent('purityStatus');
			if (comboContainer) {
				var combo = comboContainer.getComponent('product' + this.currentComboRowIndex + this.currentComboColIndex);
				if (combo) {
					combo.setValue(record.get('LookupId'));
				}
				this.currentComboColIndex++;

				record = this.grid.getSelectionModel().getSelected();

				var columns = record.get('Columns');
				if (this.currentComboColIndex === columns) {
					this.currentComboRowIndex = Math.ceil(this.currentComboRowIndex + 1, record.get('Shelves') - 1);
					this.currentComboColIndex = 0;
				}
				var nextCombo = comboContainer.getComponent('product' + this.currentComboRowIndex + this.currentComboColIndex);
				if (nextCombo) {
					nextCombo.focus();
				}
			}
		}
	}
});
Cooler.CoolerImageForIR = new Cooler.CoolerImageForIRForm({
	uniqueId: 'AssetPurityForIR', gridPlugins: [new DA.form.plugins.Inline({
		modifiedRowOptions: {
			fields: 'modified'
		}
	})]
});
Cooler.CoolerImageForAsset = new Cooler.CoolerImageForIRForm({ uniqueId: 'AssetPurityForAsset', baseParams: { processed: 1 } });
Cooler.CoolerImageForAlert = new Cooler.CoolerImageForIRForm({ uniqueId: 'AssetPurityForAlert', baseParams: { processed: 1 } });