import * as React from "react";
import { Button } from "antd";
import moment from "moment";
import {
  connectDatePickerToStore,
  connectToStore,
} from "../../store/ConnectHolder";
// import AsyncStorage from "@react-native-community/async-storage";
import { getDateString } from "../../utils";
import { INVOICES_KEY } from "../../Constants";
import StatisticsTotalItem from "./StatisticsTotalItem";
import StatisticsInvoiceItem from "./StatisticsInvoiceItem";

class DataFromStorage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      storageKeys: [],
      storageData: [],
      showTotal: false,
      total: 0,
    };
  }

  componentDidUpdate() {
    this.getTotal();
  }

  getDate = (dateTimeString, end = false) => {
    const date = new Date(dateTimeString);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month =
      date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const year = date.getFullYear();
    const dateString = `${year}-${month}-${end ? +day + 1 : day}`;
    return +new Date(Date.parse(dateString));
  };

  filterByDate = (data) => {
    const { startDate, endDate } = this.props;
    return data.filter(([key, value]) => {
      if (startDate && endDate) {
        // const minDate = startDate;
        // const maxDate = endDate;
        // const currentDate = key;
        return (
          key >= this.getDate(startDate) && key <= this.getDate(endDate, true)
        );
      }
      return [key, value];
    });
  };

  getTotal() {
    const { storage } = this.props;

    const filtered = this.filterByDate([...storage.entries()]);
    return [...new Map(filtered.values()).values()].reduce(
      (acc, curr) =>
        acc + curr.reduce((ac, { total }) => ac + parseFloat(total), 0),
      0
    );
  }

  totalStatisticsFromStorage() {
    const { storage } = this.props;
    if (!storage.size > 0) {
      return;
    }
    const filtered = this.filterByDate([...storage.entries()]);

    const data = new Map([]);
    const newData = new Map(filtered);
    if (!newData.size > 0) {
      return;
    }
    [...newData.values()].forEach((item) => {
      const parsedItem = item;
      if (!parsedItem.length > 0) {
        return;
      }
      parsedItem.forEach(({ name, total, count, price }) => {
        if (data.get(name)) {
          const {
            total: dataTotal,
            count: dataCount,
            price: dataPrice,
          } = data.get(name);
          data.set(name, {
            total: +dataTotal + +count * dataPrice,
            count: +dataCount + +count,
            price: +dataPrice,
          });
        } else {
          data.set(name, {
            total,
            count,
            price,
          });
        }
      });
    });
    const renderdata = [...data.entries()].map(([key, value]) => (
      <StatisticsTotalItem key={key} data={key} value={value} />
    ));

    return <div>{renderdata}</div>;
  }

  invoicesStatisticFromStorage = () => {
    const { storage, removeInvoice } = this.props;
    if (!storage.size > 0) {
      return;
    }
    const filtered = this.filterByDate([...storage.entries()]);
    return filtered
      .sort(([k, v], [k1, v1]) => parseFloat(k) - parseFloat(k1))
      .reverse()
      .map(([key, value]) => {
        if (!value) {
          return null;
        }
        const item = value;
        const date = key;
        if (!item && !item.length > 0) {
          return null;
        }
        return (
          <StatisticsInvoiceItem
            removeInvoice={removeInvoice}
            key={`${key}`}
            date={date}
            item={item}
          />
          // <div
          //   key={`${key}`}
          //   className={"statistics"}
          //   style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20 }}
          // >
          //   <div style={{ flex: 2 }}>{getDateString(date)}</div>
          //   <div style={{ flex: 3, flexDirection: "column" }}>
          //     {item.map(({ name, total, count }, index) => (
          //       <div key={`${name}-${index}`} className={"statistics-item"}>
          //         <div style={{ flex: 3 }}>{name}</div>
          //         <div style={{ flex: 1 }}>{+count}</div>
          //         <div style={{ flex: 1 }}>{+total}</div>
          //       </div>
          //     ))}
          //   </div>
          // </div>
        );
      });
  };

  render() {
    return (
      <div style={{ flex: 1, marginTop: "15px" }}>
        <Button
          type="primary"
          block
          onClick={() => this.setState({ showTotal: !this.state.showTotal })}
        >
          {this.state.showTotal ? "Полная из хранилища" : "По заказам"}
        </Button>
        {this.props.storage.size > 0 ? (
          this.state.showTotal ? (
            this.totalStatisticsFromStorage()
          ) : (
            this.invoicesStatisticFromStorage()
          )
        ) : (
          <div>No storage data</div>
        )}
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: "bold",
              divAlign: "right",
              margin: 20,
            }}
          >
            Общая сумма: {this.getTotal()}
          </div>
        </div>
      </div>
    );
  }
}

export default connectToStore(connectDatePickerToStore(DataFromStorage));
