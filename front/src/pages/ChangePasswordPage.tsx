import React, { useCallback, useState } from 'react';
import BasicInfoPasswordConfirmForm from '../components/molecules/signup/BasicInfoPasswordConfirmSignupForm';
import BasicInfoPasswordForm from '../components/molecules/signup/BasicInfoPasswordSignupForm';
import FooterButtonLayout from '../layouts/FooterButtonLayout';
import CurrentPasswordForm from '../components/molecules/profile/CurrentPasswordForm';
import { changePassword } from '../services/profileChangeService';
import CustomModal from '../components/organisms/commons/CustomModal';
import { useNavigate } from 'react-router-dom';
import { set } from 'lodash';

const ChangePasswordPage = () => {
  const navigate = useNavigate()
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [existPassword, setExistPassword] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('')
  const [movePage, setMovePage] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [validations, setValidations] = useState({
    newPassword: false,
    newPasswordConfirm: false,
  });

  const handleCurrentPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExistPassword(e.target.value);
  }, []);

  const handleNewPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleNewPasswordValidation = useCallback((isValid: boolean) => {
    setValidations(prev => ({ ...prev, newPassword: isValid }));
    setShowPasswordConfirm(isValid);
  }, []);

  const handleNewPasswordConfirmValidation = useCallback((isValid: boolean) => {
    setValidations(prev => ({ ...prev, newPasswordConfirm: isValid }));
  }, []);

  const savePasswordChange = async () => {
    try {
      const code = await changePassword(
        existPassword,
        formData.newPassword,
        formData.newPasswordConfirm
      );
      if (code === 'AU003') {
        setModalMessage('현재 비밀번호가 일치하지 않습니다')
        setOpenModal(true)
        console.log('모달', existPassword, formData.newPassword, formData.newPasswordConfirm)
      } else if (code === 'ME105') {
        setModalMessage('비밀번호가 수정되었습니다')
        setOpenModal(true)
        setMovePage(true)
      } else if (code === 'ME006') {
        setModalMessage('비밀번호 수정에 실패했습니다')
        setOpenModal(true)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false)
    movePage && navigate('/members/:id/change/')
  }

  return (
    <FooterButtonLayout
      title="비밀번호 수정"
      buttonText="저장"
      isButtonValid={validations.newPassword && validations.newPasswordConfirm}
      onButtonClick={() => {
        savePasswordChange();
      }}
    >
      <div className="mt-12 px-4 space-y-12 min-w-72 w-full">
        {/* 현재 비밀번호 */}
        <CurrentPasswordForm password={existPassword} onChange={handleCurrentPasswordChange} />

        {/* 새 비밀번호 */}
        <BasicInfoPasswordForm
          password={formData.newPassword}
          onChange={handleNewPasswordChange}
          onValidation={handleNewPasswordValidation}
          label="새 비밀번호"
          placeholder="새로운 비밀번호를 입력해주세요"
          name="newPassword"
        />

        {/* 새 비밀번호 확인 */}
        {showPasswordConfirm && (
          <BasicInfoPasswordConfirmForm
            password={formData.newPassword}
            passwordConfirm={formData.newPasswordConfirm}
            onChange={handleNewPasswordChange}
            onValidation={handleNewPasswordConfirmValidation}
            label="새 비밀번호 확인"
            placeholder="새로운 비밀번호를 다시 입력해주세요"
            name="newPasswordConfirm"
          />
        )}

        {/* 비밀번호 모달창 */}
        <CustomModal isOpen={openModal} rightButtonText='확인' onClose={handleCloseModal} message={modalMessage}/>
      </div>
    </FooterButtonLayout>
  );
};

export default ChangePasswordPage;
