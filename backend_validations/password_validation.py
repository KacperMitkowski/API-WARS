import re


# ==========================================================================

def validate_password_length(password_one_length, password_two_length):
    if password_one_length == 0 or password_two_length == 0:
        return False
    else:
        return True


# ==========================================================================

def passwords_are_equal(password_one, password_two):
    if password_one == password_two:
        return True
    else:
        return False


# ==========================================================================

def password_is_safe(password):
    lowercase_letter_counter = 0
    uppercase_letter_counter = 0
    digit_counter = 0
    special_symbol_counter = 0
    pattern_for_special_symbol = '[!@#$%^&*()_+=]'

    password_min_length = 4
    password_max_length = 10
    password_length = len(password)

    for char in password:
        if char.islower():
            lowercase_letter_counter += 1
        if char.isupper():
            uppercase_letter_counter += 1
        if char.isdigit():
            digit_counter += 1
        if re.findall(pattern_for_special_symbol, char):
            special_symbol_counter += 1

    if password_length < password_min_length or password_length > password_max_length:
        return False
    if lowercase_letter_counter == 0:
        return False
    if uppercase_letter_counter == 0 or uppercase_letter_counter > 1:
        return False
    if digit_counter == 0 or digit_counter > 1:
        return False
    if special_symbol_counter == 0 or special_symbol_counter > 1:
        return False

    return True

# ==========================================================================
