import Qrcode from '../atoms/Qrcode';
// import Text72 from '../atoms/Text72';

const GuideQrcode = () => {
  return (
    <div className="flex flex-col gap-y-7">

      {/* 안내문구 */}
      <div className="flex flex-col rounded-[10px] bg-white/60 justify-center text-center gap-y-8 py-14 px-16">
        <div>
          <p className="font-pyeongchang font-bold text-5xl text-blue mb-3">SongPicker <span className='text-4xl text-white'>가</span></p>
          <p className="font-pyeongchang font-bold text-4xl text-white leading-[50px] whitespace-pre-line">{`부르실 노래를 추천해드려요!`}</p>
        </div>


        {/* QR 코드 */}
        <div className="flex w-full justify-center">
          <Qrcode />
        </div>
      </div>
    </div>
  );
};

export default GuideQrcode;
