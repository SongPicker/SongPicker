import { useLocation } from 'react-router-dom';
import SimpleLayout from '../layouts/SimpleLayout';
import songPickerLogo from '../assets/songPickerLogo.svg';
import UserInfoNicknameSignupForm from '../components/molecules/signup/UserInfoNicknameSignupForm';
import { useState } from 'react';
import { changeNickname } from '../services/profileChangeService';

const ChangeProfilePage = () => {
  const location = useLocation();
  const userProfile = location.state || {};
  const [nickname, setNickname] = useState<string>(userProfile.nickname);
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  // 닉네임 수정
  const changeProfile = () => {
    if (isNicknameValid) {
      changeNickname(nickname);
    }
  };

  console.log(userProfile.nickname);

  return (
    <SimpleLayout title="프로필 수정">
      <div className="px-4">
        {/* 프로필 사진 수정 */}
        <div className="flex flex-col items-center gap-5">
          <div className="flex mask mask-circle w-20 h-20 bg-white">
            <img src={userProfile.profileImage || songPickerLogo} className="w-full h-full" />
          </div>
          <button className="btn w-fit bg-primary border-none text-base">프로필 사진 수정</button>
        </div>

        {/* 바꿀 수 없는 정보 */}
        <div></div>

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
      </div>
    </SimpleLayout>
  );
};

export default ChangeProfilePage;
