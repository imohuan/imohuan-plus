type DocItem = { content: DocItem[]; type: string; attrs?: any; text?: string };

export const parseDoc = (doc: DocItem): any => {
  let { content, type, text } = doc;

  if (type === "doc") type = "speak";

  if (!content) {
    if (type === "text" && text) return text;
    if (text) return `<${type}>${text}</${type}>`;
    if (type === "voice") return `<${type} />`;
    console.log(doc);
    return "";
  }

  let skipIndex = -1;
  const newContent: any[] = [];
  const getName = (item: DocItem) => {
    return item.type.slice(0, -1) + "-" + item.attrs.id.replace(/(left|right)-placeholder-/, "");
  };

  if (content.every((c) => c.type === "paragraph")) content = content.map((m) => m.content).flat();

  for (let i = 0; i < content.length; i++) {
    if (i <= skipIndex) continue;
    const { type, attrs, text, content: _content } = content[i];
    if (type.endsWith("L") && attrs) {
      const typeName = getName(content[i]);
      for (let j = i + 1; j < content.length; j++) {
        if (content[j].type.endsWith("R") && typeName === getName(content[j])) {
          const ct = content.slice(i + 1, j);
          newContent.push({ content: ct, type: type.slice(0, -1) });
          skipIndex = j;
        }
      }
      continue;
    }
    newContent.push(content[i]);
  }

  return `<${type}>${newContent?.map((m) => parseDoc(m)).join("\n")}</${type}>`;
};
