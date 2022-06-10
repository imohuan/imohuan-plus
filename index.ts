import inquirer from "inquirer";
console.log("inquirer", inquirer);
(async () => {
  const result = await inquirer.prompt([
    {
      type: "list",
      message: "请选择一种水果:",
      name: "fruit",
      choices: ["Apple", "Pear", "Banana"],
      filter: function (val) {
        return val.toLowerCase();
      }
    }
  ]);
  console.log("result", result);
})();
