Ext.define('Df.overrides.NavigationView', {

	override: 'Ext.navigation.View',

	// https://www.sencha.com/forum/showthread.php?173066-Pop-to-root-view-in-Ext.navigation.View
	setRoot: function (item) {
		this.reset();
		var navBar = this.getNavigationBar();
		navBar.backButtonStack = [];
		this.insert(0, item);
		this.pop();
	}

});