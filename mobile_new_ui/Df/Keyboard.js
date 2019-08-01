﻿Ext.define('Df.Keyboard', {
	extend: 'Ext.Container',
	xtype: 'Keyboard',
	config: {
		activeField: null,
		height: 320,
		width: 900
	},
	keyboard: [
		['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', { text: "&larr;", keyType: "Bksp"}],
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', { text: '&#8629;', keyType: 'Enter'}],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
		['-', '_', '.', { text: " ", width: 200, value: " " }, '@', '.com', { text: "'",value : '\''}]
	],
addFocusListeners: function (component) {
		var fields;
		if (component.isField) {
			fields = [component];
		} else {
			fields = [];
			var items = component.query('[xtype="fieldset"]')[0].getItems().items;
			for (var i = 0, len = items.length; i < len; i++) {
				if (items[i].isField) {
					fields.push(items[i]);
				}
			}
		}
		var i, len;
		for (i = 0, len = fields.length; i < len; i++) {
			fields[i].on('focus', this.setActiveFormField, this);
		}
	},

	setActiveFormField: function (field) {
		this.setActiveField(field);
	},
	init: function (container) {
		this.addFocusListeners(container, true);
		this.on('add', function (container, component) {
			this.addFocusListeners(component);
		}, this);
		container.add(this);
	},
	initialize: function (container) {
		this.callParent(arguments);
		if(Ext.os.deviceType != 'Desktop'){
			return;
		}
		var items = [];
		var keyboard = this.keyboard;
		var row, rows, col, cols;
		for (row = 0, rows = keyboard.length; row < rows; row++) {
			var rowData = keyboard[row];
			var rowItems = [];
			for (col = 0, cols = rowData.length; col < cols; col++) {
				var buttonConfig = rowData[col];
				if (typeof buttonConfig === 'string') {
				if(buttonConfig.indexOf('.com')>-1&&row==4)
				{
				buttonConfig = { text: buttonConfig,width:'45px;' };
				}
				else if(buttonConfig.indexOf(' ')>-1&&row==4)
				{
				buttonConfig = { text: buttonConfig,width:'18%' };
				}
				else
				{
					         buttonConfig = { text: buttonConfig };
				}
	}
				rowItems.push(buttonConfig);
			}
			items.push({
				xtype: 'container',
				layout: {
					type: 'hbox',
					pack: 'center'
				},
				defaultType: 'button',
				defaults: {
					handler: this.onVirtualKeyPress,
					scope: this,
					height: 60,
					width: 60,
					style: 'margin-top:5px;margin-right:5px;'
				},
				items: rowItems
			});
		}
		this.add(items);
	
		
	},
	onVirtualKeyPress: function (btn, container) {
		var keyType = btn.keyType;
		var keyStroke = btn.getText();
		var field = this.getActiveField();
		if (!field) {
			return;
		}
		field.focus();
		if (keyStroke == '&larr;') {
			keyType = 'Bksp';
		}
		if (keyStroke == '&#8629;') {
			keyType = 'Enter';
		}
		if (keyType) {
			switch (keyType) {
				case 'Enter':
					if (typeof field.onEnter === 'function') {
						field.onEnter();
					}
					this.fireEvent('onEnter', field, this);
					break;
				case 'Bksp':
					var value = field.getValue();
				if (field.isXType('numberfield') && value) {
					field.setValue(value.toString().substr(0, value.toString().length - 1));
				} else if (value != null) {
					field.setValue(value.substr(0, value.length - 1));
				}
                   break;
			}
			return;
		}
		var updateValue = true;
		if (field && !field.disabled && typeof field.setValue === 'function' && typeof field.getValue === 'function') {
			var text = btn.getText();
			if (field.isXType('numberfield')) {
				if (isNaN(text)) {
					updateValue = false;
				}
			}
			if (updateValue) {
				if (field.getValue() === null) {
					field.setValue(text);
				} else {
					field.setValue(field.getValue() + text);
				}
			}
		}
	}
});