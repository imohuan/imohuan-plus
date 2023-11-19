import { tmpdir } from "os";
import { join } from "path";

export const customKey = "hello";

export const custom = {
  /** 分页最小页数 */
  minSize: 1,
  /** 分页最大页数 */
  maxSize: 10,
};

export const jwt = {
  secret: "xxxx",
  expiresIn: "2d", // https://github.com/vercel/ms
};

// 全局生效
export const validate = {
  validationOptions: {
    // 允许未定义的字段
    allowUnknown: true,
  },
};

// C:\Users\26522\AppData\Local\Temp\midway-upload-files
export const upload = {
  mode: "file",
  fileSize: "5mb",
  whitelist: [".jpg", ".jpeg", ".png", ".gif", ".zip"],
  tmpdir: join(tmpdir(), "midway-upload-files"), //上传的文件临时存储路径
  cleanTimeout: 5 * 60 * 1000, // 上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
};
