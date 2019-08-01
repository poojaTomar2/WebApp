/*global Ext: false, document: false, window: false */
Ext.ux.AccessibilityManager = Ext.extend(Ext.util.Observable, {
	constructor: function() {
		Ext.ux.AccessibilityManager.superclass.constructor.call(this);
		Ext.EventManager.on(Ext.getBody(), 'keydown', this.onKeyPress, this);
		this.addEvents({
			unhandledShortcut: true
		});
	},

	getDefaultTarget: function() {
		return document.activeElement;
	},

	onKeyPress: function(e) {
		var keyCode = e.getKey();
		if (this.handleGlobal(keyCode, e)) {
			return;
		}
		if (!keyCode || !e.altKey || keyCode === e.ALT) {
			return;
		}

		var charCode = String.fromCharCode(keyCode).toUpperCase();
		var target = e.getTarget();
		if (target.tagName === 'HTML') {
			target = this.getDefaultTarget();
		}
		var handled = false;
		var container;
		while (target) {
			target = Ext.fly(target).findParentNode('div');
			if (target) {
				var className = target.className.trim();
				if (className.indexOf('x-tab-panel') === 0 || className.indexOf('x-panel') === 0 || className.indexOf('x-window') === 0) {
					container = Ext.getCmp(target.id);
					if (container) {
						break;
					}
				}
			}
		}
		if (container) {
			if (keyCode === e.ONE) {
				this.navigateContainer(container, -1);
			} else if (keyCode === e.TWO) {
				this.navigateContainer(container, 1);
			} else {
				while (container && !handled) {
					handled = this.handleKeyPress(container, charCode, e);
					if (handled) {
						break;
					} else {
						container = container.ownerCt;
					}
				}
			}
		}
		if (!handled) {
			this.fireEvent('unhandledShortcut', charCode, e);
		}
	},

	navigateContainer: function(container, direction) {
		var handled = false;
		while (!handled) {
			var parent = container.ownerCt;
			if (parent === null || parent === undefined) {
				break;
			}
			var itemCount = parent.items.getCount();
			if (itemCount > 1) {
				var index = parent.items.indexOf(container);
				var newIndex = index;
				while (!handled) {
					newIndex += direction;
					if (newIndex === itemCount || newIndex === -1 || newIndex === index) {
						break;
					}
					var newCmp = parent.items.itemAt(newIndex);
					handled = this.tryFocus(newCmp, false);
					if (handled) {
						if (parent.isXType('tabpanel')) {
							parent.setActiveTab(newCmp);
						} else if (parent.layout && typeof parent.layout.setActiveItem === 'function') {
							parent.layout.setActiveItem(newCmp);
						}
					}
				}
			}
			if (!handled) {
				container = parent;
			}
		}
	},

	handleGlobal: function(keyCode, e) {
		var shortcuts = this.globalShortcuts;
		for (var i = 0, len = shortcuts.length; i < len; i++) {
			var keymap = shortcuts[i];
			if ((!keymap.shift || e.shiftKey) && (!keymap.ctrl || e.ctrlKey) && (!keymap.alt || e.altKey)) {
				if (keyCode === keymap.key) {
					if (keymap.handler.call(keymap.scope || window, keyCode, e) !== false) {
						e.stopEvent();
						return true;
					}
				}
			}
		}

		return false;
	},

	regExp: new RegExp("<u>([a-zA-Z])</u>", "i"),

	globalShortcuts: [


	],

	activateTab: function(tabPanel, tab) {
		tabPanel.setActiveTab(tab);
		this.tryFocus.defer(50, this, [tab]);
	},

	tryFocus: function(tab, considerToolbar) {
		var focusableItem = this.getFocusableItem(tab, considerToolbar);
		if (!focusableItem) {
			tab.cascade(function(item) {
				var it = this.getFocusableItem(item, considerToolbar);
				if (it && !focusableItem) {
					focusableItem = it;
				}
				if (focusableItem) {
					return false;
				}
			}, this);
		}
		if (focusableItem) {
			if (focusableItem.rendered) {
				this.focusItem(focusableItem);
			} else {
				focusableItem.on(Ext.version < "3" ? 'render' : 'afterrender', function() { this.focusItem(focusableItem); }, this, { single: true, delay: 50 });
			}
			return true;
		} else {
			return false;
		}
	},

	focusItem: function(item) {
		if (item.isXType('grid')) {
			var grid = item;
			var sm = grid.getSelectionModel();
			var rowSelection = false;
			var view = grid.getView();
			if (typeof sm.selectRow === 'function') {
				sm.selectRow(0);
				rowSelection = true;
				view.ensureVisible(0, 0);
				var cell = view.getCell(0, 0);
				cell.focus.defer(10, cell);
			} else {
				sm.select(0, 0);
				view.focusCell(0, 0);
			}
			this.focusFrame(grid);
			return;
		} else if (item.isXType('toolbar')) {
			item = item.items.find(function(item) { return !item.disabled; });
		}
		if (item) {
			item.focus(item.isFormField, 20);
			this.focusFrame(item);
		}
	},

	focusFrame: function(item) {
		if (!this.el) {
			this.el = Ext.DomHelper.append(document.body, { cls: 'ux-focusframe' }, true);
			this.unframeTask = new Ext.util.DelayedTask(function() {
				this.el.setVisible(false);
			}, this);
		}
		this.unframeTask.cancel();
		if (item.rendered) {
			this.frameItem.defer(20, this, [item]);
		} else {
			item.on('render', this.frameItem, this, { delay: 20 });
		}
	},

	frameItem: function(item) {
		var size = typeof item.getSize === 'function' ? item.getSize() : item.el.getSize();
		this.el.setSize(size.width, size.height);
		this.el.anchorTo(item.el, 'tl');
		this.el.setVisible(true);
		this.unframeTask.delay(1000);
	},

	getFocusableItem: function(item, considerToolbar) {
		if (item.isFormField && !item.disabled) {
			return item;
		} else {
			if (item.isXType('grid')) {
				if (item.getStore().getCount() > 0) {
					return item;
				} else {
					return this.getToolbarFocusItem(item.getTopToolbar());
				}
			}
			if (considerToolbar && item.isXType('panel')) {
				return this.getToolbarFocusItem(item.getTopToolbar());
			}
			var xtype = item.getXType();
			switch (xtype) {
				case "button":
				case "tbbutton":
					return true;
			}
		}
	},

	getToolbarFocusItem: function(tbar) {
		if (tbar && !tbar.disabled /*&& tbar.isVisible()*/) {
			var items = tbar.rendered ? tbar.items.items : (Ext.isArray(tbar) ? tbar : tbar.initialConfig.buttons);
			for (var i = 0, len = items.length; i < len; i++) {
				var item = items[i];
				if (item.text && !item.disabled/* && item.isVisible()*/) {
					return tbar;
				}
			}
		}
	},

	tryTabShortcut: function(tabPanel, charCode, e) {
		for (var i = 0, len = tabPanel.items.getCount(); i < len; i++) {
			var item = tabPanel.items.itemAt(i);
			if (!item.disabled && item.title) {
				var match = item.title.match(this.regExp);
				if (match && match.length == 2 && match[1].toUpperCase() === charCode) {
					this.activateTab(tabPanel, item);
					return true;
				}
			}
		}
		return false;
	},

	handleKeyPress: function(cmp, charCode, e) {
		if (!cmp || cmp.disabled || !cmp.isVisible()) {
			return false;
		}

		// allow handling of shortcut by the component itself
		if (typeof cmp.onShortcut == 'function' && cmp.onShortcut(cmp, charCode, e) === true) {
			e.stopEvent();
			return true;
		}

		var isPanel = cmp.isXType('panel');
		if (!isPanel) {
			return false;
		}
		var tabPanel = cmp instanceof Ext.TabPanel ? cmp : null;

		if (charCode === "1" || charCode === "2") {
			if (!tabPanel && cmp.ownerCt instanceof Ext.TabPanel) {
				tabPanel = cmp.ownerCt;
			}
			if (tabPanel) {
				e.stopEvent();
				var items = tabPanel.items;
				var activeTab = tabPanel.getActiveTab();
				var count = items.getCount();
				var increase = charCode === "1" ? -1 : 1;
				var index = items.indexOf(activeTab);
				var currentIndex = index;
				var newTab = null;
				while (newTab === null) {
					index = index + increase;
					if (index === count) {
						index = 0;
					} else if (index === -1) {
						index = count - 1;
					}
					if (index === currentIndex) {
						break;
					}
					if (!items.itemAt(index).disabled) {
						newTab = items.itemAt(index);
						break;
					}
				}
				if (newTab !== null) {
					this.activateTab(tabPanel, newTab);
				}
				return true;
			}
			return false;
		} else if (tabPanel !== null) {
			if (this.tryTabShortcut(tabPanel, charCode, e)) {
				e.stopEvent();
				return true;
			}
		}

		var buttons = cmp.buttons;
		var menuItem, tbar;
		if (Ext.isArray(buttons)) {
			menuItem = this.findItem(buttons, charCode);
		}

		if (!menuItem) {
			tbar = cmp.getTopToolbar();
			if (tbar) {
				menuItem = this.findItem(tbar.items.items, charCode);
			}
		}

		if (!menuItem) {
			tbar = cmp.getBottomToolbar();
			if (tbar) {
				menuItem = this.findItem(tbar.items.items, charCode);
			}
		}

		if (menuItem) {
			e.stopEvent();
			e.button = 0;
			menuItem.onClick.call(menuItem, e);
			return true;
		}
	},

	findItem: function(items, charCode) {
		for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i];
			if (this.isMatch(item, charCode)) {
				return item;
			}
		}
	},

	isMatch: function(item, charCode) {
		if (typeof item.getXType === 'function' && item.text) {
			var xtype = item.getXType();
			if (xtype === "button" || xtype === "tbbutton") {
				var match = item.text.match(this.regExp);
				if (match && match.length == 2 && match[1].toUpperCase() === charCode) {
					return true;
				}
			}
		}
		return false;
	}
});

Ext.ux.AccessibilityManager = new Ext.ux.AccessibilityManager();

Ext.Panel.override({

	onShortcut: function(panel, charCode, e) {
		var shortcuts = this.getShortcuts();
		var keys = shortcuts.keys;
		var i, len;
		for (i = 0, len = keys.length; i < len; i++) {
			var shortcut = keys[i];
			if (shortcut.key === charCode && (!shortcut.shift || e.shiftKey)) {
				return shortcut.handler.call(shortcut.scope || this, panel, charCode, e) !== false;
			}
		}
		if (shortcuts.tabPanels) {
			for (i = 0, len = shortcuts.tabPanels.length; i < len; i++) {
				if (Ext.ux.AccessibilityManager.tryTabShortcut(shortcuts.tabPanels[i], charCode, e)) {
					return true;
				}
			}
		}
	},

	getShortcuts: function() {
		if (!this.shortcuts) {
			this.shortcuts = { keys: [] };
		} else if (Ext.isArray(this.shortcuts)) {
			this.shortcuts = { keys: this.shortcuts };
		}
		return this.shortcuts;
	},

	addShortcut: function(items) {
		var shortcuts = this.getShortcuts();
		shortcuts.keys = shortcuts.keys.concat(items);
	}
});