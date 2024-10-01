package com.fastarm.back.member.controller.dto;

import com.fastarm.back.member.dto.PhoneModifyDto;
import com.fastarm.back.member.validation.annotation.Phone;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PhoneModifyRequest {
    @Phone
    private String newPhone;

    public PhoneModifyDto toDto(String loginId) {
        return PhoneModifyDto.builder()
                .newPhone(newPhone)
                .loginId(loginId)
                .build();
    }
}
