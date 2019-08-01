/**
 * @private
 */
Ext.define('Ext.ux.mgd.device.scanner.Abstract', {

	callback: {
		onSuccess: function (result) {
			Ext.device.Notification.alert(
				{
					title: "Success",
					message: "We got a barcode  \n" +
						"Result: " + result.text + "  \n" +
						"Format: " + result.format + "  \n" +
						"Cancelled: " + result.cancelled,
					buttons: Ext.MessageBox.OK
				}
			)
		},
		onError: function (error) {
			Ext.device.Notification.alert(
				{
					title: "Error",
					message: "Scanning failed: " + error.error,
					buttons: Ext.MessageBox.OK
				}
			)
		}
	},
	/**
	 * Allows you to scan a barcorde.
	 *
	 * @param {Object} options
	 * The options to use when scanning a barcode.
	 *
	 * @param {Function} options.success
	 * The success callback which is called when the barcode scan was successful.
	 *
	 * @param {Function} options.failure
	 * The failure callback which is called when the barcode scan was not successful.
	 *
	 * @param {Object} options.scope
	 * The scope in which to call the `success` and `failure` functions, if specified.
	 */
	scan: Ext.emptyFn,
	/**
	 * private
	 */
	getScan: Ext.emptyFn
});
