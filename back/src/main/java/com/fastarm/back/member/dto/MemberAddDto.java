package com.fastarm.back.member.dto;

import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.enums.Gender;
import com.fastarm.back.member.enums.Role;
import com.fastarm.back.member.valication.annotation.LoginId;
import com.fastarm.back.member.valication.annotation.Nickname;
import com.fastarm.back.member.valication.annotation.Password;
import com.fastarm.back.member.valication.annotation.Phone;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberAddDto {
    private String loginId;
    private String password;
    private String name;
    private String nickname;
    private LocalDate birth;
    private String phone;
    private Gender gender;
    private Role role;

    HttpSession session;

    public Member toEntity() {
        return Member.builder()
                .loginId(loginId)
                .password(password)
                .name(name)
                .nickname(nickname)
                .birth(birth)
                .phone(phone)
                .gender(gender)
                .role(role)
                .build();
    }
}
