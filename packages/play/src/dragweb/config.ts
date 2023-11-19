import { RenderViewList, Responsive } from "./interface";
import { createConfig, createListItemConfig } from "./utils";

const type = ["primary", "success", "info", "warning", "danger"];
const size = ["large", "default", "small"];

export const list: RenderViewList[] = [
  {
    title: "按钮",
    list: [
      {
        show: { tag: "el-button", attr: { __text: "按钮" } },
        list: [
          ...createConfig({ tag: "el-button", attr: { __text: "按钮" } }, "type", type),
          ...createConfig(
            { tag: "el-button", attr: { __text: "按钮", plain: true } },
            "type",
            type
          ),
          ...createConfig({ tag: "el-button", attr: { __text: "按钮", round: true } }, "type", type)
        ]
      },
      createListItemConfig(
        { tag: "el-button", attr: { __text: "按钮" } },
        { type, round: true, plain: true },
        "type"
      ),
      createListItemConfig(
        { tag: "el-checkbox", attr: { __text: "单选框" } },
        { size, checked: true, disabled: true },
        "size"
      ),
      createListItemConfig(
        { tag: "el-checkbox-button", attr: { label: "单选框" } },
        { size, checked: true, border: true, disabled: true },
        "size"
      )
    ]
  }
];

export const responsive: Responsive = {
  pc: {
    name: "pc",
    description: "PC",
    width: "100%",
    height: "100%",
    list: [{ name: "PC Fixed", description: "PC 固定大小", width: 1920, height: 1680 }]
  },
  moblie: {
    name: "moblie",
    description: "PC",
    width: 380,
    height: "100%",
    list: [
      { name: "iPhone 8", description: "", width: 377, height: 669 },
      { name: "iPhone 8 Plus", description: "", width: 416, height: 738 },
      { name: "iPhone X", description: "", width: 377, height: 814 },
      { name: "iPhone XR", description: "", width: 416, height: 898 },
      { name: "iPhone XS Max", description: "", width: 416, height: 898 },
      { name: "HUAWEI Mate 30 Pro", description: "", width: 394, height: 802 },
      { name: "Nexus 5", description: "", width: 362, height: 642 },
      { name: "Galaxy S8", description: "", width: 362, height: 742 }
    ]
  }
};
