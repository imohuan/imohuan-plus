import Axios from "axios";
import { get, set } from "lodash-es";

export * from "./user-agents";

/**
 * 自定义Axios请求
 */
export const instance = Axios.create({
  baseURL: "",
  timeout: 1000 * 3,
  withCredentials: false
});

instance.interceptors.request.use(
  (config) => {
    set(config, "retry", get(config, "retry", 3));
    set(config, "retryDelay", get(config, "retryDelay", 2000));
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    // 判断是否超时
    if (error.code === "ECONNABORTED" && error.message.indexOf("timeout") !== -1) {
      const config: any = error.config;
      config.retryCount = config.retryCount || 1;
      if (config.retryCount >= config.retry) {
        return Promise.reject(error);
      }

      config.retryCount++;
      const backoff = new Promise(function (resolve) {
        setTimeout(function () {
          resolve(true);
        }, config.retryDelay || 1);
      });
      // 重新获取数据
      return backoff.then(() => {
        return instance(config);
      });
    }
    return Promise.reject(error);
  }
);
