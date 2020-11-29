import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Resizer from "react-image-file-resizer";

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      80,
      0,
      (uri) => {
        resolve(uri);
      },
      "blob"
    );
  })
    .then((res) => res)
    .then((re) => console.log(re));
// .then((res) => console.log(res));

const props = {
  action: "http://localhost/upload.php",
  listType: "picture",
  transformFile(file) {
    return resizeFile(file);
  },
};

const Uploader = () => {
  return (
    <>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </>
  );
};

export default Uploader;
