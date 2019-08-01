Ext.ux.PortletPlugin = {
	AUTO_IDs: {},
	init: function(panel) {
		//if you rely on auto-id's, then the ID in initComponent is invalid
		//the reason for this is that the ID is reset here during the init of the plugin, which
		//happens after initComponent is called.
		//The issue is, as your page grows, or if people simply come to the portal later from
		//another portion of the application, then the ext-comp id's may have already surpassed
		//the ids for the stored portlets.  This implementation gives the control an id of xtype-n
		//allowing you to use multiple portlets of the same type, but allowing them to save state
		//without risk of duplicating ids.
		//If you need to use auto-ids in initComponent, just copy this block of code to your
		//initComponent, changing this to Ext.ux.PortletPlugin
		//You may have issues if you have multiple portals using the same portlets.  If this is the
		//case, you will need to design your own ID system to handle it.  This is necessarily external
		//to the Portlet, because Portlets are created before being added to any particular portal,
		//and the best id system is probably something like PortalID-PortletXType-N

		var xtype = panel.xtype || panel.getXType();
		if (!this.AUTO_IDs[xtype])
			this.AUTO_IDs[xtype] = 0;
		if (panel.id.substring(0, 8) == 'ext-comp')
			panel.id = xtype + '-' + (++this.AUTO_IDs[xtype]);
		else if (panel.id.substring(0, xtype.length) == xtype)
			this.AUTO_IDs[xtype] = Math.max(this.AUTO_IDs[xtype], parseInt(panel.id.substr(xtype.length + 1)) + 1);

		panel.stateId = panel.id;
		//required settings - these will override anything set up in config or initComponent of extension
		//these attributes are required to make a portlet a portlet
		Ext.apply(panel, {
			anchor: '100%',
			frame: true,
			draggable: { ddGroup: 'portal' },
			hideBorders: true,
			cls: 'x-portlet'
		});
		//optional settings
		Ext.applyIf(panel, {
			collapsible: true,
			closeable: true,
			resizeable: true,
			tools: [],
			showSettingButton: true
		});
		
		if (typeof panel.settingHandler === 'function' && panel.showSettingButton == true) {
			panel.tools.push({
				id: 'gear',
				handler: panel.settingHandler,
				scope: panel
			});
		}
		if (typeof panel.refreshHandler === 'function') {
			panel.tools.push({
				id: 'refresh',
				handler: panel.refreshHandler,
				scope: panel
			});
		}
		if (panel.closeable) {
			panel.tools.push({
				id: 'close',
				handler: function(e, target, panel) {
					panel.ownerCt.remove(panel, true);
				}
			});
		}

		if (panel.resizeable) {
			panel.on('render', function() {
				panel.resizer = new Ext.Resizable(panel.el, {
					handles: 's',
					minHeight: 100,
					maxHeight: 800,
					pinned: true,
					resizeElement: function() {
						var box = this.proxy.getBox();
						panel.setSize(box);
						return box;
					}
				});
			});
		}
	}
};

