Ext.define('CoolerIoTMobile.view.Mobile.CoolerImage', {
	extend: 'Ext.Panel',
	xtype: 'coolerImage',
	config: {
		centered: true,
		height: '80%',
		width: '80%',
		modal: true,
		hideOnMaskTap: true,
		scrollable: false,
		responseTitle: CoolerIoTMobile.Localization.CoolerImages,
		hideAnimation: {
			type: 'popOut',
			duration: 200,
			easing: 'ease-out'
		},
		showAnimation: {
			type: 'popIn',
			duration: 200,
			easing: 'ease-out'
		},
		layout: 'fit',
		items: [
           {

           	xtype: 'carousel',
           	items: [{
           		xtype: 'image',
           		itemId: 'camera_1',
           		src: ''
           	}, {
           		xtype: 'image',
           		itemId: 'camera_2',
           		src: ''
           	}]
           }]
	}
});