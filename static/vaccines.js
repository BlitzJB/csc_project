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

  http.get('https://tn-covid-beds.jhbht.repl.co/locations')
  
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
    http.post(`https://tn-covid-beds.jhbht.repl.co/vaccines?location=${selected}`, payload)
    .then(data => {
      console.table(data)
      card_template_generator(data)
      /* document.getElementById('card__container').innerHTML = data */
      document.getElementById('dist_search').innerHTML = 'Search'
    });
    event.preventDefault()
  });
});

const card_template_generator = (data) => {
  template = ''
  for (hospital_index in data) {
    let hospital = data[hospital_index]
    const card_template = `
    <div class="card" style="height: fit-content">
      <div class="card__header">
        <div class="card__header-main">
          ${ hospital['name-of-cvc'] }
        </div>
        <div class="card__header-subtext">
          ${ hospital.location }
        </div>
      </div>
      <div class="card__footer" style="margin-bottom: none;">
        <div class="card__footer-date-contact">
          Govt/Pvt: ${ hospital['government/private'] }
        </div>
        <div class="card__footer-date">
          Address: ${ hospital.address }
        </div>
      </div>
    </div>
    `
    template += card_template
  }
  document.getElementById('card__container').innerHTML = template
}