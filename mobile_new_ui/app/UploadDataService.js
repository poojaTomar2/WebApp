Ext.define('CoolerIoTMobile.UploadDataService', {
	singleton: true,
	connectionTimeoutDuration: 10000,
	imageDownloadTimeout: 5000,
	fetchDataTimeout: 5000,
	eraseDataTimeout: 2000,
	defaultCommandTimeout: 1000,
	dataUploadTimeout: 12000,
	running: false,
	notificationCount: 0,
	currentDeviceIndex: 0,
	validDevices: [],
	allowUnsecureSync: true,
	activeDevice: null,
	dfuDevices: ['DfuTarg'],
	processStep: {
		idle: 'idle',
		updateDeviceList: 'updateDeviceList',
		scanDevices: 'scanDevices',
		downloadDeviceData: 'downloadDeviceData',
		uploadDeviceData: 'uploadDeviceData',
		uploadImages: 'uploadImages',
		reschedule: 'reschedule'
	},

	harborRequestTypes: {
		Data: 0x01,
		Image: 0x02,
		CommandResponse: 0x03,
		WhitelistDevices: 0x04,
		SmartDevicePing: 0x06,
		DeviceAssetData: 0x07,
		ListRemoteCommands: 0x0B,
		HubInfo: 0X0C,
		UserGpsLocation: 0X11
	},

	config: {
		dataResponseArray: [],
		eventCount: 0,
		imageResponseCount: 0,
		totalImageBytes: 0,
		imageResponseArray: [],
		activeImageId: 0,
		currentCommand: null,
		currentRecordId: 0,
		indexToSet: 0,
		firstRun: true
	},
	runCount: 0,
	currentStep: 'idle',
	resumeDownload: false,
	constructor: function (cfg) {
		this.initConfig(cfg);
	},
	run: function () {
		if (!this.running) {
			this.notify('Service started')
			this.running = true;
			this.executeCurrentStep();
			device.mac_address = device.mac_address ? device.mac_address : '18:59:36:08:1B:70';
		}
	},

	stop: function (detachEvents) {
		if (this.running) {
			this.notify('Service stopped')
			this.getBluetooth().fireEvent('disconnectDevice');
			this.running = false;
		}
		if (detachEvents && this.getBluetooth()) {
			this.deattachEvents();
			this.getBluetooth().destroy();
		}
	},

	nextStep: function () {
		if (!this.running) {
			return;
		}
		switch (this.currentStep) {
			case this.processStep.idle:
				this.currentStep = this.processStep.scanDevices;
				break;
			case this.processStep.scanDevices:
				this.currentStep = this.processStep.updateDeviceList;
				break;
			case this.processStep.updateDeviceList:
				if (Ext.getStore('BleTag').getCount() == 0 && this.runCount > 1) {
					this.currentStep = this.processStep.reschedule;
				} else {
					this.currentStep = this.processStep.downloadDeviceData;
				}
				break;
			case this.processStep.downloadDeviceData:
				this.activeDevice = null;
				this.currentStep = this.processStep.uploadDeviceData;
				break;
			case this.processStep.uploadDeviceData:
				this.currentStep = this.processStep.uploadImages;
				break;
			case this.processStep.uploadImages:
				this.currentStep = this.processStep.reschedule;
				break;
			case this.processStep.reschedule:
				this.currentStep = this.processStep.idle;
				break;
		}
		this.runCount++;
		this.executeCurrentStep();
	},

	executeCurrentStep: function () {
		var currentStep = this.currentStep;
		this.notify('running step ' + currentStep)
		if (!currentStep) {
			this.stop();
			return;
		}
		var me = this;
		switch (currentStep) {
			case this.processStep.idle:
				this.initializeBlutooth();
				break;
			case this.processStep.scanDevices:
				this.notify('Process started - ' + Ext.util.Format.date(new Date(), 'd/m/y h:i:s a'));
				if (this.isBluetoothOn()) {
					this.getBluetooth().fireEvent('startScan');
				} else {
					this.nextStep();
				}
				break;
			case this.processStep.updateDeviceList:
				if (Ext.getStore('BleTag').getCount() == 0) {
					this.nextStep();
				} else if (this.isNetworkAvailable()) {
					this.savePingData().then(function () {
						me.saveLoadDeviceList();
					});
				} else {
					this.savePingData().then(function () {
						this.nextStep();
					});
				}
				break;
			case this.processStep.downloadDeviceData:
				if (this.isBluetoothOn()) {
					this.currentDeviceIndex = 0;
					this.startDownloadDeviceData();
				} else {
					this.nextStep();
				}
				break;
			case this.processStep.uploadDeviceData:
				if (this.isNetworkAvailable()) {
					this.uploadDeviceData();
				} else {
					this.nextStep();
				}
				break;
			case this.processStep.uploadImages:
				if (this.isNetworkAvailable()) {
					this.uploadImages();
				} else {
					this.nextStep();
				}
				break;
			case this.processStep.reschedule:
				this.notify('Process completed - ' + Ext.util.Format.date(new Date(), 'd/m/y h:i:s a'));
				this.nextStep();
				break;
		}
	},

	onDeviceClose: function () {
		if (this.running) {
			if (this.getCurrentCommand() === CoolerIoTMobile.BleCommands.READ_AVAILABLE_UNREAD_EVENT) {
				var eventData = this.getDataResponseArray();
				if (eventData.length > 0) {
					var remainingEvents = this.getEventCount();
					var indexToSet = this.getCurrentRecordId();
					var currentDeviceEventIndex = (indexToSet + remainingEvents) % 65535;
					if (currentDeviceEventIndex < indexToSet) {
						indexToSet = 0;
					}
					this.setIndexToSet(indexToSet);
					this.resumeDownload = true;
					this.saveEventData({ address: this.activeDevice.get('MacAddress'), eventData: this.getDataResponseArray() });
					return;
				}
			}

			if (this.currentStep === this.processStep.downloadDeviceData) {
				this.notify('wait before connect next device....');
				setTimeout(function () {
					this.currentDeviceIndex++;
					this.downloadDeviceData();
				}.bind(this), 5000);
			}
		}
	},
	timeoutDisconnect: function () {
		if (this.activeDevice) {
			this.notify('Not able to connect - ' + this.activeDevice.get('MacAddress'));
		}
		this.getBluetooth().fireEvent('disconnectDevice');
	},
	downloadDeviceData: function () {
		this.notify('in function downloadDeviceData');
		var validDeviceCount = this.validDevices.length;
		if (this.currentDeviceIndex < validDeviceCount) {
			var smartDevice = this.validDevices[this.currentDeviceIndex];
			this.activeDevice = smartDevice;
			if (this.activeDevice.get('HealthText') == 'Health' || this.activeDevice.get('MotionText') == 'Motion' || this.activeDevice.get('ImageText') == 'Image' || this.isIOS()) {
				this.notify('Connecting - ' + this.activeDevice.get('MacAddress') + ' - ' + this.activeDevice.get('DeviceName'));
				if (this.getFirstRun()) {
					this.setFirstRun(false);
					console.log('connectWithPassword');
					this.getBluetooth().fireEvent('connectWithPassword', this.activeDevice);
				} else {
					console.log('connectDevice');
					this.getBluetooth().fireEvent('connectDevice', this.activeDevice.get('MacAddress'));
				}
				this.connectTimeout = setTimeout(this.timeoutDisconnect.bind(this), this.connectionTimeoutDuration);
			} else {
				this.currentDeviceIndex++;
				this.downloadDeviceData();
			}
		} else {
			this.notify('No more device to connect');
			this.nextStep();
		}
	},

	uploadDeviceData: function () {
		if (this.isNetworkAvailable()) {
			var toUpload = [], me = this;
			CoolerIoTMobile.Util.execute("SELECT hex(Data) AS Data, Id FROM DeviceData").then(function (res) {
				var data = CoolerIoTMobile.Util.getResultAsArray(res[1].rows);
				if (data.length > 0) {
					me.notify('Data uploading');
					toUpload.push.apply(toUpload, CoolerIoTMobile.Util.machexToBytes(device.mac_address));
					toUpload.push.apply(toUpload, [me.harborRequestTypes.Data]);
					for (var i = 0, len = data.length; i < len; i++) {
						toUpload.push.apply(toUpload, CoolerIoTMobile.Util.hexToBytes(data[i].Data));
					}
					me.uploadData(toUpload);
				} else {
					me.notify('No Data for uploading');
					me.nextStep();
				}
			})
		}
		else {
			this.nextStep();
		}
	},

	uploadImages: function () {
		if (this.isNetworkAvailable()) {
			var me = this;
			CoolerIoTMobile.Util.execute("SELECT MacAddress, hex(Image) AS Image, Id FROM [Image] Limit 1").then(function (res) {
				var imageData = CoolerIoTMobile.Util.getResultAsArray(res[1].rows), toUpload = [];
				if (imageData.length > 0) {
					me.setActiveImageId(imageData[0].Id);
					toUpload.push.apply(toUpload, CoolerIoTMobile.Util.machexToBytes(device.mac_address));
					toUpload.push.apply(toUpload, [CoolerIoTMobile.UploadDataService.harborRequestTypes.Image]);
					toUpload = toUpload.concat(CoolerIoTMobile.Util.hexToBytes(imageData[0].Image));
					me.notify('Image Uploading...');
					me.uploadData(toUpload);
				} else {
					me.notify('Image upload skipped - No image');
					me.nextStep();
				}
			});
		}
		else {
			this.notify('Image upload skipped - No internet connection');
			this.nextStep();
		}
	},

	saveLoadDeviceList: function () {
		this.notify('save load device list');
		if (this.isNetworkAvailable()) {
			var toUpload = [], me = this;
			toUpload.push.apply(toUpload, CoolerIoTMobile.Util.machexToBytes(device.mac_address));
			toUpload.push.apply(toUpload, [this.harborRequestTypes.SmartDevicePing]);
			CoolerIoTMobile.Util.execute('SELECT hex(Data) AS Data FROM SmartDevicePing').then(function (res) {
				var pings = CoolerIoTMobile.Util.getResultAsArray(res[1].rows), blobs = [];
				for (var i = 0, len = pings.length; i < len; i++) {
					toUpload.push.apply(toUpload, CoolerIoTMobile.Util.hexToBytes(pings[i].Data));
				}
				me.uploadData(toUpload);
			});
		}
		else {
			this.notify('Ping upload skipped - No internet connection');
			this.nextStep();
		}
	},

	startDownloadDeviceData: function () {
		this.notify('In function startDownloadDeviceData');
		var scannedDevicesStore = Ext.getStore('BleTag');
		var deviceCount = scannedDevicesStore.getCount();
		this.validDevices = [];
		if (deviceCount > 0) {
			this.notify('found ' + deviceCount + ' devices');
			for (var i = 0; i < deviceCount; i++) {
				if (this.allowUnsecureSync) {
					this.validDevices.push(scannedDevicesStore.getAt(i));
				} else {

				}
			}
			this.downloadDeviceData();
		} else {
			this.notify('No device found');

		}
	},

	purgeData: function () {
		var me = this;
		switch (this.currentStep) {
			case this.processStep.updateDeviceList:
				CoolerIoTMobile.Util.execute("DELETE FROM SmartDevicePing").then(function () {
					me.nextStep();
				});
				break;
			case this.processStep.uploadDeviceData:
				CoolerIoTMobile.Util.execute("DELETE FROM DeviceData").then(function () {
					me.nextStep();
				});
				break;
			case this.processStep.uploadImages:
				this.notify('Image uploaded');
				this.notify('Deleting Image with Id - ' + me.getActiveImageId());
				CoolerIoTMobile.Util.execute("DELETE FROM [Image] WHERE Id = " + me.getActiveImageId()).then(function () {
					me.notify('Image deleted for local db');
					me.uploadImages();
				});
				break;
		}
	},

	uploadData: function (toUpload, contentType) {
		contentType = contentType ? contentType : 'application/octet-stream';
		Ext.Ajax.request({
			url: CoolerIoTMobile.Localization.QAUrl + '/Controllers/DataUpload2.ashx',
			//url: 'http://192.168.2.197/Cooler/Controllers/DataUpload2.ashx',
			method: 'POST',
			timeout: this.dataUploadTimeout,
			binaryData: toUpload,
			headers: { 'Content-Type': contentType },
			success: function (response) {
				this.notify(response);
				this.purgeData();
			},
			failure: function (response) {
				this.notify('upload failed ' + response.statusText);
				this.nextStep();
			},
			scope: this
		});
	},

	isBluetoothOn: function () {
		return true;
	},

	onStartScanSuccess: function (obj) {
		if (this.dfuDevices.indexOf(obj.name) > -1) {//Do not consider devices in dfu
			return;
		}
		if (obj.status == "scanResult") {
			var store = Ext.getStore('BleTag');
			var index = store.findExact('DeviceName', obj.name);
			if (index === -1) {
				this.notify("Scan result... - " + obj.name);
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
				} else {
					this.notify(obj.advertisement);
				}
				var record = store.getModel().create({
					MacAddress: obj.address,
					Advertisement: obj.advertisement,
					DeviceName: obj.name,
					ManufacturerUUID: typeof obj.advertisement === 'string' ? CoolerIoTMobile.util.Utility.base64ToHex(obj.advertisement, 9, 25) : 0,
					Major: major,
					Minor: minor,
					Rssi: obj.rssi,
					HealthText: !this.isIOS() ? healthEventAvailable ? 'Health' : '' : 'Health',
					MotionText: !this.isIOS() ? motionEventAvailable ? 'Motion' : '' : 'Motion',
					DoorStatus: doorStatus ? 'Open' : 'Close',
					ImageText: !this.isIOS() ? (pictureAvailable ? 'Image' : '') : 'Image',
					PictureText: !this.isIOS() ? (takePictureEnable ? 'Pic' : 'No Pic') : 'No Pic',
					StandByStatus: !this.isIOS() ? (standByControlStatus ? 'Standby' : '') : 'Standby'
				});
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
			this.notify("Scan was started successfully");
		} else {
			this.notify("Unexpected start scan status: " + obj.status);
		}
	},

	initializeBlutooth: function () {
		var bluetooth = this.getBluetooth();
		if (!bluetooth) {
			bluetooth = Ext.create('CoolerIoTMobile.widget.BlueToothLe', { itemId: 'coolerIotUploadActor' });
			this.attachEvents(bluetooth);
		}
		var tagStore = Ext.getStore('BleTag');
		tagStore.clearData();
		bluetooth.fireEvent('initializeBluetooth');
	},

	onInitializeSuccess: function (obj) {
		this.notify("onInitializeSuccess control " + JSON.stringify(obj));
		if (obj.status === "enabled") {
			this.nextStep();
		}
		else {
			Ext.Msg.alert(CoolerIoTMobile.Localization.FailedMessageTitle, obj.status);
			this.running = false;
		}
	},

	onScanCompleteSuccess: function () {
		console.log(Ext.getStore('BleTag').getData());
		this.nextStep();
	},

	isBitSet: function (advertisementByte, position) {
		return (advertisementByte & (1 << position)) != 0;
	},

	onInitializeError: function (obj) {
		this.running = false;
		if (obj.message === 'Bluetooth not enabled') {
			Ext.Msg.alert('Error', 'Bluetooth is not enabled');
		}
	},

	onConnected: function (obj) {
		this.notify('Connected');
		clearTimeout(this.connectTimeout);
	},

	onBleResponse: function (data) {
		var bluetooth = this.getBluetooth();
		var me = this;
		var bytes = data.value ? bluetoothle.encodedStringToBytes(data.value) : new Uint8Array(data);
		var command = bluetooth.getActiveCommand();

		if (command == CoolerIoTMobile.BleCommands.READ_AVAILABLE_UNREAD_EVENT) {
			if (this.getEventCount() == 0) {
				var eventCount = CoolerIoTMobile.util.Utility.readWord(bytes.subarray(1, 3));
				eventCount = isNaN(eventCount) ? 0 : eventCount;
				this.setEventCount(eventCount);
				this.notify('Event Counts - ' + eventCount);
				this.setDataResponseArray([]);
				this.setCurrentRecordId(0);
				if (eventCount === 0) {//If no event found then disconnect it.
					this.getBluetooth().fireEvent('disconnectDevice');
				}
				return;
			}
			else {
				this.getDataResponseArray().push.apply(this.getDataResponseArray(), bytes.subarray(0, 16));
				this.setCurrentRecordId(CoolerIoTMobile.util.Utility.readWord(bytes.subarray(1, 3)));
				if (this.getEventCount() == 1) {
					this.notify('Events downloaded');
					var eventdata = new Uint8Array(this.getDataResponseArray());
					this.saveEventData({ address: data.address, eventdata: eventdata });
				}
				else {
					this.setEventCount(this.getEventCount() - 1);
				}
			}
			return;
		}
		if (command === "0x8A") {
			if (this.resumeDownload) {
				this.resumeDownload = false;
				this.executeCommand(CoolerIoTMobile.BleCommands.MODIFY_LAST_READ_EVENT_INDEX, [this.getIndexToSet()]);
				return;
			}
			if (this.activeDevice.get('ImageText') == 'Image') {
				this.downloadImage();
			} else {
				this.executeCommand(CoolerIoTMobile.BleCommands.READ_AVAILABLE_UNREAD_EVENT);
			}
		}
		if (command === CoolerIoTMobile.BleCommands.READ_IMAGE_DATA) {
			if (this.getImageResponseCount() == 0) {
				var recordCount = CoolerIoTMobile.util.Utility.readWordReverse(bytes.subarray(1, 3));
				if (isNaN(recordCount) || recordCount == 0) {
					this.notify('No image found');
					this.executeCommand(CoolerIoTMobile.BleCommands.READ_AVAILABLE_UNREAD_EVENT);
					this.setImageResponseCount(0);
					this.setTotalImageBytes(0);
				} else {
					this.setImageResponseCount(recordCount);
					this.setTotalImageBytes(recordCount);
					this.setImageResponseArray([]);
				}
				return;
			}
			this.processImageResponse({ data: bytes, address: data.address });
			return;
		}
		if (command === CoolerIoTMobile.BleCommands.MODIFY_LAST_READ_EVENT_INDEX) {
			this.executeCommand(CoolerIoTMobile.BleCommands.READ_AVAILABLE_UNREAD_EVENT);
		}
		if (command === CoolerIoTMobile.BleCommands.ERASE_EVENT_DATA) {
			bluetooth.setActiveCommand(null);
			bluetooth.fireEvent('disconnectDevice');
		}
	},

	saveEventData: function (obj) {
		var me = this;
		this.setDataResponseArray([]);
		this.setEventCount(0);
		var query = Ext.util.Format.format("INSERT INTO DeviceData ( AssetId, MacAddress, RawData, Data) Values ({0},{1},{2},{3})", 0, "'" + obj.address + "'", "''", "x'" + CoolerIoTMobile.Util.bytesToHex(obj.eventdata) + "'");
		CoolerIoTMobile.Util.execute(query,
			[]).then(this.onDbInsertSuccess.bind(me), this.onDbInsertFailure.bind(me));
	},

	downloadImage: function () {
		this.notify('Downloading Image');
		this.executeCommand(CoolerIoTMobile.BleCommands.READ_IMAGE_DATA);
	},

	processImageResponse: function (obj) {
		var me = this;
		this.getImageResponseArray().push.apply(this.getImageResponseArray(), obj.data);
		if (this.getImageResponseCount() == 1) {
			this.notify('Saving image data');
			var imageData = this.getImageResponseArray();
			var query = Ext.util.Format.format("INSERT INTO [Image] (AssetId, MacAddress, Image) Values ({0},{1},{2})", 0, "'" + obj.address + "'", "x'" + CoolerIoTMobile.Util.bytesToHex(imageData) + "'");
			CoolerIoTMobile.Util.execute(query).then(me.onImageSave.bind(me), me.onImageSaveError.bind(me));
			this.setImageResponseArray([]);
			this.setImageResponseCount(0);
			this.setTotalImageBytes(0);
		}
		else {
			this.setImageResponseCount(this.getImageResponseCount() - 1);
		}
	},

	onImageSave: function () {
		this.notify('Image saved');
		this.executeCommand(CoolerIoTMobile.BleCommands.READ_AVAILABLE_UNREAD_EVENT);
	},

	onImageSaveError: function () {
		cosnole.log('Image save error');
		this.executeCommand(CoolerIoTMobile.BleCommands.READ_AVAILABLE_UNREAD_EVENT);
	},

	onDbInsertSuccess: function (res) {
		this.notify('Event data saved in local db');
		if (this.resumeDownload) {
			this.getBluetooth().fireEvent('connectWithPassword', this.activeDevice);
			return;
		}
		this.notify('Running command ERASE_EVENT_DATA');
		this.executeCommand(CoolerIoTMobile.BleCommands.ERASE_EVENT_DATA);
	},

	onDbInsertFailure: function (error) {
		this.notify('Error while save in db' + JSON.stringify(error))
		this.getBluetooth().fireEvent('disconnectDevice');
	},

	savePingData: function (scannedDevicesStore) {
		this.notify('Save ping data');
		var data = [], scannedDevices = this.getBleTagStore(), queryHolder = [], advertisementInfo = 0x00;
		for (var i = 0, len = scannedDevices.getCount() ; i < len; i++) {
			var record = scannedDevices.getAt(i);
			var macaddress = CoolerIoTMobile.Util.machexToBytes(record.get('MacAddress'));
			if (this.isIOS()) {
				var serial = record.get('DeviceName');
				serial = serial.substr(serial.length - 8, serial.length);
				macaddress = (parseInt(serial) + CoolerIoTMobile.Util.BaseSerialNumber).toString(16);
				macaddress = CoolerIoTMobile.Util.machexToBytes(macaddress);
			}
			data.push.apply(data, macaddress);
			if (!this.isIOS()) {
				var advertisementBytes = bluetoothle.encodedStringToBytes(record.get('Advertisement'));
				advertisementInfo = advertisementBytes[32 + (advertisementBytes[30]) + 3];
			}
			data.push.apply(data, [-record.get('Rssi') & 255, advertisementInfo]);
			data.push.apply(data, CoolerIoTMobile.Util.getUInt32(parseInt(new Date().getTime() / 1000)));//TO DO get this from blutoothle or while doing scanning
			data.push.apply(data, CoolerIoTMobile.Util.getUInt32(parseInt(new Date().getTime() / 1000)));//TO DO get this from blutoothle or while doing scanning
			data.push.apply(data, [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);//Added blank bytes for smart device firmware version as per new code;
		}
		var pingData = new Uint8Array(data);
		queryHolder.push("(x'" + CoolerIoTMobile.Util.bytesToHex(pingData) + "')");
		var me = this;
		return new Promise(function (resolve, reject) {
			me.notify('inserting ping');
			if (queryHolder.length > 0) {
				CoolerIoTMobile.Util.execute("INSERT INTO SmartDevicePing (Data) Values " + queryHolder.join(', '))
				.then(me.onPingSaveSuccess.bind(me, resolve), me.onPingSaveFailure.bind(me, reject));
			}
			else {
				resolve();
			}
		});
	},

	onPingSaveSuccess: function (resolve) {
		this.notify('Ping Saved')
		resolve();
	},

	onPingSaveFailure: function (reject) {
		this.notify('Error while saving ping')
		reject();
	},

	executeCommand: function (command, param) {
		var store = Ext.getStore('CommandData');
		store.removeAll();
		var bluetooth = this.getBluetooth();
		this.setCurrentCommand(command);
		bluetooth.fireEvent('writeDeviceCommand', command, param);
	},

	attachEvents: function (bluetooth) {
		bluetooth.on('initializeSuccess', this.onInitializeSuccess, this);
		bluetooth.on('startScanSuccess', this.onStartScanSuccess, this);
		bluetooth.on('scanCompleteSuccess', this.onScanCompleteSuccess, this);
		bluetooth.on('initializeError', this.onInitializeError, this);
		bluetooth.on('closeSuccess', this.onDeviceClose, this);
		bluetooth.on('bleresponse', this.onBleResponse, this);
		bluetooth.on('startDiscover', this.onConnected, this);
	},

	deattachEvents: function () {
		var bluetooth = this.getBluetooth();
		if (bluetooth) {
			bluetooth.un('initializeSuccess');
			bluetooth.un('initializeError');
			bluetooth.un('startScanSuccess');
			bluetooth.un('scanCompleteSuccess');
			bluetooth.un('closeSuccess');
			bluetooth.un('closeError');
			bluetooth.un('bleresponse');
		}
	},

	getBluetooth: function () {
		var ble = Ext.ComponentQuery.query('ble-bluetoothLe');
		if (ble.length > 0) {
			return ble[0];
		} else {
			return false;
		}
	},

	isNetworkAvailable: function () {
		return navigator.onLine;
	},

	getBleTagStore: function () {
		return Ext.getStore('BleTag');
	},

	isIOS: function () {
		return Ext.os.name.toLowerCase() === CoolerIoTMobile.Enums.DeviceType.Ios;
	},

	notify: function (message) {
		console.log(message);
		if (!this.logStore) {
			var dataView = Ext.ComponentQuery.query('#serviceLogDataView')[0];
			this.logStore = dataView.getStore();
			this.logsView = dataView;
		}

		if (typeof message === 'string') {
			this.logStore.add({ message: message });
			this.logsView.getScrollable().getScroller().scrollToEnd();
		}
	}
});