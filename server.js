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
Component Reply ทำหน้าที่จัดการ response ที่ส่งกลับไปยัง client
มีเมธอดต่างๆ เช่น send(), code(), header(), type() ในการกำหนดรายละเอียดของ response
เมธอดเหล่านี้สามารถเชื่อมต่อกันเป็น chain ได้เพื่อให้โค้ดกระชับขึ้น
Reply มีระบบตรวจจับ header อัตโนมัติ เช่น Content-Length และ Content-Type
Status code เริ่มต้นเป็น 200 เมื่อ request สำเร็จ และ 500 เมื่อเกิด error
สามารถส่ง class instance เป็น response ได้ โดย Fastify จะเรียกใช้ toJSON() เพื่อแปลงเป็น JSON

app.get('/car', function (request, reply) {
  reply.code(200).type('application/json').send({t: 1})
})
*/

class Car {
  constructor(model) {
    this.model = model;
  }

  toJSON() {
    return {
      type: "car",
      model: this.model,
    };
  }
}

app.get("/car", function (request, reply) {
  return new Car("Ferrari");
});

/* 
สร้าง class Car ที่มี constructor กำหนดรุ่นรถและเมธอด toJSON() คืนค่า object ที่มี property type และ model
กำหนด route /car ที่ return instance ของ Car
เมื่อมี request เข้ามา Fastify จะเรียกใช้ toJSON() เพื่อแปลง instance เป็น JSON ก่อนส่งกลับเป็น response

ระบบตรวจจับ header อัตโนมัติใน Fastify Reply หมายความว่า Reply สามารถกำหนดค่าให้กับ header บางตัวได้โดยอัตโนมัติ โดยที่เราไม่ต้องกำหนดเองแบบmanual ยกตัวอย่างเช่น:

1. Content-Length header:
   - Reply จะคำนวณขนาดของ payload (เนื้อหา) ที่เราต้องการส่งกลับไปให้ client และกำหนดค่านั้นให้กับ Content-Length header โดยอัตโนมัติ
   - เราไม่ต้องนั่งนับขนาดเองหรือกำหนดค่า Content-Length ด้วยตัวเอง Reply จะจัดการให้
   - ยกเว้นกรณีที่เราต้องการกำหนดค่า Content-Length เองแบบ manual

2. Content-Type header:
   - Reply จะพยายามเดาชนิดของ payload ที่เราส่งกลับและกำหนด Content-Type ให้เหมาะสมโดยอัตโนมัติ
   - ถ้า payload เป็น string Reply จะตั้ง Content-Type เป็น "text/plain"
   - ถ้า payload เป็น JSON object Reply จะตั้ง Content-Type เป็น "application/json"
   - ถ้า payload เป็น stream หรือ buffer Reply จะตั้ง Content-Type เป็น "application/octet-stream"
   - เราสามารถกำหนด Content-Type เองได้ถ้าต้องการ ซึ่งจะ override ค่าที่ Reply ตั้งให้อัตโนมัติ
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
