const { Queue } = require('bullmq');

const redisOptions = {
  host: "localhost",
  port: process.env.redis_port
};

const queue = new Queue('sendReport', { connection: redisOptions });

module.exports = { redisOptions, queue };
