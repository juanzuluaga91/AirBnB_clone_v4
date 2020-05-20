$(document).ready(function () {
  const checkedAmenities = {};
  $('.amenities .popover input').on('change', "input[type='checkbox']", () => {
    if (this.checked) {
      checkedAmenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkedAmenities[$(this).data('id')];
    }
    const lst = Object.values(checkedAmenities);
    if (lst.length > 0) {
      $('div.amenities > h4').text(Object.values(checkedAmenities).join(', '));
    } else {
      $('div.amenities > h4').html('&nbsp;');
    }
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', (data, textStatus) => {
    if (textStatus === 'success') {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    }
  });

  $('button').on('click', function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ amenities: Object.keys(checkedAmenities) }),
      success: function (data) {
        $('SECTION.places').empty();
        for (const r of data) {
          const article = ['<article>',
            '<div class="title_box">',
          `<h2>${r.name}</h2>`,
          `<div class="price_by_night">$${r.price_by_night}</div>`,
          '</div>',
          '<div class="information">',
          `<div class="max_guest">${r.max_guest} Guest(s)</div>`,
          `<div class="number_rooms">${r.number_rooms} Bedroom(s)</div>`,
          `<div class="number_bathrooms">${r.number_bathrooms} Bathroom(s)</div>`,
          '</div>',
          '<div class="description">',
          `${r.description}`,
          '</div>',
          '</article>'];
          $('SECTION.places').append(article.join(''));
        }
      }
    });
  });
});
