DA.Map = function(options) {
	Ext.apply(this, options);
};

Ext.extend(DA.Map, Ext.util.Observable, {
	markers: [],
	show: function(options) {
		if (!this.win) {
			// create form panel
			var driverLocation = new Ext.form.Checkbox({ name: 'DriverLocation', fieldLabel: 'Driver Location' });
			var shipperLocation = new Ext.form.Checkbox({ name: 'ShipperLocation', fieldLabel: 'Shipper Location' });
			var pickupLocation = new Ext.form.Checkbox({ name: 'PickupLocation', fieldLabel: 'Pickup Location' });
			var deliveryLocation = new Ext.form.Checkbox({ name: 'DeliveryLocation', fieldLabel: 'Delivery Location' });
			var trailerLocation = new Ext.form.Checkbox({ name: 'TrailerLocation', fieldLabel: 'Trailer Location' });
			var location = new ExtHelper.CreateCombo({ fieldLabel: 'Location', hiddenName: 'Location', store: 'location', storeMinValue: 30, storeMaxValue: 240, storeIncrement: 30, width: 120 });
			var numberOfLocation = new Ext.form.NumberField({ fieldLabel: 'Number Of Location(s)', hiddenName: 'numberOfLocation', width: 60 });
			var miles = new Ext.form.NumberField({ fieldLabel: 'Miles', hiddenName: 'Miles', width: 60 });

			var upperpanel = new Ext.Panel({
				autoScroll: false,
				layout: 'table',
				layoutConfig: { columns: 4, columnWidth: .25 },
				region: 'north',
				border: false,
				height: 80,
				defaults: { bodyStyle: 'padding:0px 20px 1px 0px', border: false, layout: 'form', labelWidth: 100, valign: 'top' },
				items: [{ items: [driverLocation] }, { items: [shipperLocation] }, { items: [pickupLocation] }, { items: [deliveryLocation] }, { items: [trailerLocation] }, { items: [location] }, { items: [numberOfLocation] }, { items: [miles]}]
			});
			
			var formPanel = new Ext.form.FormPanel({
				//labelWidth: 100,
				bodyStyle: "padding:5px;",
				fileUpload: true,
				plugins: [ExtHelper.Plugins.ExceptionHandler],
				url: EH.BuildUrl('WithSessionImport'),
				layout: 'border',
				items: [upperpanel,
                    { html: 'x', id: 'mapdiv', region: 'center' }
                ]
			});

			// define window
			var window = new Ext.Window({
				title: 'Locations',
				width: 900,
				height: 450,
				layout: 'fit',
				modal: true,
				plain: true,
				closeAction: 'hide',
				items: [formPanel]
			});

			this.formPanel = formPanel;
			this.win = window;
		}
		this.formPanel.form.reset();

		this.win.show();
		/////////////////////////
		this.options = options;
		var markers;
		var extraRows;
		if (options) {
			markers = options.markers;
			extraRows = options.extraRows;
			var mapColumn;
			if (options.mapColumn) {
				mapColumn = options.mapColumn;
			} else {
				mapColumn = 'MapAddress';
			}
			var ds = options.ds;
			if (!ds && options.grid) {
				ds = options.grid.getStore();
				options.ds = ds;
			}
			markers = [];
			var index = 0;
			ds.each(function(record) {
				var existWithSameAddress = 0;
				var address = record.get(mapColumn);
				if (address.length !== 0) {
					for (var i = 0; i < markers.length; i++) {
						if (markers[i].geoCodeAddr == address) {
							existWithSameAddress = i;
						}
					}
					if (existWithSameAddress > 0) {
						var existingRecord = markers[existWithSameAddress].record;
						var existingOrder = existingRecord.get('OrderNumber');
						if (existingOrder !== record.get('OrderNumber')) {
							markers[existWithSameAddress].OrderNumbers += ', ' + record.get('OrderNumber');
						}
					}
					else {
						var marker = {
							geoCodeAddr: address,
							marker: { title: address },
							record: record,
							rowIndex: index++,
							listeners: options.listeners,
							isCenter: record.get('IsCenter'),
							OrderNumbers: record.get('OrderNumber')
						};
						markers.push(marker);
					}
				}
			}, this);
			if (extraRows && extraRows.length > 0) {
				for (var i = 0; i < extraRows.length; i++) {
					var record = extraRows[i];
					var address = record.get(mapColumn);
					if (address.length !== 0) {
						var marker = {
							geoCodeAddr: address,
							marker: { title: address },
							record: record,
							rowIndex: index++,
							listeners: options.listeners,
							isCenter: record.get('IsCenter')
						};
						markers.push(marker);
					}
				}
			}
		}
		///////////////////////////
		this.renderMap(markers);
	},
	renderMap: function(markers) {
		// create mxn object
		var m = new mxn.Mapstraction('mapdiv', 'google');
		m.addControls({ zoom: 'small' });

		//		m.addControls({
		//			pan: true,
		//			zoom: 'small',
		//			map_type: true
		//		});

		function geocode_return(geocoded_location) {
			// display the map centered on a latitude and longitude (Google zoom levels)
			m.setCenterAndZoom(geocoded_location.point, 3);

			// create a marker positioned at a lat/lon
			geocode_marker = new mxn.Marker(geocoded_location.point);

			var address = geocoded_location.address;
			//+", "
			//  + geocoded_location.locality + ", "
			//+ geocoded_location.region;

			var addlInfo = geocoded_location.addlInfo;
			geocode_marker.setLabel(addlInfo.OrderNumbers);
			var html = "";
			html += "<tr><td><b>Order Number(s):</b></td><td>" + addlInfo.OrderNumbers;
			html += "<tr><td><b>Location:</b></td><td>" + address;
			var finalHtml = "<table class='GMapMarkerToolTip'>" + html + "</table>";

			geocode_marker.setInfoBubble(finalHtml);

			// display marker 
			m.addMarker(geocode_marker);

			// open the marker
			//geocode_marker.openBubble();
		}

		if (markers && markers.length > 0) {
			for (var i = 0; i < markers.length; i++) {
				if (markers[i].geoCodeAddr && markers[i].geoCodeAddr.length > 0) {
					var addlInfo = {};
					addlInfo.OrderNumbers = markers[i].OrderNumbers;
					var geocoder = new MapstractionGeocoder(geocode_return, addlInfo, 'google');
					var address = new Object();
					address.street = markers[i].geoCodeAddr;
					address.locality = "";
					address.region = "";
					address.country = "";
					geocoder.geocode(address);
				}
				else {
					alert(markers[i].geoCodeAddr);
				}
			}
		}
	}
});
