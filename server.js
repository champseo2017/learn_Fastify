const fastify = require("fastify");
const fs = require("fs/promises");

const serverOptions = {
  logger: true,
  disableRequestLogging: true,
  requestIdLogLabel: "reqId",
  requestIdHeader: "request-id",
  genReqId: function (httpIncomingMessage) {
    return `foo-${Math.random()}`;
  },
};

/* 
สร้าง Fastify app พร้อมกับกำหนด options:
logger: เปิดใช้งาน logger
disableRequestLogging: ปิดการ log request และ response อัตโนมัติ เพื่อจะกำหนดเอง
requestIdLogLabel: กำหนดชื่อ field สำหรับ request ID ใน log เป็น "reqId"
requestIdHeader: กำหนดชื่อ header ที่จะให้ request ID มาเป็น "request-id"
genReqId: กำหนดฟังก์ชันสำหรับสุ่มสร้าง request ID เองในกรณีที่ไม่ได้ส่งมาทาง header
การปิดการ log request/response อัตโนมัติทำให้เราต้องจัดการในการเก็บ log การเรียก API ของ client เอง ส่วนการกำหนด requestIdLogLabel, requestIdHeader และ genReqId เป็นการปรับแต่งระบบ request ID ให้เหมาะกับระบบและสภาพแวดล้อมของเรา

*/

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

*/

app.get("/xray", function xRay(request, reply) {
  return {
    id: request.id,
    ip: request.ip,
    ips: request.ips,
    hostname: request.hostname,
    protocol: request.protocol,
    method: request.method,
    url: request.url,
    routerPath: request.routerPath,
    is404: request.is404,
  };
});

/* ภายใน handler เรา return object ที่ประกอบด้วย property ต่างๆ ของ request ได้แก่:

id: ID ของ request ในรูปแบบ "req-<หมายเลข>"
ip: IP address ของ client
ips: IP addresses ของ proxy
hostname: hostname ของ client
protocol: protocol ของ request (http หรือ https)
method: HTTP method ของ request (GET, POST, ...)
url: URL ของ request
routerPath: URL ของ handler ทั่วไป
is404: บอกว่า request ถูก route หรือไม่
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
