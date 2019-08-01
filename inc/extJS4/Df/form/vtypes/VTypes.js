Ext.define('Df.form.vtypes.VTypes', {
	override: 'Ext.form.VTypes',
	/** 
	* The function used to validated multiple email addresses on a single line 
	* @param {String} value The email addresses - separated by a comma or semi-colon 
	*/
	'multiemail': function (v) {
		var array = v.split(',');
		var valid = true;
		Ext.each(array, function (value) {
			if (!this.email(value)) {
				valid = false;
				return false;
			};
		}, this);
		return valid;
	},
	/** 
	* The error text to display when the multi email validation function returns false 
	* @type String 
	*/
	'multiemailText': VuServer.Localization.EmailValidationMessage,
	/** 
	* The keystroke filter mask to be applied on multi email input 
	* @type RegExp 
	*/
	'multiemailMask': /[a-z0-9_\.\-@\,]/i,
	/** 
	* The function used to validated for pdf input files 
	* @param {String, field} value  and object
	*/
	'pdf': function (val, field) {
		var fileName = /^.*\.(pdf)$/i;
		return fileName.test(val);
	},
	/** 
	* The error text to display when the pdf validation function returns false 
	* @type String 
	*/
	'pdfText': VuServer.Localization.PdfValidationErrorMessage,
	/** 
	* The keystroke filter mask to be applied on pdf input 
	* @type RegExp 
	*/
	'pdfMask': /[a-z_\.]/i,

	/** 
	* The function used to validated for image files 
	* @param {String, field} value  and object
	*/
	'images': function (val, field) {
		var fileName = /^.*\.(jpg|png|bmp)$/i;
		return fileName.test(val);
	},
	/** 
	* The error text to display when the images validation function returns false 
	* @type String 
	*/
	'imagesText': VuServer.Localization.LogoValidationErrorMessage,
	/** 
	* The keystroke filter mask to be applied on images input 
	* @type RegExp 
	*/
	'imagesMask': /[a-z_\.]/i
});

 