package com.fastarm.back.member.service;

import com.fastarm.back.auth.exception.NotCheckPhoneAuthenticationException;
import com.fastarm.back.common.constants.RedisSessionConstants;
import com.fastarm.back.common.service.S3Service;
import com.fastarm.back.member.controller.dto.ProfileInfoResponse;
import com.fastarm.back.member.dto.*;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.exception.*;
import com.fastarm.back.member.repository.MemberRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final S3Service s3Service;
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bcryptPasswordEncoder;

    @Transactional(readOnly = true)
    public void checkId(String loginId) {
        if (memberRepository.findByLoginId(loginId).isPresent()) {
            throw new LoginIdDuplicationException();
        }
    }

    @Transactional(readOnly = true)
    public void checkNickname(String nickname) {
        if (memberRepository.findByNickname(nickname).isPresent()) {
            throw new NicknameDuplicationException();
        }
    }

    @Transactional(readOnly = true)
    public void checkPhone(String phone) {
        if (memberRepository.findByPhone(phone).isPresent()) {
            throw new PhoneDuplicationException();
        }
    }

    @Transactional
    public void addMember(MemberAddDto memberAddDto) {
        if (checkSignupPreAuth(memberAddDto)) {
            String encodedPassword = bcryptPasswordEncoder.encode(memberAddDto.getPassword());
            memberRepository.save(memberAddDto.toEntity(encodedPassword));
        }
    }

    @Transactional(readOnly = true)
    public String getNickname(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);
        return member.getNickname();
    }

    @Transactional(readOnly = true)
    public String findLoginId(String phone) {
        Member member = memberRepository.findByPhone(phone)
                .orElseThrow(MemberNotFoundException::new);

        return member.getLoginId();
    }

    @Transactional
    public void findPassword(PasswordFindDto passwordFindDto) {
        Member member = memberRepository.findByLoginId(passwordFindDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        if (!passwordFindDto.getNewPassword().equals(passwordFindDto.getCheckPassword())) {
            throw new PasswordModificationException();
        }

        member.modifyPassword(bcryptPasswordEncoder.encode(passwordFindDto.getNewPassword()));
    }

    @Transactional
    public void modifyPassword(PasswordModifyDto passwordModifyDto) {
        Member member = memberRepository.findByLoginId(passwordModifyDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        if (!passwordModifyDto.getNewPassword().equals(passwordModifyDto.getCheckPassword())) {
            throw new PasswordModificationException();
        }

        member.modifyPassword(bcryptPasswordEncoder.encode(passwordModifyDto.getNewPassword()));
    }

    @Transactional
    public void modifyNickname(NicknameModifyDto nicknameModifyDto) {
        Member member = memberRepository.findByLoginId(nicknameModifyDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        member.modifyNickname(nicknameModifyDto.getNewNickname());
    }

    @Transactional
    public void modifyPhone(PhoneModifyDto phoneModifyDto) {
        Member member = memberRepository.findByLoginId(phoneModifyDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        member.modifyPhone(phoneModifyDto.getNewPhone());
    }

    @Transactional
    public void modifyProfileImage(ProfileImageModifyDto profileImageModifyDto) throws URISyntaxException, IOException {
        Member member = memberRepository.findByLoginId(profileImageModifyDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        MultipartFile profileImage = profileImageModifyDto.getProfileImage();

        if (profileImage != null) {
            if (member.getProfileImage() != null) {
                s3Service.deleteFile(member.getProfileImage());
            }
            String newPath = s3Service.uploadFile(profileImageModifyDto.getProfileImage());
            member.modifyProfileImage(newPath);
        } else {
            if (member.getProfileImage() != null) {
                s3Service.deleteFile(member.getProfileImage());
            }
            member.modifyProfileImage(null);
        }
    }

    @Transactional(readOnly = true)
    public ProfileInfoResponse getProfileInfo(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);

        return ProfileInfoResponse.builder()
                .nickname(member.getNickname())
                .profileImage(member.getProfileImage())
                .build();
    }

    private Boolean checkSignupPreAuth(MemberAddDto memberAddDto) {

        HttpSession session = memberAddDto.getSession();
        String checkId = (String)session.getAttribute(RedisSessionConstants.CHECK_ID);
        String checkNickname = (String)session.getAttribute(RedisSessionConstants.CHECK_NICKNAME);
        String authPhone = (String)session.getAttribute(RedisSessionConstants.AUTH_PHONE);

        if (checkId == null || !checkId.equals(memberAddDto.getLoginId())) {
            throw new NotCheckLoginIdDuplicationException();
        }

        if (checkNickname == null || !checkNickname.equals(memberAddDto.getNickname())) {
            throw new NotCheckNicknameDuplicationException();
        }

        if (authPhone == null || !authPhone.equals(memberAddDto.getPhone())) {
            throw new NotCheckPhoneAuthenticationException();
        }

        return true;
    }
}

