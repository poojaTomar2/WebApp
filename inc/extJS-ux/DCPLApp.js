// JScript File
// Base common layout code

DCPLApp = function () {
    this.addEvents(
        'beforeTabRemove',
        'beforeConfig'
    );
    DCPLApp.superclass.constructor.call(this);
};

Ext.extend(DCPLApp, Ext.util.Observable, {
    autoAssignIcon: true,

    onPanelRenderAssignIcon: function (panel) {
        var el = Ext.get(panel.ownerCt.getTabEl(panel));
        el.addClass('x-tab-with-icon');
        el.child('.x-tab-strip-text').dom.style.backgroundImage = 'url(' + panel.icon + ')';
        delete panel.icon;
    },

    AddTab: function (config) {
        var tab, centerTabPanel;
        centerTabPanel = this.TabPanel;

        if (config && config.id) {
            tab = Ext.getCmp(config.id);
        }
        if (!tab) {
            Ext.applyIf(config, {
                closeAction: 'hide',
                closable: true,
                layout: 'fit',
                autoScroll: true
            });
            if (config.uri) {
                config.items = [new Ext.ux.IFrameComponent({ id: config.tabId, url: config.uri })]
            }
            tab = new Ext.Panel(config);
            if (!config.iconCls && config.icon) {
                tab.on('render', this.onPanelRenderAssignIcon, this, { single: true });
            }
        } else {
            if (config.uri) {
                tab.items.get(0).setUrl(config.uri);
            };
        }
        centerTabPanel.add(tab);
        tab.show();
        return tab;
    },

    CloseTab: function (config) {
        var tab, centerTabPanel;
        centerTabPanel = this.TabPanel;

        if (config && config.id) {
            tab = Ext.getCmp(config.id);
            if (tab) {
                centerTabPanel.remove(tab);
            }
        }
    },

    onLinkClick: function (item) {
        var url = item.url, icon = item.icon, i;
        if (url) {
            if (url.substr(0, 7) === 'http://') {
                location.href = url;
            } else {
                if (url.indexOf("(") > -1) {
                    var result = eval(url);
                } else {
                    // open as absolute
                    if (url.substr(0, 1) === "-") {
                        location.href = url.substr(1);
                    } else if (url.substr(0, 1) === "+") {
                        window.open(url.substr(1));
                    } else {
                        var title = item.text;
                        if (url.substr(0, 1) === ":") {
                            url = url.substr(1);
                        }
                        this.AddTab({ title: title, uri: url, id: 'menu' + item.id, icon: icon });
                    }
                }
            }
        }
    },

    addChildTreeItems: function (data) {
        var config = [], j;
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            var menuItem = {
                text: item.text,
                url: item.url
            };
            if (item.children && item.children.length > 0) {
                menuItem.showDelay = 0;
                menuItem.menu = new Ext.menu.Menu({ items: this.addChildItems(item.children) });
                menuItem.menu.on('itemclick', this.onLinkClick, this);
            }
            config.push(menuItem);
        }
        return config;
    },

    addChildItems: function (data) {
        var config = [];
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            var menuItem = {
                text: item.text,
                url: item.url
            };
            if (item.children && item.children.length > 0) {
                menuItem.showDelay = 0;
                menuItem.menu = new Ext.menu.Menu({ items: this.addChildItems(item.children) });
                menuItem.menu.on('itemclick', this.onLinkClick);
            }
            config.push(menuItem);
        }
        return config;
    },

    assignIcons: function (data) {
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i], url = item.url, j;
            if (url && (j = url.indexOf(".ShowList("))) {
                var objName = url.substr(0, j), obj = eval(objName);
                if (obj && obj instanceof DA.Form) {
                    obj.icon = item.icon;
                }
            }
            if (item.children && item.children.length > 0) {
                this.assignIcons(item.children);
            }
        }
    },

    ShowTab: function (panel) {
        var centerTabPanel = this.TabPanel;
        if (panel.id) {
            var oldPanel = Ext.getCmp(panel.id);
            if (oldPanel) {
                if (!centerTabPanel.items.contains(oldPanel)) {
                    centerTabPanel.add(oldPanel);
                }
                centerTabPanel.activate(oldPanel);
                return;
            }
        }
        Ext.applyIf(panel, {
            closable: true,
            autoScroll: true
        });
        centerTabPanel.add(panel);
        panel.show();
    },

    fnCustomTreeHandler: function (menuTree) { },
    init: function () {
        //Code to disable backspace to take to previous screen
        var map = new Ext.KeyMap(document, [{
            key: Ext.EventObject.BACKSPACE,
            fn: function (key, e) {
                var t = e.target.tagName;
                var stopBackspace = false;
                if (t !== "INPUT" && t !== "TEXTAREA") {
                    stopBackspace = true;
                } else {
                    if (e.target.readOnly === true) {
                        stopBackspace = true;
                    }
                }
                if (stopBackspace) {
                    e.stopEvent();
                }
            }
        }]);

        this.fireEvent("beforeConfig", this);

        if (DA.Security && DA.Security.info) {
            var userId = DA.Security.info.UserId;
            if (!isNaN(userId)) {
                var topLinks = Ext.get("topLinks");
                if (topLinks != null) {
                    topLinks.removeClass("x-hidden");
                }
            }
        }

        if (this.initialConfig == undefined) {
            this.initialConfig = {}
        }

        var config = this.initialConfig;
        Ext.applyIf(config, {
            north: {},
            south: {},
            center: {},
            west: {},
            menuController: EH.BuildUrl('Menu'),
            warningMsg: true
        });

        if (config.north) {
            Ext.applyIf(config.north, {
                region: 'north',
                el: 'north',
                autoShow: true
            });
        }

        if (config.south) {
            Ext.applyIf(config.south, {
                region: 'south',
                el: 'south',
                margins: '5 0 5 0',
                autoShow: true
            });
        }
         
        var itemsList = [];
        for (var i = 0; i < config.center.items.length; i++) {
            var item = config.center.items[i];
            if (!item.securityModule) {
                //No Security
                itemsList.push(item);
            }
            else {
                if (DA.Security.HasPermission(item.securityModule)) {
                    itemsList.push(item);
                }
            }
        }
        config.center.items = itemsList;
        Ext.applyIf(config.center, {
            id: 'centerTabPanel',
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            autoDestroy: false,
            enableTabScroll: true,
            margins: '5 5 0 0',
            defaults: { hideMode: !Ext.isIE && !Ext.isSafari ? 'offsets' : 'display', animCollapse: false },
            listeners: {
            	tabchange: function (tabPanel, newTab, oldTab, index) {
            		DCPLApp.ActiveTab = newTab;
            	}
            },
            items: [
				{
				    title: 'Welcome',
				    closable: true,
				    autoLoad: config.welcomePage || 'Welcome.htm',
				    autoScroll: true
				}
			]
        });

        /* Dummy Center Tab Panel */
        var centerTabPanel = new Ext.TabPanel(config.center);

        centerTabPanel.on('beforeremove', function (tab, panel) {
            var args = {
                panel: panel
            };
            if (this.fireEvent("beforeTabRemove", this, args) == false) {
                return false;
            }
            panel.hide();
        }, this);

        var menuContainer = Ext.get('menuContainer');
        var horizontalMenu = menuContainer != null;

        var viewPortItems = [];

        if (this.autoAssignIcon && this.menu) {
            this.assignIcons(this.menu);
        }

        if (this.menu && horizontalMenu) {
            var topMenuBar = new Ext.ux.Menubar({
                orientation: "horizontal",
                items: this.addChildTreeItems(this.menu)
            });

            topMenuBar.show(menuContainer, "bl-bl");

            topMenuBar.on('itemclick', this.onLinkClick, this);
        } else {
            var menuTree = Ext.apply({
                id: 'menu-tree',
                region: 'west',
                title: 'Navigation',
                split: true,
                width: 175,
                minSize: 100,
                maxSize: 400,
                margins: '5 0 0 5',
                collapsible: true,
                rootVisible: false,
                lines: false,
                autoScroll: true,
                tbar: [],
                stateEvents: ["collapse", "expand"],
                getState: function () {
                    return { collapsed: this.collapsed };
                },
                root: new Ext.tree.AsyncTreeNode({
                    text: 'Menu',
                    expanded: true,
                    children: this.menu
                }),
                loader: new Ext.tree.TreeLoader({
                    dataUrl: config.menuController
                })
            }, config.west);

            if (DA.Security.info.IsSuperAdmin) {
                menuTree.ddGroup = 'dcplAppContextMenu';
                menuTree.enableDD = true;
            }

            menuTree = new Ext.tree.TreePanel(menuTree);
			menuTree.on('click', function (node, e) {
				if (!this.lastUrl) {
					this.lastUrl = node.attributes.url;
					DCPLApp.onLinkClick(node.attributes);
				}
				else if (this.lastUrl == node.attributes.url) {
					this.lastUrl = '';
				}
				else {
					this.lastUrl = node.attributes.url;
					DCPLApp.onLinkClick(node.attributes);
				}
			}, DCPLApp);
            if (DA.Security.info.IsSuperAdmin) {
                menuTree.on('contextmenu', DCPLApp.NavigationEditor.onNavigationContextMenu, DCPLApp.NavigationEditor);
                menuTree.on('nodedrop', DCPLApp.NavigationEditor.onNodeDrop, DCPLApp.NavigationEditor);
            }
            this.fnCustomTreeHandler(menuTree);
            viewPortItems.push(menuTree);
        }

        viewPortItems.push(centerTabPanel);
        if (config.south) {
            viewPortItems.push(new Ext.BoxComponent(config.south));
        }
        if (config.north) {
            viewPortItems.push(new Ext.BoxComponent(config.north));
        }

        var viewport = new Ext.Viewport({
            layout: 'border',
            items: viewPortItems
        });

        DCPLApp.TabPanel = centerTabPanel;
        DCPLApp.MenuTree = menuTree;

        var showFlashArticles = function () {
            DA.Article.controller = 'ArticleFlash';
            var grid = DA.Article.createGrid({ allowPaging: true, editable: true, baseParams: { action: 'list', PreferenceTypeId: 1} }, true);
            var store = grid.getStore();
            store.on('load', function (store, records, options) {
                if (records.length > 0) {
                    for (var i = 0; i < records.length; i++) {
                        DA.ShowArticle({ id: records[i].get('ArticleId'), body: records[i].get('Body'), title: records[i].get('Title'), createdBy: records[i].get('CreatedBy'), createdOn: records[i].get('CreatedOn') });
                    }
                }
            });
            grid.loadFirst();
            DA.Article.controller = 'Article';
        }

        var showBirthDay = function () {
            var button = new Ext.Button({ text: 'Do not show Birthday again' })
            var grid = DA.Birthday.createGrid({ allowPaging: true, editable: true });
            grid.getStore().on('load', function (store, records, options) {
                if (records.length > 0) {
                    //Show bubble
                    var msg = '';
                    for (var i = 0; i < records.length; i++) {
                        var r = records[i];
                        msg += r.get('Name') + '<br>';
                    }
                    msg += "<a href='javascript:DA.Birthday.doNotShowBirthDayNotification();' class='birthdayDoNotShow'>Do not show Birthday(s) for this month again</a>";
                    Ext.example.msg('Birthdays this month...', msg);
                }
            });
            grid.loadFirst();
        }
        var showNotifications = function (data) {
            for (var i = 0; i < data.key.length; i++) {
                var key = data.key[i]; // here data[i] will be there
                var value = data.value[i];
                var title = data.title[i];
                var html = '<b>' + key + '</b><br />' + value;
                new Ext.ux.Notification({
                    iconCls: 'x-icon-error',
                    title: title,
                    html: html,
                    autoDestroy: true,
                    hideDelay: 5000
                }).show(document);
            }
        }

        var getNotifications = function () {
            var params = { action: 'fillnotification' };
            ExtHelper.GenericConnection.request({
                url: EH.BuildUrl('BirthDay'),
                params: params,
                callback: function (o, success, response) {
                    if (!success) {
                        Ext.Msg.alert('Error', 'Error Occured');
                    }
                    else {
                        if (response.responseText != '') {
                            var data = Ext.util.JSON.decode(response.responseText);
                            var toReturn = [];
                            toReturn.key = [];
                            toReturn.value = [];
                            toReturn.title = [];

                            for (var i = 0; i < data.length; i++) {
                                var key = data[i].Key; // here data[i] will be there
                                var value = data[i].Value;
                                var title = data[i].Title;
                                if (value != null) {
                                    toReturn.key.push(key);
                                    toReturn.value.push(value);
                                    toReturn.title.push(title);
                                }
                            }
                            if (toReturn.value.length > 0) {
                                showNotifications(toReturn);
                            }
                        }
                    }
                },
                scope: this
            });
        }

        if (config.showNotifications) {
            getNotifications();
        }

        if (config.ShowFlashArticles) {
            showFlashArticles();
        }

        if (config.ShowBirthdayNotification) {
            if (DA.Security.HasPermission('BirthDayNotification', 'Module')) {
                showBirthDay();
            }
        }

        var divTheme = Ext.get('divTheme');
        if (divTheme) {
            var themeCombo = new Ext.ux.ThemeCombo({ renderTo: divTheme });
        }

        var objTicker = Ext.get('TICKER');
        if (objTicker) {
            ticker_start();
            var tickerPreferenceTypeId = DCPLApp.initialConfig.TickerPreferenceId;
            if (!tickerPreferenceTypeId) {
            	tickerPreferenceTypeId = -290;
            }
            var store = new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({
                    url: 'controllers/Feed-Proxy.ashx'
                }),

                baseParams: { preferenceTypeId: tickerPreferenceTypeId },

                reader: new Ext.data.XmlReader(
					{ record: 'item' },
					['title', 'author', { name: 'pubDate', type: 'date' }, 'link', 'description', 'content']
				)
            });

            var loadTickerContent = function () {
                var data = '';
                store.each(function (record) {
                    var link = '';
                    if (!isNaN(record.get('description')) && record.get('description')) {
                        link = "javascript:DA.ShowArticle({ id:" + record.get('description') + "});";
                    }
                    if (!link) {
                        link = '#';
                    }
                    var info = String.format('<a href="{0}" class="ticker_text">', link) + record.get('title') + '</a>';
                    /*
                    if (record.get('link').length > 0) {
                    info = '<a href="' + record.get('link') + '">' + info + '</a>';
                    }
                    */
                    if (data.length > 0) {
                        data += ' | ';
                    }
                    data += info;
                });
                var objTicker = Ext.get('TICKER_BODY');
                if (objTicker && objTicker.dom) {
                	objTicker.dom.innerHTML = data;
                }
            }

            store.on('load', function () {
                loadTickerContent();
            });

            store.load();

            // Start a simple clock task that updates a div once per second
            var task = {
                run: function () {
                    store.load();
                },
                interval: 900000 //900 seconds
            }
            var runner = new Ext.util.TaskRunner();
            runner.start(task);
        }

        if (config.warningMsg) {
            this.warningMsg = true;
            Ext.EventManager.on(window, 'beforeunload', this.beforeUnload, this);
        }
        return;
    },

    beforeUnload: function (e) {
        if (this.warningMsg) {
            e.browserEvent.returnValue = "All unsaved data will be lost";
        }
    },

    refreshMenu: function () {
        var tree = this.MenuTree;
        var root = tree.getRootNode();
        delete root.attributes.children; // remove preloaded nodes
        root.reload();
    }
});

DCPLApp = new DCPLApp();

Ext.onReady(DCPLApp.init, DCPLApp);