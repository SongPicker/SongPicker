import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MyCalendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type MyCalendarProps = {
  singingDayData: Date[];
  handleSelectedDate: (value: Date) => void;
  currentYear: number;
};

const MyCalendar = (props: MyCalendarProps) => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <Calendar
      className="bg-white text-black w-11/12 rounded-xl shadow-lg"
      value={value}
      onChange={onChange}
      calendarType="gregory"
      locale="ko"
      minDetail="month"
      minDate={new Date(`${props.currentYear}-01-01`)}
      maxDate={new Date(`${props.currentYear}-12-31`)}
      showNeighboringMonth={false}
      formatDay={(locale, date) => date.getDate().toString()}
      tileClassName={({ date, view }) => {
        const baseClass = 'relative';
        const isSunday = date.getDay() === 0 ? 'text-red-500' : '';
        return `${baseClass} ${isSunday}`;
      }}
      tileContent={({ date }) => {
        return props.singingDayData.map(item => {
          return new Date(item).toDateString() === date.toDateString() ? (
            <div
              key={`singing-${date}`}
              className="absolute inset-0 flex justify-center items-center"
            >
              <div className="w-8 h-8 bg-primary/60 rounded-full"></div>
            </div>
          ) : null;
        });
      }}
      onClickDay={(value, event) => {
        console.log('clicked');
        props.handleSelectedDate(value);
      }}
    />
  );
};

export default MyCalendar;
