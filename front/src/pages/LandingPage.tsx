import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import SongPickerGuitar from '@/assets/songPickerGuitar.svg?react';

// 이미지 임포트
import recommendImg from '@/assets/landing/recommendImg.jpg';
import groupImg from '@/assets/landing/groupImg.jpg';
import mypageImg from '@/assets/landing/mypageImg.jpg';
import qrImg from '@/assets/landing/qrImg.jpg';

const LandingPage: React.FC = () => {
  const slides = [
    {
      image: recommendImg,
      title: '당신의 취향이 담긴 선곡 추천!',
      description: ['평소 즐겨 부르는 노래를 기반으로', '맞춤 추천을 받아보세요.'],
    },
    {
      image: groupImg,
      title: '함께 부르는 즐거움!',
      description: ['친구들과 함께 즐길 수 있는', '완벽한 노래방 추천 리스트를 만들어드려요.'],
    },
    {
      image: mypageImg,
      title: '나만의 취향 분석!',
      description: '당신의 노래 취향을 한눈에 확인하고 분석해보세요.',
    },
    {
      image: qrImg,
      title: 'QR을 통해 노래방과의 연동!',
      description: 'QR 인식 한 번으로 노래방과 빠르게 연동하세요.',
    },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-[#381960] via-[#6c72e6] to-[#575ED2] flex flex-col justify-center items-center">
      <Swiper
        modules={[Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet bg-white opacity-50 w-2 h-2 mx-1',
          bulletActiveClass: 'swiper-pagination-bullet-active bg-white opacity-100',
        }}
        className="w-full h-full max-w-md"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="flex flex-col items-center justify-center text-white p-4 h-full relative"
          >
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="relative w-2/3 mb-8">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full object-contain rounded-3xl"
                />
                <SongPickerGuitar className="w-36 h-36 absolute -bottom-5 -right-16" />
              </div>
              <h2 className="text-2xl font-bold mb-4">{slide.title}</h2>
              <p className="text-base text-center max-w-xs mb-8">
                {Array.isArray(slide.description)
                  ? slide.description.map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < slide.description.length - 1 && <br />}
                      </React.Fragment>
                    ))
                  : slide.description}
              </p>
            </div>
            {index === slides.length - 1 && (
              <Link
                to="/login"
                className="btn btn-primary btn-wide mb-7 text-white text-lg font-bold hover:bg-opacity-90 transition-all duration-300 ease-in-out absolute bottom-8 left-1/2 transform -translate-x-1/2"
              >
                로그인하러가기
              </Link>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LandingPage;
