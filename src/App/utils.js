// import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import { notification } from "antd";

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
  return moment(dateString).format("DD.MM.YY HH:mm:ss");
}

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
