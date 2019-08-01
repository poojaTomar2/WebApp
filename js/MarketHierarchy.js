Cooler.MarketHierarchy = {
	show: function (options) {
		var action = options.action;
		var title = options.title;
		var subTitle = options.subTitle;
		var url = EH.BuildUrl('MarketHierarchy');
		url = String.format('{0}?action={1}', url, action);
		this.url = url;
		this.action = action;
		var treeLoader = new Ext.tree.TreeLoader({
			dataUrl: url,
			uiProviders: {
				'col': Ext.tree.ColumnNodeUI
			}
		});
		this.treeLoader = treeLoader;
		treeLoader.on('load', this.onTreeLoad, this);
		treeLoader.on('beforeload', this.onBeforeload, this);
		var tree = new Ext.tree.ColumnTree({
			width: 285,
			height: 325,
			region: 'center',
			rootVisible: true,
			autoScroll: true,
			title: title,
			lines: true,
			columns: [
				{
					header: subTitle,
					width: 280,
					dataIndex: 'text'
				}
			],
			loader: treeLoader,
			root: new Ext.tree.AsyncTreeNode({
				text: title,
				uiProvider: Ext.tree.ColumnNodeUI
			})
		});
		this.tree = tree;
		var marketHierarchyForm = new Ext.form.FormPanel({
			items: [this.tree]
		});
		var marketHierarchyWin = new Ext.Window({
			width: 300,
			height: 400,
			modal: true,
			resizable: false,
			autoScroll: true,
			constrain: true,
			title: 'MarketHierarchy',
			items: [marketHierarchyForm],
			closeAction: 'hide',
			buttons: [
				{
					text: 'Add',
					handler: this.onAdd,
					scope: this
				}
			]
		}, this);
		this.marketHierarchyWin = marketHierarchyWin;
		this.marketHierarchyWin.show();
	},
	onTreeLoad: function () {
		var nodeToExpand = this.findChildRecursively(Cooler.MarketHierarchy.tree.root);
		if (nodeToExpand) {
			nodeToExpand.expand();
		}
	},
	onBeforeload: function () {
		this.treeLoader.dataUrl = this.url;
	},
	findChildRecursively: function (tree, attribute, value) {
		var childNodes = tree.childNodes;
		for (var i = 0, len = childNodes.length; i < len; i++) {
			var node = childNodes[i];
			if (node.attributes[attribute] == value) {
				return node;
			}
			else {
				// Find it in this tree 
				if (found == this.findChildRecursively(node, attribute, value)) {
					return found;
				}
			}
		}
		return null;
	},
	onAdd: function () {
		var selectedRecords = this.tree.getSelectionModel().getSelectedNode();
		if (selectedRecords && selectedRecords.id > 0) {
			ExtHelper.SelectComboValue(Cooler.Location.market, selectedRecords.id);
		} else {
			Ext.MessageBox.alert('Errors', 'Please select correct node.');
		}
		this.marketHierarchyWin.hide();
	}
};