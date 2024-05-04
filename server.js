const fastify = require("fastify");
const fs = require("fs/promises");

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
Fastify ช่วยให้เราอ่าน input ของ client ได้ง่ายขึ้น เพราะมันรองรับ JSON input และ output เป็นหลัก และในการประมวลผล input นั้น เราเพียงแค่เข้าถึง Request component ที่ถูกส่งมาเป็น argument ของ handler function

Fastify จะจัดการแปลง object ที่เรา send ให้เป็น JSON string และกำหนด Content-Type header ให้เป็น application/json โดยอัตโนมัติ
*/

const cats = [];

app.post("/cat", function saveCat(request, reply) {
  cats.push(request.body);
  reply.code(201).send({ allCats: cats });
});

/* 

*/

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
