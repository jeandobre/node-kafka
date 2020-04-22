import express from "express";
import { Kafka, logLevel } from "kafkajs";
import routes from "./routes";

const app = express();

const kafka = new Kafka({
	clientId: "api",
	brokers: ["localhost:9092"],
	logLevel: logLevel.NOTHING,
	retry: {
		initialRetryTime: 300,
		retries: 10
	}
});

const topic = "certification-response";
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "certificate-group-receiver" });

/**
 * Disponibiliza o producer para todas as rotas
 */
app.use((req, res, next) => {
	req.producer = producer;
	req.consumer = consumer;

	return next();
})

app.use(routes);

async function run(){
	await producer.connect();
	await consumer.connect();
	await consumer.subscribe({ topic });

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			
			console.log(`${message.value}`);
		},
	})


	app.listen(3333);
}

run().catch(console.error);
