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

const app = fastify(serverOptions);

// เพิ่ม onRoute's hook
app.addHook("onRoute", buildHook("root"));

// เพิ่ม onRegister's hook
// app.addHook("onRegister", (registerOptions) => {
//   console.log("onRegister hook executed");
// });

// เพิ่ม onReady's hook
// app.addHook("onReady", (done) => {
//   console.log("onReady hook executed");
//   done();
// });

// โหลดแอปพลิเคชันโดยไม่ต้องรอฟังคำขอ HTTP
// app.ready().then(() => {
//   console.log("Application is ready!");
// });

/* 
app.register เป็นวิธีการเพิ่ม plugin เข้าไปใน Fastify application โดยจะถูกเรียกใช้ในช่วง application startup ก่อนที่ server จะเริ่มรับ request
เกี่ยวกับลำดับการทำงานของ `fastify.addHook()` และ `fastify.register()`:

1. ลำดับการทำงานขึ้นอยู่กับลำดับที่เขียนในโค้ด
2. `fastify.addHook()` ที่เรียกก่อน `fastify.register()` จะถูกเพิ่มและเรียกใช้ก่อน
3. `fastify.register()` จะลงทะเบียนและเรียกใช้ plugin ตามลำดับ ภายใน plugin ก็สามารถเพิ่ม hook ได้ด้วย `fastify.addHook()`
4. `fastify.addHook()` ที่เรียกหลัง `fastify.register()` จะถูกเพิ่มและเรียกใช้หลังสุด
5. Hook ที่เพิ่มภายใน plugin จะถูกเรียกใช้เฉพาะกับ route ที่อยู่ใน plugin นั้นเท่านั้น
6. Hook ที่เพิ่มนอก plugin จะถูกเรียกใช้กับทุก route รวมถึง route ที่อยู่ใน plugin ด้วย

ดังนั้น ลำดับการทำงานจะเป็น:
1. `fastify.addHook()` ก่อน `fastify.register()`
2. `fastify.register()` และ `fastify.addHook()` ภายใน plugin
3. `fastify.addHook()` หลัง `fastify.register()`
*/

app.register(async function pluginOne(pluginInstance, opts) {
  pluginInstance.addHook("onRoute", buildHook("pluginOne")); // [2]
  pluginInstance.get("/one", async () => "one");
});

app.register(async function pluginTwo(pluginInstance, opts) {
  pluginInstance.addHook("onRoute", buildHook("pluginTwo")); // [3]
  pluginInstance.get("/two", async () => "two");

  pluginInstance.register(async function pluginThree(subPlugin, opts) {
    subPlugin.addHook("onRoute", buildHook("pluginThree")); // [4]
    subPlugin.get("/three", async () => "three");
  });
});

function buildHook(id) {
  return function hook(routeOptions) {
    console.log(`onRoute ${id} called from ${routeOptions.path}`);
  };
}

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
