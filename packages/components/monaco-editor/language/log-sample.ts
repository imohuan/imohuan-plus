import * as monaco from "monaco-editor";

// 注册一门新语言
monaco.languages.register({ id: "logLanguageBase" });

// 为该语言注册一个令牌提供程序
monaco.languages.setMonarchTokensProvider("logLanguageBase", {
  tokenizer: {
    root: [
      [/\[error\]/, "custom-error"],
      // [/\[error.*/, "custom-error"],
      [/\[notice.*/, "custom-notice"],
      [/\[info.*/, "custom-info"],
      [/\[[a-zA-Z 0-9:]+\]/, "custom-date"]
    ]
  }
});

// 定义一个新主题，该主题只包含匹配该语言的规则
monaco.editor.defineTheme("logThemeBase", {
  base: "vs",
  inherit: false,
  rules: [
    { token: "custom-info", foreground: "808080" },
    { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
    { token: "custom-notice", foreground: "FFA500" },
    { token: "custom-date", foreground: "008800" }
  ],
  colors: {
    "editor.foreground": "#000000"
  }
});
