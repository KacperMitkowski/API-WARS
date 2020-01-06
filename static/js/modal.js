export {modal};
import {data_handler as dh} from "./data_handler.js";
import {dom} from "./dom.js";
import {voting} from "./voting.js";

let residents_modal;
let login_modal = document.getElementById('login_modal');
let logout_modal = document.getElementById('logout_modal');
let registration_modal = document.getElementById('registration_modal');
let vote_modal = document.getElementById('vote_modal');
let statistics_modal = document.getElementById('statistics_modal');

// ==================================================================================================

const modal = {
  show_residents_modal: function (planet) {
    const residents = planet.residents;

    this.create_residents_modal_headers(planet);
    for (let resident of residents)
      dh.load_data(resident, this.create_residents_modal_row);

    residents_modal.style.display = 'block';
  },

  // ==================================================================================================

  create_residents_modal_headers: function (planet) {
    residents_modal = document.getElementById('residents_modal');
    dom.clear_div(residents_modal);

    let residents_modal_header_string = `
    <div class="modal-content ">
        <span class="header_in_form">Residents of ${planet.name}</span>
        <table class="table table-responsive">
            <thead>
                <tr>
                  <th>Name</th>
                  <th>Height</th>
                  <th>Mass</th>
                  <th>Hair Color</th>
                  <th>Skin Color</th>
                  <th>Eye Color</th>
                  <th>Birth Year</th>
                  <th>Gender</th>
                </tr>
            </thead>    
            <tbody id="resident_rows"></tbody>         
        </table>    
    </div>
  `;
    residents_modal.insertAdjacentHTML('afterbegin', residents_modal_header_string);
  },

  // ==================================================================================================

  create_residents_modal_row: function (resident) {
    const resident_rows = document.getElementById('resident_rows');

    let resident_row_content_string = `
    <tr>
        <td>${resident.name}</td>
        <td>${resident.height}</td>
        <td>${resident.mass}</td>
        <td>${resident.hair_color}</td>
        <td>${resident.skin_color}</td>
        <td>${resident.eye_color}</td>
        <td>${resident.birth_year}</td>
        <td>${resident.gender}</td>
    </tr>
  `;
    resident_rows.insertAdjacentHTML('beforeend', resident_row_content_string);
  },

  // ==================================================================================================

  clear_reg_modal_and_show_message: function (message) {
    let registration_modal = document.getElementById('registration_modal');
    let registration_modal_content = registration_modal.firstElementChild;

    dom.clear_div(registration_modal_content);

    let span = document.createElement('span');
    span.setAttribute('class', 'header_in_form');
    let text = document.createTextNode(message);
    span.appendChild(text);

    let button = document.createElement('button');
    button.appendChild(document.createTextNode('Login'));
    button.addEventListener('click', () => {
      registration_modal.style.display = 'none';
      login_modal.style.display = 'block';
    });

    registration_modal_content.appendChild(span);
    registration_modal_content.appendChild(button);
  },

  // ==================================================================================================

  show_success_message: function (message) {
    let login_modal = document.getElementById('login_modal');
    let login_modal_content = login_modal.firstElementChild;

    dom.clear_div(login_modal_content);

    let span = document.createElement('span');
    span.setAttribute('class', 'header_in_form');
    let text = document.createTextNode(message);
    span.appendChild(text);

    login_modal_content.appendChild(span);
  },

  // ==================================================================================================

  hide_all_modals: function () {
    if (login_modal)
      login_modal.style.display = 'none';

    if (registration_modal)
      registration_modal.style.display = 'none';

    if (logout_modal)
      logout_modal.style.display = 'none';

    if (residents_modal)
      residents_modal.style.display = 'none';

    if (vote_modal)
      vote_modal.style.display = 'none';

    if (statistics_modal)
      statistics_modal.style.display = 'none';
  },

  // ==================================================================================================

  show_logout_modal: function () {
    logout_modal.style.display = 'block';
  },

  // ==================================================================================================

  show_vote_modal: function() {
    vote_modal.style.display = 'block';
  },

  // ==================================================================================================

  show_statistics_modal: function () {
    statistics_modal.style.display = 'block';

    this.create_statistics_modal_headers();

    const all_planets = document.querySelectorAll('.planet_name');
    for (let planet of all_planets)
      this.create_statistics_modal_row(planet)
  },

  // ==================================================================================================

  create_statistics_modal_headers: function () {
    dom.clear_div(statistics_modal);

    let statistics_modal_header_string = `
    <div class="modal-content" style="width: 15%;">
        <span class="header_in_form">Voting statistics</span>
        <table class="table table-responsive">
            <thead>
                <tr>
                  <th>Planet name</th>
                  <th>Received votes</th>
                </tr>
            </thead>    
            <tbody id="statistic_rows"></tbody>         
        </table>    
    </div>
  `;
    statistics_modal.insertAdjacentHTML('afterbegin', statistics_modal_header_string);
  },

  // ==================================================================================================

  create_statistics_modal_row: function (planet) {
    const statistics_modal_content = document.getElementById('statistic_rows');
    const planet_name = planet.innerHTML;

    const statistics_modal_row_string = `
    <tr>
        <td>${planet.innerText}</td>
        <td id="${planet_name}"></td>
    </tr>
  `;
    statistics_modal_content.insertAdjacentHTML('beforeend', statistics_modal_row_string);
    voting.get_votes_for_planet(planet_name);
  },

  // ==================================================================================================

  add_vote_amount_to_modal_row: function (planet_name, votes) {
    const modal_row = document.getElementById(planet_name);
    modal_row.insertAdjacentHTML('afterbegin', votes);
  }
};

// ==================================================================================================

window.onclick = function (event) {
  if (event.target === login_modal ||
      event.target === registration_modal ||
      event.target === residents_modal ||
      event.target === logout_modal ||
      event.target === vote_modal ||
      event.target === statistics_modal)
  {
    if (login_modal)
      login_modal.style.display = 'none';

    if (registration_modal)
      registration_modal.style.display = 'none';

    if (logout_modal)
      logout_modal.style.display = 'none';

    if (residents_modal)
      residents_modal.style.display = 'none';

    if (vote_modal)
      logout_modal.style.display = 'none';

    if (statistics_modal)
      statistics_modal.style.display = 'none';
  }
};

// ==================================================================================================

document.addEventListener('DOMContentLoaded', () => {
  let show_statistics_modal_link = document.getElementById('voting_statistics');
  let show_login_modal_button = document.getElementById('show_login_modal_button');
  let show_registration_modal_button = document.getElementById('show_registration_modal_button');

  let all_hide_modal_buttons = document.querySelectorAll('.hide_modal_button');
  all_hide_modal_buttons.forEach(button => button.addEventListener('click', modal.hide_all_modals));


  show_login_modal_button.addEventListener('click', () => {
    modal.hide_all_modals();
    login_modal.style.display = 'block'
  });

  show_registration_modal_button.addEventListener('click', () => {
    modal.hide_all_modals();
    registration_modal.style.display = 'block'
  });

  show_statistics_modal_link.addEventListener('click', () => {
    modal.hide_all_modals();
    modal.show_statistics_modal();
  });
});