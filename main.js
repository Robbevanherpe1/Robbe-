import { produceAST } from "./frontend/parser.js";
import readline from 'readline';

// Create readline interface for input and output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\nRepl v0.1");

// Function to start the REPL
function repl() {
  rl.question(">", (input) => {
    if (input === "exit") {
      console.log("Exiting REPL...");
      rl.close(); // Close the readline interface
      process.exit(0); // Exit the process
    } else {
      try {
        const program = produceAST(input);
        console.log(program);
      } catch (error) {
        console.error("Error processing input:", error.message);
      }
      repl(); // Recursively call repl to continue the loop
    }
  });
}

repl(); // Start the REPL
