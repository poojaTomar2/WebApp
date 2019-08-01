Cooler.AssetPurityProductForm = Ext.extend(Cooler.Form, {

	controller: 'AssetPurityProduct',

	keyColumn: 'AssetPurityProductId',

	title: 'Asset Purity Product',

	disableAdd: true,

	disableDelete: true,

	securityModule: 'AssetPurityProduct',

	hideExtraColumns: false,

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
            { header: 'Recognition ID', dataIndex: 'AssetPurityId', type: 'int', width: 160 },
			{ dataIndex: 'ProductId', type: 'int', header: 'Product Id' },
            { dataIndex: 'Code', type: 'string', header: 'Outlet Code', hidden: this.hideExtraColumns, hyperlinkAsDoubleClick: true },
			{ dataIndex: 'Name', type: 'string', header: 'Outlet', width: 160, hidden: this.hideExtraColumns },
            { dataIndex: 'AssetSerialNumber', type: 'string', header: 'Asset Serial Number', width: 120, hidden: this.hideExtraColumns, hyperlinkAsDoubleClick: true },
            { dataIndex: 'SmartDeviceSerialNumber', type: 'string', header: 'Smart Device Serial Number', width: 150, hidden: this.hideExtraColumns, hyperlinkAsDoubleClick: true },
			{ dataIndex: 'DoorClose', type: 'date', header: 'Time', width: 140, renderer: ExtHelper.renderer.DateTime, hidden: this.hideExtraColumns },
			{ dataIndex: 'Shelf', type: 'int', header: 'Shelf', width: 80, align: 'right' },
			{ dataIndex: 'Position', type: 'int', header: 'Column', width: 80, align: 'right' },
			{ dataIndex: 'Product', type: 'string', header: 'Product', width: 160 },
			{ dataIndex: 'SKU', type: 'string', header: 'SKU' },
			{ dataIndex: 'City', type: 'string', header: 'City', hidden: this.hideExtraColumns },
			{ dataIndex: 'State', type: 'string', header: 'State', hidden: this.hideExtraColumns },
			{ dataIndex: 'Country', type: 'string', header: 'Country', hidden: this.hideExtraColumns },
			{ dataIndex: 'StoredFilename', type: 'string', header: 'Image Name', hidden: true }
		];
	}
});
Cooler.AssetPurityProduct = new Cooler.AssetPurityProductForm({ uniqueId: 'AssetPurityProduct', hideExtraColumns: false });
Cooler.AssetPurityProductLog = new Cooler.AssetPurityProductForm({ uniqueId: 'AssetPurityProductLog' });