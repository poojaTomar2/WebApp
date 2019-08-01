Ext.define('CoolerIoTMobile.controller.Admin', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			admin: 'admin'
		},
		control: {
			'admin #syncButton': {
				singletap: 'onActioUpdateSave'
			},
			'admin': {
				deactivate: 'onDeactivate'
			}
		},
		currentController: null,
		lastLatestRecord: null
	},
	onActioUpdateSave: function () {
		var form = this.getAdmin();
		var serial = form.getComponent('assetSerial');
		var deviceSerial = serial.getValue();
		if (deviceSerial.length > 7) {
			deviceSerial = deviceSerial.replace(/:/g, "");
			if (deviceSerial.length == 12) {
				deviceSerial = parseInt(deviceSerial, 16) - CoolerIoTMobile.Util.BaseSerialNumber;
			}
			else {
				Ext.Msg.alert('Data Inappropriate', 'Please enter valid mac or serial number.');
				return;
			}
		}
		var logSelected = form.getComponent('logsSelect');
		var controller = logSelected.getValue();
		var adminList = form.down('#deviceSearchResult');
		if (deviceSerial == "" || controller == "") {
			Ext.Msg.alert('Data Inappropriate', 'Please fill both fields.');
			return;
		}
		else {
			adminList.setHidden(false);
			var extraParams = {
				action: 'list',
				limit: 10,
				AsArray: 0,
				sort: 'CreatedOn',
				dir: 'DESC'
			}
			if (controller == "LogDebugger") {
				extraParams.DeviceSerial = deviceSerial;
			}
			else if (controller == "RawLogs") {
				extraParams.GatewaySerial = deviceSerial;
			}
			else {
				extraParams.SerialNumber = deviceSerial;
			}
			Ext.Viewport.setMasked({
				xtype: 'loadmask',
				message: 'Working...'
			});
			if (!Ext.isEmpty(this.getCurrentController())) {
				if (this.getCurrentController() != controller) {
					this.setLastLatestRecord(null);
				}
			}
			Ext.Ajax.request({
				url: Df.App.getController(controller),
				params: extraParams,
				success: function (response) {
					this.onSuccess(response, controller);
				},
				failure: function () {
					this.onFailure();
				},
				scope: this
			});
		}
	},
	processUpdatedRecords: function () {
		var newStore = Ext.getStore('DeviceSearchResult');
		if (newStore.getCount() > 0) {
			var len = newStore.getCount();
			for (var i = 0; i < len ; i++) {
				var rowId = 'ext-gridrow-' + Number(i + 1);
				if (newStore.data.items[i].data.CreatedOn > this.getLastLatestRecord()) {
					newStore.data.items[i].data.IsUpdated = true;

					var element = Ext.get(rowId).dom;
					element.className = element.className + " updated-rows";
				}
				else {
					if (Ext.get(rowId) && Ext.get(rowId).dom.classList.contains("updated-rows")) {
						Ext.get(rowId).dom.classList.remove("updated-rows");
					}
				}
			}
			this.setLastLatestRecord(newStore.data.items[0].data.CreatedOn);
		}
	},
	onSuccess: function (response, controller) {
		Ext.Viewport.setMasked(false);
		var data = Ext.decode(response.responseText);
		var store = Ext.getStore('DeviceSearchResult');
		store.removeAll();
		store.setData(data.records);
		if (Ext.isEmpty(this.getLastLatestRecord()) && store.getCount() > 0) {
			this.setLastLatestRecord(store.data.items[0].data.CreatedOn);
		}
		this.processUpdatedRecords();

		if (typeof (this.task) != "object") {
			this.task = Ext.create('Ext.util.DelayedTask', this.onActioUpdateSave, this)
		}
		this.task.delay(10000);
		this.setCurrentController(controller);
	},
	onFailure: function () {
		Ext.Viewport.setMasked(false);
		Ext.Msg.alert('Error', 'Some error occured.');
	},
	onDeactivate: function () {
		if (this.task) {
			this.task.cancel();
		}
	}
});
