Cooler.RecognitionReport = new Cooler.Form({
	listTitle: 'Recognition Report',
	keyColumn: 'AssetPurityId',
	controller: 'AssetPurity',
	disableAdd: true,
	disableDelete: true,
	uniqueId: 'RecognitionReport',
	securityModule:'RecognitionReport',
	defaults: { sort: { dir: 'DESC', sort: 'DoorClose' } },
	gridConfig: {
		custom: {
			loadComboTypes: true
		}
	},
	comboTypes: [
			'TimeZone'
	],
	comboStores: {
		TimeZone: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	onGridCreated: function (grid) {
		grid.store.on('load', this.onGridStoreLoad, this);
		grid.store.on('beforeload', this.onBeforeGridStoreLoad, this);
		grid.on({ 'rowdblclick': this.onGridRowDblclick, scope: this });
		grid.getSelectionModel().on({ 'selectionchange': this.onGridCellclick, scope: this });
	},


	hybridConfig: function () {
		return [
			{ header: 'Id', dataIndex: 'AssetPurityId', type: 'int', width: 50 },
			{ dataIndex: 'AssetId', type: 'int' },
			{ dataIndex: 'AssignedOn', type: 'date' },
			{ dataIndex: 'CompliantFacings', type: 'int' },
			{ dataIndex: 'PurityPercentage', type: 'int' },
			{ dataIndex: 'StockPercentage', type: 'int' },
			{ dataIndex: 'TimeZoneId', type: 'int' },
            { header: 'Outlet Code', dataIndex: 'Code', type: 'string', width: 160, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet', dataIndex: 'Location', type: 'string', width: 160 },
			{ header: 'Asset Technical ID', dataIndex: 'TechnicalIdentificationNumber', type: 'string' },
			{ header: 'Asset Equipment Number', dataIndex: 'EquipmentNumber', type: 'string' },
            { header: 'Asset Serial Number', dataIndex: 'SerialNumber', type: 'string', width: 120, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Type', dataIndex: 'AssetType', type: 'string' },
			{ header: 'Image Date/Time', dataIndex: 'PurityDateTime', type: 'date', width: 140, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Recognition Date/Time', dataIndex: 'VerifiedOn', type: 'date', width: 140, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Image Received Date/Time', dataIndex: 'CreatedOn', type: 'date', width: 140, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: '# Total Facings', dataIndex: 'Total', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Bottler Facings', dataIndex: 'SKU', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '% Bottler Facings / SOCVI', dataIndex: 'SKUPerVsTotal', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Competitor Facings', dataIndex: 'ForeignVsTotal', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '% Competitor Facings', dataIndex: 'ForeignPerVsTotal', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Empty Facings', dataIndex: 'EmptyVsTotal', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '% Empty Facings', dataIndex: 'EmptyPerVsTotal', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Unknown Facings', dataIndex: 'UnknownCount', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '% Unknown Facings', dataIndex: 'UnknownPer', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Bottler SSD Facings', dataIndex: 'SSDSOCVICount', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '% Bottler SSD Facings / SOCVI', dataIndex: 'SSDSOCVIPer', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Bottler NCB Facings', dataIndex: 'NCBSOCVICount', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '% Bottler NCB Facings / SOCVI', dataIndex: 'NCBSOCVIPer', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Total SKU', dataIndex: 'TotalSKU', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Bottler SKU', dataIndex: 'BottlerSKU', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Bottler SSD SKU', dataIndex: 'SSDCount', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Bottler NCB SKU', dataIndex: 'NCBCount', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Competitor SKU', dataIndex: 'CompetitorSKU', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Competitor SSD SKU', dataIndex: 'CompetitorSSDSKU', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '# Competitor NCB SKU', dataIndex: 'CompetitorNCBSKU', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Bottler RED Purity', dataIndex: 'REDPurity', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: '% Planogram Compliance', dataIndex: 'PlanogramCompliance', type: 'int', width: 80, align: 'right' },
			{ header: '# OSA SKU', dataIndex: 'OOSSkuCount', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Postal Code', dataIndex: 'PostalCode', type: 'string' },
			{ dataIndex: 'City', type: 'string', header: 'City' },
			{ dataIndex: 'State', type: 'string', header: 'State' },
			{ dataIndex: 'Country', type: 'string', header: 'Country' },
			{ header: 'Month', dataIndex: 'AssetPurityMonth', align: 'right', type: 'int' },
			{ header: 'Day ', dataIndex: 'AssetPurityDay', align: 'right', type: 'int' },
			{ header: 'Day of Week', dataIndex: 'AssetPurityWeekDay', type: 'string' },
			{ header: 'Week of Year', dataIndex: 'AssetPurityWeek', align: 'right', type: 'int' },
			{ header: 'Trade Channel', type: 'string', dataIndex: 'TradeChannel', width: 110 },
            { header: 'Trade Channel Code', hidden: true, type: 'string', dataIndex: 'TradeChannelCode', width: 100, hidden: true },
            { header: 'Customer Tier', type: 'string', dataIndex: 'LocationClassification', width: 110 },
            { header: 'Customer Tier Code', hidden: true, type: 'string', dataIndex: 'LocationClassificationCode', width: 100, hidden: true },
			{ header: 'Sub Trade Channel', type: 'string', dataIndex: 'SubTradeChannel', width: 150 },
            { header: 'Sub Trade Channel Code', hidden: true, type: 'string', dataIndex: 'SubTradeChannelCode', width: 150, hidden: true },
			{ header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 },
            { header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
            { header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' },
		    { header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
            { header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
            { header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
			{ header: 'Sales Territory Code', hidden: true, type: 'string', dataIndex: 'SalesTerritoryCode' },
			{ header: 'Client', dataIndex: 'Client', type: 'string' },
			{ header: 'Time Zone', dataIndex: 'TimeZoneId', width: 250, type: 'int', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }), displayIndex: 'TimeZone' },
            { header: 'Smart Vision Serial Number', type: 'string', dataIndex: 'SmartDeviceSerialNumber', width: 150, hyperlinkAsDoubleClick: true }
		];
	},
	afterShowList: function (config) {
		this.grid.baseParams.StartDate = this.startDateField.getValue();
		this.grid.baseParams.EndDate = this.endDateField.getValue();
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });

		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				var isGridFilterApply = false;
				var sDateTime = this.startDateField.getValue();
				var eDateTime = this.endDateField.getValue();
				if (sDateTime != '' && eDateTime != '') {
					if (sDateTime > eDateTime) {
						Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
						return;
					}
					else {
						if (this.dateDifferanceInDays(sDateTime, eDateTime) > 92) {
							Ext.Msg.alert('Alert', 'You can\'t select more than three months duration.');
							return;
						}
					}
				}
				if (sDateTime == '' || eDateTime == '') {
					Ext.Msg.alert('Required', 'Please Select Start Date and End Date.');
					return;
				}

				this.grid.baseParams.StartDate = this.startDateField.getValue();
				this.grid.baseParams.EndDate = this.endDateField.getValue();
				this.grid.store.load();
				delete this.grid.getStore().baseParams['limit'];

			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
				this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));

				this.grid.baseParams.StartDate = this.startDateField.getValue();
				this.grid.baseParams.EndDate = this.endDateField.getValue();
				this.grid.loadFirst();
				this.RecognitionReportGrid.setDisabled(true);
				this.RecognitionReportGrid.store.removeAll()
			}, scope: this
		});

		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);
		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
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
	onGridCellclick: function (grid) {
		var record = grid.getSelected();
		if (!record) {
			return;
		}
		var assetPurityId = record.data.AssetPurityId;
		if (this.assetPurityId && this.assetPurityId === assetPurityId) {
			return false;
		}
		this.assetPurityId = this.assetPurityId;
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
	},

	updateMissingProductDetail: function (planogramDetail, facing) {
		this.productLegendArray = [];
		if (!planogramDetail.shelves.length > 0) {
			return facing ? facing : { shelves: {} };
		}
		var shelves = planogramDetail.shelves;
		var columnCount = 0, shelve, products;
		for (var i = 0, len = shelves.length; i < len; i++) {
			shelve = shelves[i];
			products = shelve.products;
			columnCount = products.length;
			for (var j = 0; j < columnCount ; j++) {
				var product = products[j];
				var productId = product.id;
				var value = { Name: product.fullName, Color: product.color };
				if (!this.objContains(this.productLegendArray, value)) {
					this.productLegendArray.push(value);
				}
				var facingProduct = facing.shelves[i].products[j];
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
				facing.shelves[i].products[j] = facingProduct;
			}
		}
		return facing;
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
					'<div class="rectangle-black" >',
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
								width = columnCount ? Number((100 / (columnCount * 5)).toFixed(2)) + 'vw;' : 2.2 + 'vw;';
								style = 'style="width:' + width + '"';
							}
							else {
								width = Number((width / 75).toFixed(2));
								width = width < .3 ? 0.5 : width;
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
					'<div class="planogram-legend-div"><div style = "background-color:{values.Color}"; class = "planogram-legend-rect"></div><div class= "planogram-legend-text">{values.Name}</div></div>',
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
			planogramCompliance = selectedRecord.get('PlanogramCompliance'),
			purityPercent = selectedRecord.get('PurityPercentage'),
			stockPercent = selectedRecord.get('StockPercentage'),
			assetPurityid = selectedRecord.id,
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
				closeAction: 'hide',
				resizable: true,
				autoScroll: true,
				items: [
					{
						xtype: 'panel',
						id: 'planogram',
						frame: false,
						itemId: 'coolerPlanogramDisplay',
						region: 'west',
						width: '34%',
						html: planogram
					},

					{
						xtype: 'panel',
						id: 'realogram',
						frame: false,
						itemId: 'coolerOppurtunityDisplay',
						region: 'center',
						html: facing,
						autoScroll: true

					},
					{
						xtype: 'panel',
						frame: false,
						itemId: 'coolerImage',
						region: 'east',
						width: '32%',
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
		var oppurtunityPanelBody = Ext.getCmp('planogram');
		var planogramPanelBody = Ext.getCmp('realogram');
		planogramPanelBody.body.on('scroll', function (e) {
			oppurtunityPanelBody.body.dom.scrollTop = planogramPanelBody.body.dom.scrollTop;
		})
	},


	onCoolerImageWindowShow: function (coolerWin) {
		var infoChangeButtonDiv = document.getElementsByClassName("infoChangeButtonDiv");
		for (var i = 0, len = infoChangeButtonDiv.length; i < len ; i++) {
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
		store.baseParams.forRecognitionReport = true;
		store.baseParams.processed = 1;
	}
});