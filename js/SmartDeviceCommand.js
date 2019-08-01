Cooler.SmartDeviceCommand = new Cooler.Form({
	title: 'Command',
	useElastic: true,
	keyColumn: 'Id',
	controller: 'SmartDeviceCommand',
	saveAndNew: false,
	allowExport: false,
	saveClose: false,
	securityModule: 'Command',
	winConfig: { height: 230, width: 360, allowHide: true },
	comboStores: {
		SmartDeviceTypeCommand: null,
		SmartDeviceTypeCommandUnique: null
	},
	gridConfig: {
		viewConfig: {
			getRowClass: function (r) {
				if (r.get('CreatedByUserId') <= 1) {
					return 'blue-row';
				}
				return '';
			}
		},
		defaults: { sort: { dir: 'DESC', sort: 'SmartDeviceCommandId' } }
	},
	hybridConfig: function () {
		var commandCombo = DA.combo.create({ fieldLabel: 'Command', hiddenName: 'SmartDeviceTypeCommandId', store: this.comboStores.SmartDeviceTypeCommandUnique, allowBlank: false });
		return [
			//{ dataIndex: 'Id', type: 'int' },
			{ header: 'Id', dataIndex: 'SmartDeviceCommandId', type: 'int', align: 'right', width: 60, elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ dataIndex: 'SmartDeviceId', type: 'int' },
			{ header: 'Smart Device Type Command', type: 'string', dataIndex: 'SmartDeviceTypeCommand', width: 165 },
			{ header: 'Requested Configuration', type: 'string', renderer: Cooler.renderer.requestedConfigurationRenderer, width: 165, sortable: false },
			{ header: 'Value', width: 200, dataIndex: 'Value', type: 'string' },
			{ header: 'Requested On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Executed On', dataIndex: 'ExecutedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Result', dataIndex: 'Result', type: 'string' },
			{ header: 'Is Success', dataIndex: 'CommandStatus', width: 130, type: 'string' },
			{ header: 'Configuration Changed By', dataIndex: 'ChangeRequestedByUser', type: 'string' },
			{ header: 'Command Type', dataIndex: 'CommandType', type: 'string' },
			{ dataIndex: 'CreatedByUserId', type: 'int' },
			{ dataIndex: 'SmartDeviceTypeCommandId', type: 'int' }
		];
	},
	onGridCreated: function (grid) {
		this.grid = grid;
		grid.topToolbar.splice(DA.Security.HasPermission('DeviceDiagnostics') ? 1 : 0); // here if any user do not have a DeviceDiagnostics module permission then we remove the Add button
	},
	onButtonOkClick: function (button) {
		var me = this, valueField = me.commandPanel.items.items[1];
		if (!me.formPanel.form.isValid())
			return;

		me.win.allowHide = true;
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
			//var beaconFrameTypeFieldsParam1 = beaconFrameTypeFields.slice(1, 2);
			//var beaconFrameTypeFieldsParam2 = beaconFrameTypeFields.slice(2, 5);
			//var beaconFrameTypeFieldsParam3 = beaconFrameTypeFields.slice(5, beaconFrameFields.length);


			var beaconFrameFields = me.commandFieldSet.items.items[0].items.items;

			//var beaconConfigurationFieldsParam0 = beaconFrameFields.slice(0, 1);
			var beaconConfigurationFieldsParam1 = beaconFrameFields.slice(0, 1);
			var beaconConfigurationFieldsParam2 = beaconFrameFields.slice(1, 4);
			var beaconConfigurationFieldsParam3 = beaconFrameFields.slice(4, beaconFrameFields.length);


			var uidConfigurationFields = me.commandFieldSetEddyStoneUIDConfig.items.items[0].items.items;
			//var uidConfigurationFieldsParam0 = uidConfigurationFields.slice(0, 1);
			var uidConfigurationFieldsParam1 = uidConfigurationFields.slice(0, 2);
			var uidConfigurationFieldsParam2 = uidConfigurationFields.slice(2, uidConfigurationFields.length);

			var urlConfigurationFields = me.commandFieldSetEddyStoneURLConfig.items.items[0].items.items;
			//var urlConfigurationFieldsParam0 = urlConfigurationFields.slice(0, 1);
			var urlConfigurationFieldsParam1 = urlConfigurationFields.slice(0, 1);
			var urlConfigurationFieldsParam2 = urlConfigurationFields.slice(1, urlConfigurationFields.length);

			var tlmConfigurationFields = me.commandFieldSetEddyStoneTLMConfig.items.items[0].items.items;
			//var tlmConfigurationFieldsParam0 = tlmConfigurationFields.slice(0, 1);
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
			valueField.setValue(Ext.encode(value));


			var record = null;
			var id = me.formData.Id;
			if (id === 0) {
				var baseParams = this.grid.baseParams;
				params = { action: 'insertSmartDeviceCommand', smartDeviceId: baseParams.SmartDeviceId, smartDeviceTypeCommandId: comboCustomValue, commandValue: valueField.getValue(), gatewayId: baseParams.GatewayId, clientId: baseParams.CoolerIotClientId, assetId: baseParams.AssetId };
				Ext.Ajax.request({
					url: EH.BuildUrl('SmartDevice'),
					params: params,
					success: function (response, success) {
						this.grid.getStore().load();
					},
					failure: function () {
						Ext.Msg.alert('Error', 'Record not save..Try again.');
					},
					scope: this
				});
			}
			else {
				var index = store.findExact('Id', me.formData.Id);
				record = store.getAt(index);
				record.set('SmartDeviceId', 1);
				record.set('SmartDeviceTypeCommandId', me.commandCombo.getValue());
				record.set('Value', valueField.getValue());
			}
		}
		
		else if (comboCustomValue == Cooler.Enums.SmartDeviceCommandType.SET_PROGRAMMING_PARAMETERS) {
			var dataTypes = config.dataType;
			
			//var setFFAConfiguration = me.setFFAConfigurationFieldSet.items.items[0].items.items;
			var fieldValues = [];
			var value = { command: config.command };
			var fields = me.commandFieldPanel && dataTypes.length > 0 ? me.commandFieldPanel.items.items : [];
			for (var i = 0; i < fields.length; i++) {
				var field = fields[i];
				if (!field.isValid()) {
					return;
				}
				var fieldValue = field.getValue();
				if (field.getXType() == 'radio') {
					fieldValue = fieldValue ? 01 : 00;
				}
				if (field.name == 'UHo' || field.name == 'ULo' || field.name == 'Hbt' || field.name == 'Lbt') {
					fieldValue = fieldValue * 10;
				}
				fieldValues.push(fieldValue);

			}
			value["data"] = fieldValues;
			value["dataTypes"] = dataTypes;
			value["subCommand"] = 1;
			valueField.setValue(Ext.encode(value));

			var record = null;
			var id = me.formData.Id;
			if (id === 0) {
				var baseParams = this.grid.baseParams;
				params = { action: 'insertSmartDeviceCommand', smartDeviceId: baseParams.SmartDeviceId, smartDeviceTypeCommandId: comboCustomValue, commandValue: valueField.getValue(), gatewayId: baseParams.GatewayId, clientId: baseParams.CoolerIotClientId, assetId: baseParams.AssetId };
				Ext.Ajax.request({
					url: EH.BuildUrl('SmartDevice'),
					params: params,
					success: function (response, success) {
						this.grid.getStore().load();
					},
					failure: function () {
						Ext.Msg.alert('Error', 'Record not save..Try again.');
					},
					scope: this
				});
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
			valueField.setValue(Ext.encode(value));
			values.push(Ext.encode(value));

			if (values.length > 0) {
				var baseParams = this.grid.baseParams;
				params = { action: 'insertSmartDeviceCommand', smartDeviceId: baseParams.SmartDeviceId, smartDeviceTypeCommandId: Cooler.Enums.SmartDeviceCommandType.SET_POWER_SAVING_TIME, commandValue: values.pop(), gatewayId: baseParams.GatewayId, clientId: baseParams.CoolerIotClientId, assetId: baseParams.AssetId };
				Ext.Ajax.request({
					url: EH.BuildUrl('SmartDevice'),
					params: params,
					success: function (response, success) {
						this.grid.getStore().load();
					},
					failure: function () {
						Ext.Msg.alert('Error', 'Record not save..Try again.');
					},
					scope: this
				});
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
				valueField.setValue(Ext.encode(value));
				values.push(Ext.encode(value));
			}
			if (values.length > 0) {
				var baseParams = this.grid.baseParams;
				params = { action: 'insertSmartDeviceCommand', smartDeviceId: baseParams.SmartDeviceId, smartDeviceTypeCommandId: Cooler.Enums.SmartDeviceCommandType.CONTROL_EVENT, commandValue: values.pop(), gatewayId: baseParams.GatewayId, clientId: baseParams.CoolerIotClientId, assetId: baseParams.AssetId };
				Ext.Ajax.request({
					url: EH.BuildUrl('SmartDevice'),
					params: params,
					success: function (response, success) {
						this.grid.getStore().load();
					},
					failure: function () {
						Ext.Msg.alert('Error', 'Record not save..Try again.');
					},
					scope: this
				});
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
			// if (config.command == Cooler.Enums.SmartDeviceCommandType.READ_CALIBRATE_GYRO) {
			// value["data"] = [0];
			// value["dataTypes"] = [this.commandDataTypes.Byte];

			// }
			valueField.setValue(Ext.encode(value));
			var record = null;
			var id = me.formData.Id;
			if (id === 0) {
				var baseParams = this.grid.baseParams;
				params = { action: 'insertSmartDeviceCommand', smartDeviceId: baseParams.SmartDeviceId, smartDeviceTypeCommandId: comboCustomValue, commandValue: valueField.getValue(), gatewayId: baseParams.GatewayId, clientId: baseParams.CoolerIotClientId, assetId: baseParams.AssetId };
				Ext.Ajax.request({
					url: EH.BuildUrl('SmartDevice'),
					params: params,
					success: function (response, success) {
						this.grid.getStore().load();
					},
					failure: function () {
						Ext.Msg.alert('Error', 'Record not save..Try again.');
					},
					scope: this
				});
			}
			else {
				var index = store.findExact('Id', me.formData.Id);
				record = store.getAt(index);
				record.set('SmartDeviceId', 1);
				record.set('SmartDeviceTypeCommandId', me.commandCombo.getValue() == -999 ? 23 : me.commandCombo.getValue());
				record.set('Value', valueField.getValue());
			}
		}
		me.win.hide();
	},
	saveEddyStoneConfiguration: function (me, baseParams, values) {
		var param = baseParams;
		var remainingValue = values;
		if (values.length > 0) {
			params = { action: 'insertSmartDeviceCommand', smartDeviceId: baseParams.SmartDeviceId, smartDeviceTypeCommandId: 25, commandValue: values.pop(), gatewayId: baseParams.GatewayId, clientId: baseParams.CoolerIotClientId, assetId: baseParams.AssetId };
			Ext.Ajax.request({
				url: EH.BuildUrl('SmartDevice'),
				params: params,
				success: function (response, success) {
					me.grid.getStore().load();
					this.saveEddyStoneConfiguration(this, param, remainingValue);
				},
				failure: function () {
					this.saveEddyStoneConfiguration(this, param, remainingValue);
				},
				scope: this
			});
		}
	},

	saveHubConfiguration: function (me, baseParams, values) {
		var param = baseParams;
		var remainingValue = values;
		if (values.length > 0) {
			params = { action: 'insertSmartDeviceCommand', smartDeviceId: baseParams.SmartDeviceId, smartDeviceTypeCommandId: 23, commandValue: values.pop(), gatewayId: baseParams.GatewayId, clientId: baseParams.CoolerIotClientId, assetId: baseParams.AssetId };
			Ext.Ajax.request({
				url: EH.BuildUrl('SmartDevice'),
				params: params,
				success: function (response, success) {
					me.grid.getStore().load();
					this.saveHubConfiguration(this, param, remainingValue);
				},
				failure: function () {
					this.saveHubConfiguration(this, param, remainingValue);
				},
				scope: this
			});
		}
	},
	onDataLoad: function (form, data) {
		var me = this;
		var commandComboStore = me.commandCombo.getStore();
		var selected = Cooler.SmartDevice.grid.getSelectionModel();
		var smartDeviceTypeId = selected.getSelected().data.SmartDeviceTypeId;
		var gatewayTypeId = selected.getSelected().data.GatewayTypeId;
		me.formData = data.data;
		me.commandPanel.items.items[1].setReadOnly(true);
		if (smartDeviceTypeId) {
			commandComboStore.filterBy(function (rec, id) {
				if (rec.get('CustomStringValue') == smartDeviceTypeId) {
					if ((smartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartTag2ndGeneration || smartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartTag3rdGeneration || smartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartTag4thGeneration) && (gatewayTypeId == Cooler.Enums.SmartDeviceType.SmartHub || gatewayTypeId == Cooler.Enums.SmartDeviceType.SmartHub2ndGen || gatewayTypeId == Cooler.Enums.SmartDeviceType.SmartHub3rdGen)) {
						if ((rec.get('CustomValue') == -1) || (rec.get('CustomValue') == 128) || (rec.get('CustomValue') == 133)) {
							return false;
						}
						else {
							return true;
						}
					}
					else if ((smartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartVisionV6R2 || smartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartVisionV7R1) && (gatewayTypeId == Cooler.Enums.SmartDeviceType.SmartHub || gatewayTypeId == Cooler.Enums.SmartDeviceType.SmartHub2ndGen || gatewayTypeId == Cooler.Enums.SmartDeviceType.SmartHub3rdGen)) {
						if ((rec.get('CustomValue') == -1) || (rec.get('CustomValue') == 128) || (rec.get('CustomValue') == 133) || (rec.get('CustomValue') == 152) || (rec.get('CustomValue') == 153)) {
							return false;
						}
						else {
							return true;
						}
					}
					else {
						return true;
					}
				}
				else {
					return false;
				}
			}, this)
		}
		commandComboStore.data.map = null;
		commandComboStore.snapshot = null;
	},
	onDeleteButtonClick: function (button) {
		var me = this;
		me.win.allowHide = true;
		var store = me.grid.getStore();
		var index = store.findExact('Id', me.formData.Id);
		store.removeAt(index);
		me.win.hide();
	},
	createForm: function (config) {
		this.on('dataLoaded', this.onDataLoad, this);

		var deleteBtn = config.tbar[0];
		config.tbar.remove(deleteBtn);

		var okButton = new Ext.Toolbar.Button({ text: 'O<u>k</u>', iconCls: 'save', handler: this.onButtonOkClick, scope: this });
		config.tbar.unshift(okButton);

		var smartDeviceTypeCommandCombo = DA.combo.create({ fieldLabel: 'Command', hiddenName: 'SmartDeviceTypeCommandId', listWidth: 220, store: this.comboStores.SmartDeviceTypeCommand, allowBlank: false });
		smartDeviceTypeCommandCombo.on('select', this.commandSelection, this);

		var commandPanel = new Ext.Panel({
			layout: 'form',
			bodyStyle: "padding:10px;",
			defaults: { width: 200 },
			autoScroll: true,
			items: [
				smartDeviceTypeCommandCombo,
				{ fieldLabel: 'Value', name: 'Value', xtype: 'textfield' }
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
		var setFFAConfigurationFieldSet = new Ext.form.FieldSet({
			collapsible: false,
			hidden: true,
			title: 'Set FFA Configuration',
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
		this.setFFAConfiguration = setFFAConfigurationFieldSet;

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
		Ext.apply(config, {
			defaults: { labelWidth: 100 },
			items: items,
			autoScroll: true
		});
		return config;
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
		me.setFFAConfiguration.removeAll(true);
		me.setFFAConfiguration.setVisible(false);
		me.win.setHeight(height);
	},
	commandSelection: function (combo, record, index, e) {
		if (!record) {
			this.resetCommandPanel();
			return;
		}
		var me = this, items = me.formPanel.items, height = me.winConfig.height;

		var config = me.getFormFields(record.get('CustomValue'));

		var valueField = me.commandPanel.items.items[1];
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

		me.win.setHeight(height);
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
			case type.SET_PROGRAMMING_PARAMETERS:
				value.groupTitle = "Set FFA Configuration";
				value.fields.push({ fieldLabel: 'UHo', allowBlank: false, name: 'UHo', xtype: 'numberfield', minValue: 60, maxValue: 300, decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'ULo', allowBlank: false, name: 'ULo', xtype: 'numberfield', minValue: 60, maxValue: 300, decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'dOt', name: 'dOt', allowBlank: false, minValue: 0, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'tbt', name: 'tbt', allowBlank: false, minValue: 0, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'Hbt', name: 'Hbt', allowBlank: false, minValue: 0, maxValue: 25, xtype: 'numberfield' });
				value.fields.push({ fieldLabel: 'Lbt', name: 'Lbt', allowBlank: false, minValue: 0, maxValue: 25, xtype: 'numberfield' });
				value.fields.push({ fieldLabel: 'dCO', name: 'dCO', allowBlank: false, minValue: 0, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'dCF', name: 'dCF', allowBlank: false, minValue: 0, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'nCO', name: 'nCO', allowBlank: false, minValue: 0, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'nCF', name: 'nCF', allowBlank: false, minValue: 0, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'd2', name: 'd2', allowBlank: false, minValue: 0, maxValue: 255, xtype: 'numberfield', decimalPrecision: 0 });
				value.fields.push({ fieldLabel: 'L0', name: 'L0', xtype: 'radio' });
				value.dataType.push(commandDataTypes.Short);
				value.dataType.push(commandDataTypes.Short);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
				value.dataType.push(commandDataTypes.Byte);
		}
		return value;
	}
});
