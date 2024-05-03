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
ตัวอย่างการเรียก reply.send() หลายครั้งใน handler (ไม่ควรทำ):

app.get('/multi', function multi(request, reply) {
  reply.send('one')
  reply.send('two')
  reply.send('three')
  this.log.info('this line is executed')
})

Handler นี้จะตอบกลับด้วย string 'one' เท่านั้น ส่วนการเรียก reply.send() ครั้งถัดๆ ไปจะถูกเพิกเฉยและเกิด error FST_ERR_REP_ALREADY_SENT ใน console
บรรทัดสุดท้ายที่เรียก this.log.info() จะถูกประมวลผลตามปกติ แม้จะมีการเรียก reply.send() ซ้ำซ้อนก็ตาม

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
