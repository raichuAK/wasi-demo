const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const bytes = fs.readFileSync('../target/wasm32-unknown-unknown/release/hello_world_rust_wasm.wasm');
let index = 0;
let timesCalled = 0;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  if(index%2 !=0 ) {
  add_one().then((val) => {
    res.end(`You have called ${val} times`);
  })
}
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const add_one = async () => {
    // Instantiate the Wasm module with an implicit compilation step.
    const { instance, module } = await WebAssembly.instantiate(bytes);
    const newVal = instance.exports.add_one(timesCalled);
    timesCalled = newVal;
    return newVal;
};
