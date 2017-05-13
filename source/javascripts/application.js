// TODO: Put your JS code in here

var siteURL = 'x';
if (document.domain == 'localhost') siteURL = "x";

$(document).ready(function () {
  //set your google maps parameters
  var latitude = 48.858835,
  longitude = 2.347276,
  map_zoom = 13;


  function render_map($el) {

        // Var
        var $markers = $el.find('.marker');

        // Vars
        var args = {
          zoom: map_zoom,
          center: new google.maps.LatLng(latitude, longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          scrollwheel: false,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_LEFT
          },
          scaleControl: true,
          streetViewControl: false,
          streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
          }
        };

        // Create map
        var map = new google.maps.Map($el[0], args);

        // Add a markers reference
        map.markers = [];

        // Add markers
        $markers.each(function () {
          add_marker($(this), map);
        });

        // Center map
        // center_map(map);
        return map;

      }

    // create info window outside of each - then tell that singular infowindow to swap content based on click
    var infowindow = new google.maps.InfoWindow({
     content    : ''
   });

    function add_marker($marker, map) {

        // Var
        var latlng = new google.maps.LatLng($marker.data('lat'), $marker.data('lng'));
        var icon = null;

        // Simple icon change to differentiate marker type
        if ($marker.data('type') == 'restaurants') {
          icon = {
          url: "http://www.luckymiam.com/wp-content/themes/luckymiam/img/pin_jaune.png", // url
          scaledSize: new google.maps.Size(25, 25), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      } else if ($marker.data('type') == 'produits-artisans') {
        icon = {
          url: "http://www.luckymiam.com/wp-content/themes/luckymiam/img/pin_rose.png", // url
          scaledSize: new google.maps.Size(25, 25), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      } else {
        icon = {
          url: "http://www.luckymiam.com/wp-content/themes/luckymiam/img/pin_vert.png", // url
          scaledSize: new google.maps.Size(25, 25), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      }

      var marker = new google.maps.Marker({
        icon: icon,
        position: latlng,
        map: map,
            // Custom property to hold the filters options, it'a used below to filter the markers
            filter: {
              type: $marker.data('type'),
              date: $marker.data('date')
            }
          });

        //define the basic color of your map, plus a value for saturation and brightness
        var main_color = '#2d313f',
        saturation_value= -20,
        brightness_value= 5;

    //we define here the style of the map
    var style= [
      {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
        {
          "visibility": "on"
        },
        {
          "lightness": 33
        }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
        {
          "color": "#f2e5d4"
        }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
        {
          "color": "#c5dac6"
        }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels",
        "stylers": [
        {
          "visibility": "on"
        },
        {
          "lightness": 20
        }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
        {
          "lightness": 20
        }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
        {
          "color": "#c5c6c6"
        }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
        {
          "color": "#e4d7c6"
        }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
        {
          "color": "#fbfaf7"
        }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#acbcc9"
        }
        ]
      }
    ];

    map.setOptions({styles: style});

        // Add to array
        map.markers.push(marker);

        if ($marker.html()) {

            // Show info window when marker is clicked
            google.maps.event.addListener(marker, 'click', function () {

              infowindow.open(map, marker);
              infowindow.setContent($marker.html());

              mapID = $marker.attr('id');
              $('.' + mapID).show();
            });

          }

        }

      function center_map(map) {

        // Vars
        var bounds = new google.maps.LatLngBounds();

        // Loop through all markers and create bounds
        $.each(map.markers, function (i, marker) {
          var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
          bounds.extend(latlng);
        });
        map.fitBounds(bounds);

      }

      $(document).ready(function () {
        var map = null;

        $('.acf-map').each(function () {
          map = render_map($(this));
        });
        // Filtering links click handler, it uses the filtering values (data-filterby and data-filtervalue)
        // to filter the markers based on the filter (custom) property set when the marker is created.
        $(document).on('click', '.filters a', function (event) {
          event.preventDefault();
          var $target = $(event.target);
          var type = $target.data('filterby');
          var value = $target.data('filtervalue');

          $.each(map.markers, function () {
            if (this.filter[type] == value) {
              if (this.map == null) {
                this.setMap(map);
              }
            } else {
              this.setMap(null);
            }
          });
        });
      });


    });
