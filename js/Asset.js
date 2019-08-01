Cooler.AssetForm = Ext.extend(Cooler.Form, {
	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			//groupField: 'Location',
			custom: {
				loadComboTypes: true,
				quickSearch: {
					addColumns: false,
					width: 150,
					indexes: [
						{ text: 'Serial Number', dataIndex: 'SerialNumber' }
					]
				}
			},
			listeners: {
				'cellclick': this.onListGridCellClick,
				scope: this
			}
		};
		Cooler.AssetForm.superclass.constructor.call(this, config);
	},
	afterShowList: function (config) {
		config.tab.on('activate', this.onTabActivate, this);
	},
	onTabActivate: function (tab) {
		if (this.grid) {
			this.grid.store.load();
		}
	},
	controller: 'Asset',
	captionColumn: 'SerialNumber',
	securityModule: 'Assets',
	comboTypes: [
		'AssetType',
		'State',
		'Country',
		'User',
		'CoolerVisitStatus',
		'AssetCategory',
		'SmartDeviceType',
		'OutletType',
		'Client'
	],
	selectedChartDate: new Date(),

	onListGridCellClick: function (grid, rowIndex) {
		Ext.getCmp('assetChildTab') && Ext.getCmp('assetChildTab').setActiveTab('defaultTab');
		var row = grid.getStore().getAt(rowIndex);
		var assetId = row.get('AssetId');
		var gatewayId = row.get('GatewaySmartDeviceId');
		var gatewayDeviceType = row.get('GatewayType');
		if (this.assetId && this.assetId === assetId) {
			return false;
		}
		this.assetId = assetId;
		if (this.assetVisitHistoryGrid && this.attachmentGrid && this.notesGrid) {
			this.assetVisitHistoryGrid.setDisabled(false);
			this.attachmentGrid.setDisabled(false);
			this.notesGrid.setDisabled(false);
		}
		//var smartDeviceId = r.get('SmartDeviceId');
		if (!this.grids) {
			var grids = [];
			grids.push(this.coolerImages);
			grids.push(this.linkedAssets);
			grids.push(this.assetVisitHistoryGrid);
			grids.push(this.smartDeviceMovementGrid);
			grids.push(this.smartDeviceDoorStatusGrid);
			grids.push(this.smartDeviceHealthGrid);
			grids.push(this.smartDevicePowerConsumptionGrid);
			grids.push(this.assetStockGrid);
			grids.push(this.alertGrid);
			grids.push(this.smartDevicePing);
			grids.push(this.smartDeviceStockSensorData);
			grids.push(this.smartDeviceCellLocation);
			grids.push(this.smartDevicePowerEvent);
			grids.push(this.SmartDeviceWifiLocation);
			if (DA.Security.HasPermission('RawLogs')) {
				grids.push(this.rawLogsGrid);
				grids.push(this.debugLogsGrid);
				//grids.push(this.dataSummaryGrid);
			}
			this.grids = grids;
		}


		var gridlength = this.grids.length, grid;
		for (var i = 0; i < gridlength; i++) {
			grid = this.grids[i];
			if (grid) {
				var store = grid.getStore();
				if (grid === this.rawLogsGrid) {
					store.baseParams.Gateway = row.get('GatewayMacAddress') || "00:00:00:00:00:00";
				} else {
					store.baseParams.assetId = assetId;
				}

				grid.setDisabled(assetId == 0);

				if (grid === this.SmartDeviceWifiLocation) {
					if (gatewayId != undefined && gatewayId != "" && gatewayDeviceType != undefined && gatewayDeviceType != "" && (gatewayDeviceType == "Sollatek FFM2BB" || gatewayDeviceType == "Sollatek FFM-2")) {
						this.SmartDeviceWifiLocation.setDisabled(false);
						store.baseParams.GatewayId = gatewayId;
					}
					else {
						this.SmartDeviceWifiLocation.setDisabled(true);
					}
				}
				/*first time when we click on any row on parent grid it load all data so we add the list of grid pagesize*/
				if (grid.getBottomToolbar()) {
					store.baseParams.limit = grid.getBottomToolbar().pageSize;
				}
				/*Apply Date Filter by Default*/
				var topToolBar = grid.getTopToolbar();
				if (grid === this.assetVisitHistoryGrid || grid.title == 'Alerts' && grid.gridFilter.getFilter('StatusId')) {
					if (grid.title == 'Alerts' && grid.gridFilter.getFilter('StatusId')) {
						var statusFilter = grid.gridFilter.getFilter('StatusId');
						statusFilter.active = true;
						statusFilter.setValue(1);
					}
					store.load();
				}
				this.removePazeSizeLimit(grid, store);
			}
		}

		var tpl = Cooler.CoolerInfo.prototype.assetTpl;
		var detailsPanel = this.coolerDetailsPanel;
		if (detailsPanel) {
			/*
				Using below code for removing space from object keysso data can be applied on template.
			*/
			var fixedData = {};
			for (prop in row.data) {
				fixedData[prop.replace(/ /g, '')] = row.data[prop];
			}
			detailsPanel.body.update(tpl.apply(fixedData));
			detailsPanel.setTitle('Cooler: #' + row.get('SerialNumber') + ' at ' + row.get('Location'));
		}
		if (this.notesGrid && this.attachmentGrid) {
			this.notesGrid.setDisabled(assetId == 0);
			this.attachmentGrid.setDisabled(assetId == 0);

			this.notesObj.SetAssociationInfo("Asset", assetId);
			this.attachmentObj.SetAssociationInfo("Asset", assetId);

			if (assetId != 0) {
				//this.notesGrid.loadFirst();
				//this.attachmentGrid.loadFirst();
			}
		}
		if (this.coolerImages) {
			this.imageCarouselPanel.setDisabled(assetId == 0);
		}

		this.startIndex = 0;
		this.startIndexImages = 0;
	},

	removePazeSizeLimit: function (grid, store) {
		/*Here we are removing the limit because after first time grid automatically as pagesize*/
		if (grid.getBottomToolbar()) {
			delete store.baseParams['limit'];
		}
	},

	comboStores: {
		Location: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		State: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		ParentAssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		TagType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		User: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		CoolerVisitStatus: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		AssetCategory: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		OutletType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},
	showGraphWindow: function (record) {
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			mask.show();
			this.mask = mask;
		}
		if (!this.graphWin) {
			var graphTpl = new Ext.XTemplate(
				'<table class="graph-table" style="background-color: white;width: 100%;" cellpadding="5">',
				'<tbody >',
				'<tr>',
				'<td class = "cursorStyle" width="15%" style="color:#3498DB;padding-left:1em;font-size:large;">DATE</td>',
				'<td class = "cursorStyle" width="12%"><img title="Temperature" src="./images/icons/centigrade-icon_@1x.png"></td>',
				'<td class = "cursorStyle" width="12%"><img title="Light" src="./images/icons/light-icon_@1x.png"></td>',
				'<td class = "cursorStyle" width="12%"><img title="Power Staus" src="./images/icons/on-off-icon_@1x.png"></td>',
				'<td class = "cursorStyle" colspan="2"><img title="Door Status" src="./images/icons/door-icon_@1x.png"></td>',
				'<td class = "cursorStyle" width="12%"><img  title="Movement" src="./images/icons/cooler-move-icon_@1x.png"></td>',
				'</tr>',
				'<tpl for=".">',
				'<tr style="height: 2em;">',
				'<td class = "cursorStyle"><div><h3>{[this.formatDateAsString(values.Date)]}</h3></div></td>',
				'<td class = "cursorStyle">{[this.showDot(values.TemperatureOutOfBounds === 0, values.RecordCount)]}</td>',
				'<td class = "cursorStyle">{[this.showDot(values.LightOutOfBounds === 0, values.RecordCount)]}</td>',
				'<td >{[this.showDot(values.PowerOff === 0, values.RecordCount)]}</td>',
				'<td class = "cursorStyle" width="5%">{DoorOpenCount}</td>',
				'<td >',
				'<div style="width:{DoorGraphPercentage}%;height:1.5em;background-color:{DoorColor};" class = "cursorStyle"></div>',
				'</td>',
				'<td>{[this.showDot(values.MovementOutOfBounds === 0, values.RecordCount) ]}</td>',
				'</tr>',
				'</tpl>',
				'</tbody>',
				'</table>',
				{
					showDot: function (isOkay, count) {
						if (count === 0) {
							return 'N/A';
						}
						return '<img src="./images/icons/circle_' + (isOkay ? 'green' : 'red') + '.png">';
					},
					formatDateAsString: function (input) {
						return Date.parseDate(input, 'X').format('m/d/Y');
					}
				}
			);
			var graphStartDatePicker = new Ext.form.DateField({
				listeners: {
					render: function (datefield) {
						datefield.setValue(new Date());
					}
				}
			});
			var graphStartDateApplyBtn = new Ext.Button({ text: 'Apply', handler: this.onApplyButtonClick, scope: this });
			this.graphStartDatePicker = graphStartDatePicker;
			this.graphStartDateApplyBtn = graphStartDateApplyBtn;

			var col1 = {
				labelWidth: 100,
				items: [
					graphStartDatePicker
				]
			};
			var col2 = {
				labelWidth: 100,
				items: [
					graphStartDateApplyBtn
				]
			};

			var graphStartDatePanel = new Ext.Panel({
				id: 'graph-select-date',
				region: 'north',
				height: 22,
				width: 100,
				layout: 'column',
				border: false,
				items: [col1, col2]
			});
			this.graphStartDatePanel = graphStartDatePanel;

			var summaryStore = new Ext.data.Store({
				fields: ['Date', 'TemperatureOutOfBounds', 'LightOutOfBounds', 'PowerOff', 'DoorOpenCount', 'MovementOutOfBounds', 'DoorGraphPercentage', 'DoorColor', 'RecordCount'],
				proxy: new Ext.data.HttpProxy({
					url: 'Controllers/CoolerTrackingDetail.ashx',
				}),
				baseParams: {
					IgnoreOutOfBusinessHours: false,
					IsWeeklyData: true,
					date: this.graphStartDatePicker.getValue(),
					action: 'TrackingSummary'
				},
				reader: new Ext.data.JsonReader({
					root: 'records'
				}, ['Date', 'TemperatureOutOfBounds', 'LightOutOfBounds', 'PowerOff', 'DoorOpenCount', 'MovementOutOfBounds', 'DoorGraphPercentage', 'DoorColor', 'RecordCount']),
				sortInfo: {
					field: 'Date',
					direction: 'DESC'
				}
			});

			var chartStore = new Ext.data.Store({
				fields: ['EventTime', 'Temperature', 'LightIntensity'],
				proxy: new Ext.data.HttpProxy({
					url: 'Controllers/CoolerTrackingDetail.ashx',
				}),
				baseParams: {
					IgnoreOutOfBusinessHours: false,
					IsWeeklyData: false,
					action: 'HealthChartData',
					date: this.graphStartDatePicker.getValue()
				},
				reader: new Ext.data.JsonReader({
					root: 'records'
				}, ['EventTime', 'Temperature', 'LightIntensity'])

			});

			var chartStoreDoor = new Ext.data.Store({
				fields: ['DoorCount', 'SlotDescription'],
				proxy: new Ext.data.HttpProxy({
					url: 'Controllers/CoolerTrackingDetail.ashx',
				}),
				baseParams: {
					IgnoreOutOfBusinessHours: false,
					IsWeeklyData: false,
					action: 'DoorChartData'
				},
				reader: new Ext.data.JsonReader({
					root: 'records'
				}, ['DoorCount', 'SlotDescription'])

			});
			chartStore.on('load', function (response) {
				var chartType = Cooler.Asset.chartStore.baseParams.ChartType
				this.renderChart(response, chartType);
			}, this);

			chartStoreDoor.on('load', function (response) {
				var chartType = Cooler.Asset.chartStoreDoor.baseParams.ChartType
				this.renderChart(response, chartType);
			}, this);

			summaryStore.on('load', function (store, records, options) {
				this.fusionChartPanel.hide();
				this.emptyPanelText.show();
				this.mask.hide();
			}, this);

			var graphDataview = new Ext.DataView({
				itemSelector: 'tr',
				store: summaryStore,
				tpl: graphTpl,
				listeners: {
					'click': this.onSummaryRowClick,
					scope: this
				}
			});
			if (!this.graphPanelview) {
				var graphPanelview = new Ext.Panel({
					region: 'center',
					layout: 'fit',
					autoScroll: true,
					items: graphDataview
				});
				this.graphPanelview = graphPanelview;
			}
			if (!this.fusionChartPanel) {
				var fusionChartPanel = new Ext.Panel({ id: 'graph-fusion-chart', html: '', region: 'south', height: 335 });
				this.fusionChartPanel = fusionChartPanel;
			}
			this.emptyPanelText = new Ext.form.Label({ text: "Select a date to view detailed data", height: 100, width: 524, region: 'south', style: 'text-align: center; margin: 38em 2em;' });
			var panel = new Ext.Panel({
				layout: 'border',
				items: [this.graphStartDatePanel, this.graphPanelview, this.emptyPanelText, this.fusionChartPanel]
			});

			if (!this.fusionChart) {
				var chartData = {
					"chart": {
						"showvalues": "0",
						"theme": "fint",
						"caption": "",
						"xAxisName": "Hours",
						"yAxisName": "",
						"dateformat": "hh:mm ",
						"paletteColors": "#A2C832",
						"showToolTip": 1
					},
					"data": ""
				};
				var fusionChart = new FusionCharts({
					type: 'line',
					renderAt: 'graph-fusion-chart',
					width: '100%',
					height: 350,
					dataFormat: "json",
					dataSource: this.chartData
				});
			}
			this.fusionChart = fusionChart;
			this.chartData = chartData;

			var graphWin = new Ext.Window({
				layout: 'fit',
				title: 'Graph',
				closeAction: 'hide',
				modal: true,
				width: 600,
				height: 650,
				items: panel
			});
			this.graphWin = graphWin;
			this.graphDataview = graphDataview;
			this.chartStore = chartStore;
			this.summaryStore = summaryStore;

		}
		this.graphWin.setTitle(this.graphWinTitleTpl.apply(record.data));
		this.graphWin.show();
	},

	onSummaryRowClick: function (view, index, node, e) {
		if (this.mask) {
			this.mask.show();
		}

		var tr = Ext.fly(node),
			items = tr.select(">td"),
			element = e.getTarget('td'),
			tdIndex = items.indexOf(element),
			chartDate,
			record;

		if (items.elements.length == 6 && tdIndex == 5) {
			if (this.mask) {
				this.mask.hide();
			}
			return;
		}
		if (index < 0 && tdIndex == 0) {
			return;
		}

		record = view.store.getAt(index > 0 ? index - 1 : index);
		chartDate = Date.parseDate(record.get('Date'), 'X').format("Y-m-d");
		if (index == 0) {
			delete Cooler.Asset.chartStore.baseParams.DataDate;
			delete Cooler.Asset.chartStoreDoor.baseParams.DataDate
		}
		else {
			Cooler.Asset.chartStore.baseParams.DataDate = chartDate;
			Cooler.Asset.chartStoreDoor.baseParams.DataDate = chartDate;
		}
		if (!Cooler.Asset.chartStore.baseParams.date) {
			var datePicker = this.graphStartDatePicker;
			Cooler.Asset.chartStore.baseParams.date = new Date(datePicker.getValue()).format("Y-m-d");
		}
		switch (tdIndex) {
			case 0:
				Cooler.Asset.chartStore.baseParams.action = "GetChartData";
				Ext.Ajax.request({
					url: 'Controllers/CoolerTrackingDetail.ashx',
					params: Cooler.Asset.chartStore.baseParams,
					success: function (result, request) {
						var response = Ext.decode(result.responseText);
						var data = response.records;
						Cooler.Asset.renderCombinedChart(data);
					},
					failure: function (result, request) {
						Ext.Msg.alert('Alert', JSON.parse(result.responseText));
					}
				});
				break;
			case 1:
				Cooler.Asset.chartStore.baseParams.action = 'HealthChartData';
				Cooler.Asset.chartStore.baseParams.ChartType = "Temperature";
				Cooler.Asset.chartStore.load();
				break;
			case 2:
				Cooler.Asset.chartStore.baseParams.action = 'HealthChartData';
				Cooler.Asset.chartStore.baseParams.ChartType = "Light Intensity";
				Cooler.Asset.chartStore.load();
				break;
			case 4:
			case 5:
				if (index == 0) {
					delete Cooler.Asset.chartStoreDoor.baseParams.DataDate;
				}
				else {
					Cooler.Asset.chartStoreDoor.baseParams.DataDate = chartDate;
				}
				Cooler.Asset.chartStoreDoor.baseParams.action = 'DoorChartData';
				Cooler.Asset.chartStoreDoor.baseParams.ChartType = "Door Count";
				Cooler.Asset.chartStoreDoor.load();
				break;
			case 3:
			case 6:
				if (this.mask) {
					this.mask.hide();
				}
				return;
		}
		this.fusionChartPanel.show();
		this.emptyPanelText.hide();
		return;
	},

	graphWinTitleTpl: new Ext.Template('{Location} ({LocationCode}) - {SerialNumber} ({AssetType})'),


	formatDate: function (input) {
		var d = new Date(input.slice(0, 4), input.slice(4, 6) - 1, input.slice(6, 8), input.slice(8, 10), input.slice(10, 12), input.slice(12, 14));
		return d;
	},
	renderChart: function (response, chartType) {
		if (this.mask) {
			this.mask.hide();
		}
		var chartData = [], eventTime, data, chart = 'line', dateSelected, caption, eventDate,
			forWeek = Ext.isEmpty(Cooler.Asset.chartStore.baseParams.DataDate) || Ext.isEmpty(Cooler.Asset.chartStoreDoor.baseParams.DataDate) ? true : false, weeklyData;
		var responseData = response.data.items, len = responseData.length;
		for (var i = 0; i < len; i++) {
			switch (chartType) {
				case 'Temperature':
					eventTime = this.formatDate(responseData[i].data.EventTime);
					data = responseData[i].data.Temperature;
					break;
				case 'Light Intensity':
					eventTime = this.formatDate(responseData[i].data.EventTime);
					data = responseData[i].data.LightIntensity;
					break;
				case 'Door Count':
					eventTime = this.formatDate(responseData[i].data.SlotDescription);
					data = responseData[i].data.DoorCount;
					chart = 'column2d';
					break;
			}
			weeklyData = '';
			if (!forWeek && chartType) {
				eventTime = eventTime.format('h:i A');
			}
			/*it run for weekly data i.e on icon click*/
			else {
				if (chartType) {
					eventDate = eventTime;
					eventTime = eventTime.format('d-M h:i A');
					weeklyData = chartData.filter(function (obj) {
						return obj.eventDate === eventDate;
					})[0];
				}
			}
			if (Ext.isEmpty(weeklyData)) {
				chartData.push({ label: eventTime, value: data, toolText: "Time: " + eventTime + ", Value: " + data, eventDate: eventTime });
			}
			else {
				weeklyData.value = chartType == 'Door Count' ? weeklyData.value + data : chartType == 'Light Intensity' ? weeklyData.value < data ? weeklyData.value : data : weeklyData.value > data ? weeklyData.value : data;
				weeklyData.toolText = "Time: " + weeklyData.label + ", Value: " + weeklyData.value;
			}
		}
		if (Cooler.Asset.chartStore.baseParams.DataDate) {
			dateSelected = Date.parseDate(Cooler.Asset.chartStore.baseParams.DataDate, 'Y-m-d');
			caption = chartType + ' ' + dateSelected.format('m/d/Y');
		}
		else {
			caption = chartType + ' For Week';
		}
		this.chartData.chart.caption = caption
		this.chartData.data = chartData;
		if (chartType) {
			this.fusionChart.setJSONData(this.chartData);
			this.fusionChart.render();
			this.fusionChart.chartType(chart);
		}
	},

	renderCombinedChart: function (response) {
		if (this.mask) {
			this.mask.hide();
		}
		var caption = Cooler.Asset.chartStore.baseParams.DataDate;
		if (!caption) {
			caption = "For Week"
		}

		this.fusionChart.setJSONData(this.getChartDataSource(response, caption));
		this.fusionChart.render();
		this.fusionChart.chartType('MSCombiDY2D');
	},

	getChartDataSource: function (records, caption) {
		var category = [],
			temperature = [],
			light = [],
			door = [],
			record = null,
			healthData = records.HealthData,
			doorData = records.DoorData,
			eventTime, slotRecord;

		for (var i = 0, len = doorData.length; i < len; i++) {
			record = doorData[i];
			category.push(record.SlotDescription);
			record.temperature = '';
			record.light = '';
		};

		for (var i = 0, len = healthData.length; i < len; i++) {
			record = healthData[i];
			eventTime = record.EventTime.substr(0, 10) + '0000000';
			var index = doorData.map(function (x) { return x.SlotDescription; }).indexOf(eventTime);
			if (index > 0) {
				slotRecord = doorData[index];
				slotRecord.temperature = !Ext.isEmpty(slotRecord.temperature) && slotRecord.temperature > record.Temperature ? slotRecord.temperature : record.Temperature;
				slotRecord.light = !Ext.isEmpty(slotRecord.light) && slotRecord.light < record.LightIntensity ? slotRecord.light : record.LightIntensity;
			}
		};

		for (var i = 0, len = category.length; i < len; i++) {
			category[i] = { name: Date.parseDate(category[i], 'X').format('d-M h:i A') };
			var slotRecord = doorData[i];
			door[i] = { value: slotRecord.DoorCount };
			temperature[i] = { value: slotRecord.temperature };
			light[i] = { value: slotRecord.light };
		}

		var json = {
			"chart": {
				"showvalues": "0",
				"caption": 'Summary ' + caption,
				"xAxisName": "Hours",
				"pyAxisName": "Temperature/ Door Count",
				"syAxisName": "Light",
				"dateformat": "hh:mm",
				"labelStep": "1"
			},
			"categories": [{ "category": category }],
			"dataset": [
				{ "seriesname": "Temperature", "parentyaxis": "P", "renderas": "Line", "data": temperature },
				{ "seriesname": "Light", "parentyaxis": "S", "renderas": "Line", "data": light },
				{ "seriesname": "Door", "parentyaxis": "P", "renderas": "Bar", "data": door }
			]
		};
		return json;
	},
	onGraphButtonClick: function () {
		var selectedRecord = Cooler.Asset.grid.getSelectionModel().getSelected();
		if (selectedRecord == undefined) {
			Ext.Msg.alert('Alert', 'Please select one row.');
			return;
		}
		var datePicker = {},
			selectedRowData = selectedRecord.data,
			assetId = selectedRowData.AssetId;
		this.showGraphWindow(selectedRecord);
		this.graphDataview.store.baseParams.AssetId = assetId;
		this.graphDataview.store.load();
		datePicker = this.graphStartDatePicker;
		datePicker.setValue(new Date());
		this.summaryStore.baseParams.date = this.chartStore.baseParams.date = new Date(datePicker.getValue()).format("Y-m-d");
		this.summaryStore.load();
		this.chartStore.baseParams.AssetId = assetId;
		this.chartStore.load();
		this.chartStoreDoor.baseParams.AssetId = assetId;
		//Hide the chart
		this.fusionChart.setJSONData("");
		this.fusionChartPanel.hide();
		this.emptyPanelText.show();
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var graphButton = new Ext.Button({ text: 'Health Summary', iconCls: 'btn-icon-graph', handler: this.onGraphButtonClick, scope: this });
		var mapButton = new Ext.Button({ text: 'Movement Map', handler: Cooler.SmartDevice.loadMap, scope: this, iconCls: 'locationIcon' });
		var mapCoolerButton = new Ext.Button({ text: 'Map All', handler: this.mapCoolers, scope: this, iconCls: 'locationIcon' });
		var filterFields = ['AssetSerialNumber', 'AssetEquipmentNumber', 'AssetTechnicalNumber'];
		this.filterFields = filterFields;
		this.assetSerialTextField = new Ext.form.TextField({ width: 100 });
		this.assetEquipmentTextField = new Ext.form.TextField({ width: 100 });
		this.assetTechnicalTextField = new Ext.form.TextField({ width: 100 });
		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.resetGridStore();
				var assetSerialNumber = this.assetSerialTextField.getValue();
				var isComma = /[,\.]/.test(assetSerialNumber) // To check comma exists or not in search string
				var serialNumber = [assetSerialNumber];
				var counts = '';
				if (isComma) {
					counts = (serialNumber.join().match(/,/g).length + 1) // Count total commas + 1, in search string
					if (counts <= 1000) {
						assetSerialNumber = assetSerialNumber.replace(/,\s*$/, ""); // Remove Comma al the end of string
						Ext.applyIf(this.grid.getStore().baseParams, { AssetSerialNumber: this.assetSerialTextField.getValue() });
					}
					else {
						Ext.Msg.alert('Alert', "You Can't Search More than 1000 records.");
					}
				}
				else {
					if (!Ext.isEmpty(this.assetSerialTextField.getValue())) {
						Ext.applyIf(this.grid.getStore().baseParams, { AssetSerialNumber: this.assetSerialTextField.getValue() });
					}
				}
				var assetEquipmentCount = this.assetEquipmentTextField.getValue();
				var isComma = /[,\.]/.test(assetEquipmentCount)	// To check comma exists or not in search string
				var equipment = [assetEquipmentCount];
				var counts = '';
				if (isComma) {
					counts = (equipment.join().match(/,/g).length + 1)	// Count total commas + 1, in search string
					if (counts <= 1000) {
						assetEquipmentCount = assetEquipmentCount.replace(/,\s*$/, ""); // Remove Comma al the end of string
						Ext.applyIf(this.grid.getStore().baseParams, { AssetEquipmentNumber: this.assetEquipmentTextField.getValue() });
					}

					else {
						Ext.Msg.alert('Alert', "You Can't Search More than 1000 records.");
					}
				}
				else {
					if (!Ext.isEmpty(this.assetEquipmentTextField.getValue())) {
						Ext.applyIf(this.grid.getStore().baseParams, { AssetEquipmentNumber: this.assetEquipmentTextField.getValue() });
					}
				}
				var assetTechnicalNumber = this.assetTechnicalTextField.getValue();
				var isComma = /[,\.]/.test(assetTechnicalNumber) // To check comma exists or not in search string
				var TechnicalId = [assetTechnicalNumber];
				var counts = '';
				if (isComma) {
					counts = (TechnicalId.join().match(/,/g).length + 1) // Count total commas + 1, in search string
					if (counts <= 1000) {
						assetTechnicalNumber = assetTechnicalNumber.replace(/,\s*$/, ""); // Remove Comma al the end of string
						Ext.applyIf(this.grid.getStore().baseParams, { AssetTechnicalNumber: this.assetTechnicalTextField.getValue() });

					}
					else {
						Ext.Msg.alert('Alert', "You Can't Search More than 1000 records.");
					}
				}
				else {
					if (!Ext.isEmpty(this.assetTechnicalTextField.getValue())) {
						Ext.applyIf(this.grid.getStore().baseParams, { AssetTechnicalNumber: this.assetTechnicalTextField.getValue() });
					}
				}
				this.grid.loadFirst();
			}, scope: this
		});
		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: function () {
				this.resetGridStore();
				this.assetSerialTextField.reset();
				this.assetEquipmentTextField.reset();
				this.assetTechnicalTextField.reset();
				this.grid.loadFirst();
			}, scope: this
		});
		tbarItems.push(graphButton);
		tbarItems.push(mapButton);
		tbarItems.push(mapCoolerButton);
		tbarItems.push('Serial#');
		tbarItems.push(this.assetSerialTextField);
		tbarItems.push('Equipment#');
		tbarItems.push(this.assetEquipmentTextField);
		tbarItems.push('Technical ID');
		tbarItems.push(this.assetTechnicalTextField);
		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},

	resetGridStore: function () {
		var stroeBaseParams = this.grid.getStore().baseParams, filterFieldsLength = this.filterFields.length, filterField;
		for (var i = 0; i < filterFieldsLength; i++) {
			filterField = this.filterFields[i];
			delete stroeBaseParams[filterField];
		}
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'AssetId', type: 'int' },
			{ dataIndex: 'LocationId', type: 'int' },
			{ dataIndex: 'LatestCoolerInfoId', type: 'int' },
			{ dataIndex: 'StockDetails', type: 'string' },
			{ dataIndex: 'OutletType', type: 'string' },
			{ dataIndex: 'StockRemoved', type: 'int' },
			{ dataIndex: 'PurityIssue', type: 'bool' },
			{ dataIndex: 'AssetType', type: 'string' },
			{ dataIndex: 'State', type: 'string' },
			{ dataIndex: 'Code', type: 'string' },
			{ dataIndex: 'Country', type: 'string' },
			{ dataIndex: 'SmartDeviceId', type: 'int' },
			{ dataIndex: 'CustomSettings', type: 'string' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ dataIndex: 'ClientName', type: 'string' },
			{ dataIndex: 'Columns', type: 'int' },
			{ dataIndex: 'TimeZoneId', type: 'int' },
			{ dataIndex: 'PlanogramId', type: 'int' },
			{ dataIndex: 'Displacement', type: 'float', renderer: ExtHelper.renderer.Float(2) },
			{ dataIndex: 'LatestLatitude', type: 'float', renderer: ExtHelper.renderer.Float(8) },
			{ dataIndex: 'LatestLongitude', type: 'float', renderer: ExtHelper.renderer.Float(8) },
			{ dataIndex: 'GatewayMacAddress', type: 'string' },
			{ dataIndex: 'GatewaySmartDeviceId', type: 'int' },
			{ header: 'Asset Type', dataIndex: 'AssetTypeId', type: 'int', displayIndex: 'AssetType', renderer: 'proxy', store: this.comboStores.AssetType, width: 150 },
			{ header: 'Equipment Number', dataIndex: 'EquipmentNumber', type: 'string', width: 150 },
			{ header: 'Technical Id', dataIndex: 'TechnicalIdentificationNumber', type: 'string', width: 150 },
			{ header: 'Serial Number', dataIndex: 'SerialNumber', type: 'string', width: 130 },
			{ header: 'Category', dataIndex: 'AssetCategory', type: 'string' },
			{ header: 'Is Competition?', dataIndex: 'Competition', type: 'bool', width: 90, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Factory Asset?', dataIndex: 'IsFactoryAsset', type: 'bool', width: 90, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Associated in Factory', dataIndex: 'IsAssociatedInFactory', type: 'bool', width: 90, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Outlet', dataIndex: 'Location', type: 'string', width: 150 },
			{ header: 'Outlet Code', dataIndex: 'LocationCode', type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Type', dataIndex: 'OutletTypeId', type: 'int', displayIndex: 'OutletType', renderer: 'proxy', store: this.comboStores.OutletType, width: 100 },
			{ header: 'Trade Channel', dataIndex: 'LocationType', width: 120, type: 'string' },
			{ header: 'Trade Channel Code', hidden: true, dataIndex: 'ChannelCode', width: 120, type: 'string' },
			{ header: 'Customer Tier', dataIndex: 'Classification', width: 120, type: 'string' },
			{ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel', dataIndex: 'SubTradeChannelName', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel Code', hidden: true, dataIndex: 'SubTradeChannelTypeCode', width: 120, type: 'string' },
			{ header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 },
			{ header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
			{ header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' },
			{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
			{ header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
			{ header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
			{ header: 'Sales Territory Code', hidden: true, type: 'string', dataIndex: 'SalesTerritoryCode' },
			{ header: 'Issue', dataIndex: 'Issue', renderer: Cooler.renderer.AssetIssue, width: 140, sortable: false },
			{ header: 'Asset Ping', dataIndex: 'AssetLastPing', width: 160, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Smart Device', dataIndex: 'SmartDeviceSerialNumber', type: 'string', width: 100, hyperlinkAsDoubleClick: true },
			{ header: 'Smart Device Type', dataIndex: 'SmartDeviceTypeId', type: 'int', displayIndex: 'SmartDeviceType', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }), width: 130 },
			{ header: 'Smart Device Ping', dataIndex: 'LastPing', width: 160, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Gateway', dataIndex: 'GatewaySerialNumber', type: 'string', width: 100 },
			{ header: 'Gateway Type', dataIndex: 'GatewayType', type: 'string', width: 150 },
			{ header: 'Gateway Ping', dataIndex: 'GatewayLastPing', width: 160, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Last Scan', dataIndex: 'LatestScanTime', width: 160, type: 'date', renderer: Cooler.renderer.DateTimeWithLocalTimeZone },
			{ header: 'Visit (Scan) Status', type: 'string', width: 160, dataIndex: 'AssetCurrentStatus' },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientId', type: 'int', displayIndex: 'ClientName', renderer: 'proxy', store: this.comboStores.Client, width: 120 },
			{ header: 'City', dataIndex: 'City', type: 'string', width: 80 },
			{ header: 'Street', dataIndex: 'Street', type: 'string', width: 150 },
			{ header: 'Street 2', dataIndex: 'Street2', type: 'string', width: 80 },
			{ header: 'Street 3', dataIndex: 'Street3', type: 'string', width: 80 },
			{ header: 'State', dataIndex: 'StateId', type: 'int', displayIndex: 'State', renderer: 'proxy', store: this.comboStores.State, width: 50 },
			{ header: 'Country', dataIndex: 'CountryId', type: 'int', displayIndex: 'Country', renderer: 'proxy', store: this.comboStores.Country, width: 100 },
			{ header: 'Prime position?', dataIndex: 'IsPrimePosition', type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Missing?', dataIndex: 'IsMissing', type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Vision?', dataIndex: 'HasVision', type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Smart?', dataIndex: 'IsSmart', type: 'bool', width: 50, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Authorized Movement ?', dataIndex: 'IsAuthorizedMovement', type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Unhealthy?', dataIndex: 'IsUnhealthy', type: 'bool', width: 70, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Latitude', dataIndex: 'Latitude', type: 'float', width: 80, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Longitude', dataIndex: 'Longitude', type: 'float', width: 80, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Displacement', dataIndex: 'Displacement', type: 'float', renderer: ExtHelper.renderer.Float(2) },
			{ id: 'stock', dataIndex: 'TotalStock', type: 'int', width: 50, align: 'right' },
			{ header: 'Is Power On?', dataIndex: 'IsPowerOn', type: 'bool', renderer: function (v, m, r) { return r.data.GatewaySerialNumber == "" ? "No" : ExtHelper.renderer.Boolean(v); } },
			{ header: 'Latest Health Record Event Time', dataIndex: 'LatestHealthRecordEventTime', width: 200, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Battery Level', dataIndex: 'BatteryLevel', type: 'int', width: 100, align: 'right' },
			{ header: 'Battery Status', dataIndex: 'BatteryStatus', type: 'string', width: 160 },
			{ header: 'Sound Level', hidden: true, dataIndex: 'SoundLevel', type: 'int', width: 80, align: 'right' },
			{ header: 'Installation', dataIndex: 'Installation', type: 'date', width: 160, renderer: ExtHelper.renderer.DateTime, hidden: true },
			{ header: 'Expiry', dataIndex: 'Expiry', type: 'date', width: 160, renderer: ExtHelper.renderer.DateTime, hidden: true },
			{ header: 'Warranty Expiry', dataIndex: 'WarrantyExpiry', type: 'date', width: 160, renderer: ExtHelper.renderer.DateTime, hidden: true },
			{ header: 'Planogram', dataIndex: 'PlanogramName', type: 'string', width: 80 },
			{ header: 'Responsible BD Username', dataIndex: 'PrimarySalesRep', type: 'string' },
			{ header: 'Responsible BD First Name', dataIndex: 'FirstName', type: 'string' },
			{ header: 'Responsible BD Phone number', dataIndex: 'PrimaryPhone', type: 'string' },
			{ header: 'CCH Solution', dataIndex: 'CCHSolution', type: 'string', width: 150 },
			{ header: 'Asset Associated On', dataIndex: 'AssetAssociatedOn', type: 'date', width: 160, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Acquisition Date', dataIndex: 'AcquisitionDate', type: 'date', width: 160, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Associated By BD User Name', dataIndex: 'AssetAssociatedByUser', type: 'string' },
			{ header: 'Associated By BD Name', dataIndex: 'AssetAssociatedByUserName', type: 'string' },
			{ header: 'Last Tested', dataIndex: 'LastTested', type: 'date', width: 160, renderer: ExtHelper.renderer.DateTime, hidden: true },
			{ header: 'Time Zone', dataIndex: 'TimeZoneId', displayIndex: 'TimeZoneName', width: 250, type: 'int', store: Cooler.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: Cooler.comboStores.TimeZone }) },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },
			{ dataIndex: 'OpenHealthAlert', type: 'int' },
			{ dataIndex: 'OpenStockAlert', type: 'int' },
			{ dataIndex: 'OpenMovementAlert', type: 'int' },
			{ dataIndex: 'OpenPurityAlert', type: 'int' },
			{ dataIndex: 'OpenMissingAlert', type: 'int' },
			{ dataIndex: 'DoorOpen', type: 'date' },
			{ dataIndex: 'DoorClose', type: 'date' },
			{ header: 'Capacity Type', dataIndex: 'AssetTypeCapacity', type: 'string', width: 150, align: 'right' },
		];
	},
	onGridCreated: function (grid) {
		//grid.store.baseParams.isFactoryAsset = 0;
		grid.store.on('load', this.loadStore, this);
	},
	createForm: function (config) {
		var tagsPanel = Cooler.Tag();
		this.tagsPanel = tagsPanel;
		var allowedAlertTypeSpecification = "Allowed parameter:<br> CoolerTopSpace : 2(Any Valid Value), <br> CoolerLeftSpace : 2(Any Valid Value), <br> CoolerRightSpace : 2(Any Valid Value), <br> CoolerBottomSpace : 2(Any Valid Value), <br> CoolerShelveHeight : 2(Any Valid Value), <br> CoolerShelveWidth : 2(Any Valid Value), <br> shelfHeights:[600,600,600,600,600] (Any valid value as per each shelf) <br><br> Text used for Key should be the same as mentioned above, Value may be differ";
		var customSettings = new Ext.form.TextArea({ fieldLabel: 'Custom Settings', name: 'CustomSettings', width: 200, height: 40 });
		var longitude = new Ext.form.NumberField({ fieldLabel: 'Longitude', hidden: true, hideLabel: true, name: 'Longitude', maxLength: 11, allowBlank: false, decimalPrecision: 6, maxValue: Cooler.Enums.ValidLatLong.Longitude, minValue: -Cooler.Enums.ValidLatLong.Longitude });
		var latitude = new Ext.form.NumberField({ fieldLabel: 'Latitude', hidden: true, hideLabel: true, name: 'Latitude', maxLength: 11, allowBlank: false, decimalPrecision: 6, maxValue: Cooler.Enums.ValidLatLong.Latitude, minValue: -Cooler.Enums.ValidLatLong.Latitude });
		var parentAssetTypeCombo = DA.combo.create({ fieldLabel: 'Parent Asset', itemId: 'parentAssetTypeCombo', hiddenName: 'ParentAssetId', baseParams: { comboType: 'ParentAssetType' }, listWidth: 230, controller: "Combo" }),
			assetTypeCombo = DA.combo.create({ fieldLabel: 'Asset Type', hiddenName: 'AssetTypeId', baseParams: { comboType: 'AssetType' }, listWidth: 230, controller: "Combo" }),
			locationCombo = DA.combo.create({ fieldLabel: 'Outlet', hiddenName: 'LocationId', itemId: 'locationCombo', baseParams: { comboType: 'Location' }, listWidth: 300, controller: "Combo" }),
			clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', hiddenName: 'ClientId', itemId: 'clientCombo', baseParams: { comboType: 'Client' }, listWidth: 230, controller: "Combo" }),
			planogramCombo = DA.combo.create({ fieldLabel: 'Planogram', hiddenName: 'PlanogramId', itemId: 'planogramCombo', baseParams: { comboType: 'Planogram' }, listWidth: 230, controller: "Combo" });
		var doorHandleLocationCombo = DA.combo.create({ fieldLabel: 'Door Handle Position', hiddenName: 'DoorHandleLocation', mode: 'local', store: [[0, "Left"], [1, "Right"]], width: 250, allowBlank: false });
		var assetCategoryCombo = DA.combo.create({ fieldLabel: 'Category', hiddenName: 'AssetCategoryId', store: this.comboStores.AssetCategory, mode: 'local' });
		var containerTypeCombo = DA.combo.create({ fieldLabel: 'Container Type', hiddenName: 'ContainerTypeId', mode: 'local', store: [[0, "Horizontal"], [1, "Vertical"]], width: 250, allowBlank: false });
		var containerLength = new Ext.form.NumberField({ fieldLabel: 'Container Length (mm)', name: 'Container_Length', minValue: 100, maxValue: 300, allowBlank: true });
		this.containerLength = containerLength;
		//var shelves = new Ext.form.Hidden({ name: 'Shelves' });
		this.assetTypeCombo = assetTypeCombo;
		this.assetCategoryCombo = assetCategoryCombo;
		this.containerTypeCombo = containerTypeCombo;
		assetCategoryCombo.on('select', this.onAssetCategorySelect, this);
		/*store Shelves from asset type*/


		/*store Shelves from planogram, if no planogram assigned then asset type*/
		//planogramCombo.on('change', function (combo, newValue, oldValue) {
		//	var record = combo.findRecord(combo.valueField, newValue);
		//	if (record) {
		//		shelves.setValue(record.get('CustomStringValue'));
		//	}
		//}, this);
		/*pass asset type id before load store of combo*/
		planogramCombo.store.on('beforeload', function (store) {
			var assetTypeId = this.assetTypeCombo.getValue();
			store.baseParams.assetTypeId = assetTypeId > 0 ? assetTypeId : 0;
		}, this);
		var columnStore = [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [7, '7'], [8, '8'], [9, '9'], [10, '10'], [11, '11'], [12, '12'], [13, '13'], [14, '14'], [15, '15']];
		var columnCombo = DA.combo.create({ fieldLabel: 'Columns', value: 1, hiddenName: 'Columns', store: columnStore, width: 130, allowBlank: false });
		this.columnCombo = columnCombo;

		var shelvesStore = [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [7, '7'], [8, '8'], [9, '9'], [10, '10'], [11, '11'], [12, '12'], [13, '13'], [14, '14'], [15, '15']];
		var shelvesCombo = DA.combo.create({ fieldLabel: 'Shelves', value: 1, hiddenName: 'Shelves', store: shelvesStore, width: 130, allowBlank: false });
		this.shelvesCombo = shelvesCombo;
		var fromAssetCheckBox = new Ext.form.Checkbox({
			fieldLabel: 'Get From Asset Type', name: 'GetColumnsFromAssetType', checked: true, hiddenName: 'GetColumnsFromAssetType', listeners: {
				check: this.onGetFromAssetTypeChange, scope: this
			}
		});
		this.fromAssetCheckBox = fromAssetCheckBox;
		this.assetTypeCombo.on('change', function (combo, newValue, oldValue) {
			var record = combo.findRecord(combo.valueField, newValue);
			if (record && this.activeRecordId == 0) {
				shelvesCombo.setValue(record.get('CustomStringValue'));
				columnCombo.setValue(record.get('CustomValue'));
			}
		}, this);
		var items = [
			{ fieldLabel: 'Serial Number', name: 'SerialNumber', xtype: 'textfield', allowBlank: false },
			{ fieldLabel: 'Equipment Number', name: 'EquipmentNumber', xtype: 'textfield', maxLength: 50, allowBlank: false },
			assetTypeCombo,
			{ fieldLabel: 'Technical Id', name: 'TechnicalIdentificationNumber', xtype: 'textfield' },
			parentAssetTypeCombo,
			locationCombo,
			assetCategoryCombo,
			containerTypeCombo,
			containerLength,
			DA.combo.create({ fieldLabel: 'Is Competition?', hiddenName: 'Competition', store: "yesno" }),
			latitude,
			longitude,
			{ fieldLabel: 'Installation', name: 'Installation', xtype: 'xdatetime', width: 200 },
			{ fieldLabel: 'Expiry', name: 'Expiry', xtype: 'xdatetime', width: 200 },
			{ fieldLabel: 'Warranty Expiry', name: 'WarrantyExpiry', xtype: 'xdatetime', allowBlank: false, width: 200 },
			{ fieldLabel: 'Last Tested', name: 'LastTested', xtype: 'xdatetime', allowBlank: false, width: 200 },
			tagsPanel,
			clientCombo,
			customSettings,
			planogramCombo,
			//shelves,
			DA.combo.create({ fieldLabel: 'Authorized Movement', hiddenName: 'IsAuthorizedMovement', store: "yesno" }),
			DA.combo.create({ fieldLabel: 'Prime position?', hiddenName: 'IsPrimePosition', store: "yesno" }),
			doorHandleLocationCombo,
			fromAssetCheckBox,
			shelvesCombo,
			columnCombo,
			{ fieldLabel: 'Asset Specs', name: 'AssetSpecs', xtype: 'textarea', width: 250, listeners: { render: function (field) { new Ext.ToolTip({ target: field.getEl(), html: allowedAlertTypeSpecification }); } } }


		];
		Ext.apply(config, {
			defaults: { width: 150 },
			items: items,
			autoScroll: true
		});
		this.locationCombo = locationCombo;

		this.on('dataLoaded', function (assetForm, data) {
			if (assetForm.showFormArgs) {
				if (assetForm.showFormArgs.parentId > 0) {
					var parentAssetTypeCombo = assetForm.formPanel.items.get('parentAssetTypeCombo');
					ExtHelper.SetComboValue(parentAssetTypeCombo, assetForm.showFormArgs.parentId);
				}
				if (assetForm.showFormArgs.locationId > 0) {
					var locationCombo = assetForm.formPanel.items.get('locationCombo');
					ExtHelper.SetComboValue(locationCombo, assetForm.showFormArgs.locationId);
				}
				var newData = assetForm.newListRecordData;
				if (newData.LocationId > 0) {
					var formPanel = assetForm.formPanel;
					var locationCombo = formPanel.items.get('locationCombo');
					locationCombo.setDisabled(true);
					ExtHelper.SetComboValue(locationCombo, newData.LocationId);
					if (assetForm.showFormArgs.id == 0) {
						var latitude = formPanel.getForm().findField('Latitude');
						var longitude = formPanel.getForm().findField('Longitude');
						latitude.setValue(newData.Latitude);
						longitude.setValue(newData.Longitude);
					}
				}

			}
			this.containerLength.setValue(this.containerLength.getValue() == 0 ? '' : this.containerLength.getValue());
		});
		// set the value of lat/long 
		locationCombo.on('change', function (combo, newValue, oldValue) {
			var store = combo.getStore();
			var selectedRecord = store.getAt(store.find('LookupId', newValue));
			if (selectedRecord) {
				longitude.setValue(selectedRecord.get('CustomStringValue'));  // Longitude as CustomStringValue. 
				latitude.setValue(selectedRecord.get('ReferenceValue'));     // Latitude as ReferenceValue.
			}
		});


		this.on('afterSave', function (assetForm, data) {
			if (this.linkedAssets) {
				this.linkedAssets.getStore().reload();
			}
		});

		return config;
	},

	onGetFromAssetTypeChange: function (checkBox, newValue, oldValue) {
		if (newValue) {
			this.shelvesCombo.setDisabled(true);
			this.columnCombo.setDisabled(true);
		}
		else {
			this.shelvesCombo.setDisabled(false);
			this.columnCombo.setDisabled(false);
		}
	},
	onAssetCategorySelect: function (combo, record) {
		this.containerTypeCombo.setFieldVisible(false);
		this.containerLength.setFieldVisible(false);

		if (record != undefined) {
			if (record.id == 7310) {
				console.log(record);
				this.containerTypeCombo.setFieldVisible(true);
				this.containerLength.setFieldVisible(true);
			}
		}

	},
	CreateFormPanel: function (config) {
		var grids = [];
		this.childGrids = grids;

		Ext.apply(config, {
			region: 'center',
			height: 660
		});

		this.formPanel = new Ext.FormPanel(config);
		this.on('beforeLoad', function (param) {
			this.tagsPanel.removeAllItems();
		});
		this.on('beforeSave', function (assetForm, params, options) {
			var locationCombo = assetForm.formPanel.items.get('locationCombo');
			locationCombo.setDisabled(false);
			var form = assetForm.formPanel.getForm(),
				assetSpecsField = form.findField('AssetSpecs'),
				assetSpecs = assetSpecsField.getValue().replace(/\s/g, "");
			assetSpecsField.setValue(assetSpecs);
			this.saveTags(this.tagsPanel, params);
		});
		this.on('dataLoaded', function (assetForm, data) {
			var clientId = Number(DA.Security.info.Tags.ClientId),
				clientCombo = assetForm.formPanel.items.get('clientCombo');
			if (clientId != 0) {
				ExtHelper.SetComboValue(clientCombo, clientId);
				clientCombo.setDisabled(true);
			}
			if (data.data.GetColumnsFromAssetType) {
				this.shelvesCombo.setDisabled(true);
				this.columnCombo.setDisabled(true);
			}
			else {
				this.shelvesCombo.setDisabled(false);
				this.columnCombo.setDisabled(false);
			}
			this.loadTags(this.tagsPanel, data);
		});

		this.winConfig = Ext.apply({ width: 425 }, {
			layout: 'border',
			defaults: { border: false, labelWidth: 120 },
			height: 640,
			items: [this.formPanel]
		});
	},
	loadStore: function () {
		if (this.grid) {
			var selectionModel = this.grid.getSelectionModel();
			if (selectionModel.selection) {
				var selectedRecord = selectionModel.getSelected();
				if (!selectedRecord) {
					if (this.grids) {
						var gridlength = this.grids.length, grid;
						for (var i = 0; i < gridlength; i++) {
							grid = this.grids[i];
							grid.setDisabled(true);
						}
					}
					this.updateCoolerInfo(selectedRecord, false);
				}
				else {
					this.updateCoolerInfo(selectedRecord, true);
				}
			}
		}
	},
	updateCoolerInfo: function (record, isData) {
		var tpl = Cooler.CoolerInfo.prototype.assetTpl;
		var detailsPanel = this.coolerDetailsPanel;
		// If there is no record selected exists then only set Right TPL as blank
		if (!isData) {
			detailsPanel.body.update();
			detailsPanel.setTitle('Cooler Info');
			if (this.assetVisitHistoryGrid && this.attachmentGrid && this.notesGrid) {
				this.assetVisitHistoryGrid.setDisabled(true);
				this.attachmentGrid.setDisabled(true);
				this.notesGrid.setDisabled(true);
			}
		}
	},

	showPurityWindow: function (grid, rowIndex, node) {
		var id = node.getAttribute('assetpurityid'),
			store = this.coolerImages.getStore(),
			record = store.getById(id),
			dataCount = store.data.getCount(),
			previousDisabled = true,
			nextDisabled = false;

		this.startIndex = store.indexOf(record);
		this.purityLoad = false;

		if (this.startIndex != 0) {
			previousDisabled = false;
		}
		if (this.startIndex == dataCount - 1) {
			nextDisabled = true;
		}

		var purityWindowStore = new Ext.data.Store({ fields: [{ name: 'AssetPurityId', type: 'int' }, { name: 'PurityDateTime', type: 'date' }, { name: 'ImageName', type: 'string' }, { name: 'ImageCount', type: 'int' }] });

		var assetPurityId = record.get('AssetPurityId');

		purityWindowStore.insert(0, new Ext.data.Record({ 'AssetPurityId': assetPurityId, 'PurityDateTime': record.get('PurityDateTime'), 'ImageName': record.get('ImageName'), 'ImageCount': record.get('ImageCount') }, record.get('AssetPurityId')));

		var btnPreviousButtonWindow = new Ext.Toolbar.Button({ text: 'Previous', iconCls: 'x-tbar-page-prev', handler: this.carouselImageLoad, scope: this, disabled: previousDisabled, imageCount: Cooler.Enums.LoadPurityImage.WindowCount });
		this.btnPreviousButtonWindow = btnPreviousButtonWindow;

		var btnNextButtonWindow = new Ext.Toolbar.Button({ text: 'Next', iconCls: 'x-tbar-page-next', handler: this.carouselImageLoad, scope: this, disabled: nextDisabled, imageCount: Cooler.Enums.LoadPurityImage.WindowCount });
		this.btnNextButtonWindow = btnNextButtonWindow;

		var imageDataViewTpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div>{[this.renderImage(values)]}</div>',
			'</tpl>', {
				renderImage: function (values) {
					var imageName = values.ImageName;
					var imageCount = values.ImageCount;
					var assetPurityId = values.AssetPurityId;
					var purityDateTime = values.PurityDateTime.format('Ymd');
					var imageSource = '';
					var imageUrl = 'Controllers/CoolerImagePreview.ashx?AssetImageName=' + imageName + '&ImageId=' + assetPurityId + '&v=' + new Date() + '&PurityDateTime=' + purityDateTime;
					var carouselImage = '';
					if (imageCount > 1) {
						for (var i = 1; i <= imageCount; i++) {
							var imagePath = imageUrl.replace('.jpg', '_' + i + '.jpg');
							imageSource += '<img class= "carouselDivImage" src="' + imagePath + '"></img>';
						}
					}
					else {
						imageSource += '<img class= "carouselDivImage" src="' + imageUrl + '"></img>';
					}

					carouselImage = '<div style= "display :block">' +
						imageSource +
						'</div>';
					return carouselImage;
				}
			}, this);

		var purityImageDataView = new Ext.DataView({
			tpl: imageDataViewTpl,
			store: purityWindowStore,
			emptyText: 'No images to display',
			itemSelector: 'div.carouselDiv'
		});

		this.purityImageDataView = purityImageDataView;

		var imageCarouselPanel = new Ext.Panel({
			region: 'south',
			autoScroll: true,
			tbar: [btnPreviousButtonWindow, '|', btnNextButtonWindow],
			items: purityImageDataView
		});

		var purityImageWin = new Ext.Window({
			width: 600,
			height: 450,
			layout: 'fit',
			maximizable: true,
			modal: true,
			closeAction: 'hide',
			items: imageCarouselPanel
		});

		this.purityImageWin = purityImageWin;

		purityImageWin.setTitle(assetPurityId);
		purityImageWin.show();
	},

	onApplyButtonClick: function () {
		this.summaryStore.baseParams.date = this.chartStore.baseParams.date = new Date(this.graphStartDatePicker.getValue()).format("Y-m-d");
		if (!this.mask) {
			this.mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Data loading...' });
		}
		this.mask.show();
		this.summaryStore.load();
		this.chartStore.load();
	},
	onCoolerImageClick: function (grid, rowIndex) {
		var store = grid.getStore(),
			record = store.getAt(rowIndex);
		var storedFileName = record.get('ImageName');
		record.set('StoredFilename', storedFileName);
		Cooler.showCoolerImage(record);
	},
	getSelectedAssetId: function () {
		var assetId = 0;
		var record = this.grid.getSelectionModel().getSelected();
		if (record) {
			assetId = record.get('AssetId');
		}
		return assetId;
	},
	addLinkedAsset: function () {
		var record = this.grid.getSelectionModel().getSelected();
		if (record)
			this.ShowForm(0, { parentId: record.get('AssetId') });
		else
			Ext.Msg.alert('Info', 'Please select asset from grid to add Linked Asset');
	},
	attachMarkerListener: function (marker, record) {
		var me = this;
		google.maps.event.addListener(marker, 'click', function () {
			var infoWindow = me.mapInfoWindow;
			var content = "<br><b>Serial Number</b>: " + (record.SerialNumber ? record.SerialNumber : 'N/A');
			content += "<br><b>Address</b>: " + (record.Location ? record.Location : '') + " " + (record.Street ? record.Street : '') + " " + (record.City ? record.City : '') + " " + (record.State ? record.State : '');
			//content += "<br><b>Temperature</b>: " + (record.TemperatureMedian ? record.TemperatureMedian : 'N/A');
			//content += "<br><b>Light Intensity</b>: " + (record.LightIntensityMedian ? record.LightIntensityMedian : 'N/A');
			content += "<br><b>Displacement</b>: " + parseFloat(record.Displacement, 10).toFixed(2) + "(Km)"; // #12673 
			content += "<br><b>Movement Duration</b>: " + (record.DeviceMovement ? record.DeviceMovement : 'N/A');
			infoWindow.setContent(content);
			infoWindow.open(me.coolerMap.getMap(), marker);
			if (record.Displacement > Number(DA.Security.info.Tags.MinAssetDisplacement)) {
				Cooler.SmartDevice.loadMap('', '', true, { assetId: record.AssetId, latitude: record.Latitude, longitude: record.Longitude });
			}
		});
	},

	mapCoolers: function () {
		if (!this.coolerMap) {
			var coolerMap = new Ext.ux.GMapPanel({
				zoomLevel: 9,
				gmapType: 'map',
				mapConfOpts: ['enableScrollWheelZoom', 'enableDoubleClickZoom', 'enableDragging'],
				mapControls: ['GSmallMapControl', 'GMapTypeControl'],
				setCenter: {
					lat: 42.339641,
					lng: -71.094224
				}
			});
			this.coolerMap = coolerMap;

			this.mapInfoWindow = new google.maps.InfoWindow({ maxWidth: 350 });
		}
		if (!this.coolerMapWin) {
			var coolerFilterStore = [
				[Cooler.Enums.CoolerFilterCategory.All, 'All'],
				[Cooler.Enums.CoolerFilterCategory.Displaced, 'Displaced']
			];
			var coolerFilter = DA.combo.create({ store: coolerFilterStore, width: 100, mode: 'local', allowBlank: false, value: Cooler.Enums.CoolerFilterCategory.All });
			this.coolerFilter = coolerFilter;
			var coolerMapWin = new Ext.Window({
				layout: 'fit',
				title: 'Map Coolers',
				closeAction: 'hide',
				modal: true,
				maximizable: true,
				listeners: { maximize: this.loadCoolersMap, scope: this, restore: this.loadCoolersMap },
				tbar: ['Cooler:', coolerFilter, new Ext.Button({ text: 'Apply', iconCls: 'coolerIcon', handler: this.loadCoolersMap, scope: this })],
				width: 600,
				height: 600,
				items: [this.coolerMap]
			});
			this.coolerMapWin = coolerMapWin;
		}
		else {
			this.coolerFilter.setValue(Cooler.Enums.CoolerFilterCategory.All);
		}

		if (this.grid.store.getTotalCount() >= 100) {
			Ext.MessageBox.show({
				msg: 'Max 100 coolers will be loaded',
				buttons: Ext.MessageBox.OKCANCEL,
				fn: function (btn) {
					if (btn == 'ok') {
						this.coolerMapWin.show();
						this.loadCoolersMap();
					}
				},
				scope: this
			});
		} else {
			this.coolerMapWin.show();
			this.loadCoolersMap();
		}
	},
	loadCoolersMap: function () {
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		Ext.Ajax.request({
			url: 'Controllers/Asset.ashx',
			params: Ext.applyIf({
				start: 0,
				limit: 100,
				asArray: 0,
				isMap: true,
				IncludeSummaryInList: 1,
				loadAll: this.coolerFilter.getValue() == Cooler.Enums.CoolerFilterCategory.All ? true : false,
				displacementThreshold: Number(DA.Security.info.Tags.MinAssetDisplacement)
			}, this.grid.store.lastOptions.params),
			success: this.onMapDataSuccess,
			failure: function (result, request) {
				mask.hide();
				mask.destroy();
				Ext.Msg.alert('Alert', JSON.parse(result.responseText));
			},
			scope: this
		});

	},
	onMapDataSuccess: function (result, request) {
		this.mask.hide();
		var responseData = JSON.parse(result.responseText);
		var records = responseData.records;

		var markers = [], coolerMap = this.coolerMap, map = this.coolerMap.getMap();
		coolerMap.clearMarkers();
		if (this.markerCluster) {
			this.markerCluster.clearMarkers();
		}
		//
		var oms = new OverlappingMarkerSpiderfier(map, {
			keepSpiderfied: true
		});
		//
		if (records.length != 0) {
			/*Changes done as per http://jsfiddle.net/jalbertbowdenii/pGBZD link*/
			Ext.each(records, function (rec) {
				var url = "images/icons/cooler-icon_in_range_@1x.png";
				var inRange = rec.Displacement <= Number(DA.Security.info.Tags.MinAssetDisplacement);
				var latitude = rec.LatestLatitude;
				var longitude = rec.LatestLongitude;
				if (!inRange) {
					url = "images/icons/cooler-icon_not_range_@1x.png";
				}
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(latitude, longitude),
					lat: latitude, lng: longitude, marker: '',
					icon: {
						url: url,
						size: new google.maps.Size(50, 50),
						anchor: new google.maps.Point(6, 6)
					},
					map: map
				});

				oms.addMarker(marker);
				markers.push(marker);
				this.attachMarkerListener(marker, rec);
			}, this);
			coolerMap.setTitle(coolerMap.initialConfig.title + " - " + records.length + "/" + responseData.recordCount);
			coolerMap.addMarkers(markers);
			map.setCenter(new google.maps.LatLng(markers[0].lat, markers[0].lng));
			/*Changes done as per http://jsfiddle.net/apougher/RsyPD/ link*/
			if (!this.markerCluster) {
				var markerCluster = new MarkerClusterer(map, markers, {
					zoomOnClick: true,
					maxZoom: 12,
					averageCenter: true,
					imagePath: 'images/map/m'
				});

				this.markerCluster = markerCluster;

			}
			else {
				this.markerCluster.addMarkers(markers);
			}

		}
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
			dataViewStore.insert(i, new Ext.data.Record({ 'AssetPurityId': record.get('AssetPurityId'), 'PurityDateTime': record.get('PurityDateTime'), 'ImageName': record.get('ImageName'), 'ImageCount': record.get('ImageCount') }, record.get('AssetPurityId')));
			if (this.purityImageWin && (imageCount === Cooler.Enums.LoadPurityImage.WindowCount)) {
				this.purityImageWin.setTitle(record.get('AssetPurityId'));
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
		this.showPurityWindow(dataView, index, node);
		for (var i = 0; i < nodes.length; i++) {
			var classList = nodes[i].classList;
			if (classList.contains('selectedCarouselDiv')) {
				classList.remove('selectedCarouselDiv');
				break;
			}
		}
		dataView.getNodes()[index].classList.add('selectedCarouselDiv');
	},

	applyDateFilter: function (grid, startValue, endValue) {
		grid.gridFilter.clearFilters();
		var topToolbar = grid.getTopToolbar().items;
		var startDateField;
		var endDateField;
		if (topToolbar) {
			startDateField = topToolbar.get('startDateField');
			endDateField = topToolbar.get('endDateField');
			if (startDateField && endDateField) {
				var me = {};
				me.grid = grid;
				me.startDateField = startDateField;
				me.endDateField = endDateField;
				var isValidDate = Cooler.DateRangeFilter(me, 'EventTime', false);
				if (isValidDate) {
					grid.getStore().load();
				}
			}
		}
		else {
			if (!Ext.isEmpty(startValue)) {
				startDateField = grid.gridFilter.getFilter('EventTime');
				startDateField.active = true;
			}
			var value = { before: startValue };
			startDateField.setValue(value);
			startDateField.dates.before.setChecked(true);

			endDateField = { after: endValue };
			startDateField.setValue(endDateField);
			startDateField.dates.before.setChecked(true);
		}
	},
	onChildGridTabChange: function (tabPanel, panel) {
		if (panel.title == 'Purity Images') {
			var store = this.coolerImages.getStore();
			if (store != undefined) {
				store.load();
			}
		}
		else {
			var store = panel.getStore();
			var grid = panel.gridFilter.grid;
			if (grid.title == 'Notes' || grid.title == 'Document' || grid.title == 'Purities' || grid.title == 'Visit History' || grid.title == 'Debug Logs' || grid === this.rawLogsGrid) {
				if (store.url) {
					panel.loadFirst();
				}
			}
			var topToolBar = grid.getTopToolbar();
			if (grid.gridFilter.getFilter('EventTime')) {
				this.applyDateFilter(grid, Cooler.DateOptions.AddDays(new Date(), 1), Cooler.DateOptions.AddDays(new Date(), -7));
				this.removePazeSizeLimit(grid, store);
				store.load();
			}
		}
	},
	configureListTab: function (config) {
		var grid = this.grid;
		Ext.apply(this.grid, {
			region: 'center'
		});

		grid.on({
			render: Cooler.attachStockMouseOver
		});

		this.notesObj = new DA.Note();
		this.notesGrid = this.notesObj.createGrid({ disabled: true });//enable on select record from asset grid
		this.attachmentObj = new DA.Attachment();
		this.attachmentGrid = this.attachmentObj.createGrid({ title: 'Document', disabled: true });
		this.assetVisitHistoryGrid = Cooler.AssetVisitHistory.createGrid({ title: 'Visit History', id: 'defaultTab', allowPaging: true, editable: true, tbar: [], showDefaultButtons: true, disabled: true });
		this.smartDeviceMovementGrid = Cooler.SmartDeviceAssetMovement.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceDoorStatusGrid = Cooler.SmartDeviceAssetDoorStatus.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceHealthGrid = Cooler.SmartDeviceAssetHealth.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDevicePing = Cooler.SmartDeviceAssetPing.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDevicePowerConsumptionGrid = Cooler.SmartDeviceAssetPowerConsumption.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.alertGrid = Cooler.AssetAlert.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.assetStockGrid = Cooler.AssetStock.createGrid({ title: 'Asset Stock', allowPaging: false, editable: true, disabled: true }, true);
		this.smartDeviceCellLocation = Cooler.SmartDeviceAssetCellLocation.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDevicePowerEvent = Cooler.SmartDeviceAssetPowerEvent.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.SmartDeviceWifiLocation = Cooler.SmartDeviceWifiLocationForAsset.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceStockSensorData = Cooler.SmartDeviceStockSensorDataReadOnly2.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		Cooler.AssetVisitHistory.on('beforeQuickSave', function (options) {
			var record = Cooler.Asset.grid.getSelectionModel().getSelected();
			if (record) {
				var assetId = record.get('AssetId');
				var grid = this.assetVisitHistoryGrid;
				var store = grid.getStore();
				var isValid = true;
				store.each(function (record) {
					if (Ext.isEmpty(record.get("VisitDateTime"))) {
						Ext.Msg.alert('Alert', "Please provide valid visit date time.");
						isValid = false;
					}
					if (record.dirty) {
						record.set("AssetId", assetId);
					}
				});
			}
			return isValid;
		}, this);

		var coolerImages = Cooler.CoolerImageForAsset.createGrid({ title: 'Purities', allowPaging: true, editable: false, tbar: [], showDefaultButtons: true, disabled: true });
		var addButton = new Ext.Button({ text: 'Add', itemId: 'addAsset', handler: this.addLinkedAsset, iconCls: 'add', scope: this });
		var linkedAssets = Cooler.LinkedAssets.createGrid({ title: 'Linked Assets', allowPaging: true, editable: false, tbar: [], showDefaultButtons: true, disabled: true });
		linkedAssets.getTopToolbar().splice(1, 0, addButton);
		this.coolerImages = coolerImages;
		this.linkedAssets = linkedAssets;
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

		var imageDataViewTpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div>{[this.renderImage(values)]}</div>',
			'</tpl>', {
				renderImage: function (values) {
					var imageName = values.ImageName;
					var imageCount = values.ImageCount;
					var assetPurityId = values.AssetPurityId;
					var purityDateTime = values.PurityDateTime;
					var carouselImage = '';
					if (imageCount > 1) {
						for (var i = 1; i <= imageCount; i++) {
							var carouselImageName = imageName.replace('.jpg', '_' + i + '.jpg');
							carouselImage += '<div class="carouselDiv" assetPurityId="' + assetPurityId + '" >' +
								'<img class="purityImage" src="./thumbnail.ashx?imagePath=processed/' + purityDateTime.format(Cooler.Enums.DateFormat.PurityDate) + '/' + carouselImageName + '&isStockimages=true&v=' + new Date().getTime() + '"></img>' + '<br>' +
								'<b>Asset Purity Id: </b>' + assetPurityId + '<br>' +
								'<b>Purity Date Time: </b>' + ExtHelper.renderer.DateTime(purityDateTime) +
								'</div>';
						}
					}
					else {
						carouselImage += '<div class="carouselDiv" assetPurityId="' + assetPurityId + '" >' +
							'<img class="purityImage" src="./thumbnail.ashx?imagePath=processed/' + purityDateTime.format(Cooler.Enums.DateFormat.PurityDate) + '/' + imageName + '&isStockimages=true&v=' + new Date().getTime() + '"></img>' + '<br>' +
							'<b>Asset Purity Id: </b>' + assetPurityId + '<br>' +
							'<b>Purity Date Time: </b>' + ExtHelper.renderer.DateTime(purityDateTime) +
							'</div>';
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
			title: 'Purity Images',
			region: 'south',
			layout: 'fit',
			autoScroll: true,
			tbar: [btnPreviousButton, '|', btnNextButton],
			disabled: true,
			items: imageDataView
		});
		this.imageCarouselPanel = imageCarouselPanel;
		var items = [
			this.assetVisitHistoryGrid,
			this.smartDeviceHealthGrid,
			this.smartDeviceDoorStatusGrid,
			this.smartDeviceMovementGrid,
			//this.smartDevicePowerConsumptionGrid,
			//this.assetStockGrid,
			//linkedAssets,
			this.notesGrid,
			this.attachmentGrid,
			this.alertGrid,
			this.smartDevicePing,
			this.smartDeviceStockSensorData,
			this.smartDeviceCellLocation,
			this.smartDevicePowerEvent,
			this.SmartDeviceWifiLocation
		];

		if (DA.Security.HasPermission('RawLogs')) {
			this.rawLogsGrid = Cooler.RawLogs.createGrid({ disabled: true, isChildGrid: true }, true);
			this.debugLogsGrid = Cooler.LogDebugger.createGrid({ disabled: true, isChildGrid: true }, true);
			//this.dataSummaryGrid = Cooler.DataSummaryAsset.createGrid({ disabled: true }, '', '', { isChildGrid: true });
			items.push(this.rawLogsGrid);
			items.push(this.debugLogsGrid);
			//items.push(this.dataSummaryGrid);
		}
		items.push(coolerImages);
		items.push(imageCarouselPanel);
		var south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			id: 'assetChildTab',
			items: items,
			height: 200,
			split: true,
			enableTabScroll: true,
			listeners: {
				tabchange: this.onChildGridTabChange,
				scope: this
			}
		});

		var coolerDetailsPanel = new Ext.Panel({
			title: 'Cooler Info',
			region: 'east',
			width: 300,
			split: true
		});

		this.coolerDetailsPanel = coolerDetailsPanel;

		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [this.grid, coolerDetailsPanel, south]
		});

		return config;
	}
});

Cooler.Asset = new Cooler.AssetForm({ uniqueId: 'Asset' });
Cooler.OutletAsset = new Cooler.AssetForm({ uniqueId: 'OutletAsset' });
Cooler.AssetSummaryGrid = new Cooler.AssetForm({ uniqueId: 'AssetSummary' });
