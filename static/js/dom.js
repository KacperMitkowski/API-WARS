export {dom};
import {main} from "./main.js";
import {data_handler as dh} from "./data_handler.js";
import {voting} from "./voting.js";
import {login} from "./login.js";
import {register} from "./registration.js";

const main_div = document.getElementById('main_div');

// ==================================================================================================

const dom = {
  create_table: function (data) {
    dh.previous_page = data.previous;
    dh.next_page = data.next;

    dom.clear_div(main_div);
    dom.hide_button_if_necessary(data);
    dom.create_table_headers();
    main.append_event_listeners_for_page_buttons(dh.previous_page, dh.next_page);

    const planets = data.results;
    const js_obj = JSON.parse(localStorage.getItem('planets'));

    for (let planet of planets) {
      const planet_index = js_obj.findIndex(object => object.name === planet.name);
      const planet_name = js_obj[planet_index].name;
      dom.create_table_row(planet_index, planet);
      main.append_event_listener_for_residents_button(planet_index, planet);
      main.append_event_listener_for_vote_button(planet_index, planet_name);
    }

    const logged_user = localStorage.getItem('login');
    if (logged_user) {
      dom.show_vote_column();
      voting.get_id_planets_with_user_votes(logged_user);
    }
  },

  // ==================================================================================================

  create_table_headers: function () {
    const main_div = document.getElementById('main_div');
    let table_headers_string = `

    <table id="planets_list" class="table table-responsive table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Diameter</th>
          <th>Climate</th>
          <th>Terrain</th>
          <th>Water</th>
          <th>Population</th>
          <th>Residents</th>
          <th class="vote_column">Vote</th>
        </tr>
          </thead>
          <tbody id="planet_rows"></tbody> 
        </table>
    `;

    main_div.insertAdjacentHTML('afterbegin', table_headers_string);
  },

  // ==================================================================================================

  create_table_row: function (planet_index, planet) {
    const planet_rows = document.getElementById('planet_rows');
    let number_of_residents = planet.residents.length;

    let planet_row_string = `

    <tr>
      <td>${planet_index}</td>
      <td class="planet_name">${planet.name}</td>
      <td>${dom.show_diameter(planet.diameter)}</td>
      <td>${planet.climate}</td>
      <td>${planet.terrain}</td>
      <td>${dom.show_surface_water_percent(planet.surface_water)}</td>
      <td>${dom.show_planet_population(planet.population)}</td>
      <td>${dom.create_button_or_no_residence_text(planet_index, number_of_residents)}</td>
      <td class="vote_column">
      
          <button id="vote_button_${planet_index}" class="vote_column">
              VOTE <span style="color: red;">♥</span>             
          </button>
      </td>
    </tr>`;

    planet_rows.insertAdjacentHTML('beforeend', planet_row_string);
  },

  // ==================================================================================================

  create_button_or_no_residence_text: function (planet_index, number_of_residents) {
    if (number_of_residents > 0)
      return `<button id="resident_but_${planet_index}">${number_of_residents} resident(s)</button>`;
    else
      return 'No known residents';
  },

  // ==================================================================================================

  clear_div: function (div) {
    while (div.firstChild)
      div.firstChild.remove();
  },

  // ==================================================================================================

  hide_button_if_necessary: function (data) {
    let next_page_button = document.getElementById('next_page');
    let previous_page_button = document.getElementById('previous_page');

    data.previous === null ? previous_page_button.style.visibility = 'hidden' : previous_page_button.style.visibility = 'visible';
    data.next === null ? next_page_button.style.visibility = 'hidden' : next_page_button.style.visibility = 'visible';
  },

  // ==================================================================================================

  add_login_div: function (login) {
    const main_menu = document.getElementById('main_menu');

    let login_div = document.createElement('div');
    login_div.setAttribute('id', 'login_div');
    login_div.setAttribute('class', 'text-right');
    login_div.appendChild(document.createTextNode(`You are logged as: ${login} `));

    if (!document.getElementById('login_div'))
      main_menu.appendChild(login_div);
  },

  // ==================================================================================================

  add_logout_button: function () {
    const login_div = document.getElementById('login_div');
    const button = document.createElement('button');
    button.setAttribute('id', 'logout_button');
    button.appendChild(document.createTextNode('Logout'));

    if (!document.getElementById('logout_button'))
      login_div.appendChild(button);

    main.append_event_listener_for_logout_button(button);
  },

  // ==================================================================================================

  hide_log_reg_links: function () {
    const login_link_from_nav = document.getElementById('show_login_modal_button');
    const reg_link_from_nav = document.getElementById('show_registration_modal_button');

    login_link_from_nav.style.display = 'none';
    reg_link_from_nav.style.display = 'none';
  },

  // ==================================================================================================

  show_log_reg_links: function () {
    const login_link_from_nav = document.getElementById('show_login_modal_button');
    const reg_link_from_nav = document.getElementById('show_registration_modal_button');

    login_link_from_nav.style.display = 'block';
    reg_link_from_nav.style.display = 'block';
  },

  // ==================================================================================================

  remove_login_div: function () {
    const login_div = document.getElementById('login_div');
    if (login_div)
      login_div.remove();
  },

  // ==================================================================================================

  restore_log_modal: function () {

    const login_modal = document.getElementById('login_modal');
    dom.clear_div(login_modal);

    const login_modal_string = `
    <div class="modal-content">
        <span class="hide_modal_button">&times;</span>
        <span class="header_in_form">Login</span>

        <div>
            <label>
                <div>
                    Login:
                </div>
                <input type="text" placeholder="Login goes here..." id="login_input">
            </label>
        </div>

        <div>
            <label>

                <div>
                    Password:
                </div>
                <input type="password" placeholder="Password goes here..." id="password_input">
            </label>
        </div>

        <div>
            <button id="login_button">Login</button>
        </div>
        <div id="error_login_div"></div>
    </div>
    `;

    if (login_modal) {
      login_modal.insertAdjacentHTML('beforeend', login_modal_string);
      let button = document.getElementById('login_button');
      button.addEventListener('click', ()=> login.try_log_in());
    }
  },

  // ==================================================================================================

  restore_reg_modal: function () {
    const registration_modal = document.getElementById('registration_modal');
    dom.clear_div(registration_modal);

    const registration_modal_string = `
      <div class="modal-content">
        <span class="hide_modal_button">&times;</span>
        <span class="header_in_form">Registration</span>

        <div>
            <label>
                <div>
                    Login:
                </div>
                <input type="text" placeholder="Login goes here..." id="login">
            </label>
        </div>

        <div>
            <label>
                <div>
                    Password #1:
                </div>
                <input type="password" placeholder="Password goes here..." id="password_one">

            </label>
        </div>

        <div>
            <label>
                <div>
                    Password #2:
                </div>
                <input type="password" placeholder="Repeat password..." id="password_two">
            </label>
        </div>

        <div>
            <button id="register">Register</button>
            <a href="#" id="help_link" title="Passwords must:
-> be the same
-> contain between 4-10 chars
-> contain at least one lowercase letter
-> contain only one capital letter
-> contain only one digit
-> contain only one special symbol(!@#$%^&*()_+=|)
-> not contain whitespaces">

                <i id="help_icon" class="fas fa-question-circle"></i>
            </a>
        </div>
        <div id="error_registration_div"></div>
    </div>
    `;

    if(registration_modal) {
      registration_modal.insertAdjacentHTML('beforeend', registration_modal_string);
      let button = document.getElementById('register');
      button.addEventListener('click', ()=> register.try_to_register());
    }
  },

  // ==================================================================================================

  show_vote_column: function () {
    const all_buttons = document.querySelectorAll('.vote_column');
    all_buttons.forEach(button => button.style.display = 'block');
  },

  // ==================================================================================================

  hide_vote_column: function () {
    const all_buttons = document.querySelectorAll('.vote_column');
    all_buttons.forEach(button => button.style.display = 'none');
  },

  // ==================================================================================================

  show_diameter: function (number) {
    const pattern_for_three_digit_number = /\B(?=(\d{3})+(?!\d))/g;
    if(number === 'unknown')
      return 'unknown';
    else
      return number.toString().replace(pattern_for_three_digit_number, ".") + ' km.';
  },

  // ==================================================================================================

  show_planet_population: function(planet_population) {
    const pattern_for_three_digit_number = /\B(?=(\d{3})+(?!\d))/g;
    if(planet_population === 'unknown')
      return 'unknown';
    else
      return planet_population.toString().replace(pattern_for_three_digit_number, ".");
  },

  // ==================================================================================================

  show_surface_water_percent: function (water_percentage) {
    if(water_percentage === 'unknown')
      return 'unknown';
    else
      return `${water_percentage}%`;
  }
};

