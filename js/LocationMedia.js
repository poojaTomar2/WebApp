Cooler.LocationMedia = new Cooler.Form({
	keyColumn: 'LocationMediaId',
	captionColumn: null,
	title: 'Media',
	controller: 'LocationMedia',
	quickSaveController: 'LocationMedia',
	newListRecordData: { MediaId: '', MediaTitle: '' },
	gridPlugins: [new DA.form.plugins.Inline()],
	hybridConfig: function () {
		var mediaCombo = DA.combo.create({ store: Cooler.LocationType.Location.comboStores.Media, allowBlank: false });
		return [
			{ dataIndex: 'LocationMediaId', type: 'int' },
			{ header: 'Media', dataIndex: 'MediaId', type: 'int', displayIndex: 'MediaTitle', editor: mediaCombo, renderer: ExtHelper.renderer.Combo(mediaCombo), width: 150 }
		];
	}

});