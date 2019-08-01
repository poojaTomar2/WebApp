Ext.define('CoolerIoTMobile.controller.BlueToothLeDeviceActor', {
	extend: 'Ext.app.Controller',
	config: {
		totalRecords: 0,
		recordsForEventData: 0,
		listData: null,
		imageResponseCount: 0,
		imageResponseArray: [],
		commandParamDataForFactorySetup: [],
		selectedRecord: null,
		totalImageBytes: 0,
		debugDeviceRecord: { IsSmartVision: false },
		isBulkCommandExecution: false,
		factorySetupCommandStore: [CoolerIoTMobile.BleCommands.RESET_DEVICE, CoolerIoTMobile.BleCommands.SET_MAJOR_MINOR_VERSION, CoolerIoTMobile.BleCommands.SET_MAC_ADDRESS, CoolerIoTMobile.BleCommands.SET_SERIAL_NUMBER, CoolerIoTMobile.BleCommands.SET_REAL_TIME_CLOCK, CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA],
		bulkCommandStoreForLogs: ['CoolerIoTMobile.BleCommands.CURRENT_TIME', 'CoolerIoTMobile.BleCommands.READ_CONFIGURATION_PARAMETER'],
		bulkCommandStore: [CoolerIoTMobile.BleCommands.CURRENT_TIME, CoolerIoTMobile.BleCommands.READ_CONFIGURATION_PARAMETER],
		installDeviceStore: [CoolerIoTMobile.BleCommands.READ_CALIBRATE_GYRO, CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA, CoolerIoTMobile.BleCommands.ERASE_EVENT_DATA, CoolerIoTMobile.BleCommands.ENABLE_TAKE_PICTURE, CoolerIoTMobile.BleCommands.SET_MAJOR_MINOR_VERSION, CoolerIoTMobile.BleCommands.SET_STANDBY_MODE, CoolerIoTMobile.BleCommands.SET_REAL_TIME_CLOCK],
		currentBulkCommand: 0,
		storeData: [],
		refs: {
			bluetooth: 'ble-bluetoothLe#coolerIotDeviceActor',
			scanningDeviceList: 'scanningDeviceList',
			navigationBar: 'app-viewport titlebar',
			responsePanel: 'responsePanel',
			scanningDevicePanel: 'scanningDevicePanel',
			debugDevicePanel: 'debugDevicePanel',
			deviceDataResponseWindow: 'deviceDataResponseWindow'
		},
		control: {
			bluetooth: {
				initializeSuccess: 'onInitializeSuccess',
				startScanSuccess: 'onStartScanSuccess',
				scanCompleteSuccess: 'onScanCompleteSuccess',
				readSuccess: 'onReadSuccess',
				connected: 'onConnected',
				updatestatus: 'onUpdateStatus',
				write: 'onWriteSuccess',
				bleresponse: 'onBleResponse'
			},
			scanningDeviceList: {
				itemsingletap: 'onScanListTap'
			}
		}
	},
	handlePasswordResponse: function (bytes) {
		var me = this.getBluetooth();

		me.setIsConnected(true);
		var record = this.getSelectedRecord();

		var majorVersion = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(1, 2));
		var minorVersion = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(2, 3));
		this.getDebugDeviceRecord().CurrentEventIndex = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(5, 7));
		this.getDebugDeviceRecord().RangeOfEventId = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(7, 9));

		var firmwareNumber = (majorVersion + minorVersion / 100.0);
		record.data.FirmwareNumber = firmwareNumber.toFixed(2);

		if (record.data.DeviceName.indexOf('SV') > -1) {
			this.getBulkCommandStoreForLogs().push('CoolerIoTMobile.BleCommands.READ_CAMERA_SETTING', 'CoolerIoTMobile.BleCommands.READ_GYROSCOPE_DATA');
			this.getBulkCommandStore().push(CoolerIoTMobile.BleCommands.READ_CAMERA_SETTING, CoolerIoTMobile.BleCommands.READ_GYROSCOPE_DATA);
			this.getDebugDeviceRecord().IsSmartVision = true;
		}
		else {
			this.getDebugDeviceRecord().IsSmartVision = false;
		}
		Ext.Viewport.setMasked({ xtype: 'loadmask' });
		this.processBulkCommand(bytes);

	},
	isBitSet: function (advertisementByte, position) {
		return (advertisementByte & (1 << position)) != 0;
	},
	processBulkCommand: function (bulkCommandResponseBytes) {

		var me = this.getBluetooth();
		if (this.getIsBulkCommandExecution()) {
			this.processData(bulkCommandResponseBytes);
		}
		if (this.getBulkCommandStore().length > 0) {
			Ext.defer(this.executeBulkCommand, 200, this);
		}
		else {
			var record = this.getSelectedRecord();

			if (Ext.os.name.toLowerCase() !== CoolerIoTMobile.Enums.DeviceType.Ios) {
				var advertisementBytes = bluetoothle.encodedStringToBytes(record.data.Advertisement),
				  advertisementInfo = advertisementBytes[32 + (advertisementBytes[30]) + 3];

				var healthEventAvailable = this.isBitSet(advertisementInfo, 0),
				pictureAvailable = this.isBitSet(advertisementInfo, 1),
				motionEventAvailable = this.isBitSet(advertisementInfo, 2),
				takePictureEnable = this.isBitSet(advertisementInfo, 3),
				doorStatus = this.isBitSet(advertisementInfo, 4),
				standByControlStatus = this.isBitSet(advertisementInfo, 5);
				this.getDebugDeviceRecord().EnableTakePicture = takePictureEnable;
				this.getDebugDeviceRecord().StandByModeValue = standByControlStatus;
			}
			console.log('SmartTag/Vision detail object' + JSON.stringify(this.getDebugDeviceRecord()));
			this.getDebugDevicePanel().down('#deviceDataList').setData(this.getDebugDeviceRecord());
			var panel = this.getDebugDevicePanel();
			record.set('IsConnected', true);
			panel.fireEvent('updateselection', record);
			Ext.Viewport.unmask();
			this.setIsBulkCommandExecution(false);
			this.setCurrentBulkCommand(null);
			me.setActiveCommand(null);
			this.setDebugDeviceRecord({});
			window.plugins.toast.show('Finishing read commands', 'short', 'bottom');
			if (this.getBulkCommandStore().length == 0) {
				this.getBulkCommandStore().push(CoolerIoTMobile.BleCommands.CURRENT_TIME, CoolerIoTMobile.BleCommands.READ_CONFIGURATION_PARAMETER);
				this.getBulkCommandStoreForLogs().push('CoolerIoTMobile.BleCommands.CURRENT_TIME', 'CoolerIoTMobile.BleCommands.READ_CONFIGURATION_PARAMETER', 'CoolerIoTMobile.BleCommands.SET_STANDBY_MODE');
			}
		}
	},
	executeBulkCommand: function () {

		var debugDeviceController = CoolerIoTMobile.app.getController('DebugDevice');
		var me = this.getBluetooth();
		this.setIsBulkCommandExecution(true);
		CoolerIoTMobile.util.Utility.logDeviceInfo('DashBoard Activity', 'Moving to step ' + this.getBulkCommandStoreForLogs().pop());
		var currentBulkCommand = this.getBulkCommandStore().pop();
		this.setCurrentBulkCommand(currentBulkCommand);
		me.setActiveCommand(currentBulkCommand);
		debugDeviceController.executeCommand(currentBulkCommand);
	},


	onBleResponse: function (data) {

		var me = this.getBluetooth();

		var bytes = data.value ? bluetoothle.encodedStringToBytes(data.value) : new Uint8Array(data);
		var command = me.getActiveCommand();
		if (command == null) {
			return;
		}
		if (CoolerIoTMobile.util.Utility.isManualFactorySetup) {
			this.handleFactorySetupCommandData();
			return;
		}
		if (CoolerIoTMobile.util.Utility.isInstallDevice && command != CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA) {
			this.onInstallDevice();
			return;
		}
		if (command == CoolerIoTMobile.BleCommands.SET_VALIDATE_PASSWORD) {
			if (CoolerIoTMobile.util.Utility.isInstallDevice) {
				this.onInstallDevice();
				return;
			}
			this.handlePasswordResponse(bytes);
			me.setActiveCommand(null);
			CoolerIoTMobile.util.Utility.logDeviceInfo('DashBoard Activity', 'Bulk command execution started');
			return;
		}
		if (this.getIsBulkCommandExecution()) {
			this.processBulkCommand(bytes);
			return;
		}
		if (command == CoolerIoTMobile.BleCommands.READ_IMAGE_DATA) {
			if (this.getImageResponseCount() == 0) {
				Ext.Viewport.setMasked({ xtype: 'loadmask' });
				var recordType = CoolerIoTMobile.util.Utility.readWordReverse(bytes.subarray(1, 3));
				recordType = isNaN(recordType) ? 0 : recordType;
				this.setImageResponseCount(recordType);
				this.setTotalImageBytes(recordType);
				if (recordType == 0) {
					Ext.Viewport.unmask();
					window.plugins.toast.show('No image for downlaod', 'short', 'bottom');
				}
				return;
			}

			this.processImageResponse(bytes)
			return;
		}
		if (command == CoolerIoTMobile.BleCommands.SET_CAMERA_SETTING) {
			if (CoolerIoTMobile.util.Utility.takePictureAfterImageCalibration) {
				CoolerIoTMobile.util.Utility.takePictureAfterImageCalibration = false;
				var debugDeviceController = CoolerIoTMobile.app.getController('DebugDevice');
				var me = this.getBluetooth();
				debugDeviceController.executeCommand(CoolerIoTMobile.BleCommands.TAKE_PICTURE);
			}
		}
		if (command == CoolerIoTMobile.BleCommands.READ_AVAILABLE_UNREAD_EVENT || command == CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA || command == CoolerIoTMobile.BleCommands.FETCH_DATA || command == CoolerIoTMobile.BleCommands.READ_OLDEST_N_EVENT) {
			if (this.getRecordsForEventData() == 0) {
				var recordType = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(1, 3));
				recordType = isNaN(recordType) ? 0 : recordType;
				this.setRecordsForEventData(recordType);
				var store = Ext.getStore('DeviceData');
				store.removeAll();
				this.setStoreData([])
				if (recordType != 0) {
					Ext.Viewport.setMasked({ xtype: 'loadmask' });
				}
				return;
			}
			this.processListData(bytes);
			return;
		}

		else {
			if (command != null) {
				this.processData(bytes);
				return;
			}
		}
	},
	onInstallDevice: function () {
		if (this.getInstallDeviceStore().length > 0) {
			Ext.defer(this.processInstallDeviceSetup, 200, this);
		}
		else {
			CoolerIoTMobile.util.Utility.isInstallDevice = false;
			CoolerIoTMobile.util.Utility.InstallDeviceSerialNumber = 0;
			this.getInstallDeviceStore().push(CoolerIoTMobile.BleCommands.READ_CALIBRATE_GYRO, CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA, CoolerIoTMobile.BleCommands.ERASE_EVENT_DATA, CoolerIoTMobile.BleCommands.ENABLE_TAKE_PICTURE, CoolerIoTMobile.BleCommands.SET_MAJOR_MINOR_VERSION, CoolerIoTMobile.BleCommands.SET_STANDBY_MODE, CoolerIoTMobile.BleCommands.SET_REAL_TIME_CLOCK);
			window.plugins.toast.show('Installation completed.', 'short', 'bottom');
			Ext.Msg.alert('Alert', 'Device provisioned successfully');
		}
	},
	processInstallDeviceSetup: function () {
		var currentInstallDeviceCommand = this.getInstallDeviceStore().pop(),
			debugDeviceController = CoolerIoTMobile.app.getController('DebugDevice'),
			CommandDataForInstallDevice = [],
		    bluetooth = this.getBluetooth();
		deviceName = bluetooth.getActiveDeviceName();
		debugDeviceController.setCommandParamData([]);
		switch (currentInstallDeviceCommand) {
			case CoolerIoTMobile.BleCommands.SET_REAL_TIME_CLOCK:
				var date = new Date();
				debugDeviceController.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(date.getTime() / 1000, 4));
				param = debugDeviceController.getCommandParamData();
				bluetooth.fireEvent('writeDeviceCommand', currentInstallDeviceCommand, param);
				window.plugins.toast.show('Setting clock.', 'short', 'bottom');
				break;
			case CoolerIoTMobile.BleCommands.SET_STANDBY_MODE:
				debugDeviceController.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(0, 1));
				param = debugDeviceController.getCommandParamData();
				bluetooth.fireEvent('writeDeviceCommand', currentInstallDeviceCommand, param);
				window.plugins.toast.show('Turning stand by mode off.', 'short', 'bottom');
				break;
			case CoolerIoTMobile.BleCommands.SET_MAJOR_MINOR_VERSION:
				var deviceSerialNumber = bluetooth.getActiveDeviceName(),
					majorMinorValue = deviceSerialNumber.substring(deviceSerialNumber.length - 8),
					major = parseInt(majorMinorValue.substring(0, 4)) == 0 ? 1000 : parseInt(majorMinorValue.substring(0, 4)),
					minor = parseInt(majorMinorValue.substring(4, majorMinorValue.length)),
					record = this.getSelectedRecord(),
					defaultRSSI = record.data.Rssi;
				debugDeviceController.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(major, 2));
				debugDeviceController.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(minor, 2));
				debugDeviceController.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(defaultRSSI, 1));
				param = debugDeviceController.getCommandParamData();
				bluetooth.fireEvent('writeDeviceCommand', currentInstallDeviceCommand, param);
				//debugDeviceController.executeCommand(currentInstallDeviceCommand, CommandDataForInstallDevice);
				window.plugins.toast.show('Setting default major, minor and RSSI.', 'short', 'bottom');
				break;
			case CoolerIoTMobile.BleCommands.ERASE_EVENT_DATA:
				window.plugins.toast.show('Erasing all event data.', 'short', 'bottom');
				//debugDeviceController.executeCommand(currentInstallDeviceCommand);
				bluetooth.fireEvent('writeDeviceCommand', currentInstallDeviceCommand, []);
				break;
			case CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA:
				window.plugins.toast.show('Reading Current Sensor data.', 'short', 'bottom');
				bluetooth.fireEvent('writeDeviceCommand', currentInstallDeviceCommand, []);
				break;
			case CoolerIoTMobile.BleCommands.ENABLE_TAKE_PICTURE:
				if (deviceName.indexOf('SV') > -1) {
					debugDeviceController.addCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(1, 1));
					param = debugDeviceController.getCommandParamData();
					bluetooth.fireEvent('writeDeviceCommand', currentInstallDeviceCommand, param);
					//debugDeviceController.executeCommand(currentInstallDeviceCommand, CommandDataForInstallDevice);
					window.plugins.toast.show('Enabling take picture mode.', 'short', 'bottom');
				}
				else {
					this.onInstallDevice();
				}
				break;
			case CoolerIoTMobile.BleCommands.READ_CALIBRATE_GYRO:
				if (deviceName.indexOf('SV') > -1) {
					//debugDeviceController.executeCommand(currentInstallDeviceCommand);
					bluetooth.fireEvent('writeDeviceCommand', currentInstallDeviceCommand, []);
					window.plugins.toast.show('Calibrating gyroscope.', 'short', 'bottom');
				}
				else {
					this.onInstallDevice();
				}
				break;
		}
	},
	handleFactorySetupCommandData: function () {
		if (this.getFactorySetupCommandStore().length > 0) {
			Ext.defer(this.processFactorySetup, 200, this);
		}
		else {
			CoolerIoTMobile.util.Utility.isManualFactorySetup = false;
			this.getFactorySetupCommandStore().push(CoolerIoTMobile.BleCommands.RESET_DEVICE, CoolerIoTMobile.BleCommands.SET_MAJOR_MINOR_VERSION, CoolerIoTMobile.BleCommands.SET_MAC_ADDRESS, CoolerIoTMobile.BleCommands.SET_SERIAL_NUMBER, CoolerIoTMobile.BleCommands.SET_REAL_TIME_CLOCK, CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA);
		}
	},
	processFactorySetup: function () {
		var currentFactorySetupCommand = this.getFactorySetupCommandStore().pop(),
		    debugDeviceController = CoolerIoTMobile.app.getController('DebugDevice');
		var newDeviceInfo = debugDeviceController.getNewDeviceInfo();
		CommandDataForFactorySetup = [];
		//this.setCurrentBulkCommand(currentBulkCommand);
		//me.setActiveCommand(currentBulkCommand);
		switch (currentFactorySetupCommand) {
			case CoolerIoTMobile.BleCommands.RESET_DEVICE:
				break;
			case CoolerIoTMobile.BleCommands.SET_MAJOR_MINOR_VERSION:
				window.plugins.toast.show('Setting default major, minor and RSSI', 'short', 'bottom');
				var serialNumber = newDeviceInfo.StartingSerial;
				var numberPart = serialNumber.substring(serialNumber.length() - 8),
				    major = numberPart.substring(0, 4),
				    minor = numberPart.substring(4);
				break;
			case CoolerIoTMobile.BleCommands.SET_MAC_ADDRESS:
				var buffer = CoolerIoTMobile.util.Utility.hexStringToByteArray(newDeviceInfo.MacAddress);
				CommandDataForFactorySetup.push(new Uint8Array(buffer));
				debugDeviceController.executeCommand(currentFactorySetupCommand, CommandDataForFactorySetup);
				window.plugins.toast.show('Setting Mac address', 'short', 'bottom');
				break;
			case CoolerIoTMobile.BleCommands.SET_SERIAL_NUMBER:
				window.plugins.toast.show('Setting real time clock', 'short', 'bottom');
				break;
			case CoolerIoTMobile.BleCommands.SET_REAL_TIME_CLOCK:
				var date = new Date();
				CommandDataForFactorySetup.push(CoolerIoTMobile.util.Utility.decimalToBytes(date.getTime() / 1000, 4));
				debugDeviceController.executeCommand(currentFactorySetupCommand, CommandDataForFactorySetup);
				window.plugins.toast.show('Setting real time clock', 'short', 'bottom');
				break;
			case CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA:
				if (newDeviceInfo.ReadCurrentSensorData) {
					debugDeviceController.executeCommand(currentFactorySetupCommand);
					window.plugins.toast.show('Setting Sensor data', 'short', 'bottom');
				}
				break;
		}

	},
	processImageResponse: function (bytes) {
		this.getImageResponseArray().push.apply(this.getImageResponseArray(), bytes);
		if (this.getImageResponseCount() == 1) {
			FileIO.splitedFileName = '';
			FileIO.base64Data = new Uint8Array(this.getImageResponseArray()).buffer;
			FileIO.removeFile();
			this.setImageResponseArray([]);
			this.setImageResponseCount(0);
			this.setTotalImageBytes(0);
		}
		else {
			this.setImageResponseCount(this.getImageResponseCount() - 1);
			window.plugins.toast.show('processing ' + this.getImageResponseCount() + '/' + this.getTotalImageBytes(), 'short', 'bottom');
		}
	},
	processListData: function (bytes) {

		if (bytes == null || bytes.bytesLength == 0)
			return;
		this.addListData(bytes);
		var me = this.getBluetooth();
		var data = this.getListData();
		var store = Ext.getStore('DeviceData');
		for (var i in data) {
			var record = this.processDeviceDataToStore(data[i].data, store);
			if (record != CoolerIoTMobile.Localization.UnknownRecordType) {
				this.getStoreData().push(record);
			}
		}
		if (this.getRecordsForEventData() == 1) {
			store.applyData(this.getStoreData());
			this.setRecordsForEventData(0);
			Ext.Viewport.unmask();
			var panel = this.getDeviceDataResponseWindow();
			if (!panel) {
				panel = Ext.Viewport.add({ xtype: 'deviceDataResponseWindow' });
				panel.setHeight('90%');
				panel.setWidth('80%');
			}
			else {
				panel.show();
			}
			me.setActiveCommand(null);
			if (CoolerIoTMobile.util.Utility.isInstallDevice) {
				this.onInstallDevice();
			}
		}
		else {
			this.setRecordsForEventData(this.getRecordsForEventData() - 1);
		}
	},
	processDeviceDataToStore: function (bytes, store) {
		var recordType = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(0, 1)) & ~(1 << 4);
		var eventId = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(1, 3)); //Two byte
		var eventTime = CoolerIoTMobile.util.Utility.readFourByte(bytes.subarray(3, 7));	//Four byte		
		var switchStatus = this.isBitSet(CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(0, 1)), 4);

		var temperature = 0, humidity = 0, angle = 0, magnetX = 0, magnetY = 0, magnetZ = 0, latitude = 0, longitude = 0;
		var ambientLight = 0, soundLevel = 0, batteryLevel = 0, posX = 0, posY = 0, negX = 0, negY = 0, posZ = 0, negZ = 0, distanceLsb = 0, distanceMsb = 0;
		var imageSize = 0, startTimeMovement = 0, durationMovement = 0, recordTypeText, sequence = 0, angle = 0.0, address = 0;

		switch (recordType) {
			case CoolerIoTMobile.RecordTypes.HELTHY_EVENT:
				temperature = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(10, 12));
				humidity = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(12, 13));
				ambientLight = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(13, 15));
				batteryLevel = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(15, 16));
				recordTypeText = CoolerIoTMobile.Localization.Healthy;
				break;
				//case CoolerIoTMobile.RecordTypes.LINEAR_MOTION:

				//	distanceLsb = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(8, 9));
				//	distanceMsb = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(9, 10));

				//	angle = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(10, 12));
				//	magnetX = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(12, 14));
				//	magnetY = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(14, 16));
				//	recordTypeText = CoolerIoTMobile.Localization.LinearMotion;
				//	break;
				//case CoolerIoTMobile.RecordTypes.ANGULAR_MOTION:
				//	posX = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(8, 9));
				//	negX = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(9, 10));
				//	posY = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(10, 11));
				//	negY = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(11, 12));
				//	posZ = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(12, 13));
				//	negZ = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(13, 14));
				//	recordTypeText = CoolerIoTMobile.Localization.AngularMotion;
				//	break;
				//case CoolerIoTMobile.RecordTypes.MAGNET_MOTION:
				//	magnetX = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(8, 10));
				//	magnetY = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(10, 12));;
				//	magnetZ = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(12, 14));
				//	recordTypeText = CoolerIoTMobile.Localization.MagnetMotion;
				//	break;
			case CoolerIoTMobile.RecordTypes.DOOR_EVENT:
				recordTypeText = CoolerIoTMobile.Localization.DoorEvent;
				break;
			case CoolerIoTMobile.RecordTypes.IMAGE_EVENT:
				sequence = CoolerIoTMobile.util.Utility.readFourByte(bytes.subarray(10, 14));
				angle = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(14, 16)).toFixed(1);
				address = 0;
				recordTypeText = CoolerIoTMobile.Localization.ImageEvent;
				break;
			case CoolerIoTMobile.RecordTypes.GPS_EVENT:
				latitude = CoolerIoTMobile.util.Utility.readThreeByte(bytes.subarray(8, 11));
				longitude = CoolerIoTMobile.util.Utility.readThreeByte(bytes.subarray(11, 14));
				recordTypeText = CoolerIoTMobile.Localization.GpsEvent;
				break;
			case CoolerIoTMobile.RecordTypes.MOTION_TIME:
				startTimeMovement = CoolerIoTMobile.util.Utility.readFourByte(bytes.subarray(10, 14));
				durationMovement = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(14, 16));
				recordTypeText = CoolerIoTMobile.Localization.MotionTime;
				break;
			default:
				recordTypeText = CoolerIoTMobile.Localization.UnknownRecordType;
				break;
		}


		var doorState = switchStatus ? "OPEN" : "CLOSE";
		var temp = temperature != 0 ? temperature / 10 : temperature;
		if (recordTypeText != CoolerIoTMobile.Localization.UnknownRecordType) {
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
				SwitchStatus: switchStatus ? 1 : 0,
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
				DurationMovement: durationMovement,
				Sequence: sequence,
				Angle: angle,
				Address: 0
			});
			return model;
		}
		else {
			return CoolerIoTMobile.Localization.UnknownRecordType;
		}

	},
	addListData: function (bytes) {
		var listData = this.getListData() || {};

		var me = this.getBluetooth();

		listData[me.getResponseCount() - 1] = { data: bytes };

		this.setListData(listData);
	},
	processData: function (bytes) {
		console.log("first response");
		console.log(new Uint8Array(bytes));

		var me = this.getBluetooth(), command = me.getActiveCommand() != null ? me.getActiveCommand() : this.getCurrentBulkCommand();
		this.setTotalRecords(0);
		var isSuccess = bytes.subarray(0, 1)[0];
		var packetId = 0;[]
		this.setListData(null);

		var success = isSuccess === 1 ? CoolerIoTMobile.Localization.SuccessMessageTitle : CoolerIoTMobile.Localization.FailedMessageTitle;
		var labelWidth = '50%';
		if (command === CoolerIoTMobile.BleCommands.EVENT_DATA_FROM_IDX_IDY)
			labelWidth = "240px";
		if (command === CoolerIoTMobile.BleCommands.CURRENT_TIME)
			labelWidth = "140px";

		if (command === CoolerIoTMobile.BleCommands.READ_CONFIGURATION_PARAMETER) {
			packetId = 0;
			labelWidth = "230px";
		}
		if (!this.getIsBulkCommandExecution()) {
			this.addCommandDataModel(CoolerIoTMobile.Localization.Status, success, isSuccess, command, labelWidth);
		}


		switch (command) {
			case CoolerIoTMobile.BleCommands.EVENT_DATA_FROM_IDX_IDY:
			case CoolerIoTMobile.BleCommands.LATEST_N_EVENTS:
			case CoolerIoTMobile.BleCommands.FETCH_DATA:
			case CoolerIoTMobile.BleCommands.CURRENT_SENSOR_DATA:
				var totalRecords = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(1, 3));
				this.setTotalRecords(totalRecords);
				var label = command === CoolerIoTMobile.BleCommands.EVENT_DATA_FROM_IDX_IDY ? CoolerIoTMobile.Localization.NumberOfEventSent : CoolerIoTMobile.Localization.TotalEvent;
				if (!this.getIsBulkCommandExecution()) {
					this.addCommandDataModel(label, totalRecords, isSuccess, command, labelWidth);
				}
				break;
			case CoolerIoTMobile.BleCommands.FIRMWARE_DETAIL:
				var majorVersion = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(1, 2));
				var minorVersion = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(2, 3));
				if (!this.getIsBulkCommandExecution()) {
					this.addCommandDataModel(CoolerIoTMobile.Localization.MajorVersion, majorVersion, isSuccess, command, labelWidth);
					this.addCommandDataModel(CoolerIoTMobile.Localization.MinorVersion, minorVersion, isSuccess, command, labelWidth);
				}
				break;
			case CoolerIoTMobile.BleCommands.CURRENT_TIME:
				var time = CoolerIoTMobile.util.Utility.readFourByte(bytes.subarray(1, 5));
				if (!this.getIsBulkCommandExecution()) {
					this.addCommandDataModel(CoolerIoTMobile.Localization.TimeOfDevice, CoolerIoTMobile.util.Utility.getDateFromMilliseconds(time), isSuccess, command, labelWidth);
				}
				else {
					this.getDebugDeviceRecord().CurentTime = CoolerIoTMobile.util.Utility.getDeviceDateFromMilliseconds(time);
				}
				break;
			case CoolerIoTMobile.BleCommands.SERIALNUMBER:
				var serialNumber = CoolerIoTMobile.util.Utility.bytesToString(bytes.subarray(1, 15));
				if (!this.getIsBulkCommandExecution()) {
					this.addCommandDataModel(CoolerIoTMobile.Localization.DeviceSerialNumber, serialNumber, isSuccess, command, labelWidth);
				}
				else {
					this.getDebugDeviceRecord().SerialNumber = serialNumber;
				}
				break;
			case CoolerIoTMobile.BleCommands.EVENT_COUNT:
				var currentEventIndex = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(1, 3));
				var rangeOfEventId = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(3, 5));
				if (!this.getIsBulkCommandExecution()) {
					this.addCommandDataModel(CoolerIoTMobile.Localization.CurrentEventIndex, currentEventIndex, isSuccess, command, labelWidth);
					this.addCommandDataModel(CoolerIoTMobile.Localization.RangeOfEventId, rangeOfEventId, isSuccess, command, labelWidth);
				}
				break;
			case CoolerIoTMobile.BleCommands.READ_CONFIGURATION_PARAMETER:
				if (!this.getIsBulkCommandExecution()) {
					this.addCommandDataModel(CoolerIoTMobile.Localization.PeriodicIntervalMinutes, CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(1, 2)), isSuccess, command, labelWidth);
					this.addCommandDataModel(CoolerIoTMobile.Localization.MovementThresholdG, CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(2, 3)), isSuccess, command, labelWidth);
					this.addCommandDataModel(CoolerIoTMobile.Localization.MovementThresholdTime, CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(3, 4)), isSuccess, command, labelWidth);
					this.addCommandDataModel(CoolerIoTMobile.Localization.AdvertisingPeriodMilliseconds, CoolerIoTMobile.util.Utility.readWord(bytes.subarray(4, 6)), isSuccess, command, labelWidth);
					this.addCommandDataModel(CoolerIoTMobile.Localization.TemperatureOutOfThreashold, CoolerIoTMobile.util.Utility.readWord(bytes.subarray(6, 8)), isSuccess, command, labelWidth);//2 byte				
					this.addCommandDataModel(CoolerIoTMobile.Localization.LightOutOfThreashold, CoolerIoTMobile.util.Utility.readWord(bytes.subarray(8, 10)), isSuccess, command, labelWidth);//2 byte				
					this.addCommandDataModel(CoolerIoTMobile.Localization.HumidityOutOfThreashold, CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(10, 11)), isSuccess, command, labelWidth);//2bytes				
					this.addCommandDataModel(CoolerIoTMobile.Localization.Latitude, CoolerIoTMobile.util.Utility.readFourByte(bytes.subarray(11, 15)), isSuccess, command, labelWidth);//4bytes				
					this.addCommandDataModel(CoolerIoTMobile.Localization.Longitude, CoolerIoTMobile.util.Utility.readFourByte(bytes.subarray(15, 19)), isSuccess, command, labelWidth);//4bytes				
				}
				else {
					this.getDebugDeviceRecord().PeriodicIntervalMinutes = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(1, 2));
					this.getDebugDeviceRecord().MovementThresholdG = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(2, 3));
					this.getDebugDeviceRecord().MovementThresholdTime = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(3, 4));
					this.getDebugDeviceRecord().AdvertisingPeriodMilliseconds = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(4, 6));
					this.getDebugDeviceRecord().TemperatureOutOfThreashold = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(6, 8));
					this.getDebugDeviceRecord().LightOutOfThreashold = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(8, 10));
					this.getDebugDeviceRecord().HumidityOutOfThreashold = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(10, 11));
				}
				break;
			case CoolerIoTMobile.BleCommands.READ_CAMERA_SETTING:
				var brightness = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(1, 2)),
					contrast = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(2, 3)),
					saturation = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(3, 4)),
					shutterSpeed = CoolerIoTMobile.util.Utility.readWordReverse(bytes.subarray(4, 6)),
					cameraQuality = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(6, 7)),
					effect = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(7, 8)),
					lightMode = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(8, 9)),
					cameraClock = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(9, 10)),
					Cdly = CoolerIoTMobile.util.Utility.readWordReverse(bytes.subarray(10, 12)),
					drive = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(12, 13));


				if (this.getIsBulkCommandExecution()) {
					this.getDebugDeviceRecord().Brightness = brightness;
					this.getDebugDeviceRecord().Contrast = contrast;
					this.getDebugDeviceRecord().Saturation = saturation;
					this.getDebugDeviceRecord().ShutterSpeed = shutterSpeed;
					this.getDebugDeviceRecord().CameraQuality = cameraQuality;
					this.getDebugDeviceRecord().Effect = effect;
					this.getDebugDeviceRecord().LightMode = lightMode;
					this.getDebugDeviceRecord().CameraClock = cameraClock;
					this.getDebugDeviceRecord().Cdly = Cdly;
					this.getDebugDeviceRecord().Drive = drive;
				}
				else {
					CoolerIoTMobile.Util.addViewWithDynamicItems("CoolerIoTMobile.view.Mobile.DeviceConfiguration", CoolerIoTMobile.CommandFormItems.CommonItems.concat(CoolerIoTMobile.CommandFormItems.ImageCalibration));
					Ext.ComponentQuery.query('#imageCalibrationBrightness')[0].setValue(brightness);
					Ext.ComponentQuery.query('#imageCalibrationContrast')[0].setValue(contrast);
					Ext.ComponentQuery.query('#imageCalibrationSaturation')[0].setValue(saturation);
					Ext.ComponentQuery.query('#imageCalibrationShutterSpeed')[0].setValue(shutterSpeed);
					Ext.ComponentQuery.query('#imageCalibrationCameraQuality')[0].setValue(cameraQuality);
					Ext.ComponentQuery.query('#imageCalibrationEffect')[0].setValue(effect);
					Ext.ComponentQuery.query('#imageCalibrationLightMode')[0].setValue(lightMode);
					CoolerIoTMobile.util.Utility.isSetBulkCommandExecution = false;
					return;
				}
				break;
			case CoolerIoTMobile.BleCommands.READ_GYROSCOPE_DATA:
				this.getDebugDeviceRecord().Angle = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(1, 3));
				break;
			case CoolerIoTMobile.BleCommands.SET_STANDBY_MODE:
				this.getDebugDeviceRecord().StandByModeValue = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(1, 2));
				break;
			case CoolerIoTMobile.BleCommands.ENABLE_TAKE_PICTURE:
				this.getDebugDeviceRecord().EnableTakePicture = CoolerIoTMobile.util.Utility.readSingle(bytes.subarray(1, 2));
				break;
			case CoolerIoTMobile.BleCommands.TAKE_PICTURE:
				this.getBluetooth().setActiveCommand(null);
				me.fireEvent('disconnectDevice');
				break;
			default:
				break;
		}
		console.log("first response total count : " + this.getTotalRecords() + " Command : " + command);


		if (command == CoolerIoTMobile.BleCommands.SET_VALIDATE_PASSWORD) {
			var store = Ext.getStore('DeviceData');
			store.removeAll();
		}
		else if (!this.getIsBulkCommandExecution()) {
			if (!CoolerIoTMobile.util.Utility.isSetBulkCommandExecution) {
				this.showResponseWindow();
			}
		}
		CoolerIoTMobile.util.Utility.isSetBulkCommandExecution = false;
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
	onUpdateStatus: function (arg, canClose) {
		if (canClose) {
			Ext.Viewport.setMasked(false);
			return;
		}
		Ext.Viewport.setMasked({ xtype: 'loadmask', message: arg });
	},
	onConnected: function () {
		var command = bluetoothle.bytesToEncodedString([1]);
		this.getBluetooth().fireEvent('startDiscover', command);
	},
	onReadSuccess: function (obj) {
		_onReadSuccess = obj;
		console.log("Read success - ");
	},
	onScanListTap: function (list, index, target, record, e, eOpts) {
		console.log('scanlist tap');
		this.getBluetooth().setActiveCommand(null);
		this.getBluetooth().fireEvent('stopScan');
		var scanningPanel = this.getScanningDevicePanel();
		scanningPanel.hide();
		if (CoolerIoTMobile.util.Utility.isFromInstallDevice) {
			CoolerIoTMobile.util.Utility.isFromInstallDevice = false;
			CoolerIoTMobile.app.getController('InstallDevice').processInstall(record);
			return;
		}
		var password = localStorage.getItem("BlePassword");
		this.setSelectedRecord(record);

		this.getBluetooth().fireEvent('connectWithPassword', record);
	},
	onInitializeSuccess: function (obj) {
		console.log("onInitializeSuccess controll " + JSON.stringify(obj));
		if (obj.status === "enabled")
			this.getBluetooth().fireEvent('startScan');
		else
			Ext.Msg.alert(CoolerIoTMobile.Localization.FailedMessageTitle, 'Bluetooth ' + obj.status);
	},
	onStartScanSuccess: function (obj) {
		if (obj.status == "scanResult") {

			console.log("Scan result... - " + obj.address);

			var store = this.getScanningDeviceList().getStore();
			var index = store.findExact('DeviceName', obj.name);

			if (index === -1) {
				if (Ext.os.name.toLowerCase() !== CoolerIoTMobile.Enums.DeviceType.Ios) {

					var advertisementBytes = bluetoothle.encodedStringToBytes(obj.advertisement),
				  advertisementInfo = advertisementBytes[32 + (advertisementBytes[30]) + 3];

					var healthEventAvailable = this.isBitSet(advertisementInfo, 0),
					pictureAvailable = this.isBitSet(advertisementInfo, 1),
					motionEventAvailable = this.isBitSet(advertisementInfo, 2),
					takePictureEnable = this.isBitSet(advertisementInfo, 3),
					doorStatus = this.isBitSet(advertisementInfo, 4),
					standByControlStatus = this.isBitSet(advertisementInfo, 5),
					major = 0,
					minor = 0;
					if (obj.name.length > 10) {
						if (isNaN(obj.name.substring(8, 9))) {
							major = 2;
						}
						else {
							major = Number(obj.name.substring(8, 9));
						}
						if (isNaN(obj.name.substring(9, 10))) {
							minor = 1;
						}
						else {
							minor = Number(obj.name.substring(9, 10));
						}
					}
					else {
						major = 0;
						minor = 0;
					}

				}
				var record = store.getModel().create({ MacAddress: obj.address, Advertisement: obj.advertisement, DeviceName: obj.name, ManufacturerUUID: typeof obj.advertisement === 'string' ? CoolerIoTMobile.util.Utility.base64ToHex(obj.advertisement, 9, 25) : 0, Major: major, Minor: minor, Rssi: obj.rssi, HealthText: healthEventAvailable ? 'Health' : '', MotionText: motionEventAvailable ? 'Motion' : '', DoorStatus: doorStatus ? 'Open' : 'Close', ImageText: pictureAvailable ? 'Image' : '', PictureText: takePictureEnable ? 'Pic' : 'No Pic', StandByStatus: standByControlStatus ? 'Standby' : '' });
				if (record.data.DeviceName.indexOf('SV') == -1) {
					if (record.data.PictureText) {
						record.data.PictureText = '';
					}
				}
				if (CoolerIoTMobile.util.Utility.isManualFactorySetup) {
					if (record.data.MacAddress == CoolerIoTMobile.util.Utility.defaultMacAddress) {
						store.add(record);
					}
				}
				else if (CoolerIoTMobile.util.Utility.isInstallDevice) {
					if (record.data.DeviceName.indexOf(CoolerIoTMobile.util.Utility.InstallDeviceSerialNumber) > -1) {
						store.add(record);
					}
				}
				else {
					store.add(record);
				}
			}


		} else if (obj.status == "scanStarted") {
			console.log("Scan was started successfully");
		} else {
			console.log("Unexpected start scan status: " + obj.status);
		}
	}
});

