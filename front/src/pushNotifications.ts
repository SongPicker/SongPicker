import { getToken } from 'firebase/messaging';
import { messaging } from './firebaseConfig';

export const requestNotificationPermission = async () => {
  try {
    await Notification.requestPermission();
    const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
    console.log('FCM 토큰:', token);
    // 토큰을 서버로 전송하여 저장
    await sendTokenToServer(token);
  } catch (error) {
    console.error('알림 권한 요청 실패:', error);
  }
};

const sendTokenToServer = async (token: string) => {
  try {
    const response = await fetch('/api/notifications/fcm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      throw new Error('토큰 전송 실패');
    }
    console.log('토큰이 서버로 전송되었습니다.');
  } catch (error) {
    console.error('토큰 전송 중 오류 발생:', error);
  }
};
