import React, { useState, useCallback } from 'react';
import BasicInfoIdForm from '../../molecules/signup/BasicInfoIdSignupForm';
import UserInfoPhoneSignupForm from '../../molecules/signup/UserInfoPhoneSignupForm';
import UserInfoAuthCodeSignupForm from '../../molecules/signup/UserInfoAuthCodeSignupForm';
import BasicInfoPasswordForm from '../../molecules/signup/BasicInfoPasswordSignupForm';
import BasicInfoPasswordConfirmForm from '../../molecules/signup/BasicInfoPasswordConfirmSignupForm';

interface PasswordResetData {
  loginId?: string;
  phone?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
}

type FindPasswordProps = {
  onStepComplete: (step: number, isValid: boolean, data: PasswordResetData) => void;
  currentStep: number;
  onError: (message: string) => void;
};

const FindPassword: React.FC<FindPasswordProps> = ({ onStepComplete, currentStep, onError }) => {
  const [loginId, setLoginId] = useState('');
  const [phone, setPhone] = useState('');
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [resetAuthCode, setResetAuthCode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isIdValid, setIsIdValid] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordConfirmValid, setIsPasswordConfirmValid] = useState(false);

  const handleIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginId(e.target.value);
  }, []);

  const handleIdValidation = useCallback(
    (isValid: boolean) => {
      setIsIdValid(isValid);
      onStepComplete(1, isValid && isPhoneVerified, { loginId, phone });
    },
    [isPhoneVerified, loginId, phone, onStepComplete]
  );

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value);
  }, []);

  const handlePhoneVerify = useCallback(() => {
    setShowAuthCode(true);
    setResetAuthCode(false);
  }, []);

  const handleResetAuthCode = useCallback(() => {
    setResetAuthCode(true);
  }, []);

  const handleAuthCodeVerify = useCallback(() => {
    setIsPhoneVerified(true);
    onStepComplete(1, true, { loginId, phone });
  }, [isIdValid, loginId, phone, onStepComplete]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  }, []);

  const handlePasswordValidation = useCallback(
    (isValid: boolean) => {
      setIsPasswordValid(isValid);
      onStepComplete(2, isValid && isPasswordConfirmValid, { newPassword, newPasswordConfirm });
    },
    [isPasswordConfirmValid, newPassword, newPasswordConfirm, onStepComplete]
  );

  const handlePasswordConfirmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPasswordConfirm(e.target.value);
  }, []);

  const handlePasswordConfirmValidation = useCallback(
    (isValid: boolean) => {
      setIsPasswordConfirmValid(isValid);
      onStepComplete(2, isPasswordValid && isValid, { newPassword, newPasswordConfirm });
    },
    [isPasswordValid, newPassword, newPasswordConfirm, onStepComplete]
  );

  const handlePhoneError = useCallback(
    (message: string) => {
      onError(message);
    },
    [onError]
  );

  return (
    <div className="mt-4">
      <div className="text-xl mb-6 font-semibold">
        {currentStep === 1 ? (
          <>
            비밀번호를 찾기 위해
            <br /> 아이디와 휴대폰 번호를 인증해주세요.
          </>
        ) : (
          <>변경하실 비밀번호를 입력해주세요.</>
        )}
      </div>
      {currentStep === 1 ? (
        <div className="space-y-5">
          <BasicInfoIdForm
            loginId={loginId}
            onChange={handleIdChange}
            onValidation={handleIdValidation}
            checkAvailability={false}
          />
          <UserInfoPhoneSignupForm
            onVerify={handlePhoneVerify}
            onResetAuthCode={handleResetAuthCode}
            onChange={handlePhoneChange}
            onValidation={() => {}}
            showLabel={true}
            purpose="FIND_PASSWORD"
            checkAvailability={false}
            loginId={loginId}
            onError={handlePhoneError}
          />
          {showAuthCode && (
            <UserInfoAuthCodeSignupForm
              onVerify={handleAuthCodeVerify}
              resetAuthCode={resetAuthCode}
              phone={phone}
              purpose="FIND_PASSWORD"
            />
          )}
        </div>
      ) : (
        <div className="space-y-12">
          <BasicInfoPasswordForm
            password={newPassword}
            onChange={handlePasswordChange}
            onValidation={handlePasswordValidation}
          />
          <BasicInfoPasswordConfirmForm
            password={newPassword}
            passwordConfirm={newPasswordConfirm}
            onChange={handlePasswordConfirmChange}
            onValidation={handlePasswordConfirmValidation}
          />
        </div>
      )}
    </div>
  );
};

export default FindPassword;
