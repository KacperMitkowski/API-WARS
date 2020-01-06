export {main};
import {modal} from "./modal.js";
import {dom} from "./dom.js";
import {data_handler as dh} from "./data_handler.js";
import {voting} from "./voting.js";

// ==================================================================================================

const main = {
  planets: [],
  first_page: 'https://swapi.co/api/planets/?page=1',

  main: function () {
    const planets_exist_in_localstorage = localStorage.getItem('planets');

    if (planets_exist_in_localstorage)
      dh.load_data(this.first_page, dom.create_table);
    else
      this.get_planets_from_swapi(this.first_page);

    const logged_user = localStorage.getItem('login');
    if (logged_user) {
      dom.hide_log_reg_links();
      dom.add_login_div(logged_user);
      dom.add_logout_button();
    }
  },
  // ==================================================================================================

  append_event_listeners_for_page_buttons: function (previous_page, next_page) {
    let next_page_button = document.getElementById('next_page');
    next_page_button.addEventListener('click', () => {

      if (typeof next_page !== 'undefined' && dh.request_starts_triggering === true) {
        dh.request_starts_triggering = false;
        dh.load_data(dh.next_page, dom.create_table);
      }
    });

    let previous_page_button = document.getElementById('previous_page');
    previous_page_button.addEventListener('click', () => {
      if (typeof previous_page !== 'undefined' && dh.request_starts_triggering === true) {
        dh.request_starts_triggering = false;
        dh.load_data(dh.previous_page, dom.create_table);
      }
    });
  },

  // ==================================================================================================

  append_event_listener_for_logout_button: function (button) {
    button.addEventListener('click', () => {

      localStorage.removeItem('login');
      localStorage.removeItem('user_id');

      modal.show_logout_modal();
      setTimeout(() => {
        modal.hide_all_modals();
        dom.remove_login_div();
        dom.hide_vote_column();
        dom.restore_log_modal();
        dom.restore_reg_modal();
        dom.show_log_reg_links();
        voting.enable_all_buttons();
      }, 2000);
    });
  },

  // ==================================================================================================

  append_event_listener_for_residents_button: function (planet_index, planet) {
    let number_of_residents = planet.residents.length;
    let button_to_show_residents = document.getElementById(`resident_but_${planet_index}`);

    if (number_of_residents > 0 && button_to_show_residents) {
      button_to_show_residents.addEventListener('click', () => modal.show_residents_modal(planet));
    }
  },

  // ==================================================================================================

  append_event_listener_for_vote_button: function(planet_index, planet_name) {
    let button_to_vote = document.getElementById(`vote_button_${planet_index}`);
    if (button_to_vote) {
      button_to_vote.addEventListener('click', () => {
        voting.vote_for_planet(button_to_vote, planet_index, planet_name)
      });
    }
  },

  // ==================================================================================================

  get_planets_from_swapi: function (requested_url) {
    dh.load_data(requested_url, this.save_planets_to_local_storage);
  },

  // ==================================================================================================

  save_planets_to_local_storage: function (object) {
    let all_planets = object.results;
    all_planets.forEach(object => main.planets.push(object));

    if (object.next !== null)
      main.get_planets_from_swapi(object.next);
    else {
      const js_obj = main.planets;
      const json_obj = JSON.stringify(js_obj);
      localStorage.setItem('planets', json_obj);

      dh.load_data(main.first_page, dom.create_table);
    }
  },

  // ==================================================================================================

  add_login_to_local_storage: function (login) {
    localStorage.setItem('login', login);
  },

  // ==================================================================================================

  add_user_id_to_local_storage: function (login) {
    const http_request = new XMLHttpRequest();
    http_request.open('GET', '/get_user_id/' + login);
    http_request.onload = () => {
      const user_id = http_request.response;
      if (user_id)
        localStorage.setItem('user_id', user_id);
      else
        console.log('Error in connecting with database')
    };

    http_request.send();
  },

  // ==================================================================================================

  check_connection_status: function () {

    if (navigator.onLine) {
      alert('online');
    } else {
      dh.load_data('./static/js/saved_data.json', dom.create_table);
    }
  }
};

// ==================================================================================================

function save_json_to_file(data, filename) {

  if (!data) {
    console.error('No data');
    return;
  }

  if (!filename) filename = 'console.json';

  if (typeof data === "object") {
    data = JSON.stringify(data);
  }

  var blob = new Blob([data], {type: 'text/json'}),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a');

  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(e)
}

// ==================================================================================================

main.main();