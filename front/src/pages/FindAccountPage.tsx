import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import FindId from '../components/template/findAccount/FindId';
import FindPassword from '../components/template/findAccount/FindPassword';
import ShowId from '../components/template/ShowId';
import SubTopNavbar from '../components/molecules/commons/SubTopNavbar';
import FooterButton from '../components/atoms/commons/FooterButton';
import CustomModal from '../components/organisms/commons/CustomModal';
import axiosInstance from '../services/axiosInstance';

interface FindIdResponse {
  code: string;
  message: string;
  data: string;
}

interface PasswordResetData {
  loginId: string;
  phone: string;
  newPassword: string;
  newPasswordConfirm: string;
}

const FindAccountPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState('아이디 찾기');
  const [isButtonValid, setIsButtonValid] = useState(false);
  const [showIdResult, setShowIdResult] = useState(false);
  const [foundId, setFoundId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalLeftButtonText, setModalLeftButtonText] = useState('');
  const [modalRightButtonText, setModalRightButtonText] = useState('확인');
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordResetData, setPasswordResetData] = useState<PasswordResetData>({
    loginId: '',
    phone: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [isPasswordResetComplete, setIsPasswordResetComplete] = useState(false);

  const showMessage = useCallback((message: string, isConfirm: boolean = false) => {
    setModalMessage(message);
    setModalLeftButtonText(isConfirm ? '예' : '');
    setModalRightButtonText(isConfirm ? '아니오' : '확인');
    setIsModalOpen(true);
  }, []);

  const resetState = useCallback(() => {
    setShowIdResult(false);
    setFoundId('');
    setIsButtonValid(false);
    setCurrentStep(1);
    setPasswordResetData({
      loginId: '',
      phone: '',
      newPassword: '',
      newPasswordConfirm: '',
    });
  }, []);

  const handleError = useCallback(
    (message: string) => {
      if (location.pathname.includes('/password')) {
        showMessage('입력한 정보를 다시 확인해주세요.');
      } else {
        // 아이디 찾기의 경우 기존 로직 유지
        showMessage('존재하지 않는 회원입니다. 회원가입하러 가시겠습니까?', true);
      }
    },
    [showMessage, location.pathname]
  );

  const handleNavLinkClick = useCallback(() => {
    resetState();
  }, [resetState]);

  useEffect(() => {
    if (showIdResult) {
      setButtonText('로그인하러가기');
      setIsButtonValid(true);
    } else if (location.pathname.includes('/password')) {
      setButtonText(currentStep === 1 ? '다음' : '완료');
    } else {
      setButtonText('아이디 찾기');
    }
  }, [location.pathname, showIdResult, currentStep]);

  const getTitle = useCallback(() => {
    return location.pathname.includes('/password') ? '비밀번호 찾기' : '아이디 찾기';
  }, [location.pathname]);

  const findIdByPhone = useCallback(
    async (phoneNumber: string) => {
      try {
        const response = await axiosInstance.get<FindIdResponse>(
          `/api/members/find-id?phone=${phoneNumber}`
        );
        if (response.data.code === 'ME104') {
          setFoundId(response.data.data);
          setShowIdResult(true);
          return true;
        } else if (response.data.code === 'ME009') {
          showMessage('존재하지 않는 회원입니다. 회원가입하러 가시겠습니까?', true);
          return false;
        } else {
          showMessage('아이디 찾기에 실패했습니다: ' + response.data.message);
          return false;
        }
      } catch (error) {
        showMessage('아이디 찾기 중 오류가 발생했습니다.');
        return false;
      }
    },
    [showMessage]
  );

  const resetPassword = useCallback(async () => {
    try {
      const response = await axiosInstance.patch('/api/members/find-password', {
        newPassword: passwordResetData.newPassword,
        checkPassword: passwordResetData.newPasswordConfirm,
        phone: passwordResetData.phone,
        loginId: passwordResetData.loginId,
      });
      if (response.data.code === 'ME105') {
        setIsPasswordResetComplete(true);
        showMessage('비밀번호가 성공적으로 변경되었습니다.');
      } else {
        showMessage('입력한 정보를 다시 확인해주세요.');
      }
    } catch (error) {
      showMessage('비밀번호 변경 중 오류가 발생했습니다.');
    }
  }, [passwordResetData, showMessage]);

  const handleButtonClick = useCallback(async () => {
    if (showIdResult) {
      navigate('/login');
    } else if (location.pathname.includes('/id') && isButtonValid) {
      await findIdByPhone(passwordResetData.phone);
    } else if (location.pathname.includes('/password')) {
      if (currentStep === 1 && isButtonValid) {
        setCurrentStep(2);
        setIsButtonValid(false); // 새 비밀번호 입력 전에 버튼을 비활성화
      } else if (currentStep === 2 && isButtonValid) {
        await resetPassword();
      }
    }
  }, [
    showIdResult,
    location.pathname,
    isButtonValid,
    currentStep,
    passwordResetData,
    navigate,
    findIdByPhone,
    resetPassword,
  ]);

  const handleVerificationComplete = useCallback((isComplete: boolean, verifiedPhone: string) => {
    setIsButtonValid(isComplete);
    setPasswordResetData(prev => ({ ...prev, phone: verifiedPhone }));
  }, []);

  const handlePasswordStepComplete = useCallback(
    (step: number, isValid: boolean, data: Partial<PasswordResetData>) => {
      setIsButtonValid(isValid);
      setPasswordResetData(prev => ({ ...prev, ...data }));
    },
    []
  );

  const handleModalLeftClick = useCallback(() => {
    setIsModalOpen(false);
    if (modalLeftButtonText === '예') {
      navigate('/signup');
    }
  }, [navigate, modalLeftButtonText]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    if (isPasswordResetComplete) {
      navigate('/login');
    }
  }, [isPasswordResetComplete, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <SubTopNavbar title={getTitle()} />

      <div className="flex-1 mt-4">
        <div className="flex h-14">
          <NavLink
            to="/find-account/id"
            className={({ isActive }) =>
              `flex-1 h-full flex items-center justify-center text-center border-b-2 ${
                isActive ? 'text-purple-600 border-purple-600' : 'text-gray-500 border-gray-500'
              }`
            }
            onClick={handleNavLinkClick}
          >
            아이디 찾기
          </NavLink>
          <NavLink
            to="/find-account/password"
            className={({ isActive }) =>
              `flex-1 h-full flex items-center justify-center text-center border-b-2 ${
                isActive ? 'text-purple-600 border-purple-600' : 'text-gray-500 border-gray-500'
              }`
            }
            onClick={handleNavLinkClick}
          >
            비밀번호 찾기
          </NavLink>
        </div>

        <div className="p-4">
          {showIdResult ? (
            <ShowId foundId={foundId} />
          ) : (
            <Routes>
              <Route index element={<Navigate to="/find-account/id" replace />} />
              <Route
                path="id"
                element={<FindId onVerificationComplete={handleVerificationComplete} />}
              />
              <Route
                path="/password/*"
                element={
                  <FindPassword
                    onStepComplete={handlePasswordStepComplete}
                    currentStep={currentStep}
                    onError={handleError}
                  />
                }
              />
            </Routes>
          )}
        </div>
      </div>
      <FooterButton onClick={handleButtonClick} isValid={isButtonValid}>
        {buttonText}
      </FooterButton>

      <CustomModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        message={modalMessage}
        leftButtonText={modalLeftButtonText}
        rightButtonText={isPasswordResetComplete ? '확인' : modalRightButtonText}
        onLeftClick={handleModalLeftClick}
      />
    </div>
  );
};

export default FindAccountPage;
