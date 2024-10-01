import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '../services/axiosInstance';
import axios, { AxiosError } from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  role: string | null;
  loginId: string | null;
  isSongSelected: boolean; // 곡 선택 여부
  setSongSelected: (isSelected: boolean) => void; // 곡 선택 상태 설정 함수
  register: (userData: RegisterData) => Promise<void>;
  login: (accessToken: string, loginId: string) => void;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
  getLoginId: () => string | null;
  checkLoginIdAvailability: (loginId: string) => Promise<{ isAvailable: boolean; message: string }>;
  checkNicknameAvailability: (
    nickname: string
  ) => Promise<{ isAvailable: boolean; message: string }>;
  checkPhoneAvailability: (phone: string) => Promise<{ isAvailable: boolean; message: string }>;
  sendPhoneVerification: (
    phone: string,
    purpose: string
  ) => Promise<{ isSuccess: boolean; message: string }>;
  verifyPhoneCode: (
    authCode: string,
    phone: string
  ) => Promise<{ isSuccess: boolean; message: string }>;
}

interface RegisterData {
  loginId: string;
  password: string;
  name: string;
  nickname: string;
  birth: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_OWNER';
}

interface ErrorResponse {
  message: string;
}

// 로그아웃 요청 함수
const logoutRequest = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.post('/api/auths/logout');
    if (response.data.code === 'AU105') {
      console.log('로그아웃 성공');
      return true;
    } else {
      console.error('로그아웃 실패:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    return false;
  }
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      role: null,
      loginId: null,
      isSongSelected: false, // 기본값은 false
      setSongSelected: (isSelected: boolean) => {
        set({ isSongSelected: isSelected });
      },
      register: async (userData: RegisterData) => {
        console.log('Registering user with data:', JSON.stringify(userData, null, 2));
        try {
          const response = await axiosInstance.post('/api/members', userData);
          console.log('Registration API response:', response.data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ErrorResponse>;
            console.error(
              'Registration failed:',
              axiosError.response?.data?.message || 'Unknown error',
              '\nStatus:',
              axiosError.response?.status,
              '\nData:',
              axiosError.response?.data
            );
          } else {
            console.error('Registration failed:', (error as Error).message);
          }
          throw error;
        }
      },
      login: (loginId: string, accessToken: string) => {
        const formattedToken = accessToken.startsWith('Bearer ')
          ? accessToken
          : `Bearer ${accessToken}`;
        console.log('Setting token in login:', formattedToken); // 로그인 시 토큰 출력
        set({ isAuthenticated: true, loginId, accessToken: formattedToken });
      },

      setAccessToken: (token: string) => {
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        console.log('Setting new access token:', formattedToken); // 토큰 재발급 시 출력
        set({ accessToken: formattedToken, isAuthenticated: true });
      },

      // 로그아웃 기능 구현
      logout: async () => {
        const isLoggedOut = await logoutRequest();
        if (isLoggedOut) {
          console.log('로그아웃 상태 업데이트 및 localStorage 삭제');
          set({ isAuthenticated: false, accessToken: null, loginId: null });
          localStorage.removeItem('auth-storage'); // 로컬 스토리지에서 인증 정보 삭제
        } else {
          console.error('로그아웃 처리 실패');
        }
      },

      getAccessToken: () => get().accessToken,
      getLoginId: () => get().loginId,

      checkLoginIdAvailability: async (loginId: string) => {
        try {
          const response = await axiosInstance.get(`/api/members/check-id`, {
            params: { loginId },
          });
          const { code, message } = response.data;
          switch (code) {
            case 'ME101':
              return { isAvailable: true, message: '사용 가능한 아이디입니다.' };
            case 'ME001':
              return { isAvailable: false, message: '이미 사용 중인 아이디입니다.' };
            default:
              return { isAvailable: false, message: '아이디 확인 중 오류가 발생했습니다.' };
          }
        } catch (error) {
          console.error('Login ID check failed:', error);
          return { isAvailable: false, message: '아이디 확인 중 오류가 발생했습니다.' };
        }
      },

      checkNicknameAvailability: async (nickname: string) => {
        try {
          const response = await axiosInstance.get(`/api/members/check-nickname`, {
            params: { nickname },
          });
          const { code, message } = response.data;
          switch (code) {
            case 'ME102':
              return { isAvailable: true, message: '사용 가능한 닉네임입니다.' };
            case 'ME003':
              return { isAvailable: false, message: '이미 사용 중인 닉네임입니다.' };
            default:
              return { isAvailable: false, message: '닉네임 확인 중 오류가 발생했습니다.' };
          }
        } catch (error) {
          console.error('Nickname check failed:', error);
          return { isAvailable: false, message: '닉네임 확인 중 오류가 발생했습니다.' };
        }
      },

      checkPhoneAvailability: async (phone: string) => {
        try {
          const response = await axiosInstance.get(`/api/members/check-phone`, {
            params: { phone },
          });
          const { code, message } = response.data;
          switch (code) {
            case 'ME103':
              return { isAvailable: true, message: '사용 가능한 휴대폰 번호입니다.' };
            case 'ME004':
              return { isAvailable: false, message: '이미 등록된 휴대폰 번호입니다.' };
            default:
              return { isAvailable: false, message: '휴대폰 번호 확인 중 오류가 발생했습니다.' };
          }
        } catch (error) {
          console.error('Phone check failed:', error);
          return { isAvailable: false, message: '휴대폰 번호 확인 중 오류가 발생했습니다.' };
        }
      },

      sendPhoneVerification: async (phone: string, purpose: string, loginId?: string) => {
        try {
          const requestBody: { phone: string; purpose: string; loginId?: string } = {
            phone,
            purpose,
          };
          if (purpose === 'findPassword' && loginId) {
            requestBody.loginId = loginId;
          }

          const response = await axiosInstance.post('/api/auths/phone/send', requestBody);
          const { code, message } = response.data;
          switch (code) {
            case 'AU101':
              return { isSuccess: true, message: '인증번호가 전송되었습니다.' };
            case 'CN000':
              return { isSuccess: false, message: '인증번호 전송에 실패했습니다.' };
            case 'ME007':
              return { isSuccess: false, message: '전화번호를 다시 확인해주세요.' };
            case 'ME008':
              return { isSuccess: false, message: '중복 확인을 먼저 진행해주세요.' };
            default:
              return { isSuccess: false, message: '인증번호 전송 중 오류가 발생했습니다.' };
          }
        } catch (error) {
          console.error('Phone verification send failed:', error);
          return { isSuccess: false, message: '인증번호 전송 중 오류가 발생했습니다.' };
        }
      },

      verifyPhoneCode: async (authCode: string, phone: string) => {
        try {
          const response = await axiosInstance.post('/api/auths/phone/verify', { authCode, phone });
          const { code, message } = response.data;
          switch (code) {
            case 'AU102':
              return { isSuccess: true, message: '인증이 완료되었습니다.' };
            case 'AU002':
              return { isSuccess: false, message: '인증번호가 올바르지 않습니다.' };
            default:
              return { isSuccess: false, message: '인증 확인 중 오류가 발생했습니다.' };
          }
        } catch (error) {
          console.error('Phone code verification failed:', error);
          return { isSuccess: false, message: '인증 확인 중 오류가 발생했습니다.' };
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
