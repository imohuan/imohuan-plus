declare namespace NodeJS {
  type CustomProcessEnv = import("./typings").CustomProcessEnv;
  interface ProcessEnv extends CustomProcessEnv {}
}
