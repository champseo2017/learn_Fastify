const fastify = require("fastify");

const serverOptions = {
  logger: true,
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
คือ Fastify มีวงจรชีวิต (lifecycle) ที่กำหนดลำดับของเหตุการณ์และตะขอ (hooks) ต่าง ๆ ที่เกิดขึ้นตั้งแต่เริ่มต้นแอปพลิเคชันจนถึงจบการทำงาน โดยมีตะขอหลัก ๆ ดังนี้:

1. onRoute และ onRegister: เรียกใช้เมื่อมีการสร้าง route หรือ plugin ใหม่
2. onReady: เรียกใช้หลังจาก onRoute และ onRegister เสร็จสิ้น เพื่อเตรียมความพร้อมก่อนเริ่มรับ request
3. onClose: เรียกใช้เมื่อมีการหยุดหรือปิดแอปพลิเคชัน

ในส่วนของการจัดการ request แต่ละครั้ง ก็มีตะขอที่เกี่ยวข้อง เช่น:

- onRequest: เมื่อได้รับ request
- preValidation: ก่อนตรวจสอบความถูกต้องของ request
- preHandler: ก่อนเข้าสู่ฟังก์ชันหลักที่จัดการ request
- onResponse: หลังจากส่ง response กลับไปแล้ว

โค้ดตัวอย่างที่ให้มา แสดงให้เห็นวิธีการเพิ่มตะขอเข้าไปใน Fastify ผ่านเมธอด `addHook()` เพื่อให้โค้ดของเราทำงานเมื่อเหตุการณ์ที่สนใจเกิดขึ้น

การทำความเข้าใจวงจรชีวิตและตะขอต่าง ๆ ใน Fastify จะช่วยให้เราออกแบบและพัฒนาแอปพลิเคชันได้อย่างมีประสิทธิภาพ สามารถเพิ่มฟีเจอร์ ควบคุมการทำงาน และจัดการข้อผิดพลาดได้อย่างเหมาะสมในแต่ละช่วงเวลาของการทำงาน
*/
