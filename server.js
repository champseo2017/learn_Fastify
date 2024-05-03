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

// ประกาศ route แบบย่อ แบบที่ 2
/* 
ใช้ app.get() เพื่อประกาศ route สำหรับ HTTP GET
พารามิเตอร์แรกเป็น string กำหนด URL ของ route เป็น '/hello'
พารามิเตอร์ที่สองเป็น object ที่ประกอบด้วย:

key handler ที่มีค่าเป็น function handler
key อื่นๆ สำหรับกำหนด options เพิ่มเติมของ route

someOption
1. `schema`: กำหนด schema สำหรับ request และ response เพื่อตรวจสอบความถูกต้องของข้อมูล
2. `preValidation`: กำหนด function ที่จะรันก่อนการ validation ของ request
3. `preHandler`: กำหนด function ที่จะรันก่อน handler หลักของ route
4. `onRequest`, `onResponse`, `preSerialization`, `onError`, `onSend`, `onTimeout`: กำหนด hook สำหรับจุดต่างๆ ในวงจรชีวิตของ request
5. `attachValidation`: กำหนดให้ผนวกผลการ validation เข้ากับ request object
6. `validatorCompiler`: กำหนด compiler สำหรับ schema validation
*/
app.get("/hello", {
  handler: (request, reply) => {
    reply.send("Hello world!");
  },
  someOption: "value",
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

*/
