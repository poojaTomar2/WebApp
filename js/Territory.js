Cooler.Territory = {
	fnClassification: function (options) {
		var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
		mask.show();

	},
	show: function (options) {
		var action = options.action;
		var parentId = options.id;
		var title = options.title;
		var subTitle = options.subTitle;
		var url = EH.BuildUrl('Territory');
		url = String.format('{0}?ParentId={1}&action={2}', url, parentId, action);

		this.action = action;
		var treeLoader = new Ext.tree.TreeLoader({
			dataUrl: url,
			uiProviders: {
				'col': Ext.tree.ColumnNodeUI
			}
		});
		treeLoader.on('load', function (treeLoader, node, response) {
			var nodeToExpand = findChildRecursively(Cooler.Territory.tree.root, 'id', parentId);
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


		if (!territoryWin) {

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
				},
				{
					header: 'Manager',
					width: 200,
					dataIndex: 'manager'
				}
				],

				loader: treeLoader,
				root: new Ext.tree.AsyncTreeNode({
					text: title,
					uiProvider: Ext.tree.ColumnNodeUI
				})
			});
			var treeCol = new Ext.tree.ColumnTreeEditor(tree, {
				completeOnEnter: true,
				autosize: true,
				ignoreNoChange: true
			});
			this.tree = tree;

			territoryForm = new Ext.form.FormPanel({
				items: [this.tree]
			});
			var territoryWin = new Ext.Window({
				width: 600,
				height: 400,
				modal: true,
				resizable: false,
				title: 'Territory',
				items: [territoryForm],
				closeAction: 'hide',
				buttons: [{
					text: 'Select', handler: function () {
						//To Be optimized***
						var selectedRecords = this.tree.getSelectionModel().getSelectedNode(); 
						if (selectedRecords && selectedRecords.id > 0) {
							if (selectedRecords.attributes.associationTypeId === 2) {   // AssociationTypeId 2 for Zone
								Cooler.Location.zonetrigger.setValue(selectedRecords.attributes.text); 
								ExtHelper.SetComboValue(Cooler.Location.countryCombo, selectedRecords.parentNode.parentNode.parentNode.id)

							} else {
								Ext.MessageBox.alert('Errors', 'Please select correct node.');
							}
						}
						this.territoryWin.hide();
					},
					scope: this
				}
				]
			}, this);
			this.territoryForm = territoryForm;
			this.territoryWin = territoryWin;
		} else {
		}
		this.territoryWin.show();
		return false;
	}
}