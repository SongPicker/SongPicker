package com.fastarm.back.auth.controller;

import com.fastarm.back.auth.controller.dto.PasswordVerifyRequest;
import com.fastarm.back.auth.dto.PhoneSendDto;
import com.fastarm.back.auth.dto.PhoneVerifyDto;
import com.fastarm.back.auth.enums.PhoneAuthPurpose;
import com.fastarm.back.auth.security.dto.LoginMemberInfo;
import com.fastarm.back.auth.service.AuthService;
import com.fastarm.back.common.constants.RedisSessionConstants;
import com.fastarm.back.common.controller.dto.ApiResponse;
import com.fastarm.back.member.exception.NotCheckPhoneDuplicationException;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auths")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/phone/send")
    public ResponseEntity<?> authCodeSend(@Valid @RequestBody PhoneSendDto phoneSendDto,
                                          @SessionAttribute(name = RedisSessionConstants.CHECK_PHONE, required = false) String phone) {
        if (phoneSendDto.getPurpose() == PhoneAuthPurpose.SIGNUP || phoneSendDto.getPurpose() == PhoneAuthPurpose.CHANGE_PHONE) {
            if (!phoneSendDto.getPhone().equals(phone)) {
                throw new NotCheckPhoneDuplicationException();
            }
        }
        authService.sendAuthCode(phoneSendDto);
        return ResponseEntity.ok(new ApiResponse<>("AU101", "전화번호 인증 코드 전송 성공", null));
    }

    @PostMapping("/phone/verify")
    public ResponseEntity<?> authCodeVerify(@Valid @RequestBody PhoneVerifyDto phoneVerifyDto, HttpSession session) {
        authService.verifyAuthCode(phoneVerifyDto);
        session.setAttribute(RedisSessionConstants.AUTH_PHONE, phoneVerifyDto.getPhone());
        return ResponseEntity.ok(new ApiResponse<>("AU102", "전화번호 인증 성공", null));
    }

    @PostMapping("/password/verify")
    public ResponseEntity<?> passwordVerify(@Valid @RequestBody PasswordVerifyRequest passwordVerifyRequest,
                                            @AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                            HttpSession session) {
        authService.verifyPassword(passwordVerifyRequest.toDto(loginMemberInfo.getLoginId()));
        session.setAttribute(RedisSessionConstants.AUTH_PASSWORD, passwordVerifyRequest.getPassword());
        return ResponseEntity.ok(new ApiResponse<>("AU103", "비밀번호 인증 성공", null));
    }
}

