/**
 * @private
 */
Ext.define('Ext.ux.mgd.device.scanner.Simulator', {
	extend: 'Ext.ux.mgd.device.scanner.Abstract',

	config: {
		samples: [
			{
				text: '9783468183492', // Buch
				format: 'CODE_128',
				cancelled: false,
				success: '200'
			},
			{
				text: '8711577002350',
				format: 'CODE_128',
				cancelled: false,
				success: '200'
			},
			{error: '400'},
			{
				text: '4260063030581',
				format: 'CODE_39',
				cancelled: false,
				success: '200'
			}
		]
	},

	constructor: function (config) {
		this.initConfig(config);
	},

	getScan: function (onSuccess, onError) {
		var samples = this.getSamples(),
			samplesCount = samples.length,
			sample = samples[Math.floor((Math.random() * samplesCount - 1) + 1)];

		if ('success' in sample) {
			onSuccess(sample);
		}
		else {
			onError(sample);
		}
	},

	scan: function (args) {
		var onSuccess = args.success,
			onError = args.failure,
			scope = args.scope;

		if (onSuccess == Ext.emptyFn)
			onSuccess = this.callback.onSuccess;
		if (onError == Ext.emptyFn)
			onError = this.callback.onError;

		if (scope) {
			onSuccess = Ext.Function.bind(onSuccess, scope);
			onError = Ext.Function.bind(onError, scope);
		}

		this.getScan(onSuccess, onError);
	}
});