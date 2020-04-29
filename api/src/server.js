import express from 'express';
import { Kafka } from 'kafkajs';

import routes from './routes';

const app = express();

/**
 * Conexão com o Kafka
 */
const kafka = new Kafka({
  clientId: 'api-service',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'certificate-group-receiver' });

/**
 * Disponibiliza o producer para as rotas
 */
app.use((req, res, next) => {
  req.producer = producer;

  return next();
});

/**
 * Cadastra as rotas da aplicação
 */
app.use(routes);

async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: 'certification-response' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Resposta', message.value.toString()  );
    }
  });

  app.listen(3333);
}

run().catch(console.error)

