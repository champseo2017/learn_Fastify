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
การหลีกเลี่ยงการใช้ reply object และส่งคืน response payload โดยตรง จะช่วยให้สามารถนำฟังก์ชันของ handler มาใช้ซ้ำได้
*/
app.get("/file", function promiseHandler(request, reply) {
  const fileName = "./package.json";
  const readPromise = fs.readFile(fileName, { encoding: "utf8" });
  return readPromise;
});

/* 
handler เป็นฟังก์ชัน sync ที่ส่งคืน readPromise:Promise Fastify จะรอการทำงานของมันและตอบกลับ HTTP request ด้วย payload ที่ส่งคืนจาก promise chain

เมื่อเราใช้ฟังก์ชัน async มันจะถูกแปลงเป็น Promise โดยอัตโนมัติ และ Fastify จะต้องรอให้ Promise นั้น resolve ก่อนที่จะส่ง response กลับไปยัง client ซึ่งกระบวนการนี้จะใช้เวลาและทรัพยากรเพิ่มขึ้นเล็กน้อย

การใช้ฟังก์ชัน async/await จะสะดวกในการเขียนโค้ดและทำให้โค้ดอ่านง่ายขึ้น แต่มันจะมี overhead เล็กน้อยในการสร้างและจัดการ Promise รวมถึงการรอให้ Promise resolve ซึ่งอาจทำให้การทำงานของ handler ช้าลงเมื่อเทียบกับการ return Promise โดยตรง
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
