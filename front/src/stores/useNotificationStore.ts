import { create } from 'zustand';
import { alarmService } from '../services/alarmService';

interface Notification {
  notificationId: number;
  isRead: boolean;
  content: string;
}

interface NotificationStore {
  notifications: Notification[];
  currentNotificationId: number | null;
  setNotifications: (notifications: Notification[]) => void;
  setCurrentNotificationId: (id: number | null) => void;
  markAsRead: (id: number) => void;
  deleteNotification: (id: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  currentNotificationId: null,
  setNotifications: notifications => set({ notifications }),
  setCurrentNotificationId: id => set({ currentNotificationId: id }),
  markAsRead: id =>
    set(state => ({
      notifications: state.notifications.map(notification =>
        notification.notificationId === id ? { ...notification, isRead: true } : notification
      ),
    })),
  deleteNotification: async id => {
    try {
      const response = await alarmService.deleteNotification(id);
      if (response.code === 'NO102') {
        // 성공 코드를 적절히 수정하세요
        set(state => ({
          notifications: state.notifications.filter(
            notification => notification.notificationId !== id
          ),
        }));
      } else {
        throw new Error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  },
}));
