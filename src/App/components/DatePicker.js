import React, { useEffect, useState } from "react";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { connectDatePickerToStore } from "../store/ConnectHolder";
import { dnow } from "../utils";

const { RangePicker } = DatePicker;

const DatePickerr = (props) => {
  const [dateRange, changeDateRange] = useState(null);
  const disableDate = (current) => {
    const minDate =
      props.minDate > 0 ? moment(props.minDate) : moment().startOf("day");
    const maxDate =
      props.maxDate > 0 ? moment(props.maxDate) : moment().endOf("month");
    return !(minDate.isSameOrBefore(current) && maxDate.isAfter(current));
  };

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
    <div>
      <RangePicker
        allowEmpty={[true, true]}
        onCalendarChange={calendarChange}
        onChange={onChange}
        value={dateRange}
        format={"DD.MM.YYYY"}
        showTime={false}
        // disabledDate={disableDate}
      />
    </div>
  );
};

const styles = {
  pickerContainer: {
    flexDirection: "row",
    backgroundColor: "rgb(255,255,255)",
  },
  div: {
    color: "rgb(34,150,243)",
    backgroundColor: "rgb(255,255,255)",
    fontWeight: "bold",
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#cc001f",
  },
  container: {
    // borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerButton: {
    // backgroundColor: 'rgb(255,255,255)',
    padding: 10,
    // borderWidth: 1,
    margin: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.21)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
};

export default connectDatePickerToStore(DatePickerr);
