import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
	apiKey: process.env.OpenAI_API_KEY,
});

const tools = JSON.parse(
	fs.readFileSync("./tools/tools.json", "utf8")
);

const config = JSON.parse(
	fs.readFileSync("./config.json", "utf8")
);

const prices = JSON.parse(
	fs.readFileSync("./db/prices.json")
);

const leads = JSON.parse(
	fs.readFileSync("./db/leads.json")
);

const instructions = config.instructions;
const model = config.model;

function getProductPrice({product}) {
	return {
		product,
		price: prices[product],
		currency: "USD",
	};
}

function getLeadStatus({email}) {
	return {
		email,
		status: leads[email.toLowerCase()] || "not found",
	}
}

const toolFunctions = {
	get_product_price: getProductPrice,
	get_lead_status: getLeadStatus,
}

export async function runAgent(userInput, previousResponseId = null) {
	let response = await client.responses.create({
		model,
		instructions,
		tools,
		input: userInput,
		...(previousResponseId && {
				previous_response_id: previousResponseId, }),
				
	});

	while(true) {
		const toolCalls = response.output.filter(
			item => item.type === "function_call"
		)

		if (toolCalls.length === 0) {
			break;
		}

		const toolOutputs = [];

		for(const call of toolCalls) {
			const args = JSON.parse(call.arguments);
			const fn = toolFunctions[call.name];

			if(!fn) {
				throw new Error(
					`Unknown tool: ${call.name}`
				)
			}

			const result = await fn(args);
			console.log("Tool output: ", result);

			toolOutputs.push({
				type: "function_call_output",
				call_id: call.call_id,
				output: JSON.stringify(result),
			})
		}

		response = await runAgent(toolOutputs, response.id);

	}

	return response;
}