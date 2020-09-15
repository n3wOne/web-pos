// import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import { notification } from "antd";

export const dateNow = () => moment().unix() * 1000;
export const dnow = (mom) => moment(mom).unix() * 1000 || 0;

export const notify = ({ type, message, description }) =>
  notification[type]({
    message: type === "error" ? "Ошибка" : message,
    description,
    duration: type === "error" ? 0 : 3,
    placement: "bottomRight",
    bottom: 100,
  });

export function getDateString(dateString) {
  // console.log(moment(dateString));
  const wrapDate = (date) => (date > 9 ? date : `0${date}`);
  const parseDate = new Date(dateString);
  const hour = wrapDate(parseDate.getHours());
  const minutes = wrapDate(parseDate.getMinutes());
  const seconds = wrapDate(parseDate.getSeconds());
  const month = wrapDate(parseDate.getMonth());
  const year = parseDate.getFullYear();
  const day = wrapDate(parseDate.getDay());

  // return `${day}.${month}.${year} ${hour}:${minutes}:${seconds}`;
  return moment(dateString).format("DD.MM.YY HH:mm:ss");
}
// console.log(Date.now(), new Date())

export const mapToArrayObject = (map) => {
  return [...map.values()].map(([key, value]) => value);
};

export const arrayToMap = (array) => {
  return new Map(array.map((item) => [item.id, item]));
};

export const clearStorage = async () => {
  localStorage.clear();
  alert("Хранилище очищено!");
};

export const storageToMap = (storage) => {
  return new Map(JSON.parse(storage));
};

export const storageToJSON = (storage) => {
  const newStorage = [...storage.entries()];
  return JSON.stringify(newStorage);
};

const SUCCESS = "success";
const ERROR = "error";

export const alertEvent = (data) => {
  let alertData = data;
  if (Array.isArray(alertData)) {
    alertData = Object.fromEntries(alertData);
  }
  if (alertData.status === SUCCESS) {
    alert("Действие выполнено успешно!");
  }
  if (alertData.status === ERROR) {
    alert(`Произошла ошибка! ${data.error}`);
  }
};
