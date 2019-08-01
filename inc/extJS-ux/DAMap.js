DA.Map = function(options) {

    Ext.apply(this, options);
};

Ext.extend(DA.Map, Ext.util.Observable, {
	template: new Ext.XTemplate(
        '<table>',
        '<tpl for="data">',
        '<tr><td>{header}</td><td>{value}</td></tr>',
        '</tpl>',
        '</table>'
    ).compile(),

	clickHandler: function() {
		var options = this.mapPanel.options;
		var infoProps = options.infoProperties;
		if (infoProps && Ext.isArray(infoProps) && infoProps.length > 0) {
			var grid = options.grid;
			if (grid) {
				var view = grid.getView();
				var cm = grid.getColumnModel();
				var rowIndex = this.params.rowIndex;
				var html = "";
				var record = this.params.record;
				Ext.each(infoProps, function(prop) {
					var colIndex = cm.getIndexById(prop.columnId);
					if (colIndex == -1) {
						var columns = cm.getColumnsBy(function(col) { return col.dataIndex == prop.columnId; });
						if (columns && columns.length > 0) {
							var column = columns[0];
							colIndex = cm.getIndexById(column.id);
						}
					}
					if (colIndex > -1) {
						var p = { id: prop.columnId, css: "", attr: "" };
						var renderer = cm.getRenderer(colIndex);
						var dataIndex = cm.getDataIndex(colIndex);
						html += "<tr><td>" + cm.getColumnHeader(colIndex) + " : </td><td>" + renderer(record.get(dataIndex), p, record, rowIndex, colIndex, options.ds);
					} else {
						alert('Invalid column: ' + prop.columnId);
					}
				});
				var finalHtml = "<table class='GMapMarkerToolTip'>" + html + "</table>";
				this.marker.openInfoWindowHtml("<table>" + html + "</table>");
			}
		}
	},

	show: function(options) {
		this.options = options;
		var markers = options.markers;
		var extraRows = options.extraRows;
		var mapColumn;
		if (options.mapColumn) {
			mapColumn = options.mapColumn;
		} else {
			mapColumn = 'MapAddress';
		}
		if (!Ext.isArray(markers)) {
			var ds = options.ds;
			if (!ds && options.grid) {
				ds = options.grid.getStore();
				options.ds = ds;
			}

			markers = [];

			var index = 0;
			ds.each(function(record) {
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

			var hasCenterDefined = false;
			for (var i = 0; i < markers.length; i++) {
				if (markers[i].isCenter == true) {
					hasCenterDefined = true;
				}
			}

			if (!hasCenterDefined && markers.length > 0) {
				markers[0].isCenter = true; //Making the first marker as center
			}
		}

		var width = 700;
		var directionsPanelWidth = 300;
		var totalWidth = width;
		if (options.showDirections) {
			totalWidth += directionsPanelWidth;
		}

		if (!this.mapWin) {
			this.mapPanel = new Ext.ux.GMapPanel({
				gmapType: 'map',

				mapConfOpts: ['enableScrollWheelZoom', 'enableDoubleClickZoom', 'enableDragging'],
				mapControls: ['GSmallMapControl', 'GMapTypeControl', 'NonExistantControl'],
				width: width,
				region: 'center'

			});

			//Creating grids
			var driverLocationGrid = TLS.MapLists.DriverLocation.createGrid({ title: 'Driver Location', border: true, height: 120, allowPaging: true });
			var shipperLocationGrid = TLS.MapLists.ShipperLocation.createGrid({ title: 'Shipper Location', border: true, height: 120, allowPaging: true });
			var pickupLocationGrid = TLS.MapLists.PickupLocation.createGrid({ title: 'Pickup Location', border: true, height: 120, allowPaging: true });
			var deliveryLocationGrid = TLS.MapLists.DeliveryLocation.createGrid({ title: 'Delivery Location', border: true, height: 120, allowPaging: true });
			var trailerLocationGrid = TLS.MapLists.TrailerLocation.createGrid({ title: 'Trailer Location', border: true, height: 120, allowPaging: true });
			var appConfigMappingLogoGrid = TLS.MapLists.AppConfigMappingLogo.createGrid({ title: 'Mapping Logo', border: true, height: 120, allowPaging: true });
			// create form panel
			var driverLocation = new Ext.form.Checkbox({ name: 'DriverLocation', fieldLabel: 'Driver Location' });
			var shipperLocation = new Ext.form.Checkbox({ name: 'ShipperLocation', fieldLabel: 'Shipper Location' });
			var pickupLocation = new Ext.form.Checkbox({ name: 'PickupLocation', fieldLabel: 'Pickup Location' });
			var deliveryLocation = new Ext.form.Checkbox({ name: 'DeliveryLocation', fieldLabel: 'Delivery Location' });
			var trailerLocation = new Ext.form.Checkbox({ name: 'TrailerLocation', fieldLabel: 'Trailer Location' });
			var trafficSignalCheckbox = new Ext.form.Checkbox({ name: 'TrafficSignals', fieldLabel: 'Traffic Signals' });
			var location = new ExtHelper.CreateCombo({ fieldLabel: 'Location', hiddenName: 'Location', baseParams: { comboType: 'LocationList' }, controller: "Combo", storeMinValue: 30, storeMaxValue: 240, storeIncrement: 30, width: 120, listWidth: 250 });

			//var settlementStatusCombo = DA.combo.create({ baseParams: { comboType: 'SettlementStatus' }, controller: "Combo" });
			//var location = new ExtHelper.CreateCombo({ fieldLabel: 'Location', hiddenName: 'Location',store: 'LocationList', storeMinValue: 30, storeMaxValue: 240, storeIncrement: 30, width: 120 });
			var numberOfLocation = new Ext.form.NumberField({ fieldLabel: 'Number Of Location(s)', hiddenName: 'numberOfLocation', width: 60, allowDecimals: false });
			var miles = new Ext.form.NumberField({ fieldLabel: 'Miles', hiddenName: 'Miles', width: 60 });

			var mapButton = new Ext.Button({ text: 'Search', handler: function() {
				// check form value

				//                driverLocation.on('check', function(cb, ischecked) {
				//                    var store = driverLocationGrid.getStore();
				//                    store.baseParams.originId = location.getValue();
				//                    store.baseParams.oMiles = miles.getValue();
				//                    driverLocationGrid.loadFirst();
				//                }, this);
				//                shipperLocation.on('check', function(cb, ischecked) {
				//                    var store = shipperLocation.getStore();
				//                    store.baseParams.originId = location.getValue();
				//                    store.baseParams.oMiles = miles.getValue();
				//                    shipperLocation.loadFirst();
				//                }, this);

				//                pickupLocation.on('check', function(cb, ischecked) {
				//                    var store = pickupLocation.getStore();
				//                    store.baseParams.originId = location.getValue();
				//                    store.baseParams.oMiles = miles.getValue();
				//                    pickupLocation.loadFirst();
				//                }, this);
				//                deliveryLocation.on('check', function(cb, ischecked) {
				//                    var store = deliveryLocation.getStore();
				//                    store.baseParams.originId = location.getValue();
				//                    store.baseParams.oMiles = miles.getValue();
				//                    deliveryLocation.loadFirst();
				//                }, this);
				//                trailerLocation.on('check', function(cb, ischecked) {
				//                    var store = trailerLocation.getStore();
				//                    store.baseParams.originId = location.getValue();
				//                    store.baseParams.oMiles = miles.getValue();
				//                    trailerLocation.loadFirst();
				//                }, this);


				if (1 == 1) {
					var driverStore = driverLocationGrid.getStore();
					driverStore.baseParams.originId = location.getValue();
					driverStore.baseParams.oMiles = miles.getValue();
					driverLocationGrid.loadFirst();

					var shipperStore = shipperLocationGrid.getStore();
					shipperStore.baseParams.originId = location.getValue();
					shipperStore.baseParams.oMiles = miles.getValue();
					shipperLocationGrid.loadFirst();

					var pickupStore = pickupLocationGrid.getStore();
					pickupStore.baseParams.originId = location.getValue();
					pickupStore.baseParams.oMiles = miles.getValue();
					pickupLocationGrid.loadFirst();

					var deliveryStore = deliveryLocationGrid.getStore();
					deliveryStore.baseParams.originId = location.getValue();
					deliveryStore.baseParams.oMiles = miles.getValue();
					deliveryLocationGrid.loadFirst();

					var trailerStore = trailerLocationGrid.getStore();
					trailerStore.baseParams.originId = location.getValue();
					trailerStore.baseParams.oMiles = miles.getValue();
					trailerLocationGrid.loadFirst();
					
					appConfigMappingLogoGrid.loadFirst();

				} else {
					Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
				}

			}, scope: this
			});



			this.upperpanel = new Ext.Panel({
				autoScroll: false,
				layout: 'table',
				layoutConfig: { columns: 4, columnWidth: .25 },
				region: 'north',
				border: false,
				height: 80,
				defaults: { bodyStyle: 'padding:0px 20px 1px 0px', border: false, layout: 'form', labelWidth: 110, valign: 'top' },
				items: [{ items: [driverLocation] }, { items: [shipperLocation] }, { items: [pickupLocation] }, { items: [deliveryLocation] }, { items: [trailerLocation] }, { items: [location] }, { items: [numberOfLocation] }, { items: [miles] }, { items: [trafficSignalCheckbox] }, { items: [mapButton]}]
			});

			var items = [this.mapPanel];
			this.directionsPanel = new Ext.Panel({ region: 'east', html: '<div id="gmapdirections">Directions</div>', width: directionsPanelWidth, autoScroll: true });
			items.push(this.directionsPanel);
			items.push(this.upperpanel);

			//Loading grids data
			driverLocationGrid.loadFirst();
			shipperLocationGrid.loadFirst();


			driverLocation.on('check', function(cb, ischecked) {
				if (ischecked) {
					this.setMarkersForStore({ store: this.driverLocationGrid.getStore(), gridId: 'driver', scope: this });
				} else {
					this.removeMarkers({ gridId: 'driver', scope: this });
				}
			}, this);


			shipperLocation.on('check', function(cb, ischecked) {
				if (ischecked) {
					this.setMarkersForStore({ store: this.shipperLocationGrid.getStore(), gridId: 'shipper', scope: this });
				} else {
					this.removeMarkers({ gridId: 'shipper', scope: this });
				}
			}, this);

			pickupLocation.on('check', function(cb, ischecked) {
				if (ischecked) {
					this.setMarkersForStore({ store: this.pickupLocationGrid.getStore(), gridId: 'pickup', scope: this });
				} else {
					this.removeMarkers({ gridId: 'pickup', scope: this });
				}
			}, this);

			deliveryLocation.on('check', function(cb, ischecked) {
				if (ischecked) {
					this.setMarkersForStore({ store: this.deliveryLocationGrid.getStore(), gridId: 'delivery', scope: this });
				} else {
					this.removeMarkers({ gridId: 'delivery', scope: this });
				}
			}, this);

			trailerLocation.on('check', function(cb, ischecked) {
				if (ischecked) {
					this.setMarkersForStore({ store: this.trailerLocationGrid.getStore(), gridId: 'trailer', scope: this });
				} else {
					this.removeMarkers({ gridId: 'trailer', scope: this });
				}
			}, this);

			trafficSignalCheckbox.on('check', function(cb, isChecked) {
				if (isChecked) {
					this.showTrafficSignals();
				} else {
					this.removeTrafficSignals();
				}
			}, this);

			var grids = [
            driverLocationGrid,
            shipperLocationGrid,
            pickupLocationGrid,
            deliveryLocationGrid,
            trailerLocationGrid,
            appConfigMappingLogoGrid
            ];

			this.childGrids = grids;
			this.driverLocationGrid = driverLocationGrid;
			this.shipperLocationGrid = shipperLocationGrid;
			this.pickupLocationGrid = pickupLocationGrid;
			this.deliveryLocationGrid = deliveryLocationGrid;
			this.trailerLocationGrid = trailerLocationGrid;
			this.appConfigMappingLogoGrid = appConfigMappingLogoGrid;


			var tabPanel = new Ext.TabPanel({
				region: 'south',
				height: 200,
				enableTabScroll: true,
				activeTab: 0,
				defaults: { layout: 'fit', border: false },
				layoutOnTabChange: true,
				items: [
                driverLocationGrid,
                shipperLocationGrid,
                pickupLocationGrid,
                deliveryLocationGrid,
                trailerLocationGrid,
                appConfigMappingLogoGrid
                ]
			});

			items.push(tabPanel);

			DA.Map.tabPanel = tabPanel;


			this.mapWin = new Ext.Window({
				layout: 'border',
				title: 'Locations',
				closeAction: 'hide',
				width: totalWidth,
				height: 560,
				items: items
			});
		}

		this.directionsPanel.setVisible(options.showDirections);
		this.mapWin.show();
		this.mapWin.setWidth(totalWidth);
		var map = this.mapPanel.getMap();
		map.clearOverlays();
		if (markers.length > 0) {
			this.setMarkers(markers);
		}

	},
	gridId: null,
	addlMarkers1: [],
	addlMarkers2: [],
	addlMarkers3: [],
	addlMarkers4: [],
	addlMarkers5: [],
	setMarkersForStore: function(options) {
		var store = options.store;
		var gridId = options.gridId;
		var scope = options.scope;
		var pointsToMap = [];
		var notFound = 0;

		scope.gridId = gridId;

		store.each(function(record) {
			var address = record.get('Location');
			if (address.length != 0) {
				var marker = {
					geoCodeAddr: address,
					marker: { title: address },
					record: record,
					gridId: gridId,
					icon: '../images/map-icon/TruckYellow.png'// + icon
				}
				if (address.length !== 0) {
					pointsToMap.push(marker);
				}
			} else {
				notFound++;
			}
		});
		if (notFound > 0) {
			Ext.Msg.alert('Alert', notFound + ' ' + gridId + ' doesnt have location addresses');
		}
		if (pointsToMap.length > 0) {
			this.setMarkers(pointsToMap);
		}
	},
	removeMarkers: function(options) {
		var gridId = options.gridId;
		var scope = options.scope;
		var arr;
		if (gridId == 'driver') {
			arr = scope.addlMarkers1;
		} else if (gridId == 'shipper') {
			arr = scope.addlMarkers2;
		} else if (gridId == 'pickup') {
			arr = scope.addlMarkers3;
		} else if (gridId == 'delivery') {
			arr = scope.addlMarkers4;
		} else if (gridId == 'trailer') {
			arr = scope.addlMarkers5;
		}
		for (var i = 0; i < arr.length; i++) {
			var marker = arr[i];
			marker.remove();
		}
	},
	bounds: null,


	setMarkers: function(markers) {
		this.isCenterSet = false;
		var map = this.mapPanel.getMap();

		if (Ext.isArray(markers)) {
			this.bounds = new GLatLngBounds();

			for (var i = 0; i < markers.length; i++) {
				if (markers[i].geoCodeAddr) {
					this.geocoder = new GClientGeocoder();
					this.geocoder.getLocations(markers[i].geoCodeAddr, this.addAddressToMapUx.createDelegate(this, markers[i], true));
				} else {
					var mkr_point = new GLatLng(markers[i].lat, markers[i].lng);
					this.addMarker({ point: mkr_point, params: markers[i] });
				}
			}

			var directionsDiv = document.getElementById('gmapdirections');
			directionsDiv.innerHTML = '';
			var centerIndex = 0;
			for (var i = 0; i < markers.length; i++) {
				if (markers[i].isCenter == true && markers[i].geoCodeAddr) {
					centerIndex = i;
					break;
				}
			}

			for (var i = 0; i < markers.length - 1; i++) {
				if (markers[i].geoCodeAddr && centerIndex !== i) {
					var directions = new GDirections(map, document.getElementById('gmapdirections'));
					directions.load(String.format('from: {0}, to: {1}', markers[centerIndex].geoCodeAddr, markers[i].geoCodeAddr));
				}
			}

			var zoomLevel = map.getBoundsZoomLevel(this.bounds);
			map.setZoom(zoomLevel);
			map.setCenter(this.bounds.getCenter(), zoomLevel);
		}
	},



	addMarker: function(options) {

		var params = options.params;
		var point = options.point;
		var marker = params.marker;

		var index = marker.rowIndex;

		this.bounds.extend(point);

		var center;
		if (!this.isCenterSet && marker.isCenter == true) {
			center = true;
			this.isCenterSet = true;
		}

		var listeners = params.listeners;

		Ext.applyIf(marker, G_DEFAULT_ICON);

		/*
		// Create a base icon for all of our markers that specifies the
		// shadow, icon dimensions, etc.
		var baseIcon = new GIcon(G_DEFAULT_ICON);
		baseIcon.shadow = "http://www.google.com/mapfiles/shadow50.png";
		baseIcon.iconSize = new GSize(20, 34);
		baseIcon.shadowSize = new GSize(37, 34);
		baseIcon.iconAnchor = new GPoint(9, 34);
		baseIcon.infoWindowAnchor = new GPoint(9, 2);

        // Create a lettered icon for this point using our icon class
		var letter = String.fromCharCode("A".charCodeAt(0) + index);
		var letteredIcon = new GIcon(baseIcon);
		letteredIcon.image = "http://www.google.com/mapfiles/marker" + letter + ".png";
		if (this.gridId == 'driver') {
		letteredIcon.image = 'http://localhost/tls/images/icons/driver.png';
		} else {
		letteredIcon.image = 'http://esa.ilmari.googlepages.com/markeryellow.png'; //For Testing, making marker yellow
		}
		// Set up our GMarkerOptions object
		marker.icon = letteredIcon;
		
		
		var iconId = 0;
		switch (this.gridId) {
			case 'driver':
				iconId = TLS.LookupType.MappingLogoType.Driverslocations;
				break;
			case 'shipper':
				iconId = TLS.LookupType.MappingLogoType.Shipperslocations;
				break;
			case 'pickup':
				iconId = TLS.LookupType.MappingLogoType.Pickup;
				break;
			case 'delivery':
				iconId = TLS.LookupType.MappingLogoType.Deliverylocations;
				break;
			case 'trailer':
				iconId = TLS.LookupType.MappingLogoType.Trailerlocations;
				break;
		}
		if (iconId != 0) {
			var logoStore = this.appConfigMappingLogoGrid.getStore();
			var logoRecord = logoStore.find('TypeId', iconId);
			var icon = logoRecord.get('StorageFilename');
			icon = "TruckYellow";
			var mapIcon = new GIcon(G_DEFAULT_ICON);
			mapIcon.image = 'http://localhost/tls/images/map-icon/' + icon + '.png';
			marker.icon = mapIcon;
		}

		var mapIcon = new GIcon(G_DEFAULT_ICON);
		mapIcon.image = 'http://localhost/tls/images/map-icon/TruckYellow.png';
		marker.icon = mapIcon;
		*/
		var map = this.mapPanel.getMap();

		//        if (center === true) {
		//            map.setCenter(point, this.mapPanel.zoomLevel);
		//        }
		var mark = new GMarker(point, marker);

		if (this.gridId == 'driver') {
			this.addlMarkers1.push(mark);
		} else if (this.gridId == 'shipper') {
			this.addlMarkers2.push(mark);
		} else if (this.gridId == 'pickup') {
			this.addlMarkers3.push(mark);
		} else if (this.gridId == 'delivery') {
			this.addlMarkers4.push(mark);
		} else if (this.gridId == 'trailer') {
			this.addlMarkers5.push(mark);
		}

		//this.deliveryMarkers.push(mark);

		var e = { point: point, map: map, mapPanel: this, marker: mark, params: params };
		if (typeof listeners === 'object') {
			for (evt in listeners) {
				GEvent.bind(mark, evt, e, listeners[evt]);
			}
		}
		if (typeof this.defaultListeners === 'object') {
			listeners = this.defaultListeners;
			for (evt in listeners) {
				GEvent.bind(mark, evt, e, listeners[evt]);
			}
		}
		map.addOverlay(mark);

	},
	showTrafficSignals: function() {
		var map = this.mapPanel.getMap();
		var traffic = new GTrafficOverlay({ incidents: true });
		this.traffic = traffic;

		map.addOverlay(traffic);
		traffic.show();
	},
	removeTrafficSignals: function() {
		this.traffic.remove();
	},
	addAddressToMapUx: function(response, params) {

		if (!response || response.Status.code != 200) {
			Ext.MessageBox.alert('Error', 'Couldn\'t map the following address: ' + params.geoCodeAddr);
			//Ext.MessageBox.alert('Error', 'Code ' + response.Status.code + ' Error Returned for following address: ' + params.geoCodeAddr);
		} else {
			var place = response.Placemark[0];
			var addressinfo = place.AddressDetails;
			var accuracy = addressinfo.Accuracy;
			if (accuracy === 0) {
				Ext.MessageBox.alert('Error', 'Couldn\'t map the following address: ' + params.geoCodeAddr);
				//Ext.MessageBox.alert('Error', 'Unable to Locate the Address you provided');
			} else {
				//if (accuracy < 7) {
				//    Ext.MessageBox.alert('Address Accuracy', 'The address provided has a low accuracy.<br><br>Level ' + accuracy + ' Accuracy (8 = Exact Match, 1 = Vague Match)');
				//} else {
				point = new GLatLng(place.Point.coordinates[1], place.Point.coordinates[0]);
				if (typeof point === 'object') {
					this.addMarker({ point: point, params: params, place: place, addressInfo: addressinfo, index: params.rowIndex });
				}
				//}
			}
		}
	}
});

