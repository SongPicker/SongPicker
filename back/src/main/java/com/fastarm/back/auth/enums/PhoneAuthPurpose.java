package com.fastarm.back.auth.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PhoneAuthPurpose {
    SIGNUP, FIND_PASSWORD, MODIFY_PASSWORD, CHANGE_PHONE, FIND_LOGIN_ID;

}

