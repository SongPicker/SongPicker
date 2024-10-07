import { useNavigate } from 'react-router-dom';
import songPickerLogo from '../../../assets/songPickerLogo.svg';

type ProfileCardProps = {
  userProfile: {
    nickname: string;
    profileImage: string;
  };
  handleLogout: () => void;
};

const ProfileCard = (props: ProfileCardProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex h-24 items-center bg-gradient-to-r from-[#565ed2] to-[#2c306c] px-4 gap-4">
      <div className="mask mask-circle w-14 h-14 bg-white">
        <img src={props.userProfile.profileImage || songPickerLogo} className="w-full h-full" />
      </div>
      <div className="flex flex-col">
        <p className="flex text-lg font-semibold">{props.userProfile.nickname}님</p>
        <div className="flex gap-4">
          <span
            className="text-md font-medium underline"
            onClick={() => {
              navigate('/members/:id/change', { state: props.userProfile });
            }}
          >
            프로필 수정하기
          </span>
          <span className="text-md font-medium">|</span>
          <span
            className="text-md font-medium underline cursor-pointer"
            onClick={() => {
              props.handleLogout();
            }}
          >
            로그아웃
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
