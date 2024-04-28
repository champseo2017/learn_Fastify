const fastify = require("fastify")();

fastify.get("/", (request, reply) => {
  reply.send({ hello: "world" });
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
  }
  console.log(`Server listening at ${address}`);
});
