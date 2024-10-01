package com.fastarm.back.auth.dto;

import com.fastarm.back.auth.enums.PhoneAuthPurpose;
import com.fastarm.back.member.validation.annotation.Phone;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PhoneSendDto {
    @Phone
    private String phone;
    private String loginId;
    private PhoneAuthPurpose purpose;
}

