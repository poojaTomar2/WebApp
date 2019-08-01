Cooler.SmartDeviceType = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Device: {0}',
		listTitle: 'Device Type',
		keyColumn: 'SmartDeviceTypeId',
		captionColumn: 'Name',
		controller: 'SmartDeviceType',
		securityModule: 'SmartDeviceType',
		comboTypes: ['SensorType'],
		saveAndNew: false,
		disableDelete: true,
		disableAdd: true,
		gridConfig: {
			custom: {
				loadComboTypes: true
			}
		},
		winConfig: {
			height: 180,
			width: 600
		}
	});
	Cooler.SmartDeviceType.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.SmartDeviceType, Cooler.Form, {
	listRecord: Ext.data.Record.create([
		{ name: 'SmartDeviceTypeId', type: 'int' },
		{ name: 'Name', type: 'string' },
		{ name: 'Manufacturer', type: 'string' },
		{ name: 'ManufacturerId', type: 'int' },
		{ name: 'HasCabinetHealth', type: 'bool' },
		{ name: 'HasPowerSensor', type: 'bool' },
		{ name: 'HasGPS', type: 'bool' },
		{ name: 'HasVision', type: 'bool' },
		{ name: 'IsGateway', type: 'bool' },
		{ name: 'HasSensorEnvironment', type: 'bool' },
		{ name: 'HasProximity', type: 'bool' },
		{ name: 'HasAlwaysConnected', type: 'bool' },
		{ name: 'HasiBeacon', type: 'bool' },
		{ name: 'HasEddystone', type: 'bool' },
		{ name: 'Reference', type: 'string' },
		{ name: 'SerialNumberPrefix', type: 'string' },
		{ name: 'HwMajor', type: 'int' },
		{ name: 'HwMinor', type: 'int' },
		{ name: 'LatestFirmware', type: 'float' },
		{ name: 'LatestSTMFirmware', type: 'float' },
		{ name: 'Notes', type: 'string' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedByUser', type: 'string' },
		{ name: 'MacAddressFrom', type: 'string' },
		{ name: 'MacAddressTo', type: 'string' },
		{ name: 'HasCompressorFanProbe', type: 'bool' },
        { name: 'HasEvaporatorFanProbe', type: 'bool' },
        { name: 'HasCompressorTempsensor', type: 'bool' },
        { name: 'HasEvaporatorTempsensor', type: 'bool' },
        { name: 'VoltageMeter', type: 'bool' },
		{ name: 'FirmwareFileName', type: 'string' },
		{ name: 'STMFirmwareFileName', type: 'string' },
	    { name: 'HEXFirmwareFileName', type: 'string' },
        { name: 'BINFirmwareFileName', type: 'string' },
		{ name: 'ZIPFirmwareFileName', type: 'string' }
	]),

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Id', dataIndex: 'SmartDeviceTypeId' },
			{ header: 'Device Name', dataIndex: 'Name' },
			{ header: 'Manufacturer', dataIndex: 'Manufacturer' },
			{ header: 'Has Cabinet Health', dataIndex: 'HasCabinetHealth', width: 120, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Has Power Sensor', dataIndex: 'HasPowerSensor', width: 120, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Has GPS', dataIndex: 'HasGPS', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Has Vision', dataIndex: 'HasVision', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Gateway', dataIndex: 'IsGateway', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Sensor Environment', dataIndex: 'HasSensorEnvironment', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Proximity Communication', dataIndex: 'HasProximity', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Always Connected', dataIndex: 'HasAlwaysConnected', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is iBeacon', dataIndex: 'HasiBeacon', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Eddystone', dataIndex: 'HasEddystone', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Reference', dataIndex: 'Reference', width: 120 },
			{ header: 'SR# Prefix', dataIndex: 'SerialNumberPrefix', width: 120 },
			{ header: 'Hardware Major', dataIndex: 'HwMajor', width: 80, align: 'right' },
			{ header: 'Hardware Minor', dataIndex: 'HwMinor', width: 80, align: 'right' },
			{ header: 'Latest Firmware', dataIndex: 'LatestFirmware', width: 80, align: 'right' },
			{ header: 'Latest STM Firmware', dataIndex: 'LatestSTMFirmware', width: 80, align: 'right' },
			{ header: 'Mac Address From', dataIndex: 'MacAddressFrom' },
			{ header: 'Mac Address To', dataIndex: 'MacAddressTo' },
			{ header: 'Notes', dataIndex: 'Notes', width: 250, renderer: ExtHelper.renderer.ToolTip() },
			{ header: 'Last Uploaded File', dataIndex: 'FirmwareFileName', width: 250 },
			{ header: 'Last Uploaded STM File', dataIndex: 'STMFirmwareFileName', width: 250 },
			{ header: 'Last Uploaded HEX File', dataIndex: 'HEXFirmwareFileName', width: 250 },
			{ header: 'Last Uploaded BIN File', dataIndex: 'BINFirmwareFileName', width: 250 },
			{ header: 'Last Uploaded ZIP File', dataIndex: 'ZIPFirmwareFileName', width: 250 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },
            { header: 'Has Compressor Fan Probe', width: 100, renderer: ExtHelper.renderer.Boolean, dataIndex: 'HasCompressorFanProbe' },
            { header: 'Has Evaporator Fan Probe', width: 100, renderer: ExtHelper.renderer.Boolean, dataIndex: 'HasEvaporatorFanProbe' },
            { header: 'Has Compressor Temp sensor', width: 100, dataIndex: 'HasCompressorTempsensor', renderer: ExtHelper.renderer.Boolean },
            { header: 'Has Evaporator Temp sensor', width: 100, dataIndex: 'HasEvaporatorTempsensor', renderer: ExtHelper.renderer.Boolean },
	        { header: 'Has Voltage Meter', width: 100, dataIndex: 'VoltageMeter', renderer: ExtHelper.renderer.Boolean }
		]);
		cm.defaultSortable = true;
		return cm;
	},

	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var tagsPanel = Cooler.Tag();
		this.tagsPanel = tagsPanel;
		var manufacturerCombo = DA.combo.create({ fieldLabel: 'Manufacturer', hiddenName: 'ManufacturerId', baseParams: { comboType: 'Manufacturer' }, width: 200, listWidth: 180, controller: "Combo", allowBlank: false, disabled: disableFieldsOnClientId });
		var latestSTMFirmware = new Ext.form.NumberField({ fieldLabel: 'Latest STM Firmware', name: 'LatestSTMFirmware', xtype: 'numberfield', maxLength: 50, allowBlank: false, minValue: 0, maxValue: 999 });
		this.latestSTMFirmware = latestSTMFirmware;
		var latestFirmware = new Ext.form.NumberField({ fieldLabel: 'Latest Firmware', name: 'LatestFirmware', xtype: 'numberfield', maxLength: 50, allowBlank: false, minValue: 0, maxValue: 999 });
		this.latestFirmware = latestFirmware;

		var downloadLink = new Ext.Button({ text: 'Download', handler: this.onDownloadFirmware, scope: this });
		config.tbar.push(downloadLink);
		this.downloadLink = downloadLink;

		var downloadLinkForFieldMappingJsonFile = new Ext.Button({ text: 'Download JSON', handler: this.onDownloadFieldMappingJsonFile, scope: this });
		config.tbar.push(downloadLinkForFieldMappingJsonFile);
		this.downloadLinkForFieldMappingJsonFile = downloadLinkForFieldMappingJsonFile;

		var uploadFileBin = new Ext.form.FileUploadField({
			fieldLabel: 'Select BIN File',
			width: 250,
			name: 'BINFileUploader',
			validator: function (v) {
				if (!/^.*\.(bin)$/i.test(v)) {
					return 'Please select valid file.';
				}
				return true;
			}
		});
		var uploadFileZip = new Ext.form.FileUploadField({
			fieldLabel: 'Select ZIP File',
			width: 250,
			name: 'ZIPFileUploader',
			validator: function (v) {
				if (!/^.*\.(zip)$/i.test(v)) {
					return 'Please select valid file.';
				}
				return true;
			}
		});
		var uploadFileHex = new Ext.form.FileUploadField({
			fieldLabel: 'Select HEX File',
			width: 250,
			name: 'HEXFileUploader',
			validator: function (v) {
				if (!/^.*\.(hex)$/i.test(v)) {
					return 'Please select valid file.';
				}
				return true;
			}
		});
		var uploadSTMFile = new Ext.form.FileUploadField({
			fieldLabel: 'Select STM File',
			width: 250,
			name: 'STMFileUploader',
			validator: function (v) {
				if (!/^.*\.(hex|zip|bin)$/i.test(v)) {
					return 'Please select valid file.';
				}
				return true;
			}
		});

		var uploadJSONFile = new Ext.form.FileUploadField({
			fieldLabel: 'Select JSON File',
			width: 250,
			name: 'JSONFileUploader',
			validator: function (v) {
				if (!/^.*\.(json)$/i.test(v)) {
					return 'Please select valid file.';
				}
				return true;
			}
		});

		this.uploadSTMFile = uploadSTMFile;
		this.uploadFileBin = uploadFileBin;
		this.uploadFileZip = uploadFileZip;
		this.uploadFileHex = uploadFileHex;
		this.uploadJSONFile = uploadJSONFile;
		//this.fileTypeArray = fileTypeArray;

		var Column1 = {
			columnWidth: .5,
			labelWidth: 150,
			defaults: {
				width: 130
			},

			items: [
				{ fieldLabel: 'Device Name', name: 'Name', xtype: 'textfield', maxLength: 50, allowBlank: false },
				manufacturerCombo,
				{ xtype: 'checkbox', fieldLabel: 'Is Gateway', name: 'IsGateway', hiddenName: 'IsGateway' },
				{ xtype: 'checkbox', fieldLabel: 'Has Cabinet Health', name: 'HasCabinetHealth', hiddenName: 'HasCabinetHealth' },
				{ xtype: 'checkbox', fieldLabel: 'Has Power Sensor', name: 'HasPowerSensor', hiddenName: 'HasPowerSensor' },
				{ xtype: 'checkbox', fieldLabel: 'Has GPS', name: 'HasGPS', hiddenName: 'HasGPS' },
				{ xtype: 'checkbox', fieldLabel: 'Has Vision', name: 'HasVision', hiddenName: 'HasVision' },

				{ xtype: 'checkbox', fieldLabel: 'Is Sensor Environment', name: 'HasSensorEnvironment', hiddenName: 'HasSensorEnvironment' },
				{ xtype: 'checkbox', fieldLabel: 'Is Proximity Communication', name: 'HasProximity', hiddenName: 'HasProximity' },
				{ xtype: 'checkbox', fieldLabel: 'Is Always Connected', name: 'HasAlwaysConnected', hiddenName: 'HasAlwaysConnected' },
				{ xtype: 'checkbox', fieldLabel: 'Is iBeacon', name: 'HasiBeacon', hiddenName: 'HasiBeacon' },
				{ xtype: 'checkbox', fieldLabel: 'Is Eddystone', name: 'HasEddystone', hiddenName: 'HasEddystone' },

				{ xtype: 'checkbox', fieldLabel: 'Has Compressor Fan Probe', name: 'HasCompressorFanProbe', hiddenName: 'HasCompressorFanProbe' },
				{ xtype: 'checkbox', fieldLabel: 'Has Evaporator Fan Probe', name: 'HasEvaporatorFanProbe', hiddenName: 'HasEvaporatorFanProbe' },
				{ xtype: 'checkbox', fieldLabel: 'Has Compressor Temp sensor', name: 'HasCompressorTempsensor', hiddenName: 'HasCompressorTempsensor' },
				{ xtype: 'checkbox', fieldLabel: 'Has Evaporator Temp sensor', name: 'HasEvaporatorTempsensor', hiddenName: 'HasEvaporatorTempsensor' },
				{ xtype: 'checkbox', fieldLabel: 'Has Voltage Meter', name: 'VoltageMeter', hiddenName: 'VoltageMeter' }
			]
		};
		var Column2 = {
			columnWidth: .5,
			labelWidth: 140,
			defaults: {
				width: 160
			},
			items: [
				tagsPanel,
				{ fieldLabel: 'Reference', name: 'Reference', xtype: 'textfield', maxLength: 50, allowBlank: false },
				{ fieldLabel: 'SR# Prefix', name: 'SerialNumberPrefix', xtype: 'textfield', maxLength: 50, allowBlank: false },
				{ fieldLabel: 'Hardware Major', name: 'HwMajor', xtype: 'numberfield', maxLength: 50, allowBlank: false, minValue: 0, allowDecimals: false, maxLength: 2 },
				{ fieldLabel: 'Hardware Minor', name: 'HwMinor', xtype: 'numberfield', maxLength: 50, allowBlank: false, minValue: 0, allowDecimals: false, maxLength: 2 },
				latestFirmware,
				latestSTMFirmware,
				{ fieldLabel: 'Mac Address From', name: 'MacAddressFrom', xtype: 'textfield', maxLength: 20, allowBlank: false },
				{ fieldLabel: 'Mac Address To', name: 'MacAddressTo', xtype: 'textfield', maxLength: 20, allowBlank: false },
				{ fieldLabel: 'Notes', name: 'Notes', xtype: 'textarea', },
				this.uploadFileBin,
				this.uploadFileZip,
				this.uploadFileHex,
				this.uploadSTMFile,
				this.uploadJSONFile,
			]
		};

		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', defaultType: 'textfield', border: false }, //{ width: 150 },
			border: false,
			items: [Column1, Column2],
			fileUpload: true
		});
		return config;
	},

	CreateFormPanel: function (config) {
		var sensorTypeGrid = Cooler.SmartDeviceSensorType.createGrid({
			title: 'Sensor Types', height: 360, region: 'center',
			editable: true, root: 'SmartDeviceSensorType', allowPaging: false,
			plugins: [new Ext.ux.ComboLoader()]
		}, true);
		var grids = [];
		grids.push(sensorTypeGrid);
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			layoutOnTabChange: true,
			defaults: {
				layout: 'fit',
				border: false
			},
			items: [
				sensorTypeGrid
			]
		});
		this.childGrids = grids;
		this.childModules = [Cooler.SmartDeviceSensorType];
		config.region = 'north';
		config.height = 440;
		this.formPanel = new Ext.FormPanel(config);

		this.on('beforeSave', function (smartDeviceTypeForm, params, options) {
			var form = smartDeviceTypeForm.formPanel.getForm();
			var macAddressFrom = form.findField('MacAddressFrom').getValue();
			var macAddressTo = form.findField('MacAddressTo').getValue();
			if (form.findField('BINFileUploader').fileInput.dom.files.length > 0) {
				var fileSize = form.findField('BINFileUploader').fileInput.dom.files[0].size;
				if (fileSize > 500000) {
					Ext.Msg.alert('Upload File Size', 'More than 0.5 MB file size not supported.');
					return false;
				}
			}
			if (form.findField('ZIPFileUploader').fileInput.dom.files.length > 0) {
				var fileSize = form.findField('ZIPFileUploader').fileInput.dom.files[0].size;
				if (fileSize > 500000) {
					Ext.Msg.alert('Upload File Size', 'More than 0.5 MB file size not supported.');
					return false;
				}
			}
			if (form.findField('HEXFileUploader').fileInput.dom.files.length > 0) {
				var fileSize = form.findField('HEXFileUploader').fileInput.dom.files[0].size;
				if (fileSize > 500000) {
					Ext.Msg.alert('Upload File Size', 'More than 0.5 MB file size not supported.');
					return false;
				}
			}
			if (form.findField('STMFileUploader').fileInput.dom.files.length > 0) {
				var fileSize = form.findField('STMFileUploader').fileInput.dom.files[0].size;
				if (fileSize > 500000) {
					Ext.Msg.alert('Upload File Size', 'More than 0.5 MB file size not supported.');
					return false;
				}
			}
			if (!Cooler.MacAdddressRegExp.test(macAddressFrom) || !Cooler.MacAdddressRegExp.test(macAddressTo)) {
				Ext.Msg.alert('Mac Address From / To', 'Please enter mac address in correct format.');
				return false;
			}
			this.saveTags(this.tagsPanel, params);
		}, this);
		this.on('beforeLoad', function (param) {
			this.tagsPanel.removeAllItems();
		});
		this.on('dataLoaded', function (locationForm, data) {
			if (data.data.FieldMappingJsonFileName != '' && data.data.FieldMappingJsonFileName != undefined) {
				this.downloadLinkForFieldMappingJsonFile.setDisabled(false);
			}
			else {
				this.downloadLinkForFieldMappingJsonFile.setDisabled(true);
			}
			if (data.data.FirmwareFileName != '' && data.data.FirmwareFileName != undefined) {
				this.downloadLink.setDisabled(false);
			}
			else {
				this.downloadLink.setDisabled(true);
			}
			this.loadTags(this.tagsPanel, data);
			var Smart_DeviceType = data.data.Id;
			this.uploadJSONFile.setFieldVisible(false);
			switch (Smart_DeviceType) {
				case Cooler.Enums.SmartDeviceType.SmartVisionV6R2:
				case Cooler.Enums.SmartDeviceType.SmartVisionV7R1:
				case Cooler.Enums.SmartDeviceType.SollatekJEA:
				case Cooler.Enums.SmartDeviceType.SollatekFFX:
					this.latestFirmware.setDisabled(false);
					this.latestSTMFirmware.setFieldVisible(true);
					this.uploadSTMFile.setFieldVisible(true);
					break;

				case Cooler.Enums.SmartDeviceType.VirtualHub:
				case Cooler.Enums.SmartDeviceType.SmartCore:
				case Cooler.Enums.SmartDeviceType.BluVisioniBeek:
				case Cooler.Enums.SmartDeviceType.LoRaTagV3r3:
				case Cooler.Enums.SmartDeviceType.Wellington:
				case Cooler.Enums.SmartDeviceType.SollatekGMC0:
				case Cooler.Enums.SmartDeviceType.SollatekFFM2:
				case Cooler.Enums.SmartDeviceType.SollatekFFM2BB:
					this.latestFirmware.setDisabled(false);
					this.latestSTMFirmware.setFieldVisible(false);
					this.uploadSTMFile.setFieldVisible(false);
					break;

				case Cooler.Enums.SmartDeviceType.SmartVisionV5R1:
					this.latestFirmware.setDisabled(false);
					this.latestSTMFirmware.setFieldVisible(true);
					this.uploadSTMFile.setFieldVisible(true);
					break;

				case Cooler.Enums.SmartDeviceType.SmartTagV2R1:
				case Cooler.Enums.SmartDeviceType.SmartVisionV2R1:
				case Cooler.Enums.SmartDeviceType.SmartHub:
				case Cooler.Enums.SmartDeviceType.SmartTagV3R3:
				case Cooler.Enums.SmartDeviceType.SmartTagV3R1:
				case Cooler.Enums.SmartDeviceType.ST1031:
				case Cooler.Enums.SmartDeviceType.SmartBeaconMINEW:
					this.latestFirmware.setDisabled(false);
					this.latestSTMFirmware.setFieldVisible(false);
					this.uploadSTMFile.setFieldVisible(false);
					break;

				case Cooler.Enums.SmartDeviceType.SmartTag2ndGeneration:
				case Cooler.Enums.SmartDeviceType.SmartBeaconV1R1:
				case Cooler.Enums.SmartDeviceType.ImberaHub:
					this.latestFirmware.setDisabled(false);
					this.latestSTMFirmware.setFieldVisible(false);
					this.uploadSTMFile.setFieldVisible(false);
					break;

				case Cooler.Enums.SmartDeviceType.ImberaCMD:
					this.uploadJSONFile.setFieldVisible(true);
					this.latestFirmware.setDisabled(false);
					this.latestSTMFirmware.setFieldVisible(false);
					this.uploadSTMFile.setFieldVisible(false);

				default:
					this.latestFirmware.setDisabled(false);
					this.latestSTMFirmware.setFieldVisible(false);
					this.uploadSTMFile.setFieldVisible(false);
					break;
			}
		});

		this.sensorTypeGrid = sensorTypeGrid;
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			defaults: {
				border: false
			},
			width: 805,
			height: 600,
			items: [this.formPanel, tabPanel]
		});
	},

	onDownloadFirmware: function () {
		var id = this.activeRecordId;
		window.open(EH.BuildUrl(this.controller) + '?action=other&otherAction=downloadFirmware&id=' + id);
	},

	onDownloadFieldMappingJsonFile: function () {
		var id = this.activeRecordId;
		window.open(EH.BuildUrl(this.controller) + '?action=other&otherAction=downloadFieldMappingJsonFile&id=' + id);
	}
});
Cooler.SmartDeviceType = new Cooler.SmartDeviceType();
