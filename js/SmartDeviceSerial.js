Cooler.SmartDeviceSerial = new Cooler.Form({
	title: 'Smart Device Serial',
	keyColumn: 'SerialNumber',
	controller: 'SmartDeviceSerial',
	securityModule: 'SmartDeviceSerial',
	gridPlugins: [new DA.form.plugins.Inline()],
	gridConfig: {
		plugins: [new Ext.grid.CheckColumn()],
		custom: {
			quickSearch: {
				addColumns: false,
				width: 150,
				indexes: [
					{ text: 'Serial Number', dataIndex: 'SerialNumber' }
				]
			},
			loadComboTypes: true
		}
	},
	comboTypes: [
		'SmartDeviceType'
	],
	comboStores: {
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	disableAdd: true,
	disableDelete: true,
	editable: true,
	hybridConfig: function () {
		return [
            { header: 'Serial Number', dataIndex: 'SerialNumber', width: 100, type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Mac Address', dataIndex: 'MacAddress', width: 100, type: 'string' },
			{ header: 'Device Type', dataIndex: 'DeviceType', width: 100, type: 'string' },
			{ header: 'Smart Device Type', dataIndex: 'SmartDeviceTypeId', displayIndex: 'SmartDeviceTypeName', type: 'int', width: 120, store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }) },
			//{ dataIndex: 'SmartDeviceTypeName', header: 'Smart Device Type', width: 120, type: 'string', sortable: false },
			{ header: 'Major', dataIndex: 'Major', width: 100, type: 'string', align: 'right' },
			{ header: 'Minor', dataIndex: 'Minor', width: 100, type: 'string', align: 'right' },
			{ header: 'Label Serial Number', dataIndex: 'LabelSerialNumber', width: 100, type: 'string' },
			{ header: 'Label Serial Number Print', dataIndex: 'LabelSerialNumberPrint', width: 100, type: 'string' },
			{ header: 'Reference Number', dataIndex: 'ReferenceNumber', width: 100, type: 'string' },
			{ header: 'Ship Date', dataIndex: 'ShipDate', width: 100, type: 'date', editor: new Ext.form.DateField() },
			{ header: 'Tracking Number', dataIndex: 'TrackingNumber', width: 100, type: 'string', editor: new Ext.form.TextField({ maxLength: 50 }) },
			{ header: 'Location', dataIndex: 'Location', width: 100, type: 'string', editor: new Ext.form.TextField({ maxLength: 500 }) },
			{ header: 'Comments', dataIndex: 'Comment', width: 250, type: 'string', editor: new Ext.form.TextField({ maxLength: 500 }) },
			{ header: 'Cloud Url', dataIndex: 'CloudUrl', width: 250, type: 'string', editor: new Ext.form.TextField({ maxLength: 250 }) },
			new Ext.grid.CheckColumn({ header: 'Assigned?', dataIndex: 'Assigned', type: 'bool', width: 80 }),
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: "Is Spare Device", width: 100, dataIndex: 'IsSpareDevice', renderer: ExtHelper.renderer.Boolean, type: 'bool'},
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]
	},

	configureListTab: function (config) {
		var grid = this.grid;
		grid.getTopToolbar().splice(0, 0, { text: 'Bulk Location Update', iconCls: 'locationIcon', handler: this.onAddMessage, scope: this });
	},

	onAddMessage: function () {
		if (!this.locationUpdateFrom) {
			var locationUpdateFrom = new Ext.FormPanel({
				items: [
					{
						xtype: 'numberfield',
						itemId: 'fromSerialNumber',
						name: 'fromSerialNumber',
						allowDecimals: false,
						fieldLabel: 'Serial Number From',
						allowBlank: false
					},
					{
						xtype: 'numberfield',
						itemId: 'toSerialNumber',
						name: 'toSerialNumber',
						allowDecimals: false,
						fieldLabel: 'Serial Number To',
						allowBlank: false
					},
					{
						xtype: 'textfield',
						itemId: 'location',
						name: 'location',
						fieldLabel: 'Location Name',
						allowBlank: false
					},
					{
						xtype: 'datefield',
						itemId: 'shipDate',
						name: 'shipDate',
						fieldLabel: 'Ship Date'
					},
					{
						xtype: 'textfield',
						itemId: 'trackingNumber',
						name: 'trackingNumber',
						fieldLabel: 'Tracking Number'
					},
					{
						xtype: 'textfield',
						itemId: 'comment',
						name: 'comment',
						fieldLabel: 'Comments'
					},
					{
						xtype: 'checkbox',
						itemId: 'overwriteLocation',
						name: 'overwriteLocation',
						fieldLabel: 'Overerite Exixting Location'
					},
					{
						xtype: 'button',
						text: 'Save',
						handler: this.updateLocation,
						scope: this
					}
				]
			});
			this.locationUpdateFrom = locationUpdateFrom;
		}
		if (!this.win) {
			var window = new Ext.Window({
				width: 400,
				height: 250,
				layout: 'fit',
				padding: 10,
				title: 'Location Update',
				resizable: true,
				items: locationUpdateFrom,
				closeAction: 'hide',
				modal: true
			});
			this.win = window;
		}
		this.win.show();
	},

	updateLocation: function () {
		var form = this.locationUpdateFrom.getForm();
		var fromSerialNumber = form.getValues().fromSerialNumber;
		var toSerialNumber = form.getValues().toSerialNumber;
		var location = form.getValues().location;
		var shipDate = form.getValues().shipDate;
		var trackingNumber = form.getValues().trackingNumber;
		var comment = form.getValues().comment;
		var overwriteLocation = form.getValues().overwriteLocation;
		var recordCount = (toSerialNumber - fromSerialNumber) + 1;
		Ext.Msg.confirm('Confirm', "You want to update " + recordCount + " record(s)?", function (btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url: EH.BuildUrl('SmartDeviceSerial'),
					params: {
						otherAction: 'updateLocation',
						action: 'updateLocation',
						fromSerialNumber: fromSerialNumber,
						toSerialNumber: toSerialNumber,
						location: location,
						shipDate: shipDate,
						trackingNumber: trackingNumber,
						comment: comment,
						overwriteLocation: overwriteLocation
					},
					success: function () {
						this.win.hide();
						this.grid.store.reload();
						Ext.Msg.alert('Success', 'Location updateded.');
					},
					failure: function () {
						this.win.hide();
						Ext.Msg.alert('Error', 'Location update failed..Try again');
					},
					scope: this
				});
			}
		}, this);

	}
});
