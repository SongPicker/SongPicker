import React, { ReactNode, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import ThemePage from './pages/ThemePage';
import MainPage from './pages/MainPage';
import GroupPage from './pages/GroupPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MemberSelectPage from './pages/LinkPages/MemberSelectPage';
import GroupSelectPage from './pages/LinkPages/GroupSelectPage';
import QrScanPage from './pages/LinkPages/QrScanPage';
import FindAccountPage from './pages/FindAccountPage';
import SongSelectPage from './pages/SongsSelectPage';
import useAuthStore from './stores/useAuthStore';
import './App.css';
import { onMessage } from 'firebase/messaging';
import { messaging } from './firebaseConfig';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isSongSelected = useAuthStore(state => state.isSongSelected);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && !isSongSelected && window.location.pathname !== '/song-select') {
    return <Navigate to="/song-select" replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isSongSelected = useAuthStore(state => state.isSongSelected);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, payload => {
      console.log('Received foreground message ', payload);
      // 포그라운드에서는 알림을 표시하지 않고 다른 처리만 수행
      // 예: 상태 업데이트, 소리 재생 등
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen w-screen max-w-[640px] mx-auto relative bg-black">
        <Routes>
          {/* 공개 라우트 */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup/*"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/find-account/*"
            element={
              <PublicRoute>
                <FindAccountPage />
              </PublicRoute>
            }
          />

          {/* 곡 선택 페이지 */}
          <Route
            path="/song-select"
            element={
              isAuthenticated && !isSongSelected ? <SongSelectPage /> : <Navigate to="/" replace />
            }
          />

          {/* 인증이 필요한 라우트 */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/theme"
            element={
              <PrivateRoute>
                <ThemePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/group/*"
            element={
              <PrivateRoute>
                <GroupPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/members/:id"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/member-select"
            element={
              <PrivateRoute>
                <MemberSelectPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/group-select"
            element={
              <PrivateRoute>
                <GroupSelectPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/qr-scan"
            element={
              <PrivateRoute>
                <QrScanPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
