
$(document).ready(function () {
  const checkedAmenities = {};
  $('.amenities .popover input').on('change', function () {
    if ($(this).is(':checked')) {
      checkedAmenities[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete checkedAmenities[$(this).attr('data-name')];
    }
    $('.amenities h4').text(Object.keys(checkedAmenities).sort().join(', '));
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', (data, textStatus) => {
    if (textStatus === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $('button').on('click', function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ amenities: Object.values(checkedAmenities) }),
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
