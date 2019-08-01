DA.ReportBase = Ext.extend(Ext.util.Observable, {
	constructor: function (cfg) {
		Ext.apply(this, cfg);
		DA.ReportBase.superclass.constructor.call(this);
	},
	title: 'Report',
	orderBy: null,
	defaultComboProperties: {
		displayField: "DisplayValue",
		valueField: "LookupId",
		typeAhead: true,
		triggerAction: "all",
		forceSelection: true,
		typeAheadDelay: 250,
		mode: 'local',
		smartSearch: false
	},
	getFilter: function (filter) {
		if (typeof filter === 'string') {
			return this.filterDefinitions[filter];
		}
		return filter;
	},
	dateFilters: true,
	formWidth: 400,
	getFilterForm: function () {
		var formItems = [],
			filterItems = [],
			groupBy,
			orderBy,
			i = 0;

		if (typeof this.getReportStore === 'function') {
			var reportStore = this.getReportStore();
			if (reportStore) {
				filterItems.push({ xtype: 'combo', fieldLabel: 'Report', hiddenName: 'ReportName', store: this.getReportStore(), forceSelection: true });
			}
		}

		if (this.dateFilters) {
			var fromDate = new Ext.form.DateField({ fieldLabel: 'From', name: 'FromDate', allowBlank: false, value: new Date() }),
				toDate = new Ext.form.DateField({ fieldLabel: 'To', name: 'ToDate', allowBlank: false, value: new Date() });
			var periodPlugin = new Ext.ux.plugins.Period({ fromDate: fromDate, toDate: toDate }),
				periodCombo = { xtype: 'combo', fieldLabel: 'Select Period', hiddenName: 'Period', store: periodPlugin.getStoreValues(), value: '', plugins: [periodPlugin] };
			Ext.applyIf(periodCombo, this.defaultComboProperties);
			filterItems = filterItems.concat([
				periodCombo,
				fromDate,
				toDate
			]);
		}

		var filterOptions = this.filterOptions,
			filters = this.filters;
		if (typeof filters === 'function') {
			filters = this.filters();
		}
		if (filters != undefined) {
			for (i = 0, len = filters.length; i < len; i++) {
				filterItems.push(this.getFilter(filters[i]));
			}
		}

		///For adding extra field from js
		if (filterOptions.items != undefined && filterOptions.items.length > 0) {
			for (i = 0; i < filterOptions.items.length; i++) {
				filterItems.push(filterOptions.items[i]);
			}
		}

		formItems.push({
			xtype: 'fieldset',
			items: filterItems,
			title: 'Filter',
			defaults: {
				anchor: '0'
			},
			width: this.formWidth
		});

		var options = this.groupBy;
		if (options) {
			Ext.applyIf(options, {
				title: 'Group by',
				field: { hiddenName: 'GroupBy' }
			});
		}

		groupBy = this.createFieldSet(options);
		if (groupBy && groupBy.items.length > 0) {
			if (groupBy.items.length > 0) {
				if (filterOptions.groupByDefault) {
					groupBy.items[0].value = filterOptions.groupByDefault
				}
				formItems.push(groupBy);
			}
		}

		options = this.orderBy;
		if (options) {
			Ext.applyIf(options, {
				title: 'Sort by',
				field: { hiddenName: 'OrderBy' }
			});
		}

		orderBy = this.createFieldSet(options);
		if (orderBy) {
			formItems.push(orderBy);
		}

		return {
			bodyStyle: 'padding:15px',
			items: formItems,
			autoScroll: true,
			width: 450
		};
	},
	params: {},
	comboChange: function (field) {
		var forceLoad = false;
		if (field && field.isFormField) {
			this.params[field.hiddenName || field.name || field.id] = field.getValue();
			this.lastLoaded = new Date();
			forceLoad = true;
		}
	},
	createFieldSet: function (options) {
		if (options) {

			var fieldSet = {
				xtype: 'fieldset',
				items: [],
				title: options.title,
				width: this.formWidth
			};

			var store = options.store;
			var max = options.max || store.length;
			if (max > 3) {
				max = 3;
			}
			var localCombo;
			for (var i = 0; i < max; i++) {

				localCombo = {
					xtype: 'combo',
					fieldLabel: i === 0 ? 'By' : 'Then',
					anchor: '0',
					store: store,
					value: i === 0 ? store[0][0] : '',
					readOnly: store[i][2] === 'disabled' ? true : false
				};
				Ext.applyIf(localCombo, this.defaultComboProperties);
				fieldSet.items.push(Ext.apply(localCombo, options.field));
			}
			return fieldSet;
		}
	},
	controller: 'Report',
	filterOptions: {
		groupBy: null,
		hospital: true
	},
	createLayout: function () {

		var formConfig = this.getFilterForm();
		var reportFormatCombo = {
			xtype: 'combo',
			hiddenName: 'format',
			fieldLabel: 'Format',
			store: [
				['PDF', 'PDF'],
				['XLS', 'Excel'],
				['RTF', 'RTF']
			],
			value: 'PDF'
		};
		Ext.applyIf(reportFormatCombo, this.defaultComboProperties);
		formConfig.items.push(reportFormatCombo, { xtype: 'button', text: 'Run', handler: this.onRunReport, scope: this, iconCls: 'edit' });
		Ext.applyIf(formConfig, {
			title: this.title,
			labelAlign: 'left',
			width: 200,
			defaults: { width: 70, height: 110 },
			closable: true
		});

		this.filterForm = new Ext.form.FormPanel(formConfig);
		return this.filterForm;
	},

	onRunReport: function () {
		if (!Ext.ux.util.ValidateForm(this.filterForm)) {
			return;
		}

		var values = this.filterForm.getForm().getValues(),
			params,
			url;

		if (!values.OrderBy) {
			delete values.OrderBy;
		}

		if (!values.GroupBy) {
			delete values.GroupBy;
		}

		params = { reportCriteria: Ext.encode(values), format: values.format };
		if (this.report) {
			params.ReportName = this.report;
		}
		url = EH.BuildUrl(this.controller) + '?v=' + new Date();

		if (values.format === "XLS" || values.format === "RTF") {
			ExtHelper.HiddenForm.submit({
				url: url,
				params: params,
				target: ""
			});
			return;
		}

		Ext.ux.util.Popup.show({
			url: values.format && values.format.toUpperCase() === "PDF" ? url + '.pdf' : url,
			params: params,
			title: this.title,
			maximized: true
		});
	},
	createPanel: function () {
		this.panel = this.createLayout();
		if (this.panel) {
			DCPLApp.AddTab(this.panel);
		}
	}
});
