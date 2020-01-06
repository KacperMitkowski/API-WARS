from flask import Flask, render_template, request
import json

# import password_hash as ph
from backend_validations import login_validation as lv
from backend_validations import password_validation as pv
from backend_validations import voting_validation as vv
from backend_validations import database_validation as dv

app = Flask(__name__)


# ==========================================================================

@app.route('/')
def show_main_page():
    return render_template('index.html')


# ==========================================================================
# REGISTRATION

@app.route('/check_login_length', methods=['POST'])
def check_login_length():
    login_length = request.get_json()['login_length']
    login_length_correct = lv.validate_login_length(login_length)

    if login_length_correct:
        json_obj = json.dumps(True)
    else:
        json_obj = json.dumps(False)

    return json_obj


# ==========================================================================

@app.route('/check_passwords_length', methods=['POST'])
def check_passwords_length():
    password_one_length = request.get_json()['password_one_length']
    password_two_length = request.get_json()['password_two_length']

    passwords_length_correct = pv.validate_password_length(password_one_length, password_two_length)

    if passwords_length_correct:
        json_obj = json.dumps(True)
    else:
        json_obj = json.dumps(False)

    return json_obj


# ==========================================================================

@app.route('/check_if_passwords_the_same', methods=['POST'])
def check_if_passwords_the_same():
    password_one = request.get_json()['password_one']
    password_two = request.get_json()['password_two']

    passwords_the_same = pv.passwords_are_equal(password_one, password_two)

    if passwords_the_same:
        json_obj = json.dumps(True)
    else:
        json_obj = json.dumps(False)

    return json_obj


# ==========================================================================


@app.route('/check_if_password_safe', methods=['POST'])
def check_if_password_safe():
    password = request.get_json()['password']

    if pv.password_is_safe(password):
        password_safe = True
    else:
        password_safe = False

    json_obj = json.dumps(password_safe)
    return json_obj


# ==========================================================================

@app.route('/check_if_user_exists', methods=['POST'])
def check_if_user_exists_in_db():
    login = request.get_json()['login']

    # CASE 1: LOGIN EXISTS IN DB
    all_users = dv.fetch_all_users()
    for user in all_users:
        if login == user['username']:
            login_exists_in_db = True
            json_obj = json.dumps(login_exists_in_db)
            return json_obj

    # CASE 2: LOGIN DOESN'T EXIST IN DB
    login_exists_in_db = False
    json_obj = json.dumps(login_exists_in_db)
    return json_obj


# ==========================================================================

@app.route('/add_user_to_db', methods=['POST'])
def add_user_to_db():
    login = request.get_json()['login']
    password = request.get_json()['password']
    hashed_password = ph.hash_password(password)

    if login and password:
        dv.save_new_user(login, hashed_password)
        user_added = True
        return json.dumps(user_added)
    else:
        user_added = False
        return json.dumps(user_added)


# ==========================================================================
# LOGIN

@app.route('/check_if_input_empty', methods=['POST'])
def check_if_input_empty():
    input_value = request.get_json()['value']
    input_length = len(input_value)

    if input_length == 0:
        input_empty = True
    else:
        input_empty = False

    json_obj = json.dumps(input_empty)
    return json_obj


# ==========================================================================

@app.route('/login', methods=['POST'])
def login():
    login = request.get_json()['login']
    password = request.get_json()['password']

    all_users = dv.fetch_all_users()

    for user in all_users:
        if login == user['username']:
            hashed_password = dv.fetch_password(login)

            # 1 CASE: CORRECT LOGIN AND CORRECT PASSWORD
            if ph.verify_password(password, hashed_password):
                login_and_password_ok = True
                json_obj = json.dumps(login_and_password_ok)
                return json_obj

            # 2 CASE: CORRECT LOGIN AND WRONG PASSWORD
            else:
                login_and_password_ok = False
                json_obj = json.dumps(login_and_password_ok)
                return json_obj

    # 3 CASE: WRONG LOGIN
    login_and_password_ok = False
    json_obj = json.dumps(login_and_password_ok)
    return json_obj


# ==========================================================================
# VOTING

@app.route('/vote', methods=['POST'])
def vote_for_planet():
    planet_id = request.get_json()['planet_id']
    planet_name = request.get_json()['planet_name']
    user_id = request.get_json()['user_id']

    planet_id_ok = vv.check_if_planet_id_ok(planet_id)
    planet_name_ok = vv.check_if_planet_name_ok(planet_name)
    user_id_ok = vv.check_if_user_id_ok(user_id)

    if planet_id_ok and planet_name_ok and user_id_ok:
        dv.add_new_vote(planet_id, planet_name, user_id)
        json_obj = json.dumps(True)
        return json_obj
    else:
        json_obj = json.dumps(False)
        return json_obj


# ==========================================================================

@app.route('/get_planets/<string:logged_user>')
def get_id_planets_with_user_votes(logged_user):
    logged_user_ok = vv.check_if_user_ok(logged_user)
    if logged_user_ok:
        user_id = dv.fetch_id(logged_user)
        planets_id = dv.fetch_voted_planets_id(user_id)
        json_obj = json.dumps(planets_id)
        return json_obj

    else:
        json_obj = json.dumps(False)
        return json_obj


# ==========================================================================

@app.route('/get_votes_for_planet/<string:planet_name>')
def get_votes_for_planet(planet_name):
    planet_name_ok = vv.check_if_planet_name_ok(planet_name)
    if planet_name_ok:
        vote_amount = dv.fetch_vote_amount(planet_name)

        # 1 CASE: PLANET HAS VOTES
        if vote_amount:
            json_obj = json.dumps(vote_amount)
            return json_obj

        # 2 CASE: PLANET DOESN'T HAVE VOTES
        else:
            json_obj = json.dumps(0)
            return json_obj


# ==========================================================================

@app.route('/get_user_id/<string:logged_user>')
def get_user_id(logged_user):
    login_ok = vv.check_if_user_ok(logged_user)

    if login_ok:
        user_id = dv.fetch_id(logged_user)
        json_obj = json.dumps(user_id)
        return json_obj
    else:
        json_obj = json.dumps(False)
        return json_obj


# ==========================================================================

if __name__ == '__main__':
    app.run(debug=True)
