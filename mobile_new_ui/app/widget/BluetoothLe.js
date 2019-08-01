Ext.define('CoolerIoTMobile.widget.BlueToothLe', {
	extend: 'Ext.Component',
	xtype: 'ble-bluetoothLe',
	config: {
		addressKey: "address",
		scanDuration: 20000,
		connectTimer: null,
		reconnectTimer: null,
		manufactureUuid: "48F8C9EFAEF9482D987F3752F1C51DA1",
		serviceUuid: "81469e83-ef6f-42af-b1c6-f339dbdce2ea",
		characteristicUuid: "8146c203-ef6f-42af-b1c6-f339dbdce2ea",
		noitfyCharacteristicUuid: "8146c201-ef6f-42af-b1c6-f339dbdce2ea",
		bleCharacteristicUuid: "8146c201-ef6f-42af-b1c6-f339dbdce2ea",
		batteryServiceUuid: "0x180F",
		batteryLevelCharacteristicUuid: "0x2A19",
		iOSPlatform: "iOS",
		androidPlatform: "Android",
		inputParams: null,
		discoveredData: null,
		isConnected: false,
		command: null,
		responseCount: null,
		totalRecords: 0,
		listData: null,
		selectedRecord: null,
		activeCommand: null,
		responseCount: 0,
		activeDeviceAddress: null,
		activeDeviceName: null,
		listeners: {
			initializeBluetooth: 'onInitializeBluetooth',
			startScan: 'onStartScan',
			connectDevice: 'onConnectDevice',
			startDiscover: 'onStartDiscover',
			readData: 'onReadData',
			disconnectDevice: 'onDisconnectDevice',
			closeDevice: 'onCloseDevice',
			writeData: 'onWriteData',
			connectWithPassword: 'onConnectWithPassword',
			writeDeviceCommand: 'writeBleutothCommand',
			stopScan: 'onStopScan'
		}
	},
	connectDevice: function (record) {
		var deviceAddress = record.get('MacAddress');
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.setActiveDeviceAddress(deviceAddress);
		me.setActiveDeviceName(record.get('DeviceName'));
		me.setIsConnected(false);
		me.fireEvent('connectDevice', deviceAddress);
	},

	onConnectWithPassword: function (record) {
		var deviceAddress = record.get('MacAddress');
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		bluetoothle.isConnected(function (obj) {
			if (!obj.isConnected) {
				me.connectDevice(record);
				return;
			}
			me.setIsConnected(true);
			me.fireEvent('connected');
		}, function (obj) {
			console.log(obj);
			me.connectDevice(record);
		}, { address: deviceAddress });
	},

	onInitializeBluetooth: function (forcePermission) {
		var paramsObj = paramsInitialize = {
			"request": true,
			"statusReceiver": true
		};
		
		bluetoothle.initialize(this.initializeSuccess, paramsObj);
	},
	initializeSuccess: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('initializeSuccess', obj);
		console.log("Initialize success: " + JSON.stringify(obj));
	},
	onStartScan: function () {
		var paramsObj = { /*"serviceUuids":[heartRateServiceUuid] */ };
		bluetoothle.startScan(this.startScanSuccess, this.startScanError, paramsObj);
		Ext.Function.defer(this.scanTimeout, this.getScanDuration(), this);
		console.log("onStartScan");
	},
	initializeError: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('initializeError', obj);
		console.log("Initialize error: " + obj.error + " - " + obj.message);
	},
	startScanSuccess: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('startScanSuccess', obj);
		console.log("startScanSuccess: " + JSON.stringify(obj));
	},

	startScanError: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('startScanError', obj);
		console.log("Start scan error: " + obj.error + " - " + obj.message);
	},

	scanTimeout: function () {
		window.plugins.toast.show('Scanning time out, stopping', 'short', 'bottom');
		CoolerIoTMobile.util.Utility.logDeviceInfo('DashBoard Activity', 'Scanning time out');
		bluetoothle.stopScan(this.scanCompleteSuccess, this.scanCompleteError);
	},

	scanCompleteSuccess: function (obj) {
		if (obj.status === "scanStopped") {
			console.log("Scan was stopped successfully");
		} else {
			console.log("Unexpected stop scan status: " + obj.status);
		}

		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('scanCompleteSuccess', obj);

	},
	onStopScan: function () {
		bluetoothle.stopScan(this.scanCompleteSuccess, this.scanCompleteError);
	},
	scanCompleteError: function (obj) {
		console.log("Stop scan error: " + obj.error + " - " + obj.message);
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('scanCompleteError', obj);

	},
	onConnectDevice: function (address) {
		this.setActiveDeviceAddress(address);
		window.plugins.toast.show('Begining connection to ' + address, 'short', 'bottom');
		CoolerIoTMobile.util.Utility.logDeviceInfo('DashBoard Activity', 'Begining connection to ' + address);
		var paramsObj = { "address": address };
		bluetoothle.connect(this.connectSuccess, this.connectError, paramsObj);
	},
	connectSuccess: function (obj) {
		if (obj.status == "connected") {
			window.plugins.toast.show('Connected to ' + obj.address, 'short', 'bottom');
			CoolerIoTMobile.util.Utility.logDeviceInfo('DashBoard Activity', 'Connected to ' + obj.address);
			var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
			me.setAddressKey(obj.address);
			me.setIsConnected(true);
			me.fireEvent('startDiscover');
			var connectionStatusIcon = Ext.ComponentQuery.query('#connectionStateBtn')[0];
			if (connectionStatusIcon) {
				connectionStatusIcon.setIcon('resources/icons/wifi-connected.png');
			}
		}
		else if (obj.status == "connecting") {
			var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
			window.plugins.toast.show("Connecting to : " + obj.name + "", 'short', 'bottom');
		}
		else {
			console.log("Unexpected connect status: " + obj.status);
			var connectionStatusIcon = Ext.ComponentQuery.query('#connectionStateBtn')[0];
			if (connectionStatusIcon) {
				connectionStatusIcon.setIcon('resources/icons/no-wifi.png');
			}
			var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
			if (me.getActiveDeviceAddress() != null) {
				me.fireEvent('disconnectDevice');
			}
		}
	},
	validatePassword: function () {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.setActiveCommand("0x8A");
		var password = bluetoothle.stringToBytes("ins!gm@?");
		var passwordCommand = CoolerIoTMobile.util.Utility.bytesToEncodedString([138, 105, 110, 115, 33, 103, 109, 64, 63, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		me.fireEvent('writeData', passwordCommand);
	},
	connectError: function (obj) {
		window.plugins.toast.show('Connect error: ' + obj.message, 'short', 'bottom')
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		var connectionStatusIcon = Ext.ComponentQuery.query('#connectionStateBtn')[0];
		if (connectionStatusIcon) {
			connectionStatusIcon.setIcon('resources/icons/no-wifi.png');
		}
		if (me.getActiveDeviceAddress() != null) {
			me.fireEvent('disconnectDevice');
		}
		me.setIsConnected(false);
	},
	onStartDiscover: function (input) {
		console.log("Discover start");
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		var paramsObj = { address: me.getAddressKey() };
		this.setInputParams(paramsObj);
		var scanningDevicePanel = Ext.ComponentQuery.query('scanningDevicePanel')[0];
		if (scanningDevicePanel) {
			scanningDevicePanel.hide();
		}
		bluetoothle.discover(this.discoverSuccess, this.discoverError, paramsObj);

		/*if (Ext.os.name.toLowerCase() == "ios") {//discover functionality works different in ios and android as per documentation https://github.com/randdusing/BluetoothLE/tree/c8af36b.			
			paramsObj.services = [me.getServiceUuid()];
			bluetoothle.services(this.servicesSuccess, this.servicesError, paramsObj);
		}
		else {
			bluetoothle.discover(this.discoverSuccess, this.discoverError, paramsObj);
		}*/
	},
	servicesSuccess: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];

		console.log("serviceDiscoverSuccess : " + JSON.stringify(obj));
		var paramsObj = { address: obj.address, service: obj.services[0], characteristics: ["8146c203-ef6f-42af-b1c6-f339dbdce2ea", "8146c201-ef6f-42af-b1c6-f339dbdce2ea"] };
		console.log(paramsObj);
		bluetoothle.characteristics(me.characteristicsSuccess, me.characteristicsError, paramsObj);
	},
	servicesError: function (obj) {
		console.log("serviceDiscoverError : " + JSON.stringify(obj));
	},
	characteristicsSuccess: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		console.log("characteristicsDiscoverSuccess : " + JSON.stringify(obj));
		var paramsObj = { address: obj.address, service: obj.service, characteristic: obj.characteristics[1].uuid };
		console.log("Discriptor params: " + JSON.stringify(paramsObj));

		bluetoothle.descriptors(function (obj) {
			var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
			console.log("descriptorsDiscoverSuccess : " + JSON.stringify(obj));
			var paramsObj = {
				"address": obj.address,
				"service": me.getServiceUuid(),
				"characteristic": me.getNoitfyCharacteristicUuid(),
				"isNotification": true
			};
			bluetoothle.subscribe(function (obj) {
				var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
				if (obj.status == "subscribed") {
					console.log("subscribed");
				}
			}, function (obj) {
			}, paramsObj);
		}, function (obj) {
		}, paramsObj);
		paramsObj.characteristic = obj.characteristics[0].uuid;
		bluetoothle.descriptors(me.descriptorsSuccess, me.descriptorsError, paramsObj);
	},
	characteristicsError: function (obj) {
		console.log("characteristicsDiscoverError : " + JSON.stringify(obj));
	},
	descriptorsSuccess: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		console.log("descriptorsDiscoverSuccess : " + JSON.stringify(obj));
		var paramsObj = {
			"address": obj.address,
			"service": me.getServiceUuid(),
			"characteristic": me.getNoitfyCharacteristicUuid(),
			"isNotification": true
		};
		console.log("subscribtion param values : " + JSON.stringify(paramsObj));
		bluetoothle.subscribe(me.subscribeSuccess, me.subscribeError, paramsObj);
	},
	descriptorsError: function (obj) {
		console.log("descriptorsDiscoverError : " + JSON.stringify(obj));
	},
	discoverSuccess: function (obj) {
		console.log("discoverSuccess : " + JSON.stringify(obj));
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		if (obj.status == "discovered") {
			_discoverSuccess = obj;
			console.log("discovered: " + JSON.stringify(obj));

			var paramsObj = {
				"address": obj.address,
				"service": me.getServiceUuid(),
				"characteristic": me.getNoitfyCharacteristicUuid(),
				"isNotification": true
			};
			console.log("subscribtion param values : " + JSON.stringify(paramsObj));
			bluetoothle.subscribe(me.subscribeSuccess, me.subscribeError, paramsObj);
			me.setDiscoveredData(obj);
		}
		else {
			console.log("Unexpected discover status: " + obj.status);
			me.fireEvent('disconnectDevice', obj);
		}
	},

	discoverError: function (obj) {
		console.log("Discover error: " + obj.error + " - " + obj.message);
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('discoverError', obj);
	},

	writeBleutothCommand: function (command, param) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.setActiveCommand(command);
		me.setResponseCount(0);
		console.log("Command write : " + command + " Param : " + param);
		console.log("writeBluetoothCommand : " + me.getResponseCount());
		var bytes = [];
		bytes.push(command);

		if (param) {
			for (var i = 0; i < param.length; i++) {
				bytes.push(param[i]);
			}
		}
		console.log("Command Bytes : " + bytes + " Param : " + param);
		var cmd = CoolerIoTMobile.util.Utility.bytesToEncodedString(bytes);
		me.onWriteData(cmd);
	},

	onWriteData: function (param) {
		console.log("onWriteData: " + JSON.stringify(param));
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		var paramsObj = { "address": me.getAddressKey(), "service": me.getServiceUuid(), "characteristic": me.getCharacteristicUuid(), "value": param };
		bluetoothle.write(me.writeSuccess, me.writeError, paramsObj);
	},

	writeSuccess: function (obj) {
		if (obj.status == "written") {
			var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
			me.fireEvent('readData');
		}
		else {
			console.log("Write unknown error: " + obj.value + " Status:" + obj.status);
		}

	},

	writeError: function (obj) {
		console.log("Write error: " + JSON.stringify(obj));
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('writeError', obj);
	},

	onReadData: function (serviceUuid, characteristicUuid, descriptorUuid) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		var paramsObj = { "service": serviceUuid, "characteristic": characteristicUuid, address: me.getAddressKey() };
		bluetoothle.read(this.readSuccess, this.readError, paramsObj);
	},

	readSuccess: function (obj) {
		console.log("readSuccess:" + obj.status);
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];

		if (obj.status == "read") {
			_readSuccess = obj;
			var bytes = bluetoothle.encodedStringToBytes(obj.value);
			if (bytes[0] == 1 && me.getActiveCommand() === "0x8A") {
				me.setIsConnected(true);
				me.fireEvent('connected');
				return;
			}
			me.setActiveCommand(null);
			console.log("Read data: " + bytes);
			me.fireEvent('readSuccess', obj);
			bluetoothle.subscribe(me.subscribeSuccess, me.subscribeError);

		}
		else {
			console.log("Unexpected read status: " + obj.status);
			me.fireEvent('disconnectDevice');
		}
	},

	readError: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('readError', obj);
		console.log("Read error: " + obj.error + " - " + obj.message);
	},
	subscribeSuccess: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('bleresponse', obj);
		if (obj.status == "subscribed") {
			console.log("subscribed");
			me.validatePassword();
		}
	},
	subscribeError: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
	},
	characteristicsHeartSuccess: function (obj) {
		_characteristicsHeartSuccess = obj;
		console.log("Heart characteristics found, now discovering descriptor");
	},
	characteristicsHeartError: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('disconnectDevice');
	},
	onDisconnectDevice: function () {
		var paramsObj = { "address": this.getActiveDeviceAddress() }
		bluetoothle.disconnect(this.disconnectSuccess, this.disconnectError, paramsObj);
	},
	disconnectSuccess: function (obj) {
		if (obj.status == "disconnected") {
			var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
			me.setIsConnected(false);
			me.setAddressKey(null);
			me.fireEvent('closeDevice');
			window.plugins.toast.show("Disconneted", 'short', 'bottom');
			CoolerIoTMobile.util.Utility.logDeviceInfo('DashBoard Activity', 'Disconneted');
		}
		else if (obj.status == "disconnecting") {
			window.plugins.toast.show("Disconnecting device", 'short', 'bottom');
		}
		else {
			window.plugins.toast.show("Unexpected disconnect status", 'short', 'bottom');
		}
	},
	disconnectError: function (obj) {
		console.log("Disconnect error: " + JSON.stringify(obj));
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('closeDevice');
	},
	onCloseDevice: function () {
		var paramsObj = { "address": this.getActiveDeviceAddress() };
		bluetoothle.close(this.closeSuccess, this.closeError, paramsObj);
	},
	closeSuccess: function (obj) {
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		if (obj.status == "closed") {
			console.log("Closed device - " + obj.name);
			var connectionStatusIcon = Ext.ComponentQuery.query('#connectionStateBtn')[0];
			if (connectionStatusIcon) {
				connectionStatusIcon.setIcon('resources/icons/no-wifi.png');
				me.setIsConnected(false);
				me.setAddressKey(null);
			}
			me.fireEvent('closeSuccess');
		}
		else {
			console.log("Unexpected close status: " + obj.status);
		}

	},
	closeError: function (obj) {
		console.log("Close error: " + obj.error + " - " + obj.message);
		var me = Ext.ComponentQuery.query('ble-bluetoothLe')[0];
		me.fireEvent('closeError');
	}
});
