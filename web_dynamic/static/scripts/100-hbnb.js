
$(document).ready(function () {
  $.get('http://0.0.0.0:5001/api/v1/status/', (data, textStatus) => {
    if (textStatus === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  const checkedAmenities = {};
  $('.amenities .popover input').on('change', function () {
    if ($(this).is(':checked')) {
      checkedAmenities[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete checkedAmenities[$(this).attr('data-name')];
    }
    $('.amenities h4').text(Object.keys(checkedAmenities).sort().join(', '));
  });

  const checkedStates = {};
  $('.state_input').on('change', function () {
    if ($(this).is(':checked')) {
      checkedStates[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete checkedStates[$(this).attr('data-id')];
    }
    $('.locations h4').text(Object.keys(checkedStates).sort().join(', '));
  });

  const checkedCities = {};
  $('.city_input').on('change', function () {
    if ($(this).is(':checked')) {
      checkedCities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete checkedCities[$(this).attr('data-id')];
    }
  });

  $('button').on('click', function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        amenities: Object.values(checkedAmenities),
        states: Object.values(checkedStates),
        cities: Object.values(checkedCities)
      }),
      success: function (data) {
        $('SECTION.places').empty();
        for (const place of data) {
          const article = ['<article>',
            '<div class="title_box">',
          `<h2>${place.name}</h2>`,
          `<div class="price_by_night">$${place.price_by_night}</div>`,
          '</div>',
          '<div class="information">',
          `<div class="max_guest">${place.max_guest} Guest(s)</div>`,
          `<div class="number_rooms">${place.number_rooms} Bedroom(s)</div>`,
          `<div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>`,
          '</div>',
          '<div class="description">',
          `${place.description}`,
          '</div>',
          '</article>'];
          $('SECTION.places').append(article.join(''));
        }
      }
    });
  });
});
