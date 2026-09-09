import fs from "fs";
import { runAgent } from "../agent/agent.js";

const evals = JSON.parse(
	fs.readFileSync("./evals/tools-evals.json", "utf-8")
);

let passed = 0;

for (const test of evals) {
	const result = await runAgent(test.input);
	const actualTool = result.calledTools.length > 0 ? result.calledTools[0] : null;

	if(actualTool === test.expectedTool) {
		passed ++;
	} else {
		console.log("fail");
	}
}

console.log(passed, "||| passed");