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

/* 
Fastify โดยปกติแสดงผล log เป็น JSON string ซึ่งอ่านยาก ในการพัฒนาเราต้องการให้ log อ่านง่ายขึ้น จึงติดตั้งโมดูล `pino-pretty` ด้วยคำสั่ง `npm install pino-pretty --save-dev`

จากนั้นกำหนดค่า logger ใน Fastify ดังนี้:

```javascript
const serverOptions = {
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty'
    }
  }
}
```

- `level: 'debug'` กำหนดให้แสดง log ทุกระดับตั้งแต่ debug ขึ้นไป
- `transport.target: 'pino-pretty'` ส่งผลลัพธ์ log ไปยังโมดูล pino-pretty เพื่อจัดรูปแบบให้อ่านง่าย

เมื่อรีสตาร์ทเซิร์ฟเวอร์ จะเห็น log ที่อ่านง่ายขึ้น ช่วยให้ตรวจสอบและดีบั๊กระหว่างพัฒนาได้สะดวกมากขึ้น
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
