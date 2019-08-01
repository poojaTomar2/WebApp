Cooler.Classification = {
	fnClassification: function (options) {
		var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
		mask.show();

	},
	show: function (options) {
		var action = options.action;
		var parentId = options.id;
		var title = options.title;
		var subTitle = options.subTitle;
		var url = EH.BuildUrl('Classification');
		url = String.format('{0}?ParentId={1}&action={2}', url, parentId, action);

		this.action = action;
		var treeLoader = new Ext.tree.TreeLoader({
			dataUrl: url,
			uiProviders: {
				'col': Ext.tree.ColumnNodeUI
			}
		});
		treeLoader.on('load', function (treeLoader, node, response) {
			var nodeToExpand = findChildRecursively(Cooler.Classification.tree.root, 'id', parentId);
			if (nodeToExpand) {
				nodeToExpand.expand();
			}
		});

		function findChildRecursively(tree, attribute, value) {
			var cs = tree.childNodes;
			for (var i = 0, len = cs.length; i < len; i++) {
				if (cs[i].attributes[attribute] == value) {
					return cs[i];
				}
				else {
					// Find it in this tree 
					if (found = findChildRecursively(cs[i], attribute, value)) {
						return found;
					}
				}
			}
			return null;
		}

		treeLoader.on('beforeload', function (myTreeLoader, node) {
			treeLoader.dataUrl = url
		}, this);


		if (!classificationWin) {

			var tree = new Ext.tree.ColumnTree({
				width: 600,
				height: 400,
				region: 'center',
				rootVisible: true,
				autoScroll: true,
				title: title,
				lines: true,
				columns: [{
					header: subTitle,
					width: 200,
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

			classificationForm = new Ext.form.FormPanel({
				items: [this.tree]
			});
			var classificationWin = new Ext.Window({
				width: 600,
				height: 400,
				modal: true,
				resizable: false,
				title: 'Customer Tier',
				items: [classificationForm],
				closeAction: 'hide',
				buttons: [{
					text: 'Add', handler: function () {
						//To Be optimized***
						var selectedRecords = this.tree.getSelectionModel().getSelectedNode();
						if (selectedRecords && selectedRecords.id > 0) {
							if (selectedRecords.attributes.associationTypeId === 2) { //TODO : associationTypeId 2 for Zone
								var combo = this.action === 'getCategory' ? Cooler.Customer.categoryCombo : Cooler.Location.zoneCombo;
								ExtHelper.SelectComboValue(combo, selectedRecords.attributes.associationId)
							} else {
								Ext.MessageBox.alert('Errors', 'Please select correct node.');
							}
						}
						this.classificationWin.hide();
					},
					scope: this
				}
				]
			},this);
			this.classificationForm = classificationForm;
			this.classificationWin = classificationWin;
		} else {
		}
		this.classificationWin.show();
		return false;
	}
}