import Text48 from '../atoms/Text48';
import Text60 from '../atoms/Text60';
import { PayingInfo } from '../shared/Types';

type AlertModalProps = {
  alertMessage: string;
  closeAskPayModal: () => void;
};

const AlertModal = (props: AlertModalProps) => {
  return (
    <div className="modal modal-open font-bold">
      {/* 모달 내용 */}
      <div className="flex w-[1000px] h-96 rounded-[10px] bg-white justify-center items-center">
        <div className="flex flex-col items-center gap-8">
          {/* 안내용 제목 */}
          <Text60 text={props.alertMessage} />

          {/* 결제 여부 버튼 */}
          <div className="flex mt-4">
            <div
              className="btn w-56 h-20 text-white bg-purple"
              onClick={() => {
                props.closeAskPayModal();
              }}
            >
              <Text48 text="확인" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
