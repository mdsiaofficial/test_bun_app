
// ! Basic “Node-style” app (HTTP server)
// import http from "http";

// const PORT = 3000;
// const server = http.createServer((req, res) => {
//     res.writeHead(
//         200, //? this is status code
//         {
//             //? header things like cookies content type or others 
//             "Content-Type": "application/json"
//         }
//     );

//     //? content to show
//     res.end(JSON.stringify({ message: "Hello from Bun!" }));
// });

// //? start server 
// server.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


// ! Bun’s native server (faster, simpler)
const server = Bun.serve({
  port: 3000,
  development: false,
  fetch() {
    return new Response(
      JSON.stringify({ message: "Hello from Bun serverrr!" }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
});
console.log(`Server running on http://localhost:${server.port}`);
console.log("what is there under server: ", server);
