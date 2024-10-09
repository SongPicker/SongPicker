import { useLocation, useNavigate } from 'react-router-dom';
import SimpleLayout from '../layouts/SimpleLayout';
import songPickerLogo from '../assets/songPickerLogo.svg';
import UserInfoNicknameSignupForm from '../components/molecules/signup/UserInfoNicknameSignupForm';
import { useCallback, useState } from 'react';
import { changeNickname, changePhoneNumber } from '../services/profileChangeService';
import UserInfoPhoneSignupForm from '../components/molecules/signup/UserInfoPhoneSignupForm';
import UserInfoAuthCodeSignupForm from '../components/molecules/signup/UserInfoAuthCodeSignupForm';

const ChangeProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userProfile = location.state || {};
  const [nickname, setNickname] = useState<string>(userProfile.nickname);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [resetAuthCode, setResetAuthCode] = useState(false);
  const [phone, setPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // 닉네임 수정
  const changeProfile = () => {
    if (isNicknameValid) {
      changeNickname(nickname);
    }
  };

  // 휴대폰 번호 수정
  const handlePhoneVerification = useCallback(() => {
    setShowAuthCode(true);
  }, []);

  const handleAuthCodeVerification = useCallback(() => {
    setIsPhoneVerified(true);
    console.log('바뀐 번호', phone);
    changePhoneNumber(phone);
  }, [phone]);

  const handleResetAuthCode = useCallback(() => {
    setShowAuthCode(false);
    setResetAuthCode(prev => !prev);
    setIsPhoneVerified(false);
  }, []);

  return (
    <SimpleLayout title="프로필 수정">
      <div className="mt-12 px-4 space-y-12 min-w-72 w-full">
        {/* 프로필 사진 수정 */}
        <div className="flex flex-col items-center gap-5">
          <div className="flex mask mask-circle w-20 h-20 bg-white">
            <img src={userProfile.profileImage || songPickerLogo} className="w-full h-full" />
          </div>
          <button className="btn w-fit bg-primary border-none text-base">프로필 사진 수정</button>
        </div>

        {/* 바꿀 수 없는 정보 */}
        <div className="flex flex-col items-center">
          <div className="flex w-1/2 justify-between">
            <span className="font-semibold">아이디</span>
            <span className="text-gray-400">eunji</span>
          </div>
          <div className="flex w-1/2 justify-between">
            <span className="font-semibold">이름</span>
            <span className="text-gray-400">박은지</span>
          </div>
          <div className="flex w-1/2 justify-between">
            <span className="font-semibold">성별</span>
            <span className="text-gray-400">여</span>
          </div>
        </div>

        {/* 닉네임 수정 */}
        <UserInfoNicknameSignupForm
          initialNickname={nickname}
          isEditMode={true}
          onChange={setNickname}
          onValidation={setIsNicknameValid}
          onSave={() => {
            changeProfile();
          }}
        />

        {/* 휴대폰 번호 수정 */}
        <UserInfoPhoneSignupForm
          onVerify={handlePhoneVerification}
          onResetAuthCode={handleResetAuthCode}
          onChange={setPhone}
          onValidation={setIsPhoneValid}
          purpose="CHANGE_PHONE"
          checkAvailability={true}
        />
        {showAuthCode && (
          <UserInfoAuthCodeSignupForm
            onVerify={handleAuthCodeVerification}
            resetAuthCode={resetAuthCode}
            phone={phone}
            purpose="CHANGE_PHONE"
          />
        )}
        {/* 비밀번호 재설정 */}
        <button
          className="flex font-bold text-primary text-lg"
          onClick={() => {
            navigate('/members/:id/change/verify-password');
          }}
        >
          비밀번호 재설정
        </button>
      </div>
    </SimpleLayout>
  );
};

export default ChangeProfilePage;
