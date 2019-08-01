Cooler.CoolerImageIRVsManual = Ext.extend(Cooler.Form, {
	formTitle: 'IR VS Self QC',
	listTitle: 'IR VS Self QC',
	keyColumn: 'AssetPurityImageId',
	uniqueId: 'AssetPurityForIR',
	controller: 'AssetPurityImage',
	disableAdd: true,
	disableDelete: true,
	editable: true,
	securityModule: 'QualityCheckForIRManual',
	comboTypes: [
		'Product',
		'AssetPurityStatus'
	],
	constructor: function (config) {
		Cooler.CoolerImageIRVsManual.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true,
				allowBulkDelete: true
			},
			defaults: { sort: { dir: 'DESC', sort: 'AssetPurityImageId' } },
			sm: new Ext.grid.RowSelectionModel({ singleSelect: true })
		});
	},
	comboStores: {
		Product: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup.concat({ name: "IsTrained", type: "bool" }), id: 'LookupId' }),
		ProductList: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		AssetPurityStatus: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},

	hybridConfig: function () {
		var assetPurityStatusCombo = DA.combo.create({ store: this.comboStores.AssetPurityStatus });
		var items = [
			{ dataIndex: 'PurityDateTimeUtc', type: 'date' },
			{ dataIndex: 'AssetPurityImageId', type: 'int', header: 'Id' },
			{ dataIndex: 'CreatedOn', type: 'date', header: 'Image Received On', width: 140, renderer: Cooler.renderer.DateTimeWithLocalTimeZone, convert: Ext.ux.DateLocalizer },
			{ dataIndex: 'SceneTypeCategory', type: 'string', header: 'Scene', width: 100 },
			{ dataIndex: 'SceneTypeName', type: 'string', header: 'Subscene Type', width: 100 },
			{ header: "Self Check?", type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean, dataIndex: 'SelfCheck' },
			{ header: "Client Check?", type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean, dataIndex: 'ClientCheck' },
			{ dataIndex: 'Country', type: 'string', header: 'Country' },
			{ dataIndex: 'IrUserName', type: 'string', header: 'UserName' },
			{ dataIndex: 'ImageTypeName', type: 'string', header: 'Image Type' },
			{ dataIndex: 'ImageUid', type: 'string', header: 'Image Uid' },
			{ dataIndex: 'ClientCode', header: 'CoolerIoT Client', type: 'string', width: 150 },
			//Need to Add Accuracy HERE
			{ dataIndex: 'PurityDateTime', type: 'date', header: 'Image Date/ Time', width: 140, rendererInfo: 'TimeZoneRenderer', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ dataIndex: 'VerifiedOn', type: 'date', header: 'Recognition time', width: 140, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ dataIndex: 'ModifiedOn', type: 'date', header: 'IR Modified time', width: 140, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer, hidden: true },
			{ dataIndex: 'RecogenitionTime', type: 'string', header: 'Recogenition Time(Seconds)', width: 100 },
			{ dataIndex: 'ImageSizeReadable', type: 'string', header: 'Image Size Readable', width: 120, },
			{ dataIndex: 'BrandError', type: 'float', header: 'Product Error', width: 100, allowDecimal: true },
			{ dataIndex: 'SKUError', type: 'float', header: 'SKU Error', width: 100, allowDecimal: true },
			{ dataIndex: 'BrandAccuracy', type: 'float', header: 'Product Accuracy', width: 100, allowDecimal: true },
			{ dataIndex: 'SKUAccuracy', type: 'float', header: 'SKU Accuracy', width: 100, allowDecimal: true },
			{ dataIndex: 'BrandFacing', type: 'float', header: 'Product Facing', width: 100, allowDecimal: true },
			{ dataIndex: 'SKUFacing', type: 'float', header: 'SKU Facing', width: 100, allowDecimal: true },
			{ dataIndex: 'ImageName', type: 'string', header: 'Image Files Name' },
			{ dataIndex: 'SessionUid', type: 'string', header: 'Session Uid' },
			{ dataIndex: 'SceneUid', type: 'string', header: 'Scene Uid' },
			{ dataIndex: 'TimeZoneId', type: 'int', width: 50 },
			{ dataIndex: 'AssetPurityId', type: 'int' },
			{ dataIndex: 'ConsumerEmail', type: 'string' },
			{ dataIndex: 'AssetId', type: 'int' },
			{ dataIndex: 'SubStatusId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ dataIndex: 'AssignedOn', type: 'date' },
			{ dataIndex: 'SerialNumber', type: 'string', width: 120 },
			{ dataIndex: 'Location', type: 'string', width: 100 }
		];

		if (this.uniqueId == "AssetPurity") {
			items.push({ dataIndex: 'ModifiedByUser', type: 'string', header: 'Verified By', width: 150 });
		}
		items.push({ dataIndex: 'PurityStatus', type: 'string' },
			{ dataIndex: 'ManualPurityStatus', type: 'string' },
			{ dataIndex: 'ClientPurityStatus', type: 'string' },
			{ dataIndex: 'PurityIssueStatus', type: 'string' },
			{ dataIndex: 'Columns', type: 'int' },
			{ dataIndex: 'ItemsPerColumn', type: 'int' },
			{ dataIndex: 'Priority', type: 'int' },
			{ dataIndex: 'ImageName', type: 'string' },
			{ dataIndex: 'State', type: 'string' },
			{ dataIndex: 'CountryId', type: 'int' },
			{ dataIndex: 'ImageCount', type: 'int' },
			{ dataIndex: 'StateId', type: 'int' },
			{ dataIndex: 'PlanogramId', type: 'int' },
			{ dataIndex: 'DepthStatus', type: 'string' },
			{ dataIndex: 'IsLightOn', type: 'bool' },
			{ dataIndex: 'IsNonBeverageItem', type: 'bool' },
			{ dataIndex: 'Shelves', type: 'int', width: 80, align: 'right' })
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
				else if ((Ext.isEmpty(clientId) && Ext.isEmpty(countryId)) || (clientId == 0 && countryId == 0)) {
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
			comboContainer.remove('manualPurityStatus', true);
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
		var subStatusId = record.get('SubStatusId');
		//var showManualRecognitaionCombo = subStatusId == Cooler.Enums.CoolerImageSubStatusType.ImageQueueToIR;
		var columnWidth = ((comboContainer.el.getWidth() - (enableDepth ? (37 * columns) : 0)) / columns) - 1;


		var manualPurityStatus = Ext.isEmpty(record.get('ManualPurityStatus')) ? [] : record.get('ManualPurityStatus');
		// Client Mmanual Purity Status

		var loadedFromtext = 'N/A'
		if (manualPurityStatus.length != 0) {
			manualPurityStatus = record.get('ManualPurityStatus').indexOf(',') > 0 ? record.get('ManualPurityStatus').split(',') : record.get('ManualPurityStatus');
			loadedFromtext = record.dirty ? 'IR' : 'Self Check';
		}

		for (var row = 0; row < shelves; row++) {
			for (var column = 0; column < columns; column++) {
				var productCombo = DA.combo.create({
					store: comboStore,
					itemId: 'product' + row + column,
					itemIndex: pos,
					value: Number(purityStatus[pos] || Cooler.Enums.Product.Unknown),
					tpl: me.productComboTpl,
					cls: (manualPurityStatus.length != 0 && manualPurityStatus.length >= pos && Number(purityStatus[pos]) != Number(manualPurityStatus[pos])) ? 'IRvsManualComboNotMatched' : '',
					listWidth: 250,
					disabled: true,
					width: columnWidth < 100 ? 200 : columnWidth + 100,
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
			tbar: ['<B>IR Result<B>', '-', '<a class="IRvsManualNotTrainedProduct">Un-Trained Product<a>', '-', '<a class="IRvsManualComboNotMatched">Product Not Match<a>'],
			layout: 'table',
			autoWidth: true,
			layoutConfig: {
				columns: (columns * 2)
			},
			items: purityCombos
		});

		var manualPurityCombos = [];
		var manualPurityPos = 0;
		for (var row = 0; row < shelves; row++) {
			for (var column = 0; column < columns; column++) {
				var comboValue = Number(manualPurityStatus[manualPurityPos] || Cooler.Enums.Product.Unknown);
				var commboRecordIndex = comboStore.findExact('LookupId', comboValue)
				var comboRecord = comboStore.getAt(commboRecordIndex);
				var productCombo = DA.combo.create({
					store: comboStore,
					itemId: 'product' + row + column,
					itemIndex: manualPurityPos,
					value: comboValue,
					tpl: me.productComboTpl,
					listWidth: 350,
					cls: comboRecord && !comboRecord.get('IsTrained') ? 'IRvsManualNotTrainedProduct' : '',
					width: columnWidth < 100 ? 200 : columnWidth + 100,
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
				manualPurityPos++;
				manualPurityCombos.push(productCombo);
				manualPurityCombos.push(depthSpinner);
			}

			var syncButton = new Ext.Toolbar.Button({ text: 'IR Sync', iconCls: 'refresh', handler: this.syncPurityCombo, scope: this });
			comboContainer.add({
				itemId: 'manualPurityStatus',
				layout: 'table',
				autoWidth: true,
				tbar: ['Mmanual Ground Truth Loaded from : ' + loadedFromtext, syncButton],
				layoutConfig: {
					columns: (columns * 2)
				},
				items: manualPurityCombos
			});
		}
		comboContainer.doLayout();

		//Focus on first combo
		if (purityCombos.length > 0) { // if combo available then set focus
			comboContainer = comboContainer.getComponent('manualPurityStatus');
			if (comboContainer) {
				comboContainer.getComponent('product00').focus('', 500);
			}
		}
	},
	reloadCombos: function (me, record) {
		if (!record) {
			return;
		}
		me.currentRecord = record;
		Cooler.CoolerImageIRVsManual.onComboLoad(me, record.get('CountryId'), record.get('StateId'), record.get('ClientId'));
	},
	onRowClick: function (grid) {
		var store;
		var record = grid.getSelected();
		if (!this.imageMask) {
			var imageMask = new Ext.LoadMask(this.imagePreview.getEl(), {
				msg: "Image is loading, Please wait..."
			});
			this.imageMask = imageMask;
		}
		//this.imageMask.show();
		if (!record || record === this.selectedRecord) {
			return;
		}
		var imagePreview = this.imagePreview;
		// setting Image scouce to balnk first.
		var count = record.get('ImageCount');
		var imagePanel = this.imagePreview.getComponent('imagePreview');
		imagePanel.removeAll(true);
		var image = "";
		var origImageName = record.get('ImageName');
		var AccuracyData = [{
			BrandAccuracy: 0,
			SKUAccuracy: 0,
			TotalTrainedFacing: 0,
			Facing: 0,
			BrandError: 0,
			TotalError: 0
		}];

		var manualVsIRResultData = {};
		manualVsIRResultData.AccuracyData = AccuracyData;
		this.manualVsIrResultPanel.body.update(this.manualVsIRResultTemplate.apply(manualVsIRResultData));
		var accuracyGridStore = this.accuracyGrid.getStore();
		accuracyGridStore.removeAll();
		this.getManualVsIRResult(record.get('AssetPurityImageId'));

		image = this.getNewImage(origImageName, record.get('PurityDateTimeUtc').format(Cooler.Enums.DateFormat.PurityDate));
		if (image != undefined) {
			imagePanel.add(image);

		}

		this.transformations.zoom = 0;
		this.transformations.defaultImageSize = [];
		var toolbarItems = this.imagePreview.topToolbar.items;
		var recordData = record.data;
		toolbarItems.item('btnImageDateTime').setText("<b>Image Time:</b> " + record.get('PurityDateTime'));

		var planogramId = recordData.PlanogramId;
		this.selectedRecord = record;
		this.reloadCombos(this, record);
		imagePanel.doLayout();
	},

	onPlanogramDataLoaded: function (form, data) {
		var record = data.data;
		if (record.Id !== 0 && record.FacingDetails) {
			this.planogram = Ext.decode(record.FacingDetails);
		}
		this.currentRecord = this.selectedRecord;
		Cooler.CoolerImageIRVsManual.onComboLoad(this, this.currentRecord.get('CountryId'), this.currentRecord.get('StateId'), this.currentRecord.get('ClientId'));
	},

	getManualVsIRResult: function (assetPurityImageId) {
		Ext.Ajax.request({
			url: EH.BuildUrl('AssetPurityImage'),
			params: {
				action: 'other',
				otherAction: 'GetImageResults',
				AssetPurityImageId: assetPurityImageId
			},
			success: function (response, data) {
				if (this.saveMask)
					this.saveMask.hide();
				if (response.responseText) {
					var manualVsIRResultData = Ext.decode(response.responseText);
					if (manualVsIRResultData.AccuracyData) {
						var accuracyData = manualVsIRResultData.AccuracyData[0];
						if (accuracyData) {
							this.BrandAccuracy = accuracyData.BrandAccuracy;
							this.SKUAccuracy = accuracyData.SKUAccuracy;
							this.BrandFacing = accuracyData.TotalTrainedFacing;
							this.SKUFacing = accuracyData.Facing;
							this.BrandError = accuracyData.BrandError;
							this.SKUError = accuracyData.TotalError;
							this.manualVsIrResultPanel.body.update(this.manualVsIRResultTemplate.apply(manualVsIRResultData));
						} 
					}
					var accuracyGridStore = this.accuracyGrid.getStore();
					if (accuracyGridStore && manualVsIRResultData.ProductLevelData) {
						accuracyGridStore.loadData(manualVsIRResultData.ProductLevelData);
					}
				}
			},
			failure: function () {
				Ext.Msg.alert('Error', 'An error occured during loading Accuracy results.');
			},
			scope: this
		});
	},

	getNewImage: function (name, purityDatetime) {
		var img = new Ext.ux.Image({
			listeners: {
				render: function (image) {
					image.el.on('load', function (evt) {
						var me = Cooler.CoolerImageIRVsManual;
						var config = Ext.apply({ id: this.id, width: evt.target.width, height: evt.target.height });
						me.transformations.defaultImageSize.push(config);
						var imagePanel = me.imagePreview.getComponent('imagePreview');
						imagePanel.doLayout();
						imagePanel.ownerCt.doLayout()
						image.scope.imageMask.hide();
					});
				}
			},
			style: 'max-width: 98%;margin: 5px; vertical-align: middle; float: inherit; height: auto!important; overflow: scroll;',
			src: 'Controllers/CoolerImagePreview.ashx?AssetImageName=' + name + '&v=' + new Date() + '&PurityDateTime=' + purityDatetime,
			scope: this
		});
		return img;
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
		Cooler.CoolerImageIRVsManual.grid.getSelectionModel().selectRow(rowIndex);

	},

	checkUnProcessedImage: function () {
		var records = Cooler.CoolerImageIRVsManual.grid.getStore().data, toReturn = false;
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
	ShowList: function (config, extraOptions) {
		config = config || {};
		Cooler.Form.prototype.ShowList.call(this, config, extraOptions);
		var grid = this.grid;
		if (grid) {
			var topToolbar = grid.getTopToolbar();
			if (extraOptions && extraOptions.extraParams && extraOptions.extraParams.PurityDateTimeFrom && extraOptions.extraParams.PurityDateTimeTo) {
				if (this.startDateSeparator) {
					this.endDate && this.endDate.destroy();
					this.endDateLabel && this.endDateLabel.destroy();
					this.endDateSeparator && this.endDateSeparator.destroy();
					this.startDate && this.startDate.destroy();
					this.startDateLabel && this.startDateLabel.destroy();
					this.startDateSeparator.destroy();
				}
				if (!Array.isArray(topToolbar)) {

					this.startDateSeparator = topToolbar.addSeparator();
					this.startDateLabel = topToolbar.addText('From Date : ');
					this.startDate = new Ext.form.DateField({ name: 'StartDate', fieldLabel: 'Start Date', width: 100, format: DA.Security.info.Tags.DateFormat });
					this.endDate = new Ext.form.DateField({ name: 'EndDate', fieldLabel: 'End Date', width: 100, format: DA.Security.info.Tags.DateFormat });
					this.endDateSeparator = topToolbar.addSeparator();
					this.endDateLabel = topToolbar.addText('To Date : ');

					this.startDate.disabled = true;
					this.startDate.setValue(grid.baseParams.PurityDateTimeFrom);
					this.endDate.setValue(grid.baseParams.PurityDateTimeTo);
					this.endDate.disabled = true;

					topToolbar.addItem(this.startDateSeparator);
					topToolbar.addItem(this.startDateLabel);
					topToolbar.addItem(this.startDate);
					topToolbar.addItem(this.endDateSeparator);
					topToolbar.addItem(this.endDateLabel);
					topToolbar.addItem(this.endDate);
					grid.container.autoHeight()
					grid.ownerCt.ownerCt.ownerCt.doLayout()
				}

			} else {
				if (this.startDateLabel) {
					this.endDate.destroy();
					this.endDateLabel.destroy();
					this.endDateSeparator.destroy();
					this.startDate.destroy();
					this.startDateLabel.destroy();
					this.startDateSeparator.destroy();

					delete grid.baseParams.PurityDateTimeFrom;
					delete grid.baseParams.PurityDateTimeTo;
					delete grid.baseParams.selectedMonth;
					delete this.startDateSeparator;
				}
			}
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
		var records = Cooler.CoolerImageIRVsManual.grid.getStore().data, imageId = 0;
		//if (btn === 'yes') {
		//	clearTimeout(this.timeout);
		//	this.assignNewImage();
		//	for (var i = 0; i < records.items.length; i++) {
		//		if (!records.get(i).get('VerifiedOn') && records.get(i).get('VerifiedOn') === "") {
		//			imageId = records.get(i).get('AssetPurityId');
		//			break;
		//		}
		//	}
		//	Ext.Ajax.request({
		//		url: EH.BuildUrl('AssetPurity'),
		//		params: {
		//			action: 'other',
		//			otherAction: 'UnAssign',
		//			assignedImageId: imageId
		//		},
		//		success: function () {
		//			var imagePreview = this.imagePreview.items.items[0].getComponent('imagePreview');
		//			if (imagePreview) {
		//				imagePreview.removeAll();
		//			}
		//			this.stop = true;
		//			this.runner.start(this.updateClock);
		//			//this.updateClock.delay(this.interval);
		//		},
		//		failure: function () {
		//			Ext.Msg.alert('Error', 'An error occured during unassignment');
		//		},
		//		scope: this
		//	});
		//} else {
		//	this.stop = true;
		//	this.runner.start(this.updateClock);
		//	//this.updateClock.delay(this.interval);
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
	onBeforeSave: function (btn) {
		var record = this.grid.getSelectionModel().getSelected();
		if (record) {
			record.set('Priority', 1);
		}
		Ext.MessageBox.show({
			msg: 'Do you want to save your changes?',
			buttons: Ext.Msg.YESNO,
			animEl: 'elId',
			icon: Ext.MessageBox.QUESTION,
			fn: function (btn) {
				if (btn == 'yes') {
					this.saveMask = new Ext.LoadMask(this.grid.ownerCt.ownerCt.body, { msg: 'Please wait...' });
					this.saveMask.show();
					Cooler.CoolerImageIRVsManual.onSave(btn, record, this);
				}
			},
			scope: this
		});

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
		var productComboContainer = imagePreview.getComponent('productComboContainer');
		var comboContainer = productComboContainer.getComponent('purityStatus');
		var purityStatus = [];
		var manualPurityStatus = [];
		var isPure = true;
		var depthValues = [];
		var shelves = record.get('Shelves');
		var columns = record.get('Columns');
		var statusId = record.get('StatusId');
		var verifiedOn = record.get('VerifiedOn');

		var store = me.comboStores.Product;
		var isManualPurityStatus = record.get('SubStatusId') == Cooler.Enums.CoolerImageSubStatusType.ImageQueueToIR;
		var manualComboContainer = productComboContainer.getComponent('manualPurityStatus');
		for (var row = 0; row < shelves; row++) {
			for (var column = 0; column < columns; column++) {
				var product = manualComboContainer.getComponent('product' + row + column);
				var productId = product && product.getValue() ? product.getValue() : 0;
				manualPurityStatus.push(productId);
			}
		}

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

		var params = {
			action: 'save',
			id: record.get('AssetPurityImageId'),
			PurityStatus: purityStatus.join(','),
			ManualPurityStatus: manualPurityStatus.join(','),
			BrandError: this.BrandError,
			SKUError: this.SKUError,
			BrandAccuracy: this.BrandAccuracy,
			SKUAccuracy: this.SKUAccuracy,
			BrandFacing: this.BrandFacing,
			SKUFacing: this.SKUFacing
		}



		Ext.Ajax.request({
			url: EH.BuildUrl('AssetPurityImage'),
			params: params,
			success: function (response) {
				var data = Ext.decode(response.responseText);
				if (!data.success) {
					me.saveMask.hide();
					Ext.MessageBox.alert('Error', data.info);
				}
				else {
					DA.cancelInlineEditableGrid({ grid: me.grid, keyColumn: 'AssetPurityImageId' });
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
		//Ext.Ajax.request({
		//	url: EH.BuildUrl('AssetPurity'),
		//	params: {
		//		action: 'other',
		//		otherAction: 'AssignNewImage'
		//	},
		//	success: function (response) {
		//		var res = Ext.decode(response.responseText);
		//		if (!this.imageMask) {
		//			var imageMask = new Ext.LoadMask(this.imagePreview.getEl(), {
		//				msg: "Image not available for processing, Please wait..."
		//			});
		//			this.imageMask = imageMask;
		//		}
		//		if (res === "Image not available") {
		//			if (this.runner) {
		//				this.runner.stop(this.updateClock);
		//			}

		//			this.imageMask.show();
		//			if (!this.gridRefreshTask) {
		//				this.startAutoGridRefresh(this.grid);
		//			} else if (this.gridRefreshTask.start !== undefined) {
		//				this.gridRefreshTask.start();
		//			}
		//			return;
		//		} else {
		//			this.grid.getStore().reload();
		//			this.stop = true;
		//			if (this.runner) {
		//				this.runner.start(this.updateClock);
		//			}
		//			this.imageMask.hide();
		//		}
		//	},
		//	failure: function () {
		//		this.statisticsButton.setText("No statistic available");
		//	},
		//	scope: this
		//});
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
		return this.imagePreview.getComponent('imagePreview');
	},
	zoom: function (zoomType) {
		var images = this.getEl().items.items;
		for (var i = 0, len = images.length; i < len; i++) {
			this.setZoomSize(images[i], zoomType);
		}
		var imagePanel = this.imagePreview.getComponent('imagePreview');
		imagePanel.doLayout();
	},
	resetZoom: function () {
		this.zoom(3);
		this.transformations.zoom = 0;
	},
	myData: [],

	configureListTab: function (config) {
		this.transformations = {
			rotate: 0,
			zoom: 0,
			defaultImageSize: []
		};


		var grid = this.grid;
		var westItems = [];

		this.grid.region = 'center';
		this.grid.height = 600;
		westItems.push(this.grid);

		var westPanel = new Ext.Panel({ region: 'west', width: 400, split: true, hidden: false, collapsible: true, items: westItems, layout: 'border' });
		grid.getSelectionModel().on({
			'selectionchange': this.onRowClick,
			scope: this
		});
		westPanel.on('collapse', function () {
			var productComboContainer = this.imagePreview.getComponent('productComboContainer');
			var comboContainer = productComboContainer.getComponent('purityStatus');
			//productComboContainer.doLayout();
		}, this);
		this.showManualIRImages = new Ext.form.Checkbox({ fieldLabel: 'Show Self IR Images', name: 'ShowManualIRImages', scope: this, itemId: 'ShowManualIRImages' });
		// Loading grid after check box changes
		this.showManualIRImages.on('check', this.onAfterQuickSave, this)

		grid.getTopToolbar().push("Show Self IR Images : ");
		grid.getTopToolbar().push(this.showManualIRImages);

		grid.store.on('beforeload', function (store, data) {
			store.baseParams.ShowManualIRImages = this.showManualIRImages.getValue();
			this.startIndex = 0;
		}, this);

		this.on('afterQuickSave', this.onAfterQuickSave, this);
		var btnSaveImage = new Ext.Toolbar.Button({ text: 'Save', handler: this.onBeforeSave, scope: this, iconCls: 'Save' });
		var btnZoomOut = new Ext.Toolbar.Button({ text: 'Zoom Out', handler: this.zoomOut, scope: this });
		var btnZoomIn = new Ext.Toolbar.Button({ text: 'Zoom In', handler: this.zoomIn, scope: this });

		var btnCoolerImageDateTime = new Ext.Toolbar.Button({ text: '<b>Image Time: </b>', scope: this, itemId: 'btnImageDateTime' });

		var imagePreview = new Ext.Panel({
			title: 'Image',
			region: 'center',
			layout: 'border',

			overflowX: 'scroll',
			cls: 'tbarCls',
			tbar: [btnSaveImage, btnZoomOut, btnZoomIn, btnCoolerImageDateTime],
			items: [
				{
					itemId: 'imagePreview',
					autoScroll: true,
					region: 'center',
					xtype: 'panel'
				},
				{
					xtype: 'panel',
					region: 'south',
					layout: 'column',
					autoScroll: true,
					autoHeight: true,
					//autoWidth: true,
					split: true,
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

		store.on('load', function (options) {
			image_width = 105, image_height = 15;
			Ext.getCmp('my-data-view').setWidth(this.data.items.length * image_width);
			Ext.getCmp('my-data-view').setHeight(image_width - image_height);

		});
		this.accuracyPanel = this.getAccuracyPanel();
		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [westPanel, imagePreview, this.accuracyPanel]
		});
		Ext.EventManager.onWindowResize(function () {
			image_width = 105, image_height = 15;
			Ext.getCmp('my-data-view').setHeight(image_width - image_height);
			Ext.getCmp('my-data-view').setWidth(Cooler.CoolerImageIRVsManual.productsImage.getStore().data.items.length * image_width);
		})
	},
	syncPurityCombo: function () {
		if (!this.currentRecord) {
			return;
		}
		var record = this.currentRecord;
		var purityStatus = record.get('PurityStatus')
		if (!Ext.isEmpty(purityStatus)) {
			// Loading ManualPurityStatus from PurityStatus
			record.set('ManualPurityStatus', record.get('PurityStatus'));
			this.currentRecord = record;
		}
		Cooler.CoolerImageIRVsManual.onComboLoad(this, record.get('CountryId'), record.get('StateId'), record.get('ClientId'));
	},
	getAccuracyPanel: function () {
		this.manualVsIRResultTemplate = new Ext.XTemplate(
			'<div class="IRvsManual">',
			'<table class="ProductLevelDataTable">',
			'<tr>',
			'<td><b>SKU<b></td>',
			'<td><b>Product<b></td>',
			'</tr>',
			'<tpl for="AccuracyData">',
			'<tr>',
			'<td>Facing: {Facing}</td>',
			'<td>Facing: {TotalTrainedFacing}</td>',
			'</tr>',
			'<tr>',
			'<td>Error: {TotalError}</td>',
			'<td>Error: {BrandError}</td>',
			'</tr>',
			'<tr>',
			'<td>Accuracy: {SKUAccuracy}%</td>',
			'<td>Accuracy: {BrandAccuracy}%</td>',
			'</tr>',
			'</tpl>',
			'</table>',
			'</div>'
		);
		var manualVsIrResultPanel = new Ext.Panel({
			itemId: 'manualVsIrResultPanel',
			width: '100%',
			height: '100%',
			tpl: this.manualVsIRResultTemplate,
			border: false
		});
		this.manualVsIrResultPanel = manualVsIrResultPanel;
		var accureacyStore = new Ext.data.JsonStore({
			fields: ['ProductName', 'ProductCount', 'IRMatchCount', 'ErrorCount', 'Accuracy', 'ProductId', 'IsTrained'], id: 'ProductId'
		});
		var accuracyGrid = new Ext.grid.GridPanel({
			store: accureacyStore,
			autoHeight: true,
			border: false,
			autoWidth: true,
			bodyStyle: 'marginTop:2em;',
			columns: [
				{ header: "Product", width: 150, dataIndex: 'ProductName' },
				{ header: "Is Trained?", width: 80, renderer: ExtHelper.renderer.Boolean, dataIndex: 'IsTrained' },
				{ header: "GT Facing", width: 55, align: 'right', dataIndex: 'ProductCount' },
				{ header: "Matched Facing", width: 55, align: 'right', dataIndex: 'IRMatchCount', hidden: true },
				{ header: "Error", width: 55, align: 'right', dataIndex: 'ErrorCount' },
				{ header: "Accuracy", align: 'right', dataIndex: 'Accuracy', hidden: true }
			]
		});
		this.accuracyGrid = accuracyGrid;

		var accuracyPanel = new Ext.Panel({
			title: 'Accuracy',
			region: 'east',
			height: '100%',
			autoScroll: true,
			width: '25%',
			layout: 'column',
			collapsible: true,
			split: true,
			items: [
				manualVsIrResultPanel, accuracyGrid
			]
		});
		return accuracyPanel;

	},

	//After quick save load the grid again
	onAfterQuickSave: function () {
		this.grid.getStore().load();
	},

	showNewWindow: false,

});
Cooler.CoolerImageIRVsManual = new Cooler.CoolerImageIRVsManual({
	uniqueId: 'AssetPurityForIRVsManual', gridPlugins: [new DA.form.plugins.Inline({
		modifiedRowOptions: {
			fields: 'modified'
		}
	})]
});