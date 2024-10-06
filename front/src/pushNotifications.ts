import { getToken } from 'firebase/messaging';
import { messaging } from './firebaseConfig';
import axiosInstance from './services/axiosInstance';

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('알림 권한이 거부되었습니다.');
      return;
    }

    const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
    console.log('FCM 토큰:', token);
    await sendTokenToServer(token);
  } catch (error) {
    console.error('알림 권한 요청 실패:', error);
  }
};

const sendTokenToServer = async (token: string) => {
  try {
    const response = await axiosInstance.post('/api/notifications/fcm', { token });
    if (response.data.code !== 'NO106') {
      console.log('토큰이 서버로 전송되었습니다.');
    } else {
      throw new Error('토큰 전송 실패');
    }
  } catch (error) {
    console.error('토큰 전송 중 오류 발생:', error);
  }
};
