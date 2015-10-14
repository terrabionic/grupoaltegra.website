jQuery(document).foundation();

jQuery(document).ready(function($) {

  // Deliver the correct image to main slider
  function setBackground(domEle) {
    var bgSmall = $(domEle).data('bg-small');
    var bgBig = $(domEle).data('bg-big');
    if ( $(window).width() <= 768 ) {
      $(domEle).css({
        'background': 'url(' + bgSmall + ')'
      });
    } else {
      $(domEle).css({
        'background': 'url(' + bgBig + ')'
      });
    }
  }

  function searchBgResponsive() {
    $('*[data-bg-responsive]').each(function() {
      setBackground(this);
    });
  }

  searchBgResponsive();

  // Main slider
  $('#main-slider').slick({
    arrows: false,
    appendDots: $('#types'),
    dots: true,
    customPaging: function(slider, i) {
      var $currentSlide = $(slider.$slides[i]);
      var type = $currentSlide.data('type');
      var icon = $currentSlide.data('icon');
      return '<buton><span class="' + icon  + '"></span>' + type  + '</button>';
    }
  });

  // Values slider
  $('#values-slider').slick({
    arrows: false,
    dots: true
  });

  // Toggle menu
  $('#open-menu').click(function(e) {
    e.preventDefault();
    $('#mega-menu').fadeIn();
  });

  $('#close-menu').click(function(e) {
    e.preventDefault();
    $('#mega-menu').fadeOut();
  });

  // Function to set the colors of the main nav
  function setColorNav() {
    var offset = $('#main-slider').height();
    var $navContainer = $('#nav-container');
    var navHeight = $navContainer.height();
    var stateClass = 'white';

    if ( $(window).scrollTop() >= (offset - navHeight) ) {
      $navContainer.addClass(stateClass);
    } else {
      $navContainer.removeClass(stateClass);
    }

  }

  setColorNav();

  $(window).scroll(function() {
    setColorNav();
  });

  $(window).resize(function() {
    searchBgResponsive();
  });

});


jQuery(window).load(function($) {

  function loadMap(lat, lon, selectorId, markerLat, markerLon, styles) {
    //debugger;
    // Map
    var latLong = new google.maps.LatLng(markerLat, markerLon);
    var mapOptions = {
      zoom: 15,
      scrollwheel: false,
      draggable: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP, center: latLong,
      disableDefaultUI: true,
      styles: styles
    };
    var map = new google.maps.Map(document.getElementById(selectorId), mapOptions);

    // Marker
    var latLonMarker = new google.maps.LatLng(markerLat, markerLon);
    var marker = new google.maps.Marker({
      position: latLonMarker,
      map: map,
      icon: 'img/marker.png'
    });

    google.maps.event.addListener(marker, 'click', function() {
      var $mapContainer = $(this.map.streetView.getContainer());
      var $mapDescription = $mapContainer.siblings();
      var $titleContainer = $mapDescription.children('h5');
      var targetReveal = $titleContainer.data('reveal');

      // Open the Reveal modal and draw the bigmaps
      drawBigMap(targetReveal);

    });

    return map;
  }


  function loadBigMap(lat, lon, selectorId) {
    var latLong = new google.maps.LatLng(lat, lon);

    var mapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP, center: latLong
    };

    var map = new google.maps.Map(document.getElementById(selectorId), mapOptions);

    var markerLatLon = new google.maps.LatLng(lat, lon);

    var marker = new google.maps.LatLng(lat, lon); var marker = new google.maps.Marker({
      position: markerLatLon,
      map: map,
    });

    return map;

  }

  // Draw big map
  function drawBigMap(targetReveal) {
    // Open the Reveal modal
    $(targetReveal).foundation('reveal', 'open');

    $(document).on('opened.fndtn.reveal', '[data-reveal]', function() {
      // Bigmaps
      if (targetReveal == '#modal-pachuca') {
        // if does not exists, then instance
        if (typeof bigPachuca === 'undefined') {
          bigPachuca = loadBigMap(pachucaLat, pachucaLng, "large-pachuca", pachucaLat, pachucaLng, lightazul);
          addListenerMap(bigPachuca);
        } else {
          // Resize it
          google.maps.event.trigger(bigPachuca, 'resize');
        }
      } else if (targetReveal == '#modal-queretaro') {
        if (typeof bigQueretaro === 'undefined') {
          bigQueretaro = loadBigMap(queretaroLat, queretaroLng, "large-queretaro", queretaroLat, queretaroLng, azul);
          addListenerMap(bigQueretaro);
        } else {
          google.maps.event.trigger(bigQueretaro, 'resize');
        }
      }
    });
  }


  // Colors
  var lightazul = [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"stylers":[{"hue":"#00aaff"},{"saturation":-100},{"gamma":2.15},{"lightness":12}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":24}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":57}]}];
  var azul = [ { "stylers": [ { "hue": "#00aaff" }, { "gamma": 1.51 }, { "saturation": -66 }, { "lightness": 52 } ] } ];

  // Coordinates
  var pachucaLat = $('#map-canvas-pachuca').data('lat');
  var pachucaLng = $('#map-canvas-pachuca').data('lng');
  var queretaroLat = $('#map-canvas-queretaro').data('lat');
  var queretaroLng = $('#map-canvas-queretaro').data('lng');

  // Pachuca map
  var mapPachuca = loadMap(pachucaLat, pachucaLng, "map-canvas-pachuca", pachucaLat, pachucaLng, lightazul);

  // Queretaro map
  var mapQueretaro = loadMap(queretaroLat, queretaroLng, "map-canvas-queretaro", queretaroLat, queretaroLng, azul);

  // Add listener to maps to get the center
  function addListenerMap(map) {
    google.maps.event.addDomListener(map, "idle", function() {
      map.theCenter = map.getCenter();
    });
  }

  addListenerMap(mapPachuca);
  addListenerMap(mapQueretaro);

  // Listen the resize event to center the map
  $(window).resize(function() {
    mapPachuca.setCenter( mapPachuca.theCenter );
    mapQueretaro.setCenter( mapQueretaro.theCenter );
  });

}(jQuery));

