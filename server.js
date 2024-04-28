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
นั่นหมายความว่า Server จะรับฟัง Request จากทุก Network Interface บนเครื่อง ซึ่งรวมถึงการเข้าถึงจากเครือข่ายภายนอกด้วย

การกำหนดค่า Host เป็น `'0.0.0.0'` ในขณะพัฒนาบน Local Environment อาจมีประโยชน์ในกรณีที่:
- เราต้องการทดสอบแอปพลิเคชันจากเครื่องอื่นในเครือข่ายเดียวกัน เช่น ทดสอบบนมือถือหรืออุปกรณ์อื่นๆ
- เรากำลังพัฒนาแอปพลิเคชันที่รันใน Docker Container บน Local Machine ซึ่งต้องการให้เข้าถึงได้จากเครือข่ายภายนอก Container

ดังนั้น การตัดสินใจกำหนดหรือไม่กำหนดค่า Host และจะกำหนดเป็นค่าใดนั้น ขึ้นอยู่กับความต้องการและกรณีการใช้งานของเราในขณะที่พัฒนาบน Local Environment เป็นหลัก ทั้งนี้ การกำหนดหรือไม่กำหนดค่า Host ไม่ได้ส่งผลต่อการทำงานของแอปพลิเคชันแต่อย่างใด แต่เป็นเรื่องของการควบคุมการเข้าถึง Server จากเครือข่ายภายในและภายนอกเท่านั้น

docker run -p 8080:3000 my-fastify-app
ในกรณีนี้ Port 8080 ของ Host Machine จะถูก Map ไปยัง Port 3000 ของ Container ซึ่งหมายความว่าแอปพลิเคชัน Fastify ใน Container ยังคงรับ Request ที่ Port 3000 เหมือนเดิม แต่ Request จากเครือข่ายภายนอกจะต้องเข้ามาที่ Port 8080 ของ Host Machine แทน
*/
