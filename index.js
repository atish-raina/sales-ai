import readline from "readline";
import { runAgent } from "./agent/agent.js";

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
			const result = await runAgent(input, previousResponseId);
			const response = result.response;
			previousResponseId = response.id;		
			console.log("\nLLm:",response.output_text, "\n");
		} catch (error) {
			console.log(error.message);
		}
		prompt();
	});
}
prompt();
