Cooler.Survey = new Cooler.Form({
	controller: 'Survey',
	keyColumn: 'SurveyId',
	listTitle: 'Survey',
	disableAdd: true,
	securityModule: 'Survey',
	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'SurveyId' } }
	},

	hybridConfig: function () {
		return [
			{ header: 'Survey Id', dataIndex: 'SurveyId', type: 'int' },
			{ header: 'Survey Type', dataIndex: 'SurveyType', type: 'string', width: 150 },
			{ header: 'Survey Start Date', dataIndex: 'StartDate', type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Survey Date', dataIndex: 'SurveyDateTime', type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Duration(Sec)', dataIndex: 'Duration', type: 'int', width: 100, align: 'right' },
			{ header: 'Survey Points', dataIndex: 'SurveyPoints', type: 'float', width: 150, align: 'right' },
			{ header: 'Total Questions', dataIndex: 'SurveyQuestions', type: 'int', width: 150, align: 'right' },
			{ header: 'Red Score', dataIndex: 'RedScore', type: 'float', width: 150, align: 'right' },
			{ header: 'Max Red Score', dataIndex: 'MaxRedScore', type: 'int', width: 150, align: 'right' },
			{ header: 'Issue?', dataIndex: 'Issues', type: 'string', width: 80 },
			{ header: 'Issue Count', dataIndex: 'IssueCount', type: 'int', width: 80, align: 'right' },
			{ header: 'Latitude', dataIndex: 'Latitude', type: 'float', width: 120, align: 'right' },
			{ header: 'Longitude', dataIndex: 'Longitude', type: 'float', width: 120, align: 'right' },
			{ header: 'User', dataIndex: 'PrimaryEmail', type: 'string', width: 200 },
			{ header: 'User Satisfaction', dataIndex: 'OverAllFeedback', type: 'string', width: 120 },
			{ header: 'Outlet Code', dataIndex: 'OutletCode', type: 'string', width: 120, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', dataIndex: 'OutletName', type: 'string', width: 120 },
			{ header: 'Street', dataIndex: 'Street', type: 'string', width: 180 },
			{ header: 'City', dataIndex: 'City', type: 'string', width: 120 },
			{ header: 'Country', dataIndex: 'Country', type: 'string', width: 120 },
			{ header: 'Total Points', dataIndex: 'TotalPoints', type: 'float', width: 120 },
			{ header: 'Is Latest Surveyed?', dataIndex: 'IsLatestSurveyed', type: 'bool', width: 120, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is QR Code Search?', dataIndex: 'IsQRCodeSearch', type: 'bool', width: 120, renderer: ExtHelper.renderer.Boolean },
			{ header: 'QR Code Capture Time', dataIndex: 'QRCodeCaptureTime', type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime }
		];
	},

	checkDataView: function (store, records, options) {
		var previousButton = this.btnPreviousButton;
		var nextButton = this.btnNextButton;
		var imageDataView = this.imageDataView;
		var purityImageDataView = this.purityImageDataView;
		var currentId;
		if (purityImageDataView) {
			this.onGridLoad(store, records, { PreviousButton: this.btnPreviousButtonWindow, NextButton: this.btnNextButtonWindow, DataView: purityImageDataView, ImageCount: Cooler.Enums.LoadPurityImage.WindowCount });
			currentId = purityImageDataView.getStore().getAt(0).id;
		}
		if (imageDataView && !(imageDataView.store.getById(currentId))) {
			this.onGridLoad(store, records, { PreviousButton: previousButton, NextButton: nextButton, DataView: imageDataView, ImageCount: Cooler.Enums.LoadPurityImage.Count });
		}
	},

	purityDataViewStoreLoad: function (store, params) {
		store.load({
			params: params, callback: function (records, operation, success) {
				this.checkDataView(store, operation, success);
			}, scope: this
		});
	},
	//Handler for Next/Previous button 
	carouselImageLoad: function (item) {
		var imageCount = item.imageCount;
		var store = this.coolerImages.getStore();
		var dataCount = store.data.getCount();
		var operation;
		var success;
		if (dataCount > 0) {
			if (item.text === 'Next') {
				this.startIndex += imageCount;
				this.startIndexImages = this.startIndex;
			}
			var bottomToolbar = this.coolerImages.getBottomToolbar();
			var pageSize = bottomToolbar.pageSize;
			var lastRecordCount = bottomToolbar.cursor;
			if (item.text === 'Previous') {
				if (this.startIndex !== 0) {
					this.startIndex -= imageCount;
					this.startIndexImages = this.startIndex - Cooler.Enums.LoadPurityImage.Count + 1;
					this.startIndexImages = this.startIndexImages < 0 ? 0 : this.startIndexImages;
					this.startIndex = this.startIndex < 0 ? 0 : this.startIndex;
				}
				else {
					// Here we are loading the main grid store again
					var params = {};
					params.start = lastRecordCount - pageSize;
					params.limit = pageSize;
					this.purityLoad = true;
					this.startIndex = pageSize;
					this.startIndexImages = this.startIndex - Cooler.Enums.LoadPurityImage.Count;
					this.purityDataViewStoreLoad(store, params);
					return;
				}
			}
			if (this.startIndex == bottomToolbar.pageSize) {
				// Here we are loading the main grid store again
				var params = {};
				params.start = lastRecordCount + pageSize;
				params.limit = pageSize;
				this.purityLoad = true;
				this.startIndex = 0;
				this.startIndexImages = 0;
				this.purityDataViewStoreLoad(store, params);
			}
			if (!this.purityLoad) {
				this.checkDataView(store, operation, success);
			}
		}
	},

	// This function is used for loading the Image based on Next/Previous click
	onGridLoad: function (store, records, options) {

		var previousButton = options.PreviousButton,
			nextButton = options.NextButton,
			imageDataView = options.DataView,
			imageCount = options.ImageCount;

		previousButton = previousButton ? previousButton : this.btnPreviousButton;
		nextButton = nextButton ? nextButton : this.btnNextButton;
		imageDataView = imageDataView ? imageDataView : this.imageDataView;
		var dataViewStore = imageDataView.getStore();
		imageCount = imageCount ? imageCount : Cooler.Enums.LoadPurityImage.Count;
		this.purityLoad = false;
		var storeCount = store.getCount();
		var bottomToolbar = this.coolerImages.getBottomToolbar();
		var pageData = bottomToolbar.getPageData();
		var activePage = pageData.activePage;
		var totalPages = pageData.pages;
		var pageSize = bottomToolbar.pageSize;
		if (Ext.isEmpty(this.startIndex)) {
			this.startIndex = 0;
			this.startIndexImages = 0;
		}
		if (storeCount < this.startIndex) {
			this.startIndex = 0;
			this.startIndexImages = 0;
		}
		previousButton.setDisabled(activePage === 1 && this.startIndex === 0);
		nextButton.setDisabled(activePage === totalPages && storeCount <= pageSize && storeCount <= this.startIndex + imageCount);
		if (dataViewStore.getCount() > 0) {
			dataViewStore.removeAll();
		}
		var data = store.getRange(this.startIndex, this.startIndex + imageCount - 1);
		if (Cooler.Enums.LoadPurityImage.Count == imageCount) {
			data = store.getRange(this.startIndexImages, this.startIndexImages + imageCount - 1);
			previousButton.setDisabled(activePage === 1 && this.startIndexImages === 0);
			nextButton.setDisabled(activePage === totalPages && storeCount <= pageSize && storeCount <= this.startIndexImages + imageCount);
		}
		var sortInfo = store.getSortState();
		// Sort data based on the AssetPurityId order
		if (sortInfo && sortInfo.field == 'AssetPurityId') {
			if (sortInfo.direction == "ASC") {
				data.sort(function (obj1, obj2) { return obj1.id - obj2.id });
			}
			else {
				data.sort(function (obj1, obj2) { return obj2.id - obj1.id });
			}
		}
		for (var i = 0, len = data.length; i < len; i++) {
			var record = data[i];
			dataViewStore.insert(i, new Ext.data.Record({
				'SurveyId': record.get('SurveyId'),
				'PurityDateTime': record.get('PurityDateTime'),
				'ImageName': record.get('ImageName'),
				'ImageCount': record.get('ImageCount')
			}, record.get('AssetPurityId'))
			);

			if (this.purityImageWin && (imageCount === Cooler.Enums.LoadPurityImage.WindowCount)) {
				this.purityImageWin.setTitle(record.get('SurveyId'));
			}
		}
		if (imageDataView.isVisible()) {
			imageDataView.refresh();
		}

		if (this.imageDataView.getStore().getCount() > 0) {
			var nodes = this.imageDataView.getNodes();
			var nodeLength = nodes.length;
			for (var i = 0; i < nodeLength; i++) {
				var classList = nodes[i].classList;
				if (classList.contains('selectedCarouselDiv')) {
					classList.remove('selectedCarouselDiv');
					break;
				}
			}
			var selectedNode = (this.startIndex % 5) * 2;
			if (selectedNode < nodeLength) {
				this.imageDataView.getNodes()[selectedNode].classList.add('selectedCarouselDiv');
			}
		}
	},

	// When we click on Image inside Image carousel add border
	carouselImageClick: function (dataView, index, node) {
		var nodes = dataView.getNodes();
		for (var i = 0; i < nodes.length; i++) {
			var classList = nodes[i].classList;
			if (classList.contains('selectedCarouselDiv')) {
				classList.remove('selectedCarouselDiv');
				break;
			}
		}
		dataView.getNodes()[index].classList.add('selectedCarouselDiv');
	},

	onCoolerImageClick: function (grid, rowIndex) {
		var store = grid.getStore(),
			record = store.getAt(rowIndex);
		var storedFileName = record.get('ImageName');
		record.set('StoredFilename', storedFileName);
		Cooler.showCoolerImage(record);
	},

	//onExportClick : used for Switching grid/Button text inside the assetPurityProductPanel
	onExportClick: function (button) {
		var format = button.tag || 'XLSX';
		var grid = this.assetPurityProductRowWiseGrid;
		var title = grid.title
		EH.ExportGrid(grid, { Title: title, exportFileName: title, exportFormat: format });
	},

	assetPurityProductData: function (config) {
		this.on('beforeLoad', function (param) {
			var data = param;
		});
	},

	configureListTab: function (config) {
		var grid = this.grid;
		Ext.apply(this.grid, {
			region: 'center'
		});

		var surveyDetailGrid = Cooler.SurveyDetail.createGrid({ disabled: true });
		this.surveyDetailGrid = surveyDetailGrid;

		var issueGrid = Cooler.Issue.createGrid({ disabled: true });
		this.issueGrid = issueGrid;

		var coolerImages = Cooler.CoolerImageForAsset.createGrid({ title: 'Purities', allowPaging: true, editable: false, tbar: [], showDefaultButtons: true, disabled: true });
		this.coolerImages = coolerImages;
		coolerImages.on({
			rowclick: this.onCoolerImageClick,
			scope: this
		});

		var coolerImagesStore = this.coolerImages.getStore();
		coolerImagesStore.on('load', function (store, record, callback) {
			if (!this.purityLoad) {
				this.onGridLoad(store, record, callback);
			}
		}, this);

		//carousel store model
		var carouselStore = new Ext.data.Store({ fields: [{ name: 'AssetPurityId', type: 'int' }, { name: 'PurityDateTime', type: 'date' }, { name: 'ImageName', type: 'string' }, { name: 'ImageCount', type: 'int' }] });
		this.carouselStore = carouselStore;

		var assetPurityProduct = Cooler.AssetPurityProduct.createGrid({ header: false, disabled: false });
		this.assetPurityProduct = assetPurityProduct;

		//assetPurityProductRowWiseStore : store with it's configs
		var assetPurityProductRowWiseStore = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy(new Ext.data.Connection({
				url: 'Controllers/SurveyPurityImage.ashx',
				method: 'POST'
			})),
			reader: new Ext.data.JsonReader(),
			baseParams: { action: 'getAssetPurityProduct', AssetPurityId: 0, asArray: 0 }
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
			title: 'Recognition Report',
			header: false,
			itemId: 'testingGrid',
			store: assetPurityProductRowWiseStore,
			plugins: [new EH.grid.plugins.AutoConfigureGrid()],
			autoScroll: true,
			//tbar: [exportButton],
			loadMask: true
		});
		this.assetPurityProductRowWiseGrid = assetPurityProductRowWiseGrid;

		var imageDataViewTpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div>{[this.renderImage(values)]}</div>',
			'</tpl>', {
				renderImage: function (values) {
					var imageName = values.ImageName;
					var imageCount = values.ImageCount;
					var surveyId = values.SurveyId;
					var assetPurityId = values.AssetPurityId;
					var purityDateTime = values.PurityDateTime;
					var strDate = purityDateTime;
					var year = strDate.substring(0, 4);
					var month = strDate.substring(4, 6);
					var day = strDate.substring(6, 8);
					var hour = strDate.substring(8, 10);
					var minute = strDate.substring(10, 12);
					var second = strDate.substring(12, 14);
					var date = new Date(year, month - 1, day, hour, minute, second);
					var carouselImage = '';
					if (imageCount > 1) {
						for (var i = 1; i <= imageCount; i++) {
							var carouselImageName = imageName.replace('.jpg', '_' + i + '.jpg');
							carouselImage += '<div class="carouselDiv" assetPurityId="' + assetPurityId + '" >' +
								'<img class="purityImage" src="./thumbnail.ashx?imagePath=processed/' + purityDateTime + '/' + carouselImageName + '&isStockimages=true&v=' + new Date().getTime() + '"></img>' + '<br>' +
								'<b>Asset Purity Id: </b>' + assetPurityId + '<br>' +
								'<b>Purity Date Time: </b>' + ExtHelper.renderer.DateTime(date) +
								'</div>';
						}
					}
					else {
						var imageName = imageName.replace('.jpg', '_1.jpg');
						carouselImage += '<div class="carouselDiv" assetPurityId="' + assetPurityId + '" ><div>' +
							'<img class="purityImage" src="./thumbnail.ashx?imagePath=processed/' + purityDateTime + '/' + imageName + '&isStockimages=true&v=' + new Date().getTime() + '"></img>' + '<div>' +
							'<b>Asset Purity Id: </b>' + assetPurityId + '<br>' +
							'<b>Purity Date Time: </b>' + ExtHelper.renderer.DateTime(date) +
							'</div></div>';
					}
					return '<div>' + carouselImage + '</div>';
				}
			}
		);
		this.imageDataViewTpl = imageDataViewTpl;

		var imageDataView = new Ext.DataView({
			tpl: this.imageDataViewTpl,
			store: carouselStore,
			itemSelector: 'div.carouselDiv',
			listeners: {
				'click': this.carouselImageClick,
				scope: this
			}
		});
		this.imageDataView = imageDataView;

		var btnPreviousButton = new Ext.Toolbar.Button({ text: 'Previous', itemId: 'btnPreviousButton', id: 'btnPreviousButton', iconCls: 'x-tbar-page-prev', handler: this.carouselImageLoad, scope: this, disabled: true, imageCount: Cooler.Enums.LoadPurityImage.Count });
		var btnNextButton = new Ext.Toolbar.Button({ text: 'Next', itemId: 'btnNextButton', id: 'btnNextButton', iconCls: 'x-tbar-page-next', handler: this.carouselImageLoad, scope: this, imageCount: Cooler.Enums.LoadPurityImage.Count });
		this.btnPreviousButton = btnPreviousButton;
		this.btnNextButton = btnNextButton;
		var imageCarouselPanel = new Ext.Panel({
			title: 'Images',
			region: 'south',
			layout: 'fit',
			autoScroll: true,
			tbar: [btnPreviousButton, '|', btnNextButton],
			//disabled: true,
			items: imageDataView
		});
		this.imageCarouselPanel = imageCarouselPanel;

		var assetPurityProductPanel = new Ext.Panel({
			title: 'Recognition Report',
			layout: 'card',
			activeItem: 0,
			id: 'defaultTab',
			disabled: false,
			items: [assetPurityProductRowWiseGrid]
		});
		this.assetPurityProductPanel = assetPurityProductPanel;

		var south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			items: [surveyDetailGrid, issueGrid, imageCarouselPanel, assetPurityProductPanel],
			height: 450,
			split: true
		});

		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [this.grid, south]
		});

		return config;
	},

	onGridCreated: function (grid) {
		grid.on("cellclick", this.onGridCellclick, this);
	},

	onGridCellclick: function (grid, rowIndex, e) {
		this.assetPurityProductData(grid);
		var row = grid.getStore().getAt(rowIndex);
		var surveyId = row.get('SurveyId');
		var assetPurityId = row.get('AssetPurityId');
		if (this.surveyId && this.surveyId === surveyId) {
			return false;
		}
		if (!this.grids) {
			var grids = [];
			grids.push(this.surveyDetailGrid);
			grids.push(this.issueGrid);
			//grids.push(this.imageCarouselPanel);
			grids.push(this.assetPurityProduct);
			grids.push(this.assetPurityProductRowWiseGrid);
			this.grids = grids;
		}
		var gridlength = this.grids.length, grid;
		for (var i = 0; i < gridlength; i++) {
			grid = this.grids[i];
			if (grid) {
				var store = grid.getStore();
				store.baseParams.SurveyId = surveyId;
				store.load();
				grid.setDisabled(false);
			}
		}
		this.imageDataView.getStore();
		Ext.Ajax.request({
			url: 'Controllers/SurveyPurityImage.ashx',
			params: { action: 'getSurveyImages', SurveyId: surveyId },
			success: function (result, request) {
				var response = Ext.decode(result.responseText);
				var data = response.records;
				this.addRecordIntoImagePurityStore(data);
			},
			failure: function (result, request) {
				Ext.Msg.alert('Alert', JSON.parse(result.responseText));
			},
			scope: this
		});
	},

	addRecordIntoImagePurityStore: function (data) {
		var dataViewStore = this.imageDataView.getStore();
		dataViewStore.clearData();
		var record = data;
		for (var i = 0; i < data.length; i++) {
			this.carouselStore.insert(0, new Ext.data.Record({
				'SurveyId': data[i]['SurveyId'],
				'SessionUid': data[i]['SessionUid'],
				'ImageCount': data[i]['ImageCount'],
				'ImageName': data[i]['ImageName'],
				'PurityDateTime': data[i]['PurityDateTime'],
				'AssetPurityId': data[i]['AssetPurityId']
			}));
		}
		if (this.imageDataView.isVisible()) {
			this.imageDataView.refresh();
		}
	},

	onExportButtonClick: function (button) {
		var format = button.tag || 'XLS';
		var reportCriteria = "{}";
		var url = 'Controllers/SurveyReport.ashx?v=' + new Date();
		var params = { format: format, report: 'SurveyDetailReport', reportCriteria: reportCriteria };

		ExtHelper.HiddenForm.submit({
			action: url,
			params: params,
			target: "_blank"
		});
		return;
	},

	onExportDetailClick: function (button) {
		var url = 'Controllers/SurveyDetail.ashx?v=' + new Date();
		var format = button.tag || 'XLSX';
		var filter = this.grid.store.lastOptions.params.filter;
		var params = { action: 'export', Title: this.listTitle, exportFileName: this.listTitle, exportFormat: format, filter: filter, isSummary: true };
		ExtHelper.HiddenForm.submit({
			action: url,
			params: params
		});
		return;
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var exportButtonDetail = new Ext.SplitButton({
			text: 'Export Summary',
			menu: {
				items: [
					{ text: 'Excel', iconCls: 'exportExcel', tag: 'XLSX' },
					{ text: 'CSV', iconCls: 'exportCSV', tag: 'CSV' }
				], listeners: { itemclick: this.onExportDetailClick, scope: this }
			}, handler: this.onExportDetailClick, scope: this, iconCls: 'exportExcel'
		});
		var exportButton = new Ext.SplitButton({
			text: 'Export All',
			menu: {
				items: [
					{ text: 'Excel', iconCls: 'exportExcel', tag: 'XLS' }
				], listeners: { itemclick: this.onExportButtonClick, scope: this }
			}, handler: this.onExportButtonClick, scope: this, iconCls: 'exportExcel', hidden: true
		});
		tbarItems.push(exportButton);
		tbarItems.push(exportButtonDetail);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	}
});