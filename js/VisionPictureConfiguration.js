Cooler.VisionPictureConfiguration = new Cooler.Form({
	keyColumn: 'VisionPictureConfigurationId',
	captionColumn: 'VisionPictureConfigurationId',
	controller: 'VisionPictureConfiguration',
	title: 'Vision Picture Configuration',
	securityModule: 'VisionPictureConfiguration',
	comboTypes: [
		'Client',
		'Country',
	],
	gridConfig: {
		custom: {
			loadComboTypes: true
		}
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
	},
	hybridConfig: function () {

		return [
			{ dataIndex: 'VisionPictureConfigurationId', type: 'int' },
			{ header: 'Device Type', dataIndex: 'SmartDeviceType', type: 'string', width: 200 },
			{ header: 'Cooler Iot Client', dataIndex: 'Client', type: 'string', width: 200 },
			{ header: 'Country', dataIndex: 'Country', width: 100, type: 'string' },
			//{ header: 'Country', dataIndex: 'CountryId', width: 100, type: 'int', displayIndex: 'Country', store: this.comboStores.Country, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Country }) },
			{ header: 'VisionPictureConfig', dataIndex: 'VisionPictureConfig', type: 'string', width: 250 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', convert: Ext.ux.DateLocalizer, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', convert: Ext.ux.DateLocalizer, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		];
	},

	createForm: function (config) {
		var me = this;
		var VisionPictureConfig = new Ext.form.Hidden({ name: 'VisionPictureConfig' }),
			clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', name: 'ClientId', allowBlank: false, displayIndex: 'Client', hiddenName: 'ClientId', store: Cooler.comboStores.Client, mode: 'local', width: 220 }),
			//countryCombo = DA.combo.create({ fieldLabel: 'Country', name: 'CountryId', allowBlank: false, displayIndex: 'Country', hiddenName: 'CountryId', store: Cooler.comboStores.Country, mode: 'local', width: 220, listWidth: 220 }),
			countryCombo = DA.combo.create({ fieldLabel: 'Country', itemId: 'CountryCombo', name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', listWidth: 250, baseParams: { comboType: 'Country' }, allowBlank: false }),
			deviceTypeCombo = DA.combo.create({
				fieldLabel: 'Device Type', name: 'SmartDeviceTypeId', hiddenName: 'SmartDeviceTypeId', allowBlank: false, baseParams: { comboType: 'VisionSmartDeviceTypeConfiguration', isGateway: false }, controller: "combo"
			});
		this.clientCombo = clientCombo;
		this.countryCombo = countryCombo;
		this.deviceTypeCombo = deviceTypeCombo;
		var dateFieldImageTime1 = new Ext.ux.form.DateTime({ fieldLabel: 'Image Time1', name: 'DateFieldImageTime1', width: 200 });
		var dateFieldImageTime2 = new Ext.ux.form.DateTime({ fieldLabel: 'Image Time2', name: 'DateFieldImageTime2', width: 200 });
		var dateFieldImageTime3 = new Ext.ux.form.DateTime({ fieldLabel: 'Image Time3', name: 'DateFieldImageTime3', width: 200 });

		var FieldImageTime1 = new Ext.form.TimeField({ fieldLabel: 'Image Time1', format: 'h:i A', listWidth: 200, width: 180, name: 'ImageTime1' });
		var FieldImageTime2 = new Ext.form.TimeField({ fieldLabel: 'Image Time2', format: 'h:i A', listWidth: 200, width: 180, name: 'ImageTime2' });
		var FieldImageTime3 = new Ext.form.TimeField({ fieldLabel: 'Image Time3', format: 'h:i A', listWidth: 200, width: 180, name: 'ImageTime3' });
		var imageCaptureModeOptionStore = [[0, 'Door Open'], [1, 'Time'], [2, 'Day & Time']];
		var imageOptionCombo = DA.combo.create({ fieldLabel: 'Image Enable Option', defaultvalue: 2, allowBlank: false, name: 'ImageEnableOption', store: imageCaptureModeOptionStore, width: 198 });
		this.imageOptionCombo = imageOptionCombo;
		//var DateTimeFieldDoorCount = new Ext.form.NumberField({ fieldLabel: 'Image Capture/Time Slot', name: 'DateTimeFieldDoorCount', minValue: 1, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0, width: 198 });
		var ImageCaptureDateTimeSlot = new Ext.form.NumberField({ fieldLabel: 'Image Capture/Time Slot', name: 'ImageCaptureDateTimeSlot', minValue: 1, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0, width: 198 });
		//var TimeFieldDoorCount = new Ext.form.NumberField({ fieldLabel: 'Image Capture/Time Slot', name: 'TimeFieldDoorCount', minValue: 1, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0, width: 198 });
		var ImageCaptureTimeSlot = new Ext.form.NumberField({ fieldLabel: 'Image Capture/Time Slot', name: 'ImageCaptureTimeSlot', minValue: 1, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0, width: 198 });
		var DoorOpenCount = new Ext.form.NumberField({ fieldLabel: 'Door Open Count', name: 'DoorOpenCount', minValue: 1, maxValue: 255,  xtype: 'numberfield', decimalPrecision: 0, width: 198 });
		var commandPanel = new Ext.Panel({
			layout: 'form',
			bodyStyle: "padding:10px;",
			defaults: { width: 200 },
			autoScroll: true,

			items: [
				clientCombo,
				countryCombo,
				deviceTypeCombo
			]
		});
		this.VisionPictureConfig = VisionPictureConfig;
		var doorOpenFieldSet = new Ext.form.FieldSet({
			height: 100,
			hidden: true,
			title: 'Door Open',
			defaults: { labelWidth: 120 },
			items: [
				DoorOpenCount
			],
			autoHeight: true
		});
		var timeFieldSet = new Ext.form.FieldSet({
			title: 'Time',
			height: '150%',
			defaults: { labelWidth: 120 },
			items: [
				FieldImageTime1,
				FieldImageTime2,
				FieldImageTime3,
				ImageCaptureTimeSlot
			]
		});
		var dateTimeFieldSet = new Ext.form.FieldSet({
			title: 'Day & Time',
			height: '150%',
			defaults: { labelWidth: 120 },
			items: [
				dateFieldImageTime1,
				dateFieldImageTime2,
				dateFieldImageTime3,
				ImageCaptureDateTimeSlot
			]
		});
		var ImageEnableFieldSet = new Ext.form.FieldSet({
			title: 'Image Option',
			height: 70,
			items: [
				imageOptionCombo
			]
		});
		this.ImageEnableFieldSet = ImageEnableFieldSet
		this.doorOpenFieldSet = doorOpenFieldSet;
		this.timeFieldSet = timeFieldSet;
		this.dateTimeFieldSet = dateTimeFieldSet;
		this.commandPanel = commandPanel;

		this.imageOptionCombo.on('select', function (combo, newValue, oldValue) {
			var changedValue = newValue.id;
			switch (changedValue) {
				case 0:
					this.doorOpenFieldSet.setVisible(true);
					this.timeFieldSet.setVisible(false);
					this.dateTimeFieldSet.setVisible(false);
					break;
				case 1:
					this.doorOpenFieldSet.setVisible(false);
					this.timeFieldSet.setVisible(true);
					this.dateTimeFieldSet.setVisible(false);
					break;
				case 2:
					this.doorOpenFieldSet.setVisible(false);
					this.timeFieldSet.setVisible(false);
					this.dateTimeFieldSet.setVisible(true);
					break;
			}
		}, this);
		var formItems = [
			dateFieldImageTime1,
			dateFieldImageTime2,
			dateFieldImageTime3,
			FieldImageTime1,
			FieldImageTime2,
			FieldImageTime3,
			ImageCaptureDateTimeSlot,
			ImageCaptureTimeSlot,
			DoorOpenCount,
			imageOptionCombo

		];
		this.formItems = formItems;
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form' },
			labelWidth: 150,
			items: [commandPanel, ImageEnableFieldSet, doorOpenFieldSet, timeFieldSet, dateTimeFieldSet, VisionPictureConfig],
			autoScroll: true
		});
		this.clientCombo = clientCombo;
		this.countryCombo = countryCombo;

		this.on('dataLoaded', function (VisionPictureConfig, data) {
			var record = data.data;
			if (record.Id != 0) {
				var visionPictureConfig = record.VisionPictureConfig;
				this.countryCombo.setValue(record.CountryId);
				this.deviceTypeCombo.setValue(record.SmartDeviceTypeId);
				this.clientCombo.setValue(record.ClientId);
				this.formValues = Ext.decode(visionPictureConfig);
				if (this.formValues.ImageEnableOption == 'Door Open') {
					this.doorOpenFieldSet.setVisible(true);
					this.timeFieldSet.setVisible(false);
					this.dateTimeFieldSet.setVisible(false);
				}
				if (this.formValues.ImageEnableOption == 'Time') {
					this.doorOpenFieldSet.setVisible(false);
					this.timeFieldSet.setVisible(true);
					this.dateTimeFieldSet.setVisible(false);
				}
				if (this.formValues.ImageEnableOption == 'Day & Time') {
					this.doorOpenFieldSet.setVisible(false);
					this.timeFieldSet.setVisible(false);
					this.dateTimeFieldSet.setVisible(true);
				}
				this.formItems.forEach(function (field) {
					field.setValue(this.formValues[field.name]);
				}, this);
			}
		});
		return config;
	},
	resetCommandPanel: function () {
		var me = this, height = me.winConfig.height;
		me.doorOpenFieldSet.setVisible(false);
		me.doorOpenFieldSet.removeAll(true);
		me.timeFieldSet.setVisible(false);
		me.timeFieldSet.removeAll(true);
		me.dateTimeFieldSet.setVisible(true);
		me.dateTimeFieldSet.removeAll(false);
		me.ImageEnableFieldSet.setVisible(true);
		me.ImageEnableFieldSet.removeAll(false);
		me.win.setHeight(height);
	},
	onBeforeSave: function (VisionPictureConfig, params, options) {
		var values = VisionPictureConfig.formPanel.form.getValues();
		delete values["ClientId"];
		delete values["CountryId"];
		delete values["VisionPictureConfig"];
		delete values["SmartDeviceTypeId"];
		if (values.ImageEnableOption == "Door Open") {
			delete values["DateFieldImageTime1"];
			delete values["DateFieldImageTime2"];
			delete values["DateFieldImageTime3"];
			delete values["ImageTime1"];
			delete values["ImageTime2"];
			delete values["ImageTime3"];
			delete values["ImageCaptureDateTimeSlot"];
			delete values["ImageCaptureTimeSlot"];
		}
		if (values.ImageEnableOption == "Time") {
			delete values["DateFieldImageTime1"];
			delete values["DateFieldImageTime2"];
			delete values["DateFieldImageTime3"];
			delete values["ImageCaptureDateTimeSlot"];
			delete values["DoorOpenCount"];
		}
		if (values.ImageEnableOption == "Day & Time") {
			delete values["ImageTime1"];
			delete values["ImageTime2"];
			delete values["ImageTime3"];
			delete values["ImageCaptureTimeSlot"];
			delete values["DoorOpenCount"];
		}
		this.VisionPictureConfig.setValue(JSON.stringify(values));
	},
	CreateFormPanel: function (config) {
		this.on('beforeSave', this.onBeforeSave, this);
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			height: 400,
			width: 412,
			items: [this.formPanel]
		});
	}
});