var FileIO = {
	fileEntry: '',
	base64Data: new ArrayBuffer(),
	splitedFileName: '',
	isReadOperation: false,
	imageHeader: {},
	applicationPath: '',
	imageName: '',
	camera1ImageData: '',
	camera2ImageData: '',
	logsDeviceInfo: false,
	z: 0,
	logsData: {},
	// pass that file entry over to gotImageURI()
	saveImageData: function () {
		return new Promise(function (resolve, reject) {
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
			function (fileEntry) {
				FileIO.gotDir(fileEntry).then(function () { resolve() });
			}, FileIO.onFail);
		});

	},
	gotDir: function (fileEntry) {
		return new Promise(function (resolve, reject) {
			fileEntry.root.getDirectory("CoolerIoTMobile", { create: true, exclusive: false },
			function (directory) {
				FileIO.writeFile(directory).then(function () { resolve() });
			});// New Folder
		});
	},
	writeFile: function (directory) {
		return new Promise(function (resolve, reject) {
			var fileName = FileIO.splitedFileName != '' ? FileIO.splitedFileName : "CoolerIoTMobile.jpg";// new FileName
			directory.getFile(fileName, { create: true, exclusive: false },
			function (fileEntry) {
				FileIO.updateFile(fileEntry).then(function () { resolve() })
			}, FileIO.onFail);
		});
	},
	updateFile: function (fileEntry) {
		return new Promise(function (resolve, reject) {
			FileIO.fileEntry = fileEntry;
			fileEntry.createWriter(
			function (writer) {
				FileIO.gotFileWriter(writer).then(function () { resolve() })
			},
			FileIO.onFail);
		});
	},
	gotFileWriter: function (writer) {
		return new Promise(function (resolve, reject) {
			if (writer.length > 0) {
				writer.seek(writer.length);
			}
			writer.onwrite = function () {
				console.log('File written');
				resolve();
			};
			writer.write(FileIO.base64Data);
			FileIO.base64Data = new ArrayBuffer();
			if (FileIO.splitedFileName == '') {
				console.log('Image splitting process started');
				FileIO.getImageDirectory();
			}
		});
	},
	getImageDirectory: function () {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, FileIO.readImage, FileIO.onFail);
	},
	readImage: function (imageURI) {
		var imageUrl = imageURI.root.nativeURL + '/CoolerIoTMobile' + '/CoolerIoTMobile.jpg';
		FileIO.applicationPath = imageURI.root.nativeURL + '/CoolerIoTMobile';
		window.resolveLocalFileSystemURL(imageUrl, function (fileEntry) {
			fileEntry.file(function (file) {
				var reader = new FileReader();
				reader.onloadend = function (e) {
					var jpegHeaderPart1 = [0xFF, 0xE0];
					var jpegHeaderPart2 = [0x4A, 0x46, 0x49, 0x46, 0x00];
					var headerPattern = [0x01, 0xEF, 0xCD, 0xAB];
					var result = e.target.result;

					var buff = new Uint8Array(result);
					var hasHeader = CoolerIoTMobile.util.Utility.IsMatch(buff, 0, headerPattern);
					FileIO.imageHeader.header = CoolerIoTMobile.util.Utility.readFourByte(buff.subarray(0, 4));
					FileIO.imageHeader.image1size = CoolerIoTMobile.util.Utility.readFourByte(buff.subarray(4, 8));
					FileIO.imageHeader.image2size = CoolerIoTMobile.util.Utility.readFourByte(buff.subarray(8, 12));
					FileIO.imageHeader.errorCode = CoolerIoTMobile.util.Utility.readFourByte(buff.subarray(12, 16));
					FileIO.imageHeader.flashSequence = CoolerIoTMobile.util.Utility.readFourByte(buff.subarray(16, 20));
					FileIO.imageHeader.captureTime = CoolerIoTMobile.util.Utility.readFourByte(buff.subarray(20, 24));
					FileIO.imageHeader.cameraSettingHeader = CoolerIoTMobile.util.Utility.readFourByte(buff.subarray(26, 30));
					FileIO.imageHeader.Contrast = CoolerIoTMobile.util.Utility.readSingle(buff.subarray(30, 31));
					FileIO.imageHeader.brightness = CoolerIoTMobile.util.Utility.readSingle(buff.subarray(31, 32));
					FileIO.imageHeader.saturation = CoolerIoTMobile.util.Utility.readSingle(buff.subarray(32, 33));
					FileIO.imageHeader.quality = CoolerIoTMobile.util.Utility.readSingle(buff.subarray(33, 34));
					FileIO.imageHeader.effects = CoolerIoTMobile.util.Utility.readSingle(buff.subarray(34, 35));
					FileIO.imageHeader.lightMode = CoolerIoTMobile.util.Utility.readSingle(buff.subarray(35, 36));
					FileIO.imageHeader.shutterSpeed = CoolerIoTMobile.util.Utility.readWord(buff.subarray(36, 38));
					FileIO.imageHeader.cameraClock = CoolerIoTMobile.util.Utility.readSingle(buff.subarray(38, 39));
					FileIO.imageHeader.cdly = CoolerIoTMobile.util.Utility.readWord(buff.subarray(40, 42));
					FileIO.imageHeader.drive = CoolerIoTMobile.util.Utility.readSingle(buff.subarray(42, 43));
					FileIO.imageHeader.extraLines = CoolerIoTMobile.util.Utility.readWord(buff.subarray(44, 46));
					FileIO.imageHeader.headerSize = 32 * 16;


					var position = FileIO.imageHeader.headerSize,
						hasExtraData = false,
						fileNo = 0;
					packetSize = hasExtraData ? 133 : 128;
					if (position > -1) {
						if (hasExtraData) {
							position += 3;
						}
						FileIO.processBufferdResponse(result, buff, position, packetSize, fileNo, jpegHeaderPart1, jpegHeaderPart2);
					}
				}
				reader.readAsArrayBuffer(file);
			});
		}, FileIO.onFail);

	},
	processBufferdResponse: function (result, buff, position, packetSize, fileNo, jpegHeaderPart1, jpegHeaderPart2) {
		if (position + 128 <= buff.length) {
			if (CoolerIoTMobile.util.Utility.IsMatch(buff, position + 2, jpegHeaderPart1) && CoolerIoTMobile.util.Utility.IsMatch(buff, position + 6, jpegHeaderPart2)) {
				FileIO.base64Data = new ArrayBuffer();
				var fileName = "camera_" + (++fileNo) + ".jpg";
				FileIO.splitedFileName = fileName;
			}
			if (FileIO.splitedFileName != '') {
				FileIO.base64Data = result.slice(position, 128 + position);
				FileIO.saveImageData().then(function () {
					FileIO.processBufferdResponse(result, buff, position, packetSize, fileNo, jpegHeaderPart1, jpegHeaderPart2);
				});
			}
			position += packetSize;
		}
		else {
			Ext.Viewport.unmask();
			FileIO.splitedFileName = '';
			FileIO.base64Data = new ArrayBuffer();
			FileIO.showDownloadedImage();
		}
	},
	showDownloadedImage: function () {
		setTimeout(function () {
			if (FileIO.z < 2) {
				FileIO.viewImageFromDirectory('camera_' + (FileIO.z + 1) + '.jpg');
				FileIO.z++;
				FileIO.showDownloadedImage();
			}
			else {
				var win = Ext.Viewport.add(Ext.create('CoolerIoTMobile.view.Mobile.CoolerImage'));
				win.down('#camera_1').setSrc(FileIO.camera1ImageData);
				win.down('#camera_2').setSrc(FileIO.camera2ImageData);
				FileIO.camera2ImageData = '';
				FileIO.camera1ImageData = '';
				win.show();
				FileIO.z = 0;
			}
		}, 300);
	},
	viewImageFromDirectory: function (imageName) {
		FileIO.imageName = imageName;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, FileIO.viewImage, FileIO.onFail);
	},
	viewImage: function (imageURI) {
		var imageUrl = imageURI.root.nativeURL + '/CoolerIoTMobile' + '/' + FileIO.imageName;
		FileIO.applicationPath = imageURI.root.nativeURL + '/CoolerIoTMobile';
		window.resolveLocalFileSystemURL(imageUrl, function (fileEntry) {
			fileEntry.file(function (file) {
				var reader = new FileReader();
				reader.onloadend = function (e) {
					var base64 = this.result;
					if (FileIO.imageName == "camera_1.jpg") {
						FileIO.camera1ImageData = base64;
					}
					else {
						FileIO.camera2ImageData = base64;
					}
				}
				reader.readAsDataURL(file);
			});
		}, FileIO.onFail);
	},
	gotFileEntry: function (fileEntry) {
		fileEntry.file(getFile, FileIO.onFail);
	},
	onFail: function (camera) {
		Ext.Msg.alert('Alert', 'operation fail');
	},
	// delete all content of directory
	removeFile: function () {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
		function fail(evt) {
			FileIO.saveImageData();
		}
		function onFileSystemSuccess(fileSystem) {
			fileSystem.root.getDirectory('CoolerIoTMobile', {
				create: false,
				exclusive: false
			},
			   function (entry) {
			   	entry.removeRecursively(function () {
			   		FileIO.saveImageData();
			   	}, fail);
			   }, fail);
		}
	},
	saveLogs: function () {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, FileIO.gotRootDir, FileIO.onFail);
	},
	gotRootDir: function (fileEntry) {
		fileEntry.root.getDirectory("CoolerIoTMobile", { create: true, exclusive: false }, FileIO.writeLogFile);// New Folder
	},
	writeLogFile: function (directory) {
		var fileName = 'SmartCoolerApp.log';
		directory.getFile(fileName, { create: true, exclusive: false }, FileIO.updateLogFile, FileIO.onFail);
	},
	updateLogFile: function (fileEntry) {
		FileIO.fileEntry = fileEntry;
		fileEntry.createWriter(FileIO.gotLogFileWriter, FileIO.onFail);
	},
	gotLogFileWriter: function (writer) {
		if (writer.length > 0) {
			writer.seek(writer.length);
		}
		writer.write(FileIO.logsData);
		FileIO.logsData = {};
	}
};