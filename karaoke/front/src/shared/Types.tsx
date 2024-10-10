// 텍스트 크기별 파일에 사용
export type TextProps = {
  text: string;
};

// 결제 페이지 카테고리 데이터에 사용
export type PayingInfo = {
  amount: number;
  moneyText: string;
};

//버튼
export type ButtonProps = {
  text: string;
  handleClick: () => void;
  color: string;
};

// 예약
export type SongItem = {
  number: number;
  title: string;
  singer: string;
  nickname?: string;
  teamId?: number | null;
  mode?: string;
};

export type Reservation = SongItem[];

// 추천
export interface UserData {
  nickname: string | null;
  loginId: string | null;
  teamName: string | null;
  teamId: number | null;
  mode: 'INDIVIDUAL' | 'TEAM';
}

// 차트
export type ChartTemplateProps = {
  chartName: string;
  closeChart: () => void;
  isLoading?: boolean;
  data: Reservation | UserData[] | [];
  type?: string;
  mode?: string;
};
