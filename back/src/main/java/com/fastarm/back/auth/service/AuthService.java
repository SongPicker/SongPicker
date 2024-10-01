package com.fastarm.back.auth.service;

import com.fastarm.back.auth.dto.PasswordVerifyDto;
import com.fastarm.back.auth.dto.PhoneSendDto;
import com.fastarm.back.auth.dto.PhoneVerifyDto;
import com.fastarm.back.auth.enums.PhoneAuthPurpose;
import com.fastarm.back.auth.exception.PasswordAuthenticationException;
import com.fastarm.back.auth.exception.PhoneAuthenticationException;
import com.fastarm.back.common.constants.RedisConstants;
import com.fastarm.back.common.constants.RedisExpiredTimeConstants;
import com.fastarm.back.common.service.RedisService;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.exception.LoginIdPhoneMismatchException;
import com.fastarm.back.member.exception.MemberNotFoundException;
import com.fastarm.back.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final DefaultMessageService messageService;
    private final RedisService redisService;
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private static final String senderPhone = "01085914442";

    private String createCode() {
        int leftLimit = 48;
        int rightLimit = 122;
        int targetStringLength = 6;
        Random random = new Random();

        return random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 | i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }

    @Transactional
    public void sendAuthCode(PhoneSendDto phoneSendDto) {

        if (phoneSendDto.getPurpose() == PhoneAuthPurpose.FIND_PASSWORD) {
            Member member = memberRepository.findByLoginId(phoneSendDto.getLoginId())
                    .orElseThrow(MemberNotFoundException::new);
            if (!member.getPhone().equals(phoneSendDto.getPhone())) {
                throw new LoginIdPhoneMismatchException();
            }
        }

        String receiverPhone = phoneSendDto.getPhone();
        String authCode = createCode();
        Message message = new Message();
        message.setFrom(senderPhone);
        message.setTo(receiverPhone);
        message.setText(authCode);
        redisService.setData(generatePrefixedKey(receiverPhone), authCode, RedisExpiredTimeConstants.PHONE_AUTH_EXPIRED);

        messageService.sendOne(new SingleMessageSendingRequest(message));
    }

    public void verifyAuthCode(PhoneVerifyDto phoneVerifyDto) {
        String issuedCode = (String)redisService.getData(generatePrefixedKey(phoneVerifyDto.getPhone()));

        if (!issuedCode.equals(phoneVerifyDto.getAuthCode())) {
            throw new PhoneAuthenticationException();
        }
        redisService.deleteData(generatePrefixedKey(phoneVerifyDto.getPhone()));
    }

    @Transactional
    public void verifyPassword(PasswordVerifyDto passwordVerifyDto) {
        Member member = memberRepository.findByLoginId(passwordVerifyDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        if (!bCryptPasswordEncoder.matches(passwordVerifyDto.getInputPassword(), member.getPassword())) {
            throw new PasswordAuthenticationException();
        }
    }

    private String generatePrefixedKey(String phone) {
        return RedisConstants.AUTH_CODE + phone;
    }
}

