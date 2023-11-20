import { mount } from "cypress/vue";
import Icon from "./Icon.vue";

describe("<Icon>", () => {
  it("is visible", () => {
    cy.viewport(1080, 800);
    cy.mount(Icon, { props: { name: "add" } });
  });
});
