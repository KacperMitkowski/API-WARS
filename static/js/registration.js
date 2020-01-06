export {register};
import {modal} from "./modal.js";
import {dom} from "./dom.js";

let error_registration_div;

// ==============================================================================

const register = {
  try_to_register: function () {
    let login = document.getElementById('login').value;
    this.check_login_length(login);
  },

  // ==================================================================================================

  check_login_length: function (login) {

    let http_request = new XMLHttpRequest();
    http_request.open('POST', '/check_login_length');
    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.onload = () => {
      let login_length_correct = JSON.parse(http_request.response);
      if (login_length_correct) {
        let password_one = document.getElementById('password_one').value;
        let password_two = document.getElementById('password_two').value;
        this.check_passwords_length(password_one, password_two);
      }
      else
        this.show_error_message('Nick must have between 4 and 10 chars');
    };

    let js_obj = {login_length: login.length};
    let json_obj = JSON.stringify(js_obj);
    http_request.send(json_obj);
  },

  // ==================================================================================================

  check_passwords_length: function (password_one, password_two) {

    let http_request = new XMLHttpRequest();
    http_request.open('POST', '/check_passwords_length');
    http_request.setRequestHeader('Content-Type', 'application/json');

    http_request.onload = () => {
      let passwords_length_correct = JSON.parse(http_request.response);
      if (passwords_length_correct)
        this.check_if_passwords_the_same(password_one, password_two);
      else
        this.show_error_message('No password');
    };

    let js_obj = {
      password_one_length: password_one.length,
      password_two_length: password_two.length
    };

    let json_obj = JSON.stringify(js_obj);
    http_request.send(json_obj);
  },

  // ==================================================================================================

  check_if_passwords_the_same: function (password_one, password_two) {
    let http_request = new XMLHttpRequest();
    http_request.open('POST', '/check_if_passwords_the_same');
    http_request.setRequestHeader('Content-Type','application/json');
    http_request.onload = () => {
      let passwords_the_same = JSON.parse(http_request.response);

      if (passwords_the_same)
        this.check_if_password_safe(password_one);
      else {
        this.clear_password_inputs();
        this.show_error_message('Passwords are different');
      }
    };
    let js_obj = {
      password_one: password_one,
      password_two: password_two
    };
    let json_obj = JSON.stringify(js_obj);
    http_request.send(json_obj);
  },

  // ==================================================================================================

  check_if_password_safe: function (password) {
    let http_request = new XMLHttpRequest();
    http_request.open('POST', '/check_if_password_safe');
    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.onload = () => {
      let password_safe = JSON.parse(http_request.response);
      if (password_safe) {
        let login = document.getElementById('login').value;
        this.check_if_login_exists_in_db(login, password);
      }
      else {
        this.clear_password_inputs();
        this.show_error_message('Passwords are equal but contain wrong chars');
      }
    };

    let js_obj = {password: password};
    let json_obj = JSON.stringify(js_obj);
    http_request.send(json_obj)
  },

  // ==================================================================================================

  check_if_login_exists_in_db: function (login, password) {
    let http_request = new XMLHttpRequest();
    http_request.open('POST', '/check_if_user_exists');
    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.onload = () => {
      let user_exists_in_db = JSON.parse(http_request.response);

      if (user_exists_in_db) {
        error_registration_div ? dom.clear_div(error_registration_div) : null;
        this.clear_login_input();
        this.clear_password_inputs();
        this.show_error_message('User already exists');
      } else
        this.add_user_to_db(login, password)
    };

    let js_obj = {login: login};
    let json_obj = JSON.stringify(js_obj);
    http_request.send(json_obj);
  },

  // ==================================================================================================

  add_user_to_db: function (login, password) {
    let http_request = new XMLHttpRequest();
    http_request.open('POST', '/add_user_to_db');
    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.onload = () => {
      let user_added_to_db = JSON.parse(http_request.response);

      if (user_added_to_db)
        modal.clear_reg_modal_and_show_message('Successful registration');
      else
        console.log('Error in connecting with database')
    };

    let js_obj = {login: login, password: password};
    let json_obj = JSON.stringify(js_obj);
    http_request.send(json_obj);
  },

  // ==================================================================================================

  clear_login_input: function () {
    let login_input = document.getElementById('login');
    login_input.value = '';
  },

  // ==================================================================================================

  clear_password_inputs: function () {
    let first_password_input = document.getElementById('password_one');
    let second_password_input = document.getElementById('password_two');
    first_password_input.value = '';
    second_password_input.value = '';
  },

  // ==================================================================================================

  show_error_message: function (message) {
    error_registration_div ? dom.clear_div(error_registration_div) : null;
    error_registration_div = document.getElementById('error_registration_div');
    error_registration_div.insertAdjacentHTML('afterbegin', message);

    setTimeout(() => dom.clear_div(error_registration_div), 3000);
    this.clear_password_inputs();
  }
};

// ==================================================================================================

let register_button = document.getElementById('register');
register_button.addEventListener('click', () => register.try_to_register());