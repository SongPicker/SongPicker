import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginInput from '../../atoms/login/LoginInput';
import LoginButton from '../../atoms/login/LoginButton';
import PasswordVisibilityToggle from '../../atoms/commons/PasswordVisibilityToggle';
import axiosInstance from '../../../services/axiosInstance';
import useAuthStore from '../../../stores/useAuthStore';
import { getToken } from 'firebase/messaging';
import { messaging } from '../../../firebaseConfig';

const LoginForm = () => {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const setSongSelected = useAuthStore(state => state.setSongSelected);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const requestNotificationPermissionAndSendToken = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('알림 권한이 거부되었습니다.');
        return;
      }

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      console.log('FCM 토큰:', token);

      if (token) {
        await sendTokenToServer(token);
      }
    } catch (error) {
      console.error('알림 권한 요청 또는 FCM 토큰 수신 중 오류 발생:', error);
    }
  };

  const sendTokenToServer = async (token: string) => {
    try {
      const response = await axiosInstance.post('/api/notifications/fcm', { token });
      if (response.data.code === 'NO106') {
        console.log('토큰이 서버로 전송되었습니다.');
      } else {
        throw new Error('토큰 전송 실패');
      }
    } catch (error) {
      console.error('토큰 전송 중 오류 발생:', error);
    }
  };

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!userId || !userPassword) {
      setErrorMessage('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/auths/login', {
        loginId: userId,
        password: userPassword,
      });

      if (response.data.code === 'AU100') {
        const authToken = response.headers['authorization'];
        if (authToken) {
          login(userId, authToken);
          const isSongSelected = response.data.data;
          setSongSelected(isSongSelected);

          // 로그인 성공 후 알림 권한 요청 및 FCM 토큰 전송
          await requestNotificationPermissionAndSendToken();

          navigate(isSongSelected ? '/' : '/song-select');
        } else {
          setErrorMessage('인증 토큰을 받지 못했습니다.');
        }
      } else {
        setErrorMessage(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <form className="w-full text-white text-lg">
      <div className="mb-6">
        <label htmlFor="userId" className="block text-white mb-2">
          아이디
        </label>
        <LoginInput
          id="userId"
          type="text"
          placeholder="아이디를 입력해 주세요."
          value={userId}
          onChange={e => setUserId(e.target.value)}
        />
      </div>
      <div className="mb-2 relative">
        <label htmlFor="userPassword" className="block text-white mb-2">
          비밀번호
        </label>
        <LoginInput
          id="userPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호를 입력해 주세요."
          value={userPassword}
          onChange={e => setUserPassword(e.target.value)}
        />
        <PasswordVisibilityToggle
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />
      </div>
      <div className="text-right mb-2">
        <a href="/find-account" className="text-input-text hover:text-white text-sm">
          아이디 • 비밀번호 찾기
        </a>
      </div>
      <div className="h-6 text-red-500 text-sm text-center mb-3">{errorMessage}</div>
      <LoginButton onClick={handleLogin}>로그인</LoginButton>
    </form>
  );
};

export default LoginForm;
