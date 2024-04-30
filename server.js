const fastify = require("fastify");

const serverOptions = {
  logger: true,
};

const app = fastify(serverOptions);

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
ลำดับการทำงานและตะขอวงจรชีวิตของ Fastify 
1. เริ่มต้นแอปพลิเคชัน (Start application event)
   - เข้าสู่เฟส Starting 

2. ประมวลผลตะขอ (hooks) แบบขนาน
   - ประมวลผลคิว onRoute's hooks 
   - ประมวลผลคิว onRegister's hooks

3. ประมวลผลตะขอ onReady's hooks
   - ถ้ามีข้อผิดพลาด ไปที่ "Startup Failed"
   - ถ้าไม่มีข้อผิดพลาด ไปที่ "Server Listening"

4. เกิดเหตุการณ์หยุดแอปพลิเคชัน (Stop application event) 
   - เข้าสู่เฟส Closing
   - ประมวลผลตะขอ onClose's hooks 

5. แอปพลิเคชันหยุดการทำงาน (Stopped)
*/
