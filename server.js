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
ลำดับการทำงานและตะขอวงจรชีวิตของ Fastify 
const fastify = require('fastify')();

// เพิ่ม onRoute's hook
fastify.addHook('onRoute', (routeOptions) => {
  console.log('onRoute hook executed');
});

// เพิ่ม onRegister's hook
fastify.addHook('onRegister', (registerOptions) => {
  console.log('onRegister hook executed');
});

// เพิ่ม onReady's hook
fastify.addHook('onReady', (done) => {
  console.log('onReady hook executed');
  done();
});

// ลงทะเบียน route
fastify.get('/', (request, reply) => {
  reply.send({ hello: 'world' });
});

// เริ่มต้น server
fastify.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server listening on port 3000');
});
*/
