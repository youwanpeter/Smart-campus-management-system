import React from "react";
import { Calendar as AntCalendar } from "antd";

const Calendar = () => {
  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Calendar</h1>
      <AntCalendar onPanelChange={onPanelChange} />;
    </div>
  );
};

export default Calendar;
