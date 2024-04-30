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

app.get("/", (request, reply) => {
  reply.send({ hello: "world" });
});

app.listen({ port: 0, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  const { port } = app.server.address();

  app.log.info(`Server listening at ${address}`);
  app.log.info(`HTTP Server port is ${port}`);
  app.log.debug("Fastify listening with the config:", app.initialConfig);
});

/* 
เซิร์ฟเวอร์  Fastify (properties) 
โค้ดนี้แสดงการใช้งานคุณสมบัติอินสแตนซ์ของ Fastify:

1. เรากำหนดค่าตัวเลือก `logger` ในการสร้างอินสแตนซ์ Fastify โดยกำหนด `level` เป็น `'debug'` เพื่อเปิดใช้งานการบันทึก log ระดับ debug

2. เรากำหนดเส้นทาง GET สำหรับ path `'/'` ซึ่งส่งคืน JSON object `{ hello: 'world' }`

3. เราเรียกใช้เมธอด `listen()` เพื่อเริ่มต้นเซิร์ฟเวอร์ โดยกำหนด `port` เป็น 0 เพื่อให้ระบบปฏิบัติการกำหนดพอร์ตที่ว่างให้ และกำหนด `host` เป็น `'0.0.0.0'` เพื่อรับฟังทุกอินเทอร์เฟซเครือข่าย

4. ภายในคอลแบ็กของ `listen()` เราตรวจสอบข้อผิดพลาด และพิมพ์ข้อความ log โดยใช้คุณสมบัติอินสแตนซ์:
   - `app.log.debug()` ใช้พิมพ์ log ระดับ debug โดยแสดงค่าของ `app.initialConfig` ซึ่งเป็นการกำหนดค่าเริ่มต้นของเซิร์ฟเวอร์
   - `app.server.address()` ใช้เพื่อเข้าถึงที่อยู่และพอร์ตของเซิร์ฟเวอร์ที่รันอยู่
   - `app.log.info()` ใช้พิมพ์ log ระดับ info โดยแสดงหมายเลขพอร์ตที่เซิร์ฟเวอร์กำลังรับฟัง

เมื่อรันโค้ดนี้ เราจะเห็นข้อความ log ที่แสดงข้อมูลการกำหนดค่าเซิร์ฟเวอร์และหมายเลขพอร์ตที่เซิร์ฟเวอร์กำลังรับฟัง ซึ่งแสดงการใช้งานคุณสมบัติอินสแตนซ์ต่าง ๆ ของ Fastify
*/
