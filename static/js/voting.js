export {voting}
import {modal} from "./modal.js";

// ==================================================================================================

const voting = {
  vote_for_planet: function (button_to_vote, planet_index, planet_name) {
    const user_id = localStorage.getItem('user_id');

    const http_request = new XMLHttpRequest();
    http_request.open('POST','/vote');
    http_request.setRequestHeader('Content-Type','application/json');
    http_request.onload = () => {
      const vote_added = JSON.parse(http_request.response);
      if(vote_added) {
        button_to_vote.disabled = true;
        modal.show_vote_modal();
        setTimeout(() => {
          modal.hide_all_modals()
        },2000)
      }
      else
        console.log('Error in connecting with database')
    };

    const js_obj = {
      planet_id: planet_index,
      planet_name: planet_name,
      user_id: user_id
    };
    const json_obj = JSON.stringify(js_obj);
    http_request.send(json_obj);
  },

  // ==================================================================================================

  get_id_planets_with_user_votes: function (logged_user) {
    const http_request = new XMLHttpRequest();
    http_request.open('GET','/get_planets/' + logged_user);

    http_request.onload = () => {
      const planets_id = JSON.parse(http_request.response);
      if(planets_id)
        this.disable_vote_buttons_for_user(planets_id);
      else
        console.log('Error in connecting with database')
    };

    http_request.send();
  },

  // ==================================================================================================

  disable_vote_buttons_for_user: function (planets) {
    for(let planet of planets) {
      const button = document.getElementById(`vote_button_${planet.planet_id}`);
      if(button)
        button.disabled = true;
    }
  },

  // ==================================================================================================

  enable_all_buttons: function () {
    const all_buttons = document.querySelectorAll('.vote_column > button');
    all_buttons.forEach(button => button.disabled = false);
  },

  // ==================================================================================================

  get_votes_for_planet: function (planet_name) {
    const http_request = new XMLHttpRequest();
    http_request.open('GET','/get_votes_for_planet/' + planet_name);

    http_request.onload = () => {
      let votes = JSON.parse(http_request.response);
      modal.add_vote_amount_to_modal_row(planet_name, votes);
    };

    http_request.send();
  }
};