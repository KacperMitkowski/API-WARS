def check_if_planet_id_ok(planet_id):
    if type(planet_id) != int:
        return False
    if planet_id is None:
        return False

    return True


# ==========================================================================

def check_if_planet_name_ok(planet_name):
    if type(planet_name) != str:
        return False
    if planet_name is None:
        return False

    return True


# ==========================================================================

def check_if_user_id_ok(user_id):
    user_id = int(user_id)

    if type(user_id) != int:
        return False
    if user_id is None:
        return False

    return True


# ==========================================================================

def check_if_user_ok(user):
    if type(user) != str:
        return False
    if user is None:
        return False

    return True

# ==========================================================================
