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
Path Parameter ใน Fastify:

Path Parameter ใช้สำหรับกำหนดค่าที่เปลี่ยนแปลงได้ใน URL ของ route โดยใช้เครื่องหมายโคลอน (:) ตามด้วยชื่อพารามิเตอร์ เช่น `/user/:id`

เมื่อมีการเรียก route ที่ตรงกับ path parameter ค่าที่ส่งมาจะถูกเก็บไว้ในออบเจ็กต์ `request.params` โดยใช้ชื่อพารามิเตอร์เป็น key เช่น `request.params.id`

Fastify รองรับการใช้ Regular Expression กับ path parameter ด้วย เพื่อจำกัดค่าที่ยอมรับ โดยเขียน RegEx ไว้ในวงเล็บต่อท้ายชื่อพารามิเตอร์ เช่น `/user/:id(\\d+)` จะยอมรับเฉพาะ id ที่เป็นตัวเลขเท่านั้น

ตัวอย่างโค้ด:

```javascript
// GET /user/:id
app.get('/user/:id', (request, reply) => {
  const userId = request.params.id
  // ค้นหา user ด้วย userId
})

// GET /user/:id(\\d+)
app.get('/user/:id(\\d+)', (request, reply) => {
  const userId = Number(request.params.id)
  // ค้นหา user ด้วย userId ที่เป็นตัวเลข
})
```

หากค่าที่ส่งมาไม่ตรงกับ path parameter หรือ regular expression จะเกิด 404 Not Found ขึ้น

ไม่ควรใช้ regular expression กับ path parameter มากเกินไป เพราะอาจส่งผลต่อประสิทธิภาพ และทำให้เกิด 404 ได้บ่อยขึ้น แนะนำให้ใช้ Fastify Validation ในการตรวจสอบค่าพารามิเตอร์แทน
*/

const cats = [
  { name: "Fluffy", age: 3 },
  { name: "Whiskers", age: 5 },
  { name: "Mittens", age: 2 },
];

// POST /cat
app.post("/cat", function (request, reply) {
  const { name, age } = request.body;
  const newCat = { name, age };
  cats.push(newCat);
  reply.code(201).send(newCat);
});

// GET /cat/:catName
app.get("/cat/:catName", function (request, reply) {
  const lookingFor = request.params.catName;
  const result = cats.find((cat) => cat.name === lookingFor);
  if (result) {
    return { cat: result };
  } else {
    reply.code(404);
    throw new Error(`cat ${lookingFor} not found`);
  }
});

// GET /cat/:catIndex(\\d+)
app.get("/cat/:catIndex(\\d+)", function (request, reply) {
  const catIndex = Number(request.params.catIndex);
  const result = cats[catIndex];
  if (result) {
    return { cat: result };
  } else {
    reply.code(404);
    throw new Error(`cat at index ${catIndex} not found`);
  }
});

// GET /cat/*
// app.get("/cat/*", function (request, reply) {
//   reply.send({ allCats: cats });
// });

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
