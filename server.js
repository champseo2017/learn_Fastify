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
ตัวอย่างการนำ async handler ไปใช้ซ้ำในฟังก์ชัน handler อื่น

เรากำหนดฟังก์ชัน foo และ bar เป็น named async function
ฟังก์ชัน bar เรียกใช้ฟังก์ชัน foo และรอผลลัพธ์ด้วย await แล้วนำผลลัพธ์ที่ได้มาสร้าง response payload ใหม่
การใช้ async function ที่ return ค่าโดยตรงแบบนี้ ทำให้เรานำ handler ไปใช้ซ้ำได้ง่ายขึ้น โดยไม่ต้องกังวลเรื่องการส่งต่อ reply object

สรุปได้ว่า Fastify ให้ความยืดหยุ่นในการเขียน handler ทั้งแบบ synchronous และ asynchronous โดยเราสามารถเลือกใช้งานได้ตามความเหมาะสม ไม่ว่าจะเป็นการใช้ reply.send(), return โดยตรง หรือ await ผลลัพธ์จาก async function อื่นๆ ซึ่งช่วยให้เราจัดการกับ business logic และ response ได้ง่ายและมีประสิทธิภาพมากขึ้น
*/
async function foo(request, reply) {
  return 1;
}

async function bar(request, reply) {
  const oneResponse = await foo(request, reply);
  return { one: oneResponse, two: 2 };
}

app.get("/foo", foo);
app.get("/bar", bar);

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
