
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
    } else {
      delete checkedAmenities[$(this).attr('data-name')];
    }
    $('.amenities h4').text(Object.keys(checkedAmenities).sort().join(', '));
  });

  const checkedStates = {};
  $('.state_input').on('change', function () {
    if ($(this).is(':checked')) {
      checkedStates[$(this).attr('data-name')] = $(this).attr('data-id');
    } else {
      delete checkedStates[$(this).attr('data-name')];
    }
    $('.locations h4').text(Object.keys(checkedStates).sort().join(', '));
  });

  const checkedCities = {};
  $('.city_input').on('change', function () {
    if ($(this).is(':checked')) {
      checkedCities[$(this).attr('data-name')] = $(this).attr('data-id');
    } else {
      delete checkedCities[$(this).attr('data-name')];
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
          '<br></br>',
          '<div class="reviews">',
          '<h2><span class="num">Reviews</span>',
          `<span class="reviews" data-id="${place.id}"> Show</span></h2>`,
          '<ul></ul>',
          '</div>',
          '</article>'];
          $('SECTION.places').append(article.join(''));
        }
      }
    });
  });

  $(document).on('click', 'span.reviews', function () {
    const ul = $(this).parent().parent().children('ul').last();
    if ($(this).text() === ' Show') {
      $(this).text(' Hide');
      $.get(`http://0.0.0.0:5001/api/v1/places/${$(this).attr('data-id')}/reviews`, function (data) {
        for (const review of data) {
          const dateString = (new Date(Date.parse(review.updated_at))).toDateString();
          const template = `<li><h3>From ${users[review.user_id]} on ${dateString}</h3>
            <p>${review.text}</p>
          </li>`;
          ul.append(template);
          ul.show();
        }
      });
    } else {
      $(this).text('Reviews');
      $(this).text(' Show');
      ul.hide();
    }
  });

  const users = {};
  $.getJSON('http://0.0.0.0:5001/api/v1/users/', (data) => {
    for (const user of data) {
      users[user.id] = `${user.first_name} ${user.last_name}`;
    }
  });
});
