Cooler.SmartDevice = new Cooler.Form({
	title: 'Smart Device',
	keyColumn: 'SmartDeviceId',
	captionColumn: 'SerialNumber',
	controller: 'SmartDevice',
	securityModule: 'SmartDevice',
	editable: true,
	openForm: true,// if we use openForm in editable grid then it open form rather then adding a new row 
	winConfig: {
		width: 700,
		height: 330,
		layout: 'border',
		defaults: { border: false }
	},
	comboTypes: ['SmartDeviceTypeCommand', 'SmartDeviceTag', 'AlertRecipientType', 'SmartDeviceStatus', 'Client', 'SmartDeviceTypeCommandUnique', 'TimeZone', 'SmartDeviceType', 'AssetType', 'Country', 'ShippedCountry'],
	gridConfig: {
		multiLineToolbar: true,
		sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
		custom: {
			loadComboTypes: true,
			quickSearch: {
				addColumns: false,
				width: 150,
				indexes: [
					{ text: 'Serial Number', dataIndex: 'SerialNumber' }
				]
			}
		}
	},

	afterShowList: function (config) {
		config.tab.on('activate', this.onTabActivate, this);
	},
	onTabActivate: function (tab) {
		if (this.grid) {
			this.grid.store.load();
		}
	},
	gridPlugins: [new DA.form.plugins.Inline({
		modifiedRowOptions: {
			fields: 'modified'
		}
	})],
	onGridCreated: function (grid) {
		grid.on("cellclick", this.cellclick, this);
		grid.store.on('load', this.loadStore, this);
		grid.on('validateedit', this.onBeforeValidateEdit, this);
		this.on('afterQuickSave', this.onAfterQuickSave);
		grid.on("rowdblclick", this.doubleClick, this);
	},
	standByModeChanged: false,
	takePictureChanged: false,
	currentTimeChanged: false,
	lastReadIndexChanged: false,
	advertisementFrequencyChanged: false,
	heartBeatIntervalChanged: false,
	beaconFrameChanged: false,
	iBeaconUUIDChanged: false,
	iBeaconMajorMinorChanged: false,
	iBeaconPowerSettingsChanged: false,
	eddyStoneUUIDChanged: false,
	eddyStonePowerSettingsChanged: false,
	eddyStoneUrlChanged: false,
	eddyStoneUrlPowerSettingsChanged: false,
	tlmPowerSettingsChanged: false,
	deviceThreshholdsChanged: false,
	camera1SettingsChanged: false,
	camera2SettingsChanged: false,
	visionConfigChanged: false,
	configurationMessage: '',
	onAfterQuickSave: function () {
		this.grid.getStore().load();
	},
	onBeforeValidateEdit: function (e) {
		var field = e.field,
			record = e.record,
			value = e.value,
			clientStore = this.comboStores.Client,
			assetStore = this.comboStores.Asset,
			index, data;

		if (field == 'ClientId') {
			index = clientStore.findExact('LookupId', value);
			if (index != -1) {
				data = clientStore.getAt(index);
				record.set('TimeZoneId', data.get('CustomValue'));
			}
		}
		if (field == "LinkedAssetId") {
			index = assetStore.findExact('LookupId', value);
			if (index != -1) {
				data = assetStore.getAt(index);
				record.set('TimeZoneId', data.get('CustomStringValue'));
			}
		}
	},
	loadStore: function () {
		var selectedRecord = this.grid.getSelectionModel().getSelected();
		if (!selectedRecord) {
			if (this.grids) {
				var gridlength = this.grids.length, grid;
				for (var i = 0; i < gridlength; i++) {
					grid = this.grids[i];
					grid.setDisabled(true);
				}
			}
			if (this.propertyGrid) {
				this.propertyGrid.setDisabled(true);
			}
		}
	},
	cellclick: function (grid, rowIndex, e) {
		Ext.getCmp('smartDeviceChildTab').setActiveTab('activeHealth');
		var row = grid.getStore().getAt(rowIndex);
		var smartDeviceId = row.get('SmartDeviceId');
		var smartDeviceTypeId = row.get('SmartDeviceTypeId');
		var isGateway = row.get('IsGateway');
		var isImberaDevice = row.get("Reference") === "CD" || row.get("Reference") === "CMD" ? true : false;
		var isWellingtonDevice = row.get("Reference") === "SW" ? true : false;
		var isImberaHub = row.get("SmartDeviceType") === "Imbera Hub" ? true : false;
		var isPJBTDevice = row.get("SmartDeviceType") === "PJ BT" ? true : false;
		this.isImberaHub = isImberaHub;
		if (this.smartDeviceId && this.smartDeviceId === smartDeviceId) {
			return false;
		}
		var smartDeviceType = row.get('SmartDeviceTypeId');
		this.smartDeviceId = smartDeviceId;
		var attributesData = row.get('Attributes');
		if (!this.grids) {
			var grids = [];
			grids.push(this.smartDeviceHealthGrid);
			grids.push(this.smartDeviceMovementGrid);
			grids.push(this.smartDeviceDoorStatusGrid);
			grids.push(this.smartDeviceCommandGrid);
			grids.push(this.smartDevicePing);
			//grids.push(this.smartDeviceLog);
			grids.push(this.smartDeviceCellLocation);
			grids.push(this.smartDevicePowerEvent);
			grids.push(this.notesGrid);
			grids.push(this.attachmentGrid);
			grids.push(this.SmartDeviceAdvertiseEvent);
			grids.push(this.smartDeviceDiagnosticMessage);
			grids.push(this.smartDeviceStockSensorData);
			grids.push(this.smartDeviceAlarmRecordType);
			grids.push(this.smartDeviceEventTypeRecord);
			grids.push(this.smartDeviceEventAlarmError);
			grids.push(this.SmartDeviceWifiLocation);
			grids.push(this.smartDeviceFirmwareVersionHistory);
			if (DA.Security.HasPermission('RawLogs')) {
				grids.push(this.rawLogsGrid);
				grids.push(this.debugLogsGrid);
			}
			this.grids = grids;
		}
		var gridLength = this.grids.length, currentGrid;
		for (var i = 0; i < gridLength; i++) {
			currentGrid = this.grids[i];
			if (currentGrid) {
				var store;
				var keyColumn = isGateway ? "SmartDeviceId" : this.keyColumn;
				if (!currentGrid.initialConfig.root) {
					store = currentGrid.store;
					store.baseParams.GatewayId = null;
					store.baseParams.SmartDeviceId = null;
					currentGrid.parentColumn = keyColumn;
				}

				if (currentGrid === this.rawLogsGrid) {
					store.baseParams.Gateway = row.get('MacAddress') || "00:00:00:00:00:00";
				}
				else {
					if (currentGrid == this.SmartDeviceAdvertiseEvent) {
						store.baseParams.ImberaHubId = smartDeviceId;
					}
					else {
						if (keyColumn == "GatewayId") {
							store.baseParams.GatewayId = smartDeviceId;
						}
						else {
							store.baseParams.SmartDeviceId = smartDeviceId;

						}
					}
				}

				if (currentGrid === this.smartDeviceCommandGrid) {
					var coolerIotClientId = row.get('ClientId') ? row.get('ClientId') : DA.Security.info.Tags.ClientId;
					store.baseParams.CoolerIotClientId = coolerIotClientId;
					store.baseParams.AssetId = row.get('LinkedAssetId');
					store.baseParams.SmartDeviceTypeId = smartDeviceTypeId;
				}
				if (currentGrid === this.notesGrid || currentGrid === this.attachmentGrid) {
					this.notesObj.SetAssociationInfo("SmartDevice", smartDeviceId);
					this.attachmentObj.SetAssociationInfo("SmartDevice", smartDeviceId);
				}
				if (currentGrid === this.assetInstallationHistory) {
					this.assetInstallationHistory.SetAssociationInfo("SmartDeviceId", smartDeviceId);
				}
				currentGrid.setDisabled(smartDeviceId == 0);
				if (currentGrid === this.smartDeviceHealthGrid) {
					if (currentGrid.gridFilter.getFilter('EventTime')) {

						var topToolbar = currentGrid.getTopToolbar().items;
						var startDateField;
						var endDateField;
						if (topToolbar) {
							startDateField = topToolbar.get('startDateField');
							endDateField = topToolbar.get('endDateField');
							if (startDateField && endDateField) {
								var me = {};
								me.grid = currentGrid;
								me.startDateField = startDateField;
								me.endDateField = endDateField;
								var isValidDate = Cooler.DateRangeFilter(me, 'EventTime', false);
							}
							else {
								if (!Ext.isEmpty(startValue)) {
									startDateField = currentGrid.gridFilter.getFilter('EventTime');
									startDateField.active = true;
								}
								var value = { before: startValue };
								startDateField.setValue(value);
								startDateField.dates.before.setChecked(true);

								endDateField = { after: endValue };
								startDateField.setValue(endDateField);
								startDateField.dates.before.setChecked(true);
							}
						}
						if (currentGrid.getBottomToolbar()) {
							delete store.baseParams['limit'];
						}

						//Cooler.Asset.applyDateFilter(currentGrid, Cooler.DateOptions.AddDays(new Date(), 1), Cooler.DateOptions.AddDays(new Date(), -7));
						//Cooler.Asset.removePazeSizeLimit(currentGrid, store);
						store.load();
					}
				}
				Cooler.Asset.removePazeSizeLimit(currentGrid, store);

			}
		}

		var column = this.cm.config[e];
		var store = grid.getStore();

		var attributes = Ext.decode(attributesData || "{}");
		var attr = [];
		for (var key in attributes) {
			attr.push({ Attribute: key, Value: attributes[key] });
		}

		this.configurationPanel.setDisabled(false);
		this.SmartDeviceAdvertiseEvent.setDisabled(true);
		this.setConfiguration();

		var rec = store.getAt(rowIndex);
		if (column.dataIndex == 'ClientId' && rec.get('ClientId') > 0 && !rec.isModified('ClientId')) {
			return false;
		}
		if (column.editor && rec.get(column.dataIndex) == 0) {
			rec.set(column.dataIndex, '');
		}
		this.smartDeviceCellLocation.setDisabled(!isGateway);
		this.SmartDeviceWifiLocation.setDisabled(!isGateway);
		this.smartDeviceAlarmRecordType.setDisabled(!isImberaDevice);
		var statusofEventAlaramTab = isImberaDevice == !true || isWellingtonDevice == !true ? false : true;
		var statusofMachineActivities = isImberaDevice == true || isPJBTDevice == true ? false : true;
		this.smartDeviceEventTypeRecord.setDisabled(statusofMachineActivities);
		this.smartDeviceEventAlarmError.setDisabled(statusofEventAlaramTab);

		if (smartDeviceTypeId == Cooler.Enums.SmartDeviceType.StockSensor) {
			this.smartDeviceStockSensorData.setDisabled(false);
		}
		else {
			this.smartDeviceStockSensorData.setDisabled(true);
		}

		if (smartDeviceTypeId == Cooler.Enums.SmartDeviceType.StockSensorIR) {
			this.smartDeviceStockSensorData.setDisabled(false);
		}

		if (this.smartDeviceId && this.smartDeviceId === smartDeviceId) {
			this.SmartDeviceAdvertiseEvent.setDisabled(false);
		}
		//this.smartdeviceadvertiseevent.setdisabled(!isimberahub)
		this.SmartDeviceAdvertiseEvent.setDisabled(!isImberaHub)
		if (this.rawLogsGrid) {
			this.rawLogsGrid.setDisabled(!isGateway);
		}
		if (this.debugLogsGrid) {
			this.debugLogsGrid.setDisabled(!isGateway);
		}
		if (DA.Security.info.Tags.ClientId > 0) {
			//this.smartDeviceLog.setDisabled(true);
			this.configurationPanel.setDisabled(true);
		}
		else {
			//this.smartDeviceLog.setDisabled(false);
			this.configurationPanel.setDisabled(false);
		}
	},
	doubleClick: function (grid, rowIndex, e) {
		delete this.assetCombo.baseParams.scopeId;
		var row = grid.getStore().getAt(rowIndex);
		var smartDeviceLocationId = row.get('LocationId');
		if (smartDeviceLocationId != 0) {
			this.assetCombo.baseParams.scopeId = smartDeviceLocationId;
			this.assetCombo.getStore().load();
		}
	},

	comboStores: {
		SmartDeviceTag: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AlertRecipientType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceStatus: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Asset: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		TimeZone: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		ShippedCountry: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceTypeCommand: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var tagField = new Ext.ux.form.LovCombo({
			valueField: 'LookupId',
			displayField: 'DisplayValue',
			store: Cooler.SmartDevice.comboStores.SmartDeviceTag,
			mode: 'local',
			width: 250,
			allowBlank: true
		});
		var optionField = DA.combo.create({ store: Cooler.SmartDevice.comboStores.AlertRecipientType, width: 100, mode: 'local' });
		this.tagField = tagField;
		this.optionField = optionField;
		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.grid.baseParams.tagValues = this.tagField.getRawValue();
				this.grid.baseParams.option = this.optionField.getValue();
				this.grid.loadFirst();
			}, scope: this
		});
		var filterFields = ['SmartSerialNumber'];
		this.filterFields = filterFields;
		this.smartSerialTextField = new Ext.form.TextField({ width: 100 });
		this.smartsearchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.resetGridStore();
				if (!Ext.isEmpty(this.smartSerialTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { SmartSerialNumber: this.smartSerialTextField.getValue() });
				} this.grid.loadFirst();
			}, scope: this
		});
		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: function () {
				this.resetGridStore();
				this.smartSerialTextField.reset();
				this.grid.loadFirst();
			}, scope: this
		});
		var mapButton = new Ext.Button({ text: 'Movement Map', handler: this.loadMap, scope: this, iconCls: 'locationIcon' });
		tbarItems.push(mapButton);
		tbarItems.push('|');
		tbarItems.push('Tag:');
		tbarItems.push(tagField);
		tbarItems.push('Serial#');
		tbarItems.push(this.smartSerialTextField);
		tbarItems.push(this.smartsearchButton);
		tbarItems.push(this.removeSearchButton);
		tbarItems.push('Contains:');
		tbarItems.push(optionField);
		tbarItems.push(this.searchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	resetGridStore: function () {
		var stroeBaseParams = this.grid.getStore().baseParams, filterFieldsLength = this.filterFields.length, filterField;
		for (var i = 0; i < filterFieldsLength; i++) {
			filterField = this.filterFields[i];
			delete stroeBaseParams[filterField];
		}
	},
	getMarkerTitle: function (data) {
		var title = "";
		if (this.assetSerialNumber != "" || this.assetSerialNumber != undefined) {
			title += Ext.isEmpty(data.SerialNumber) ? ' Cooler: N/A' : ' Cooler: ' + data.SerialNumber;
		}
		title += '\n Latitude: ' + data.Latitude + ', Longitude: ' + data.Longitude;
		if (data.EventTime) {
			var dateTime = Cooler.Asset.formatDate(data.EventTime);
			title += '\n Date Time: ' + dateTime.format(ExtHelper.DateTimeFormat);
		}
		return title;
	},
	mapDirection: function (request, data, mapObject, duplicate) {
		outer.duplicate = duplicate;
		if (request) {

			// marker update start from here
			if (data) {
				outer.infoWindow = new google.maps.InfoWindow({ maxWidth: 350 });

				var attachListener = function (marker) {
					//outer.content = content;
					var title;
					google.maps.event.addListener(marker, 'click', function () {
						//Hide existing markers
						new google.maps.event.trigger(outer.map.map, 'click');
						title = marker.title;
						title = title.replace('Address:', '<b>Address</b>:');
						title = title.replace('Cooler:', '<br/><b>Cooler</b>:');
						title = title.replace('Latitude:', '<br/><b>Latitude</b>:');
						title = title.replace('Longitude:', '<b>Longitude</b>:');
						title = title.replace('Date Time:', '<br /><b>Date Time</b>:');
						outer.infoWindow.setContent(title);
						outer.infoWindow.open(outer.map.map, marker);
					});
				}
				outer.data = data;
			}
			// marker update end from here

			var rendererOptions = { map: mapObject.getMap(), suppressMarkers: true };
			directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
			outer.directionsDisplay = directionsDisplay;
			var directionsService = new google.maps.DirectionsService();
			directionsService.route(request, function (response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					// Display the route on the map.
					directionsDisplay.setDirections(response);
					Cooler.SmartDevice.markers = [];
					//http://googlemaps.googlermania.com/google_maps_api_v3/en/map_example_direction_customicon.html
					//First leg is ORIGIN and last leg is DESTINATION

					// marker update start from here
					if (outer.data) {
						var legs = response.routes[0].legs,
							lat, lng, address, start, content, end, marker;

						outer.map = this.directionsDisplay;

						var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
							labelIndex = 0,
							startEndUrl = "images/icons/start_end.png",
							waypointUrl = "images/icons/point.png";
						for (var index = 0, len = legs.length; index < len; index++) {
							lat = legs[index]['start_location'].lat(),
								lng = legs[index]['start_location'].lng(),
								address = legs[index]['start_address'],
								start = new google.maps.LatLng(lat, lng),
								content = 'Address: ' + address + ' \n' + outer.data[index].title;
							marker = new google.maps.Marker({
								position: start,
								title: content,
								label: labels[labelIndex++ % labels.length],
								map: this.directionsDisplay.map,
								icon: {
									url: index == 0 ? startEndUrl : waypointUrl,
									origin: new google.maps.Point(0, 0)
								}

							});

							attachListener(marker);
							Cooler.SmartDevice.markers.push(marker);
						}
						if (!outer.duplicate) {
							//For last position / marker
							index--;
							lat = legs[index]['end_location'].lat(),
								lng = legs[index]['end_location'].lng(),
								address = legs[index]['end_address'],
								end = new google.maps.LatLng(lat, lng),
								content = 'Address: ' + address + ', \n' + outer.data[index + 1].title,
								marker = new google.maps.Marker({
									position: end,
									title: content,
									label: labels[labelIndex++ % labels.length],
									map: this.directionsDisplay.map,
									icon: {
										url: startEndUrl,
										origin: new google.maps.Point(0, 0)
									}
								});
							attachListener(marker);
							Cooler.SmartDevice.markers.push(marker);
						}
					}
					// marker update end from here
				}
			}, this);
		}
	},
	loadMap: function (button, event, onMarkerClick, assetInfo) {
		outer = this; //To Do: need to remove this global variable
		if (!onMarkerClick) {
			var selectedRecord = this.grid.getSelectionModel().getSelected();
			if (selectedRecord == undefined) {
				Ext.Msg.alert('Alert', 'Please select one row.');
				return;
			}
			var selectedRowData = selectedRecord.data;
			var smartDeviceId = assetId = 0;
			var assetSerialNumber = "";
			switch (this.title) {
				case 'Asset':
					assetId = selectedRowData.AssetId;
					assetSerialNumber = selectedRowData.SerialNumber;
					this.AssetLatitude = selectedRowData.Latitude;
					this.AssetLongitude = selectedRowData.Longitude;
					this.assetSerialNumber = assetSerialNumber;
					this.isComingFromAsset = true;
					break;
				case 'Smart Device':
					assetSerialNumber = selectedRowData.Asset;
					smartDeviceId = selectedRowData.SmartDeviceId;
					this.isComingFromAsset = false;
					break;
			}
			this.assetId = assetId;
			this.smartDeviceId = smartDeviceId;

		}
		else {
			this.assetId = assetInfo.assetId;
			this.smartDeviceId = 0;
			this.AssetLatitude = assetInfo.latitude;
			this.isComingFromAsset = true;
			this.AssetLongitude = assetInfo.longitude;
		}
		if (!this.trackpointMap) {
			var trackpointMap = new Ext.ux.GMapPanel({
				zoomLevel: 10,
				gmapType: 'map',
				mapConfOpts: ['enableScrollWheelZoom', 'enableDoubleClickZoom', 'enableDragging'],
				mapControls: ['GSmallMapControl', 'GMapTypeControl'],
				setCenter: {
					lat: 42.339641,
					lng: -71.094224
				}
			});
			this.trackpointMap = trackpointMap;
		}
		this.trackpointMap.clearMarkers();
		if (this.infoWindow) {
			this.infoWindow.close();
		}
		if (this.directionsDisplay || outer.directionsDisplay) {
			Cooler.SmartDevice.clearDirectionDisplay(this.directionsDisplay ? this.directionsDisplay : outer.directionsDisplay);
		}
		if (!this.mapWin) {
			var searchButton = new Ext.Button({ text: 'Get Map', iconCls: 'locationIcon', handler: Cooler.SmartDevice.loadMovementMap, scope: this });
			this.searchButton = searchButton;
			var smartDeviceLocationType = [
				[Cooler.Enums.SmartDeviceLocationType.GPS, 'GPS'],
				[Cooler.Enums.SmartDeviceLocationType.CellLocation, 'Cell Location']
			];
			var startDateField = new Ext.ux.form.DateTime({ name: 'Start Time', value: new Date().add(Date.MONTH, -3).clearTime(), width: 200 });
			var endDateField = new Ext.ux.form.DateTime({ name: 'End Time', value: new Date(), width: 200 });
			var locationType = DA.combo.create({ store: smartDeviceLocationType, width: 100, mode: 'local', allowBlank: false, value: Cooler.Enums.SmartDeviceLocationType.GPS });
			var mapTypeStore = [[1, 'Road'], [2, 'Line']];
			var getMapType = DA.combo.create({ fieldLabel: 'Map Type ', value: 1, name: 'mapPath', hiddenName: 'mapPath', store: mapTypeStore, width: 80 });
			this.getMapType = getMapType;
			this.startDateField = startDateField;
			this.endDateField = endDateField;
			this.locationType = locationType;
			if (this.isImberaHub) {
				this.locationType.setDisabled(true);
			} else {
				this.locationType.setDisabled(true);
			}
			var mapWin = new Ext.Window({
				layout: 'fit',
				title: 'GPS Movement Location',
				closeAction: 'hide',
				modal: true,
				maximizable: true,
				listeners: { maximize: Cooler.SmartDevice.loadMovementMap, scope: this, restore: Cooler.SmartDevice.loadMovementMap, resize: Cooler.SmartDevice.loadMovementMap },
				tbar: ['Start Time:',
					startDateField,
					'End Time:',
					endDateField,
					this.locationType,
					'Map Type:',
					this.getMapType,
					searchButton
				],
				width: 850,
				height: 600,
				items: [trackpointMap]
			});
			this.mapWin = mapWin
		}
		else {
			this.startDateField.setValue(new Date().add(Date.MONTH, -3).clearTime());
			this.endDateField.setValue(new Date());
		}
		this.mapWin.show();
		this.searchButton.handler.call(this.searchButton.scope, this.searchButton);
	},

	/*https://msdn.microsoft.com/en-us/library/aa578799.aspx*/
	validateLatLog: function (latitude, longitude) {
		return latitude >= -Cooler.Enums.ValidLatLong.Latitude && latitude <= Cooler.Enums.ValidLatLong.Latitude && longitude >= -Cooler.Enums.ValidLatLong.Longitude && longitude <= Cooler.Enums.ValidLatLong.Longitude;
	},

	loadMovementMap: function () {
		if (this.isComingFromAsset && this.AssetLatitude == 0 && this.AssetLongitude == 0) {
			Ext.Msg.alert('Alert', 'Linked asset not having Installation Lat/Long.');
			return false;
		}
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		var locationType = this.locationType.getValue();
		if (locationType == '') {
			Ext.Msg.alert('Alert', 'Please select one Location Type.');
			return;
		}
		var startDate = this.startDateField.getValue();
		var endDate = this.endDateField.getValue();

		if (this.directionsDisplay) {
			Cooler.SmartDevice.clearDirectionDisplay(this.directionsDisplay);
		}
		var tagValues = DA.Security.info.Tags;

		var time = this.endDateField.getValue();
		var startTime = this.startDateField.getValue();
		var currentDateTime = new Date();
		var diff = time.getTime() - currentDateTime.getTime();
		diff = Math.floor((diff / 1000) / 60);
		if (diff > 0) {
			Ext.Msg.alert("Info", "Selected time can not greater than current Time");
			this.mask.hide();
			return;
		}
		var diffForStartTime = startTime.getTime() - currentDateTime.getTime();
		diffForStartTime = Math.floor((diffForStartTime / 1000) / 60);
		if (diffForStartTime > 0) {
			Ext.Msg.alert("Info", "Selected time can not greater than current Time");
			this.mask.hide();
			return;
		}
		if (time.getTime() < startTime.getTime()) {
			Ext.Msg.alert("Info", "Selected time can not less than end time");
			this.mask.hide();
			return;
		}
		Ext.Ajax.request({
			url: 'Controllers/SmartDevice.ashx',
			params: { smartDeviceId: this.smartDeviceId, action: 'getMovementGPS', StartTime: startDate, EndTime: endDate, LocationType: locationType, assetId: this.assetId, minMovementDisplacement: tagValues.MinMovementDisplacement, minMovementDisplacementSecond: tagValues.MinMovementDisplacementSecond, assetLatitude: this.AssetLatitude, assetLongitude: this.AssetLongitude, isComingFromAsset: this.isComingFromAsset, clientId: DA.Security.info.Tags.ClientId, isImberaHub: this.isImberaHub },
			success: Cooler.SmartDevice.onMovementDataSuccess,
			failure: function (result, request) {
				alert(JSON.parse(result.responseText));
			},
			scope: this
		});
	},

	clearDirectionDisplay: function (directionsDisplay) {
		//Clearing old DIRECTIONS MARKER, Needs to be fixed correctly, right now only VISIBLE : FALSE
		//Referred: https://code.google.com/p/gmaps-api-issues/issues/detail?id=2506
		directionsDisplay.setMap(null);
		directionsDisplay = null;
		if (Cooler.SmartDevice.markers) {
			for (var i = 0; len = Cooler.SmartDevice.markers.length, i < len; i++) {
				Cooler.SmartDevice.markers[i].setVisible(false);
			}
		}
	},
	onMovementDataSuccess: function (result, request) {
		this.mask.hide();
		this.trackpointMap.clearMarkers();
		if (this.infoWindow) {
			this.infoWindow.close();
		}
		this.trackpointMap.clearDirection();
		var response = Ext.decode(result.responseText),
			data = response.data,
			markers = [],
			origin,
			destination,
			wayPoints = [],
			wayPointsInfo = [],
			isDistibution,
			distibutionDiff,
			validData = [];
		data.forEach(function (record) {
			if (Cooler.SmartDevice.validateLatLog(record.Latitude, record.Longitude)) {
				validData.push(record);
			}
		}, this);
		markers.push({
			lat: this.AssetLatitude, lng: this.AssetLongitude, marker: {
				title: "Install Position",
				icon: {
					// use whatever icon you want for the "dots"
					url: "images/icons/outlet.png",
					size: new google.maps.Size(32, 32),
					anchor: new google.maps.Point(6, 6)
				}
			}
		});
		var dataLen = validData.length;
		if (dataLen > 0) {
			if (!google) {
				Ext.Msg.alert('Alert', 'Map not loaded correctly.');
				return false;
			}
			/*if movement count is greater then 10 then we assign a flag to handle it*/
			if (dataLen > 21) {
				isDistibution = true;
				distibutionDiff = Math.round((dataLen - 2) / 23);
			}

			for (var i = 0; i < dataLen; i++) {
				if (i == 0) {
					markers.push({
						lat: validData[i].Latitude, lng: validData[i].Longitude, marker: {
							title: Cooler.SmartDevice.getMarkerTitle(validData[i]),
							icon: {
								// use whatever icon you want for the "dots"
								url: "images/icons/measle_blue.png",
								size: new google.maps.Size(10, 10),
								anchor: new google.maps.Point(6, 6)
							}
						}
					});
					wayPointsInfo.push({ location: new google.maps.LatLng(validData[i].Latitude, validData[i].Longitude), title: Cooler.SmartDevice.getMarkerTitle(data[i]) });
					origin = new google.maps.LatLng(validData[i].Latitude, validData[i].Longitude);
					var setMapCenter = function () {
						if (this.trackpointMap.getMap()) {
							this.trackpointMap.getMap().setCenter(origin);
						}
					}
					// executes after 200 mili seconds:
					setMapCenter.defer(200, this);
				} else if (i == dataLen - 1) {
					markers.push({
						lat: validData[i].Latitude, lng: validData[i].Longitude, marker: {
							title: Cooler.SmartDevice.getMarkerTitle(validData[i]),
							icon: {
								// use whatever icon you want for the "dots"
								url: "images/icons/measle_blue.png",
								size: new google.maps.Size(10, 10),
								anchor: new google.maps.Point(6, 6)
							}
						}
					});
					destination = new google.maps.LatLng(validData[i].Latitude, validData[i].Longitude);
					wayPointsInfo.push({ location: new google.maps.LatLng(validData[i].Latitude, validData[i].Longitude), title: Cooler.SmartDevice.getMarkerTitle(data[i]) });
				} else {
					if (isDistibution) {
						/*Here if any case waypoint comes more then 8 then we dont ploat that on map*/
						if (i % distibutionDiff == 0 && wayPoints.length < 23) {
							wayPoints.push({
								location: new google.maps.LatLng(validData[i].Latitude, validData[i].Longitude)
							});
							wayPointsInfo.push({ location: new google.maps.LatLng(validData[i].Latitude, validData[i].Longitude), title: Cooler.SmartDevice.getMarkerTitle(data[i]) });
						}
					}
					else {
						wayPoints.push({
							location: new google.maps.LatLng(validData[i].Latitude, validData[i].Longitude)
						});
						wayPointsInfo.push({ location: new google.maps.LatLng(validData[i].Latitude, validData[i].Longitude), title: Cooler.SmartDevice.getMarkerTitle(data[i]) });
					}
					markers.push({
						lat: validData[i].Latitude, lng: validData[i].Longitude, marker: {
							title: Cooler.SmartDevice.getMarkerTitle(validData[i]),
							icon: {
								// use whatever icon you want for the "dots"
								url: "images/icons/measle_blue.png",
								size: new google.maps.Size(10, 10),
								anchor: new google.maps.Point(6, 6)
							}
						}
					});
				}
			}

			var request = {
				origin: origin,
				destination: destination ? destination : origin,
				waypoints: wayPoints,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};
			if (this.directionsDisplay) {
				Cooler.SmartDevice.clearDirectionDisplay(this.directionsDisplay);
			}
			var mapType = this.getMapType.getValue();
			this.mapType = mapType;
			var arrMarker = [];

			if (this.mapType == 2) {
				Cooler.SmartDevice.clearDirectionDisplay(this.directionsDisplay ? this.directionsDisplay : outer.directionsDisplay);
				var data_point = [
					{ lat: validData[0].Latitude, lng: validData[0].Longitude, title: Cooler.SmartDevice.getMarkerTitle(data[0]) },
					{ lat: validData[dataLen - 1].Latitude, lng: validData[dataLen - 1].Longitude, title: Cooler.SmartDevice.getMarkerTitle(data[dataLen - 1]) }
				];
				var iconUrl = "";
				for (i = 0; i < data_point.length; i++) {
					if (i == 1) {
						iconUrl = "images/icons/start_point.png";
					}
					else {
						iconUrl = "images/icons/end_point.png";
					}
					arrMarker.push({
						lat: data_point[i].lat,
						lng: data_point[i].lng,
						marker: {
							title: data_point[i].title,
							icon: {
								url: iconUrl
							}
						}
					});
				}
				this.trackpointMap.addPolyline(data_point);
				this.trackpointMap.addMarkers(arrMarker);
			}
			else {
				this.trackpointMap.addMarkers(markers);
				if (origin) {
					Cooler.SmartDevice.mapDirection(request, wayPointsInfo, this.trackpointMap, destination ? false : true);
				}
			}
		} else {
			Ext.Msg.alert('Alert', 'No GPS movement data exists for selected dates.');
		}
	},

	contextMenuHandler: function () {
		var selectedRowData = Cooler.SmartDevice.grid.getSelectionModel().getSelected().data;
		var smartDeviceId = selectedRowData.SmartDeviceId;
		this.maskLoad = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Sending command...' });
		this.maskLoad.show();

		var params = { cmdId: this.cmdId, action: this.cmd, smartDeviceId: smartDeviceId };

		Ext.Ajax.request({
			url: 'Controllers/SmartDevice.ashx',
			params: params,
			callback: function (o, success, response) {
				this.maskLoad.hide();
				if (!success) {
					Ext.Msg.alert('An error occurred', 'An error occurred');
				}
				else {
					Ext.Msg.alert('Success', 'Command Sent successfully!');
				}
			}, scope: this
		});
	},
	hybridConfig: function () {
		var commandCombo = DA.combo.create({ fieldLabel: 'Command', hiddenName: 'SmartDeviceTypeCommandId', store: this.comboStores.SmartDeviceTypeCommandUnique, allowBlank: false });
		var clientCombo = DA.combo.create({ store: this.comboStores.Client });
		var statusCombo = DA.combo.create({ store: this.comboStores.SmartDeviceStatus });
		var coolerIoTClient = DA.Security.info.Tags.ClientId == 0 && this.canEdit() ? { header: 'CoolerIoT Client', dataIndex: 'ClientId', displayIndex: 'Client', type: 'int', editor: clientCombo, renderer: ExtHelper.renderer.Combo(clientCombo), width: 150 } : { header: 'CoolerIoT Client', dataIndex: 'Client', type: 'string', width: 150 };
		var status = this.canEdit() ? { header: 'Status', dataIndex: 'StatusId', type: 'int', xtype: 'combocolumn', displayIndex: 'Status', editor: statusCombo, hidden: true, renderer: ExtHelper.renderer.Combo(statusCombo) } : { header: 'Status', hidden: true, dataIndex: 'Status', type: 'string' };
		var cm = [];
		cm.push({ dataIndex: 'SmartDeviceId', type: 'int' });
		cm.push({ dataIndex: 'IsGateway', type: 'bool' });
		cm.push({ dataIndex: 'Attributes', type: 'string' });
		cm.push({ header: 'Device Type', dataIndex: 'SmartDeviceTypeId', type: 'int', displayIndex: 'SmartDeviceType', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }), width: 130 });
		cm.push({ header: 'Manufacturer', dataIndex: 'ManufacturerName', type: 'string', width: 130 });
		cm.push({ dataIndex: 'SmartDeviceTypeId', type: 'int' });
		cm.push({ header: 'Mac Address', dataIndex: 'MacAddress', type: 'string', width: 150 });
		cm.push({ header: 'Serial Number', dataIndex: 'SerialNumber', type: 'string', width: 150 });
		cm.push({ header: 'Order Serial Number', dataIndex: 'OrderSerialNumber', type: 'string', width: 150 });
		cm.push({ header: 'Shipped Country', dataIndex: 'ShippedCountryId', width: 100, type: 'int', displayIndex: 'ShippedCountry', store: this.comboStores.ShippedCountry, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.ShippedCountry }) });
		cm.push({ header: 'Asset Equipment Number', dataIndex: 'EquipmentNumber', type: 'string', width: 150 });
		cm.push({ header: 'Technical Identification Number', dataIndex: 'TechnicalIdentificationNumber', type: 'string', width: 150 });
		cm.push({ header: 'Gateway', dataIndex: 'Gateway', type: 'string' });
		cm.push({ dataIndex: 'GatewayTypeId', type: 'int' });
		cm.push({ header: 'Manufacturer Serial Number', dataIndex: 'ManufacturerSerialNumber', type: 'string' });
		cm.push(status);
		cm.push({ header: 'IMEI', dataIndex: 'Imei', width: 140, type: 'string' });
		cm.push({ header: 'Sim#', dataIndex: 'SimNum', width: 140, type: 'string' });
		cm.push({ header: 'Last Ping', dataIndex: 'LastPing', width: 160, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone });
		cm.push({ header: 'Firmware Version', dataIndex: 'FirmwareVersion', type: 'string' });
		cm.push({ header: 'IBeacon UUID', type: 'string', dataIndex: 'IBeaconUuid' });
		cm.push({ header: 'IBeacon Major', dataIndex: 'IBeaconMajor', type: 'string' }),
			cm.push({ header: 'IBeacon Minor', dataIndex: 'IBeaconMinor', type: 'string' }),
			cm.push({ header: 'Eddystone UID Namespace', dataIndex: 'EddystoneUid', type: 'string', width: 130 }),
			cm.push({ header: 'Eddystone UID Instance', dataIndex: 'EddystoneNameSpace', type: 'string', width: 90 }),
			cm.push({ dataIndex: 'HwMajor', type: 'string' }),
			cm.push({ dataIndex: 'HwMinor', type: 'string' }),
			cm.push({ header: 'Hw Version', renderer: function (v, m, r) { return r.get('HwMajor') ? [r.get('HwMajor'), r.get('HwMinor')].join('.') : '' } });
		cm.push({ header: 'Inventory Location', dataIndex: 'InventoryLocation', type: 'string' });
		cm.push({ header: 'Tracking#', dataIndex: 'TrackingNumber', type: 'string' });
		cm.push({ dataIndex: 'Client', type: 'string' });
		cm.push(coolerIoTClient);
		cm.push({ header: 'Asset Type', dataIndex: 'AssetTypeId', width: 170, type: 'int', displayIndex: 'AssetType', store: this.comboStores.AssetType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AssetType }) });
		cm.push({ header: 'Linked with Asset', dataIndex: 'Asset', type: 'string', hyperlinkAsDoubleClick: true });
		cm.push({ header: 'Is Factory Asset?', dataIndex: 'IsFactoryAsset', type: 'bool', width: 90, renderer: ExtHelper.renderer.Boolean });
		cm.push({ header: 'Associated in Factory', dataIndex: 'IsAssociatedInFactory', type: 'bool', width: 90, renderer: ExtHelper.renderer.Boolean }),
			cm.push({ header: 'Acquisition Date', dataIndex: 'AcquisitionDate', type: 'date', width: 160, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone }),
			cm.push({ header: 'Asset Associated On', dataIndex: 'AssetAssociatedOn', type: 'date', width: 160, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone });
		cm.push({ header: 'Association', dataIndex: 'AssociationStatus', type: 'string', width: 60 });
		cm.push({ header: 'Associated By BD User Name', dataIndex: 'AssetAssociatedByUser', type: 'string' });
		cm.push({ header: 'Associated By BD Name', dataIndex: 'AssetAssociatedByUserName', type: 'string' });
		cm.push({ header: 'Associated By App Version', dataIndex: 'AssociatedByAppVersion', type: 'string' });
		cm.push({ header: 'Associated By App Name', dataIndex: 'AssociatedByAppName', type: 'string' });
		cm.push({ header: 'Is Missing?', dataIndex: 'IsMissing', type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean });
		cm.push({ header: 'Outlet', dataIndex: 'LocationName', width: 170, type: 'string' });
		cm.push({ header: 'Outlet Code', dataIndex: 'LocationCode', type: 'string', hyperlinkAsDoubleClick: true });
		cm.push({ header: 'Outlet Type', dataIndex: 'OutletType', type: 'string' });
		cm.push({ header: 'Trade Channel', dataIndex: 'LocationType', width: 120, type: 'string' });
		cm.push({ header: 'Trade Channel Code', hidden: true, dataIndex: 'ChannelCode', width: 120, type: 'string' });
		cm.push({ header: 'Customer Tier', dataIndex: 'Classification', width: 120, type: 'string' });
		cm.push({ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' });
		cm.push({ header: 'Sub Trade Channel', dataIndex: 'SubTradeChannelName', width: 120, type: 'string' });
		cm.push({ header: 'Sub Trade Channel Code', hidden: true, dataIndex: 'SubTradeChannelTypeCode', width: 120, type: 'string' });
		cm.push({ header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 });
		cm.push({ header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' });
		cm.push({ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 });
		cm.push({ header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' });
		cm.push({ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 });
		cm.push({ header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' });
		cm.push({ header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 });
		cm.push({ header: 'Sales Territory Code', hidden: true, type: 'string', dataIndex: 'SalesTerritoryCode' });
		cm.push({ header: 'Street', dataIndex: 'Street', width: 170, type: 'string' });
		cm.push({ header: 'City', dataIndex: 'City', width: 120, type: 'string' });
		cm.push({ header: 'State', dataIndex: 'State', width: 100, type: 'string' });
		cm.push({ header: 'Country', dataIndex: 'CountryId', width: 100, type: 'int', displayIndex: 'Country', store: this.comboStores.Country, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Country }) });
		cm.push({ header: 'Time Zone', dataIndex: 'TimeZoneId', width: 200, type: 'int', displayIndex: 'TimeZone', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }) });
		cm.push({ dataIndex: 'TimeZoneId', type: 'int' });
		cm.push({ header: 'Latest Health Record Event Time', dataIndex: 'LatestHealthRecordEventTime', width: 200, type: 'date', renderer: ExtHelper.renderer.DateTime });
		//cm.push({ header: 'Battery Level', dataIndex: 'BatteryLevel', type: 'int', width: 70, align: 'right', renderer: function (v, m, r) { if (r.get('IsGateway') === true) { return 'N/A' } else { return r.get('BatteryLevel') } } });
		cm.push({ header: 'Battery Level', dataIndex: 'BatteryLevel', type: 'string', width: 70, align: 'right' });
		cm.push({ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer });
		cm.push({ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 });
		cm.push({ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer });
		cm.push({ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 });
		cm.push({ dataIndex: 'AssetLatitude', type: 'float' });
		cm.push({ dataIndex: 'AssetLongitude', type: 'float' });
		cm.push({ header: 'Advertisement URL', dataIndex: 'AdvertisementURL', type: 'string', width: 150 });
		cm.push({ dataIndex: 'Reference', type: 'string' });
		cm.push({ header: 'Is Device Registered in IoT Hub?', dataIndex: 'IsDeviceRegisteredInIoTHub', type: 'bool', width: 120, renderer: ExtHelper.renderer.Boolean });
		cm.push({ dataIndex: 'LocationId', type: 'int' });
		cm.push({ dataIndex: 'SmartDeviceType', type: 'string' });
		return cm;
	},

	onBeforeSave: function (y) {
		var record = this.grid.getSelectionModel().getSelected();
		this.onSave(y, record);
	},

	originalConfigValue: function (config, newValue) {
		var originalValue = this.config[config];
		if (originalValue) {
			originalValue = JSON.parse(originalValue)
		}
		else {
			originalValue = false;
		}
		var status = originalValue == newValue ? false : true;
		return status;
	},

	camera1SettingChange: function (field, newValue, oldValue) {
		Cooler.SmartDevice.camera1SettingsChanged = newValue != oldValue ? true : false;
	},

	camera2SettingChange: function (field, newValue, oldValue) {
		Cooler.SmartDevice.camera2SettingsChanged = newValue != oldValue ? true : false;
	},

	visionConfigChange: function (field, newValue, oldValue) {
		Cooler.SmartDevice.visionConfigChanged = newValue != oldValue ? true : false;
	},

	deviceThreshholdsChange: function (field, newValue, oldValue) {
		Cooler.SmartDevice.deviceThreshholdsChanged = newValue != oldValue ? true : false;
	},

	tlmPowerSettingsChange: function (field, newValue, oldValue) {
		Cooler.SmartDevice.tlmPowerSettingsChanged = newValue != oldValue ? true : false;
	},

	eddyStoneUrlPowerSettingsChange: function (field, newValue, oldValue) {
		Cooler.SmartDevice.eddyStoneUrlPowerSettingsChanged = newValue != oldValue ? true : false;
	},

	eddyStonePowerSettingsChange: function (field, newValue, oldValue) {
		Cooler.SmartDevice.eddyStonePowerSettingsChanged = newValue != oldValue ? true : false;
	},

	iBeaconPowerSettingsChange: function (field, newValue, oldValue) {
		Cooler.SmartDevice.iBeaconPowerSettingsChanged = newValue != oldValue ? true : false;
	},

	iBeaconMajorMinorChange: function (field, newValue, oldValue) {
		Cooler.SmartDevice.iBeaconMajorMinorChanged = newValue != oldValue ? true : false;
	},

	onChildGridTabChange: function (tabPanel, panel) {
		if (panel.title == 'Configuration') {
			//var store = panel.items.items[length];
			//store.load();
		} else if (panel.title == 'Asset Installation History') {
			var store = panel.getStore();
			store.baseParams.SmartDeviceId = this.smartDeviceId;
			store.load();
		}
		else {
			var store = panel.getStore();
			var currentGrid = panel.gridFilter.grid;
			var topToolBar = currentGrid.getTopToolbar();
			if (currentGrid != this.smartDeviceHealthGrid) {
				if (currentGrid.gridFilter.getFilter('EventTime')) {
					Cooler.Asset.applyDateFilter(currentGrid, Cooler.DateOptions.AddDays(new Date(), 1), Cooler.DateOptions.AddDays(new Date(), -7));
					Cooler.Asset.removePazeSizeLimit(currentGrid, store);
					store.load();
				}
			}
			if (currentGrid === this.smartDeviceCommandGrid) {
				store.load();
			}
			if (currentGrid === this.smartDeviceFirmwareVersionHistory) {
				store.load();
			}
			if (panel.title == 'Notes' || panel.title == 'Attachment') {
				var smartDeviceId = panel.baseParams.SmartDeviceId;
				this.notesObj.SetAssociationInfo("SmartDevice", smartDeviceId);
				if (panel.title == 'Attachment') {
					this.attachmentObj.SetAssociationInfo("SmartDevice", smartDeviceId);
				}
				if (store.url) {
					panel.loadFirst();
				}
			}
			if (panel.title == 'Raw Logs' || panel.title == 'Debug Logs') {
				if (store.url) {
					panel.loadFirst();
				}
			}
			if (currentGrid.getBottomToolbar()) {
				store.baseParams.limit = currentGrid.getBottomToolbar().pageSize;
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
		this.smartDeviceMovementGrid = Cooler.SmartDeviceMovement.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceDoorStatusGrid = Cooler.SmartDeviceDoorStatus.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceHealthGrid = Cooler.SmartDeviceHealth.createGrid({ disabled: true, id: 'activeHealth', tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceCommandGrid = Cooler.SmartDeviceCommand.createGrid({ disabled: true, custom: { allowBulkDelete: true }, disableDblClickHandler: true, scope: this }, true);
		this.smartDevicePing = Cooler.SmartDevicePing.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		//this.smartDeviceLog = Cooler.SmartDeviceLog.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true }, true);
		this.smartDeviceCellLocation = Cooler.SmartDeviceCellLocation.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDevicePowerEvent = Cooler.SmartDevicePowerEvent.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.notesObj = new DA.Note();
		this.notesGrid = this.notesObj.createGrid({ disabled: true });
		this.attachmentObj = new DA.Attachment();
		this.attachmentGrid = this.attachmentObj.createGrid({ title: 'Attachment', disabled: true });
		this.SmartDeviceAdvertiseEvent = Cooler.SmartDeviceAdvertiseEventReadOnly.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceDiagnosticMessage = Cooler.SmartDeviceDiagnosticMessageReadOnly.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceStockSensorData = Cooler.SmartDeviceStockSensorDataReadOnly1.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceAlarmRecordType = Cooler.SmartDeviceAlarmRecordTypeReadOnly.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceEventTypeRecord = Cooler.SmartDeviceEventTypeRecordReadOnly.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceEventAlarmError = Cooler.SmartDeviceEventAlarmErrorReadOnly.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.SmartDeviceWifiLocation = Cooler.SmartDeviceWifiLocationReadOnly.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.smartDeviceFirmwareVersionHistory = Cooler.SmartDeviceFirmwareVersionHistory.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true });
		this.assetInstallationHistory = Cooler.AssetInstallationHistory.createGrid({ tbar: [] });
		var items = [
			this.smartDeviceHealthGrid,
			this.smartDeviceDoorStatusGrid,
			this.smartDeviceMovementGrid,
			this.smartDeviceCommandGrid,
			this.smartDevicePing,
			//this.smartDeviceLog,
			this.smartDeviceCellLocation,
			this.smartDevicePowerEvent,
			this.notesGrid,
			this.attachmentGrid,
			this.SmartDeviceAdvertiseEvent,
			this.smartDeviceDiagnosticMessage,
			this.smartDeviceStockSensorData,
			this.smartDeviceAlarmRecordType,
			this.smartDeviceEventTypeRecord,
			this.smartDeviceEventAlarmError,
			this.SmartDeviceWifiLocation,
			this.smartDeviceFirmwareVersionHistory
		];
		// Only visible to Admin Role
		if (DA.Security.IsAdmin()) {
			items.push(this.assetInstallationHistory);
		}

		if (!this.grids) {
			var grids = [];
			grids.push(this.smartDeviceHealthGrid);
			grids.push(this.smartDeviceMovementGrid);
			grids.push(this.smartDeviceDoorStatusGrid);
			grids.push(this.smartDeviceCommandGrid);
			grids.push(this.smartDevicePing);
			//grids.push(this.smartDeviceLog);
			grids.push(this.smartDeviceCellLocation);
			grids.push(this.smartDevicePowerEvent);
			grids.push(this.notesGrid);
			grids.push(this.attachmentGrid);
			grids.push(this.SmartDeviceAdvertiseEvent);
			grids.push(this.smartDeviceDiagnosticMessage);
			grids.push(this.smartDeviceStockSensorData);
			grids.push(this.smartDeviceAlarmRecordType);
			grids.push(this.smartDeviceEventTypeRecord);
			grids.push(this.smartDeviceEventAlarmError);
			grids.push(this.SmartDeviceWifiLocation);
			grids.push(this.smartDeviceFirmwareVersionHistory);
			this.grids = grids;
		}

		var camera1 = new Ext.form.FieldSet({
			title: 'CAMERA 1',
			height: '100%',
			columnWidth: .2,
			defaults: {
				labelStyle: 'width: 110px;'
			},
			items: [
				{
					fieldLabel: 'Brightness', allowBlank: false, name: 'Brightness_READ_CAMERA_SETTING', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.camera1SettingChange
					}
				},
				{
					fieldLabel: 'Contrast', allowBlank: false, name: 'Contrast_READ_CAMERA_SETTING', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera1SettingChange
					}
				},
				{
					fieldLabel: 'Saturation', allowBlank: false, name: 'Saturation_READ_CAMERA_SETTING', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera1SettingChange
					}
				},
				{
					fieldLabel: 'Shutter Speed', allowBlank: false, name: 'Shutter Speed_READ_CAMERA_SETTING', minValue: 100, maxValue: 1600, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera1SettingChange
					}
				},
				{
					fieldLabel: 'Camera Quality', allowBlank: false, name: 'Camera Quality_READ_CAMERA_SETTING', minValue: 1, maxValue: 32, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera1SettingChange
					}
				},
				{
					fieldLabel: 'Effect', allowBlank: false, name: 'Effect_READ_CAMERA_SETTING', minValue: 0, maxValue: 8, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera1SettingChange
					}
				},
				{
					fieldLabel: 'Light Mode', allowBlank: false, name: 'Light Mode_READ_CAMERA_SETTING', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera1SettingChange
					}
				},
				{
					fieldLabel: 'Camera Clock', allowBlank: false, name: 'Camera Clock_READ_CAMERA_SETTING', minValue: 0, maxValue: 3, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera1SettingChange
					}
				},
				{
					fieldLabel: 'Cdly', allowBlank: false, name: 'Cdly_READ_CAMERA_SETTING', minValue: 0, maxValue: 2, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera1SettingChange
					}
				},
				{
					fieldLabel: 'Gain', allowBlank: false, name: 'Drive_READ_CAMERA_SETTING', minValue: 0, maxValue: 32, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera1SettingChange
					}
				}
			]
		});
		this.camera1 = camera1;

		var camera2 = new Ext.form.FieldSet({
			title: 'CAMERA 2',
			height: '100%',
			columnWidth: .2,
			defaults: {
				labelStyle: 'width: 110px;'
			},
			items: [
				{
					fieldLabel: 'Brightness', allowBlank: false, name: 'Brightness_READ_CAMERA2_SETTING', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.camera2SettingChange
					}
				},
				{
					fieldLabel: 'Contrast', allowBlank: false, name: 'Contrast_READ_CAMERA2_SETTING', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera2SettingChange
					}
				},
				{
					fieldLabel: 'Saturation', allowBlank: false, name: 'Saturation_READ_CAMERA2_SETTING', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera2SettingChange
					}
				},
				{
					fieldLabel: 'Shutter Speed', allowBlank: false, name: 'Shutter Speed_READ_CAMERA2_SETTING', minValue: 100, maxValue: 1600, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera2SettingChange
					}
				},
				{
					fieldLabel: 'Camera Quality', allowBlank: false, name: 'Camera Quality_READ_CAMERA2_SETTING', minValue: 1, maxValue: 32, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera2SettingChange
					}
				},
				{
					fieldLabel: 'Effect', allowBlank: false, name: 'Effect_READ_CAMERA2_SETTING', minValue: 0, maxValue: 8, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera2SettingChange
					}
				},
				{
					fieldLabel: 'Light Mode', allowBlank: false, name: 'Light Mode_READ_CAMERA2_SETTING', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera2SettingChange
					}
				},
				{
					fieldLabel: 'Camera Clock', allowBlank: false, name: 'Camera Clock_READ_CAMERA2_SETTING', minValue: 0, maxValue: 3, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera2SettingChange
					}
				},
				{
					fieldLabel: 'Cdly', allowBlank: false, name: 'Cdly_READ_CAMERA2_SETTING', minValue: 0, maxValue: 2, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera2SettingChange
					}
				},
				{
					fieldLabel: 'Gain', allowBlank: false, name: 'Drive_READ_CAMERA2_SETTING', minValue: 0, maxValue: 32, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.camera2SettingChange
					}
				}
			]
		});

		this.camera2 = camera2;

		var visionConfig = new Ext.form.FieldSet({
			title: 'Vision Config',
			height: '100%',
			columnWidth: .2,
			defaults: {
				labelStyle: 'width: 110px;'
			},
			items: [
				{ fieldLabel: 'Door Open Angle 1', allowBlank: false, name: 'Angle 1(Door open, image trigger)_READ_GYROSCOPE_DATA', minValue: 0, maxValue: 90, xtype: 'numberfield', decimalPrecision: 0, disabled: true, },
				{ fieldLabel: 'Angle 2 Door close', allowBlank: false, name: 'Angle 2(Door close, image trigger)_READ_GYROSCOPE_DATA', minValue: 0, maxValue: 90, xtype: 'numberfield', decimalPrecision: 0, disabled: true },
				{
					fieldLabel: 'Image Capture Mode', allowBlank: false, name: 'Image Capture Mode_READ_GYROSCOPE_DATA', minValue: 0, maxValue: 2, xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.visionConfigChange
					}
				},
				{
					fieldLabel: 'Angle 1 Door Open(Range 1-20)', allowBlank: false, name: 'Door Open Angle 1_READ_GYROSCOPE_DATA', minValue: 1, maxValue: 20, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.visionConfigChange
					}
				},
				{
					fieldLabel: 'Angle 2 Door close(Range 20-90)', allowBlank: false, name: 'Door Close Angle 2_READ_GYROSCOPE_DATA', minValue: 20, maxValue: 90, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.visionConfigChange
					}
				},
				{
					fieldLabel: 'Trigger Delta', allowBlank: false, name: 'Trigger Delta_READ_GYROSCOPE_DATA', minValue: 1, maxValue: 10, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.visionConfigChange
					}
				},
				{
					fieldLabel: 'Cam Sequence', allowBlank: false, name: 'Cam Sequence_READ_GYROSCOPE_DATA', minValue: 0, maxValue: 2, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.visionConfigChange
					}
				}
			]
		});
		this.visionConfig = visionConfig;

		var statusConfig = new Ext.form.FieldSet({
			title: 'STATUS',
			height: '100%',
			width: '100%',
			columnWidth: .5,
			defaults: {
				labelStyle: 'width: 110px;'
			},
			items: [
				{
					xtype: 'checkbox', name: 'StandBy Status_', fieldLabel: 'Stand By', width: 150, listeners: {
						'check': function (field, checked) {
							var status = this.originalConfigValue(field.name, checked);
							Cooler.SmartDevice.standByModeChanged = status;
						}, scope: this
					}
				},
				{
					xtype: 'checkbox', name: 'Take Picture Status_', itemId: 'takePicture', fieldLabel: 'Take Picture', width: 150, listeners: {
						'check': function (field, checked) {
							var status = this.originalConfigValue(field.name, checked);
							Cooler.SmartDevice.takePictureChanged = status;
						}, scope: this
					}
				},
				{
					xtype: 'textfield', name: 'Time of device_CURRENT_TIME', fieldLabel: 'Current Time', width: 150, listeners: {
						'change': function (field, newValue, oldValue) {
							if (newValue != oldValue) {
								Cooler.SmartDevice.currentTimeChanged = true;
							}
							else {
								Cooler.SmartDevice.currentTimeChanged = false;
							}
						}
					}
				},
				{ xtype: 'numberfield', name: 'Current Event Index_EVENT_COUNT', fieldLabel: 'Current Event Index', width: 150, disabled: true },
				{
					xtype: 'numberfield', name: 'RangeOf Event Id_EVENT_COUNT', fieldLabel: 'Last Read Event Index', width: 150, listeners: {
						'change': function (field, newValue, oldValue) {
							if (newValue != oldValue) {
								Cooler.SmartDevice.lastReadIndexChanged = true;
							}
							else {
								Cooler.SmartDevice.lastReadIndexChanged = false;
							}
						}
					}
				},
				{
					xtype: 'numberfield', name: 'Advertising Period (mili Second)_READ_CONFIGURATION_PARAMETER', fieldLabel: 'Advertisement Frequency', width: 150, minValue: 1, maxValue: 10000,
					listeners: {
						'change': function (field, newValue, oldValue) {
							if (newValue != oldValue) {
								Cooler.SmartDevice.advertisementFrequencyChanged = true;
							}
							else {
								Cooler.SmartDevice.advertisementFrequencyChanged = false;
							}
						}
					}
				},
				{
					xtype: 'numberfield', name: 'Periodic Interval (In Minutes)_READ_CONFIGURATION_PARAMETER', fieldLabel: 'Heart Beat Interval', minValue: 1, maxValue: 60, width: 150,
					listeners: {
						'change': function (field, newValue, oldValue) {
							if (newValue != oldValue) {
								Cooler.SmartDevice.heartBeatIntervalChanged = true;
							}
							else {
								Cooler.SmartDevice.heartBeatIntervalChanged = false;
							}
						}
					}
				}
			]
		});

		this.statusConfig = statusConfig;

		var thresholdConfig = new Ext.form.FieldSet({
			title: 'THRESHOLDS',
			height: '100%',
			columnWidth: .2,
			defaults: {
				labelStyle: 'width: 110px;'
			},
			items: [
				{
					xtype: 'numberfield', name: 'Movement threshold G Value_READ_CONFIGURATION_PARAMETER', fieldLabel: 'Movement G (Upper Limit)', width: 150, decimalPrecision: 0, maxValue: 100, allowBlank: false, listeners: {
						'change': this.deviceThreshholdsChange
					}
				},
				{
					xtype: 'numberfield', name: 'Movement threshold Time_READ_CONFIGURATION_PARAMETER', fieldLabel: 'Movement Time (Upper Limit)', width: 150, decimalPrecision: 0, maxValue: 127, allowBlank: false, listeners: {
						'change': this.deviceThreshholdsChange
					}
				},
				{
					xtype: 'numberfield', name: 'Temperature out of threshold_READ_CONFIGURATION_PARAMETER', fieldLabel: 'Temperature (Upper Limit)', width: 150, decimalPrecision: 0, maxValue: 100, allowBlank: false, listeners: {
						'change': this.deviceThreshholdsChange
					}
				},
				{
					xtype: 'numberfield', name: 'Light out of threshold_READ_CONFIGURATION_PARAMETER', fieldLabel: 'Ambient Light (Upper Limit)', width: 150, decimalPrecision: 0, maxValue: 1000, allowBlank: false, listeners: {
						'change': this.deviceThreshholdsChange
					}
				},
				{
					xtype: 'numberfield', name: 'Humidity out of threshold_READ_CONFIGURATION_PARAMETER', fieldLabel: 'Humidity (Upper Limit)', width: 150, decimalPrecision: 0, maxValue: 100, allowBlank: false, listeners: {
						'change': this.deviceThreshholdsChange
					}
				}
			]
		});

		this.thresholdConfig = thresholdConfig;

		var eddyIBeaconConfig = new Ext.form.FieldSet({
			title: 'IBeacon',
			height: '100%',
			columnWidth: .2,
			defaults: {
				labelStyle: 'width: 110px;'
			},
			items: [
				{
					xtype: 'checkbox', name: 'Enable I Beacon1', fieldLabel: 'Enable Beacon', listeners: {
						'check': function (field, checked) {
							var status = this.originalConfigValue(field.name, checked);
							Cooler.SmartDevice.beaconFrameChanged = status;
						}, scope: this
					}
				},
				{
					fieldLabel: 'UUID', allowBlank: false, name: 'UUID2', xtype: 'textfield', minLength: 32, maxLength: 36, regex: new RegExp('^[0-9A-Fa-f]+$'), regexText: 'Only hex values are allowed',
					listeners: {
						'change': function (field, newValue, oldValue) {
							if (newValue != oldValue) {
								Cooler.SmartDevice.iBeaconUUIDChanged = true;
							}
							else {
								Cooler.SmartDevice.iBeaconUUIDChanged = false;
							}
						}
					}
				},
				{
					fieldLabel: 'Major', allowBlank: false, name: 'Major2', xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.iBeaconMajorMinorChange
					}
				},
				{
					fieldLabel: 'Minor', allowBlank: false, name: 'Minor2', xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.iBeaconMajorMinorChange
					}
				},
				{
					fieldLabel: 'RSSI value for 1 meter distance', allowBlank: false, name: 'RSSI2', xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.iBeaconMajorMinorChange
					}
				},
				{
					fieldLabel: 'Broadcast(Tx) power', allowBlank: false, name: 'Broadcast Tx Power2', xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.iBeaconPowerSettingsChange
					}
				},
				{
					fieldLabel: 'Advertising interval', allowBlank: false, name: 'Advertising Interval2', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.iBeaconPowerSettingsChange
					}
				},
				{
					fieldLabel: 'Energy saving power(Tx)', allowBlank: false, name: 'Energy Saving Power Tx2', xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.iBeaconPowerSettingsChange
					}
				},
				{
					fieldLabel: 'Energy saving Interval', allowBlank: false, name: 'Energy Saving Advertising Interval2', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.iBeaconPowerSettingsChange
					}
				}
			]
		});

		this.eddyIBeaconConfig = eddyIBeaconConfig;


		var eddyUIDConfiguration = new Ext.form.FieldSet({
			title: 'EddyStone UID Configuration',
			height: '100%',
			columnWidth: .2,
			defaults: {
				labelStyle: 'width: 110px;'
			},
			items: [
				{
					xtype: 'checkbox', name: 'Enable Eddystone Beacon UID1', fieldLabel: 'Enable Eddystone Beacon UID', listeners: {
						'check': function (field, checked) {
							var status = this.originalConfigValue(field.name, checked);
							Cooler.SmartDevice.beaconFrameChanged = status;
						}, scope: this
					}
				},
				{
					fieldLabel: 'UID Namespace', allowBlank: false, name: 'UID NameSpace3', xtype: 'textfield', maxLength: 20, regex: new RegExp('^[0-9A-Fa-f]+$'), regexText: 'Only hex values are allowed',
					listeners: {
						'change': function (field, newValue, oldValue) {
							Cooler.SmartDevice.eddyStoneUUIDChanged = newValue != oldValue ? true : false;
						}
					}
				},
				{
					fieldLabel: 'UID Instance', allowBlank: false, name: 'UID Instance3', xtype: 'textfield', maxLength: 12, regex: new RegExp('^[0-9A-Fa-f]+$'), regexText: 'Only hex values are allowed',
					listeners: {
						'change': function (field, newValue, oldValue) {
							Cooler.SmartDevice.eddyStoneUUIDChanged = newValue != oldValue ? true : false;
						}
					}
				},
				{
					fieldLabel: 'Broadcast(Tx) power', allowBlank: false, name: 'Broadcast Tx Power3', xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.eddyStonePowerSettingsChange
					}
				},
				{
					fieldLabel: 'Advertising interval', allowBlank: false, name: 'Advertising Interval3', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.eddyStonePowerSettingsChange
					}
				},
				{
					fieldLabel: 'Energy saving power(Tx)', allowBlank: false, name: 'Energy Saving Power Tx3', xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.eddyStonePowerSettingsChange
					}
				},
				{
					fieldLabel: 'Energy saving Interval', allowBlank: false, name: 'Energy Saving Advertising Interval3', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.eddyStonePowerSettingsChange
					}
				}
			]
		});

		this.eddyUIDConfiguration = eddyUIDConfiguration;

		var eddyUrlConfiguration = new Ext.form.FieldSet({
			title: 'EddyStone URL Configuration',
			height: '100%',
			columnWidth: .2,
			defaults: {
				labelStyle: 'width: 110px;'
			},
			items: [
				{
					xtype: 'checkbox', name: 'Enable Eddystone Beacon URL1', fieldLabel: 'Enable Eddystone Beacon URL', listeners: {
						'check': function (field, checked) {
							var status = this.originalConfigValue(field.name, checked);
							Cooler.SmartDevice.beaconFrameChanged = status;
						}, scope: this
					}
				},
				{
					fieldLabel: 'URL', allowBlank: false, name: 'URL4', xtype: 'textfield', regex: new RegExp('((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)'), regexText: 'Please enter valid url', listeners: {
						'change': function (field, newValue, oldValue) {
							Cooler.SmartDevice.eddyStoneUrlChanged = newValue != oldValue ? true : false;
						}
					}
				},
				{
					fieldLabel: 'Broadcast(Tx) power', allowBlank: false, name: 'Broadcast Tx Power4', xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.eddyStoneUrlPowerSettingsChange
					}
				},
				{
					fieldLabel: 'Advertising interval', allowBlank: false, name: 'Advertising Interval4', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.eddyStoneUrlPowerSettingsChange
					}
				},
				{
					fieldLabel: 'Energy saving power', allowBlank: false, name: 'Energy Saving Power Tx4', xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.eddyStoneUrlPowerSettingsChange
					}
				},
				{
					fieldLabel: 'Energy saving interval', allowBlank: false, name: 'Energy Saving Advertising Interval4', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.eddyStoneUrlPowerSettingsChange
					}
				}
			]
		});

		this.eddyUrlConfiguration = eddyUrlConfiguration;

		var eddyTLMConfiguration = new Ext.form.FieldSet({
			title: 'EddyStone TLM Configuration',
			height: '100%',
			columnWidth: .2,
			defaults: {
				labelStyle: 'width: 110px;'
			},
			items: [
				{
					xtype: 'checkbox', name: 'Enable Eddystone Beacon TLM1', fieldLabel: 'Enable Eddystone Beacon TLM', listeners: {
						'check': function (field, checked) {
							var status = this.originalConfigValue(field.name, checked);
							Cooler.SmartDevice.beaconFrameChanged = status;
						}, scope: this
					}
				},
				{
					fieldLabel: 'Broadcast(Tx) power', allowBlank: false, name: 'Broadcast Tx Power5', xtype: 'numberfield', decimalPrecision: 0, listeners: {
						'change': this.tlmPowerSettingsChange
					}
				},
				{
					fieldLabel: 'Advertising interval', allowBlank: false, name: 'Advertising Interval5', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.tlmPowerSettingsChange
					}
				},
				{
					fieldLabel: 'Energy saving power(Tx)', allowBlank: false, name: 'Energy Saving Power Tx5', xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.tlmPowerSettingsChange
					}
				},
				{
					fieldLabel: 'Energy saving interval', allowBlank: false, name: 'Energy Saving Advertising Interval5', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0,
					listeners: {
						'change': this.tlmPowerSettingsChange
					}
				}
			]
		});

		this.eddyTLMConfiguration = eddyTLMConfiguration;

		var configurationPanel = new Ext.FormPanel({
			title: 'Configuration',
			autoScroll: true,
			tbar: [new Ext.Button({ text: 'Apply', iconCls: 'assetIcon', handler: this.onUpdateConfiguration, scope: this }), new Ext.Button({ text: 'Refresh', iconCls: 'refresh', handler: this.setConfiguration, scope: this })],
			layout: 'form',
			defaults: { width: '100%' },
			bodyStyle: {
				padding: "5px"
			},
			items: [
				this.statusConfig,
				this.eddyIBeaconConfig,
				this.eddyUIDConfiguration,
				this.eddyUrlConfiguration,
				this.eddyTLMConfiguration,
				this.thresholdConfig,
				this.camera1,
				this.camera2,
				this.visionConfig
			]
		});
		this.configurationPanel = configurationPanel;
		this.configurationPanel.on('show', function () { this.setConfiguration() }, this);
		this.smartDeviceCommandGrid.on('show', function () {
			var bottomToolbar = this.smartDeviceCommandGrid.getBottomToolbar();
			this.smartDeviceCommandGrid.store.load({ params: { limit: bottomToolbar.pageSize, start: bottomToolbar.cursor } });
		}, this);

		items.push(configurationPanel);
		grid.getTopToolbar().splice(0, 0, { text: 'Bulk Command', iconCls: 'assetIcon', handler: this.showBulkUpdateCommandWin, scope: this });
		if (DA.Security.HasPermission('RawLogs')) {
			grid.getTopToolbar().splice(0, 0, { text: 'Bulk Update', iconCls: 'assetIcon', handler: this.onBulkUpdateClick, scope: this });
			this.rawLogsGrid = Cooler.RawLogs.createGrid({ disabled: true, isChildGrid: true }, true);
			this.debugLogsGrid = Cooler.LogDebugger.createGrid({ disabled: true, isChildGrid: true }, true);
			items.push(this.rawLogsGrid);
			items.push(this.debugLogsGrid);
			this.grids.push(this.rawLogsGrid);
			this.grids.push(this.debugLogsGrid);
		}
		configurationPanel.setDisabled(true);
		var south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			items: items,
			id: 'smartDeviceChildTab',
			height: 200,
			split: true,
			deferredRender: false,
			enableTabScroll: true,
			listeners: {
				tabchange: this.onChildGridTabChange,
				scope: this
			}
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
	setConfiguration: function () {
		this.config = JSON.parse('{}');
		if (this.configurationPanel) {
			var selectedRecord = this.grid.getSelectionModel().getSelected();
			if (!selectedRecord) {
				return;
			}
			var data = selectedRecord.data;

			var smartDeviceTypeId = data.SmartDeviceTypeId;
			var smartDeviceType = data.SmartDeviceType;
			var visionVisible = false;
			var eddyBeacon = false;
			switch (smartDeviceTypeId) {
				case Cooler.Enums.SmartDeviceType.SmartVisionV2R1:
				case Cooler.Enums.SmartDeviceType.SmartVisionV5R1:
				case Cooler.Enums.SmartDeviceType.SmartVisionV5R2:
					visionVisible = true;
					if (data.FirmwareVersion >= 1.77) {
						eddyBeacon = true;
					}
					break;
				case Cooler.Enums.SmartDeviceType.SmartTagV3R1:
				case Cooler.Enums.SmartDeviceType.SmartTagV3R3:
					if (data.FirmwareVersion >= 2.65) {
						eddyBeacon = true;
					}
					break;
				default:
					visionVisible = false;
					eddyBeacon = false;
					break;

			}

			if (smartDeviceType === "SmartTag 2nd Generation" || smartDeviceType === "SmartVisionV6R2") // this condition is for 2nd generation vision and tab
			{
				eddyBeacon = true;
				if (smartDeviceType === "SmartVisionV6R2") {
					visionVisible = true;
				}
			}

			this.visionConfig.setVisible(visionVisible);
			this.camera1.setVisible(visionVisible);
			this.camera2.setVisible(visionVisible);

			this.visionConfig.items.each(function (item) {
				if (item.name === "Angle 1(Door open, image trigger)_READ_GYROSCOPE_DATA" || item.name == "Angle 2(Door close, image trigger)_READ_GYROSCOPE_DATA") {
					item.setDisabled(true);
				}
				else {
					item.setDisabled(!visionVisible)
				}
			});
			this.camera1.items.each(function (item) { item.setDisabled(!visionVisible) });
			this.camera2.items.each(function (item) { item.setDisabled(!visionVisible) });

			this.eddyIBeaconConfig.setVisible(eddyBeacon);
			this.eddyUIDConfiguration.setVisible(eddyBeacon);
			this.eddyUrlConfiguration.setVisible(eddyBeacon);
			this.eddyTLMConfiguration.setVisible(eddyBeacon);
			//this.statusConfig.setVisible(eddyBeacon);
			//this.thresholdConfig.setVisible(eddyBeacon);

			this.eddyIBeaconConfig.items.each(function (item) { item.setDisabled(!eddyBeacon) });
			this.eddyUIDConfiguration.items.each(function (item) { item.setDisabled(!eddyBeacon) });
			this.eddyUrlConfiguration.items.each(function (item) { item.setDisabled(!eddyBeacon) });
			this.eddyTLMConfiguration.items.each(function (item) { item.setDisabled(!eddyBeacon) });
			this.statusConfig.items.each(function (item) {
				if (item.name === "Take Picture Status_") {
					item.setVisible(visionVisible);
					item.getEl().up('.x-form-item').setDisplayed(visionVisible);
				}
				if (item.name === "Current Event Index_EVENT_COUNT") {
					item.setDisabled(true);
				}
			});
		}
		this.getConfiguration();
	},

	getConfiguration: function () {
		var smartDeviceId = this.grid.getSelectionModel().getSelected().data.SmartDeviceId;
		Ext.Ajax.request({
			url: EH.BuildUrl('SmartDevice'),
			params: {
				action: 'getConfiguration',
				smartDeviceId: smartDeviceId
			},
			success: this.onConfigurationSuccess,
			failure: function () {
				Ext.Msg.alert('Error', 'An error occured while fetching configuration');
			},
			scope: this
		});
	},

	onConfigurationSuccess: function (response) {

		Cooler.SmartDevice.standByModeChanged = false;
		Cooler.SmartDevice.takePictureChanged = false;
		Cooler.SmartDevice.currentTimeChanged = false;
		Cooler.SmartDevice.lastReadIndexChanged = false;
		Cooler.SmartDevice.advertisementFrequencyChanged = false;
		Cooler.SmartDevice.heartBeatIntervalChanged = false;
		Cooler.SmartDevice.beaconFrameChanged = false;
		Cooler.SmartDevice.iBeaconUUIDChanged = false;
		Cooler.SmartDevice.iBeaconMajorMinorChanged = false;
		Cooler.SmartDevice.iBeaconPowerSettingsChanged = false;
		Cooler.SmartDevice.eddyStoneUUIDChanged = false;
		Cooler.SmartDevice.eddyStonePowerSettingsChanged = false;
		Cooler.SmartDevice.eddyStoneUrlChanged = false;
		Cooler.SmartDevice.eddyStoneUrlPowerSettingsChanged = false;
		Cooler.SmartDevice.tlmPowerSettingsChanged = false;
		Cooler.SmartDevice.deviceThreshholdsChanged = false;
		Cooler.SmartDevice.camera1SettingsChanged = false;
		Cooler.SmartDevice.camera2SettingsChanged = false;
		Cooler.SmartDevice.visionConfigChanged = false;

		var data = Ext.decode(response.responseText);
		var config = data.data;
		var formConfig = this.configurationPanel.getForm();
		if (!config) {
			config = '{}';
		}
		formConfig.reset();
		config = JSON.parse(config);
		config["URL4"] = config["URL4"] ? config["URL4"].replace('\u0000', '') : '';
		config["UUID2"] = config["UUID2"] ? config["UUID2"].replace(/-/g, '') : '';
		this.config = config;
		formConfig.setValues(config);
	},

	commandDataTypes: {
		Byte: 1,
		Short: 2,
		DateTime: 3,
		Integer: 4,
		String: 5,
		Float: 6,
		URL: 7,
		SByte: 8
	},
	onUpdateConfiguration: function () {
		if (!this.updateMaskConfig) {
			this.updateMaskConfig = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
		}
		this.updateMaskConfig.show();
		var formConfig = this.configurationPanel.getForm();
		var configRecord = formConfig.getValues();
		var smartDeviceId = this.grid.getSelectionModel().getSelected().id;
		var values = [];
		var baseParams = this.grid.getSelectionModel().getSelected().data;
		var smartDeviceTypeId = baseParams.SmartDeviceTypeId;
		var isVision = smartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartVisionV2R1 || smartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartVisionV5R1 || smartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartVisionV5R2 ? true : false;
		var record = formConfig.getValues();
		var cameraSettingsDataType = [];
		cameraSettingsDataType.push(this.commandDataTypes.Byte);
		cameraSettingsDataType.push(this.commandDataTypes.Byte);
		cameraSettingsDataType.push(this.commandDataTypes.Byte);
		cameraSettingsDataType.push(this.commandDataTypes.Short);
		cameraSettingsDataType.push(this.commandDataTypes.Byte);
		cameraSettingsDataType.push(this.commandDataTypes.Byte);
		cameraSettingsDataType.push(this.commandDataTypes.Byte);
		cameraSettingsDataType.push(this.commandDataTypes.Byte);
		cameraSettingsDataType.push(this.commandDataTypes.Short);
		cameraSettingsDataType.push(this.commandDataTypes.Byte);

		if (Cooler.SmartDevice.standByModeChanged) {
			var value = { command: Cooler.Enums.SmartDeviceCommandType.SET_STANDBY_MODE };
			value["data"] = [formConfig.getValues()["StandBy Status_"] === "true" ? 1 : 0];
			value["dataTypes"] = [this.commandDataTypes.Byte];
			values.push(Ext.encode(value));
			Cooler.SmartDevice.configurationMessage = "SET_STANDBY_MODE";
		}

		if (Cooler.SmartDevice.takePictureChanged && isVision) {
			var value = { command: Cooler.Enums.SmartDeviceCommandType.ENABLE_TAKE_PICTURE };
			value["data"] = [formConfig.getValues()["Take Picture Status_"] === "true" ? 1 : 0];
			value["dataTypes"] = [this.commandDataTypes.Byte];
			values.push(Ext.encode(value));
			Cooler.SmartDevice.configurationMessage += ", ENABLE_TAKE_PICTURE";
		}

		if (Cooler.SmartDevice.currentTimeChanged) {
			var value = { command: Cooler.Enums.SmartDeviceCommandType.SET_REAL_TIME_CLOCK };
			var date = new Date(formConfig.getValues()["Time of device_CURRENT_TIME"]);
			var formattedDate = date.format('m/d/Y h:i:s A');
			value["data"] = [formattedDate];
			value["dataTypes"] = [this.commandDataTypes.DateTime];
			values.push(Ext.encode(value));
			Cooler.SmartDevice.configurationMessage += ", SET_REAL_TIME_CLOCK";
		}

		if (Cooler.SmartDevice.lastReadIndexChanged) {
			if (formConfig.findField("RangeOf Event Id_EVENT_COUNT").validate()) {
				var value = { command: Cooler.Enums.SmartDeviceCommandType.MODIFY_LAST_READ_EVENT_INDEX };
				value["data"] = [Number(record["RangeOf Event Id_EVENT_COUNT"])];
				value["dataTypes"] = [this.commandDataTypes.Short];
				values.push(Ext.encode(value));
				Cooler.SmartDevice.configurationMessage += ", MODIFY_LAST_READ_EVENT_INDEX";
			}
		}

		if (Cooler.SmartDevice.advertisementFrequencyChanged) {
			if (formConfig.findField("Advertising Period (mili Second)_READ_CONFIGURATION_PARAMETER").validate()) {
				var value = { command: Cooler.Enums.SmartDeviceCommandType.SET_ADVERTISING_PERIOD };
				value["data"] = [Number(record["Advertising Period (mili Second)_READ_CONFIGURATION_PARAMETER"])];
				value["dataTypes"] = [this.commandDataTypes.Short];
				values.push(Ext.encode(value));
				Cooler.SmartDevice.configurationMessage += ", SET_ADVERTISING_PERIOD";
			}
		}

		if (Cooler.SmartDevice.heartBeatIntervalChanged) {
			if (formConfig.findField("Periodic Interval (In Minutes)_READ_CONFIGURATION_PARAMETER").validate()) {
				var value = { command: Cooler.Enums.SmartDeviceCommandType.SET_INTERVAL };
				value["data"] = [Number(record["Periodic Interval (In Minutes)_READ_CONFIGURATION_PARAMETER"])];
				value["dataTypes"] = [this.commandDataTypes.Byte];
				values.push(Ext.encode(value));
				Cooler.SmartDevice.configurationMessage += ", SET_Heartbeat_INTERVAL";
			}
		}

		if (Cooler.SmartDevice.deviceThreshholdsChanged) {
			var value = { command: Cooler.Enums.SmartDeviceCommandType.SET_SENSOR_THRESHOLD };
			var fieldValues = [];
			var fields = ["Temperature out of threshold_READ_CONFIGURATION_PARAMETER", "Light out of threshold_READ_CONFIGURATION_PARAMETER", "Humidity out of threshold_READ_CONFIGURATION_PARAMETER", "Movement threshold G Value_READ_CONFIGURATION_PARAMETER",
				"Movement threshold Time_READ_CONFIGURATION_PARAMETER"
			]
			if (this.validateConfigurationFields(formConfig, fields)) {
				var sensorThresholdDataTypes = [];
				sensorThresholdDataTypes.push(this.commandDataTypes.Short);
				sensorThresholdDataTypes.push(this.commandDataTypes.Short);
				sensorThresholdDataTypes.push(this.commandDataTypes.Byte);
				sensorThresholdDataTypes.push(this.commandDataTypes.Byte);
				sensorThresholdDataTypes.push(this.commandDataTypes.Byte);

				this.insertDataForRemoteCommand(record, values, Cooler.Enums.SmartDeviceCommandType.SET_SENSOR_THRESHOLD, 0, 0, sensorThresholdDataTypes, fields);
				Cooler.SmartDevice.configurationMessage += ", SET_SENSOR_THRESHOLD";
			}
		}

		if (Cooler.SmartDevice.camera1SettingsChanged) {
			var cameraSettingFields = ["Brightness_READ_CAMERA_SETTING", "Contrast_READ_CAMERA_SETTING", "Saturation_READ_CAMERA_SETTING", "Shutter Speed_READ_CAMERA_SETTING", "Camera Quality_READ_CAMERA_SETTING",
				"Effect_READ_CAMERA_SETTING", "Light Mode_READ_CAMERA_SETTING", "Camera Clock_READ_CAMERA_SETTING", "Cdly_READ_CAMERA_SETTING", "Drive_READ_CAMERA_SETTING"
			]
			if (this.validateConfigurationFields(formConfig, cameraSettingFields)) {
				this.insertDataForRemoteCommand(record, values, Cooler.Enums.SmartDeviceCommandType.SET_CAMERA_SETTING, 0, 0, cameraSettingsDataType, cameraSettingFields);
				Cooler.SmartDevice.configurationMessage += ", SET_CAMERA_SETTING";
			}

		}

		if (Cooler.SmartDevice.camera2SettingsChanged) {
			var camera2SettingFields = ["Brightness_READ_CAMERA2_SETTING", "Contrast_READ_CAMERA2_SETTING", "Saturation_READ_CAMERA2_SETTING", "Shutter Speed_READ_CAMERA2_SETTING", "Camera Quality_READ_CAMERA2_SETTING",
				"Effect_READ_CAMERA2_SETTING", "Light Mode_READ_CAMERA2_SETTING", "Camera Clock_READ_CAMERA2_SETTING", "Cdly_READ_CAMERA2_SETTING", "Drive_READ_CAMERA2_SETTING"
			]
			if (this.validateConfigurationFields(formConfig, camera2SettingFields)) {
				this.insertDataForRemoteCommand(record, values, Cooler.Enums.SmartDeviceCommandType.SET_CAMERA2_SETTING, 0, 0, cameraSettingsDataType, camera2SettingFields);
				Cooler.SmartDevice.configurationMessage += ", SET_CAMERA2_SETTING";
			}
		}

		if (Cooler.SmartDevice.visionConfigChanged) {
			var visionConfigFields = ["Door Close Angle 2_READ_GYROSCOPE_DATA", "Trigger Delta_READ_GYROSCOPE_DATA", "Door Open Angle 1_READ_GYROSCOPE_DATA",
				"Image Capture Mode_READ_GYROSCOPE_DATA", "Cam Sequence_READ_GYROSCOPE_DATA"
			]
			var visionConfigDataTypes = [];
			visionConfigDataTypes.push(this.commandDataTypes.Byte);
			visionConfigDataTypes.push(this.commandDataTypes.Byte);
			visionConfigDataTypes.push(this.commandDataTypes.Byte);
			visionConfigDataTypes.push(this.commandDataTypes.Byte);
			visionConfigDataTypes.push(this.commandDataTypes.Byte);
			if (this.validateConfigurationFields(formConfig, visionConfigFields)) {
				this.insertDataForRemoteCommand(record, values, Cooler.Enums.SmartDeviceCommandType.SET_DOOR_OPEN_ANGLE, 0, 0, visionConfigDataTypes, visionConfigFields);
				Cooler.SmartDevice.configurationMessage += ", SET_VISION_CONFIG";
			}
		}

		if (Cooler.SmartDevice.beaconFrameChanged) {
			var value = { command: Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION };
			var fieldValues = [];
			fieldValues.push(record["Enable I Beacon1"] === "true" ? 1 : 0);
			fieldValues.push(record["Enable Eddystone Beacon UID1"] === "true" ? 1 : 0);
			fieldValues.push(record["Enable Eddystone Beacon URL1"] === "true" ? 1 : 0);
			fieldValues.push(record["Enable Eddystone Beacon TLM1"] === "true" ? 1 : 0);

			value["data"] = fieldValues;
			value["SubCommand"] = 1;
			value["parameterId"] = 1;
			value["dataTypes"] = [this.commandDataTypes.Byte, this.commandDataTypes.Byte, this.commandDataTypes.Byte, this.commandDataTypes.Byte];
			values.push(Ext.encode(value));
			Cooler.SmartDevice.configurationMessage += ", SET_BEACON_FRAME_TYPE";
		}

		if (Cooler.SmartDevice.iBeaconUUIDChanged) {
			if (formConfig.findField("UUID2").validate()) {
				var value = { command: Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION };
				value["SubCommand"] = 2;
				value["parameterId"] = 1;
				var fieldValues = [];
				value["dataTypes"] = [this.commandDataTypes.String];
				fieldValues.push(record["UUID2"]);
				value["data"] = fieldValues;
				values.push(Ext.encode(value));
				Cooler.SmartDevice.configurationMessage += ", SET_IBEACON_UUID";
			}
		}

		if (Cooler.SmartDevice.iBeaconMajorMinorChanged) {
			var iBeaconMajorMinorFields = ["Major2", "Minor2", "RSSI2"]
			if (this.validateConfigurationFields(formConfig, iBeaconMajorMinorFields)) {
				this.insertDataForRemoteCommand(record, values, Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION, 2, 2, [this.commandDataTypes.Short, this.commandDataTypes.Short, this.commandDataTypes.SByte], iBeaconMajorMinorFields);
				Cooler.SmartDevice.configurationMessage += ", SET_IBEACON_MAJOR_MINOR_RSSI";
			}
		}
		if (Cooler.SmartDevice.iBeaconPowerSettingsChanged) {
			var iBeaconPowerSettingsFields = ["Broadcast Tx Power2", "Advertising Interval2", "Energy Saving Power Tx2", "Energy Saving Advertising Interval2"]
			if (this.validateConfigurationFields(formConfig, iBeaconPowerSettingsFields)) {
				this.insertDataForRemoteCommand(record, values, Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION, 2, 3, [this.commandDataTypes.SByte, this.commandDataTypes.Short, this.commandDataTypes.SByte, this.commandDataTypes.Short], iBeaconPowerSettingsFields);
				Cooler.SmartDevice.configurationMessage += ", SET_IBEACON_POWER_SETTING";
			}
		}

		if (Cooler.SmartDevice.eddyStoneUUIDChanged) {
			var eddyStoneUUIDFields = ["UID NameSpace3", "UID Instance3"]
			if (this.validateConfigurationFields(formConfig, eddyStoneUUIDFields)) {
				var value = { command: Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION };
				value["SubCommand"] = 3;
				value["parameterId"] = 1;
				var fieldValues = [];
				fieldValues.push(record["UID NameSpace3"]);
				fieldValues.push(record["UID Instance3"]);
				value["data"] = fieldValues;
				value["dataTypes"] = [this.commandDataTypes.String, this.commandDataTypes.String];
				values.push(Ext.encode(value));
				Cooler.SmartDevice.configurationMessage += ", SET_EDDYSTONE_UID";
			}
		}
		if (Cooler.SmartDevice.eddyStonePowerSettingsChanged) {
			var eddyStonePowerSettingsFields = ["Broadcast Tx Power3", "Advertising Interval3", "Energy Saving Power Tx3", "Energy Saving Advertising Interval3"]
			if (this.validateConfigurationFields(formConfig, eddyStonePowerSettingsFields)) {
				this.insertDataForRemoteCommand(record, values, Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION, 3, 3, [this.commandDataTypes.SByte, this.commandDataTypes.Short, this.commandDataTypes.SByte, this.commandDataTypes.Short], eddyStonePowerSettingsFields);
				Cooler.SmartDevice.configurationMessage += ", SET_EDDYSTONE_POWER_SETTING";
			}
		}

		if (Cooler.SmartDevice.eddyStoneUrlChanged) {
			if (formConfig.findField("URL4").validate()) {
				var value = { command: Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION };
				value["SubCommand"] = 4;
				value["parameterId"] = 1;
				value["dataTypes"] = [this.commandDataTypes.URL];
				value["data"] = [record["URL4"]];
				values.push(Ext.encode(value));
				Cooler.SmartDevice.configurationMessage += ", SET_EDDYSTONE_URL";
			}
		}

		if (Cooler.SmartDevice.eddyStoneUrlPowerSettingsChanged) {
			var eddyStoneUrlPowerSettingsFields = ["Broadcast Tx Power4", "Advertising Interval4", "Energy Saving Power Tx4", "Energy Saving Advertising Interval4"];
			if (this.validateConfigurationFields(formConfig, eddyStoneUrlPowerSettingsFields)) {
				this.insertDataForRemoteCommand(record, values, Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION, 4, 3, [this.commandDataTypes.SByte, this.commandDataTypes.Short, this.commandDataTypes.SByte, this.commandDataTypes.Short], eddyStoneUrlPowerSettingsFields);
				Cooler.SmartDevice.configurationMessage += ", SET_EDDYSTONE_URL_POWER_SETTING";
			}
		}

		if (Cooler.SmartDevice.tlmPowerSettingsChanged) {
			var tlmPowerSettingsFields = ["Broadcast Tx Power5", "Advertising Interval5", "Energy Saving Power Tx5", "Energy Saving Advertising Interval5"];
			if (this.validateConfigurationFields(formConfig, tlmPowerSettingsFields)) {
				this.insertDataForRemoteCommand(record, values, Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION, 5, 3, [this.commandDataTypes.SByte, this.commandDataTypes.Short, this.commandDataTypes.SByte, this.commandDataTypes.Short], tlmPowerSettingsFields);
				Cooler.SmartDevice.configurationMessage += ", SET_TLM_POWER_SETTING";
			}
		}

		if (values.length > 0) {
			this.saveDeviceConfiguration(this, baseParams, values);
		}
		else {
			Ext.Msg.alert('Info', 'Nothing to add in remote command');
			this.updateMaskConfig.hide();
		}
	},
	insertDataForRemoteCommand: function (record, values, commandId, subCommandId, parameterId, dataTypes, fields) {
		var value = { command: commandId };
		if (subCommandId != 0 && parameterId != 0) {
			value["SubCommand"] = subCommandId;
			value["parameterId"] = parameterId;
		}
		value["dataTypes"] = dataTypes;
		var fieldValues = [];
		for (var k = 0; len = fields.length, k < len; k++) {
			fieldValues.push(Number(record[fields[k]]));
		}
		value["data"] = fieldValues;
		values.push(Ext.encode(value));
	},
	validateConfigurationFields: function (formConfig, fields) {
		for (var j = 0; len = fields.length, j < len; j++) {
			if (!formConfig.findField(fields[j]).validate()) {
				return false;
			}
		}
		return true;
	},
	saveDeviceConfiguration: function (me, baseParams, values) {
		var param = baseParams;
		var remainingValue = values;
		if (values.length > 0) {
			params = { action: 'insertSmartDeviceCommand', smartDeviceId: baseParams.SmartDeviceId, commandValue: values.pop(), clientId: baseParams.ClientId };
			params.smartDeviceTypeCommandId = Ext.decode(params.commandValue).command;
			Ext.Ajax.request({
				url: EH.BuildUrl('SmartDevice'),
				params: params,
				success: function (response, success) {
					this.saveDeviceConfiguration(this, param, remainingValue);
				},
				failure: function () {
					this.saveDeviceConfiguration(this, param, remainingValue);
				},
				scope: this
			});
		}
		else {
			this.updateMaskConfig.hide();
			Cooler.SmartDevice.standByModeChanged = false;
			Cooler.SmartDevice.takePictureChanged = false;
			Cooler.SmartDevice.currentTimeChanged = false;
			Cooler.SmartDevice.lastReadIndexChanged = false;
			Cooler.SmartDevice.advertisementFrequencyChanged = false;
			Cooler.SmartDevice.heartBeatIntervalChanged = false;
			Cooler.SmartDevice.beaconFrameChanged = false;
			Cooler.SmartDevice.iBeaconUUIDChanged = false;
			Cooler.SmartDevice.iBeaconMajorMinorChanged = false;
			Cooler.SmartDevice.iBeaconPowerSettingsChanged = false;
			Cooler.SmartDevice.eddyStoneUUIDChanged = false;
			Cooler.SmartDevice.eddyStonePowerSettingsChanged = false;
			Cooler.SmartDevice.eddyStoneUrlChanged = false;
			Cooler.SmartDevice.eddyStoneUrlPowerSettingsChanged = false;
			Cooler.SmartDevice.tlmPowerSettingsChanged = false;
			Cooler.SmartDevice.deviceThreshholdsChanged = false;
			Cooler.SmartDevice.camera1SettingsChanged = false;
			Cooler.SmartDevice.camera2SettingsChanged = false;
			Cooler.SmartDevice.visionConfigChanged = false;
			Cooler.SmartDevice.configurationMessage = Cooler.SmartDevice.configurationMessage.replace(',', '');
			Ext.Msg.alert('Info', 'Remote commands added for following ' + Cooler.SmartDevice.configurationMessage + " changes will reflect after successfull execution of remote commands");
			Cooler.SmartDevice.configurationMessage = '';
			this.getConfiguration();
		}
	},
	onBulkUpdateClick: function () {
		if (!this.bulkUpdateFrom) {
			var clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', name: 'ClientId', hiddenName: 'ClientId', mode: 'local', store: this.comboStores.Client, width: 150 });
			var statusCombo = DA.combo.create({ fieldLabel: 'Status', name: 'StatusId', hiddenName: 'StatusId', mode: 'local', store: this.comboStores.SmartDeviceStatus, width: 150 });
			var deviceTypeCombo = DA.combo.create({ fieldLabel: 'Device Type', name: 'SmartDeviceTypeId', hiddenName: 'SmartDeviceTypeId', mode: 'local', store: Cooler.comboStores.SmartDeviceType, width: 150 });
			//var shippedCountry = DA.combo.create({ fieldLabel: 'Shipped Country', name: 'ShippedCountryId', hiddenName: 'SmartDeviceTypeId', mode: 'local', store: Cooler.comboStores.SmartDeviceType, width: 150 });
			var shippedCountry = DA.combo.create({ fieldLabel: 'Shipped Country', name: 'ShippedCountryId', hiddenName: 'ShippedCountryId', controller: 'combo', baseParams: { comboType: 'ShippedCountry' }, listWidth: 220 });
			var bulkUpdateFrom = new Ext.FormPanel({
				itemId: 'bulkUpdateFrom',
				defaults: {
					labelStyle: 'width: 110px; margin-left: 13px;'
				},
				items: [
					{
						xtype: 'fieldset',
						title: 'Bulk Update Filters',
						width: 334,
						height: 130,
						defaults: {
							labelStyle: 'width: 110px;'
						},
						items: [
							{
								xtype: 'numberfield',
								name: 'FromSerialNumber',
								allowDecimals: false,
								fieldLabel: 'Serial Number From',
								width: 150,
								allowBlank: false
							},
							{
								xtype: 'numberfield',
								name: 'ToSerialNumber',
								allowDecimals: false,
								fieldLabel: 'Serial Number To',
								width: 150,
								allowBlank: false
							},
							deviceTypeCombo
						]

					},
					{
						xtype: 'fieldset',
						title: 'Bulk Assign',
						width: 334,
						height: 200,
						defaults: {
							labelStyle: 'width: 110px;'
						},
						items: [
							{
								xtype: 'textarea',
								name: 'SerialNumberForBulkUpdate',
								fieldLabel: 'Smart Device Serial Number',
								width: 150,
								allowBlank: false
							},
							{
								xtype: 'textarea',
								name: 'OrderSerialForBulkUpdate',
								fieldLabel: 'Smart Device Order Serial Number',
								width: 150,
								allowBlank: false
							},
							shippedCountry
						]
					},
					clientCombo,
					statusCombo

				]

			});
			this.bulkUpdateFrom = bulkUpdateFrom;
		}
		if (!this.bulkUpdateWin) {
			var window = new Ext.Window({
				width: 350,
				height: 300,
				//layout: 'fit',
				autoScroll: true,
				padding: 10,
				title: 'Bulk Update',
				resizable: false,
				constrain: true,
				items: bulkUpdateFrom,
				autoScroll: true,
				closeAction: 'hide',
				tbar: [
					{
						xtype: 'button',
						text: 'Save',
						handler: this.bulkUpdate,
						iconCls: 'save',
						scope: this
					},
					{
						xtype: 'button',
						text: 'Bulk Serial Update',
						handler: this.serialBulkUpdate,
						iconCls: 'save',
						scope: this
					}
				],
				listeners: {
					beforeshow: function (window) {
						//here we reset the form every time we open it
						var bulkUpdateFrom = window.getComponent('bulkUpdateFrom').form;
						bulkUpdateFrom.reset();
						bulkUpdateFrom.findField('FromSerialNumber').validate();
						bulkUpdateFrom.findField('ToSerialNumber').validate();
					}
				},
				modal: true
			});
			this.bulkUpdateWin = window;
		}
		this.bulkUpdateWin.show();
	},
	bulkUpdate: function () {
		var form = this.bulkUpdateFrom.getForm();
		var formValues = form.getValues();
		var fromSerialNumber = formValues.FromSerialNumber;
		var toSerialNumber = formValues.ToSerialNumber;
		var smartDeviceTypeId = formValues.SmartDeviceTypeId;
		var clientId = formValues.ClientId;
		var statusId = formValues.StatusId;
		var clientStore = this.comboStores.Client, index, data, timeZoneId = 0;
		if (!Ext.isEmpty(clientId)) {
			index = clientStore.findExact('LookupId', Number(clientId));
			data = clientStore.getAt(index);
			timeZoneId = data.get('CustomValue');
		}
		if (!Ext.isEmpty(fromSerialNumber) && Ext.isEmpty(toSerialNumber)) {
			Ext.Msg.alert('Alert', 'Please correct data errors before continuing');
			return;
		}
		if (Ext.isEmpty(fromSerialNumber) && !Ext.isEmpty(toSerialNumber)) {
			Ext.Msg.alert('Alert', 'Please correct data errors before continuing');
			return;
		}

		//if (!form.isValid()) {
		//	Ext.Msg.alert('Alert', 'Please correct data errors before continuing');
		//	return;
		//}
		if (parseInt(fromSerialNumber) > parseInt(toSerialNumber)) {
			Ext.MessageBox.alert('Alert', '"Serial Number To" must be greater then "Serial Number From" ');
			form.findField('FromSerialNumber').reset();
			form.findField('ToSerialNumber').reset();
			return false;
		}
		if (!clientId && !statusId) {
			Ext.MessageBox.alert('Alert', 'Please select "CoolerIoT Client" or "Status" to update');
			return false;
		}

		Ext.Msg.confirm('Update', 'Are you sure you want to update all the records with current criteria?', function (btn) {
			if (btn == 'yes') {
				var params = {
					action: 'bulkUpdate',
					fromSerialNumber: fromSerialNumber,
					toSerialNumber: toSerialNumber,
					smartDeviceTypeId: smartDeviceTypeId,
					clientId: clientId,
					statusId: statusId,
					timeZoneId: timeZoneId,
				};
				Ext.Ajax.request({
					url: EH.BuildUrl('SmartDevice'),
					params: params,
					success: function (response, success) {
						form.reset();
						this.bulkUpdateWin.hide();
						this.grid.store.reload();
						Ext.Msg.alert('Success', Ext.decode(response.responseText).data);
					},
					failure: function () {
						form.reset();
						this.bulkUpdateWin.hide();
						Ext.Msg.alert('Error', 'Records update failed..Try again.');
					},
					scope: this
				});
			}
		}, this);
	},

	bulkUpdateCommand: function (data, config, values) {
		var smartDeviceType_CommandId = '';
		var command_Value = '';
		var isRadioByExcel = Ext.getCmp('radioByExcel');
		this.isRadioByExcel = isRadioByExcel
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		var me = this, valueField = me.commandPanel.items.items[3];
		var smartDeviceTypeId = this.commandPanel.items.items[2].value;
		me.bulkCommandWin.allowHide = true;
		//me.bulkCommandWin.allowHide = true;
		var comboCustomValue = me.commandCombo.getStore().getAt(me.commandCombo.selectedIndex).get('CustomValue');
		var config = me.getFormFields(comboCustomValue);
		if (comboCustomValue == Cooler.Enums.SmartDeviceCommandType.SET_SH_APN) {
			var mainsTaskIntervalFields = me.commandFieldSet.items.items[0].items.items;
			var batteryTaskIntervalFields = me.batteryTaskIntervalFieldSetConfig.items.items[0].items.items;
			var mainsIntervalArray = me.grid.baseParams.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekFFM2BB ? [this.commandDataTypes.Byte, this.commandDataTypes.Short, this.commandDataTypes.Short, this.commandDataTypes.Byte, this.commandDataTypes.Byte] : [this.commandDataTypes.Byte, this.commandDataTypes.Short, this.commandDataTypes.Short, this.commandDataTypes.Short];
			var batteryIntervalArray = batteryTaskIntervalFields.length == 3 ? [this.commandDataTypes.Byte, this.commandDataTypes.Short, this.commandDataTypes.Short] : [this.commandDataTypes.Byte, this.commandDataTypes.Short, this.commandDataTypes.Short, this.commandDataTypes.Short];
			var dataTypeArray = [mainsIntervalArray, batteryIntervalArray]

			var fieldsArray = [mainsTaskIntervalFields, batteryTaskIntervalFields];
			var subCommandArray = [3, 4, 6];
			var values = [];
			for (var j = 0; j < fieldsArray.length; j++) {
				var formValid = true;
				var fieldValues = [];
				var value = { command: config.command };
				for (var i = 0; i < fieldsArray[j].length; i++) {
					var field = fieldsArray[j][i];
					if (!field.isValid()) {
						formValid = false;
					}

					var fieldValue;
					fieldValue = field.getValue();
					fieldValues.push(fieldValue);
				}

				if (fieldValues.length > 0 && formValid) {
					value["dataTypes"] = dataTypeArray[j];
					value["SubCommand"] = fieldValues[0] == "6" ? subCommandArray[2] : subCommandArray[j];

					value["data"] = fieldValues;
					valueField.setValue(Ext.encode(value));
					values.push(Ext.encode(value));

				}
			}

			if (values.length > 0) {
				var baseParams = this.grid.baseParams;
				this.saveHubConfiguration(this, baseParams, values);
			}

		}
		else if (comboCustomValue == Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION) {
			var beaconFrameTypeFields = me.commandFieldSetBeaconFrameConfiguration.items.items[0].items.items;
			var beaconFrameTypeFieldsParam0 = beaconFrameTypeFields.slice(0, 8);

			var beaconFrameFields = me.commandFieldSet.items.items[0].items.items;

			var beaconConfigurationFieldsParam1 = beaconFrameFields.slice(0, 1);
			var beaconConfigurationFieldsParam2 = beaconFrameFields.slice(1, 4);
			var beaconConfigurationFieldsParam3 = beaconFrameFields.slice(4, beaconFrameFields.length);


			var uidConfigurationFields = me.commandFieldSetEddyStoneUIDConfig.items.items[0].items.items;
			var uidConfigurationFieldsParam1 = uidConfigurationFields.slice(0, 2);
			var uidConfigurationFieldsParam2 = uidConfigurationFields.slice(2, uidConfigurationFields.length);

			var urlConfigurationFields = me.commandFieldSetEddyStoneURLConfig.items.items[0].items.items;
			var urlConfigurationFieldsParam1 = urlConfigurationFields.slice(0, 1);
			var urlConfigurationFieldsParam2 = urlConfigurationFields.slice(1, urlConfigurationFields.length);

			var tlmConfigurationFields = me.commandFieldSetEddyStoneTLMConfig.items.items[0].items.items;
			var tlmConfigurationFieldsParam1 = tlmConfigurationFields.slice(0, urlConfigurationFields.length);

			var fieldsArray = [beaconFrameTypeFieldsParam0, beaconConfigurationFieldsParam1, beaconConfigurationFieldsParam2, beaconConfigurationFieldsParam3, uidConfigurationFieldsParam1, uidConfigurationFieldsParam2, urlConfigurationFieldsParam1, urlConfigurationFieldsParam2, tlmConfigurationFieldsParam1];
			var beaconFrameDataTypes = [this.commandDataTypes.Byte, this.commandDataTypes.Byte, this.commandDataTypes.Byte, this.commandDataTypes.Byte, this.commandDataTypes.Byte, this.commandDataTypes.Byte, this.commandDataTypes.Byte, this.commandDataTypes.Byte];

			var beaconConfigurationParam0DataTypes = [this.commandDataTypes.Byte];
			var beaconConfigurationParam1DataTypes = [this.commandDataTypes.String];
			var beaconConfigurationParam2DataTypes = [this.commandDataTypes.UShort, this.commandDataTypes.UShort, this.commandDataTypes.SByte];
			var beaconConfigurationParam3DataTypes = [this.commandDataTypes.SByte, this.commandDataTypes.Short, this.commandDataTypes.SByte, this.commandDataTypes.Short];

			var uidConfigurationParam1DataTypes = [this.commandDataTypes.String, this.commandDataTypes.String];
			var uidConfigurationParam2DataTypes = [this.commandDataTypes.SByte, this.commandDataTypes.Short, this.commandDataTypes.SByte, this.commandDataTypes.Short];

			var urlConfigurationParam1DataTypes = [this.commandDataTypes.URL];
			var urlConfigurationParam2DataTypes = [this.commandDataTypes.SByte, this.commandDataTypes.Short, this.commandDataTypes.SByte, this.commandDataTypes.Short];

			var tlmConfigurationParam1DataTypes = [this.commandDataTypes.SByte, this.commandDataTypes.Short, this.commandDataTypes.SByte, this.commandDataTypes.Short];

			var dataTypeArray = [beaconConfigurationParam0DataTypes, beaconConfigurationParam1DataTypes, beaconConfigurationParam2DataTypes, beaconConfigurationParam3DataTypes, uidConfigurationParam1DataTypes, uidConfigurationParam2DataTypes, urlConfigurationParam1DataTypes, urlConfigurationParam2DataTypes, tlmConfigurationParam1DataTypes];

			var subCommandArray = [1, 2, 2, 2, 3, 3, 4, 4, 5];
			var parameterId = [1, 1, 2, 3, 1, 3, 1, 3, 3];
			var enabledFrameCommandExecuted = false;
			var values = [];
			for (var j = 0; j < fieldsArray.length; j++) {
				var formValid = true;
				var fieldValues = [];
				var value = { command: config.command };
				for (var i = 0; i < fieldsArray[j].length; i++) {
					var field = fieldsArray[j][i];
					if (!field.isValid()) {
						if (j == 0) {
							formValid = true;
						}
						else {
							formValid = false;
						}
					}
					var fieldValue;
					if (j == 0) {
						if (!Ext.isEmpty(field.getValue()) && !enabledFrameCommandExecuted) {
							enabledFrameCommandExecuted = true;
							var insertCommnd = true;
							fieldValue = field.getValue() ? 1 : 0;
							var beaconFrame = fieldsArray[0][0];
							var uidFrame = fieldsArray[0][1];
							var urlFrame = fieldsArray[0][2];
							var tlmFrame = fieldsArray[0][3];
							var esBeaconFrame = fieldsArray[0][4];
							var esUidFrame = fieldsArray[0][5];
							var esUrlFrame = fieldsArray[0][6];
							var esTlmFrame = fieldsArray[0][7];
							if (beaconFrame.getValue() === "" || uidFrame.getValue() === "" || urlFrame.getValue() === "" || tlmFrame.getValue() === "" || esBeaconFrame.getValue() === "" || esUidFrame.getValue() === "" || esUrlFrame.getValue() === "" || esTlmFrame.getValue() === "") {
								insertCommnd = false;
							}
							if (insertCommnd) {
								fieldValues.push(beaconFrame.getValue() ? 1 : 0);
								fieldValues.push(uidFrame.getValue() ? 1 : 0);
								fieldValues.push(urlFrame.getValue() ? 1 : 0);
								fieldValues.push(tlmFrame.getValue() ? 1 : 0);
								fieldValues.push(esBeaconFrame.getValue() ? 1 : 0);
								fieldValues.push(esUidFrame.getValue() ? 1 : 0);
								fieldValues.push(esUrlFrame.getValue() ? 1 : 0);
								fieldValues.push(esTlmFrame.getValue() ? 1 : 0);
								value["dataTypes"] = [1, 1, 1, 1, 1, 1, 1, 1];
								value["SubCommand"] = 1;
								value["parameterId"] = 1;
							}
							i = 7;
						}
					}
					else {
						fieldValue = field.getValue();
						fieldValues.push(fieldValue);
					}

				}
				if (fieldValues.length > 0 && formValid) {
					if (j == 0) {
						//To Do;
					}
					else {
						value["dataTypes"] = dataTypeArray[j];
						value["SubCommand"] = subCommandArray[j];
						if (parameterId[j] != 0) {
							value["parameterId"] = parameterId[j];
						}
					}
					value["data"] = fieldValues;
					valueField.setValue(Ext.encode(value));
					values.push(Ext.encode(value));

				}
			}
			if (values.length > 0) {
				var baseParams = this.grid.baseParams;
				this.saveEddyStoneConfiguration(this, baseParams, values);
			}
		}
		else if (comboCustomValue == Cooler.Enums.SmartDeviceCommandType.SET_DOOR_OPEN_COUNT) {
			var dataTypes = config.dataType;
			var value = { command: config.command };
			var fields = [];//me.commandFieldPanel && dataTypes.length > 0 ? me.commandFieldPanel.items.items : [];
			var doorOpenOptionSelected = false;
			if (!me.doorOpenFieldSetConfig.hidden) {
				doorOpenOptionSelected = true;
				fields.push.apply(fields, me.doorOpenFieldSetConfig.items.items[0].items.items);
				fields.push.apply(fields, me.commandFieldSet.items.items[0].items.items);
			}
			if (!me.timeFieldSetConfig.hidden) {
				fields.push.apply(fields, me.doorOpenFieldSetConfig.items.items[0].items.items);
				fields.push.apply(fields, me.commandFieldSet.items.items[0].items.items);
				fields.push.apply(fields, me.timeFieldSetConfig.items.items[0].items.items);
			}
			if (!me.dateTimeFieldSetConfig.hidden) {
				var currentDateTime = new Date();
				var len = me.dateTimeFieldSetConfig.items.items[0].items.items.length;
				var records = me.dateTimeFieldSetConfig.items.items[0].items.items;
				var daysRange; // 7 days range
				for (var j = 0; j < 3; j++) {
					var fieldDate = records[j].getValue();
					var diff = fieldDate.getTime() - currentDateTime.getTime();

					diff = Math.floor(diff / 1000 / 60);
					if (diff <= 0) {
						Ext.Msg.alert("Info", "Selected date time can not less than current date time");
						return;
					}
					else {
						daysRange = records[0].getValue().add(Date.DAY, 7); // Add 7 days to first selected Date

					}
					var diff = fieldDate.getTime() - daysRange.getTime();
					diff = Math.floor(diff / 1000 / 60);
					if (diff >= 0) {
						Ext.Msg.alert("Info", "Selected date time slot must be within 7 days");
						return;
					}
					if (j > 0) {

						var diff = records[j].getValue().getTime() - records[j - 1].getValue().getTime();
						diff = Math.floor(diff / 1000 / 60);
						if (diff <= 0) {
							Ext.Msg.alert("Info", "Selected 'Image Time" + (j + 1).toString() + "' must be greater then 'Image Time" + j.toString() + "'");
							return;
						}
					}
				}
				fields.push.apply(fields, me.doorOpenFieldSetConfig.items.items[0].items.items);
				fields.push.apply(fields, me.commandFieldSet.items.items[0].items.items);
				fields.push.apply(fields, me.dateTimeFieldSetConfig.items.items[0].items.items);
			}
			var fieldValues = [];

			for (var i = 0; i < fields.length; i++) {
				var field = fields[i];
				if (!field.isValid()) {
					return;
				}
				var fieldValue = field.getValue();
				var date = '';
				if (dataTypes[i] === this.commandDataTypes.ImageCaptureModeDateTime) {
					if (fieldValue.length == 8) {
						date = field.parseDate(field.getValue());
					}
					else {
						date = new Date(fieldValue);
					}
					var formattedDate = date.format('m/d/Y h:i:s A');
					fieldValue = formattedDate;
				}
				fieldValues.push(fieldValue);
				if (i == 1 && doorOpenOptionSelected) {
					if (doorOpenOptionSelected) {
						for (var j = 0; j <= 3; j++) {
							if (j == 3) {
								fieldValues.push(0);
							}
							else {
								var date = new Date();
								var formattedDate = date.format('m/d/Y h:i:s A');
								fieldValue = formattedDate;
								fieldValues.push(fieldValue);
							}
						}
					}
				}
			}

			value["data"] = fieldValues;
			value["dataTypes"] = dataTypes;
			//valueField.setValue(Ext.encode(value));
			if (this.isRadioByExcel.checked || this.isRadioBySmartDeviceType.checked) {
				valueField.setValue(valueField.lastSelectionText);

			}
			else {
				valueField.setValue(Ext.encode(value));
			}

			var record = null;
			var id = me.formData.Id;
			if (id === 0) {
				var baseParams = this.grid.baseParams;
				if (this.isRadioByExcel.checked) {
					smartDeviceType_CommandId = comboCustomValue;
					this.smartDeviceType_CommandId = smartDeviceType_CommandId;
					command_Value = Ext.encode(value);
					this.command_Value = command_Value;
					this.mask.hide();
				}
				else {
					params = {
						action: 'bulkInsertSmartDeviceCommand',
						smartDeviceTypeId: smartDeviceTypeId,
						smartDeviceTypeCommandId: comboCustomValue,
						//commandValue: valueField.getValue()
						commandValue: Ext.encode(value)
					};
					Ext.Ajax.request({
						url: EH.BuildUrl('SmartDevice'),
						params: params,
						success: function (response, success) {
							this.grid.getStore().load();
							this.mask.hide();
							Ext.Msg.alert('Success', Ext.decode(response.responseText).records);
						},
						failure: function () {
							Ext.Msg.alert('Error', 'Record not save..Try again.');
						},
						scope: this
					});
				}
			}
			else {
				var index = store.findExact('Id', me.formData.Id);
				record = store.getAt(index);
				record.set('SmartDeviceId', 1);
				record.set('SmartDeviceTypeCommandId', me.commandCombo.getValue());
				record.set('Value', valueField.getValue());
			}
		}
		else if (comboCustomValue == Cooler.Enums.SmartDeviceCommandType.SET_POWER_SAVING_TIME) {
			var fieldValues = [];
			var value = { command: config.command };
			var values = [];
			value["SubCommand"] = 1;
			var startTimeTotalMinutes = 65535;
			var endTimeTotalMinutes = 65535;
			var powerSavingTypeModeFields = me.commandFieldSet.items.items[0].items.items;
			if (powerSavingTypeModeFields[0].getValue() == 0) {
				var powerSavingTime = me.setPowerSavingTime.items.items[0].items.items;
				var powerSavingStartTime = powerSavingTime.slice(0, 1);
				var powerSavingEndTime = powerSavingTime.slice(1, 2);
				var startTimeValue = powerSavingStartTime[0].getValue();
				var endTimeValue = powerSavingEndTime[0].getValue();


				var parts = startTimeValue.match(/(\d+)\:(\d+)/);
				var hours = (parseInt(parts[1], 10));
				var minutes = parseInt(parts[2], 10);
				startTimeTotalMinutes = (hours * 60) + minutes;

				parts = endTimeValue.match(/(\d+)\:(\d+)/);
				hours = (parseInt(parts[1], 10));
				minutes = parseInt(parts[2], 10);
				endTimeTotalMinutes = (hours * 60) + minutes;
			}

			fieldValues.push(startTimeTotalMinutes);
			fieldValues.push(endTimeTotalMinutes);
			value["dataTypes"] = [this.commandDataTypes.UShort, this.commandDataTypes.UShort];
			value["data"] = fieldValues;
			//valueField.setValue(Ext.encode(value));
			if (this.isRadioByExcel.checked || this.isRadioBySmartDeviceType.checked) {
				valueField.setValue(valueField.lastSelectionText);

			}
			else {
				valueField.setValue(Ext.encode(value));
			}
			values.push(Ext.encode(value));

			if (values.length > 0) {
				var baseParams = this.grid.baseParams;
				if (this.isRadioByExcel.checked) {
					smartDeviceType_CommandId = comboCustomValue;
					this.smartDeviceType_CommandId = smartDeviceType_CommandId;
					command_Value = Ext.encode(value);
					this.command_Value = command_Value;
					this.mask.hide();
				}
				else {
					params = {
						action: 'bulkInsertSmartDeviceCommand',
						smartDeviceTypeId: smartDeviceTypeId,
						smartDeviceTypeCommandId: comboCustomValue,
						//commandValue: valueField.getValue()
						commandValue: Ext.encode(value)
					};
					Ext.Ajax.request({
						url: EH.BuildUrl('SmartDevice'),
						params: params,
						success: function (response, success) {
							this.grid.getStore().load();
							this.mask.hide();
							Ext.Msg.alert('Success', Ext.decode(response.responseText).records);
						},
						failure: function () {
							Ext.Msg.alert('Error', 'Record not save..Try again.');
						},
						scope: this
					});
				}
			}

		}
		else if (comboCustomValue == Cooler.Enums.SmartDeviceCommandType.CONTROL_EVENT) {

			var fieldValues = [];
			var value = { command: config.command };
			var values = [];
			value["SubCommand"] = 1;
			var controlEventModeFields = me.commandFieldSet.items.items[0].items.items;
			if (controlEventModeFields.length == 3) {
				var motionEventStatus = controlEventModeFields[0].getValue();
				var healthEventStatus = controlEventModeFields[1].getValue();
				var doorEventStatus = controlEventModeFields[2].getValue();
				var controlEventModBits = '00000';
				if (doorEventStatus == 1) {
					controlEventModBits += '1'
				}
				else {
					controlEventModBits += '0'
				}
				if (healthEventStatus == 1) {
					controlEventModBits += '1'
				}
				else {
					controlEventModBits += '0'
				}
				if (motionEventStatus == 1) {
					controlEventModBits += '1'
				}
				else {
					controlEventModBits += '0'
				}
				var intValueofBits = Cooler.ConvertBaseBin2dec(controlEventModBits);
				fieldValues.push(intValueofBits);
				value["dataTypes"] = [this.commandDataTypes.Byte];
				value["data"] = fieldValues;
				//valueField.setValue(Ext.encode(value));
				if (this.isRadioByExcel.checked || this.isRadioBySmartDeviceType.checked) {
					valueField.setValue(valueField.lastSelectionText);

				}
				else {
					valueField.setValue(Ext.encode(value));
				}
				values.push(Ext.encode(value));
			}
			if (values.length > 0) {
				var baseParams = this.grid.baseParams;
				if (this.isRadioByExcel.checked) {
					smartDeviceType_CommandId = comboCustomValue;
					this.smartDeviceType_CommandId = smartDeviceType_CommandId;
					command_Value = Ext.encode(value);
					this.command_Value = command_Value;
					this.mask.hide();
				}
				else {
					params = {
						action: 'bulkInsertSmartDeviceCommand',
						smartDeviceTypeId: smartDeviceTypeId,
						smartDeviceTypeCommandId: comboCustomValue,
						//commandValue: valueField.getValue()
						commandValue: Ext.encode(value)
					};
					Ext.Ajax.request({
						url: EH.BuildUrl('SmartDevice'),
						params: params,
						success: function (response, success) {
							this.grid.getStore().load();
							this.mask.hide();
							Ext.Msg.alert('Success', Ext.decode(response.responseText).records);
						},
						failure: function () {
							Ext.Msg.alert('Error', 'Record not save..Try again.');
						},
						scope: this
					});
				}
			}
		}
		else {
			var dataTypes = config.dataType;
			var value = { command: config.command };
			var fields = me.commandFieldPanel && dataTypes.length > 0 ? me.commandFieldPanel.items.items : [];
			var fieldValues = [];
			for (var i = 0; i < fields.length; i++) {
				var field = fields[i];
				if (!field.isValid()) {
					return;
				}
				var fieldValue = field.getValue();
				if (dataTypes[i] === this.commandDataTypes.DateTime) {
					var date = new Date(fieldValue);
					var formattedDate = date.format('m/d/Y h:i:s A');
					fieldValue = formattedDate;
				}
				fieldValues.push(fieldValue);

			}
			value["data"] = fieldValues;
			value["dataTypes"] = dataTypes;
			if (this.isRadioByExcel.checked || this.isRadioBySmartDeviceType.checked) {
				valueField.setValue(valueField.lastSelectionText);

			}
			else {
				valueField.setValue(Ext.encode(value));
			}


			if (this.isRadioByExcel.checked) {
				smartDeviceType_CommandId = comboCustomValue;
				this.smartDeviceType_CommandId = smartDeviceType_CommandId;
				command_Value = Ext.encode(value);
				this.command_Value = command_Value;
				this.mask.hide();
			}
			else {
				params = {
					action: 'bulkInsertSmartDeviceCommand',
					smartDeviceTypeId: smartDeviceTypeId,
					smartDeviceTypeCommandId: comboCustomValue,
					commandValue: Ext.encode(value)
				};
				Ext.Ajax.request({

					url: EH.BuildUrl('SmartDevice'),
					params: params,
					success: function (response, success) {
						this.grid.getStore().load();
						this.mask.hide();
						Ext.Msg.alert('Success', Ext.decode(response.responseText).records);
					},
					failure: function () {
						Ext.Msg.alert('Error', 'Record not save..Try again.');
					},
					scope: this
				});
			}



		}
		if (this.isRadioByExcel.checked) {
			this.FileUploader.Show(this);
		}

		if (!this.isRadioByExcel.checked) {
			me.bulkCommandWin.hide();
		}
	},

	serialBulkUpdate: function () {
		var form = this.bulkUpdateFrom.getForm();
		var formValues = form.getValues();
		var fromSerialNumber = formValues.FromSerialNumber;
		var toSerialNumber = formValues.ToSerialNumber;
		var clientId = formValues.ClientId;
		var shippedCountryId = formValues.ShippedCountryId;
		var clientStore = this.comboStores.Client, index, data, timeZoneId = 0;
		if (!Ext.isEmpty(clientId)) {
			index = clientStore.findExact('LookupId', Number(clientId));
			data = clientStore.getAt(index);
			timeZoneId = data.get('CustomValue');
		}
		var serialNumberForBulkUpdate = formValues.SerialNumberForBulkUpdate;
		var orderSerialForBulkUpdate = formValues.OrderSerialForBulkUpdate;
		if (Ext.isEmpty(orderSerialForBulkUpdate) && Ext.isEmpty(serialNumberForBulkUpdate)) {
			Ext.Msg.alert('Alert', 'Please correct data errors before continuing');
			return;
		}
		if (!Ext.isEmpty(orderSerialForBulkUpdate) && !Ext.isEmpty(serialNumberForBulkUpdate)) {
			Ext.Msg.alert('Alert', 'Please enter value for one field only.');
			return;
		}
		if (!clientId) {
			Ext.MessageBox.alert('Alert', 'Please select "CoolerIoT Client"');
			return false;
		}
		if (serialNumberForBulkUpdate.split(',').length > 1000) {
			Ext.MessageBox.alert('Alert', 'Serial Number can not be more than 1000.');
			return false;
		}
		if (orderSerialForBulkUpdate.split(',').length > 1000) {
			Ext.MessageBox.alert('Alert', 'Serial Number can not be more than 1000.');
			return false;
		}
		Ext.Msg.confirm('Update', 'Are you sure you want to update all the records with current criteria?', function (btn) {
			if (btn == 'yes') {
				var params = {
					action: 'bulkUpdate',
					fromSerialNumber: fromSerialNumber,
					toSerialNumber: toSerialNumber,
					clientId: clientId,
					timeZoneId: timeZoneId,
					serialBulkUpdate: !Ext.isEmpty(serialNumberForBulkUpdate),
					serialNumberForBulkUpdate: serialNumberForBulkUpdate,
					orderSerialBulkUpdate: !Ext.isEmpty(orderSerialForBulkUpdate),
					orderSerialForBulkUpdate: orderSerialForBulkUpdate,
					shippedCountryId: shippedCountryId
				};
				Ext.Ajax.request({
					url: EH.BuildUrl('SmartDevice'),
					params: params,
					success: function (response, success) {
						form.reset();
						this.bulkUpdateWin.hide();
						this.grid.store.reload();
						Ext.Msg.alert('Success', Ext.decode(response.responseText).data);
					},
					failure: function () {
						form.reset();
						this.bulkUpdateWin.hide();
						Ext.Msg.alert('Error', 'Records update failed..Try again.');
					},
					scope: this
				});
			}
		}, this);
	},
	showPassword: function () {
		Ext.Ajax.request({
			url: EH.BuildUrl('SmartDevice'),
			params: {
				action: 'getPassword',
				smartDeviceId: this.activeRecordId
			},
			success: this.onSuccess,
			failure: function () {
				Ext.Msg.alert('Error', 'An error occured while fetching password');
			},
			scope: this
		});
	},
	onSuccess: function (response) {
		res = Ext.decode(response.responseText);
		if (!this.passwordWin && !this.passwordField) {
			this.passwordField = new Ext.form.TextField({ fieldLabel: 'Password', name: 'Password', maxLength: 100, disabled: true });
			this.passwordWin = new Ext.Window({
				width: 150,
				height: 50,
				modal: true,
				resizable: false,
				title: 'Password',
				items: [this.passwordField],
				closeAction: 'hide',
			}, this);
		}
		this.passwordField.setValue(res.data);
		this.passwordWin.show();
	},

	onLocationComboChange: function (combo, newValue, oldValue) {
		if (!newValue) {
			delete this.assetCombo.baseParams.scopeId;
			this.assetCombo.getStore().load();
		}
		else {
			this.assetCombo.setValue('');
			this.assetCombo.baseParams.scopeId = newValue;
			this.assetCombo.getStore().load();
		}
	},

	onAssetComboChange: function (combo, record, newValue) {
		if (record) {
			var store = combo.getStore()
			var index = store.find('LookupId', record);
			if (index != -1 && combo.getValue() != '') {
				var data = store.getAt(index).data;
				var locationId = data.Description;
				this.locationCombo.setValue(locationId);
				this.assetCombo.baseParams.scopeId = locationId;
				this.assetCombo.getStore().load();
			}

		}
	},
	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var tagsPanel = Cooler.Tag();
		this.tagsPanel = tagsPanel;
		var passwordButton = new Ext.Button({ text: 'Show Password', border: false, handler: this.showPassword, scope: this, hidden: Number(DA.Security.info.Tags.IsClientRole) != 0 });
		var deviceTypeCombo = DA.combo.create({ fieldLabel: 'Device Type', hiddenName: 'SmartDeviceTypeId', id: 'SmartDeviceType', allowBlank: false, baseParams: { comboType: 'SmartDeviceType' }, controller: "Combo", disabled: disableFieldsOnClientId });
		var installationAssetField = new Ext.form.Hidden({ name: 'InstallationAssetId' });
		var firmwareVersion = new Ext.form.TextField({ fieldLabel: 'Firmware Version', name: 'FirmwareVersion', maxLength: 250, disabled: true });
		this.assetCombo = DA.combo.create({
			fieldLabel: 'Linked with Asset', hiddenName: 'LinkedAssetId', controller: 'combo', baseParams: { comboType: 'Asset' }, listWidth: 220, controller: "Combo", listeners: {
				blur: Cooler.changeTimeZone,
				change: this.onAssetComboChange,
				scope: this
			}
		});
		var oldLinkedAssetId = new Ext.form.Hidden({ name: 'OldLinkedAssetId' });
		this.oldLinkedAssetId = oldLinkedAssetId;
		this.locationCombo = DA.combo.create({
			fieldLabel: 'Location', hiddenName: 'SmartDeviceLocationId', baseParams: { comboType: 'Location' }, listWidth: 230, controller: "Combo", listeners: {
				blur: Cooler.changeTimeZone,
				change: this.onLocationComboChange,
				scope: this
			}
		}),
			config.tbar.push(passwordButton);
		//add this so that if required we can use this
		var isAdmin = DA.Security.info.IsAdmin;
		var IsAdminOrIsSupportClientAdmin = false;
		if (DA.Security.info.Roles['Admin'] || DA.Security.info.Roles['Support ClientAdmin']) {
			IsAdminOrIsSupportClientAdmin = true;
		}
		var customSettings = new Ext.form.TextArea({ fieldLabel: 'Custom Settings', name: 'CustomSettings', width: 200, height: 40 });
		var iBeaconMajor = new Ext.form.NumberField({ fieldLabel: 'IBeacon Major', name: 'IBeaconMajor', disabled: true, minValue: Cooler.Enums.ValidMinorMajor.MinMajor });
		var iBeaconMinor = new Ext.form.NumberField({ fieldLabel: 'IBeacon Minor', name: 'IBeaconMinor', disabled: true, minValue: Cooler.Enums.ValidMinorMajor.MinMinor, maxValue: Cooler.Enums.ValidMinorMajor.MaxMinor });
		var iBeaconUuid = new Ext.form.TextField({ fieldLabel: 'IBeacon Uuid', name: 'IBeaconUuid', maxLength: 100, disabled: !isAdmin, width: 130 });
		var shippedCountryCombo = DA.combo.create({ fieldLabel: 'Shipped Country', name: 'ShippedCountryId', hiddenName: 'ShippedCountryId', disabled: !IsAdminOrIsSupportClientAdmin, controller: 'combo', baseParams: { comboType: 'ShippedCountry' }, listWidth: 220 });
		var firstColumn = [
			{ fieldLabel: 'Mac Address', name: 'MacAddress', xtype: 'textfield', maxLength: 250, allowBlank: false, disabled: disableFieldsOnClientId },
			{ fieldLabel: 'Serial Number', name: 'SerialNumber', xtype: 'textfield', maxLength: 50, allowBlank: false, disabled: disableFieldsOnClientId },
			{ fieldLabel: 'Password', name: 'PasswordHash', xtype: 'textfield', inputType: 'password', maxLength: 50, allowBlank: false, disabled: disableFieldsOnClientId },
			firmwareVersion,
			{ fieldLabel: 'Manufacturer Serial Number', name: 'ManufacturerSerialNumber', xtype: 'textfield', maxLength: 250, disabled: disableFieldsOnClientId },
			//customSettings,//Hiding these as per ticket #2943
			DA.combo.create({ fieldLabel: 'Time Zone', hiddenName: 'TimeZoneId', itemId: 'TimeZoneId', allowBlank: false, baseParams: { comboType: 'TimeZone' }, controller: "Combo", listWidth: 280 }),
			{ fieldLabel: 'IMEI', name: 'Imei', xtype: 'textfield', maxLength: 20 },
			{ fieldLabel: 'Sim#', name: 'SimNum', xtype: 'textfield', maxLength: 20 },
			tagsPanel,
			{ fieldLabel: 'Advertisement URL', name: 'AdvertisementURL', xtype: 'textarea' }
		];
		var secondColumn = [
			deviceTypeCombo,
			installationAssetField,
			DA.combo.create({
				fieldLabel: 'Gateway', hiddenName: 'GatewayId', baseParams: { comboType: 'SmartDevice', scopeId: 1 }, controller: "Combo", listWidth: 220, forceSelection: true,
				listeners: {
					select: this.gatewayChange,
					scope: this

				}

			}),
			DA.combo.create({ fieldLabel: 'Status', hiddenName: 'StatusId', allowBlank: false, baseParams: { comboType: 'SmartDeviceStatus' }, controller: "Combo", listWidth: 220 }),
			this.locationCombo,
			this.assetCombo,
			DA.combo.create({
				fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' }, disabled: disableFieldsOnClientId, listeners: {
					change: Cooler.changeTimeZone,
					scope: this
				}
			}),
			iBeaconMajor,
			iBeaconMinor,
			iBeaconUuid,
			oldLinkedAssetId,
			shippedCountryCombo,
			DA.combo.create({ fieldLabel: 'Relay Status', hiddenName: 'RelayStatus', store: [[1, 'On'], [0, 'Off']] }),//Hiding these as per ticket #2943
		];
		var column = {
			layout: 'column',
			region: 'center',
			border: false,
			defaults: {
				layout: 'form',
				border: false,
				height: 400
			},
			items: [
				{ items: firstColumn, defaults: { width: 200 }, columnWidth: .5 },
				{ items: secondColumn, defaults: { width: 200 }, columnWidth: .5 }
			]
		};
		Ext.apply(config, {
			items: column,
			autoScroll: true
		});
		return config;
	},


	CreateFormPanel: function (config) {
		Ext.apply(config, {
			region: 'center'
		});

		this.formPanel = new Ext.FormPanel(config);
		this.formPanel.getForm().on('beforeException', this.showExceptionMessage, this);
		this.on('beforeload', function (param) {
			this.tagsPanel.removeAllItems();
			var checkForGateway = false;
			this.checkForGateway = checkForGateway;
		});
		this.on('beforeSave', function (smartDeviceForm, params, options) {
			this.loadNew = options.loadNew
			var form = smartDeviceForm.formPanel.getForm();
			var macAddress = form.findField('MacAddress').getValue();
			var linkedAssetId = form.findField('LinkedAssetId').getValue();
			var smartDeviceType = form.findField('SmartDeviceTypeId');
			var IBeaconUuid = form.findField('IBeaconUuid');
			var smartDeviceTypeId = smartDeviceType.getValue();
			var smartDeviceStatus = form.findField('StatusId');
			var installationAssetId = form.findField('InstallationAssetId');
			this.saveTags(this.tagsPanel, params);
			if (linkedAssetId != 0 && smartDeviceTypeId != 0) {
				if (this.deviceStatus == 1) {
					smartDeviceStatus.setValue(2);
				}
			}
			var smartDeviceTypeStore = smartDeviceType.getStore();
			var record = smartDeviceType.findRecord(smartDeviceTypeId);
			var index = smartDeviceType.store.indexOf(record);
			if (index != -1) {
				var isGateway = smartDeviceTypeStore.getAt(index).data.CustomStringValue;
				isGateway = (isGateway == 'true');
				if (!isGateway) {
					installationAssetId.setValue(linkedAssetId);
				}
				else {
					installationAssetId.setValue(0);
				}
			}

			if (IBeaconUuid != undefined && IBeaconUuid.getValue() != "") {
				var newIBeaconUuid = IBeaconUuid.getValue();
				newIBeaconUuid = newIBeaconUuid.replace(/-/g, '');
				IBeaconUuid.setValue(newIBeaconUuid);
			}
			else if (IBeaconUuid.getValue() == "") {
				IBeaconUuid.setValue('48F8C9EFAEF9482D987F3752F1C51DA1');
			}

			if (!Cooler.MacAdddressRegExp.test(macAddress)) {
				Ext.Msg.alert('Mac Address', 'Please enter mac address in correct format');
				return false;
			}
		});

		this.on('dataloaded', function (smartDeviceForm, params, options) {
			var deviceStatus = params.data.StatusId;
			this.deviceStatus = deviceStatus;
			this.loadTags(this.tagsPanel, params);
			this.oldLinkedAssetId.setValue(params.data.LinkedAssetId);
		});

	},
	showExceptionMessage: function (obj, response, message) {
		if (message) {
			if (message.indexOf('IX_SmartDevice_LinkedAssetId_GatewayUniqueId') > -1) {
				Ext.Msg.show({
					title: 'Alert',
					msg: 'Selected Asset already associated with Gateway/Hub. Do you want to override it',
					buttons: Ext.Msg.YESNO,
					scope: this,
					animEl: 'elId',
					fn: this.processResult
				});
			}
		}
	},

	processResult: function (btn, a, b) {
		var form = this.formPanel.getForm();
		var assetCombo = form.findField('LinkedAssetId');
		var smartDeviceTypeField = form.findField('SmartDeviceTypeId');
		var store = assetCombo.getStore();
		var startValue = assetCombo.startValue;
		var newValue = assetCombo.getValue();
		var selectionRecord = this.grid.getSelectionModel().getSelected();   // we always get selected row here
		if (btn == 'yes') {
			if (!this.updateMask) {
				this.updateMask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			}
			Cooler.setTimeZone(store, startValue, newValue, this);
			this.updateAssetGateway(newValue, selectionRecord.get('SmartDeviceId'), smartDeviceTypeField.getValue()); // Here we are updating AssetId in case of gateways
		}
		else {
			ExtHelper.SetComboValue(assetCombo, startValue);
			Cooler.setTimeZone(store, startValue, assetCombo.hiddenName, this);
		}
	},

	//This function update AssetId in case of gateways
	updateAssetGateway: function (assetId, smartDeviceId, smartDeviceTypeId) {
		this.updateMask.show();
		Ext.Ajax.request({
			url: EH.BuildUrl('SmartDevice'),
			params: {
				action: 'updateAssetGateway',
				assetId: assetId,
				smartDeviceId: smartDeviceId,
				smartDeviceTypeId: smartDeviceTypeId
			},
			success: this.onUpdateAssetSuccess,
			failure: function () {
				this.updateMask.hide();
				Ext.Msg.alert('Error', 'An error occurred during updating Asset Gateway/Hub');
			},
			scope: this
		});
	},

	onUpdateAssetSuccess: function () {
		if (this.win) {
			if (this.loadNew) {
				this.saveHandler({ loadNew: true });
			}
			else {
				this.saveHandler({ validate: true, close: true });
			}
			this.updateMask.hide();
		}
	},

	gatewayChange: function (combo, record, index) {
		if (this.checkForGateway == true) {
			if (record != undefined) {

				if (!this.updateMaskForGateway) {
					this.updateMaskForGateway = new Ext.LoadMask(this.formPanel.body, { msg: 'Please wait...' });
				}
				this.updateMaskForGateway.show();
				var smartDeviceId = this.formPanel.form.baseParams.id;
				Ext.Ajax.request({
					url: 'Controllers/SmartDevice.ashx',
					params: { gatewayId: record.data.LookupId, action: 'getCountOfConnectedDevice' },
					success: Cooler.SmartDevice.onGatewayChangeSuccess,
					failure: function (result, request) {
						this.updateMaskForGateway.hide();
						alert(JSON.parse(result.responseText));
					},
					scope: this
				});
			}
		}
		this.checkForGateway = true;
	},

	onGatewayChangeSuccess: function (result, request) {
		this.updateMaskForGateway.hide();
		var response = Ext.decode(result.responseText);
		var count = response.data;
		if (count > 7) {
			var gatewayComboField = this.formPanel.form.findField('GatewayId');
			Ext.MessageBox.show({
				msg: "Allow only 8 devices associate with gateway.",
				buttons: Ext.MessageBox.OKCANCEL,
				fn: function (btn) {
					ExtHelper.SetComboValue(gatewayComboField, this.oldValue);
				},
				scope: this
			});
		}
	},

	// Made onButtonOkClick Event As showBulkUpdateCommandWin from SmartDeviceCommand.js

	// To bulk Command
	showBulkUpdateCommandWin: function () {
		if (!this.bulkCommandWin) {
			//var browse = new Ext.Button({ text: 'Bulk Command By Excel', handler: function () { this.FileUploader.Show() }, id: 'browseComponentId', scope: this, iconCls: 'save' });
			//this.browse = browse;
			//this.browse.disabled = true;

			var btnSave = new Ext.Button({ text: 'Save', handler: this.bulkUpdateCommand, id: 'saveComponentId', scope: this, iconCls: 'save' });
			this.btnSave = btnSave;
			//this.btnSave.disabled = true;

			var smartDeviceTypeCombo = DA.combo.create({
				fieldLabel: 'Device Type',
				name: 'SmartDeviceTypeId',
				hiddenName: 'SmartDeviceTypeId',
				mode: 'local',
				store: Cooler.comboStores.SmartDeviceType,
				width: 150,
				id: 'SmartDeviceTypeComponentId'
			});
			this.smartDeviceTypeCombo = smartDeviceTypeCombo;
			this.smartDeviceTypeCombo.disabled = true;
			smartDeviceTypeCombo.on('select', function (combo, newValue) {
				this.getSmartDeviceCommandValue(newValue);
			}, this);

			var smartDeviceTypeCommandCombo = DA.combo.create({
				fieldLabel: 'Command',
				hiddenName: 'SmartDeviceTypeCommandId',
				name: 'SmartDeviceTypeCommandId',
				listWidth: 220,
				controller: 'combo',
				baseParams: { comboType: 'SmartDeviceTypeCommand' },
				allowBlank: false,
				id: 'SmartDeviceTypeCommandComponentId'
			});
			smartDeviceTypeCommandCombo.on('select', this.commandSelection, this);
			this.smartDeviceTypeCommandCombo = smartDeviceTypeCommandCombo;
			this.smartDeviceTypeCommandCombo.disabled = true;

			var txtCommandValue = new Ext.form.TextField({
				fieldLabel: 'Value',
				name: 'Value',
				xtype: 'textfield',
				id: 'ValueComponentId'
			});
			this.txtCommandValue = txtCommandValue;
			this.txtCommandValue.disabled = true;

			var byExcel = new Ext.form.Radio({
				fieldLabel: 'By Excel',
				name: 'ByExcel',
				xtype: 'radio',
				id: 'radioByExcel'
			});
			byExcel.on('check', this.onSelectionByExcel, this);

			var bySmartDeviceType = new Ext.form.Radio({
				fieldLabel: 'By SmartDevice Type',
				name: 'BySmartDeviceType',
				xtype: 'radio',
				id: 'radioBySmartDeviceType'
			});
			bySmartDeviceType.on('check', this.onSelectionBySmartDeviceType, this);

			var commandPanel = new Ext.Panel({
				layout: 'form',
				bodyStyle: "padding:10px;",
				defaults: { width: 200 },
				autoScroll: true,
				itemId: 'commandPanel',
				items: [
					byExcel,
					bySmartDeviceType,
					smartDeviceTypeCombo,
					smartDeviceTypeCommandCombo,
					txtCommandValue
					
				]
			});
			var fieldset = new Ext.form.FieldSet({
				collapsible: false,
				hidden: true,
				title: 'Test',
				defaults: { border: false, labelWidth: 140 },
				items: [],
				autoHeight: true
			});
			var fieldset1 = new Ext.form.FieldSet({
				collapsible: false,
				hidden: true,
				title: 'Eddystone UID Configuration',
				defaults: { border: false, labelWidth: 120 },
				items: [],
				autoHeight: true
			});

			var fieldset2 = new Ext.form.FieldSet({
				collapsible: false,
				hidden: true,
				title: 'Eddystone URL Configuration',
				defaults: { border: false, labelWidth: 120 },
				items: [],
				autoHeight: true
			});

			var fieldset3 = new Ext.form.FieldSet({
				collapsible: false,
				hidden: true,
				title: 'Eddystone TLM Configuration',
				defaults: { border: false, labelWidth: 120 },
				items: [],
				autoHeight: true
			});

			var fieldset4 = new Ext.form.FieldSet({
				collapsible: false,
				hidden: true,
				title: 'Beacon Frame Configuration',
				defaults: { border: false, labelWidth: 120 },
				items: [],
				autoHeight: true
			});

			var doorOpenFieldSet = new Ext.form.FieldSet({
				collapsible: false,
				hidden: true,
				title: 'Door Open',
				defaults: { border: false, labelWidth: 120 },
				items: [],
				autoHeight: true
			});

			var timeFieldSet = new Ext.form.FieldSet({
				collapsible: false,
				hidden: true,
				title: 'Time',
				defaults: { border: false, labelWidth: 120 },
				items: [],
				autoHeight: true
			});

			var dateTimeFieldSet = new Ext.form.FieldSet({
				collapsible: false,
				hidden: true,
				title: 'Day & Time',
				defaults: { border: false, labelWidth: 120 },
				items: [],
				autoHeight: true
			});

			var batteryTaskIntervalFieldSet = new Ext.form.FieldSet({
				collapsible: false,
				hidden: true,
				title: 'Set Battery Power Task Interval',
				defaults: { border: false, labelWidth: 120 },
				items: [],
				autoHeight: true
			});

			var setPowerSavingTime = new Ext.form.FieldSet({
				collapsible: false,
				hidden: true,
				title: 'Set Power Saving Mode',
				defaults: { border: false, labelWidth: 120 },
				items: [],
				autoHeight: true
			});
			this.commandCombo = smartDeviceTypeCommandCombo;
			this.commandFieldSet = fieldset;
			this.commandFieldSetEddyStoneUIDConfig = fieldset1;

			this.commandFieldSetEddyStoneURLConfig = fieldset2;
			this.commandFieldSetEddyStoneTLMConfig = fieldset3;
			this.commandFieldSetBeaconFrameConfiguration = fieldset4;

			this.doorOpenFieldSetConfig = doorOpenFieldSet;
			this.timeFieldSetConfig = timeFieldSet;
			this.dateTimeFieldSetConfig = dateTimeFieldSet;
			this.setPowerSavingTime = setPowerSavingTime;
			this.batteryTaskIntervalFieldSetConfig = batteryTaskIntervalFieldSet;

			this.commandPanel = commandPanel;

			var items = [
				commandPanel,
				fieldset,
				fieldset1,
				fieldset2,
				fieldset3,
				fieldset4,
				doorOpenFieldSet,
				timeFieldSet,
				dateTimeFieldSet,
				batteryTaskIntervalFieldSet,
				setPowerSavingTime
			];

			var bulkCommandWin = new Ext.Window({
				width: 400,
				height: 300,
				autoScroll: true,
				padding: 10,
				resizable: false,
				constrain: true,
				items: items,
				autoScroll: true,
				closeAction: 'hide',
				tbar: [
					this.btnSave
				],
				modal: true
			});
			this.bulkCommandWin = bulkCommandWin;
		}
		this.smartDeviceTypeCombo.reset();
		this.commandCombo.reset();
		this.txtCommandValue.reset();
		this.bulkCommandWin.show();
	},

	saveEddyStoneConfiguration: function (me, baseParams, values) {
		var me = this, valueField = me.commandPanel.items.items[3];
		var smartDeviceTypeId = this.commandPanel.items.items[2].value;
		var comboCustomValue = me.commandCombo.getStore().getAt(me.commandCombo.selectedIndex).get('CustomValue');
		var param = baseParams;
		var remainingValue = values;
		if (values.length > 0) {
			if (this.isRadioByExcel.checked) {
				smartDeviceType_CommandId = comboCustomValue;
				this.smartDeviceType_CommandId = smartDeviceType_CommandId;
				command_Value = valueField.getValue();
				this.command_Value = command_Value;
				this.mask.hide();
			}
			else {
				params = {
					action: 'bulkInsertSmartDeviceCommand',
					smartDeviceTypeId: smartDeviceTypeId,
					smartDeviceTypeCommandId: comboCustomValue,
					commandValue: values.pop()
				};
				Ext.Ajax.request({
					url: EH.BuildUrl('SmartDevice'),
					params: params,
					success: function (response, success) {
						me.grid.getStore().load();
						this.saveEddyStoneConfiguration(this, param, remainingValue);
						this.mask.hide();
						Ext.Msg.alert('Success', Ext.decode(response.responseText).records);
					},
					failure: function () {
						this.saveEddyStoneConfiguration(this, param, remainingValue);
					},
					scope: this
				});
			}
		}
		if (this.isRadioByExcel.checked) {
			this.FileUploader.Show(this);
		}
	},

	saveHubConfiguration: function (me, baseParams, values) {
		var me = this, valueField = me.commandPanel.items.items[3];
		var smartDeviceTypeId = this.commandPanel.items.items[2].value;
		var comboCustomValue = me.commandCombo.getStore().getAt(me.commandCombo.selectedIndex).get('CustomValue');
		var param = baseParams;
		var remainingValue = values;
		if (values.length > 0) {
			if (this.isRadioByExcel.checked) {
				smartDeviceType_CommandId = comboCustomValue;
				this.smartDeviceType_CommandId = smartDeviceType_CommandId;
				command_Value = valueField.getValue();
				this.command_Value = command_Value;
				this.mask.hide();
			}
			else {
				params = {
					action: 'bulkInsertSmartDeviceCommand',
					smartDeviceTypeId: smartDeviceTypeId,
					smartDeviceTypeCommandId: comboCustomValue,
					commandValue: values.pop()
				};
				Ext.Ajax.request({
					url: EH.BuildUrl('SmartDevice'),
					params: params,
					success: function (response, success) {
						me.grid.getStore().load();
						this.saveHubConfiguration(this, param, remainingValue);
						this.mask.hide();
						Ext.Msg.alert('Success', Ext.decode(response.responseText).records);
					},
					failure: function () {
						this.saveHubConfiguration(this, param, remainingValue);
					},
					scope: this
				});
			}
		}
		if (this.isRadioByExcel.checked) {
			this.FileUploader.Show(this);
		}
	},
	resetCommandPanel: function () {
		var me = this, height = me.winConfig.height;
		me.commandFieldSet.removeAll(true);
		me.commandFieldSet.setVisible(false);
		me.commandFieldSetEddyStoneUIDConfig.setVisible(false);
		me.commandFieldSetEddyStoneUIDConfig.removeAll(true);
		me.commandFieldSetEddyStoneURLConfig.setVisible(false);
		me.commandFieldSetEddyStoneURLConfig.removeAll(true);
		me.commandFieldSetEddyStoneTLMConfig.setVisible(false);
		me.commandFieldSetEddyStoneTLMConfig.removeAll(true);
		me.commandFieldSetBeaconFrameConfiguration.setVisible(false);
		me.commandFieldSetBeaconFrameConfiguration.removeAll(true);
		me.doorOpenFieldSetConfig.setVisible(false);
		me.doorOpenFieldSetConfig.removeAll(true);
		me.timeFieldSetConfig.setVisible(false);
		me.timeFieldSetConfig.removeAll(true);
		me.dateTimeFieldSetConfig.setVisible(false);
		me.dateTimeFieldSetConfig.removeAll(true);
		me.batteryTaskIntervalFieldSetConfig.setVisible(false);
		me.batteryTaskIntervalFieldSetConfig.removeAll(true);
		me.setPowerSavingTime.removeAll(true);
		me.setPowerSavingTime.setVisible(false);
		me.bulkCommandWin.setHeight(height);
	},
	commandSelection: function (combo, record, index, e) {
		if (!record) {
			this.resetCommandPanel();
			return;
		}
		var me = this, height = me.winConfig.height;

		var config = me.getFormFields(record.get('CustomValue'));

		var valueField = me.commandPanel.items.items[4];
		valueField.setValue(Ext.encode({ command: config.command }));

		if (config.fields.length === 0) {
			me.resetCommandPanel();
			return;
		}

		me.commandFieldSet.setVisible(true);

		me.commandFieldSet.removeAll(true);

		if (record.data.CustomValue == Cooler.Enums.SmartDeviceCommandType.SET_SH_APN) {
			me.doorOpenFieldSetConfig.setVisible(false);
			me.doorOpenFieldSetConfig.removeAll(true);
			me.timeFieldSetConfig.setVisible(false);
			me.timeFieldSetConfig.removeAll(true);
			me.dateTimeFieldSetConfig.setVisible(false);
			me.dateTimeFieldSetConfig.removeAll(true);
			me.commandFieldSetEddyStoneUIDConfig.setVisible(false);
			me.commandFieldSetEddyStoneUIDConfig.removeAll(true);
			me.commandFieldSetEddyStoneURLConfig.setVisible(false);
			me.commandFieldSetEddyStoneURLConfig.removeAll(true);
			me.commandFieldSetEddyStoneTLMConfig.setVisible(false);
			me.commandFieldSetEddyStoneTLMConfig.removeAll(true);
			me.commandFieldSetBeaconFrameConfiguration.setVisible(false);
			me.commandFieldSetBeaconFrameConfiguration.removeAll(true);
			me.setPowerSavingTime.setVisible(false);
			me.setPowerSavingTime.removeAll(true);
			me.batteryTaskIntervalFieldSetConfig.setVisible(true);
			me.batteryTaskIntervalFieldSetConfig.removeAll(true);
			me.commandFieldSet.removeAll(true);

			var mainsTaskIntervalField = [];
			var batteryTaskIntervalField = [];

			if (me.grid.baseParams.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.StockGateway) {

				var mainsTaskIntervalField = config.fields.filter(function (a) {
					return a.name == "SubCommand" || a.name == "GPRSInterval" || a.name == "GPSInterval" || a.name == "HealthInterval";
				});

				var batteryTaskIntervalField = config.fields.filter(function (a) {
					return a.name == "ScanInterval" || a.name == "ScanONTimeInterval" || a.name == "SubCommand3";
				});

				var panel = new Ext.Panel({
					layout: 'form',
					defaults: { width: 165 },
					items: mainsTaskIntervalField
				});

				me.commandFieldSet.setTitle(config.groupTitle);
				height += 35;

				for (var j = 0; j < mainsTaskIntervalField.length; j++)
					height += 20;

				me.commandFieldSet.add(panel);

				height += 35;
				//me.commandFieldPanel = panel11;

				for (var j = 0; j < batteryTaskIntervalField.length; j++)
					height += 20;

				var panel2 = new Ext.Panel({
					layout: 'form',
					defaults: { width: 165 },
					items: batteryTaskIntervalField
				});

				me.batteryTaskIntervalFieldSetConfig.add(panel2);
				me.batteryTaskIntervalFieldSetConfig.setTitle("Scanning Parameter");

			}
			else if (me.grid.baseParams.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekFFM2BB) {

				var mainsTaskIntervalField = config.fields.filter(function (a) {
					return a.name == "SubCommand" || a.name == "GPRSInterval" || a.name == "GPSInterval" || a.name == "HealthInterval" || a.name == "EnvironmentInterval";
				});


				var batteryTaskIntervalField = config.fields.filter(function (a) {
					return a.name == "GPSWithoutMotionInterval" || a.name == "GPSWithMotionInterval" || a.name == "StopMovementDetectInterval" || a.name == "SubCommand2";
				});

				var panel = new Ext.Panel({
					layout: 'form',
					defaults: { width: 165 },
					items: mainsTaskIntervalField
				});

				me.commandFieldSet.setTitle(config.groupTitle);
				height += 35;

				for (var j = 0; j < mainsTaskIntervalField.length; j++)
					height += 20;

				me.commandFieldSet.add(panel);



				height += 35;
				//me.commandFieldPanel = panel11;

				for (var j = 0; j < batteryTaskIntervalField.length; j++)
					height += 20;

				var panel2 = new Ext.Panel({
					layout: 'form',
					defaults: { width: 165 },
					items: batteryTaskIntervalField
				});

				me.batteryTaskIntervalFieldSetConfig.add(panel2);
				me.batteryTaskIntervalFieldSetConfig.setTitle("Scanning Parameter");

			}
			else {
				for (var i = 0; i < config.fields.length; i++) {
					if (i < 4) {
						mainsTaskIntervalField.push(config.fields[i]);
						if (i == 3) {
							var panel = new Ext.Panel({
								layout: 'form',
								defaults: { width: 165 },
								items: mainsTaskIntervalField
							});

							me.commandFieldSet.setTitle(config.groupTitle);
							height += 35;

							for (var j = 0; j < mainsTaskIntervalField.length; j++)
								height += 20;

							me.commandFieldSet.add(panel);
						}
					}
					else {
						if (config.fields[i].name == "EnvironmentInterval") {
							continue;
						}
						else {
							batteryTaskIntervalField.push(config.fields[i]);
							if (i == 8) {
								var panel11 = new Ext.Panel({
									layout: 'form',
									defaults: { width: 165 },
									items: batteryTaskIntervalField
								});

								height += 35;
								//me.commandFieldPanel = panel11;

								for (var j = 0; j < batteryTaskIntervalField.length; j++)
									height += 20;

								me.batteryTaskIntervalFieldSetConfig.add(panel11);
							}
						}
					}
				}
			}
			me.commandFieldSet.doLayout();
			me.batteryTaskIntervalFieldSetConfig.doLayout();
		}
		else if (record.data.CustomValue == Cooler.Enums.SmartDeviceCommandType.SET_DOOR_OPEN_COUNT) {

			me.doorOpenFieldSetConfig.setVisible(false);
			me.doorOpenFieldSetConfig.removeAll(true);
			me.timeFieldSetConfig.setVisible(false);
			me.timeFieldSetConfig.removeAll(true);
			me.dateTimeFieldSetConfig.setVisible(true);
			me.dateTimeFieldSetConfig.removeAll(true);


			me.commandFieldSetEddyStoneUIDConfig.setVisible(false);
			me.commandFieldSetEddyStoneUIDConfig.removeAll(true);
			me.commandFieldSetEddyStoneURLConfig.setVisible(false);
			me.commandFieldSetEddyStoneURLConfig.removeAll(true);
			me.commandFieldSetEddyStoneTLMConfig.setVisible(false);
			me.commandFieldSetEddyStoneTLMConfig.removeAll(true);
			me.commandFieldSetBeaconFrameConfiguration.setVisible(false);
			me.commandFieldSetBeaconFrameConfiguration.removeAll(true);
			me.batteryTaskIntervalFieldSetConfig.setVisible(false);
			me.batteryTaskIntervalFieldSetConfig.removeAll(true);
			me.setPowerSavingTime.setVisible(false);
			me.setPowerSavingTime.removeAll(true);
			var imageEnableOptionComboField = [];
			var doorCountField = [];
			var timeField = [];
			var dateTimeField = [];

			for (var i = 0; i < config.fields.length; i++) {
				if (i < 1) {
					imageEnableOptionComboField.push(config.fields[i]);

					var panel = new Ext.Panel({
						layout: 'form',
						defaults: { width: 165 },
						items: imageEnableOptionComboField
					});

					//me.commandFieldPanel = panel;
					me.commandFieldSet.setTitle(config.groupTitle);
					height += 35;

					for (var j = 0; j < imageEnableOptionComboField.length; j++)
						height += 20;

					me.commandFieldSet.add(panel);

				}
				else if (i > 0 && i < 2) {
					doorCountField.push(config.fields[i]);

					var panel11 = new Ext.Panel({
						layout: 'form',
						defaults: { width: 165 },
						items: doorCountField
					});

					height += 35;
					//me.commandFieldPanel = panel11;

					for (var j = 0; j < doorCountField.length; j++)
						height += 20;

					me.doorOpenFieldSetConfig.add(panel11);

				}
				else if (i > 1 && i < 6) {
					timeField.push(config.fields[i]);
					if (i == 5) {
						var panel22 = new Ext.Panel({
							layout: 'form',
							defaults: { width: 165 },
							items: timeField
						});

						height += 35;
						//me.commandFieldPanel = panel22;
						for (var j = 0; j < timeField.length; j++)
							height += 20;

						me.timeFieldSetConfig.add(panel22);

					}
				}
				else if (i >= 6) {
					dateTimeField.push(config.fields[i]);

					if (i == 9) {
						var panel33 = new Ext.Panel({
							layout: 'form',
							defaults: { width: 165 },
							items: dateTimeField
						});
						height += 35;
						//me.commandFieldPanel = panel33;
						for (var j = 0; j < dateTimeField.length; j++)
							height += 20;

						me.dateTimeFieldSetConfig.add(panel33);

					}
				}
			}

			me.commandFieldSet.doLayout();
			me.doorOpenFieldSetConfig.doLayout();
			me.timeFieldSetConfig.doLayout();
			me.dateTimeFieldSetConfig.doLayout();
		}
		else if (record.data.CustomValue == Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION) {
			me.commandFieldSetEddyStoneUIDConfig.setVisible(true);
			me.commandFieldSetEddyStoneUIDConfig.removeAll(true);
			me.commandFieldSetEddyStoneURLConfig.setVisible(true);
			me.commandFieldSetEddyStoneURLConfig.removeAll(true);
			me.commandFieldSetEddyStoneTLMConfig.setVisible(true);
			me.commandFieldSetEddyStoneTLMConfig.removeAll(true);
			me.commandFieldSetBeaconFrameConfiguration.setVisible(true);
			me.commandFieldSetBeaconFrameConfiguration.removeAll(true);
			me.setPowerSavingTime.setVisible(false);
			me.setPowerSavingTime.removeAll(true);
			me.doorOpenFieldSetConfig.setVisible(false);
			me.doorOpenFieldSetConfig.removeAll(true);
			me.timeFieldSetConfig.setVisible(false);
			me.timeFieldSetConfig.removeAll(true);
			me.dateTimeFieldSetConfig.setVisible(false);
			me.dateTimeFieldSetConfig.removeAll(true);
			me.batteryTaskIntervalFieldSetConfig.setVisible(false);
			me.batteryTaskIntervalFieldSetConfig.removeAll(true);

			var newBeaconFrameFields = [];
			var beaconFrameFields = [];
			var iBeaconConfigurationFields = [];
			var uidConfigurationFields = [];
			var urlConfigurationFields = [];
			var tlmConfigurationFields = [];
			for (var i = 0; i < config.fields.length; i++) {
				if (i < 8) {
					newBeaconFrameFields.push(config.fields[i]);
					if (i == 7) {
						var panelNew = new Ext.Panel({
							layout: 'form',
							defaults: { width: 165 },
							items: newBeaconFrameFields
						});

						height += 35;

						for (var j = 0; j < beaconFrameFields.length; j++)
							height += 20;

						me.commandFieldSetBeaconFrameConfiguration.add(panelNew);
					}
				}
				if (i <= 15 & i > 7) {
					beaconFrameFields.push(config.fields[i]);
					if (i == 15) {
						var panel = new Ext.Panel({
							layout: 'form',
							defaults: { width: 165 },
							items: beaconFrameFields
						});
						me.commandFieldPanel = panel;
						me.commandFieldSet.setTitle(config.groupTitle);
						height += 35;

						for (var j = 0; j < beaconFrameFields.length; j++)
							height += 20;

						me.commandFieldSet.add(panel);

					}
				}
				if (i <= 21 && i > 15) {
					iBeaconConfigurationFields.push(config.fields[i]);
					if (i == 21) {
						var panel1 = new Ext.Panel({
							layout: 'form',
							defaults: { width: 165 },
							items: iBeaconConfigurationFields
						});

						height += 35;

						for (var j = 0; j < iBeaconConfigurationFields.length; j++)
							height += 20;

						me.commandFieldSetEddyStoneUIDConfig.add(panel1);

					}
				}
				else if (i <= 26 && i > 21) {
					uidConfigurationFields.push(config.fields[i]);
					if (i == 26) {
						var panel2 = new Ext.Panel({
							layout: 'form',
							defaults: { width: 165 },
							items: uidConfigurationFields
						});
						me.commandFieldPanel = panel2;
						height += 35;

						for (var j = 0; j < uidConfigurationFields.length; j++)
							height += 20;

						me.commandFieldSetEddyStoneURLConfig.add(panel2);

					}
				}

				else if (i > 26) {
					tlmConfigurationFields.push(config.fields[i]);
					if (i == 30) {
						var panel4 = new Ext.Panel({
							layout: 'form',
							defaults: { width: 165 },
							items: tlmConfigurationFields
						});
						me.commandFieldPanel = panel4;
						height += 35;
						me.commandFieldSetEddyStoneTLMConfig.add(panel4);
					}
				}

			}

			me.commandFieldSet.doLayout();
			me.commandFieldSetEddyStoneUIDConfig.doLayout();
			me.commandFieldSetEddyStoneURLConfig.doLayout();
			me.commandFieldSetEddyStoneTLMConfig.doLayout();
			me.commandFieldSetBeaconFrameConfiguration.doLayout();
		}
		else if (record.data.CustomValue == Cooler.Enums.SmartDeviceCommandType.SET_POWER_SAVING_TIME) {

			me.setPowerSavingTime.setVisible(true);
			me.setPowerSavingTime.removeAll(true);
			me.commandFieldSetEddyStoneUIDConfig.setVisible(false);
			me.commandFieldSetEddyStoneUIDConfig.removeAll(true);
			me.commandFieldSetEddyStoneURLConfig.setVisible(false);
			me.commandFieldSetEddyStoneURLConfig.removeAll(true);
			me.commandFieldSetEddyStoneTLMConfig.setVisible(false);
			me.commandFieldSetEddyStoneTLMConfig.removeAll(true);
			me.commandFieldSetBeaconFrameConfiguration.setVisible(false);
			me.commandFieldSetBeaconFrameConfiguration.removeAll(true);
			me.doorOpenFieldSetConfig.setVisible(false);
			me.doorOpenFieldSetConfig.removeAll(true);
			me.timeFieldSetConfig.setVisible(false);
			me.timeFieldSetConfig.removeAll(true);
			me.dateTimeFieldSetConfig.setVisible(false);
			me.dateTimeFieldSetConfig.removeAll(true);
			me.batteryTaskIntervalFieldSetConfig.setVisible(false);
			me.batteryTaskIntervalFieldSetConfig.removeAll(true);

			var poweSavingFields = [];
			var powerSavingModeComboField = [];
			for (var i = 0; i < config.fields.length; i++) {
				if (i < 1) {
					powerSavingModeComboField.push(config.fields[i]);

					var panel = new Ext.Panel({
						layout: 'form',
						defaults: { width: 165 },
						items: powerSavingModeComboField
					});

					//me.commandFieldPanel = panel;
					me.commandFieldSet.setTitle(config.groupTitle);
					height += 35;

					for (var j = 0; j < powerSavingModeComboField.length; j++)
						height += 20;

					me.commandFieldSet.add(panel);

				}
				else {

					poweSavingFields.push(config.fields[i]);

					if (i == 2) {
						var panelTemp = new Ext.Panel({
							layout: 'form',
							defaults: { width: 165 },
							items: poweSavingFields
						});

						height += 35;
						//me.commandFieldPanel = panel11;

						for (var j = 0; j < poweSavingFields.length; j++)
							height += 20;
						me.setPowerSavingTime.setTitle('Power Saving Time');
						me.setPowerSavingTime.add(panelTemp);
					}
				}

			}
			me.commandFieldSet.doLayout();
			me.setPowerSavingTime.doLayout();
		}
		else if (record.data.CustomValue == Cooler.Enums.SmartDeviceCommandType.CONTROL_EVENT) {
			me.setPowerSavingTime.setVisible(false);
			me.setPowerSavingTime.removeAll(true);
			me.commandFieldSetEddyStoneUIDConfig.setVisible(false);
			me.commandFieldSetEddyStoneUIDConfig.removeAll(true);
			me.commandFieldSetEddyStoneURLConfig.setVisible(false);
			me.commandFieldSetEddyStoneURLConfig.removeAll(true);
			me.commandFieldSetEddyStoneTLMConfig.setVisible(false);
			me.commandFieldSetEddyStoneTLMConfig.removeAll(true);
			me.commandFieldSetBeaconFrameConfiguration.setVisible(false);
			me.commandFieldSetBeaconFrameConfiguration.removeAll(true);
			me.doorOpenFieldSetConfig.setVisible(false);
			me.doorOpenFieldSetConfig.removeAll(true);
			me.timeFieldSetConfig.setVisible(false);
			me.timeFieldSetConfig.removeAll(true);
			me.dateTimeFieldSetConfig.setVisible(false);
			me.dateTimeFieldSetConfig.removeAll(true);
			me.batteryTaskIntervalFieldSetConfig.setVisible(false);
			me.batteryTaskIntervalFieldSetConfig.removeAll(true);

			var controlEventFields = [];
			for (var i = 0; i < config.fields.length; i++) {

				controlEventFields.push(config.fields[i]);

				if (i == 2) {
					var panelTemp = new Ext.Panel({
						layout: 'form',
						defaults: { width: 165 },
						items: controlEventFields
					});

					height += 35;
					//me.commandFieldPanel = panel11;

					for (var j = 0; j < controlEventFields.length; j++)
						height += 20;
					me.commandFieldSet.setTitle(config.groupTitle);//('Control Events Mode');
					me.commandFieldSet.add(panelTemp);

				}
			}
			me.commandFieldSet.doLayout();
			me.commandFieldSet.doLayout();

		}
		else {
			me.commandFieldSetEddyStoneUIDConfig.setVisible(false);
			me.commandFieldSetEddyStoneUIDConfig.removeAll(true);
			me.commandFieldSetEddyStoneURLConfig.setVisible(false);
			me.commandFieldSetEddyStoneURLConfig.removeAll(true);
			me.commandFieldSetEddyStoneTLMConfig.setVisible(false);
			me.commandFieldSetEddyStoneTLMConfig.removeAll(true);
			me.commandFieldSetBeaconFrameConfiguration.setVisible(false);
			me.commandFieldSetBeaconFrameConfiguration.removeAll(true);
			me.doorOpenFieldSetConfig.setVisible(false);
			me.doorOpenFieldSetConfig.removeAll(true);
			me.setPowerSavingTime.setVisible(false);
			me.setPowerSavingTime.removeAll(true);
			me.timeFieldSetConfig.setVisible(false);
			me.timeFieldSetConfig.removeAll(true);
			me.dateTimeFieldSetConfig.setVisible(false);
			me.dateTimeFieldSetConfig.removeAll(true);
			me.batteryTaskIntervalFieldSetConfig.setVisible(false);
			me.batteryTaskIntervalFieldSetConfig.removeAll(true);
			var panel = new Ext.Panel({
				layout: 'form',
				defaults: { width: 165 },
				items: config.fields
			});
			me.commandFieldPanel = panel;
			me.commandFieldSet.setTitle(config.groupTitle);
			height += 35;

			for (var i = 0; i < config.fields.length; i++)
				height += 20;

			me.commandFieldSet.add(panel);
			me.commandFieldSet.doLayout();
		}

		//me.win.setHeight(height);
		me.bulkCommandWin.setHeight(height);
	},

	commandDataTypes: {
		Byte: 1,
		Short: 2,
		DateTime: 3,
		Integer: 4,
		String: 5,
		Float: 6,
		URL: 7,
		SByte: 8,
		ImageCaptureModeDateTime: 9,
		UShort: 10
	},

	getFormFields: function (cmd) {
		var type = Cooler.Enums.SmartDeviceCommandType, value = { fields: [], groupTitle: '', command: cmd, dataType: [] };
		var commandDataTypes = this.commandDataTypes;

		var dateFieldImageTime1 = new Ext.ux.form.DateTime({ fieldLabel: 'Image Time1', name: 'DateFieldImageTime1', value: new Date(), width: 200 });
		var dateFieldImageTime2 = new Ext.ux.form.DateTime({ fieldLabel: 'Image Time2', name: 'DateFieldImageTime2', value: new Date(), width: 200 });
		var dateFieldImageTime3 = new Ext.ux.form.DateTime({ fieldLabel: 'Image Time3', name: 'DateFieldImageTime3', value: new Date(), width: 200 });

		var beaconFrameCombo1 = DA.combo.create({ fieldLabel: 'Enable iBeacon', hiddenName: 'EnableBeacon', store: "yesno", width: 40, allowBlank: false });
		var beaconFrameCombo2 = DA.combo.create({ fieldLabel: 'Enable Eddystone Beacon UID', hiddenName: 'EnableBeaconUid', store: "yesno", allowBlank: false });
		var beaconFrameCombo3 = DA.combo.create({ fieldLabel: 'Enable Eddystone Beacon URL', hiddenName: 'EnableBeaconUrl', store: "yesno", allowBlank: false });
		var beaconFrameCombo4 = DA.combo.create({ fieldLabel: 'Enable Eddystone Beacon TLM', hiddenName: 'EnableBeaconTlm', store: "yesno", allowBlank: false });

		var enableEnergySavingCombo1 = DA.combo.create({ fieldLabel: 'Enable Energy Saving iBeacon', hiddenName: 'EnableEnergySavingBeacon', store: "yesno", width: 40, allowBlank: false });
		var enableEnergySavingCombo2 = DA.combo.create({ fieldLabel: 'Enable Energy Saving UID', hiddenName: 'EnableEnergySavingUid', store: "yesno", allowBlank: false });
		var enableEnergySavingCombo3 = DA.combo.create({ fieldLabel: 'Enable Energy Saving URL', hiddenName: 'EnableEnergySavingUrl', store: "yesno", allowBlank: false });
		var enableEnergySavingCombo4 = DA.combo.create({ fieldLabel: 'Enable Energy Saving TLM', hiddenName: 'EnableEnergySavingTlm', store: "yesno", allowBlank: false });
		var healthEventModeStore = [[0, 'Disable'], [1, 'Enable']];
		var motionEventModeStore = [[0, 'Disable'], [1, 'Enable']];
		var doorEventModeStore = [[0, 'Disable'], [1, 'Enable']];
		var healthEventModeCombo = DA.combo.create({ fieldLabel: 'Health Event', value: 0, hiddenName: 'HealthEventMode', store: healthEventModeStore, width: 40 });
		var doorEventModeCombo = DA.combo.create({ fieldLabel: 'Door Event', value: 0, hiddenName: 'DoorEventMode', store: doorEventModeStore, width: 40 });
		var motionEventModeCombo = DA.combo.create({ fieldLabel: 'Motion Event', value: 0, hiddenName: 'MotionEventMode', store: motionEventModeStore, width: 40 });

		this.beaconFrameCombo1 = beaconFrameCombo1;
		this.beaconFrameCombo2 = beaconFrameCombo2;
		this.beaconFrameCombo3 = beaconFrameCombo3;
		this.beaconFrameCombo4 = beaconFrameCombo4;

		this.enableEnergySavingCombo1 = enableEnergySavingCombo1;
		this.enableEnergySavingCombo2 = enableEnergySavingCombo2;
		this.enableEnergySavingCombo3 = enableEnergySavingCombo3;
		this.enableEnergySavingCombo4 = enableEnergySavingCombo4;

		this.motionEventModeCombo = motionEventModeCombo;
		this.doorEventModeCombo = doorEventModeCombo;
		this.healthEventModeCombo = healthEventModeCombo;

		this.beaconFrameCombo1.on('change', function (combo, newValue, oldValue) {
			if (this.beaconFrameCombo2.getValue() === "") {
				this.beaconFrameCombo2.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo3.getValue() === "") {
				this.beaconFrameCombo3.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo4.getValue() === "") {
				this.beaconFrameCombo4.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo1.getValue() === "") {
				this.enableEnergySavingCombo1.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo2.getValue() === "") {
				this.enableEnergySavingCombo2.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo3.getValue() === "") {
				this.enableEnergySavingCombo3.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo4.getValue() === "") {
				this.enableEnergySavingCombo4.addClass('x-form-invalid')
			}
		}, this);

		this.beaconFrameCombo2.on('change', function (combo, newValue, oldValue) {
			if (this.beaconFrameCombo1.getValue() === "") {
				this.beaconFrameCombo1.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo3.getValue() === "") {
				this.beaconFrameCombo3.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo4.getValue() === "") {
				this.beaconFrameCombo4.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo1.getValue() === "") {
				this.enableEnergySavingCombo1.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo2.getValue() === "") {
				this.enableEnergySavingCombo2.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo3.getValue() === "") {
				this.enableEnergySavingCombo3.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo4.getValue() === "") {
				this.enableEnergySavingCombo4.addClass('x-form-invalid')
			}
		}, this);

		this.beaconFrameCombo3.on('change', function (combo, newValue, oldValue) {
			if (this.beaconFrameCombo1.getValue() === "") {
				this.beaconFrameCombo1.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo2.getValue() === "") {
				this.beaconFrameCombo2.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo4.getValue() === "") {
				this.beaconFrameCombo4.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo1.getValue() === "") {
				this.enableEnergySavingCombo1.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo2.getValue() === "") {
				this.enableEnergySavingCombo2.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo3.getValue() === "") {
				this.enableEnergySavingCombo3.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo4.getValue() === "") {
				this.enableEnergySavingCombo4.addClass('x-form-invalid')
			}
		}, this);

		this.beaconFrameCombo4.on('change', function (combo, newValue, oldValue) {
			if (this.beaconFrameCombo1.getValue() === "") {
				this.beaconFrameCombo1.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo2.getValue() === "") {
				this.beaconFrameCombo2.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo3.getValue() === "") {
				this.beaconFrameCombo3.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo1.getValue() === "") {
				this.enableEnergySavingCombo1.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo2.getValue() === "") {
				this.enableEnergySavingCombo2.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo3.getValue() === "") {
				this.enableEnergySavingCombo3.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo4.getValue() === "") {
				this.enableEnergySavingCombo4.addClass('x-form-invalid')
			}
		}, this);

		this.enableEnergySavingCombo1.on('change', function (combo, newValue, oldValue) {
			if (this.beaconFrameCombo1.getValue() === "") {
				this.beaconFrameCombo1.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo2.getValue() === "") {
				this.beaconFrameCombo2.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo3.getValue() === "") {
				this.beaconFrameCombo3.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo4.getValue() === "") {
				this.beaconFrameCombo4.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo2.getValue() === "") {
				this.enableEnergySavingCombo2.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo3.getValue() === "") {
				this.enableEnergySavingCombo3.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo4.getValue() === "") {
				this.enableEnergySavingCombo4.addClass('x-form-invalid')
			}
		}, this);

		this.enableEnergySavingCombo2.on('change', function (combo, newValue, oldValue) {
			if (this.beaconFrameCombo1.getValue() === "") {
				this.beaconFrameCombo1.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo2.getValue() === "") {
				this.beaconFrameCombo2.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo3.getValue() === "") {
				this.beaconFrameCombo3.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo4.getValue() === "") {
				this.beaconFrameCombo4.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo1.getValue() === "") {
				this.enableEnergySavingCombo1.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo3.getValue() === "") {
				this.enableEnergySavingCombo3.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo4.getValue() === "") {
				this.enableEnergySavingCombo4.addClass('x-form-invalid')
			}
		}, this);

		this.enableEnergySavingCombo3.on('change', function (combo, newValue, oldValue) {
			if (this.beaconFrameCombo1.getValue() === "") {
				this.beaconFrameCombo1.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo2.getValue() === "") {
				this.beaconFrameCombo2.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo3.getValue() === "") {
				this.beaconFrameCombo3.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo4.getValue() === "") {
				this.beaconFrameCombo4.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo1.getValue() === "") {
				this.enableEnergySavingCombo1.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo2.getValue() === "") {
				this.enableEnergySavingCombo2.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo4.getValue() === "") {
				this.enableEnergySavingCombo4.addClass('x-form-invalid')
			}
		}, this);

		this.enableEnergySavingCombo4.on('change', function (combo, newValue, oldValue) {
			if (this.beaconFrameCombo1.getValue() === "") {
				this.beaconFrameCombo1.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo2.getValue() === "") {
				this.beaconFrameCombo2.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo3.getValue() === "") {
				this.beaconFrameCombo3.addClass('x-form-invalid')
			}
			if (this.beaconFrameCombo4.getValue() === "") {
				this.beaconFrameCombo4.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo1.getValue() === "") {
				this.enableEnergySavingCombo1.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo2.getValue() === "") {
				this.enableEnergySavingCombo2.addClass('x-form-invalid')
			}
			if (this.enableEnergySavingCombo3.getValue() === "") {
				this.enableEnergySavingCombo3.addClass('x-form-invalid')
			}
		}, this);

		dateFieldImageTime1.setTime(new Date());
		this.dateFieldImageTime1 = dateFieldImageTime1;
		dateFieldImageTime2.setTime(new Date());
		this.dateFieldImageTime2 = dateFieldImageTime2;
		dateFieldImageTime3.setTime(new Date());
		this.dateFieldImageTime3 = dateFieldImageTime3;

		var imageCaptureModeOptionStore = [[0, 'Door Open'], [1, 'Time'], [2, 'Day & Time']];
		var imageOptionCombo = DA.combo.create({ fieldLabel: 'Image Enable Option', value: 2, hiddenName: 'ImageEnableOption', store: imageCaptureModeOptionStore, width: 40 });
		this.imageOptionCombo = imageOptionCombo;

		var powerSavingModeStore = [[0, 'Enable'], [1, 'Disable']];
		var powerSavingModeCombo = DA.combo.create({ fieldLabel: 'Power Saving Mode', value: 0, hiddenName: 'PowerSavingMode', store: powerSavingModeStore, width: 40 });
		this.powerSavingModeCombo = powerSavingModeCombo;

		this.powerSavingModeCombo.on('select', function (combo, newValue, oldValue) {
			switch (newValue.id) {
				case 0:
					this.setPowerSavingTime.setVisible(true);
					break;
				case 1:
					this.setPowerSavingTime.setVisible(false);
					break;
			}
		}, this);
		this.imageOptionCombo.on('change', function (combo, newValue, oldValue) {
			switch (newValue) {

				case 0:
					this.doorOpenFieldSetConfig.setVisible(true);
					this.timeFieldSetConfig.setVisible(false);
					this.dateTimeFieldSetConfig.setVisible(false);
					break;
				case 1:
					this.doorOpenFieldSetConfig.setVisible(false);
					this.timeFieldSetConfig.setVisible(true);
					this.dateTimeFieldSetConfig.setVisible(false);
					break;
				case 2:
					this.doorOpenFieldSetConfig.setVisible(false);
					this.timeFieldSetConfig.setVisible(false);
					this.dateTimeFieldSetConfig.setVisible(true);
					break;
			}
		}, this);

		switch (cmd) {
			case type.SENSOR_ON:
			case type.SENSOR_OFF:
				value.groupTitle = "(0x01 = sensor group, 0x02 = acc group)";
				value.fields.push({ fieldLabel: 'Sensor Group ID (0x0)', allowBlank: false, name: 'SensorGroupId', xtype: 'numberfield', minValue: 1, maxValue: 2, maxLength: 1, decimalPrecision: 0 });
				value.dataType.push(commandDataTypes.Byte);
				break;
			case type.LATEST_N_EVENTS:
				value.groupTitle = "Get latest n events";
				value.fields.push({ fieldLabel: 'Latest Event', allowBlank: false, name: 'LatestEvent', xtype: 'numberfield', minValue: 1, decimalPrecision: 0 });
				value.dataType.push(commandDataTypes.Short);
				break;
			case type.EVENT_DATA_FROM_IDX_IDY:
				value.groupTitle = "Get Event / data records from Event ID X to Event ID Y";
				value.fields.push({ fieldLabel: 'Event Id X', allowBlank: false, name: 'EventIdX', xtype: 'numberfield', minValue: 1, decimalPrecision: 0 },
					{ fieldLabel: 'Event Id Y', allowBlank: false, name: 'EventIdY', xtype: 'numberfield', minValue: 1, decimalPrecision: 0 });
				break;
			case type.SET_INTERVAL:
				var smartDeviceTypeId = this.grid.baseParams.SmartDeviceTypeId
				value.groupTitle = "Set interval to read sensor periodically";
				value.fields.push({ fieldLabel: 'Periodic Interval', allowBlank: false, maxValue: 240, minValue: 1, name: 'Interval', xtype: 'numberfield', minValue: 1, decimalPrecision: 0 });
				value.dataType.push(commandDataTypes.Byte);
				if (Cooler.Enums.SmartDeviceType.ImberaCMD == smartDeviceTypeId || Cooler.Enums.SmartDeviceType.SollatekFFMB == smartDeviceTypeId || Cooler.Enums.SmartDeviceType.SollatekGBR3 == smartDeviceTypeId || Cooler.Enums.SmartDeviceType.SollatekJEA == smartDeviceTypeId) {
					value.fields.push({ fieldLabel: 'Environment Interval', allowBlank: false, maxValue: 240, minValue: 1, name: 'Interval', xtype: 'numberfield', minValue: 1, decimalPrecision: 0 });
					value.dataType.push(commandDataTypes.Byte);
				}
				break;
			case type.SET_REAL_TIME_CLOCK:
				value.groupTitle = "Since 1st Oct 2014(MM/dd/yyyy HH:mm:ss)";
				value.fields.push({ fieldLabel: 'Date', allowBlank: false, name: 'Date', xtype: 'xdatetime', value: new Date() });
				value.fields.push({ fieldLabel: 'Timezone Offset(Mins)', allowBlank: false, name: 'TimezoneOffset', xtype: 'numberfield', minValue: -1440, maxValue: 1440, allowDecimals: false });
				value.dataType.push(commandDataTypes.DateTime);
				value.dataType.push(commandDataTypes.Short);
				break;
			case type.SET_GPS_LOCATION:
				value.groupTitle = "Set GPS location of device";
				value.fields.push({ fieldLabel: 'Latitude', allowBlank: false, name: 'Latitude', xtype: 'numberfield', decimalPrecision: 6 },
					{ fieldLabel: 'Longitude', allowBlank: false, name: 'Longitude', xtype: 'numberfield', decimalPrecision: 6 });
				value.dataType.push(commandDataTypes.String);
				value.dataType.push(commandDataTypes.String);
				break;
			case type.SET_MAJOR_MINOR_VERSION:
				value.groupTitle = "Set Major/ Minor version of device";
				value.fields.push({ fieldLabel: 'Major', allowBlank: false, name: 'Major', xtype: 'numberfield', decimalPrecision: 0, minValue: 1, maxValue: 65535 },
					{ fieldLabel: 'Minor', allowBlank: false, name: 'Minor', xtype: 'numberfield', decimalPrecision: 0, minValue: 1, maxValue: 65535 },
					{ fieldLabel: 'RSSI value for 1 meter distance', allowBlank: false, name: 'RSSI', xtype: 'numberfield', decimalPrecision: 0, minValue: 1 });
				value.dataType.push(commandDataTypes.Short);
				value.dataType.push(commandDataTypes.Short);
				value.dataType.push(commandDataTypes.Byte);
				break;
			case type.SET_IBEACON_UUID:
				value.groupTitle = "Set iBeacon UUID(16 bytes)";
				value.fields.push({ fieldLabel: 'iBeacon UUID', allowBlank: false, maxLength: 16, name: 'IBeaconUUID', xtype: 'textfield', inputType: 'textfield' });
				value.dataType.push(commandDataTypes.String);
				break;
			case type.SET_SERIAL_NUMBER:
				value.groupTitle = "Set Serial# of device";
				value.fields.push({ fieldLabel: 'Model', allowBlank: false, maxLength: 14, name: 'Model', xtype: 'textfield', value: 'SBB-SV10' },
					{ fieldLabel: 'HW Major', allowBlank: false, name: 'HWMajor', xtype: 'numberfield', decimalPrecision: 0, value: 50 },
					{ fieldLabel: 'HW Minor', allowBlank: false, name: 'HWMinor', xtype: 'numberfield', decimalPrecision: 0, value: 49 },
					{ fieldLabel: 'Serial#', allowBlank: false, maxLength: 14, name: 'Serial', xtype: 'textfield' });
				value.dataType.push(commandDataTypes.String);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.String);
				break;
			case type.SET_ADVERTISING_PERIOD:
				value.groupTitle = "Set Advertising period";
				value.fields.push({ fieldLabel: 'Periodic Interval(Milliseconds)', allowBlank: false, name: 'AdvertisingPeriod', xtype: 'numberfield', minValue: 1, decimalPrecision: 0, maxValue: 10000 });
				value.dataType.push(commandDataTypes.Short);
				break;
			case type.SET_SENSOR_THRESHOLD:
				value.groupTitle = "Set sensor threshold";
				value.fields.push({ fieldLabel: 'Temperature out of threshold', allowBlank: false, name: 'Temperature', xtype: 'numberfield', decimalPrecision: 0, maxValue: 100 },
					{ fieldLabel: 'Light out of threshold', allowBlank: false, name: 'Light', xtype: 'numberfield', decimalPrecision: 0, maxValue: 100 },
					{ fieldLabel: 'Humidity out of threshold', allowBlank: false, name: 'Humidity', xtype: 'numberfield', decimalPrecision: 0, maxValue: 100 },
					{ fieldLabel: 'Movement threshold G Value', allowBlank: false, name: 'MovementG', xtype: 'numberfield', decimalPrecision: 0, maxValue: 100 },
					{ fieldLabel: 'Movement threshold Time', allowBlank: false, name: 'Movement', xtype: 'numberfield', decimalPrecision: 0, maxValue: 100 });
				value.dataType.push(commandDataTypes.Short);
				value.dataType.push(commandDataTypes.Short);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				break;
			case type.SET_STANDBY_MODE:
				value.groupTitle = "(0 = Stand By Mode Off, 1 = Stand By Mode On)";
				value.fields.push({ fieldLabel: 'Stand By Mode', allowBlank: false, name: 'StandByMode', xtype: 'numberfield', minValue: 0, maxValue: 1, maxLength: 1, decimalPrecision: 0 });
				value.dataType.push(commandDataTypes.Byte);
				break;
			case type.SET_DOOR_OPEN_ANGLE:
				value.groupTitle = "Set Door open angle";
				value.fields.push(
					{ fieldLabel: 'Door Open Angle 2', allowBlank: false, name: 'Angle2', minValue: 0, maxValue: 90, xtype: 'numberfield', decimalPrecision: 0 },
					{ fieldLabel: 'Trigger Delta', allowBlank: false, name: 'TriggerDelta', minValue: 1, maxValue: 10, xtype: 'numberfield', decimalPrecision: 0 },
					{ fieldLabel: 'Door Open Angle 1', allowBlank: false, name: 'Angle1', minValue: 0, maxValue: 90, xtype: 'numberfield', decimalPrecision: 0 },
					{ fieldLabel: 'Image Capture Mode', allowBlank: false, name: 'ImageCaptureMode', minValue: 0, maxValue: 2, xtype: 'numberfield', decimalPrecision: 0 },
					{ fieldLabel: 'Cam Sequence', allowBlank: false, name: 'CamSequence', minValue: 0, maxValue: 2, xtype: 'numberfield', decimalPrecision: 0 });
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				break;
			case type.SET_CAMERA_SETTING:
			case type.SET_CAMERA2_SETTING:
				value.groupTitle = cmd == type.SET_CAMERA_SETTING ? "Set Camera Configuration" : "Set Camera2 Configuration";
				value.fields.push(
					{ fieldLabel: 'Brightness', allowBlank: false, name: 'Brightness', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0, value: 5 },
					{ fieldLabel: 'Contrast', allowBlank: false, name: 'Contrast', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0, value: 4 },
					{ fieldLabel: 'Saturation', allowBlank: false, name: 'Saturation', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0, value: 4 },
					{ fieldLabel: 'Shutter Speed', allowBlank: false, name: 'ShutterSpeed', minValue: 100, maxValue: 1600, xtype: 'numberfield', decimalPrecision: 0, value: 250 },
					{ fieldLabel: 'Camera Quality', allowBlank: false, name: 'CameraQuality', minValue: 1, maxValue: 32, xtype: 'numberfield', decimalPrecision: 0, value: 12 },
					{ fieldLabel: 'Effect', allowBlank: false, name: 'Effect', minValue: 0, maxValue: 8, xtype: 'numberfield', decimalPrecision: 0, value: 8 },
					{ fieldLabel: 'Light Mode', allowBlank: false, name: 'LightMode', minValue: 1, maxValue: 5, xtype: 'numberfield', decimalPrecision: 0, value: 4 },
					{ fieldLabel: 'Camera Clock', allowBlank: false, name: 'CameraClock', minValue: 0, maxValue: 3, xtype: 'numberfield', decimalPrecision: 0, value: 3 },
					{ fieldLabel: 'Cdly', allowBlank: false, name: 'Cdly', minValue: 0, maxValue: 2, xtype: 'numberfield', decimalPrecision: 0, value: 2 },
					{ fieldLabel: 'Gain', allowBlank: false, name: 'Gain', minValue: 0, maxValue: 32, xtype: 'numberfield', decimalPrecision: 0, value: 32 });
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Short);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Short);
				value.dataType.push(commandDataTypes.Byte);
				break;
			case type.ENABLE_TAKE_PICTURE:
				value.groupTitle = "(0 = Disable Take Picture, 1 = Enable Take Picture)";
				value.fields.push({ fieldLabel: 'Enable/Disable Take Picture', allowBlank: false, name: 'PictureCollection', xtype: 'numberfield', minValue: 0, maxValue: 1, maxLength: 1, decimalPrecision: 0 });
				value.dataType.push(commandDataTypes.Byte);
				break;
			case type.SET_DEEP_SLEEP:
				value.groupTitle = "(0 = Enable Deep Sleep, 1 = Disable Deep Sleep)";
				value.fields.push({ fieldLabel: 'Enable/Disable Deep Sleep', allowBlank: false, name: 'DeepSleepCollection', xtype: 'numberfield', minValue: 0, maxValue: 1, maxLength: 1, decimalPrecision: 0 });
				value.dataType.push(commandDataTypes.Byte);
				break;
			case type.SET_CHANGE_PASSWORD:
				value.groupTitle = "Set password(Max 16 bytes)";
				value.fields.push({ fieldLabel: 'Password', allowBlank: false, maxLength: 16, name: 'Password', xtype: 'textfield', inputType: 'password' });
				value.dataType.push(commandDataTypes.String);
				break;
			case type.SET_RSSI_FOR_IBEACON_FRAME:
				value.groupTitle = "RSSI value for 1 meter distance(0 - 255)";
				value.fields.push({ fieldLabel: 'Periodic Interval', allowBlank: false, name: 'RssiValue', xtype: 'numberfield', maxlength: 3, decimalPrecision: 0 });
				value.dataType.push(commandDataTypes.Byte);
				break;
			case type.MODIFY_LAST_READ_EVENT_INDEX:
				value.groupTitle = "Set Last Read Event Index";
				value.fields.push({ fieldLabel: 'Last Read Event Index', allowBlank: false, name: 'LastReadEventIndex', xtype: 'numberfield', maxValue: 65535, decimalPrecision: 0 });
				value.dataType.push(commandDataTypes.Short);
				break;
			case type.DELETE_IMAGE:
				value.groupTitle = "Delete Specific Image";
				value.fields.push({ fieldLabel: 'Sequence Number', allowBlank: false, name: 'SequenceNumber', xtype: 'numberfield', decimalPrecision: 0 });
				value.dataType.push(commandDataTypes.Integer);
				break;
			case type.EDDYSTONE_CONFIGURATION:

				value.fields.push(beaconFrameCombo1);
				value.fields.push(beaconFrameCombo2);
				value.fields.push(beaconFrameCombo3);
				value.fields.push(beaconFrameCombo4);
				value.fields.push(enableEnergySavingCombo1);
				value.fields.push(enableEnergySavingCombo2);
				value.fields.push(enableEnergySavingCombo3);
				value.fields.push(enableEnergySavingCombo4);

				value.groupTitle = "iBeacon";
				value.fields.push({ fieldLabel: 'UUID', allowBlank: false, name: 'UUID', xtype: 'textfield', minLength: 32, maxLength: 32, regex: new RegExp('^[0-9A-Fa-f]+$'), regexText: 'Only hex values are allowed', });
				value.fields.push({ fieldLabel: 'Major', allowBlank: false, name: 'Major', xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Minor', allowBlank: false, name: 'Minor', xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'RSSI value for 1 meter distance', allowBlank: false, name: 'Rssi', xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Broadcast(Tx) power', allowBlank: false, name: 'BroadcastPowerBeacon', xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Advertising interval', allowBlank: false, name: 'AdvertisingIntervalBeacon', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Energy saving power(Tx)', allowBlank: false, name: 'EnergySavingPowerBeacon', xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Energy saving Interval', allowBlank: false, name: 'EnergySavingIntervalBeacon', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0 });


				value.fields.push({ fieldLabel: 'UID Namespace', allowBlank: false, name: 'UIDNameSpace', xtype: 'textfield', maxLength: 20, regex: new RegExp('^[0-9A-Fa-f]+$'), regexText: 'Only hex values are allowed' });
				value.fields.push({ fieldLabel: 'UID Instance', allowBlank: false, name: 'UIDInstance', xtype: 'textfield', maxLength: 12, regex: new RegExp('^[0-9A-Fa-f]+$'), regexText: 'Only hex values are allowed' });
				value.fields.push({ fieldLabel: 'Broadcast(Tx) power', allowBlank: false, name: 'BroadcastPowerUid', xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Advertising interval', allowBlank: false, name: 'AdvertisingIntervalUid', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Energy saving power(Tx)', allowBlank: false, name: 'EnergySavingPowerUid', xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Energy saving Interval', allowBlank: false, name: 'EnergySavingIntervalUid', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0 });

				value.fields.push({ fieldLabel: 'URL', allowBlank: false, name: 'URL', xtype: 'textfield', regex: new RegExp('^(https?:\\/\/([a-zA-Z0-9].+)?)([a-z0-9]+)(\\.(com|org|edu|net|info|biz|gov|co|io)\/?)([a-zA-Z0-9]+)?$'), regexText: 'Please enter valid url' });
				value.fields.push({ fieldLabel: 'Broadcast(Tx) power', allowBlank: false, name: 'BroadcastPowerUrl', xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Advertising interval', allowBlank: false, name: 'AdvertisingIntervalUrl', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Energy saving power', allowBlank: false, name: 'EnergySavingPowerUrl', xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Energy saving interval', allowBlank: false, name: 'EnergySavingIntervalUrl', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0 });

				value.fields.push({ fieldLabel: 'Broadcast(Tx) power', allowBlank: false, name: 'BroadcastPowerTlm', xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Advertising interval', allowBlank: false, name: 'AdvertisingIntervalTlm', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Energy saving power(Tx)', allowBlank: false, name: 'EnergySavingPowerTlm', xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Energy saving interval', allowBlank: false, name: 'EnergySavingIntervalTlm', minValue: 100, maxValue: 5000, xtype: 'numberfield', decimalPrecision: 0 });

				break;
			case type.SET_IMAGE_CAPTURE_MODE:
				value.groupTitle = "Image Option";
				value.fields.push(imageOptionCombo);
				value.fields.push({ fieldLabel: 'Door Open Count', allowBlank: false, name: 'DoorOpenCount', minValue: 1, maxValue: 255, value: 1, xtype: 'numberfield', decimalPrecision: 0 });

				value.fields.push(new Ext.form.TimeField({ fieldLabel: 'Image Time1', allowBlank: false, format: 'h:i A', listWidth: 80, name: 'ImageTime1' }));
				value.fields.push(new Ext.form.TimeField({ fieldLabel: 'Image Time2', allowBlank: false, format: 'h:i A', listWidth: 80, name: 'ImageTime2' }));
				value.fields.push(new Ext.form.TimeField({ fieldLabel: 'Image Time3', allowBlank: false, format: 'h:i A', listWidth: 80, name: 'ImageTime3' }));
				value.fields.push({ fieldLabel: 'Image Capture/Time Slot', allowBlank: false, name: 'TimeFieldDoorCount', minValue: 1, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0 });

				value.fields.push(dateFieldImageTime1);
				value.fields.push(dateFieldImageTime2);
				value.fields.push(dateFieldImageTime3);
				value.fields.push({ fieldLabel: 'Image Capture/Time Slot', allowBlank: false, name: 'DateTimeFieldDoorCount', minValue: 1, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0 });

				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.ImageCaptureModeDateTime);
				value.dataType.push(commandDataTypes.ImageCaptureModeDateTime);
				value.dataType.push(commandDataTypes.ImageCaptureModeDateTime);
				value.dataType.push(commandDataTypes.Byte);
				break;
			case type.SET_SH_APN:
				value.groupTitle = "Set Mains Power Task Interval";
				value.fields.push({ allowBlank: false, name: 'SubCommand', xtype: 'hidden', decimalPrecision: 0, value: 3 });
				value.fields.push({ fieldLabel: 'GPRS Interval', allowBlank: false, name: 'GPRSInterval', minValue: 1, maxValue: 65000, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'GPS Interval', allowBlank: false, name: 'GPSInterval', minValue: 1, maxValue: 65000, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Health Interval', allowBlank: false, name: 'HealthInterval', minValue: 1, maxValue: 65000, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Environment Interval', allowBlank: false, name: 'EnvironmentInterval', minValue: 1, maxValue: 1440, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ allowBlank: false, name: 'SubCommand2', xtype: 'hidden', decimalPrecision: 0, value: 4 });
				value.fields.push({ fieldLabel: 'GPS Without Motion Interval', allowBlank: false, name: 'GPSWithoutMotionInterval', minValue: 1, maxValue: 65000, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'GPS With Motion Interval', allowBlank: false, name: 'GPSWithMotionInterval', minValue: 2, maxValue: 1440, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Stop Movement Detect Interval', allowBlank: false, name: 'StopMovementDetectInterval', minValue: 2, maxValue: 1440, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ allowBlank: false, name: 'SubCommand3', xtype: 'hidden', decimalPrecision: 0, value: 6 });
				value.fields.push({ fieldLabel: 'Scan Interval', allowBlank: false, name: 'ScanInterval', minValue: 1, maxValue: 1440, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Scan ON Time Interval', allowBlank: false, name: 'ScanONTimeInterval', minValue: 1, maxValue: 1440, xtype: 'numberfield', decimalPrecision: 0 });
				break;
			case type.SET_POWER_SAVING_TIME:
				value.groupTitle = "Set Power Saving Time";
				value.fields.push(powerSavingModeCombo);
				value.fields.push(new Ext.form.TimeField({ fieldLabel: 'Start Time', allowBlank: false, format: 'H:i', listWidth: 80, name: 'StartTime', value: '00:00' }));
				value.fields.push(new Ext.form.TimeField({ fieldLabel: 'End Time', allowBlank: false, format: 'H:i', listWidth: 80, name: 'EndTime', value: '00:00' }));
				break;
			case type.CONTROL_EVENT:
				value.groupTitle = "Control Event";
				value.fields.push(motionEventModeCombo);
				value.fields.push(healthEventModeCombo);
				value.fields.push(doorEventModeCombo);
				break;
		}
		return value;
	},

	getSmartDeviceCommandValue: function (record) {
		this.smartDeviceTypeCommandCombo.enable();
		var smartDeviceTypeCommandComboStore = this.smartDeviceTypeCommandCombo.store;
		if (smartDeviceTypeCommandComboStore) {
			smartDeviceTypeCommandComboStore.baseParams.selectedSmartDeviceTypeId = record.get('LookupId');
		}
	},

	FileUploader: {
		userLocationMassGrid: null,
		Show: function (options) {
			options = options || {};
			Ext.applyIf(options, {
				fieldLabel: 'Select files',
				allowedTypes: []
			});
			var url = EH.BuildUrl('BulkCommandByExcel');

			if (!this.win) {
				var uploadFile = new Ext.form.FileUploadField({
					fieldLabel: options.fieldLabel,
					width: 250,
					name: 'file',
					multiple: false,
					vtype: 'fileUploadExcel',
					allowBlank: false
				});
				uploadFile.on('fileselected', this.showFileList, this);
				// create form panel
				var formPanel = new Ext.form.FormPanel({
					labelWidth: 100,
					autoScroll: true,
					bodyStyle: "padding:5px;",
					fileUpload: true,
					url: url,
					items: [uploadFile, { itemId: 'selectedFilesList', xtype: 'box', autoEl: { html: '', width: 90 } }]
				});
				// define window
				var window = new Ext.Window({
					title: 'Upload',
					width: 500,
					height: 150,
					layout: 'fit',
					modal: true,
					plain: true,
					closeAction: 'hide',
					items: formPanel,
					buttons: [{
						text: 'Upload',
						handler: function () {
							// check form value
							if (formPanel.form.isValid()) {
								var params = {
									action: 'BulkCommandByExcelFile',
									smartDeviceTypeCommandId: options.smartDeviceType_CommandId,
									commandValue: options.command_Value,
								};
								formPanel.form.submit({
									params: params,
									waitMsg: 'Uploading...',
									failure: this.onFailure,
									success: this.onSuccess,
									scope: this
								});
							} else {
								Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
							}
							options.bulkCommandWin.hide();
						},
						scope: this
					}]
				});
				this.formPanel = formPanel;
				this.win = window;
			}
			this.options = options;
			this.formPanel.form.reset();
			this.win.show();
			this.formPanel.items.get('selectedFilesList').el.update('') // clearing Html of widows
		},
		showFileList: function (list) {
			var listContainer = this.formPanel.items.get('selectedFilesList');
			var totalFiles = list.getValue().split(',');
			var html = '';
			for (var i = 0; i < totalFiles.length; i++) { // starting from 1 to not select first path that contain fakepath
				html += '<li>' + totalFiles[i] + '</li>';
			}
			html = '<ul>' + html + '</ul>';
			listContainer.el.update(html);
		},
		onFailure: function (form, action) {
			Ext.MessageBox.alert('Error', action.result.info);
		},

		onSuccess: function (form, action) {
			this.win.hide();
			var fileName = this.formPanel.getComponent(0).getValue().replace('C:\\fakepath\\', '');
			Ext.Msg.alert('Success', Ext.decode(action.response.responseText).message);
		}
	},

	onSelectionByExcel: function (combo, newValue, oldValue) {
		var isRadioByExcel = Ext.getCmp('radioByExcel')
		this.isRadioByExcel = isRadioByExcel;
		var isRadioBySmartDeviceType = Ext.getCmp('radioBySmartDeviceType')
		this.isRadioBySmartDeviceType = isRadioBySmartDeviceType;
		if (this.isRadioByExcel.checked) {
			this.isRadioBySmartDeviceType.setValue(false)
		}
		if (newValue) {
			this.btnSave.setText('Import Excel');
			this.smartDeviceTypeCombo.setValue('');
			this.smartDeviceTypeCommandCombo.setValue('');
			this.txtCommandValue.setValue('');
			Ext.getCmp('SmartDeviceTypeComponentId').disable();
			Ext.getCmp('SmartDeviceTypeCommandComponentId').enable();
			Ext.getCmp('ValueComponentId').enable();
		}
		else {
			Ext.getCmp('SmartDeviceTypeComponentId').disable();
			Ext.getCmp('SmartDeviceTypeCommandComponentId').disable();
			Ext.getCmp('ValueComponentId').disable();
		}
	},

	onSelectionBySmartDeviceType: function (combo, newValue, oldValue) {
		var isRadioByExcel = Ext.getCmp('radioByExcel')
		this.isRadioByExcel = isRadioByExcel;
		var isRadioBySmartDeviceType = Ext.getCmp('radioBySmartDeviceType')
		this.isRadioBySmartDeviceType = isRadioBySmartDeviceType;
		if (this.isRadioBySmartDeviceType.checked) {
			this.isRadioByExcel.setValue(false)
		}
		if (newValue) {
			this.btnSave.setText('Save');
			this.smartDeviceTypeCombo.setValue('');
			this.smartDeviceTypeCommandCombo.setValue('');
			this.txtCommandValue.setValue('');
			Ext.getCmp('SmartDeviceTypeComponentId').enable();
			Ext.getCmp('SmartDeviceTypeCommandComponentId').enable();
			Ext.getCmp('ValueComponentId').enable();
		}
		else {
			Ext.getCmp('SmartDeviceTypeComponentId').disable();
			Ext.getCmp('SmartDeviceTypeCommandComponentId').disable();
			Ext.getCmp('ValueComponentId').disable();
		}
	}
});