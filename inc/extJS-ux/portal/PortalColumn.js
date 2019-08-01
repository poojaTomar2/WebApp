Ext.ux.PortalColumn = Ext.extend(Ext.Container, {
	layout: 'anchor',
	autoEl: 'div',
	defaultType: 'portlet',
	cls: 'x-portal-column',
	initComponent: function() {
		Ext.ux.PortalColumn.superclass.initComponent.apply(this, arguments);
		this.on('render', this.addEventHandlers, this);
	},

	addEventHandlers: function() {
		this.on('remove', function(container, component) {
			Ext.state.Manager.clear(component.stateId || component.id);
			if (this.ownerCt.stateful) {
				this.ownerCt.saveState();
			}
		});
		this.on('add', function() {
			if (this.ownerCt.stateful) {
				this.ownerCt.saveState();
			}
		});
	}
});
Ext.reg('portalcolumn', Ext.ux.PortalColumn);