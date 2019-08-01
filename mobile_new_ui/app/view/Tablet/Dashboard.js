Ext.define('CoolerIoTMobile.view.Tablet.Dashboard', {
	extend: 'Ext.Container',
	xtype: 'tablet-dashboard',
	config: {
		layout: 'hbox'
	},

	initialize: function () {
		this.setItems([
			{
				xtype: 'container',
				layout: 'fit',
				width: "10em",
				items: [
					{
						xtype: 'toolbar',
						cls: 'iot-toolbar',
						docked: 'top',
						items: [
							{
								xtype: 'image',
								src: 'resources/icons/icon-white.png',
								height: 40,
								width: 130
							}
						]
					}, {
						xtype: 'list',
						flex: 1,
						itemCls: 'navigation-list',
						itemId: 'navigation-list',
						itemTpl: '<div class="listItem"><div class="listImage"><img src={icon}></div>{title}</div>',
						data: [
							{
								itemId: 'LoggedInUser',
								title: Df.SecurityInfo.tags.FirstName,
								icon: 'resources/icons/user_female2-32.png'
							}, {
								title: 'My Team',
								icon: 'resources/icons/Users-Group-icon.png'
							}, {
								title: 'My Territory',
								icon: 'resources/icons/Maps-Geo-Fence-icon.png'
							}, {
								title: 'My Task',
								icon: 'resources/icons/Finance-Bill-icon.png'
							}, {
								title: 'Dashboard',
								icon: 'resources/icons/bar_chart-32.png'
							}, {
								title: 'Targets',
								icon: 'resources/icons/target.png'
							}, {
								title: 'My Library',
								icon: 'resources/icons/courses-32.png'
							}, {
								title: 'Coolers',
								icon: 'resources/icons/fridge-32.png'
							}, {
								title: 'Sync',
								icon: 'resources/icons/update-32.png'
							}, {
								title: 'Logout',
								icon: 'resources/icons/logout-32.png'
							}
						]
					}
				]
			},
			{
				xtype: 'tablet-main',
				flex: 1
			}
		]);
		this.callParent(arguments);
	}
});