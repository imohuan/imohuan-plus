function ImohuanResolver() {
  return {
    type: "component",
    async resolve(name) {
      if (name.startsWith("I")) {
        return {
          name,
          from: "@imohuan-plus/components"
          // sideEffects: "@imohuan-plus/components/xxx.css"
        };
      }
      return null;
    }
  };
}

module.exports = { ImohuanResolver };
