import moment from "moment";

export const echo = (function () {
  let queue = [];
  const ECHO_TOKEN = {};
  const RESET_INPUT = "%c ";
  const RESET_CSS =
    "font-weight: bold;font-family: ui-monospace, SFMono-Regular, Monaco, Consolas !important;";

  function alertFormatting(value: string) {
    queue.push({
      value: value,
      css:
        RESET_CSS +
        "display: inline-block ; background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 3px 7px 3px 7px ; border-radius: 3px 3px 3px 3px ;"
    });
    return ECHO_TOKEN;
  }

  function warningFormatting(value: string) {
    queue.push({
      value: value,
      css:
        RESET_CSS +
        "display: inline-block ; background-color: gold ; color: black ; font-weight: bold ; padding: 3px 7px 3px 7px ; border-radius: 3px 3px 3px 3px ;"
    });
    return ECHO_TOKEN;
  }

  function using(consoleFunction: Function) {
    return function (...args: any[]) {
      const inputs = [];
      const modifiers = [];
      for (var i = 0; i < args.length; i++) {
        if (args[i] === ECHO_TOKEN) {
          var item = queue.shift();
          inputs.push("%c" + item.value, RESET_INPUT);
          modifiers.push(item.css, RESET_CSS);
          // 对于其他所有参数类型，直接输出值。
        } else {
          var arg = args[i];
          if (typeof arg === "object" || typeof arg === "function") {
            inputs.push("%o", RESET_INPUT);
            modifiers.push(arg, RESET_CSS);
          } else {
            inputs.push("%c" + arg, RESET_INPUT);
            modifiers.push(RESET_CSS, RESET_CSS);
          }
        }
      }
      consoleFunction(inputs.join(""), ...modifiers);
      // 全部输出后，清空队列。
      queue = [];
    };
  }

  return {
    // 控制台功能。
    log: using(console.log),
    warn: using(console.warn),
    error: using(console.error),
    trace: using(console.trace),
    group: using(console.group),
    groupEnd: using(console.groupEnd),
    // 格式化功能。
    asAlert: alertFormatting,
    asWarning: warningFormatting
  };
})();

export function println(...args: any[]) {
  echo.group(echo.asAlert("日志"), echo.asAlert(moment().format("hh:mm:ss")));
  echo.log(...args);
  echo.groupEnd();
}

set(window, "echo", echo);
set(window, "println", println);
export {};
