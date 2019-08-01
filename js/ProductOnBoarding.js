Cooler.ProductOnboarding = new Cooler.Form({
	controller: 'ProductOnboarding',

	keyColumn: 'ProductOnboardingId',

	title: 'Product Onboarding',

	disableAdd: true,

	securityModule: 'Product',

	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'ProductOnboardingId' } }
	},


	hybridConfig: function () {
		return [
			{ dataIndex: 'ProductOnboardingId', type: 'int' },
			{ dataIndex: 'ProductId', type: 'int' },
			{ dataIndex: 'FrameCount', type: 'int', header:'Frame Count' },
			{ header: 'Onboarding Status', dataIndex: 'OnboardingStatus', type: 'int', width:150 }, // to do show 
			{ header: 'Onboarding Validated On', dataIndex: 'OnboardingValidatedOn', type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Last Updated', dataIndex: 'LastUpdated', type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime }
		];
	}
});