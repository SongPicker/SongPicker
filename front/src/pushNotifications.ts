import { getToken } from 'firebase/messaging';
import { messaging } from './firebaseConfig';

export const requestNotificationPermission = async () => {
  try {
    await Notification.requestPermission();
    const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
    console.log('FCM 토큰:', token);
    // 토큰을 서버로 전송하여 저장
  } catch (error) {
    console.error('알림 권한 요청 실패:', error);
  }
};
