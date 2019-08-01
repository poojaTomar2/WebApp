Ext.define('CoolerIoTMobile.controller.FullScreenImage', {
	extend: 'Ext.app.Controller',
	config: {
		control: {
			'mobile-fullScreenImage': {
				activate: 'onActivate'
			}
		}
	},
	onActivate: function () {
		var myScroll = new IScroll('#wrapper', {
			zoom: true,
			scrollX: true,
			scrollY: true,
			mouseWheel: true,
			wheelAction: 'zoom'
		});
	}
});