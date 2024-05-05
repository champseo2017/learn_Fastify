const fastify = require("fastify");
const fs = require("fs/promises");

const serverOptions = {
  logger: {
    level: "debug",
    transport: {
      target: "pino-pretty",
    },
  },
};

const app = fastify(serverOptions);

// เพิ่ม onRoute's hook
app.addHook("onRoute", function (routeOptions) {
  console.log(`First onRoute hook: ${routeOptions.method} ${routeOptions.url}`);
});

// เพิ่ม onRegister's hook
// app.addHook("onRegister", (registerOptions) => {
//   console.log("onRegister hook executed");
// });

// เพิ่ม onReady's hook
// app.addHook("onReady", (done) => {
//   console.log("onReady hook executed");
//   done();
// });

// โหลดแอปพลิเคชันโดยไม่ต้องรอฟังคำขอ HTTP
// app.ready().then(() => {
//   console.log("Application is ready!");
// });

/* 
app.register เป็นวิธีการเพิ่ม plugin เข้าไปใน Fastify application โดยจะถูกเรียกใช้ในช่วง application startup ก่อนที่ server จะเริ่มรับ request
เกี่ยวกับลำดับการทำงานของ `fastify.addHook()` และ `fastify.register()`:

1. ลำดับการทำงานขึ้นอยู่กับลำดับที่เขียนในโค้ด
2. `fastify.addHook()` ที่เรียกก่อน `fastify.register()` จะถูกเพิ่มและเรียกใช้ก่อน
3. `fastify.register()` จะลงทะเบียนและเรียกใช้ plugin ตามลำดับ ภายใน plugin ก็สามารถเพิ่ม hook ได้ด้วย `fastify.addHook()`
4. `fastify.addHook()` ที่เรียกหลัง `fastify.register()` จะถูกเพิ่มและเรียกใช้หลังสุด
5. Hook ที่เพิ่มภายใน plugin จะถูกเรียกใช้เฉพาะกับ route ที่อยู่ใน plugin นั้นเท่านั้น
6. Hook ที่เพิ่มนอก plugin จะถูกเรียกใช้กับทุก route รวมถึง route ที่อยู่ใน plugin ด้วย

ดังนั้น ลำดับการทำงานจะเป็น:
1. `fastify.addHook()` ก่อน `fastify.register()`
2. `fastify.register()` และ `fastify.addHook()` ภายใน plugin
3. `fastify.addHook()` หลัง `fastify.register()`
*/

app.register(async function (app) {
  app.addHook("onRoute", (routeOptions) => {
    console.log(
      `Plugin onRoute hook: ${routeOptions.method} ${routeOptions.url}`
    );
  });

  app.get("/plugin", function (request, reply) {
    reply.send({ hello: "from plugin" });
  });
});

app.addHook("onRoute", (routeOptions) => {
  console.log(
    `Second onRoute hook: ${routeOptions.method} ${routeOptions.url}`
  );
});

app.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

app.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  const { port } = app.server.address();

  app.log.info(`Server listening at ${address}`);
  app.log.info(`HTTP Server port is ${port}`);
  app.log.debug("Fastify listening with the config:", app.initialConfig);
});

// ปิดเซิร์ฟเวอร์และเริ่มต้นขั้นตอนการปิด
// app.close(() => {
//   console.log("Server closed");
// });

// โหลดเซิร์ฟเวอร์และส่งคำขอ HTTP จำลอง
app.inject(
  {
    method: "GET",
    url: "/",
  },
  (err, response) => {
    console.log("inject", response.payload);
  }
);
