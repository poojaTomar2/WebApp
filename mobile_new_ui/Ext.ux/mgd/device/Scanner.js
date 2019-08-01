/**
 * This class allows you to use native APIs to scan barcodes using the device camera.
 *
 * When this singleton is instantiated, it will automatically select the correct implementation depending on the
 * current device:
 *
 * - Cordova
 * - Simulator
 *
 * Cordova implementation will use the barcode plugin. The Simulator implementation will simply return a
 * random fake number.
 *
 * ## Example
 *
 * You can use the {@link Ext.device.Scanner#scan} function to take get a barcode:
 *
 *     Ext.device.Scanner.scan({
 *         success: function(result) {
 *             console.log(result);
 *         },
 *         failure: function(error){
 *             console.log(error)
 *         }
 *     });
 *
 * @mixins Lager.util.device.scanner.Abstract
 */
Ext.define('Ext.ux.mgd.device.Scanner', {
	alternateClassName: 'Ext.device.Scanner',
	singleton: true,

	requires: [
		'Ext.ux.mgd.device.scanner.Cordova',
		'Ext.ux.mgd.device.scanner.Simulator',

		// only if you do not require onSuccess and onError
		'Ext.device.Notification',
		'Ext.MessageBox'
	],

	constructor: function() {
		var browserEnv = Ext.browser.is;

		if (browserEnv.WebView && browserEnv.Cordova) {
			return Ext.create('Ext.ux.mgd.device.scanner.Cordova');
		}

		return Ext.create('Ext.ux.mgd.device.scanner.Simulator');
	}
});