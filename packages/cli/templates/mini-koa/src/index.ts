import { app, LogLevels } from "koa-micro-ts";
import { resolve } from "path";

// help: https://www.npmjs.com/package/koa-micro-ts
const port = 4444;

app.logger({ level: LogLevels.all });
app.bodyParser({ multipart: true });

app.apiDoc = "/api/doc";

// app.helmet();
app.cors();
app.catchErrors();

app.static(resolve(__dirname, "public"));

const router = app.newRouter();

router.get("/", async (ctx: any) => {
  ctx.body = "Hello World";
});

router.post("/data/:id", async (ctx: any) => {
  ctx.body = {
    query: ctx.query,
    params: ctx.params,
    body: ctx.request.body,
  };
});

app.useRouter(router);
app.gracefulShutdown({ finally: () => app.log.info("Server gracefully terminated") });
app.start(port);

app.log.info("Server started");
app.log.note("---------------------------------");
app.log.note(`HTTP: http://localhost:${port}`);
app.log.note("---------------------------------");

setTimeout(() => {
  const axios = require("axios");
  axios
    .post(`http://localhost:4444/data/${String(Math.random()).slice(2, 10)}?hello=world`, {
      bodyString: "hhhhhhh",
    })
    .then((res) => {
      console.log("res", res.data);
    });
}, 1000);
