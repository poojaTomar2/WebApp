//--------------------------------------------------------
//  ---------------------  G-Map  ------------------------
//--------------------------------------------------------

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
	markers: [],
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

		var width = 640;
		var directionsPanelWidth = 300;

		var totalWidth = width;
		if (options.showDirections) {
			totalWidth += directionsPanelWidth;
		}

		if (!this.mapWin) {
			this.mapPanel = new Ext.ux.GMapPanel({
				gmapType: 'map',
				mapConfOpts: ['enableScrollWheelZoom', 'enableDoubleClickZoom', 'enableDragging'],
				mapControls: ['GSmallMapControl', 'GMapTypeControl'],
				width: width,
				region: 'center'
			});


			var items = [this.mapPanel];
			this.directionsPanel = new Ext.Panel({ region: 'east', html: '<div id="gmapdirections">Directions</div>', width: directionsPanelWidth, height: 0, autoScroll: true });
			this.notFoundLocationPanel = new Ext.Panel({ region: 'east', html: '<div id="gmapnotfound">Not Marked Locations</div>', width: directionsPanelWidth, height: 200, autoScroll: true });
			var panelItems = [];
			items.push(this.directionsPanel);
			items.push(this.notFoundLocationPanel);

			this.mapWin = new Ext.Window({
				layout: 'border',
				title: 'Locations' + DA.MapTitle,
				closeAction: 'hide',
				width: totalWidth,
				height: 480,
				items: items
			});
		}
		else {
			this.clearMarkers();
		}

		DA.mapPanelOptions = this.options;
		this.directionsPanel.setVisible(options.showDirections);
		this.mapWin.show();
		this.mapWin.setWidth(totalWidth);
		var map = this.mapPanel.getMap();
		
		if (markers.length > 0) {
			this.setMarkers(markers);
		}
	},
	clearMarkers: function() {
		if (DA.Map.infoWindow) {
			DA.Map.infoWindow.close();
		}
		if (this.markers) {
			for (var i = 0; i < this.markers.length; i++) {
				this.markers[i].setMap(null);
			}
		}
	},
	bounds: null,
	setMarkers: function(markers) {
		this.isCenterSet = false;
		var map = this.mapPanel.getMap();

		if (Ext.isArray(markers)) {
			//this.bounds = map.LatLngBounds();

			for (var i = 0; i < markers.length; i++) {
				if (markers[i].geoCodeAddr) {

					this.geocoder = new google.maps.Geocoder();
					this.geocoder.geocode({
						address: markers[i].geoCodeAddr
					}, this.addAddressToMapUx.createDelegate(this, [markers[i].geoCodeAddr, markers[i], false, false, markers[i].listeners], true));

				} else {
					var mkr_point = new GLatLng(markers[i].lat, markers[i].lng);
					this.addMarker({ point: mkr_point, params: markers[i] });
				}
			}

			/*
			var directionsDiv = document.getElementById('gmapdirections');
			directionsDiv.innerHTML = '';
			var centerIndex = 0;
			for (var i = 0; i < markers.length; i++) {
			if (markers[i].isCenter == true && markers[i].geoCodeAddr) {
			centerIndex = i;
			break;
			}
			}*/

			//			var flightPlanCoordinates = [];
			//			var j = 0;
			//			for (var i = 1; i < markers.length - 1; i++) {
			//				if (markers[i].geoCodeAddr) {
			//					flightPlanCoordinates[j] = new google.maps.LatLng(markers[i].geoCodeAddr);
			//					j++;
			//				}
			//			}

			//			var flightPath = new google.maps.Polyline({
			//				path: flightPlanCoordinates,
			//				strokeColor: "#FF0000",
			//				strokeOpacity: 1.0,
			//				strokeWeight: 2
			//			});

			//			flightPath.setMap(map);

			var showDirections = false;
			if (showDirections) {
				var directionsService = [];
				var directionsDisplay = [];
				for (var i = 0; i < markers.length - 1; i++) {
					directionsService[i] = new google.maps.DirectionsService();
					directionsDisplay[i] = new google.maps.DirectionsRenderer({ map: map, preserveViewport: true });
				}
				for (var i = 1; i < markers.length - 1; i++) {
					if (markers[i].geoCodeAddr) {
						var route = {
							origin: markers[i - 1].geoCodeAddr,
							destination: markers[i].geoCodeAddr,
							travelMode: google.maps.DirectionsTravelMode.DRIVING
						};
						directionsService[i - 1].route(route, function(response, status) {
							if (status == google.maps.DirectionsStatus.OK) {
								var objDirDisplay = directionsDisplay[i - 1];
								if (objDirDisplay) {
									objDirDisplay.setDirections(response);
								} else {
									alert('problem');
								}
							}
							else {
								alert("the googlemaps direction calculation returned status \"" + status + "\" which is not ok");
							}
						});
					}
				}
			}

		}
	},
	infoWindow: null,
	addMarker: function(options) {

		var params = options.params;
		var point = options.point;
		var marker = params.marker;

		var index = marker.rowIndex;


		//	this.bounds.extend(point);

		var center;
		if (!this.isCenterSet) { // && marker.isCenter == true
			center = true;
			this.isCenterSet = true;
		}

		var listeners = params.listeners;

		/*
		Ext.applyIf(marker, G_DEFAULT_ICON);

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

		// Set up our GMarkerOptions object
		marker.icon = letteredIcon;
		*/

		var map = this.mapPanel.getMap();

		if (center === true) {
			map.setCenter(point, this.mapPanel.zoomLevel);
		}

		//var mark = new GMarker(point, marker);
		var mark = new google.maps.Marker(Ext.apply(marker, {
			position: point,
			map: map
		}));

		this.markers.push(mark);

		//	google.maps.event.addListener(map, 'click', this.clickHandler, this.mapPanel);


		//var e = { point: point, map: map, mapPanel: this, marker: mark, params: params };
		google.maps.event.addListener(mark, 'click', function() {
			var options = DA.mapPanelOptions;
			var infoProps = options.infoProperties;
			if (infoProps && Ext.isArray(infoProps) && infoProps.length > 0) {
				var grid = options.grid;
				if (grid) {
					var view = grid.getView();
					var cm = grid.getColumnModel();
					var rowIndex = params.rowIndex;
					var html = "";
					var record = params.record;
					var orders = 'Origin';
					if (mark.OrderNumbers !== null && mark.OrderNumbers !== '' && mark.OrderNumbers !== "undefined") {
						orders = mark.OrderNumbers;
					}
					html += "<tr><td><b>Order Number(s):</b></td><td>" + orders;
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
							html += "<tr><td><b>" + cm.getColumnHeader(colIndex) + ":</b></td><td>" + renderer(record.get(dataIndex), p, record, rowIndex, colIndex, options.ds);
						} else {
							alert('Invalid column: ' + prop.columnId);
						}
					});
					var extraRows = "<tr><td><b>Lat/Lng:</b></td><td>" + mark.position.lat() + ',' + mark.position.lng() + "</td></tr>";
					html += extraRows;
					var finalHtml = "<table class='GMapMarkerToolTip'>" + html + "</table>";
					if (DA.Map.infoWindow) {
						DA.Map.infoWindow.close(); //Closing previous window on opening on next one
					}
					DA.Map.infoWindow = new google.maps.InfoWindow({
						maxWidth: 400,
						maxHeight: 300,
						content: finalHtml
					});
					DA.Map.infoWindow.open(map, mark);

				}
			}
		});


		//map.addOverlay(mark);


		//		var traffic = new GTrafficOverlay({ incidents: true });

		//		map.addOverlay(traffic);
		//		traffic.show();

	},

	addAddressToMapUx: function(response, status, addr, marker, clear, center, listeners) {

		if (!response || status != 'OK') {
			var record = marker.record;
			var directionsDiv = document.getElementById('gmapnotfound');
			directionsDiv.innerHTML += ',<br> Order# : ' + record.get('OrderNumber') + ', Location : ' + addr;

		} else {
			var params = { marker: marker, isCenter: center, listeners: listeners, record: marker.record };
			marker.title = addr;
			var place = response[0].geometry.location;
			var addressinfo = place.AddressDetails;
			var accuracy;
			if (false && accuracy === 0) {
				Ext.MessageBox.alert('Error', 'Couldn\'t map the following address: ' + addr);
			} else {
				if (!DA.MapTitle) {
					this.mapWin.setTitle = ' Near to' + addr + 'Geo Locations :' + place.lat() + ', ' + place.lng();
				}
				point = new google.maps.LatLng(place.lat(), place.lng());
				if (typeof point === 'object') {
					this.addMarker({ point: point, params: params, place: place, addressInfo: addressinfo, index: marker.rowIndex });
				}
			}
		}
	}
});
