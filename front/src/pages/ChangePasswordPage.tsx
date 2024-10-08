import React, { useCallback, useState } from 'react';
import BasicInfoPasswordConfirmForm from '../components/molecules/signup/BasicInfoPasswordConfirmSignupForm';
import BasicInfoPasswordForm from '../components/molecules/signup/BasicInfoPasswordSignupForm';
import FooterButtonLayout from '../layouts/FooterButtonLayout';
import CurrentPasswordForm from '../components/molecules/profile/CurrentPasswordForm';

const ChangePasswordPage = () => {
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [formData, setFormData] = useState({
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [validations, setValidations] = useState({
    newPassword: false,
    newPasswordConfirm: false,
  });

  const handleCurrentPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
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

  return (
    <FooterButtonLayout
      title="비밀번호 수정"
      buttonText="저장"
      isButtonValid={validations.newPassword && validations.newPasswordConfirm}
      onButtonClick={() => {}}
    >
      <div className="mt-12 px-4 space-y-12 min-w-72 w-full">
        {/* 현재 비밀번호 */}
        <CurrentPasswordForm password={currentPassword} onChange={handleCurrentPasswordChange} />

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
            name="newPassWordConfirm"
          />
        )}
      </div>
    </FooterButtonLayout>
  );
};

export default ChangePasswordPage;
