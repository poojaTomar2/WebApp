Cooler.OutletPromotion = new Cooler.Form({
	keyColumn: 'LocationPromotionId',
	captionColumn: null,
	title: 'Promotion',
	controller: 'LocationPromotion',
	quickSaveController: 'LocationPromotion',
	gridPlugins: [new DA.form.plugins.Inline()],
	newListRecordData: { PromotionId: '' },
	hybridConfig: function () {
		var promotionCombo = DA.combo.create({ store: Cooler.LocationType.Location.comboStores.Promotion, allowBlank: false });
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'LocationPromotionId', type: 'int' },
			{ name: 'LocationId', type: 'int' },
			{ header: 'Promotion', displayIndex: 'DisplayValue', dataIndex: 'PromotionId', type: 'int', width: 140, renderer: ExtHelper.renderer.Combo(promotionCombo), editor: promotionCombo }
		];
	}
});
