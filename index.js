import OpenAI from "openai";
import readline from "readline";

const client = new OpenAI({
	apiKey: process.env.OpenAI_API_KEY,
});

const rl = readline.createInterface({
	input: process.stdin, 
	output: process .stdout,
});

const tools = JSON.parse(
	fs.readFileSync("./tools.json", "utf8")
);

const config = JSON.parse(
	fs.readFileSync("./config.json", "utf8")
);

const instructions = config.instructions;
const model = config.model;

let previousResponseId = null;

function prompt() {
	rl.question("user: ", async(input) => {
		if(input.trim().toLowerCase() === "exit") {
			rl.close();
			return;
		}

		try {
			const response = await client.responses.create({
				model,
				instructions,
				input,
				tools,
				...(previousResponseId && {
      				previous_response_id: previousResponseId, }),
				
			});
			previousResponseId = response.id;
			console.log("\nLLm:",response.output_text, "\n");
			
			} catch (error) {
				console.log(error.message);
			}
			prompt();
	});
}
prompt();
