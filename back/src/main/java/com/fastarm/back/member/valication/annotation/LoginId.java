package com.fastarm.back.member.valication.annotation;

import com.fastarm.back.member.valication.validator.LoginIdValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = LoginIdValidator.class)
public @interface LoginId {
    String message() default "로그인 아이디 형식 불일치";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

