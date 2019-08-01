var z = 0;
Ext.define('CoolerIoTMobile.controller.DebugDevice', {
	extend: 'Ext.app.Controller',
	config: {
		commandParamData: [],
		newDeviceInfo: {},
		bulkCommandExecutionStore: [CoolerIoTMobile.BleCommands.SET_SENSOR_THRESHOLD, CoolerIoTMobile.BleCommands.MODIFY_LAST_READ_EVENT_INDEX, CoolerIoTMobile.BleCommands.SET_ADVERTISING_PERIOD, CoolerIoTMobile.BleCommands.SET_INTERVAL, CoolerIoTMobile.BleCommands.SET_STANDBY_MODE, CoolerIoTMobile.BleCommands.SET_MAJOR_MINOR_VERSION],
		refs: {
			debugDeviceNavBtn: 'mobile-main button#debugDeviceNavBtn',
			scanningWindow: 'scanningDevicePanel',
			debugDevicePanel: 'debugDevicePanel',
			debugDeviceContainer: 'debugDeviceContainer',
			scaningWindowCloseButton: 'scanningDevicePanel button#scaningWindowCloseButton',
			scanButton: 'mobile-main button#deviceScanBtn',
			fetchDataButton: 'debugDevicePanel toolbar button#fetchButton',
			disconnectButton: 'mobile-main button#connectionStateBtn',
			main: 'app-viewport',
			scanningDeviceList: 'scanningDeviceList',
			commandInputPanel: '#commandPanel',
			bluetooth: 'ble-bluetoothLe#coolerIotDeviceActor',
			commandsNavigation: 'debugDeviceContainer #debuggCommandsNavigation',
			commandWindowOkButton: '#commandPanel toolbar button#commandWindowOkButton',
			commandInputForm: 'commandInputPanel #inputDataContainer',
			commandMenu: 'debugDeviceContainer #debugSlideContainer',
			deviceDetailsSaveBtn: 'mobile-main button#deviceDetailsSaveBtn',
			deviceLogInfoBtn: 'mobile-main button#deviceLogInfoBtn',
			logsWindow: 'deviceLogInfoPanel',
			deviceLogInfoPanelCloseButton: 'deviceLogInfoPanel titlebar button#deviceLogInfoPanelCloseButton',
			deviceFactorySetup: 'deviceFactorySetup',
			deviceFactorySetupSetBtn: '[itemId=deviceFactorySetupSetBtn]'
		},
		control: {
			commandsNavigation: {
				itemsingletap: 'onCommandsNavigation'
			},
			scanButton: {
				tap: 'onScanButtonClick'
			},
			fetchDataButton: {
				tap: 'onFetchDataButtonClick'
			},
			disconnectButton: {
				tap: 'onDisconnectButtonClick'
			},
			commandWindowOkButton: {
				tap: 'onCommandWindowOkButtonClick'
			},
			debugDeviceNavBtn: {
				tap: 'onDebugDeviceNavBtn'
			},
			scaningWindowCloseButton: {
				tap: 'onScaningWindowCloseButton'
			},
			debugDeviceContainer: {
				destroy: 'onDebugDestroy'
			},
			deviceDetailsSaveBtn: {
				tap: 'onDeviceDetailSaveClick'
			},
			deviceLogInfoBtn: {
				tap: 'onDeviceLogInfoClick'
			},
			deviceLogInfoPanelCloseButton: {
				tap: 'onDeviceLogInfoPanelCloseButton'
			},
			deviceFactorySetupSetBtn: {
				tap: 'onDeviceFactorySetupSetBtnTap'
			},
			deviceFactorySetup: {
				show: 'onDeviceFactorySetupShow',
				hide: 'onDeviceFactorySetupHide'
			}
		}
	},
	onDeviceLogInfoPanelCloseButton: function () {
		var logsPanel = this.getLogsWindow();
		logsPanel.hide();
	},
	onDeviceLogInfoClick: function (button) {
		var logsPanel = this.getLogsWindow();
		if (!logsPanel) {
			logsPanel = Ext.Viewport.add({ xtype: 'deviceLogInfoPanel' });
		}
		logsPanel.show();
	},
	onDeviceDetailSaveClick: function (button) {
		var bluetooth = this.getBluetooth();
		if (!bluetooth || !bluetooth.getIsConnected()) {
			Ext.Msg.alert(CoolerIoTMobile.Localization.ConnectErrorTitle, CoolerIoTMobile.Localization.ConnectDeviceMessage);
			return;
		}
		button.setDisabled(true);
		var deviceDataContainer = this.getDebugDevicePanel().down('#deviceDataList'),
		    bulkCommandData = deviceDataContainer.getData();
		if (bluetooth.getActiveDeviceName().indexOf('SV') > -1) {
			this.getBulkCommandExecutionStore().push(CoolerIoTMobile.BleCommands.SET_CAMERA_SETTING, CoolerIoTMobile.BleCommands.ENABLE_TAKE_PICTURE);
		}
		var storeLen = this.getBulkCommandExecutionStore().length;
		this.processBulkCommandExection(this, bulkCommandData, storeLen);
		Ext.Viewport.setMasked({ xtype: 'loadmask' });
	},
	setCurrentTimeFromHomeScreen: function () {
		var bluetooth = this.getBluetooth();
		if (!bluetooth || !bluetooth.getIsConnected()) {
			Ext.Msg.alert(CoolerIoTMobile.Localization.ConnectErrorTitle, CoolerIoTMobile.Localization.ConnectDeviceMessage);
			return;
		}
		var date = new Date(),
		commandData = [];
		CoolerIoTMobile.util.Utility.isSetBulkCommandExecution = true;
		commandData.push(CoolerIoTMobile.util.Utility.decimalToBytes(date.getTime() / 1000, 4));
		window.plugins.toast.show('Updating device time', 'short', 'bottom');
		this.executeCommand(CoolerIoTMobile.BleCommands.SET_REAL_TIME_CLOCK, commandData);
		window.plugins.toast.show('Device time updated', 'short', 'bottom');
	},
	processBulkCommandExection: function (me, bulkCommandData, storeLen) {
		setTimeout(function () {
			var currentExecutionCommand = me.getBulkCommandExecutionStore().pop();
			switch (currentExecutionCommand) {
				case CoolerIoTMobile.BleCommands.MODIFY_LAST_READ_EVENT_INDEX:
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.RangeOfEventId, 1));
					break;
				case CoolerIoTMobile.BleCommands.SET_ADVERTISING_PERIOD:
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.AdvertisingPeriodMilliseconds, 2));
					break;
				case CoolerIoTMobile.BleCommands.SET_INTERVAL:
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.PeriodicIntervalMinutes, 1));
					break;
				case CoolerIoTMobile.BleCommands.SET_SENSOR_THRESHOLD:
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.TemperatureOutOfThreashold, 2));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.LightOutOfThreashold, 2));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.HumidityOutOfThreashold, 1));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.MovementThresholdG, 1));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.MovementThresholdTime, 1));
					break;
				case CoolerIoTMobile.BleCommands.SET_CAMERA_SETTING:
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.Brightness, 1));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.Contrast, 1));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.Saturation, 1));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.ShutterSpeed, 2));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.CameraQuality, 1));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.Effect, 1));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.LightMode, 1));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.CameraClock, 1));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.Cdly, 2));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.Drive, 1));
					break;
				case CoolerIoTMobile.BleCommands.SET_STANDBY_MODE:
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.StandByModeValue, 1));
					break;
				case CoolerIoTMobile.BleCommands.ENABLE_TAKE_PICTURE:
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.EnableTakePicture, 1));
					break;
				case CoolerIoTMobile.BleCommands.SET_MAJOR_MINOR_VERSION:
					var major = bulkCommandData.Major ? bulkCommandData.Major : 1,
						minor = bulkCommandData.Minor ? bulkCommandData.Minor : 1;
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(major, 2));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(minor, 2));
					me.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(bulkCommandData.Rssi, 1));
					break;
			}
			var bluetooth = me.getBluetooth(),
			param = me.getCommandParamData();
			bluetooth.fireEvent('writeDeviceCommand', currentExecutionCommand, param);
			me.setCommandParamData([]);
			if (z <= storeLen) {
				z++;
				CoolerIoTMobile.util.Utility.isSetBulkCommandExecution = true;
				me.processBulkCommandExection(me, bulkCommandData, storeLen);
			}
			else {
				CoolerIoTMobile.util.Utility.isSetBulkCommandExecution = false;
				window.plugins.toast.show('Record updated successfully', 'short', 'bottom');
				me.getBulkCommandExecutionStore().push(CoolerIoTMobile.BleCommands.SET_SENSOR_THRESHOLD, CoolerIoTMobile.BleCommands.MODIFY_LAST_READ_EVENT_INDEX, CoolerIoTMobile.BleCommands.SET_ADVERTISING_PERIOD, CoolerIoTMobile.BleCommands.SET_INTERVAL, CoolerIoTMobile.BleCommands.SET_STANDBY_MODE, CoolerIoTMobile.BleCommands.SET_MAJOR_MINOR_VERSION);
				Ext.Viewport.unmask();
			}
		}, 700)
	},

	onDebugDestroy: function (panel, eOpts) {
		var bluetooth = this.getBluetooth();
		if (bluetooth) {
			bluetooth.setIsConnected(false);
			console.log('ondestroy - stop notification');
			bluetooth.fireEvent('stopNotification');
		}
	},
	onDisconnectButtonClick: function () {
		var bluetooth = this.getBluetooth();
		if (!bluetooth.getIsConnected()) {
			bluetooth.fireEvent('connectDevice', bluetooth.getActiveDeviceAddress());
			//Ext.Msg.alert(CoolerIoTMobile.Localization.ConnectErrorTitle, CoolerIoTMobile.Localization.ConnectDeviceMessage);
			return;
		}
		else {
			bluetooth.setActiveCommand(null);
			bluetooth.fireEvent('disconnectDevice');
		}
	},
	addCommandParamData: function (value, isDirect) {
		var param = this.getCommandParamData() || [];
		if (isDirect) {
			for (var i = 0; i < value.length; i++) {
				param.push(value[i]);
			}
		}
		else {
			for (var i = value.length; i--;) {
				param.push(value[i]);
			}
		}

		this.setCommandParamData(param);
	},
	onCommandWindowOkButtonClick: function (button) {
		var commandPanel = this.getCommandInputPanel();
		var form = this.getCommandInputForm();
		var command = commandPanel.getCommand();
		this.setCommandParamData([]);
		var values = form.getValues();
		switch (command) {
			case CoolerIoTMobile.BleCommands.SENSOR_ON:
			case CoolerIoTMobile.BleCommands.SENSOR_OFF:
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.SensorGroupId, 1));
				break;
			case CoolerIoTMobile.BleCommands.LATEST_N_EVENTS:
				var store = Ext.getStore('DeviceData');
				store.removeAll();
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.LatestEvent, 2));
				break;
			case CoolerIoTMobile.BleCommands.EVENT_DATA_FROM_IDX_IDY:
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.EventIdX, 2));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.EventIdY, 2));
				break;
			case CoolerIoTMobile.BleCommands.SET_INTERVAL:
				if (values.Interval < 1 || values.Interval > 60) {
					Ext.Msg.alert(CoolerIoTMobile.Localization.Error, CoolerIoTMobile.Localization.IntervalValidationError);
					return;
				}
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Interval, 1));
				break;
			case CoolerIoTMobile.BleCommands.SET_REAL_TIME_CLOCK:
				var date = new Date(values.Date);

				if (!Ext.isDate(date)) {
					Ext.Msg.alert(CoolerIoTMobile.Localization.Error, CoolerIoTMobile.Localization.InvalidDateMessage);
					return;
				}
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(date.getTime() / 1000, 4));
				break;
			case CoolerIoTMobile.BleCommands.SET_GPS_LOCATION:
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Latitude, 4));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Longitude, 4));
				break;
			case CoolerIoTMobile.BleCommands.SET_MAJOR_MINOR_VERSION:
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Major, 2));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Minor, 2));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.RssiValueFor1Meter, 1));
				break;
			case CoolerIoTMobile.BleCommands.SET_SERIAL_NUMBER:
				//14 bytes max
				var buffer = CoolerIoTMobile.util.Utility.stringToBytes(values.SerialNumber);
				this.addCommandParamData(new Uint8Array(buffer), true);
				break;
			case CoolerIoTMobile.BleCommands.SET_ADVERTISING_PERIOD:
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Milliseconds, 2));
				break;
			case CoolerIoTMobile.BleCommands.SET_SENSOR_THRESHOLD:
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Temperature, 2));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Light, 2));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Humidity, 1));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.MovementThresholdG, 1));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.MovementThresholdTime, 1));
				break;
			case CoolerIoTMobile.BleCommands.SET_CHANGE_PASSWORD:
				console.log('Password  - ' + values.Password);
				var bytes = CoolerIoTMobile.util.Utility.getPasswordBytes(values.Password);
				this.addCommandParamData(bytes, true);
				break;
			case CoolerIoTMobile.BleCommands.SET_RSSI_FOR_IBEACON_FRAME:
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.RssiValue, 1));
				break;
			case CoolerIoTMobile.BleCommands.MODIFY_LAST_READ_EVENT_INDEX:
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.ModifyLastReadEventIndex, 1));
				break;
			case CoolerIoTMobile.BleCommands.SET_IBEACON_UUID:
				var buffer = CoolerIoTMobile.util.Utility.stringToBytes(values.UUID);
				this.addCommandParamData(new Uint8Array(buffer), true);
				break;
			case CoolerIoTMobile.BleCommands.SET_MAC_ADDRESS:
				var buffer = CoolerIoTMobile.util.Utility.hexStringToByteArray(values.MacAddress.replace(/:/g, ''));
				this.addCommandParamData(new Uint8Array(buffer), true);
				break;
			case CoolerIoTMobile.BleCommands.SET_DOOR_OPEN_ANGLE:
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.ThresholdAngle, 1));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.TriggerDelta, 1));
				break;
			case CoolerIoTMobile.BleCommands.SET_CAMERA_SETTING:
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Brightness, 1));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Contrast, 1));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Saturation, 1));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.ShutterSpeed, 2));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.CameraQuality, 1));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Effect, 1));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.LightMode, 1));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.CameraClock, 1));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Cdly, 2));
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.Drive, 1));
				break;
			case CoolerIoTMobile.BleCommands.READ_OLDEST_N_EVENT:
				this.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(values.ReadOldestEvent, 2));
				break;
			default:
				break;
		}
		commandPanel.hide();
		this.executeCommand(command, this.getCommandParamData());
	},
	onDebugDeviceNavBtn: function () {
		var slideNav = this.getCommandMenu();
		if (slideNav.isHidden()) {
			slideNav.show();
		} else {
			slideNav.hide();
		}
	},
	onCommandsNavigation: function (dataview, index, target, record, e, eOpts) {
		var menuId = record.get('MenuId'), me = this, parentId = record.get('parentId');
		var slideNav = this.getCommandMenu();

		if (!menuId)
			return;

		var commandInputPanel = this.getCommandInputPanel();
		if (menuId == CoolerIoTMobile.BleCommands.FACTORY_SETUP) {
			slideNav.hide();
			CoolerIoTMobile.util.Utility.isManualFactorySetup = true;
			var win = Ext.Viewport.add(Ext.create('CoolerIoTMobile.view.Mobile.DeviceFactorySetup'));
			win.show();
			return;
		}
		if (menuId != -111 && menuId != -222) {
			slideNav.hide();
			var bluetooth = this.getBluetooth();
			if (!bluetooth || !bluetooth.getIsConnected()) {
				Ext.Msg.alert(CoolerIoTMobile.Localization.ConnectErrorTitle, CoolerIoTMobile.Localization.ConnectDeviceMessage);
				return;
			}
			if (!commandInputPanel) {
				commandInputPanel = Ext.Viewport.add({ xtype: 'commandInputPanel', itemId: 'commandPanel', hidden: true });
			}
			commandInputPanel.setCommand(menuId);
		}

		switch (menuId) {
			case CoolerIoTMobile.BleCommands.FETCH_DATA:
				me.onFetchDataButtonClick();
				break;
			case CoolerIoTMobile.BleCommands.FIRMWARE_DETAIL:
				this.executeCommand(CoolerIoTMobile.BleCommands.FIRMWARE_DETAIL);
				break;
			case CoolerIoTMobile.BleCommands.CURRENT_TIME:
				this.executeCommand(CoolerIoTMobile.BleCommands.CURRENT_TIME);
				break;
			case CoolerIoTMobile.BleCommands.SERIALNUMBER:
				this.executeCommand(CoolerIoTMobile.BleCommands.SERIALNUMBER);
				break;
			case CoolerIoTMobile.BleCommands.RESTART_DEVICE:
				this.executeCommand(CoolerIoTMobile.BleCommands.RESTART_DEVICE);
				break;
			case CoolerIoTMobile.BleCommands.RESET_DEVICE:
				this.executeCommand(CoolerIoTMobile.BleCommands.RESTART_DEVICE);
				break;
			case CoolerIoTMobile.BleCommands.SENSOR_ON:
			case CoolerIoTMobile.BleCommands.SENSOR_OFF:
				var fields = [{ xtype: 'numberfield', name: 'SensorGroupId', labelWidth: 150, label: CoolerIoTMobile.Localization.SensorGroupId, maxLength: 1 }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.SensorGroupTitle);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA:
				this.executeCommand(CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA);
				break;
			case CoolerIoTMobile.BleCommands.EVENT_COUNT:
				this.executeCommand(CoolerIoTMobile.BleCommands.EVENT_COUNT);
				break;
			case CoolerIoTMobile.BleCommands.LATEST_N_EVENTS:
				var fields = [{ xtype: 'numberfield', tabIndex: 1, name: 'LatestEvent', labelWidth: 150, label: CoolerIoTMobile.Localization.LatestEvent }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.LatestEventTitle);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.EVENT_DATA_FROM_IDX_IDY:
				var fields = [{ xtype: 'numberfield', tabIndex: 1, name: 'EventIdX', labelWidth: 150, label: CoolerIoTMobile.Localization.EventIdX },
					{ xtype: 'numberfield', tabIndex: 2, name: 'EventIdY', labelWidth: 150, label: CoolerIoTMobile.Localization.EventIdY }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.EventDataTitle);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.ERASE_EVENT_DATA:
				this.executeCommand(CoolerIoTMobile.BleCommands.ERASE_EVENT_DATA);
				break;
			case CoolerIoTMobile.BleCommands.SOUND_BUZZER:
				this.executeCommand(CoolerIoTMobile.BleCommands.SOUND_BUZZER);
				break;
			case CoolerIoTMobile.BleCommands.SET_INTERVAL:
				var fields = [{ xtype: 'numberfield', tabIndex: 1, maxValue: 60, minValue: 1, name: 'Interval', labelWidth: 180, label: CoolerIoTMobile.Localization.PeriodicInterval }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.PeriodicIntervalTitle);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.SET_REAL_TIME_CLOCK:

				var fields = [{ xtype: 'textfield', tabIndex: 1, name: 'Date', value: Ext.DateExtras.format(new Date(), "m/d/Y G:i:s"), labelWidth: 80, label: CoolerIoTMobile.Localization.Date }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.SetClockTitle);
				commandInputPanel.show();

				break;
			case CoolerIoTMobile.BleCommands.SET_GPS_LOCATION:

				var fields = [{ xtype: 'numberfield', tabIndex: 1, name: 'Latitude', labelWidth: 150, label: CoolerIoTMobile.Localization.Latitude },
				{ xtype: 'numberfield', tabIndex: 2, name: 'Longitude', labelWidth: 150, label: CoolerIoTMobile.Localization.Longitude }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.GpsLocationTitle);
				commandInputPanel.show();

				break;
			case CoolerIoTMobile.BleCommands.SET_MAJOR_MINOR_VERSION:
				var fields = [{ xtype: 'numberfield', tabIndex: 1, name: 'Major', labelWidth: 150, label: CoolerIoTMobile.Localization.Major },
				{ xtype: 'numberfield', tabIndex: 2, name: 'Minor', labelWidth: 150, label: CoolerIoTMobile.Localization.Minor },
				{ xtype: 'numberfield', tabIndex: 3, name: 'RssiValueFor1Meter', labelWidth: 250, label: CoolerIoTMobile.Localization.RssiTitleInMeter }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.MajorMinorTitle);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.SET_SERIAL_NUMBER:
				var fields = [{ xtype: 'textfield', tabIndex: 1, maxLength: 14, name: 'SerialNumber', labelWidth: 150, label: CoolerIoTMobile.Localization.SerialNumber }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.SerialNumberTitle);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.SET_ADVERTISING_PERIOD:

				var fields = [{ xtype: 'numberfield', tabIndex: 1, name: 'Milliseconds', labelWidth: 150, label: CoolerIoTMobile.Localization.Milliseconds }];

				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.SetAdvertisingPeriod);
				commandInputPanel.show();

				break;
			case CoolerIoTMobile.BleCommands.SET_SENSOR_THRESHOLD:
				var fields = [{ xtype: 'numberfield', tabIndex: 1, name: 'Temperature', labelWidth: '75%', label: CoolerIoTMobile.Localization.TemperatureOutOfThreashold },
				{ xtype: 'numberfield', tabIndex: 2, name: 'Light', labelWidth: '75%', label: CoolerIoTMobile.Localization.LightOutOfThreashold },
				{ xtype: 'numberfield', tabIndex: 3, name: 'Humidity', labelWidth: '75%', label: CoolerIoTMobile.Localization.HumidityOutOfThreashold },
				{ xtype: 'numberfield', tabIndex: 4, name: 'MovementThresholdG', labelWidth: '75%', label: CoolerIoTMobile.Localization.MovementThresholdG },
				{ xtype: 'numberfield', tabIndex: 5, name: 'MovementThresholdTime', labelWidth: '75%', label: CoolerIoTMobile.Localization.MovementThresholdTime }
				];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.SetSensorThreshold);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.SET_STANDBY_MODE:
				this.executeCommand(CoolerIoTMobile.BleCommands.SET_STANDBY_MODE, [record.raw.flag]);
				break;
			case CoolerIoTMobile.BleCommands.SET_DEVICE_IN_DFU:
				this.executeCommand(CoolerIoTMobile.BleCommands.SET_DEVICE_IN_DFU);
				break;
			case CoolerIoTMobile.BleCommands.SET_CHANGE_PASSWORD:
				var fields = [{ xtype: 'passwordfield', name: 'Password', labelWidth: 150, label: CoolerIoTMobile.Localization.Password, maxLength: 19 }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.SetPasswordTitle);

				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.SET_RSSI_FOR_IBEACON_FRAME:
				var fields = [{ xtype: 'numberfield', tabIndex: 1, name: 'RssiValue', labelWidth: 150, label: CoolerIoTMobile.Localization.RssiValue, maxlength: 3 }];

				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.SetRssiTitle);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.MODIFY_LAST_READ_EVENT_INDEX:
				var fields = [{ xtype: 'numberfield', tabIndex: 1, name: 'ModifyLastReadEventIndex', labelWidth: 250, label: CoolerIoTMobile.Localization.ModifyLastReadIndex, maxlength: 4 }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.ModifyLastReadIndex);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.SET_IBEACON_UUID:
				var fields = [{ xtype: 'textfield', tabIndex: 1, name: 'UUID', labelWidth: 150, label: CoolerIoTMobile.Localization.UUID }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.SetIbeaconUUID);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.SET_MAC_ADDRESS:
				var fields = [{ xtype: 'textfield', tabIndex: 1, name: 'MacAddress', labelWidth: 175, label: CoolerIoTMobile.Localization.MacAddress }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.SetMacAddress);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.READ_CONFIGURATION_PARAMETER:
				this.executeCommand(CoolerIoTMobile.BleCommands.READ_CONFIGURATION_PARAMETER);
				break;
			case CoolerIoTMobile.BleCommands.TAKE_PICTURE:
				this.executeCommand(CoolerIoTMobile.BleCommands.TAKE_PICTURE);
				break;
			case CoolerIoTMobile.BleCommands.READ_AVAILABLE_UNREAD_EVENT:
				this.executeCommand(CoolerIoTMobile.BleCommands.READ_AVAILABLE_UNREAD_EVENT);
				break;
			case CoolerIoTMobile.BleCommands.READ_IMAGE_DATA:
				this.executeCommand(CoolerIoTMobile.BleCommands.READ_IMAGE_DATA);
				break;
			case CoolerIoTMobile.BleCommands.READ_CAMERA_SETTING:
				this.executeCommand(CoolerIoTMobile.BleCommands.READ_CAMERA_SETTING);
				break;
			case CoolerIoTMobile.BleCommands.View_Image:
				FileIO.showDownloadedImage();
				break;
			case CoolerIoTMobile.BleCommands.ENABLE_TAKE_PICTURE:
				this.executeCommand(CoolerIoTMobile.BleCommands.ENABLE_TAKE_PICTURE, [record.raw.flag]);
				break;
			case CoolerIoTMobile.BleCommands.SET_DOOR_OPEN_ANGLE:
				var fields = [{ xtype: 'numberfield', tabIndex: 1, name: 'ThresholdAngle', labelWidth: '75%', label: CoolerIoTMobile.Localization.ThresholdAngle },
				{ xtype: 'numberfield', tabIndex: 2, name: 'TriggerDelta', labelWidth: '75%', label: CoolerIoTMobile.Localization.TriggerDelta }
				];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.SetDoorOpenAngle);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.SET_CAMERA_SETTING:
				var blueToothLeDeviceActorController = CoolerIoTMobile.app.getController('BlueToothLeDeviceActor');
				var records = blueToothLeDeviceActorController.getDebugDevicePanel().down('#deviceDataList').getData();
				var fields = [{ xtype: 'numberfield', tabIndex: 1, name: 'Brightness', labelWidth: '60%', value: records.Brightness, label: CoolerIoTMobile.Localization.Brightness },
				{ xtype: 'numberfield', tabIndex: 2, name: 'Contrast', labelWidth: '60%', value: records.Contrast, label: CoolerIoTMobile.Localization.Contrast },
				{ xtype: 'numberfield', tabIndex: 2, name: 'Saturation', labelWidth: '60%', value: records.Saturation, label: CoolerIoTMobile.Localization.Saturation },
				{ xtype: 'numberfield', tabIndex: 2, name: 'ShutterSpeed', labelWidth: '60%', value: records.ShutterSpeed, label: CoolerIoTMobile.Localization.ShutterSpeed },
				{ xtype: 'numberfield', tabIndex: 2, name: 'CameraQuality', labelWidth: '60%', value: records.CameraQuality, label: CoolerIoTMobile.Localization.CameraQuality },
				{ xtype: 'numberfield', tabIndex: 2, name: 'Effect', labelWidth: '60%', value: records.Effect, label: CoolerIoTMobile.Localization.Effect },
				{ xtype: 'numberfield', tabIndex: 2, name: 'LightMode', labelWidth: '60%', value: records.LightMode, label: CoolerIoTMobile.Localization.LightMode },
				{ xtype: 'numberfield', tabIndex: 2, name: 'CameraClock', labelWidth: '60%', value: records.CameraClock, label: CoolerIoTMobile.Localization.CameraClock },
				{ xtype: 'numberfield', tabIndex: 2, name: 'Cdly', labelWidth: '60%', value: records.Cdly, label: CoolerIoTMobile.Localization.Cdly },
				{ xtype: 'numberfield', tabIndex: 2, name: 'Drive', labelWidth: '60%', value: records.Cdly, label: CoolerIoTMobile.Localization.Drive }
				];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.SetCameraSetting);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.READ_CALIBRATE_GYRO:
				this.executeCommand(CoolerIoTMobile.BleCommands.READ_CALIBRATE_GYRO);
				break;
			case -111:
			case -222:
				var store = dataview.getStore();
				store.clearFilter();
				var containerData = CoolerIoTMobile.app.getController('BlueToothLeDeviceActor').getDebugDevicePanel().down('#deviceDataList').getData();
				if (containerData == null || !containerData.IsSmartVision) {
					store.filter('isSmartVision', false);
				}
				store.filter('parentId', menuId);
				break;
			case CoolerIoTMobile.BleCommands.RESET_MAC_ADDRESS:
				Ext.Msg.confirm('Reset MAC address to factory default?', 'Setup default mac address for new device: ' + CoolerIoTMobile.util.Utility.defaultMacAddress, this.onReserMacAddress, this);
				break;
			case CoolerIoTMobile.BleCommands.SET_DEEP_SLEEP:
				this.executeCommand(CoolerIoTMobile.BleCommands.SET_DEEP_SLEEP);
				break;
			case CoolerIoTMobile.BleCommands.READ_OLDEST_N_EVENT:
				var fields = [{ xtype: 'numberfield', tabIndex: 1, name: 'ReadOldestEvent', labelWidth: 175, label: CoolerIoTMobile.Localization.GetOldestNEvents }];
				commandInputPanel.setContainerItems(fields);
				commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.GetOldestNEvents);
				commandInputPanel.show();
				break;
			case CoolerIoTMobile.BleCommands.SET_CAMERA_FACTORY_DEFAULT_SETTING:
				this.executeCommand(CoolerIoTMobile.BleCommands.SET_CAMERA_FACTORY_DEFAULT_SETTING);
				break;
			default:
				break;
		}

	},
	onReserMacAddress: function (button, value, opt) {
		if (button == "yes") {
			var buffer = CoolerIoTMobile.util.Utility.hexStringToByteArray(CoolerIoTMobile.util.Utility.defaultMacAddress.replace(/:/g, ''));
			this.addCommandParamData(new Uint8Array(buffer), true);
			this.executeCommand(CoolerIoTMobile.BleCommands.SET_MAC_ADDRESS, this.getCommandParamData());
		}
	},
	executeCommand: function (command, param) {
		var store = Ext.getStore('CommandData');
		store.removeAll();
		var bluetooth = this.getBluetooth();
		bluetooth.fireEvent('writeDeviceCommand', command, param);
	},
	onFetchDataButtonClick: function (button) {
		var bluetooth = this.getBluetooth();
		if (!bluetooth || !bluetooth.getIsConnected()) {
			Ext.Msg.alert(CoolerIoTMobile.Localization.ConnectErrorTitle, CoolerIoTMobile.Localization.ConnectDeviceMessage);
			return;
		}

		var store = Ext.getStore('DeviceData');
		store.removeAll();
		this.executeCommand(CoolerIoTMobile.BleCommands.FETCH_DATA);
	},
	onScanButtonClick: function (button) {
		var scanningWindow = this.getScanningWindow();
		if (!scanningWindow) {
			scanningWindow = Ext.Viewport.add({ xtype: 'scanningDevicePanel' });
		}

		var bluetooth = this.getBluetooth();
		if (!bluetooth)
			bluetooth = Ext.create('CoolerIoTMobile.widget.BlueToothLe', { itemId: 'coolerIotDeviceActor' });

		if (bluetooth.getActiveDeviceAddress() != null) {
			bluetooth.fireEvent('disconnectDevice');
		}
		scanningDeviceStore = Ext.getStore('BleTag');
		scanningDeviceStore.clearData();
		scanningWindow.fireEvent('startscan');
		scanningWindow.show();
	},
	onScaningWindowCloseButton: function (button) {
		button.up().up().up().destroy();
		var me = this.getBluetooth();
		if (CoolerIoTMobile.util.Utility.isManualFactorySetup) {
			CoolerIoTMobile.util.Utility.isManualFactorySetup = false;
		}
		me.fireEvent('stopScan');
	},
	onDeviceFactorySetupSetBtnTap: function (button) {

		String.prototype.hexEncode = function () {
			var hex, i;

			var result = "";
			for (i = 0; i < this.length; i++) {
				hex = this.charCodeAt(i).toString(16);
				result += ("000" + hex).slice(-4);
			}

			return result
		}
		var view = this.getDeviceFactorySetup();
		var formFields = view.getFieldsAsArray();
		for (var l = 0, len = formFields.length; l < len ; l++) {
			var fieldName = formFields[l].getName(),
				value = formFields[l].getValue();
			if (fieldName == "SmartDevicePrefix") {
				var validator = new RegExp("[A-Z]{3}-[A-Z]{2}[0-9]{4}")
				if (value.length != 10 || !validator.test(value)) {
					window.plugins.toast.show('Smart device prefix is not valid', 'short', 'bottom');
					return;
				}
				else {
					this.getNewDeviceInfo().Model = value.substring(0, 8);
					this.getNewDeviceInfo().HwMajor = value.substring(8, 9);
					this.getNewDeviceInfo().HwMinor = value.substring(9, 10);
				}
			}
			else if (fieldName == "StartingSerial") {
				var serialPrefix = '',
					serialNumber = value.toString();
				var derivedMac = value.toString() + '31657719406704L';
				derivedMac = derivedMac.hexEncode();
				for (var y = 0; y < (8 - value.length) ; y++) {
					serialPrefix += "0";
				}
				serialNumber = serialNumber + serialPrefix;
				value = serialNumber;
				this.getNewDeviceInfo().MacAddress = derivedMac;

			}
			else if (fieldName == "ReadCurrentSensorData") {
				value = formFields[l].getChecked();
			}
			this.getNewDeviceInfo()[fieldName] = value;
		}


		view.destroy();
		var scanningWindow = this.getScanningWindow();
		if (!scanningWindow) {
			scanningWindow = Ext.Viewport.add({ xtype: 'scanningDevicePanel' });
		}
		var bluetooth = this.getBluetooth();

		if (!bluetooth)
			bluetooth = Ext.create('CoolerIoTMobile.widget.BlueToothLe', { itemId: 'coolerIotDeviceActor' });
		bluetooth.setActiveCommand(null);
		if (bluetooth.getActiveDeviceAddress() != null) {
			bluetooth.fireEvent('disconnectDevice');
		}
		scanningDeviceStore = Ext.getStore('BleTag');
		scanningDeviceStore.clearData();
		scanningWindow.fireEvent('startscan');
		scanningWindow.show();
	},
	onDeviceFactorySetupShow: function (view, x) {
		var formFields = view.getFieldsAsArray()
		for (var k = 0, len = formFields.length; k < len ; k++) {
			var fieldName = formFields[k].getName();
			switch (fieldName) {
				case "SmartDevicePrefix":
					formFields[k].setValue('SBB-ST2033');
					break;
				case "CurrentRoomTemp":
					formFields[k].setValue(0.0);
					break;
				case "StartingSerial":
					formFields[k].setValue(0);
					break;
			}
		}
	},
	onDeviceFactorySetupHide: function () {
		if (CoolerIoTMobile.util.Utility.isManualFactorySetup) {
			CoolerIoTMobile.util.Utility.isManualFactorySetup = false;
		}
	}
});
