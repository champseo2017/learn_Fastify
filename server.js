const fastify = require("fastify");

const serverOptions = {
  logger: true,
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

app.get("/", (request, reply) => {
  reply.send({ hello: "world" });
});

app.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
  }
  console.log(`Server listening at ${address}`);
});

/* 
root application instance
const serverOptions = {
  logger: {
    level: 'info',
    file: '/path/to/logs/fastify.log'
  },
  https: {
    key: fs.readFileSync('/path/to/key.pem'),
    cert: fs.readFileSync('/path/to/cert.pem')
  },
  keepAliveTimeout: 5000,
  connectionTimeout: 10000,
  bodyLimit: 1048576, // 1MB
  maxParamLength: 100,
  http2: true,
  ajv: {
    customOptions: { nullable: true }
  },
  serverFactory: (handler, opts) => {
    const server = http2.createServer(opts, handler)
    return server
  },
  onProtoPoisoning: 'remove',
  onConstructorPoisoning: 'remove'
};

เรากำหนดอ็อบเจ็กต์ `serverOptions` ที่มีการกำหนดค่าต่าง ๆ เช่น:
   - `logger` กำหนดระดับการบันทึก (log level) และไฟล์สำหรับเก็บล็อก
   - `https` กำหนดคีย์และใบรับรอง SSL/TLS สำหรับเปิดใช้งาน HTTPS
   - `keepAliveTimeout` และ `connectionTimeout` กำหนดค่าหมดเวลาต่าง ๆ
   - `bodyLimit` และ `maxParamLength` จำกัดขนาดและความยาวของข้อมูลที่ยอมรับ
   - `http2` เปิดใช้งานการสนับสนุน HTTP/2
   - `ajv` กำหนดค่าตัวเลือกเพิ่มเติมสำหรับการตรวจสอบข้อมูล
   - `serverFactory` กำหนดฟังก์ชันเพื่อสร้างเซิร์ฟเวอร์ที่กำหนดเอง
   - `onProtoPoisoning` และ `onConstructorPoisoning` กำหนดพฤติกรรมเมื่อเกิดการโจมตีบางประเภท

   - เมื่อไคลเอนต์เชื่อมต่อกับเซิร์ฟเวอร์ ต้องสร้างการเชื่อมต่อให้สำเร็จภายใน 10 วินาที (10000 มิลลิวินาที) ตามที่กำหนดโดย `connectionTimeout` ไม่เช่นนั้นการเชื่อมต่อจะถูกยกเลิก
- หลังจากสร้างการเชื่อมต่อและไคลเอนต์ส่ง request มา เซิร์ฟเวอร์จะรอ request ถัดไปเป็นเวลา 5 วินาที (5000 มิลลิวินาที) ตามที่กำหนดโดย `keepAliveTimeout`
- ถ้าไม่มี request ใหม่มาภายใน 5 วินาที เซิร์ฟเวอร์จะปิดการเชื่อมต่อ
- แต่ถ้ามี request ใหม่มาภายใน 5 วินาที การเชื่อมต่อจะยังคงเปิดอยู่และเวลานับถอยหลังจะเริ่มใหม่หลังจากตอบกลับ request นั้น
*/
