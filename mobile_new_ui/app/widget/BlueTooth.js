Ext.define('CoolerIoTMobile.widget.BlueTooth', {
	extend: 'Ext.Component',
	xtype: 'ble-bluetooth',
	config: {
		addressKey: "address",
		scanDuration: 10000,			
		manufactureUuid: "48F8C9EFAEF9482D987F3752F1C51DA1",
		serviceUuid: "81469e83-ef6f-42af-b1c6-f339dbdce2ea",
		characteristicUuid: "8146c203-ef6f-42af-b1c6-f339dbdce2ea",
		noitfyCharacteristicUuid: "8146c201-ef6f-42af-b1c6-f339dbdce2ea",		
		iOSPlatform: "iOS",
		androidPlatform: "Android",
        password: null,
		activeCommand: null,
	    activeDeviceAddress: null,
	    isConnected: false,
	    record: null,
	    responseCount: 0,
		listeners:{
			initializeBluetooth: 'onInitializeBluetooth',
			startScan: 'onStartScan',
			connectDevice: 'onConnectDevice',			
			disconnectDevice: 'onDisconnectDevice',			
			writeCommand: 'writeBleCommand',
            stopNotification: 'stopNotification',
			connectWithPassword: 'onConnectWithPassword'					
		}
	},
	onConnectWithPassword: function (deviceAddress, password, record) {
	    console.log("onConnectWithPassword : " + deviceAddress);	    
	    this.setIsConnected(false);        
	    this.setRecord(record);
	    this.setPassword(password);
	    ble.connect(deviceAddress, this.connectSuccess, this.connectError);
	},
	onDisconnectDevice: function () {
	    var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
	    var record = me.getRecord();
	    if (!record)
	    {
	        Ext.Msg.alert(CoolerIoTMobile.Localization.Error, CoolerIoTMobile.Localization.ConnectDeviceErrorMessage);
	        return;
	    }
	    ble.disconnect(record.get('MacAddress'), this.disconnectSuccess, this.disconnectError);
	},
	disconnectSuccess: function (obj) {
	    console.log("disconnectSuccess");
	    var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
	    me.fireEvent('disconnectSuccess', obj);
	    me.fireEvent('stopNotification');
	},
	disconnectError: function (error) {
	    console.log("disconnectError : " + error);
	    var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
	    me.fireEvent('disconnectError', error);
	},
	onInitializeBluetooth: function () {
		console.log('onInitializeBluetooth');
		//bluetoothle is an global object of third party    	
	    ble.isEnabled(this.initializeSuccess, this.initializeError);
	},
	initializeSuccess: function (obj) {
	    console.log("initializeSuccess");
    	var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
    	me.fireEvent('initializeSuccess', obj);
	},	
	onStartScan: function () {
	    console.log("onStartScan");
		var paramsObj = { /*"serviceUuids":[heartRateServiceUuid] */ };
		ble.scan([], (this.getScanDuration() / 1000), this.startScanSuccess, this.startScanError, paramsObj);
		Ext.Function.defer(this.scanTimeout, this.getScanDuration(), this);
	},
    initializeError: function (obj) {
    	var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
    	me.fireEvent('initializeError', obj);
		console.log("Initialize error: " + obj.error + " - " + obj.message);
    },   
    startScanSuccess: function (obj) {    	
    	var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
    	me.fireEvent('startScanSuccess', obj);    	
	},
    startScanError: function (obj) {
    	var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
    	me.fireEvent('startScanError', obj);
		console.log("Start scan error: " + obj.error + " - " + obj.message);
	},
	scanTimeout: function () {
		console.log("Scanning time out, stopping");
		var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
		me.fireEvent('scanCompleteSuccess');
	},
	stopNotification: function (obj) {
	    console.log("Stop Notification");
	    var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
	    if (!me.getActiveDeviceAddress())
	        return;
	    ble.stopNotification(me.getActiveDeviceAddress(), me.getServiceUuid(), me.getNoitfyCharacteristicUuid(), me.onStopNotifySuccess, me.onStopNotifyError);
	},
	onStopNotifyError: function (reason) {
	    console.log("Stop Notification error : " + reason);
	},
	onStopNotifySuccess: function(obj){
	    console.log("Stop Notification success : " + obj);
	},
	connectSuccess: function (obj) {
	    console.log("Connected initial");
	    var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
	    me.setIsConnected(false);
	    me.setActiveDeviceAddress(obj.id);
	    ble.startNotification(obj.id, me.getServiceUuid(), me.getNoitfyCharacteristicUuid(), me.onData, me.onError);        
	   
	    var password = CoolerIoTMobile.util.Utility.getPasswordBytes(me.getPassword());
	     
	    me.writeBleCommand(CoolerIoTMobile.BleCommands.SET_VALIDATE_PASSWORD, password);
	    
	},	
	writeBleCommand: function (command, param) {
	    var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
	    me.setActiveCommand(command);
	    me.setResponseCount(0);

	    console.log("Command write : " + command + " Param : " + param);

	    console.log("writeBleCommand : " + me.getResponseCount());
	    me.fireEvent('updatestatus', 'Writing command...', false);
	    var bytes = [];
	    bytes.push(command);

	    if (param) {
	        for (var i = 0; i < param.length; i++) {
	            bytes.push(param[i]);
	        }
	    }	    
	    console.log("Command Bytes : " + bytes + " Param : " + param);
	    var cmd = CoolerIoTMobile.util.Utility.bytesToEncodedString(bytes);
	    ble.write(me.getActiveDeviceAddress(), me.getServiceUuid(), me.getCharacteristicUuid(), cmd, me.writeSuccess, me.writeFailure);
	},
	writeSuccess: function(data){
	    console.log("Write success");
	    var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
	    me.fireEvent('updatestatus', 'Writing command completed...', true);
	    console.log(data);
	},
	writeFailure: function (reason) {
	    var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
	    me.fireEvent('updatestatus', 'Writing command completed...', true);
	    me.fireEvent('stopNotification');
	    console.log("WRITE ERROR: " + reason);
	},
	onData: function (data) {

	    var me = Ext.ComponentQuery.query('ble-bluetooth')[0];

	    var resCount = me.getResponseCount();
	    resCount++;

	    me.setResponseCount(resCount);
	    
	    console.log("notify success " + (resCount) + ": " + me.getActiveCommand());
	    console.log(new Uint8Array(data));

	    me.fireEvent('bleresponse', data);
	   
	},
	onError: function (reason) {
	    var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
	    me.fireEvent('stopNotification');
	    console.log("ERROR: " + reason); // real apps should use notification.alert
	},	
	connectError: function (reason) {
	    console.log("CONNECT ERROR: " + reason);
	    var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
	    me.fireEvent('stopNotification');
	    me.fireEvent('updatestatus', "CONNECT ERROR: " + reason, true);
		me.fireEvent('connectError', reason);
	}	
});
