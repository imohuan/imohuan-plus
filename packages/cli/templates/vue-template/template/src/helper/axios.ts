import instance from "axios";
import { defaultsDeep } from "lodash-es";

import { ctx } from "./ctx";

instance.interceptors.request.use((request) => {
  const url = request.url;
  const { PROD, VITE_PROXY_DOMAIN, VITE_PROXY_DOMAIN_REAL } = import.meta.env;
  if (PROD && url.startsWith(VITE_PROXY_DOMAIN)) {
    request.url = request.url.replace(
      VITE_PROXY_DOMAIN,
      VITE_PROXY_DOMAIN_REAL || "http://localhost:7001"
    );
  }

  request.headers = defaultsDeep(
    { Authorization: `Bearer ${ctx.store.get("token")}` },
    request.headers
  );

  return request;
});

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data.code !== 200) {
        ctx.notify("negative", response.data.message);
        throw new Error(response.data.message);
      }
      return response.data;
    }
  },
  (error) => {
    const message = String(error.response.data).split("\n").shift().split(":").slice(1).join("");
    if (message.trim() === "Unauthorized") {
      ctx.notify("negative", "未登录，跳转登录");
      location.href = `${location.origin}/login?Unauthorized=true`;
    } else ctx.notify("negative", message.trim());
    return Promise.reject(error.response);
  }
);

export const axios = instance;
