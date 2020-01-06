import psycopg2

from database import db_queries as db


# ==========================================================================

def fetch_all_users():
    try:
        all_users = db.get_all_users()
        return all_users
    except psycopg2.Error as e:
        print('Unable to connect to database')
        print(e.pgerror)
        return []


# ==========================================================================

def save_new_user(login, hashed_password):
    try:
        db.add_new_user(login, hashed_password)
    except psycopg2.Error as e:
        print('Unable to connect to database')
        print(e.pgerror)
        return None


# ==========================================================================

def fetch_password(login):
    try:
        hashed_password = db.get_password_for_user(login)
        return hashed_password
    except psycopg2.Error as e:
        print('Unable to connect to database')
        print(e.pgerror)
        return []


# ==========================================================================

def add_new_vote(planet_id, planet_name, user_id):
    try:
        db.add_vote(planet_id, planet_name, user_id)
    except psycopg2.Error as e:
        print('Unable to connect to database')
        print(e.pgerror)
        return None


# ==========================================================================

def fetch_id(logged_user):
    try:
        user_id = db.get_user_id(logged_user)
        return user_id
    except psycopg2.Error as e:
        print('Unable to connect to database')
        print(e.pgerror)
        return []


# ==========================================================================

def fetch_voted_planets_id(user_id):
    try:
        voted_planets_id = db.get_voted_planets_id(user_id)
        return voted_planets_id
    except psycopg2.Error as e:
        print('Unable to connect to database')
        print(e.pgerror)
        return []


# ==========================================================================

def fetch_vote_amount(planet_name):
    try:
        vote_amount = db.get_vote_amount(planet_name)
        return vote_amount
    except psycopg2.Error as e:
        print('Unable to connect to database')
        print(e.pgerror)
        return []

# ==========================================================================
