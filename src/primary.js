import cluster from "cluster";
import os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cpuCount = os.cpus().length;

console.log(`The total number of CPUs is: ${cpuCount}`);
console.log(`Primary PID: ${process.pid}`);

if (cluster.isPrimary) {
  console.log("Primary process is running");

  // Fork workers based on the number of CPUs
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  // Handle worker exit
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} has been killed`);
    console.log("Starting another worker");
    cluster.fork();
  });
} else {
  console.log(`Worker process started with PID: ${process.pid}`);

  // Start your server logic here
  import("./server.js");
}