import React, { useEffect, useState } from "react";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { connectDatePickerToStore } from "../../store/ConnectHolder";
import { dnow } from "../../utils";

const { RangePicker } = DatePicker;

const DatePickerr = (props) => {
  const [dateRange, changeDateRange] = useState(null);

  const calendarChange = ([start, end]) => {
    if (start || end) {
      changeDateRange([
        start > 0 ? start : props.minDate,
        end > 0 ? end : props.maxDate,
      ]);
    } else {
      changeDateRange(null);
    }
    if (!start && !end) {
      return changeDateRange(null);
    }
    start > 0 && props.setStartDate(dnow(start));
    end > 0 && props.setEndDate(dnow(end));
  };

  const onChange = ([start, end]) => !start && !end && changeDateRange(null);

  return (
    <div className={"datepicker"}>
      <span style={{ marginRight: "10px" }}>Выбрать отчетный период: </span>
      <RangePicker
        allowEmpty={[true, true]}
        onCalendarChange={calendarChange}
        ranges={{
          Вчера: [moment().subtract(1, "days"), moment().subtract(1, "days")],
          Сегодня: [moment(), moment()],
          "Эта неделя": [moment().startOf("week"), moment().endOf("week")],
          "Этот месяц": [moment().startOf("month"), moment().endOf("month")],
        }}
        onChange={onChange}
        value={dateRange}
        format={"DD.MM.YYYY"}
        showTime={false}
      />
    </div>
  );
};

export default connectDatePickerToStore(DatePickerr);
