import express from "express";
import { CompressionTypes } from "kafkajs";

const routes = new express.Router();

routes.post("/certifications", async (req, res) => {
		//chamar micro-serviço
		/*
		message: {
			key?
			value Buffer | string | null
			partition?
			headers?
			timestamp?
		}*/

		const message1 = JSON.stringify({
			user: { id: 1, name: "Jean Alexandre"},
			course: "Kafka com Node.js",
			grade: 10
		});

		const message2 = JSON.stringify({
			user: { id: 2, name: "Outro usuário"},
			course: "Kafka com Node.js",
			grade: 5
		});

		await req.producer.send({
			topic: "issue-certificate",
			messages: [{ value: message1 }, { value: message2 }],
			//acks, Number
			//timeout, Number
			compression: CompressionTypes.GZIP
		})//.then(console.log)
		.catch(e => console.error(`[example/producer] ${e.message}`, e))

	return res.json({ ok: true})

});

export default routes;