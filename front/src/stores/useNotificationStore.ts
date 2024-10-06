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
  hasUnreadNotifications: boolean;
  setNotifications: (notifications: Notification[]) => void;
  setCurrentNotificationId: (id: number | null) => void;
  markAsRead: (id: number) => void;
  deleteNotification: (id: number) => Promise<void>;
  updateUnreadStatus: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  currentNotificationId: null,
  hasUnreadNotifications: false,
  setNotifications: notifications => {
    set({ notifications });
    get().updateUnreadStatus();
  },
  setCurrentNotificationId: id => set({ currentNotificationId: id }),
  markAsRead: id => {
    set(state => ({
      notifications: state.notifications.map(notification =>
        notification.notificationId === id ? { ...notification, isRead: true } : notification
      ),
    }));
    get().updateUnreadStatus();
  },
  deleteNotification: async id => {
    try {
      const response = await alarmService.deleteNotification(id);
      if (response.code === 'NO102') {
        set(state => ({
          notifications: state.notifications.filter(
            notification => notification.notificationId !== id
          ),
        }));
        get().updateUnreadStatus();
      } else {
        throw new Error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  },
  updateUnreadStatus: () => {
    const hasUnread = get().notifications.some(notification => !notification.isRead);
    set({ hasUnreadNotifications: hasUnread });
  },
}));
