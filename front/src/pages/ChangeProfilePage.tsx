import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SimpleLayout from '../layouts/SimpleLayout';
import songPickerLogo from '../assets/songPickerLogo.svg';
import UserInfoNicknameSignupForm from '../components/molecules/signup/UserInfoNicknameSignupForm';
import {
  changeNickname,
  changePhoneNumber,
  changeProfileImage,
} from '../services/profileChangeService';
import { getUserProfile } from '../services/profileService';
import UserInfoPhoneSignupForm from '../components/molecules/signup/UserInfoPhoneSignupForm';
import UserInfoAuthCodeSignupForm from '../components/molecules/signup/UserInfoAuthCodeSignupForm';

const ChangeProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(location.state || {});
  const [nickname, setNickname] = useState(userProfile.nickname || '');
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [resetAuthCode, setResetAuthCode] = useState(false);
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [profileImage, setProfileImage] = useState(userProfile.profileImage || songPickerLogo);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const getKoreanGender = (gender: string): string => {
    if (gender === 'FEMALE') return '여';
    if (gender === 'MALE') return '남';
    return '기타';
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        setNickname(profile.nickname || '');
        setPhone(profile.phone || '');
        setProfileImage(profile.profileImage || songPickerLogo);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
    setProfileImage(songPickerLogo);
  };

  const changeProfile = async () => {
    if (isNicknameValid) {
      try {
        await changeNickname(nickname);
        console.log('닉네임 변경 성공');
        // 성공 메시지 표시 또는 다른 작업 수행
      } catch (error) {
        console.error('닉네임 변경 실패:', error);
        // 오류 메시지 표시
      }
    }
  };

  const handlePhoneVerification = () => {
    setShowAuthCode(true);
  };

  const handleAuthCodeVerification = async () => {
    setIsPhoneVerified(true);
    console.log('바뀐 번호', phone);
    try {
      await changePhoneNumber(phone);
      console.log('전화번호 변경 성공');
      // 성공 메시지 표시 또는 다른 작업 수행
    } catch (error) {
      console.error('전화번호 변경 실패:', error);
      // 오류 메시지 표시
    }
  };

  const handleResetAuthCode = () => {
    setShowAuthCode(false);
    setResetAuthCode(prev => !prev);
    setIsPhoneVerified(false);
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImageLoading(true);
      try {
        const response = await changeProfileImage(file);
        console.log('프로필 이미지 변경 성공:', response);
        const updatedProfile = await getUserProfile();
        setUserProfile(updatedProfile);
        setProfileImage(updatedProfile.profileImage);
      } catch (error) {
        console.error('프로필 이미지 변경 실패:', error);
        handleImageError();
      }
    }
  };

  return (
    <SimpleLayout title="프로필 수정">
      <div className="flex flex-col h-[calc(100vh-56px)] w-full max-w-[412px] mx-auto px-4 py-6 justify-between">
        <div className="flex flex-col items-center space-y-8">
          {/* 프로필 사진 수정 */}
          <div className="flex flex-col items-center gap-5">
            <div className="flex mask mask-circle w-20 h-20 bg-white">
              {isImageLoading && (
                <div className="w-full h-full flex items-center justify-center">Loading...</div>
              )}
              <img
                src={profileImage}
                className={`w-full h-full object-cover ${isImageLoading ? 'hidden' : ''}`}
                alt="프로필 이미지"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfileImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              className="btn w-fit bg-primary border-none text-base"
              onClick={() => fileInputRef.current?.click()}
            >
              프로필 사진 수정
            </button>
          </div>

          {/* 바꿀 수 없는 정보 */}
          <div className="flex flex-col items-center w-2/3">
            <div className="flex w-full justify-between">
              <span className="font-semibold">아이디</span>
              <span className="text-gray-400">{userProfile.loginId}</span>
            </div>
            <div className="flex w-full justify-between">
              <span className="font-semibold">이름</span>
              <span className="text-gray-400">{userProfile.name}</span>
            </div>
            <div className="flex w-full justify-between">
              <span className="font-semibold">성별</span>
              <span className="text-gray-400">{getKoreanGender(userProfile.gender)}</span>
            </div>
          </div>

          {/* 닉네임 수정 */}
          <div className="w-full">
            <UserInfoNicknameSignupForm
              initialNickname={nickname}
              isEditMode={true}
              onChange={setNickname}
              onValidation={setIsNicknameValid}
              onSave={changeProfile}
            />
          </div>

          {/* 휴대폰 번호 수정 */}
          <div className="w-full">
            <UserInfoPhoneSignupForm
              initialPhone={phone}
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
          </div>
        </div>

        {/* 비밀번호 재설정 */}
        <div className="w-full mt-auto">
          <button
            className="flex font-bold text-primary text-lg w-full justify-center"
            onClick={() => {
              navigate('/members/:id/change/verify-password');
            }}
          >
            비밀번호 재설정
          </button>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default ChangeProfilePage;
