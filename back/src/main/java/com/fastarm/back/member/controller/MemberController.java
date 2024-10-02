package com.fastarm.back.member.controller;

import com.fastarm.back.auth.exception.NotCheckPasswordAuthenticationException;
import com.fastarm.back.auth.exception.NotCheckPhoneAuthenticationException;
import com.fastarm.back.auth.security.dto.LoginMemberInfo;
import com.fastarm.back.common.constants.RedisSessionConstants;
import com.fastarm.back.common.controller.dto.ApiResponse;
import com.fastarm.back.member.controller.dto.*;
import com.fastarm.back.member.exception.NotCheckNicknameDuplicationException;
import com.fastarm.back.member.service.MemberService;
import com.fastarm.back.member.validation.annotation.LoginId;
import com.fastarm.back.member.validation.annotation.Nickname;
import com.fastarm.back.member.validation.annotation.Phone;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URISyntaxException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/check-id")
    public ResponseEntity<?> idCheck(@LoginId @RequestParam("loginId") String loginId, HttpSession session) {
        memberService.checkId(loginId);
        session.setAttribute(RedisSessionConstants.CHECK_ID, loginId);
        return ResponseEntity.ok(new ApiResponse<>("ME101", "로그인 아이디 중복검사 성공", null));
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<?> nicknameCheck(@Nickname @RequestParam("nickname") String nickname, HttpSession session) {
        memberService.checkNickname(nickname);
        session.setAttribute(RedisSessionConstants.CHECK_NICKNAME, nickname);
        return ResponseEntity.ok(new ApiResponse<>("ME102", "닉네임 중복 검사 성공", null));
    }

    @GetMapping("/check-phone")
    public ResponseEntity<?> phoneCheck(@Phone @RequestParam("phone") String phone, HttpSession session) {
        memberService.checkPhone(phone);
        session.setAttribute(RedisSessionConstants.CHECK_PHONE, phone);
        return ResponseEntity.ok(new ApiResponse<>("ME103", "전화번호 중복 검사 성공", null));
    }

    @PostMapping
    public ResponseEntity<?> memberAdd(@Valid @RequestBody MemberAddRequest request, HttpSession session) {
        memberService.addMember(request.toDto(session));
        return new ResponseEntity<>(new ApiResponse<>("ME100", "회원가입 성공", null), HttpStatus.CREATED);
    }

    @GetMapping("/nickname")
    public ResponseEntity<?> nicknameGet(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        String result = memberService.getNickname(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("ME110", "닉네임 조회 성공", result));
    }

    @GetMapping("/find-id")
    public ResponseEntity<?> loginIdFind(@RequestParam("phone") String phone,
                                         @SessionAttribute(name = RedisSessionConstants.AUTH_PHONE, required = false) String authPhone) {
        if (authPhone == null || !authPhone.equals(phone)) {
            throw new NotCheckPhoneAuthenticationException();
        }
        String result = memberService.findLoginId(phone);
        return ResponseEntity.ok(new ApiResponse<>("ME104", "로그인 아이디 찾기 성공", result));
    }

    @PatchMapping("/find-password")
    public ResponseEntity<?> passwordFind(@Valid @RequestBody PasswordFindRequest passwordFindRequest,
                                          @SessionAttribute(name = RedisSessionConstants.AUTH_PHONE, required = false) String authPhone) {
        if (authPhone == null || !authPhone.equals(passwordFindRequest.getPhone())) {
            throw new NotCheckPhoneAuthenticationException();
        }
        memberService.findPassword(passwordFindRequest.toDto());
        return ResponseEntity.ok(new ApiResponse<>("ME105", "비밀번호 수정 성공", null));
    }

    @PatchMapping("/password")
    public ResponseEntity<?> passwordModify(@Valid @RequestBody PasswordModifyRequest passwordModifyRequest,
                                            @AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                            @SessionAttribute(name = RedisSessionConstants.AUTH_PASSWORD, required = false) String authPassword) {
        if (authPassword == null || !authPassword.equals(passwordModifyRequest.getExistPassword())) {
            throw new NotCheckPasswordAuthenticationException();
        }
        memberService.modifyPassword(passwordModifyRequest.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("ME105", "비밀번호 수정 성공", null));
    }

    @PatchMapping("/nickname")
    public ResponseEntity<?> nicknameModify(@Valid @RequestBody NicknameModifyRequest nicknameModifyRequest,
                                            @AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                            @SessionAttribute(name = RedisSessionConstants.CHECK_NICKNAME, required = false) String checkNickname) {
        if (checkNickname == null || !checkNickname.equals(nicknameModifyRequest.getNewNickname())) {
            throw new NotCheckNicknameDuplicationException();
        }
        memberService.modifyNickname(nicknameModifyRequest.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("ME107", "닉네임 수정 성공", null));
    }

    @PatchMapping("/phone")
    public ResponseEntity<?> phoneModify(@Valid @RequestBody PhoneModifyRequest phoneModifyRequest,
                                         @AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                         @SessionAttribute(name = RedisSessionConstants.AUTH_PHONE, required = false) String authPhone) {
        if (authPhone == null || !authPhone.equals(phoneModifyRequest.getNewPhone())) {
            throw new NotCheckPhoneAuthenticationException();
        }
        memberService.modifyPhone(phoneModifyRequest.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("ME109", "전화번호 수정 성공", null));
    }

    @PatchMapping("/profile-image")
    public ResponseEntity<?> profileImageModify(@ModelAttribute ProfileImageModifyRequest profileImageModifyRequest,
                                                @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) throws URISyntaxException, IOException {
        memberService.modifyProfileImage(profileImageModifyRequest.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("ME108", "프로필 사진 수정 성공", null));
    }

    @GetMapping("/profile-info")
    public ResponseEntity<?> myPageGet(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        ProfileInfoResponse result = memberService.getProfileInfo(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("ME111", "프로필 정보 조회 성공", result));
    }
}

