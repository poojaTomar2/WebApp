Cooler.SalesRepWizard = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		controller: 'SalesReps'
	});
	securityModule: 'SalesWizard'
	Cooler.SalesRepWizard.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.SalesRepWizard, Cooler.Form, {

	onLocationLoad: function (records, operation, success, locationArr) {
		var locationArray = new Array()
		locationArray['LookupId'] = 0;
		locationArray['DisplayValue'] = 'All';
		locationArray['CustomStringValue'] = '0';
		locationArray['ReferenceValue'] = '0';
		var allValue = new Ext.data.Record(locationArray);
		this.locationCombo.store.insert(0, allValue);
		if (this.locationCombo.store.data.length - 1 == locationArr.length) {
			locationArr.push('0');
		}
		locationArr = locationArr.join(',');
		this.locationCombo.setValue(locationArr);
		this.salesWizard.getLayout().setActiveItem(this.btnNext.nextIndex);
	},

	onSalesRepSuccess: function (response, success) {
		this.mask.hide();
		var responseText = Ext.decode(response.responseText);
		var data = responseText.data;
		this.data = data;
		var length = data.length;
		var locationArr = [];
		for (var i = 0; i < length; i++) {
			locationArr.push(data[i].LocationId);
		}
		this.locationCombo.store.baseParams.limit = 0;
		var locationParams = { ClientId: this.clientCombo.getValue(), limit: 0 };
		this.locationCombo.store.load({
			params: locationParams, callback: function (records, operation, success) {
				this.onLocationLoad(records, operation, success, locationArr)
			}, scope: this
		});
	},

	onNext: function (btn) {
		var salesRepId = this.salesRepCombo.getValue();
		if (!this.mask) {
			this.mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Data loading...' });
		}
		this.mask.show();
		Ext.Ajax.request({
			url: 'Controllers/SalesReps.ashx',
			params: { RepId: salesRepId, action: 'getLocation' },
			success: this.onSalesRepSuccess,
			failure: function (result, request) {
				this.mask.hide();
				alert(JSON.parse(result.responseText));
			},
			scope: this
		});
	},

	onNextClient: function (btn) {
		this.salesRepCombo.reset();
		var clientId = this.clientCombo.getValue();
		this.salesRepCombo.getStore().baseParams.ClientId = clientId;
		this.salesRepCombo.getStore().load();
		this.salesWizard.getLayout().setActiveItem(btn.nextIndex);
	},

	onBack: function (btn) {
		this.salesWizard.getLayout().setActiveItem(btn.backIndex);
	},

	onSuccess: function (result, request) {
		this.btnFinish.setDisabled(true);
		this.btnNext.setDisabled(true);
		this.salesRepCombo.reset();
		Ext.Msg.alert('Success', 'Sales Rep successfully linked with Location');
		this.salesWizard.getLayout().setActiveItem(this.activeIndex);
	},

	onFinish: function (btn) {
		var salesRepId = this.salesRepCombo.getValue();
		var locationIds = this.locationCombo.getValue();
		var locationArr = locationIds.split(',');
		var index = locationArr.indexOf("0");
		if (index != -1) {
			locationArr.splice(index, 1);
		}
		locationIds = locationArr.join(',');
		var salesRepStore = this.salesRepCombo.getStore();
		var index = salesRepStore.find('LookupId', salesRepId)
		var roleId = salesRepStore.getAt(index).get('CustomValue');
		Ext.Ajax.request({
			url: 'Controllers/SalesReps.ashx',
			params: { RepId: salesRepId, action: 'saveSalesRep', LocationIds: locationIds, RoleId: roleId },
			success: this.onSuccess,
			failure: function (result, request) {
				alert(JSON.parse(result.responseText));
			},
			scope: this
		});
	},

	checkSelectAll: function (combo, newValue, oldValue) {
		var oldSeleted = oldValue.split(',');
		var newSeleted = newValue.split(',');
		var oldIndex = oldSeleted.indexOf("0");
		var newIndex = newSeleted.indexOf("0");
		var allSelectedNew = true;
		var allSelectedOld = true;
		if (oldIndex == -1) {
			allSelectedOld = false;
		}
		var data = combo.store.data;
		allSelectedNew = newIndex != -1 ? true : false;
		if ((allSelectedNew && !allSelectedOld) || ((newSeleted.length > oldSeleted.length) && (data.length - 1 == newSeleted.length))) {
			var ids = combo.store.collect('LookupId');
			newSeleted = ids;
			combo.setValue(ids);
		}

		if (allSelectedOld && !allSelectedNew) {
			combo.reset();
			newSeleted = data;
		}

		if (data.length != newSeleted.length) {
			var index = newSeleted.indexOf("0");
			if (index != -1) {
				newSeleted.splice(index, 1);
			}
			combo.setValue(newSeleted);
		}
	},

	onSalesComboChange: function (combo, newValue, oldValue) {
		var isValid = this.salesRepCombo.isValid();
		this.btnNext.setDisabled(!isValid);
	},

	onClientComboChange: function (combo, newValue, oldValue) {
		var isValid = this.clientCombo.isValid();
		this.btnNextClient.setDisabled(!isValid);
	},

	onLocationComboChange: function (combo, newValue, oldValue) {
		this.checkSelectAll(combo, newValue, oldValue);
		var isValid = this.locationCombo.isValid();
		this.btnFinish.setDisabled(!isValid);
	},

	createWizard: function () {
		this.activeIndex = 1;
		if (DA.Security.info.Tags.ClientId == 0) {
			this.activeIndex = 0;
		}
		this.salesRepCombo = DA.combo.create({ fieldLabel: 'Sales Rep', name: 'RepId', hiddenName: 'RepId', controller: 'combo', baseParams: { comboType: 'SalesPerson' }, listWidth: 220, allowBlank: false });

		this.clientCombo = clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', hiddenName: 'ClientId', itemId: 'clientCombo', baseParams: { comboType: 'Client' }, listWidth: 230, controller: "Combo" });

		this.locationComboForStore = DA.combo.create({ baseParams: { comboType: 'Location', limit: 50 }, controller: "Combo" });

		this.clientCombo.on('change', this.onClientComboChange, this);

		this.salesRepCombo.on('change', this.onSalesComboChange, this);

		this.locationCombo = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			name: 'LocationId',
			displayField: 'DisplayValue',
			displayFieldTpl: '{DisplayValue}',
			fieldLabel: 'Location',
			hiddenName: 'LocationId',
			store: this.locationComboForStore.getStore(),
			mode: 'local',
			width: 250,
			height: '500',
			allowBlank: false
		});

		this.locationCombo.on('change', this.onLocationComboChange, this);

		this.btnNext = new Ext.Toolbar.Button({ text: 'Next', handler: this.onNext, scope: this, disabled: true, nextIndex: 2 });
		this.btnNextClient = new Ext.Toolbar.Button({ text: 'Next', handler: this.onNextClient, scope: this, disabled: true, nextIndex: 1 });
		var btnBack = new Ext.Toolbar.Button({ text: 'Back', handler: this.onBack, scope: this, backIndex: 1 });
		var btnBackSalesRep = new Ext.Toolbar.Button({ text: 'Back', handler: this.onBack, scope: this, backIndex: 0 });
		this.btnFinish = new Ext.Toolbar.Button({ text: 'Finish', handler: this.onFinish, scope: this, disabled: true });

		var salesPanel = new Ext.FormPanel({
			defaults: {
				labelStyle: ' margin-left: 13px;'
			},
			bbar: [btnBackSalesRep, '->', this.btnNext],
			items: [this.salesRepCombo]
		});

		if (this.activeIndex) {
			salesPanel.bottomToolbar.splice(0, 1);
		}

		var clientPanel = new Ext.FormPanel({
			defaults: {
				labelStyle: ' margin-left: 13px;'
			},
			bbar: ['->', this.btnNextClient],
			items: [this.clientCombo]
		});

		var locationPanel = new Ext.FormPanel({
			bbar: [btnBack, '->', this.btnFinish],
			items: [this.locationCombo]
		});

		if (!this.salesWizard) {
			var salesWizard = new Ext.Panel({
				title: 'Sales Rep Wizard',
				layout: 'card',
				deferredRender: true,
				activeItem: this.activeIndex,
				bodyStyle: 'padding:15 0 0 0',
				defaults: {
					border: false
				},
				items: [
					clientPanel,
					salesPanel,
					locationPanel
				]
			});
			this.salesWizard = salesWizard;
		}

		return this.salesWizard;
	},

	Show: function () {
		if (!this.loaded) {
			Cooler.loadGlobalCombos();
		}
		DCPLApp.AddTab(this.createWizard());
	}
});

Cooler.SalesRepWizard = new Cooler.SalesRepWizard();
