from database import db_connection as con


@con.connection_handler
def get_all_users(cursor):
    sql_string = """
                    SELECT username
                    FROM users;
                 """
    cursor.execute(sql_string)
    all_users = cursor.fetchall()
    return all_users


@con.connection_handler
def get_password_for_user(cursor, login):
    sql_string = """
                    SELECT password 
                    FROM users
                    WHERE username=%(login)s;
                 """
    cursor.execute(sql_string, {'login': login})
    password = cursor.fetchone()['password']
    return password


@con.connection_handler
def add_new_user(cursor, login, hashed_password):
    sql_string = """
                    INSERT INTO users (username, 
                                       password)
                    VALUES (%(login)s, 
                            %(hashed_password)s);          
                 """
    cursor.execute(sql_string,
                   {'login': login,
                    'hashed_password': hashed_password})
    return None


@con.connection_handler
def get_user_id(cursor, login):
    sql_string = """
                    SELECT user_id
                    FROM users
                    WHERE username=%(login)s;
                 """

    cursor.execute(sql_string, {'login': login})
    user_id = cursor.fetchone()['user_id']
    return user_id


@con.connection_handler
def add_vote(cursor, planet_id, planet_name, user_id):
    sql_string = """
                    INSERT INTO planet_votes (planet_id, 
                                              planet_name, 
                                              user_id, 
                                              submission_time)
                    VALUES (%(planet_id)s, 
                            %(planet_name)s, 
                            %(user_id)s, 
                            DATE_TRUNC('minute', now()));
                 """

    cursor.execute(sql_string, {'planet_id': planet_id,
                                'planet_name': planet_name,
                                'user_id': user_id})
    return True


@con.connection_handler
def get_voted_planets_id(cursor, user_id):
    sql_string = """
                    SELECT DISTINCT planet_id
                    FROM planet_votes
                    WHERE user_id = %(user_id)s;
                 """
    cursor.execute(sql_string, {'user_id': user_id})
    planets_id = cursor.fetchall()
    return planets_id


@con.connection_handler
def get_vote_amount(cursor, planet_name):
    sql_string = """
                    SELECT COUNT(planet_id)
                    FROM planet_votes
                    WHERE planet_name=%(planet_name)s;
                 """
    cursor.execute(sql_string, {'planet_name': planet_name})
    vote_amount = cursor.fetchone()['count']
    return vote_amount
