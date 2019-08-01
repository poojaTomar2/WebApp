Cooler.AssetVisitHistory = new Cooler.Form({
    controller: 'AssetVisitHistory',

    keyColumn: 'AssetVisitHistoryId',
    gridConfig: {
        defaults: { sort: { dir: 'DESC', sort: 'VisitDateTime' } }
    },
    title: 'Visit History',

    newListRecordData: { VisitByUserId: '', StatusId: '' },

    gridPlugins: [new DA.form.plugins.Inline({
        modifiedRowOptions: { fields: 'modified' }
    })],

    hybridConfig: function () {
        var userCombo = DA.combo.create({ store: Cooler.Asset.comboStores.User });
        var statusCombo = DA.combo.create({ store: Cooler.Asset.comboStores.CoolerVisitStatus });
        return [
            { dataIndex: 'AssetVisitHistoryId', type: 'int' },
            { header: 'Start Visit Date Time', dataIndex: 'VisitDateTime', width: 180, renderer: ExtHelper.renderer.DateTime, editor: new Ext.ux.form.DateTime(), type: 'date' },
            { header: 'End Visit Date Time', dataIndex: 'VisitEndTime', width: 180, renderer: ExtHelper.renderer.DateTime, editor: new Ext.ux.form.DateTime(), type: 'date' },
            { header: 'Visit By User', dataIndex: 'VisitByUserId', displayIndex: 'VisitBy', type: 'int', xtype: 'combocolumn', disableStoreFilter: true, editor: userCombo, renderer: ExtHelper.renderer.Combo(userCombo), width: 150 },
            { header: 'Latitude', dataIndex: 'Latitude', type: 'float', width: 80, align: 'right', renderer: ExtHelper.renderer.Float(8) },
            { header: 'Longitude', dataIndex: 'Longitude', type: 'float', width: 80, align: 'right', renderer: ExtHelper.renderer.Float(8) },
            { header: 'Status', dataIndex: 'StatusId', displayIndex: 'DisplayValue', type: 'int', xtype: 'combocolumn', disableStoreFilter: true, editor: statusCombo, renderer: ExtHelper.renderer.Combo(statusCombo), width: 150 },
			{ header: 'Notes', dataIndex: 'Notes', width: 200, editor: new Ext.form.TextField({ allowBlank: false }), renderer: ExtHelper.renderer.ToolTip(), type: 'string' },
			{ header: 'Distance', type: 'int', dataIndex: 'Distance', align: 'right', width: 100 },
			{ header: 'Source', type: 'string', dataIndex: 'Source', align: 'left', width: 100 },
            { dataIndex: 'AssetId', type: 'int' }
        ];
    }
});