import React from 'react';
import MainLayout from '../layouts/MainLayout';
import useAuthStore from '../stores/useAuthStore'; // useAuthStore 가져오기

const ProfilePage = () => {
  const { logout } = useAuthStore(); // useAuthStore에서 logout 함수 가져오기

  const handleLogout = async () => {
    try {
      await logout(); // 로그아웃 실행
      console.log('로그아웃 완료');
      // 추가적인 후처리 필요 시 여기에 작성 (예: 리다이렉트)
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <MainLayout title="마이페이지">
      <button className="btn" onClick={handleLogout}>
        임시로그아웃버튼
      </button>
    </MainLayout>
  );
};

export default ProfilePage;
