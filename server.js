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

/* 
Handler ของ route คือฟังก์ชันที่ต้องดำเนินการตามตรรกะทางธุรกิจของ endpoint Fastify จะส่งคอมโพเนนต์หลักทั้งหมดให้กับ handler เพื่อให้สามารถตอบสนองต่อ request ของ client ได้ โดย request และ reply object จะถูกส่งเป็น argument ให้กับ handler และ handler สามารถเข้าถึง server instance ได้ผ่าน function binding (this)

ภายใน function เราสามารถเข้าถึง application instance ได้ผ่าน this เพื่อเรียกใช้ this.server.address() และส่งผลลัพธ์กลับไปใน response
*/
function business(request, reply) {
  // `this` คือ instance ของ Fastify application
  reply.send({ helloFrom: this.server.address() });
}

app.get("/server", business);

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

*/
