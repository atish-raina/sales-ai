import OpenAI from "openai";
import readline from "readline";

const client = new OpenAI({
	apiKey: process.env.OpenAI_API_KEY,
});

const tools = JSON.parse(
	fs.readFileSync("./tools.json", "utf8")
	);

const config = JSON.parse(
	fs.readFileSync("./config.json", "utf8")
);

const rl = readline.createInterface({
	input: process.stdin, 
	output: process .stdout,
});



let previousResponseId = null;

function prompt() {
	rl.question("user: ", async(input) => {
		if(input.trim().toLowerCase() === "exit") {
			rl.close();
			return;
		}

		try {
			const response = await client.responses.create({
				model: "gpt-5.6",
				...(previousResponseId && {
      				previous_response_id: previousResponseId,
    			}),
				instructions: config.instructions,
				input,
				tools,
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



