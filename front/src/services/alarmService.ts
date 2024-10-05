import axiosInstance from './axiosInstance';

export const alarmService = {
  // 알림 목록 조회
  getNotifications: async () => {
    try {
      const response = await axiosInstance.get('/api/notifications');
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  // 알림 읽음 처리
  readNotification: async (notificationId: number) => {
    try {
      const response = await axiosInstance.put('/api/notifications/read', { notificationId });
      return response.data;
    } catch (error) {
      console.error('Read notification API error:', error);
      throw error;
    }
  },

  // 알림 삭제
  deleteNotification: async (notificationId: number) => {
    try {
      const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  },

  // 읽지않은 알람 확인
  checkUnreadNotifications: async () => {
    try {
      const response = await axiosInstance.get('/api/notifications/read');
      return response.data;
    } catch (error) {
      console.error('Check unread notifications error:', error);
      throw error;
    }
  },

  // 알람 상세 조회
  getNotificationDetail: async (notificationId: number, type: string) => {
    try {
      const response = await axiosInstance.get(`/api/notifications/${notificationId}?type=${type}`);
      return response.data;
    } catch (error) {
      console.error('Get notification detail error:', error);
      throw error;
    }
  },

  // 그룹 초대 응답
  respondToGroupInvite: async (notificationId: number, accept: boolean) => {
    try {
      const response = await axiosInstance.post('/api/notifications/response', {
        notificationId,
        accept,
      });
      return response.data;
    } catch (error) {
      console.error('Group invite response error:', error);
      throw error;
    }
  },
};
