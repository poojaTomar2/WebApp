Cooler.ShakeInfoApiReport = Ext.extend(Cooler.Form, {

	controller: 'ShakeInfoApiReport',

	title: 'Shake Info Api Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'ShakeInfoApiReport',

	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			custom: {
				loadComboTypes: true
			}
		};
		Cooler.ShakeInfoApiReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'ShakeInfoId' } }
		});
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'ShakeInfoId', type: 'int' },
			{ header: 'Name', type: 'string', dataIndex: 'Name', width: 150 },
			{ header: 'Email', type: 'string', dataIndex: 'Email', width: 150 },
			{ header: 'Is Game Play?', type: 'bool', dataIndex: 'IsGamePlay', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Game Win?', type: 'bool', dataIndex: 'IsGamePlay', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Count', dataIndex: 'Count', type: 'int', width: 120 }
		];
	},
});
Cooler.ShakeInfoApiReport = new Cooler.ShakeInfoApiReport({ uniqueId: 'ShakeInfoApiReport' });