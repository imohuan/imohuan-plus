export const randId = (length: number = 5) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getAttrs = (dom: string | HTMLElement, attrs: string[]) => {
  if (!(dom instanceof HTMLElement)) throw new Error("Expected HTMLElement");
  return attrs.reduce((attrs, attr) => {
    attrs[attr] = dom.getAttribute(attr);
    return attrs;
  }, {} as any);
};
