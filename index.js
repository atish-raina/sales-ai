import OpenAI from "openai";
import readline from "readline";

const client = new OpenAI({
	apiKey: process.env.OpenAI_API_KEY,
});

const rl = readline.createInterface({
	input: process.stdin, 
	output: process .stdout,
});


rl.question("user: ", async(input) => {
	try {
		const response = await client.responses.create({
			model: "gpt-5.6",
			input: "what is a docker image",
			instructions: `
				You are a Sales AI assistant.

				You may ONLY answer questions related to:
				- sales
				- lead generation
				- prospecting
				- cold outreach
				- sales emails
				- sales calls
				- objections
				- qualification
				- CRM
				- sales pipelines
				- account management
				- closing deals
				- sales strategy

				If the user asks anything outside sales, reply exactly:

				"I can only help with sales-related questions."

				Do not answer general knowledge, coding, politics, entertainment,
				personal advice, medical, legal, or other non-sales questions.`,
				
				input: input,
			});
		}	
	})


console.log(response.output_text);