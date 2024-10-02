package com.fastarm.back.auth.security.filter;

import com.fastarm.back.auth.exception.RefreshAuthenticationException;
import com.fastarm.back.auth.security.service.ResponseService;
import com.fastarm.back.auth.security.util.JwtUtil;
import com.fastarm.back.common.constants.JwtConstants;
import com.fastarm.back.common.constants.RedisConstants;
import com.fastarm.back.common.constants.RedisFieldConstants;
import com.fastarm.back.common.service.RedisService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean {

    private final RedisService redisService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String requestURI = request.getRequestURI();
        if (!requestURI.equals("/auths/logout")) {
            chain.doFilter(request, response);
            return;
        }

        String requestMethod = request.getMethod();
        if (!requestMethod.equals("POST")) {
            chain.doFilter(request, response);
            return;
        }

        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            throw new RefreshAuthenticationException();
        }

        try {
            JwtUtil.isExpired(refreshToken);
        } catch (ExpiredJwtException e) {
            throw new RefreshAuthenticationException();
        }

        String loginId = JwtUtil.getLoginId(refreshToken);

        if (redisService.getHashData(generatePrefixedKey(loginId), RedisFieldConstants.REFRESH) == null) {
            throw new RefreshAuthenticationException();
        }

        redisService.deleteData(generatePrefixedKey(loginId));

        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setSecure(true);

        response.addCookie(cookie);
        ResponseService.setResponse(response, "AU105", "로그아웃 성공", null, HttpStatus.OK);
    }

    private String generatePrefixedKey(String key) {
        return RedisConstants.TOKEN + key;
    }
}
