import { installPlugins } from "../../src/setup.ts";
import { mount } from "cypress/vue";

Cypress.Commands.add("mount", (component, options = {}) => {
  options.global = options.global || {};
  options.global.plugins = options.global.plugins || [];
  options.global.plugins.push({
    install: (app) => installPlugins(app)
  });
  return mount(component, options);
});
