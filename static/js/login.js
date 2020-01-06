export {login};
import {modal} from "./modal.js";
import {main} from "./main.js";
import {voting} from "./voting.js";
import {dom} from "./dom.js";

let error_login_div;

// ==================================================================================================

const login = {
  try_log_in: function () {
    let login = document.getElementById('login_input').value;
    this.check_if_login_empty(login);
  },

  // ==================================================================================================

  check_if_login_empty: function (login) {

    let http_request = new XMLHttpRequest();
    http_request.open('POST', '/check_if_input_empty');
    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.onload = () => {
      let login_empty = JSON.parse(http_request.response);
      if(login_empty)
      {
        this.show_error_message('You didn\'t choose login');
        this.clear_password_input();
      }
      else {
        let password = document.getElementById('password_input').value;
        this.check_if_password_empty(password);
      }
    };

    let js_obj = {value: login};
    let json_obj = JSON.stringify(js_obj);
    http_request.send(json_obj);
  },

  // ==================================================================================================

  check_if_password_empty: function(password) {
    let http_request = new XMLHttpRequest();
    http_request.open('POST', '/check_if_input_empty');
    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.onload = () => {
      let password_empty = JSON.parse(http_request.response);

      if(password_empty)
        this.show_error_message('You didn\'t choose password');
      else {
        let login = document.getElementById('login_input').value;
        this.login_user(login, password);
      }
    };
    let js_obj = {value: password};
    let json_obj = JSON.stringify(js_obj);
    http_request.send(json_obj);
  },

  // ==================================================================================================

  login_user: function(login, password) {
    const http_request = new XMLHttpRequest();
    http_request.open('POST', '/login');
    http_request.setRequestHeader('Content-Type', 'application/json');

    http_request.onload = () => {
      let login_and_password_ok = JSON.parse(http_request.response);
      if (login_and_password_ok) {
        main.add_login_to_local_storage(login);
        main.add_user_id_to_local_storage(login);
        modal.show_success_message('Successful login');

        setTimeout(() => {
          modal.hide_all_modals();
          dom.hide_log_reg_links();
          dom.add_login_div(login);
          dom.add_logout_button();
          dom.show_vote_column();
          voting.get_id_planets_with_user_votes(login);
        }, 2000);

      }
      else {
        this.show_error_message('Wrong login or password');
        this.clear_password_input();
      }
    };
    const js_obj = {login: login, password: password};
    const json_obj = JSON.stringify(js_obj);
    http_request.send(json_obj);
  },

// ==================================================================================================

  show_error_message: function (message) {
    error_login_div = document.getElementById('error_login_div');
    error_login_div.insertAdjacentHTML('afterbegin', message);

    setTimeout(() => dom.clear_div(error_login_div), 3000);
  },

// ==================================================================================================
  
  clear_password_input: function () {
    let password_input = document.getElementById('password_input');
    password_input.value = '';
  }
};

// ==================================================================================================

let login_button = document.getElementById('login_button');
login_button.addEventListener('click', ()=> login.try_log_in());