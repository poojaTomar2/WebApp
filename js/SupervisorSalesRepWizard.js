Cooler.SupervisorSalesRepWizard = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		controller: 'SupervisorSalesRep'
	});

	Cooler.SupervisorSalesRepWizard.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.SupervisorSalesRepWizard, Cooler.Form, {

	onSalesRepLoad: function (records, operation, success, salesRepArr) {
		var salesArray = new Array()
		salesArray['LookupId'] = 0;
		salesArray['DisplayValue'] = 'All';
		salesArray['CustomStringValue'] = '0';
		salesArray['ReferenceValue'] = '0';
		var allValue = new Ext.data.Record(salesArray);
		this.salesRepsCombo.store.insert(0, allValue);
		if (this.salesRepsCombo.store.data.length - 1 == salesRepArr.length) {
			salesRepArr.push('0');
		}
		salesRepArr = salesRepArr.join(',');
		this.salesRepsCombo.setValue(salesRepArr);
		this.supervisorWizard.getLayout().setActiveItem(this.btnNext.nextIndex);
	},

	onSupervisorSuccess: function (response, success) {
		this.mask.hide();
		var responseText = Ext.decode(response.responseText);
		var data = responseText.data;
		this.data = data;
		var length = data.length;
		var salesRepArr = [];
		for (var i = 0; i < length; i++) {
			salesRepArr.push(data[i].RepId);
		}
		this.salesRepsCombo.store.baseParams.limit = 0;
		var salesRepParams = { ClientId: this.clientCombo.getValue(), limit: 0 };
		this.salesRepsCombo.store.load({
			params: salesRepParams, callback: function (records, operation, success) {
				this.onSalesRepLoad(records, operation, success, salesRepArr)
			}, scope: this
		});
	},

	onNext: function (btn) {
		var supervisorId = this.supervisorCombo.getValue();
		if (!this.mask) {
			this.mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Data loading...' });
		}
		this.mask.show();
		Ext.Ajax.request({
			url: 'Controllers/SupervisorSalesRep.ashx',
			params: { SupervisorId: supervisorId, action: 'getSalesRep' },
			success: this.onSupervisorSuccess,
			failure: function (result, request) {
				this.mask.hide();
				alert(JSON.parse(result.responseText));
			},
			scope: this
		});
	},

	onNextClient: function (btn) {
		this.supervisorCombo.reset();
		var clientId = this.clientCombo.getValue();
		this.supervisorCombo.getStore().baseParams.ClientId = clientId;
		this.supervisorCombo.getStore().load();
		this.supervisorWizard.getLayout().setActiveItem(btn.nextIndex);
	},

	onBack: function (btn) {
		this.supervisorWizard.getLayout().setActiveItem(btn.backIndex);
	},

	onSuccess: function (result, request) {
		this.btnFinish.setDisabled(true);
		this.btnNext.setDisabled(true);
		this.supervisorCombo.reset();
		Ext.Msg.alert('Success', 'Supervisor successfully linked with Sales Rep');
		this.supervisorWizard.getLayout().setActiveItem(this.activeIndex);
	},

	onFinish: function (btn) {
		var supervisorId = this.supervisorCombo.getValue();
		var salesRepIds = this.salesRepsCombo.getValue();
		var salerArr = salesRepIds.split(',');
		var index = salerArr.indexOf("0");
		if (index != -1) {
			salerArr.splice(index, 1);
		}
		salesRepIds = salerArr.join(',');
		Ext.Ajax.request({
			url: 'Controllers/SupervisorSalesRep.ashx',
			params: { SupervisorId: supervisorId, action: 'saveSuperVisor', RepIds: salesRepIds },
			success: this.onSuccess,
			failure: function (result, request) {
				alert(JSON.parse(result.responseText));
			},
			scope: this
		});
	},

	onSupervisorComboChange: function (combo, newValue, oldValue) {
		var isValid = this.supervisorCombo.isValid();
		this.btnNext.setDisabled(!isValid);
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

	onClientComboChange: function (combo, newValue, oldValue) {
		var isValid = this.clientCombo.isValid();
		this.btnNextClient.setDisabled(!isValid);
	},

	onSalesRepComboChange: function (combo, newValue, oldValue) {
		this.checkSelectAll(combo, newValue, oldValue);
		var isValid = this.salesRepsCombo.isValid();
		this.btnFinish.setDisabled(!isValid);
	},

	createWizard: function () {
		this.activeIndex = 1;
		if (DA.Security.info.Tags.ClientId == 0) {
			this.activeIndex = 0;
		}

		var supervisorCombo = DA.combo.create({ fieldLabel: 'Supervisor', name: 'SupervisorId', hiddenName: 'SupervisorId', controller: 'combo', baseParams: { comboType: 'SupervisorSalesRep' }, listWidth: 220, allowBlank: false });
		this.supervisorCombo = supervisorCombo;

		this.supervisorCombo.on('change', this.onSupervisorComboChange, this);

		this.clientCombo = clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', hiddenName: 'ClientId', itemId: 'clientCombo', baseParams: { comboType: 'Client' }, listWidth: 230, controller: "Combo" });

		this.clientCombo.on('change', this.onClientComboChange, this);

		this.salesRepComboForStore = DA.combo.create({ baseParams: { comboType: 'SalesPerson', limit: 0 }, controller: "Combo" });

		this.salesRepsCombo = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			name: 'RepId',
			displayField: 'DisplayValue',
			displayFieldTpl: '{DisplayValue}',
			fieldLabel: 'Sales Rep',
			hiddenName: 'RepId',
			store: this.salesRepComboForStore.getStore(),
			mode: 'local',
			width: 250,
			height: '500',
			allowBlank: false
		});

		this.salesRepsCombo.on('change', this.onSalesRepComboChange, this);
		this.btnNext = new Ext.Toolbar.Button({ text: 'Next', handler: this.onNext, scope: this, disabled: true, nextIndex: 2 });
		this.btnNextClient = new Ext.Toolbar.Button({ text: 'Next', handler: this.onNextClient, scope: this, disabled: true, nextIndex: 1 });
		var btnBack = new Ext.Toolbar.Button({ text: 'Back', handler: this.onBack, scope: this, backIndex: 1 });
		var btnBackSupervisor = new Ext.Toolbar.Button({ text: 'Back', handler: this.onBack, scope: this, backIndex: 0 });
		this.btnFinish = new Ext.Toolbar.Button({ text: 'Finish', handler: this.onFinish, scope: this, disabled: true });

		var clientPanel = new Ext.FormPanel({
			defaults: {
				labelStyle: ' margin-left: 13px;'
			},
			bbar: ['->', this.btnNextClient],
			items: [this.clientCombo]
		});

		var supervisorPanel = new Ext.FormPanel({
			defaults: {
				labelStyle: ' margin-left: 13px;'
			},
			bbar: [btnBackSupervisor, '->', this.btnNext],
			items: [this.supervisorCombo]
		});

		if (this.activeIndex) {
			supervisorPanel.bottomToolbar.splice(0, 1);
		}

		var salesRepPanel = new Ext.FormPanel({
			bbar: [btnBack, '->', this.btnFinish],
			items: [this.salesRepsCombo]
		});
		if (!this.supervisorWizard) {
			var supervisorWizard = new Ext.Panel({
				title: 'Supervisor Wizard',
				layout: 'card',
				deferredRender: true,
				activeItem: this.activeIndex,
				bodyStyle: 'padding:15 0 0 0',
				defaults: {
					border: false
				},
				items: [
					clientPanel,
					supervisorPanel,
					salesRepPanel
				]
			});
			this.supervisorWizard = supervisorWizard;
		}
		return this.supervisorWizard;
	},

	Show: function () {
		if (!this.loaded) {
			Cooler.loadGlobalCombos();
		}
		DCPLApp.AddTab(this.createWizard());
	}
});

Cooler.SupervisorSalesRepWizard = new Cooler.SupervisorSalesRepWizard();
