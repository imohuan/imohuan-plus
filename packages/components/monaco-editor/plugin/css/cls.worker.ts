const cssRegExp = /class=[\"\'\`]([a-zA-Z0-9\(\)\[\]:\-_.\s]*)[\"\'\`]/g;

self.addEventListener("message", (e) => {
  const { code, version, path } = e.data;
  const ext = path.split(".").pop() || "";
  if (!["html", "vue"].includes(ext)) return self.postMessage({ markers: [], version });
  const markers = [];
  let value: any = null;
  while ((value = cssRegExp.exec(code))) {
    const repeat: string[] = [];
    const unique: string[] = [];

    value[1].split(" ").forEach((cls_item) => {
      if (!cls_item.trim()) return;
      if (unique.includes(cls_item)) repeat.push(...[cls_item, cls_item]);
      else unique.push(cls_item);
    });

    if (repeat.length === 0) continue;

    let currentContent: string = value[0];
    repeat.forEach((rp) => {
      const contents = code.slice(0, value.index).split("\n");
      const current: string[] = currentContent.slice(0, currentContent.indexOf(rp)).split("\n");
      const position = { line: contents.length + current.length - 1, col: 0 };
      position.col = 1 + current[current.length - 1].length + contents[contents.length - 1].length;

      currentContent = currentContent.replace(
        rp,
        Array.from({ length: rp.length }).fill("A").join("")
      );

      markers.push({
        code: { value: "cssConflict", target: "" },
        startLineNumber: position.line,
        endLineNumber: position.line,
        startColumn: position.col,
        endColumn: position.col + rp.length,
        message: `\`${rp}\` applies the same CSS properties as \`${rp}\``,
        severity: 4,
        source: "eslint"
      });
    });
  }

  self.postMessage({ markers, version, path, name: "Unique-Class" });
});

export {};
