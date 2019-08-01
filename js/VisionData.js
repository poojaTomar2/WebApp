Cooler.VisionData = Ext.extend(Cooler.Form, {

	controller: 'AssetPurityProduct',

	keyColumn: 'AssetPurityProductId',

	title: 'Vision',

	disableAdd: true,

	disableDelete: true,

	securityModule: 'ReportVisionData',

	constructor: function (config) {
		Cooler.AssetPurityProductForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'AssetPurityProductId' } }
		});
	},
	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},
	onSearch: function () {
		var sDateTime = this.startDateField.getValue();
		var eDateTime = this.endDateField.getValue();

		if (sDateTime != '' && eDateTime != '') {
			if (sDateTime > eDateTime) {
				Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
				return;
			}
			else {
				if (this.dateDifferanceInDays(sDateTime, eDateTime) > 92) {
					Ext.Msg.alert('Alert', 'You can\'t select more than three months duration.');
					return;
				}
			}
		}

		Cooler.DateRangeFilter(this, 'DoorClose', true);
	},

	onClear: function () {
		this.startDateField.setValue();
		this.endDateField.setValue();
		var startDateFilter = this.grid.gridFilter.getFilter('DoorClose');
		startDateFilter.setActive(false);
		this.grid.loadFirst();
	},

	beforeRemoveFilter: function () {
		this.module.onClear()
	},

	afterShowList: function (config) {
		Cooler.DateRangeFilter(this, 'DoorClose');
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];

		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);

		this.searchButton = new Ext.Button({
			text: 'Search', handler: this.onSearch, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: this.onClear, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},

	hybridConfig: function () {
		return [
            { dataIndex: 'Code', type: 'string', header: 'Outlet Code', hyperlinkAsDoubleClick: true },
			{ dataIndex: 'Name', type: 'string', header: 'Outlet', width: 160 },
			{ dataIndex: 'AssetId', type: 'int', header: 'AssetId', width: 80, align: 'right' },
            { dataIndex: 'AssetSerialNumber', type: 'string', header: 'Asset Serial Number', width: 120, hyperlinkAsDoubleClick: true },
            { dataIndex: 'SmartDeviceSerialNumber', type: 'string', header: 'Smart Device Serial Number', width: 150, hyperlinkAsDoubleClick: true },
			{ dataIndex: 'DoorClose', type: 'date', header: 'Time', width: 140, renderer: ExtHelper.renderer.DateTime },
			{ dataIndex: 'VerifiedOn', type: 'date', header: 'Recognition time', width: 140, renderer: ExtHelper.renderer.DateTime },
			{ dataIndex: 'Shelf', type: 'int', header: 'Shelf', width: 80, align: 'right' },
			{ dataIndex: 'Position', type: 'int', header: 'Column', width: 80, align: 'right' },
			{ dataIndex: 'PlanogramId', type: 'int', header: 'Planogram Id', width: 100, align: 'right' },
			{ dataIndex: 'PlanogramName', type: 'string', header: 'PlanogramName', width: 160 },
			{ dataIndex: 'PlanogramProductId', type: 'int', header: 'Planogram Product Id', width: 150, align: 'right', sortable: false, menuDisabled: true },
			{ dataIndex: 'PlanogramProductId', type: 'int', header: 'Planogram Product', displayIndex: 'DisplayValue', renderer: ExtHelper.renderer.Combo(DA.combo.create({ store: Cooler.comboStores.Product })), width: 150, sortable: false, menuDisabled: true },
			{ dataIndex: 'PlanogramProductId', type: 'int', header: 'Planogram Product SKU', renderer: function (v, m, r) { return Cooler.comboStores.Product.getById(v) ? Cooler.comboStores.Product.getById(v).json.SKU : ''; }, width: 150, sortable: false, menuDisabled: true, hidden: true },
			{ dataIndex: 'ProductId', type: 'string', header: 'Product Id', width: 80, align: 'right' },
			{ dataIndex: 'Product', type: 'string', header: 'Product', width: 160 },
			{ dataIndex: 'SKU', type: 'string', header: 'Product SKU', width: 160, hidden: true },
			{ dataIndex: 'City', type: 'string', header: 'City' },
			{ dataIndex: 'State', type: 'string', header: 'State' },
			{ dataIndex: 'Country', type: 'string', header: 'Country' },
			{ dataIndex: 'TimeZoneId', type: 'int' },
			{ dataIndex: 'CreatedOn', type: 'date', header: 'Image Received Date/Time', width: 160, renderer: Cooler.renderer.DateTimeWithTimeZone }
		];
	}
});
Cooler.VisionDataReport = new Cooler.VisionData({ uniqueId: 'VisionData' });