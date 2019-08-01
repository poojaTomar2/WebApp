Ext.define('CoolerIoTMobile.controller.BlueToothDeviceActor', {
	extend: 'Ext.app.Controller',
	config: {
		totalRecords: 0,
		listData: null,
		selectedRecord: null,
		refs: {
			bluetooth: 'ble-bluetooth#coolerIotDeviceActor',
			scanningDeviceList: 'scanningDeviceList',
			navigationBar: 'app-viewport titlebar',
			scanningDevicePanel: 'scanningDevicePanel',
			responsePanel: 'responsePanel',
			debugDevicePanel: 'debugDevicePanel',
			scanningDevicePanelScanButton: 'scanningDevicePanel titlebar button#scaningWindowScanButton',
			scanningDevicePanelCloseButton: 'scanningDevicePanel titlebar button#scaningWindowCloseButton',
			commandInputPanel: '#passwordPanel',
			commandWindowOkButton: '#passwordPanel toolbar button#commandWindowOkButton',
			commandInputForm: 'commandInputPanel #inputDataContainer'
		},
		control: {
			bluetooth: {
				initializeSuccess: 'onInitializeSuccess',
				initializeError: 'onInitializeError',
				startScanSuccess: 'onStartScanSuccess',
				scanCompleteSuccess: 'onScanCompleteSuccess',
				connected: 'onConnected',
				bleresponse: 'onBleResponse',
				updatestatus: 'onUpdateStatus',
				disconnectSuccess: 'onDisconnectSuccess'
			},
			scanningDevicePanelScanButton: {
				tap: 'onScanPanelScanButton'
			},
			scanningDevicePanelCloseButton: {
				tap: 'onScanPanelCloseButton'
			},
			scanningDeviceList: {
				itemsingletap: 'onScanListTap'
			},
			commandWindowOkButton: {
				tap: 'onPasswordOkClick'
			}
		}
	},
	onScanPanelCloseButton: function () {
		var scanningPanel = this.getScanningDevicePanel();
		scanningPanel.hide();
	},
	onPasswordOkClick: function () {
		var form = this.getCommandInputForm();
		var values = form.getValues();
		var commandInputPanel = this.getCommandInputPanel();
		commandInputPanel.hide();

		var record = this.getSelectedRecord();
		this.getBluetooth().fireEvent('connectWithPassword', record.get('MacAddress'), values.Password, record);
		console.log(values.Password);
	},
	onDisconnectSuccess: function (obj) {
		console.log('disconnect success');

		var me = this.getBluetooth();
		var panel = this.getDebugDevicePanel();
		var record = me.getRecord();
		record.set('IsConnected', false);
		panel.fireEvent('updateselection', record);
		me.setRecord(null);
		me.setIsConnected(false);

	},
	onScanPanelScanButton: function (button) {
		var panel = this.getScanningDevicePanel();
		console.log('onScanPanelScanButton : ' + button.getText());
		switch (button.getText()) {
			case CoolerIoTMobile.Localization.StopText:
				panel.fireEvent('stopscan');
				break;
			case CoolerIoTMobile.Localization.StartText:
				panel.fireEvent('startscan');
				break;
		}
	},
	onConnected: function () {
		var command = bluetoothle.bytesToEncodedString([1]);
		this.getBluetooth().fireEvent('startDiscover', command);
	},
	onShowPassword: function (obj) {
		var commandInputPanel = this.getCommandInputPanel();
		if (!commandInputPanel) {
			commandInputPanel = Ext.Viewport.add({ xtype: 'commandInputPanel', itemId: 'passwordPanel' });
		}
		var fields = [{ xtype: 'passwordfield', name: 'Password', labelWidth: 150, label: CoolerIoTMobile.Localization.Password, maxLength: 19 }];
		commandInputPanel.setContainerItems(fields);
		commandInputPanel.setInputTitle(CoolerIoTMobile.Localization.PasswordTitle);

		commandInputPanel.show();
	},
	onScanListTap: function (list, index, target, record, e, eOpts) {
		console.log('scanlist tap');

		var scanningPanel = this.getScanningDevicePanel();
		scanningPanel.hide();

		var password = localStorage.getItem("BlePassword");
		this.setSelectedRecord(record);
		if (!password) {
			this.onShowPassword();
			return;
		}

		this.getBluetooth().fireEvent('connectWithPassword', record.get('MacAddress'), password, record);
	},
	onInitializeError: function () {
		Ext.Msg.alert(CoolerIoTMobile.Localization.BluetoothDisabled, CoolerIoTMobile.Localization.BluetoothEnableMessage);
	},
	onInitializeSuccess: function (obj) {
		console.log("onInitializeSuccess controll");
		var store = this.getScanningDeviceList().getStore();
		store.removeAll();
		this.getBluetooth().fireEvent('startScan');
	},
	onScanCompleteSuccess: function () {
		var panel = this.getScanningDevicePanel();
		panel.fireEvent('stopscan');
	},
	onStartScanSuccess: function (obj) {

		console.log("Scan result... - " + obj.id);

		var store = this.getScanningDeviceList().getStore();
		var index = store.findExact('MacAddress', obj.id);
		if (index === -1) {
			var bytes = new Uint8Array(obj.advertising);
			console.log('Scan bytes...');
			console.log(bytes);
			var BEACON_LENGTH = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(0, 1));
			var AD_TYPE = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(1, 2));
			var BEACON_FLAGS = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(2, 3));
			var BEACON_DATA_LENGTH = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(3, 4));
			var BEACON_AD_TYPE = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(4, 5));

			var BEACON_COMPANY_IDENTIFIER = CoolerIoTMobile.util.Utility.bytesToString(bytes.subarray(5, 7));

			var BEACON_TYPE = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(7, 9));
			var uuid = CoolerIoTMobile.util.Utility.bytesToHex(obj.advertising, 9, 25);

			var MAJOR_VER = parseInt(CoolerIoTMobile.util.Utility.bytesToHex(obj.advertising, 25, 27), 16);
			var MINOR_VER = parseInt(CoolerIoTMobile.util.Utility.bytesToHex(obj.advertising, 27, 29), 16);
			var MEASURED_POWER = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(29, 30));
			//Second part
			var DEVICE_DATA_LENGTH = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(30, 31));
			var DEVICE_AD_TYPE = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(31, 32));
			var DEVICE_NAME = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(33, 34));

			var record = store.getModel().create({ MacAddress: obj.id, Advertisement: CoolerIoTMobile.util.Utility.arrayBufferToBase64(obj.advertising), DeviceName: obj.name, ManufacturerUUID: uuid, Major: MAJOR_VER, Minor: MINOR_VER, Rssi: MEASURED_POWER });
			store.add(record);
		}
	},
	onBleResponse: function (data) {

		var me = this.getBluetooth();

		var bytes = new Uint8Array(data);
		var command = me.getActiveCommand();
		console.log("response : " + me.getResponseCount() + " cmd : " + command);

		if (command == CoolerIoTMobile.BleCommands.SET_VALIDATE_PASSWORD) {
			this.handlePasswordResponse(bytes);
			me.setActiveCommand(null);
			return;
		}

		if (me.getResponseCount() == 1) {
			me.fireEvent('updatestatus', 'Status received...', true);
			this.processData(bytes);
		}
		else {
			if (command == CoolerIoTMobile.BleCommands.READ_CONFIGURATION_PARAMETER) {
				this.processData(bytes);
				return;
			}
			if (me.getResponseCount() == 2) {
				me.fireEvent('updatestatus', 'Processing device data...', false);
			}
			this.processListData(bytes);
		}

		//me.setActiveCommand(null);
	},
	onUpdateStatus: function (arg, canClose) {
		console.log("calling ststus  : param 1" + arg + " Param 2:" + canClose);
		if (canClose) {
			Ext.Viewport.setMasked(false);
			return;
		}
		Ext.Viewport.setMasked({ xtype: 'loadmask', message: arg });
	},
	processData: function (bytes) {
		console.log("first response");
		console.log(new Uint8Array(bytes));

		var me = this.getBluetooth(), command = me.getActiveCommand();
		this.setTotalRecords(0);
		var isSuccess = bytes.subarray(0, 1)[0];
		var packetId = 0;
		this.setListData(null);

		var success = isSuccess === 1 ? CoolerIoTMobile.Localization.SuccessMessageTitle : CoolerIoTMobile.Localization.FailedMessageTitle;
		var labelWidth = '50%';
		if (command === CoolerIoTMobile.BleCommands.EVENT_DATA_FROM_IDX_IDY)
			labelWidth = "240px";
		if (command === CoolerIoTMobile.BleCommands.CURRENT_TIME)
			labelWidth = "140px";

		if (command === CoolerIoTMobile.BleCommands.READ_CONFIGURATION_PARAMETER) {
			labelWidth = "230px";
		}

		this.addCommandDataModel(CoolerIoTMobile.Localization.Status, success, isSuccess, command, labelWidth);


		switch (command) {
			case CoolerIoTMobile.BleCommands.EVENT_DATA_FROM_IDX_IDY:
			case CoolerIoTMobile.BleCommands.LATEST_N_EVENTS:
			case CoolerIoTMobile.BleCommands.FETCH_DATA:
			case CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA:
				var totalRecords = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(1, 3));
				this.setTotalRecords(totalRecords);
				var label = command === CoolerIoTMobile.BleCommands.EVENT_DATA_FROM_IDX_IDY ? CoolerIoTMobile.Localization.NumberOfEventSent : CoolerIoTMobile.Localization.TotalEvent;
				this.addCommandDataModel(label, totalRecords, isSuccess, command, labelWidth);
				break;
			case CoolerIoTMobile.BleCommands.FIRMWARE_DETAIL:
				var majorVersion = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(1, 2));
				var minorVersion = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(2, 3));

				this.addCommandDataModel(CoolerIoTMobile.Localization.MajorVersion, majorVersion, isSuccess, command, labelWidth);
				this.addCommandDataModel(CoolerIoTMobile.Localization.MinorVersion, minorVersion, isSuccess, command, labelWidth);
				break;
			case CoolerIoTMobile.BleCommands.CURRENT_TIME:
				var time = CoolerIoTMobile.util.Utility.readFourByte(bytes.subarray(1, 5));
				this.addCommandDataModel(CoolerIoTMobile.Localization.TimeOfDevice, CoolerIoTMobile.util.Utility.getDateFromMilliseconds(time), isSuccess, command, labelWidth);
				break;
			case CoolerIoTMobile.BleCommands.SERIALNUMBER:
				var serialNumber = CoolerIoTMobile.util.Utility.bytesToString(bytes.subarray(1, 15));
				this.addCommandDataModel(CoolerIoTMobile.Localization.DeviceSerialNumber, serialNumber, isSuccess, command, labelWidth);
				break;
			case CoolerIoTMobile.BleCommands.EVENT_COUNT:
				var currentEventIndex = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(1, 3));
				var rangeOfEventId = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(3, 5));

				this.addCommandDataModel(CoolerIoTMobile.Localization.CurrentEventIndex, currentEventIndex, isSuccess, command, labelWidth);
				this.addCommandDataModel(CoolerIoTMobile.Localization.RangeOfEventId, rangeOfEventId, isSuccess, command, labelWidth);

				break;
			case CoolerIoTMobile.BleCommands.READ_CONFIGURATION_PARAMETER:
				this.addCommandDataModel(CoolerIoTMobile.Localization.PeriodicIntervalMinutes, CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(2, 3)), isSuccess, command, labelWidth);
				this.addCommandDataModel(CoolerIoTMobile.Localization.TemperatureOutOfThreashold, CoolerIoTMobile.util.Utility.readWord(bytes.subarray(3, 5)), isSuccess, command, labelWidth);//2 byte				
				this.addCommandDataModel(CoolerIoTMobile.Localization.LightOutOfThreashold, CoolerIoTMobile.util.Utility.readWord(bytes.subarray(5, 7)), isSuccess, command, labelWidth);//2 byte				
				this.addCommandDataModel(CoolerIoTMobile.Localization.HumidityOutOfThreashold, CoolerIoTMobile.util.Utility.readWord(bytes.subarray(7, 9)), isSuccess, command, labelWidth);//2bytes				
				this.addCommandDataModel(CoolerIoTMobile.Localization.SoundOutOfThreashold, CoolerIoTMobile.util.Utility.readWord(bytes.subarray(9, 11)), isSuccess, command, labelWidth);
				this.addCommandDataModel(CoolerIoTMobile.Localization.RssiTitleInMeter, CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(11, 12)), isSuccess, command, labelWidth);
				break;
			default:
				break;
		}
		console.log("first response total count : " + this.getTotalRecords() + " Command : " + command);

		if (command == CoolerIoTMobile.BleCommands.SET_VALIDATE_PASSWORD) {
			var store = Ext.getStore('DeviceData');
			store.removeAll();
		}
		else
			this.showResponseWindow();
	},
	addCommandDataModel: function (title, data, status, command, labelWidth) {
		var store = Ext.getStore('CommandData');

		var record = store.getModel().create({ Title: title, Data: data, StatusId: status, Command: command, LabelWidth: labelWidth });
		store.add(record);
	},
	showResponseWindow: function () {
		var panel = this.getResponsePanel();
		if (!panel) {
			panel = Ext.Viewport.add({ xtype: 'responsePanel' });
		}
		panel.show();
	},
	processListData: function (bytes) {

		if (bytes == null || bytes.bytesLength == 0)
			return;

		this.addListData(bytes);

		var me = this.getBluetooth();
		console.log("List records " + (me.getResponseCount() - 1) + " of " + this.getTotalRecords());

		if (this.getTotalRecords() == (me.getResponseCount() - 1)) {
			console.log("List result completed");
			me.fireEvent('updatestatus', 'Processing list data...');
			var data = this.getListData();
			var storeData = [];
			var store = Ext.getStore('DeviceData');
			for (var i in data) {
				console.log(data[i].data);
				var record = this.processDeviceDataToStore(data[i].data, store);
				storeData.push(record);
			}
			store.applyData(storeData);
			me.fireEvent('updatestatus', 'Process completed.', true);
		}

	},
	processDeviceDataToStore: function (bytes, store) {
		var recordType = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(0, 1)); //Read single byte		
		var eventId = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(1, 3)); //Two byte
		var eventTime = CoolerIoTMobile.util.Utility.readFourByte(bytes.subarray(3, 7));	//Four byte		
		var switchStatus = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(7, 8));

		var temperature = 0, humidity = 0, angle = 0, magnetX = 0, magnetY = 0, magnetZ = 0, latitude = 0, longitude = 0;
		var ambientLight = 0, soundLevel = 0, batteryLevel = 0, posX = 0, posY = 0, negX = 0, negY = 0, posZ = 0, negZ = 0, distanceLsb = 0, distanceMsb = 0;
		var imageSize = 0, startTimeMovement = 0, endTimeMovement = 0, recordTypeText;

		switch (recordType) {
			case CoolerIoTMobile.RecordTypes.HELTHY_EVENT:
				temperature = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(8, 10));
				humidity = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(10, 11));
				ambientLight = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(11, 13));
				soundLevel = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(13, 15));
				batteryLevel = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(15, 16));
				recordTypeText = CoolerIoTMobile.Localization.Healthy;
				break;
			case CoolerIoTMobile.RecordTypes.LINEAR_MOTION:

				distanceLsb = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(8, 9));
				distanceMsb = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(9, 10));

				angle = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(10, 12));
				magnetX = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(12, 14));
				magnetY = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(14, 16));
				recordTypeText = CoolerIoTMobile.Localization.LinearMotion;
				break;
			case CoolerIoTMobile.RecordTypes.ANGULAR_MOTION:
				posX = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(8, 9));
				negX = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(9, 10));
				posY = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(10, 11));
				negY = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(11, 12));
				posZ = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(12, 13));
				negZ = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(13, 14));
				recordTypeText = CoolerIoTMobile.Localization.AngularMotion;
				break;
			case CoolerIoTMobile.RecordTypes.MAGNET_MOTION:
				magnetX = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(8, 10));
				magnetY = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(10, 12));;
				magnetZ = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(12, 14));
				recordTypeText = CoolerIoTMobile.Localization.MagnetMotion;
				break;
			case CoolerIoTMobile.RecordTypes.DOOR_EVENT:
				recordTypeText = CoolerIoTMobile.Localization.DoorEvent;
				break;
			case CoolerIoTMobile.RecordTypes.IMAGE_EVENT:
				posX = switchStatus;
				negX = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(8, 10));
				posY = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(10, 11));
				negY = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(11, 12));
				posZ = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(12, 13));
				negZ = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(13, 14));
				imageSize = CoolerIoTMobile.util.Utility.readThreeByte(bytes.subarray(14, 17));
				recordTypeText = CoolerIoTMobile.Localization.ImageEvent;
				break;
			case CoolerIoTMobile.RecordTypes.GPS_EVENT:
				latitude = CoolerIoTMobile.util.Utility.readThreeByte(bytes.subarray(8, 11));
				longitude = CoolerIoTMobile.util.Utility.readThreeByte(bytes.subarray(11, 14));
				recordTypeText = CoolerIoTMobile.Localization.GpsEvent;
				break;
			case CoolerIoTMobile.RecordTypes.MOTION_TIME:
				startTimeMovement = CoolerIoTMobile.util.Utility.readFourByte(bytes.subarray(8, 12));
				endTimeMovement = CoolerIoTMobile.util.Utility.readFourByte(bytes.subarray(12, 16));
				recordTypeText = CoolerIoTMobile.Localization.MotionTime;
				break;
			default:
				recordTypeText = CoolerIoTMobile.Localization.UnknownRecordType;
				break;
		}


		var doorState = switchStatus == 0 ? "OPEN" : "CLOSE";
		var temp = temperature != 0 ? temperature / 10 : temperature;
		var model = store.getModel().create({
			DoorStatus: doorState,
			RecordTypeText: recordTypeText,
			TemperatureValue: CoolerIoTMobile.util.Utility.isInt(temp) ? temp.toFixed(1) : temp,
			HumidityValue: CoolerIoTMobile.util.Utility.isInt(humidity) ? parseFloat(humidity.toFixed(1)) : humidity,
			AmbientlightValue: CoolerIoTMobile.util.Utility.isInt(ambientLight) ? parseFloat(ambientLight.toFixed(1)) : ambientLight,
			Angle: CoolerIoTMobile.util.Utility.isInt(angle) ? angle.toFixed(1) : angle,
			MagnetX: CoolerIoTMobile.util.Utility.isInt(magnetX) ? magnetX.toFixed(1) : magnetX,
			MagnetY: CoolerIoTMobile.util.Utility.isInt(magnetY) ? magnetY.toFixed(1) : magnetY,
			MagnetZ: CoolerIoTMobile.util.Utility.isInt(magnetZ) ? magnetZ.toFixed(1) : magnetZ,
			Latitude: CoolerIoTMobile.util.Utility.isInt(latitude) ? latitude.toFixed(1) : latitude,
			Longitude: CoolerIoTMobile.util.Utility.isInt(longitude) ? longitude.toFixed(1) : longitude,
			RecordType: recordType,
			BatteryLevel: batteryLevel,
			SoundLevel: soundLevel,
			SwitchStatus: switchStatus,
			PosX: posX,
			PosY: posY,
			NegX: negX,
			NegY: negX,
			PosZ: posZ,
			NegZ: negZ,
			DistanceLsb: distanceLsb,
			DistanceMsb: distanceMsb,
			EventId: eventId,
			ImageSize: imageSize,
			EventTime: eventTime,
			StartTimeMovement: startTimeMovement,
			EndTimeMovement: endTimeMovement
		});
		//store.add(model);
		return model;
	},
	addListData: function (bytes) {
		var listData = this.getListData() || {};

		var me = this.getBluetooth();

		listData[me.getResponseCount() - 1] = { data: bytes };

		this.setListData(listData);
	},
	handlePasswordResponse: function (bytes) {
		var me = this.getBluetooth();
		if (me.getResponseCount() == 1 && bytes[0] == 1) {
			me.setIsConnected(true);
			localStorage.setItem("BlePassword", me.getPassword());

			var panel = this.getDebugDevicePanel();
			var record = me.getRecord();
			record.set('IsConnected', true);
			panel.fireEvent('updateselection', record);

		}
		if (me.getResponseCount() == 1 && bytes[0] != 1) {
			me.setIsConnected(false);
			me.fireEvent('disconnectDevice');
			localStorage.setItem("BlePassword", '');
			Ext.Msg.alert(CoolerIoTMobile.Localization.ConnectErrorTitle, CoolerIoTMobile.Localization.ConnectErrorMessage);
		}
	}
});
