Cooler.CoolerProcessedImage = new Cooler.Form({
	listTitle: 'Vision',
	keyColumn: 'AssetPurityId',
	controller: 'AssetPurity',
	securityModule: 'Vision',
	disableAdd: true,
	disableDelete: true,
	uniqueId: 'Vision',
	comboTypes: [
		'AssetPurityStatus'
	],
	custom: {
		loadComboTypes: true,
		allowBulkDelete: true
	},
	defaults: { sort: { dir: 'DESC', sort: 'DoorClose' } },
	sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
	comboStores: {
		AssetPurityStatus: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},

	onGridCreated: function (grid) {
		grid.store.on('load', this.onGridStoreLoad, this);
		grid.store.on('beforeload', this.onBeforeGridStoreLoad, this);
	},

	hybridConfig: function () {
		var assetPurityStatusCombo = DA.combo.create({ store: this.comboStores.AssetPurityStatus });
		return [
			{ dataIndex: 'Columns', type: 'int' },
			{ header: 'Id', dataIndex: 'AssetPurityId', type: 'int' },
			{ dataIndex: 'AssetId', type: 'int', width: 50 },
			{ dataIndex: 'IrUserName', type: 'string', header: 'Username' },
			{ dataIndex: 'AssignedOn', type: 'date' },
			{ dataIndex: 'PurityStatus', type: 'string' },
			{ header: 'Outlet Code', dataIndex: 'Code', type: 'string', width: 160, hyperlinkAsDoubleClick: true },
			{ dataIndex: 'ImageCount', type: 'int', header: 'Image Count', align: 'right' },
			{ dataIndex: 'ImageName', type: 'string', header: 'Image Name' },
			{ header: 'Outlet', dataIndex: 'Location', type: 'string', width: 160 },
			{ header: 'Asset Serial Number', dataIndex: 'SerialNumber', type: 'string', width: 120, hyperlinkAsDoubleClick: true },
			{ header: 'Time', dataIndex: 'DoorClose', type: 'date', width: 140, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Purity Issue', dataIndex: 'PurityIssueStatus', type: 'string', width: 60 },
			{ header: 'Planogram Facings', dataIndex: 'PlanogramFacings', type: 'int', width: 100, align: 'right' },
			{ header: 'Total Stock', dataIndex: 'TotalStock', type: 'int', width: 50, align: 'right' },
			{ header: 'Foreign Product', dataIndex: 'ForeignProduct', type: 'int', width: 60, align: 'right' },
			{ header: 'Our Stock', dataIndex: 'OurStock', type: 'int', width: 50, align: 'right' },
			{ header: 'Compliance Facings', dataIndex: 'CompliantFacings', type: 'int', width: 80, align: 'right' },
			{ header: '# of Empty Facings', dataIndex: 'EmptyFacing', type: 'int', width: 80, align: 'right' },
			{ header: 'Purity %', dataIndex: 'PurityPercentage', type: 'int', width: 50, align: 'right' },
			{ header: 'Stock %', dataIndex: 'StockPercentage', type: 'int', width: 50, align: 'right' },
			{ header: 'OOS %', dataIndex: 'PercentageOfOOSSku', type: 'int', width: 50, align: 'right', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Planogram % Compliance', dataIndex: 'PlanogramCompliance', type: 'int', width: 80, align: 'right' },
			{ header: '% of Empty Facings', dataIndex: 'PercentageOfEmptyFacing', type: 'float', width: 80, align: 'right' },
			{ header: 'Current # of SKU', dataIndex: 'SKUCount', type: 'int', align: 'right', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# of our SKU', dataIndex: 'SKUCountOur', type: 'int', align: 'right', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# of foreign SKU', dataIndex: 'SKUCountForeign', type: 'int', align: 'right', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '% of Our Products', dataIndex: 'PercentageOfOurProduct', type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2), sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '% of foreign products', dataIndex: 'PercentageOfForeignProduct', type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2), sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# of SSD', dataIndex: 'SSDCount', type: 'int', align: 'right', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# of NCB', dataIndex: 'NCBCount', type: 'int', align: 'right', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '% of SSD', dataIndex: 'PercentageOfSSD', type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2), sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '% of NCB', dataIndex: 'PercentageOfNCB', type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2), sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Light On?', dataIndex: 'IsLightOn', type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Any Non beverage?', dataIndex: 'IsNonBeverageItem', type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Cooler Prime Position?', dataIndex: 'IsPrimePosition', type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ dataIndex: 'Shelves', type: 'int' },
			{ dataIndex: 'City', type: 'string', header: 'City' },
			{ dataIndex: 'State', type: 'string', header: 'State' },
			{ dataIndex: 'Country', type: 'string', header: 'Country' },
			{ dataIndex: 'Temperature', header: 'Temperature', width: 90, renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right', sortable: false, menuDisabled: true },
			{ dataIndex: 'LightIntensity', header: 'Light', width: 50, type: 'int', align: 'right', sortable: false, menuDisabled: true },
			{ dataIndex: 'LightStatus', type: 'string', header: 'Light Status', width: 100 },
			{ dataIndex: 'DoorCount', type: 'int', header: 'Door Count', width: 80, align: 'right', sortable: false, menuDisabled: true },
			{ header: 'Month', dataIndex: 'AssetPurityMonth', align: 'right', type: 'int' },
			{ header: 'Day ', dataIndex: 'AssetPurityDay', align: 'right', type: 'int' },
			{ header: 'Day of Week', dataIndex: 'AssetPurityWeekDay', type: 'string' },
			{ header: 'Week of Year', dataIndex: 'AssetPurityWeek', align: 'right', type: 'int' }
		];
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var graphButton = new Ext.Button({ text: 'Show Latest Only', iconCls: 'btn-icon-planogram', handler: this.onShowLatestClick, scope: this });
		this.competitionCheck = new Ext.form.Checkbox({ text: 'Competition', name: 'Competition' });
		this.competitionCheck.on('check', this.onCompetitionCheck, this)
		Ext.applyIf(gridConfig.custom, { tbar: [graphButton, 'Competition', this.competitionCheck] });
	},

	onCompetitionCheck: function (me, checked) {
		var store = this.grid.getStore();
		store.load();
	},

	onShowLatestClick: function () {
		var grid = this.grid;
		var store = grid.getStore();
		store.baseParams.isLatest = true;
		store.load();
	},

	beforeRemoveFilter: function () {
		var store = this.grid.getStore();
		delete store.baseParams.isLatest;
	},


	//onSwitchGrid : used for Switching grid/Button text inside the assetPurityProductPanel
	onSwitchGrid: function (btn) {
		var activeItemIndex = btn.activeIndex;
		var nextActiveItemIndex = activeItemIndex != 0 ? 0 : activeItemIndex + 1;
		this.assetPurityProductPanel.getLayout().setActiveItem(nextActiveItemIndex);
		btn.activeIndex = nextActiveItemIndex;
		btn.setText(nextActiveItemIndex == 0 ? 'Show Grid View' : 'Show List View');
	},

	//onExportClick : used for Switching grid/Button text inside the assetPurityProductPanel
	onExportClick: function (button) {
		var format = button.tag || 'XLSX';
		var grid = this.assetPurityProductRowWiseGrid;
		var title = grid.title
		EH.ExportGrid(grid, { Title: title, exportFileName: title, exportFormat: format });
	},

	configureListTab: function (config) {
		var btnDownloadImage = new Ext.Toolbar.Button({ text: 'Download', handler: this.downloadCoolerImage, scope: this, iconCls: 'Save' });

		var assetImagePanel = new Ext.Panel({
			title: 'Image',
			region: 'west',
			layout: 'fit',
			autoScroll: true,
			cls: 'tbarCls',
			tbar: [btnDownloadImage],
			items: [
				new Ext.Panel({
					region: 'west',
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
				})
			]
		});
		this.assetImagePanel = assetImagePanel;

		//Grid detail
		var grid = this.grid;

		var westItems = [];
		westItems.push(this.assetImagePanel);
		var westPanel = new Ext.Panel({ region: 'west', width: 400, split: true, hidden: false, collapsible: false, items: westItems, layout: 'fit' });
		this.grid.region = 'center';
		grid.getSelectionModel().on({
			'selectionchange': this.onGridCellclick,
			scope: this
		});

		grid.on({
			'rowdblclick': this.onGridRowDblclick,
			scope: this
		});

		var assetPurityProduct = Cooler.AssetPurityProduct.createGrid({ header: false, disabled: true });


		//assetPurityProductRowWiseStore : store with it's configs
		var assetPurityProductRowWiseStore = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy(new Ext.data.Connection({
				url: 'Controllers/AssetPurityProductRowWise.ashx',
				method: 'POST'
			})),
			reader: new Ext.data.JsonReader(),
			baseParams: { action: 'list', asArray: 0 }
		});

		// exportButton : Custom export button with it's configs
		var exportButton = new Ext.SplitButton({
			text: 'Export', menu: {
				items: [
					{
						text: 'Excel',
						iconCls: 'exportExcel',
						tag: 'XLSX'
					},
					{
						text: 'CSV',
						iconCls: 'exportCSV',
						tag: 'CSV'
					}

				],
				disabled: true,
				listeners: {
					itemclick: this.onExportClick,
					scope: this
				}
			},
			handler: this.onExportClick,
			scope: this,
			iconCls: 'exportExcel'
		});

		//assetPurityProductRowWiseGrid : Dynamic grid having store assetPurityProductRowWiseStore as store
		var assetPurityProductRowWiseGrid = new Ext.grid.GridPanel({
			title: 'Asset Purity Product',
			header: false,
			store: assetPurityProductRowWiseStore,
			plugins: [new EH.grid.plugins.AutoConfigureGrid()],
			autoScroll: true,
			tbar: [exportButton],
			loadMask: true,
			disabled: true
		});

		var recognitionReportPanel = new Ext.Panel({
			title: 'Recognition Report',
			region: 'center',
			autoScroll: true

		});
		this.recognitionReportPanel = recognitionReportPanel;

		var productOutOfStock = Cooler.ProductOutOfStock.createGrid({ disabled: true });
		var assetPurityProductDetail = Cooler.AssetPurityProductDetail.createGrid({ disabled: true, allowPaging: false });
		this.assetPurityProduct = assetPurityProduct;
		this.productOutOfStock = productOutOfStock;
		this.assetPurityProductDetail = assetPurityProductDetail;
		this.assetPurityProductRowWiseGrid = assetPurityProductRowWiseGrid;
		var assetPurityProductPanel = new Ext.Panel({
			title: 'Asset Purity Product',
			layout: 'card',
			activeItem: 0,
			id: 'defaultTab',
			disabled: true,
			tbar: [
				{
					text: 'Show Grid View',
					iconCls: 'btn-icon-planogram',
					handler: this.onSwitchGrid,
					scope: this,
					activeIndex: 0
				}
			],
			items: [assetPurityProduct, assetPurityProductRowWiseGrid]
		});
		this.assetPurityProductPanel = assetPurityProductPanel;
		var southPanel = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			id: 'coolerChildTab',
			items: [assetPurityProductPanel, productOutOfStock, assetPurityProductDetail, recognitionReportPanel],
			height: 250,
			split: true,
			listeners: {
				tabchange: this.onChildGridTabChange,
				scope: this
			}
		});
		var centerPanel = new Ext.Panel({
			region: 'center', layout: 'border',
			items: [
				this.grid, southPanel
			]
		});

		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [westPanel, centerPanel]
		});

		return config;
	},

	onGridRowDblclick: function (grid, rowIndex, columnIndex, e) {
		var record = grid.getStore().getAt(rowIndex);

		if (!record) {
			return;
		}
		var assetPurityId = record.data.AssetPurityId;
		if (this.assetPurityId && this.assetPurityId === assetPurityId) {
			return false;
		}
		//Load Facings Data for Cooler
		Ext.Ajax.request({
			url: 'controllers/AssetPurity.ashx',
			params: { action: 'GetFacings', otherAction: 'GetFacings', AssetPurityId: assetPurityId },
			success: function (result, request) {
				var data = Ext.decode(result.responseText);
				this.showCoolerImageWindow(data);
			},
			scope: this
		});
	},

	onGridCellclick: function (grid, rowIndex, e, options) {
		var record = grid.selections.items[0];
		Ext.getCmp('coolerChildTab').setActiveTab('defaultTab');
		var record = grid.getSelected();
		if (!record) {
			return;
		}
		var assetPurityId = record.data.AssetPurityId;
		if (this.assetPurityId && this.assetPurityId === assetPurityId) {
			return false;
		}
		this.assetPurityId = this.assetPurityId;
		this.assetPurityProductPanel.setDisabled(false);
		if (!this.grids) {
			this.grids = [this.assetPurityProduct, this.productOutOfStock, this.assetPurityProductRowWiseGrid, this.assetPurityProductDetail];
		}
		var gridlength = this.grids.length, grid;
		for (var i = 0; i < gridlength; i++) {
			grid = this.grids[i];
			if (grid) {
				var store = grid.getStore();
				store.baseParams.AssetPurityId = assetPurityId;
				/*first time when we click on any row on parent grid it load all data so we add the list of grid pagesize*/
				if (grid.getBottomToolbar()) {
					store.baseParams.limit = grid.getBottomToolbar().pageSize;
				}
				if (grid === this.assetPurityProduct || grid == this.assetPurityProductRowWiseGrid) {
					store.load();
				}
				grid.setDisabled(false);

				if (grid.getBottomToolbar()) {
					delete store.baseParams['limit'];
				}
			}
		}

		if (this.loadWindow) {
			//Load Facings Data for Cooler
			Ext.Ajax.request({
				url: 'controllers/AssetPurity.ashx',
				params: { action: 'GetFacings', otherAction: 'GetFacings', AssetPurityId: assetPurityId },
				success: function (result, request) {
					var data = Ext.decode(result.responseText);
					this.showCoolerImageWindow(data);
				},
				scope: this
			});
		}

		var count = record.get('ImageCount');
		var imageId = record.get('AssetPurityId');
		var origImageName = record.get('ImageName');
		var purityDatetime = record.get('DoorClose').format('Ymd');
		this.assetImagePanel.removeAll(true);
		if (!this.imageMask) {
			var imageMask = new Ext.LoadMask(this.assetImagePanel.getEl(), {
				msg: "Image is loading, Please wait..."
			});
			this.imageMask = imageMask;
		}
		this.imageMask.show();
		if (origImageName && origImageName.split(',').length > 1) {
			var sceneImageArray = origImageName.split(',');
			var totalImagesInScene = sceneImageArray.length;
			for (var i = 0; i < totalImagesInScene; i++) {
				var imageName = sceneImageArray[i];
				var image = this.getNewImage(imageName, imageId, purityDatetime, count);
				this.assetImagePanel.add(image);
			}
		} else if (origImageName && origImageName.indexOf('_1.jpg') > 0) {
			var image = this.getNewImage(origImageName, imageId, purityDatetime, count);
			this.assetImagePanel.add(image);
		} else {
			if (origImageName && count > 1) {
				for (var i = 1; i <= count; i++) {
					var imageName = origImageName.replace('.jpg', '_' + i + '.jpg');
					var image = this.getNewImage(imageName, imageId, purityDatetime, count);
					this.assetImagePanel.add(image);
				}
			}
			else {
				if (origImageName && count == 1) {
					var origImageName = origImageName.replace('.jpg', '_' + count + '.jpg');
				}
				var image = this.getNewImage(origImageName, imageId, purityDatetime, count);
				this.assetImagePanel.add(image);
			}
		}
		this.assetImagePanel.doLayout();


	},
	//Child Grid Tab Change-----
	onChildGridTabChange: function (tabPanel, panel) {
		if (panel.title == 'Product Out Of Stocks' || panel.title == 'Product details') {
			var store = panel.getStore();
			if (store.url) {
				panel.loadFirst();
			}
		}
		if (panel.title == 'Recognition Report') {
			this.showCoolerImage();

		}
	},

	objContains: function (arr, obj) {
		var i = arr.length;
		while (i--) {
			if (JSON.stringify(arr[i]) === JSON.stringify(obj)) {
				return true;
			}
		}
		return false;
	},

	updateMissingProductDetail: function (planogramDetail, facing) {
		this.productLegendArray = [];
		var widthOfProduct = []; // width of all product from all rows.
		var sumOfWidth = []; // sum of the width of all product from Evrey row.
		Array.prototype.max = function () {
			return Math.max.apply(null, this);
		};
		if (!planogramDetail.shelves.length > 0) {
			return facing ? facing : { shelves: {} };
		}
		var shelves = planogramDetail.shelves;
		var columnCount = 0, shelve, products;

		for (var i = 0, len = shelves.length; i < len; i++) {
			shelve = shelves[i];
			products = shelve.products;
			columnCount = products.length;

			for (var j = 0; j < columnCount; j++) {

				var product = products[j];
				var productId = product.id;
				var productWidth = products[j].width; // productWidth = width of the Per product.
				widthOfProduct.push(productWidth);

				var value = { Name: product.fullName, Color: product.color };
				if (!this.objContains(this.productLegendArray, value)) {
					this.productLegendArray.push(value);
				}
				var facingProduct = '';
				if (facing.shelves.length > 0) {
					facingProduct = facing.shelves[i].products[j];

					if (!facingProduct) {
						facingProduct = product;
						facingProduct.missing = true;
						facingProduct.hideMissing = true;
						facingProduct.color = product.color;
					}
					else if (facingProduct && facingProduct.id != productId) {
						facingProduct.missing = true;
						facingProduct.color = product.color;
					}
					else if (facingProduct && facingProduct.isEmpty && !product.isEmpty) {
						facingProduct.missing = true;
						facingProduct.color = product.color;
					}
					if (facing.shelves[i].products[j]) {
						facing.shelves[i].products[j] = facingProduct;
					}
				}
			}
			var widthSum = widthOfProduct.reduce(add, 0); // sum of the width of all product from every rows.
			function add(a, b) {
				return a + b;
			}
			sumOfWidth.push(widthSum);
		}
		var maxWidth = widthOfProduct.max(); // maximum width of the product from all rows.
		this.maxWidth = maxWidth;
		var maxOfsumWidth = sumOfWidth.max(); // maximum of the sum width from all rows.
		this.maxOfsumWidth = maxOfsumWidth;
		this.shelves = len;
		return facing;
	},

	showCoolerImageWindow: function (record) {
		var selectedRecord = this.grid.getSelectionModel().getSelected();

		if (!selectedRecord) {
			return;
		}
		if (!this.planogramTpl) {
			var planogramTpl = new Ext.XTemplate(
				'<div class="rectangle-red" {[this.setColumn(values.maxColumnCount, values.isPlanogram)]}>',
				'<div class="productDetailText">{Title}</div>',
				'</div>',
				'<tpl for="shelves">',
				'<div class="rectangle-grey">',
				'<div class="coolerProductImage">',
				'<tpl for="values.products">',
				'{[this.productDiv(values)]}',
				'</tpl>',
				'</div>',
				'</div>',
				'</tpl>',
				'<div class="rectangle-black">',
				'<div class="rectangle-black-grey"></div>',
				'</div>',
				{
					setColumn: function (columnCount, isPlanogram) {
						if (columnCount) {
							this.columnCount = columnCount;

							this.isPlanogram = isPlanogram;
						}

					},
					productDiv: function (values) {
						if (!values) {
							return;
						}
						if (!values.id) {
							values.thumbnail = './images/blank.png';
						}
						var width = values.width;
						var style;
						if (width === 0) {
							var columnCount = this.columnCount;
							width = columnCount ? Number((100 / (this.columnCount * 5)).toFixed(2)) + 'vw;' : 2.2 + 'vw;';
							style = 'style="width:' + width + '"';
						}
						else {
							avgWidthOfProduct = Number((maxWidth / this.columnCount)).toFixed(2);
							width = Number((avgWidthOfProduct / (75 * shelves)).toFixed(2));
							width = width < 2 ? 2.2 : width > 2 ? 1.99 : width;
							style = 'style="width:' + width + 'vw;"';
						}
						var div = '';

						if (values.missing && this.isPlanogram == false) {

							div += '<span class="imagePlanogram"><img ' + style + ' src =' + values.thumbnail + ' onerror="this.src = \'./resources/images/imageNotFound.png\'"/><span class="rectanglePosition" style = "background-color:' + values.color + ';"></span></span>';
						}
						else {

							div += '<img ' + style + ' src =' + values.thumbnail + ' onerror="this.src = \'./resources/images/imageNotFound.png\'" />';
						}

						return div;
					}
				}
			);
			this.planogramTpl = planogramTpl;
		}
		if (!this.imageTpl) {
			var imageTpl = new Ext.XTemplate(
				'<div>',
				'<table class = "centerAlign">',
				'<tr>',
				'<td class = "infoChangeButtonDiv" data-button = "Previous" rowspan="2"><img class = "nextPrevButton" src = "./images/icons/prev.png"></td>',
				'<td class = "infoPercentageDiv">',
				'<div class = "centerAlign"><div><img src = "./images/icons/planogram.png"></div><div class ="blueText">Planogram</div><div>{PlanogramCompliance}%</div></div>',
				'</td>',
				'<td class = "infoPercentageDiv">',
				'<div class = "centerAlign"><div><img src = "./images/icons/purity.png"></div><div class ="blueText">Purity</div><div>{PurityPercent}%</div></div>',
				'</td>',
				'<td class = "infoPercentageDiv">',
				'<div class = "centerAlign"><div><img src = "./images/icons/stock.png"></div><div class ="blueText">Stock</div><div>{StockPercent}%</div></div>',
				'</td>',
				'<td class="infoChangeButtonDiv" data-button = "Next" rowspan="2"><img class = "nextPrevButton" src = "./images/icons/next.png"></td>',
				'</tr>',
				'</table>',
				'<div style = "margin-top: 1em;">',
				'<tpl for="Planogram">',
				'<div class="planogram-legend-div" title= "{values.Name}"><div style = "background-color:{values.Color}"; class = "planogram-legend-rect"></div><div class= "planogram-legend-text">{values.Name}</div></div>',
				'</tpl>',
				'</div>',
				'<tpl for="Images">',
				'<div class="purityImageDiv centerAlign"><img class= "purityProcessedImage" src = {values.url}>Last updated on {[this.formatDateAsString(values.capturedOn)]}</div>',  // need to confirm either we need to shoew capturedOn
				'</tpl>',
				'</div>',
				{
					formatDateAsString: function (input) {
						if (input) {
							return moment(input).format(Cooler.Enums.DateFormat.PurityProcessedDate);
						}
						return ''
					}
				}
			);
			this.imageTpl = imageTpl;
		}
		var facings = record.facings,
			planogramDetail = record.planogram ? record.planogram : { shelves: {} },
			facingDetail = this.updateMissingProductDetail(planogramDetail, facings),
			images = record.images ? record.images : {},
			maxColumnCount = planogramDetail.columns > facingDetail.columns ? planogramDetail.columns : facingDetail.columns ? facingDetail.columns : 0,
			//maxWidth = planogramDetail.width > facingDetail.width ? planogramDetail.width : facingDetail.width ? facingDetail.width : 0,
			maxWidth = this.maxOfsumWidth;
		shelves = this.shelves;
		planogramCompliance = selectedRecord.get('PlanogramCompliance'),
			purityPercent = selectedRecord.get('PurityPercentage'),
			stockPercent = selectedRecord.get('StockPercentage'),
			assetPurityid = selectedRecord.get('AssetPurityId'),
			percentWithImage = { PlanogramCompliance: planogramCompliance, PurityPercent: purityPercent, StockPercent: stockPercent, Images: images, Planogram: this.productLegendArray };
		facingDetail.Title = "REALOGRAM";
		facingDetail.isPlanogram = false;
		facingDetail.maxColumnCount = maxColumnCount;
		planogramDetail.Title = "PLANOGRAM";
		planogramDetail.isPlanogram = true;
		planogramDetail.maxColumnCount = maxColumnCount;
		var purityInfo = this.imageTpl.apply(percentWithImage);
		var facing = this.planogramTpl.apply(facingDetail);
		var planogram = this.planogramTpl.apply(planogramDetail);
		if (!this.coolerWin) {

			var coolerWin = new Ext.Window({
				width: '85%',
				height: 700,
				modal: false,
				layout: 'border',
				autoScroll: true,
				closeAction: 'hide',
				resizable: true,
				maximizable: true,
				items: [
					{
						xtype: 'panel',
						frame: false,
						itemId: 'coolerPlanogramDisplay',
						id: 'planogram',
						region: 'west',
						width: '34%',
						html: planogram,
						autoScroll: true
					},
					{
						xtype: 'panel',
						frame: false,
						id: 'realogram',
						itemId: 'coolerOppurtunityDisplay',
						region: 'center',
						//width: '32%',
						html: facing,
						autoScroll: true
					},
					{
						xtype: 'panel',
						frame: false,
						itemId: 'coolerImage',
						region: 'east',
						width: '34%',
						html: purityInfo,
						autoScroll: true
					}
				]
			});

			this.coolerWin = coolerWin;
			this.coolerWin.on('show', this.onCoolerImageWindowShow, this);
		}
		this.coolerWin.setTitle('Asset purity: ' + assetPurityid);

		var oppurtunityPanelBody = this.coolerWin.getComponent('coolerOppurtunityDisplay').body;

		var planogramPanelBody = this.coolerWin.getComponent('coolerPlanogramDisplay').body;
		var imageTplBody = this.coolerWin.getComponent('coolerImage').body;
		if (oppurtunityPanelBody) {
			oppurtunityPanelBody.update(facing);
		}
		if (planogramPanelBody) {
			planogramPanelBody.update(planogram);
		}
		if (imageTplBody) {
			imageTplBody.update(purityInfo);
		}
		if (this.coolerWin.isVisible()) {
			this.coolerWin.hide();
		}
		this.coolerWin.show();
	},

	onCoolerImageWindowShow: function (coolerWin) {
		var infoChangeButtonDiv = document.getElementsByClassName("infoChangeButtonDiv");
		for (var i = 0, len = infoChangeButtonDiv.length; i < len; i++) {
			infoChangeButtonDiv[i].addEventListener("click", function (ele) {

				//Grid detail
				var grid = this.grid;
				var store = grid.getStore();
				var selectionModel = grid.getSelectionModel();
				var selectedRecord = selectionModel.getSelections()[0];
				var rowIndex = this.grid.store.indexOf(selectedRecord);

				// bottom tool bar values
				var bottomToolbar = grid.getBottomToolbar();
				var pageSize = bottomToolbar.pageSize;
				var lastRecordCount = bottomToolbar.cursor;
				var pageData = bottomToolbar.getPageData();
				var activePage = pageData.activePage;
				var totalPages = pageData.pages;

				// params for relaod next/Previous grid page if required
				var params = {};
				this.selectLast = this.selectFirst = false;
				var target = ele.target || ele.srcElement;
				var button = target.dataset.button || target.parentNode.dataset.button;
				switch (button) {
					case 'Previous':
						if (rowIndex != 0) {
							this.loadWindow = true;
							selectionModel.selectRow(rowIndex - 1);
							this.loadWindow = false;
						}
						else if (lastRecordCount != 0) {
							// Here we are loading the main grid store again
							params.start = lastRecordCount - pageSize;
							params.limit = pageSize;
							this.selectLast = true;
						}
						break;
					case 'Next':
						if (rowIndex + 1 != pageSize) {
							this.loadWindow = true;
							selectionModel.selectRow(rowIndex + 1);
							this.loadWindow = false;
						}
						else if (activePage != totalPages) {
							params.start = lastRecordCount + pageSize;
							params.limit = pageSize;
							this.selectFirst = true;
						}
						break;
				}
				if (this.selectFirst || this.selectLast) {
					store.load({ params: params });
				}
			}.bind(this), false);
		}
	},

	onGridStoreLoad: function (store, records, options) {
		var grid = this.grid;
		var selectionModel = grid.getSelectionModel();
		if (this.selectFirst) {
			this.loadWindow = true;
			selectionModel.selectRow(0);
			this.loadWindow = false;
			this.selectFirst = false;
		}
		else if (this.selectLast) {
			var lastRow = store.getCount() - 1;
			this.loadWindow = true;
			selectionModel.selectRow(lastRow);
			this.loadWindow = false;
			this.grid.getView().focusRow(lastRow);
			this.selectLast = false;
		}
	},
	onBeforeGridStoreLoad: function (store) {
		var grid = this.grid;
		var bottomToolbar = grid.getBottomToolbar();
		//Need to used this because Start/limit not passed when we press "Show Latest Only" button
		if (bottomToolbar) {
			var pageSize = bottomToolbar.pageSize;
			store.baseParams.limit = pageSize;
		}
		store.baseParams.IsCompetition = !this.competitionCheck.checked;
		store.baseParams.forVision = true;
	},

	showCoolerImage: function () {
		var record = this.grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			return;
		}

		var purityStatus = record.get('PurityStatus').split(','),
			shelves = record.get('Shelves'),
			columns = record.get('Columns');
		var productStore = Cooler.comboStores.Product;
		var rows = [], pos = 0;
		var rowData = [''];
		for (var index = 1; index <= columns; index++) {
			rowData.push(index);
		}
		rows.push("<td>" + rowData.join("</td><td>") + "</td>");
		for (var row = 0; row < shelves; row++) {
			rowData = [row + 1];
			for (var column = 0; column < columns; column++) {
				var value = purityStatus.length > pos ? (Number(purityStatus[pos]) || 1) : 1;
				var productInfo = productStore.getById(value);
				var isForeign = productInfo ? (productInfo.get('CustomValue') === 1) : false;
				var productName = productInfo ? productInfo.get('DisplayValue') : '';
				rowData.push((isForeign ? '<div class="foreignProduct">' : '') + productName + (isForeign ? '</div>' : ''));
				pos++;
			}
			rows.push("<td>" + rowData.join("</td><td>") + "</td>");
		}

		var childGridTabPanel = this.recognitionReportPanel.ownerCt;
		//setting recognition Panel Active
		childGridTabPanel.setActiveTab(this.recognitionReportPanel);
		var recognitionReportPanelElement = this.recognitionReportPanel.getEl();
		if (recognitionReportPanelElement) {
			recognitionReportPanelElement.update('<table class="borderTable"><tr>' + rows.join('</tr><tr>') + '</tr></table>');
		}
	},

	getNewImage: function (name, id, purityDatetime, count) {
		var img = new Ext.ux.Image({
			style: {
				'display': 'block',
				'height': '100%',
				'width': '100%'
			},
			listeners: {
				render: function (image) {
					image.el.on('load', function (evt) {
						Cooler.CoolerProcessedImage.imageMask.hide();
					});
				},
				scope: this
			},
			src: 'Controllers/CoolerImagePreview.ashx?AssetImageName=' + name + '&ImageId=' + id + '&v=' + new Date() + '&PurityDateTime=' + purityDatetime
		});
		return img;
	},

	downloadCoolerImage: function (btn) {
		var record = this.grid.getSelectionModel().getSelected();
		var imageName = record.data.ImageName.split('.');
		var record = this.grid.getSelectionModel().getSelected();
		var imageUrl = EH.BuildUrl('DownloadCoolerImage') + "?fileName=" + imageName[0] + "&imageCount=" + record.data.ImageCount;

		ExtHelper.HiddenForm.submit({
			action: imageUrl
		});
	}
});