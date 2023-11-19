import "./eslint.js";
import rules from "./eslint.rule.json";

const baseRuleChange = {
  cssConflict: "warning",
  "at-rule-no-unknown": [true, { ignoreAtRules: ["apply"] }],
  "no-console": 0,
  "no-unused-vars": 0,
  "comma-dangle": [
    "error",
    {
      arrays: "only-multiline",
      objects: "only-multiline",
      imports: "only-multiline",
      exports: "only-multiline",
      functions: "only-multiline"
    }
  ],
  indent: ["error", 2],
  "no-bitwise": "off",
  "no-continue": "off",
  "no-plusplus": "off",
  "one-var": "off",
  "one-var-declaration-per-line": "off",
  "no-restricted-syntax": [
    "error",
    {
      selector: "LabeledStatement",
      message:
        "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand."
    },
    {
      selector: "WithStatement",
      message:
        "`with` is disallowed in strict mode because it makes code impossible to predict and optimize."
    }
  ],
  "prefer-destructuring": "off",
  "no-new": "off",
  "no-script-url": "off"
};

const config = {
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: { browser: true },
  rules: Object.assign({}, rules, baseRuleChange)
};

const severityMap = {
  2: 8, // 2 for eslint is error
  1: 4 // 1 for eslint is warning
};

const ruleDefines: any = self.linter.esLinter.getRules();

self.addEventListener("message", (e) => {
  const { code, version, path } = e.data;
  const ext = path.split(".").pop() || "";
  if (!["js", "ts"].includes(ext)) return self.postMessage({ markers: [], version });
  const errs = self.linter.esLinter.verify(code, config);
  const markers = errs.map((err) => ({
    code: { value: err.ruleId, target: ruleDefines.get(err.ruleId).meta.docs.url },
    startLineNumber: err.line,
    endLineNumber: err.endLine,
    startColumn: err.column,
    endColumn: err.endColumn,
    message: err.message,
    severity: severityMap[err.severity],
    source: "eslint"
  }));
  self.postMessage({ markers, version, path, name: "Eslint" });
});
