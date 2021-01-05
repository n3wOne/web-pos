import * as React from "react";
import {
  Calendar,
  Drawer,
  Descriptions,
  Input,
  Checkbox,
  Form as AntForm,
  Row,
  Col,
  Button,
  TimePicker,
  DatePicker,
  Popconfirm,
  message,
  Spin,
} from "antd";
import ruRu from "antd/lib/date-picker/locale/ru_RU";
import { useEffect, useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons/lib";
import { notify } from "../../utils";

const moment = require("moment");

interface IItem {
  id: number;
  date: string;
  name: string;
  peopleCount: number;
  phone?: string;
  hours: number;
  additions?: {
    vat?: boolean;
    brooms?: {
      birch?: number;
      oak?: number;
    };
  };
  comment?: string;
}

const BathCalendar: React.FC = () => {
  const [selectedItem, setSelectedItem]: [IItem, any] = useState(undefined);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [isEdit, setEdit] = useState(false);
  const [data, setData] = useState(undefined);
  const [form] = AntForm.useForm();

  const getDataFromRemote = async () => {
    try {
      const fetchParams = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      await fetch(`https://vk.ferma-ivanovka.ru/api/getBath.php`, fetchParams)
        .then((res) => res.json())
        .then((result) => {
          setData(result);
        });
    } catch (e) {
      notify({
        type: "error",
        message: "Ошибка",
        description: e,
      });
    }
  };

  useEffect(() => {
    (() => getDataFromRemote())();
  }, []);

  const DateInfo = () => {
    const { Item: DescriptionItem } = Descriptions;

    const DrawerContent = ({ item }: { item: IItem | undefined }) => {
      const {
        id = null,
        date = null,
        name = null,
        peopleCount = null,
        hours = null,
        phone = null,
        additions: { vat = false, brooms: { birch = 0, oak = 0 } } = {
          vat: false,
          brooms: { birch: 0, oak: 0 },
        },
        comment = null,
      } = item || {};

      const { Item } = AntForm;

      const onFinish = async (values: any) => {
        const receivedData: IItem = {
          id: id ?? +Date.now(),
          date:
            `${moment(selectedDate).format("YYYY-MM-DD")} ${
              moment(values.time).format("HH:mm:ss") ?? "00:00:00"
            }` ?? date,
          hours: values.hours ?? hours,
          name: values.name ?? name,
          comment: values.comment ?? comment,
          phone: values.phone ?? phone,
          peopleCount: values.peopleCount ?? peopleCount,
          additions: {
            vat: values.vat ?? vat ?? false,
            brooms: {
              oak: values.oak ?? oak ?? 0,
              birch: values.birch ?? birch ?? 0,
            },
          },
        };
        try {
          const fetchParams = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(receivedData),
          };

          await fetch(`https://vk.ferma-ivanovka.ru/api/bath.php`, fetchParams)
            .then((res) => res.json())
            .then(() => {
              notify({
                type: "success",
                message: isEdit ? "Запись изменена " : "Заказ создан",
                description: `Запись на ${moment(selectedDate).format(
                  "MM.DD HH:mm"
                )} ${isEdit ? "сохранена" : "создана"}`,
              });
            });
        } catch (e) {
          notify({
            type: "error",
            message: "Ошибка",
            description: e,
          });
        }

        setSelectedItem(undefined);
        setShowDrawer(false);
        setSelectedDate(undefined);
        isEdit && setEdit(false);
        await getDataFromRemote();
      };

      const Form = () => {
        const checkboxChange = (e: any) => {
          const { checked } = e.target;
          form.setFieldsValue({
            vat: checked,
          });
        };

        return (
          <AntForm form={form} onFinish={onFinish}>
            <Item label={"Дата"} name={"date"}>
              <DatePicker
                format={"DD.MM.YYYY"}
                value={moment(selectedDate)}
                defaultValue={moment(selectedDate)}
              />
            </Item>
            <Item label={"Имя"} name={"name"}>
              <Input placeholder={"Имя"} defaultValue={name} />
            </Item>
            <Item label={"Телефон"} name={"phone"}>
              <Input placeholder={"Телефон"} defaultValue={phone} />
            </Item>
            <Item label={"Время"} name={"time"}>
              <TimePicker
                minuteStep={15}
                format={"HH:mm"}
                defaultValue={date ? moment(date) : null}
              />
            </Item>
            <Item label={"Количество человек"} name={"peopleCount"}>
              <Input
                type={"number"}
                placeholder={"Количество человек"}
                defaultValue={peopleCount}
              />
            </Item>
            <Item label={"Количество часов"} name={"hours"}>
              <Input
                type={"number"}
                placeholder={"Количество часов"}
                defaultValue={hours}
              />
            </Item>
            <Item label={"Банный чан"} name={"vat"}>
              <Checkbox
                type={"checkbox"}
                onChange={checkboxChange}
                defaultChecked={vat}
              />
            </Item>
            <p>Веники: </p>
            <Row gutter={20}>
              <Col>
                <Item label={"Березовый"} name={"birch"}>
                  <Input type={"number"} defaultValue={birch} />
                </Item>
              </Col>
              <Col>
                <Item label={"Дубовый"} name={"oak"}>
                  <Input type={"number"} defaultValue={oak} />
                </Item>
              </Col>
            </Row>
            <Item label={"Комментарий"} name={"comment"}>
              <Input.TextArea
                placeholder={"Комментарий"}
                defaultValue={comment}
              />
            </Item>
            <Row gutter={20}>
              <Col>
                <Button
                  onClick={() => form.submit}
                  type={"primary"}
                  htmlType={"submit"}
                >
                  {isEdit ? "Сохранить" : "Добавить"}
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => {
                    form.resetFields();
                  }}
                  type={"default"}
                  htmlType={"reset"}
                >
                  Сбросить
                </Button>
              </Col>
            </Row>
          </AntForm>
        );
      };

      const editItem = () => {
        setEdit(true);
      };

      const onDelete = async () => {
        try {
          const fetchParams = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: item.id }),
          };

          await fetch(
            `https://vk.ferma-ivanovka.ru/api/bathDelete.php`,
            fetchParams
          )
            .then((res) => res.text())
            .then(() => {
              notify({
                type: "success",
                message: "Удаление",
                description: `Запись удалена`,
              });
            });
        } catch (e) {
          notify({
            type: "error",
            message: "Ошибка",
            description: e,
          });
        }
        setEdit(false);
        setShowDrawer(false);
        setSelectedItem(undefined);
        setSelectedDate(undefined);
        await getDataFromRemote();
      };

      const cancel = () => {
        message.error("Отмена");
      };

      const Description = () => {
        return (
          <>
            <Descriptions
              bordered
              column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
              layout={"vertical"}
              title={date}
            >
              <DescriptionItem label={"Имя"}>{name}</DescriptionItem>
              <DescriptionItem label={"Телефон"}>{phone}</DescriptionItem>
              <DescriptionItem label={"Время"}>
                {moment(date).format("HH:mm")}
              </DescriptionItem>
              <DescriptionItem label={"Количество человек"}>
                {peopleCount}
              </DescriptionItem>
              <DescriptionItem label={"Количество часов"}>
                {hours}
              </DescriptionItem>
            </Descriptions>
            <Descriptions title={"Дополнительно"}>
              <DescriptionItem label={"Банный чан"}>
                {vat ? (
                  <CheckOutlined style={{ color: "green" }} />
                ) : (
                  <CloseOutlined style={{ color: "red" }} />
                )}
              </DescriptionItem>
              <DescriptionItem label={"Веники"}>
                Березовый: {birch}
                <br />
                Дубовый: {oak}
              </DescriptionItem>
              <DescriptionItem label={"Комментарий"}>{comment}</DescriptionItem>
            </Descriptions>
            <Row>
              <Col>
                <Button
                  onClick={editItem}
                  icon={<EditOutlined />}
                  type={"primary"}
                >
                  Редактировать
                </Button>
              </Col>
              <Col>
                <Popconfirm
                  title="Удалить запись?"
                  onConfirm={onDelete}
                  onCancel={cancel}
                  okText="Да"
                  cancelText="Нет"
                >
                  <Button icon={<DeleteOutlined />} danger>
                    Удалить
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          </>
        );
      };

      return (
        <div
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            paddingBottom: "100px",
          }}
        >
          {item && !isEdit ? <Description /> : <Form />}
        </div>
      );
    };

    const onClose = () => {
      setSelectedItem(undefined);
      setShowDrawer(false);
      setSelectedDate(undefined);
      setEdit(false);
    };

    return (
      <Drawer
        width={"50%"}
        getContainer={false}
        onClose={onClose}
        visible={showDrawer}
      >
        <DrawerContent item={selectedItem} />
      </Drawer>
    );
  };

  const dataCellRender = (date: any) => {
    if (!data) return null;

    const listData = data.filter((item) => {
      const itemDate = moment(item.date);
      return (
        date.month() === itemDate.month() && date.date() === itemDate.date()
      );
    });

    const onEmptyClick = () => {
      setSelectedDate(date);
      setShowDrawer(true);
    };

    return listData.length > 0 ? (
      <div style={{ height: "100%" }} onClick={onEmptyClick}>
        <ul className={"calendar-list"}>
          {listData.map((item: IItem) => {
            const time = moment(item.date);
            const onClick = () => {
              setSelectedItem(item);
              setShowDrawer(true);
              setSelectedDate(undefined);
            };
            return (
              <li onClick={onClick} key={item.id}>
                {time.format("HH:mm")} -{" "}
                {time.add(item.hours, "h").format("HH:mm")} {item.name}
              </li>
            );
          })}
        </ul>
      </div>
    ) : (
      <div style={{ height: "100%" }} onClick={onEmptyClick} />
    );
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return !data ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
      }}
    >
      <Spin indicator={antIcon} />
    </div>
  ) : (
    <div>
      <Calendar dateCellRender={dataCellRender} locale={ruRu} />
      <DateInfo />
    </div>
  );
};

export default BathCalendar;
