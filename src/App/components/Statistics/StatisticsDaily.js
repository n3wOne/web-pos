import * as React from "react";
import { Button } from "antd";
import { getDateString } from "../../utils";
import { connectToStore } from "../../store/ConnectHolder";
import StatisticsInvoiceItem from "./StatisticsInvoiceItem";
import StatisticsTotalItem from "./StatisticsTotalItem";

class StatisticsDaily extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTotal: false,
      showStorage: true,
      total: 0,
    };
  }

  getTotal() {
    const {
      cart: { invoices },
    } = this.props;

    return [...invoices.values()].reduce(
      (acc, curr) =>
        acc + curr.reduce((ac, { total }) => ac + parseFloat(total), 0),
      0
    );
  }

  totalStatistics() {
    const {
      cart: { invoices },
      removeInvoice,
    } = this.props;

    const data = new Map([]);

    [...invoices.values()].forEach((item) => {
      item.forEach(({ name, total, count, price }) => {
        if (data.get(name)) {
          const {
            total: dataTotal,
            count: dataCount,
            price: dataPrice,
          } = data.get(name);
          data.set(name, {
            total: +dataTotal + +count * +dataPrice,
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
    const renderdata = [...data.entries()].map(([key, value]) => {
      return <StatisticsTotalItem key={key} data={key} value={value} />;
    });

    return <div style={{ flex: 1, flexDirection: "column" }}>{renderdata}</div>;
  }

  invoicesStatistics() {
    const {
      cart: { invoices },
      removeInvoice,
    } = this.props;

    const data = [...invoices.entries()].map(([key, item]) => {
      return (
        <StatisticsInvoiceItem
          removeInvoice={removeInvoice}
          key={`${key}`}
          date={key}
          item={item}
        />
      );
    });
    return <div style={{ flex: 1, flexDirection: "column" }}>{data}</div>;
  }

  statisticsDaily() {
    return (
      <>
        <Button
          type="primary"
          block
          onClick={() => this.setState({ showTotal: !this.state.showTotal })}
        >
          {this.state.showTotal ? "Общая" : "По заказам"}
        </Button>
        {this.state.showTotal
          ? this.totalStatistics()
          : this.invoicesStatistics()}
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
      </>
    );
  }

  render() {
    return this.statisticsDaily();
  }
}

export default connectToStore(StatisticsDaily);
