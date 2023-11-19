import { generateClass, getStyleKeys, parserClass, generate } from "@/helper/unocss";
import { key, options } from "@/helper/unocss-option";

self.addEventListener("message", async (e) => {
  const { all, text, classList } = e.data;
  const newClassList: string[] = [].concat(classList);
  if (all) newClassList.push(...generate(key, options));
  if (text && String(text).length > 0) newClassList.push(getStyleKeys(text).css);
  const classResult = await generateClass(newClassList);
  const map = await parserClass(classResult);
  self.postMessage({ all, result: map });
});
