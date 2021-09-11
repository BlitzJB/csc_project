class HTTPClient {

  async get(url) {
    const response = await fetch(url);
    const resData = await response.json();
    return resData;
  }

  async post(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const resData = await response.json();
    return resData;
  }
}


document.addEventListener("DOMContentLoaded", (event) => {
  const http = new HTTPClient;

  
  http.get('https://tn-covid-beds.jhbht.repl.co/districts')
  
  .then(data => {
    const districts = data.sort();
    
    let inner = ''
    for (district in districts) {
      inner += `<option value=${districts[district]}>${districts[district]}</option>`
    }
    const selector = document.getElementById('dist_select')
    selector.innerHTML = inner
    
  });
  
  const form = document.getElementById('dist_select_form');
  form.addEventListener('submit', (event) => {
    document.getElementById('tooltip').innerHTML = ''
    document.getElementById('dist_search').innerHTML = 'Loading...'
    const selected = document.getElementById('dist_select').value
    const payload = {authorization: 'teamjoshuajoshuaabhinav'}
    http.post(`https://tn-covid-beds.jhbht.repl.co/?district=${selected}`, payload)
    .then(data => {
      card_template_generator(data)
      document.getElementById('dist_search').innerHTML = 'Search'
    });
    event.preventDefault()
  });

});

const card_template_generator = (data) => {
  template = ''
  for (hospital_index in data) {
    let hospital = data[hospital_index]
    /* generating the table to go inside the card */
    let table = `
      <table class="card__table-table">
        <tr>
          <th>Bed Type</th>
          <th>Vacant</th>
          <th>Occupied</th>
          <th>Total</th>
        </tr>
      `
      if (+ hospital.covid_beds.vacant > 0) {
        table += `
        <tr style="background-color: rgba(135, 177, 110, .8);">
          <td>Covid Beds</td>
          <td>${ hospital.covid_beds.vacant }</td>
          <td>${ hospital.covid_beds.occupied }</td>
          <td>${ hospital.covid_beds.total }</td>
        </tr>
        `
      }
      else {
        table += `
        <tr style="background-color: rgb(255, 83, 83, .8);">
          <td>Covid beds</td>
          <td>${ hospital.covid_beds.vacant }</td>
          <td>${ hospital.covid_beds.occupied }</td>
          <td>${ hospital.covid_beds.total }</td>
        </tr>
        `
      }
      if (+ hospital.oxygen_supported_beds.vacant > 0) {
        table += `
        <tr style="background-color: rgba(135, 177, 110, .8);">
          <td>Oxygen Beds</td>
          <td>${ hospital.oxygen_supported_beds.vacant }</td>
          <td>${ hospital.oxygen_supported_beds.occupied }</td>
          <td>${ hospital.oxygen_supported_beds.total }</td>
        </tr>
        `
      }
      else {
        table += `
        <tr style="background-color: rgb(255, 83, 83, .8);">
          <td>Oxygen beds</td>
          <td>${ hospital.oxygen_supported_beds.vacant }</td>
          <td>${ hospital.oxygen_supported_beds.occupied }</td>
          <td>${ hospital.oxygen_supported_beds.total }</td>
        </tr>
        `
      }
      if (+ hospital.non_oxygen_supported_beds.vacant > 0) {
        table += `
        <tr style="background-color: rgba(135, 177, 110, .8);">
          <td>Non oxygen beds</td>
          <td>${ hospital.non_oxygen_supported_beds.vacant }</td>
          <td>${ hospital.non_oxygen_supported_beds.occupied }</td>
          <td>${ hospital.non_oxygen_supported_beds.total }</td>
        </tr>
        `
      }
      else {
        table += `
        <tr style="background-color: rgb(255, 83, 83, .8);">
          <td>Non oxygen beds</td>
          <td>${ hospital.non_oxygen_supported_beds.vacant }</td>
          <td>${ hospital.non_oxygen_supported_beds.occupied }</td>
          <td>${ hospital.non_oxygen_supported_beds.total }</td>
        </tr>
        `
      }
      if (+ hospital.icu_beds.vacant > 0) {
        table += `
        <tr style="background-color: rgba(135, 177, 110, .8);">
          <td>ICU Beds</td>
          <td>${ hospital.icu_beds.vacant }</td>
          <td>${ hospital.icu_beds.occupied }</td>
          <td>${ hospital.icu_beds.total }</td>
        </tr>
        `
      }
      else {
        table += `
        <tr style="background-color: rgb(255, 83, 83, .8);">
          <td>ICU beds</td>
          <td>${ hospital.icu_beds.vacant }</td>
          <td>${ hospital.icu_beds.occupied }</td>
          <td>${ hospital.icu_beds.total }</td>
        </tr>
        `
      }
      if (+ hospital.ventilators.vacant > 0) {
        table += `
        <tr style="background-color: rgba(135, 177, 110, .8);">
          <td>Ventilators</td>
          <td>${ hospital.ventilators.vacant }</td>
          <td>${ hospital.ventilators.occupied }</td>
          <td>${ hospital.ventilators.total }</td>
        </tr>
        `
      }
      else {
        table += `
        <tr style="background-color: rgb(255, 83, 83, .8);">
          <td>Ventilators</td>
          <td>${ hospital.ventilators.vacant }</td>
          <td>${ hospital.ventilators.occupied }</td>
          <td>${ hospital.ventilators.total }</td>
        </tr>
        `
      }
      table += '</table>'

    /* peicing the card together */
    const card_template = `
    <div class="card">
      <div class="card__header">
        <div class="card__header-main">
          ${ hospital.institution }
        </div>
        <div class="card__header-subtext">
          ${ hospital.district }
        </div>
      </div>
      <div class="card__body">
          ${ table }
      </div>
      <div class="card__footer">
        <div class="card__footer-date-contact">
          Contact: ${ hospital.contact }
        </div>
        <div class="card__footer-date">
          Last updated: ${ hospital.last_updated }
        </div>
      </div>
    </div>
    `
    template += card_template
  }
  document.getElementById('card__container').innerHTML = template
}