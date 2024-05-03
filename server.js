const fastify = require("fastify");

const serverOptions = {
  logger: {
    level: "debug",
  },
  keepAliveTimeout: 5000,
  connectionTimeout: 10000,
  bodyLimit: 1048576, // 1MB
  maxParamLength: 100,
};

const app = fastify(serverOptions);

// เพิ่ม onRoute's hook
app.addHook("onRoute", (routeOptions) => {
  console.log("onRoute hook executed");
});

// เพิ่ม onRegister's hook
app.addHook("onRegister", (registerOptions) => {
  console.log("onRegister hook executed");
});

// เพิ่ม onReady's hook
app.addHook("onReady", (done) => {
  console.log("onReady hook executed");
  done();
});

// โหลดแอปพลิเคชันโดยไม่ต้องรอฟังคำขอ HTTP
app.ready().then(() => {
  console.log("Application is ready!");
});

app.route({
  url: "/",
  method: "GET",
  handler: (request, reply) => {
    reply.send({ hello: "Hello World Home" });
  },
});

app.route({
  url: "/hello",
  method: "GET",
  handler: (request, reply) => {
    reply.send("world");
  },
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

/* 
เราสามารถใช้ทั้งสองอย่างร่วมกันได้ เช่น ลงทะเบียน hook ด้วย app.addHook("onReady", ...) สำหรับงานที่ต้องทำเมื่อแอปพลิเคชันพร้อม และใช้ app.ready().then() เพื่อรอให้แอปพลิเคชันพร้อมก่อนทำสิ่งอื่นต่อ ขึ้นอยู่กับความต้องการและรูปแบบของแอปพลิเคชัน

app.inject เป็นเครื่องมือที่มีประโยชน์มากสำหรับการทดสอบแอปพลิเคชัน Fastify โดยไม่ต้องเริ่มต้นเซิร์ฟเวอร์จริง ช่วยให้เราสามารถทดสอบ routes, handlers, middleware และ plugins 
*/
