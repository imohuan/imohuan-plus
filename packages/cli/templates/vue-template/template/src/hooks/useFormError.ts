import { ctx } from "@/helper/ctx";

export function useFormError() {
  const ok = ref<any>({});
  const getErrorMessages = () =>
    Object.entries(ok.value).filter(([k, v]) => String(v).trim().length > 0);
  const checkForm = (callback: Function) => {
    const errList = getErrorMessages();
    const errMap = {
      username: "用户名",
      nickname: "昵称",
      password: "密码",
      description: "个人介绍"
    };
    if (errList.length > 0) {
      ctx.notify("negative", `"${errMap[errList[0][0]]}" ${errList[0][1]}`);
      return;
    } else callback();
  };
  return { ok, checkForm };
}
