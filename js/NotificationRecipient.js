Cooler.NotificationRecipient = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Notification Recipient: {0}',
		listTitle: 'Notification Recipient',
		keyColumn: 'NotificationRecipientId',
		captionColumn: null,
		controller: 'NotificationRecipient',
		save: false,
		disableAdd: true,
		gridPlugins: [new DA.form.plugins.Inline()],
		gridConfig: {
			plugins: [new Ext.grid.CheckColumn()],
		}
	});
	Cooler.NotificationRecipient.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.NotificationRecipient, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'NotificationRecipientId', type: 'int' },
		{ name: 'IsApproved', type: 'bool' },
		{ name: 'MobileDeviceId', type: 'string' },
		{ name: 'Tags', type: 'string' },
		{ name: 'MobileDeviceIMEI', type: 'string' },
		{ name: 'DeviceRegistrationId', type : 'string'}
	]),
	cm: function () {
		var checkBox = new Ext.form.Checkbox({ allowBlank: false });
		checkBox.on('check', this.onCheck, this);
		var mobileDevice = { header: 'Mobile Device Id', dataIndex: 'MobileDeviceId', width: 100 };
		var tags = { header: 'Tags', dataIndex: 'Tags', width: 100 };
		var registrationId = { header: 'Device Registartion No.', dataIndex: 'DeviceRegistrationId', width: 100 }; 
		var cm = new Ext.ux.grid.ColumnModel([
			registrationId,
			mobileDevice,
			tags,
			{ header: 'Mobile Device IMEI', dataIndex: 'MobileDeviceIMEI', width: 100 },
			{ header: 'IsApproved', dataIndex: 'IsApproved', xtype: 'checkbox', width: 60, renderer: ExtHelper.renderer.Boolean, editor: checkBox }
		]);
		cm.defaultSortable = true;
		return cm;
	},
	onCheck: function (checkBox) {
		//debugger;
		if (checkBox.checked)
		{
			var mobileDevice = this.grid.selModel.selection.record.data.MobileDeviceId;
			var tags = this.grid.selModel.selection.record.data.Tags;
			Ext.Ajax.request({
				url: EH.BuildUrl('NotificationRecipient'),
				params: {
					action: 'Other',
					otherAction: 'NotificationRegister',
					Handle: mobileDevice,
					Tags: tags
				}
			});
		}
		else
		{
			var regId = this.grid.selModel.selection.record.data.DeviceRegistrationId;
			var tags = this.grid.selModel.selection.record.data.Tags;
			Ext.Ajax.request({
				url: EH.BuildUrl('NotificationRecipient'),
				params: {
					action: 'Other',
					otherAction: 'DeRegisterDevice',
					Handle: regId,
					//tags: tags
				}
			});
		}
	},
	//createForm: function (config) {
	//	var items = [
	//		{ fieldLabel: 'Mobile Device Id', name: 'MobileDeviceId', xtype: 'textarea', maxLength: 200 },
	//		{ fieldLabel: 'IsApproved', name: 'IsApproved', xtype: 'checkbox', width: 60, renderer: ExtHelper.renderer.Boolean },
	//		{ fieldLabel: 'Tags', name: 'Tags', xtype: 'textarea', maxLength: 500 },
	//		{ fieldLabel: 'Mobile Device IMEI', name: 'MobileDeviceIMEI', xtype: 'textarea', maxLength: 500 }
	//	];

	//	Ext.apply(config, {
	//		defaults: { width: 150 },
	//		items: items
	//	});
	//	return config;
	//}
});

Cooler.NotificationRecipient = new Cooler.NotificationRecipient();

