def validate_login_length(login_length):
    min_login_length = 4
    max_login_length = 10

    if min_login_length <= login_length <= max_login_length:
        return True
    else:
        return False

# ==========================================================================

