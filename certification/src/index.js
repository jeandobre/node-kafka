// Receber mensagens do kafka
import { Kafka, logLevel, CompressionTypes } from "kafkajs";

const kafka = new Kafka({
	brokers: ["localhost:9092"],
	clientId: "certificate",
	logLevel: logLevel.NOTHING,
});

const topic = "issue-certificate";
const consumer = kafka.consumer({ groupId: "certificate-group" });

const producer = kafka.producer();

//let counter = 0;

async function run() {
	await consumer.connect();
	await consumer.subscribe({ topic });
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {

			const payload = JSON.parse(message.value);

			//counter++;

		//	setTimeout(() => {
				producer.send({
					topic: "certification-response",
					messages: [{value: `Certificado do usuário ${payload.user.id} do curso ${payload.course} gerado!`}],
					compression: CompressionTypes.GZIP
				})
	//		}, 3000);

			//const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
			//console.log(`- ${prefix} ${message.key}#${message.value}`)
		},
	})
}

run().catch(console.error);