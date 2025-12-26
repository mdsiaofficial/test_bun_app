import bycrptjs from "bcryptjs";
import { health_route } from "./route/health";
import { user_route } from "./route/user";
import { not_found } from "./route/not_found";
import { root } from "./route/root";


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
  fetch(req) {

    const url = new URL(req.url);
    if (url.pathname === "/" && req.method === "GET") {
      return root();
    }
    if (url.pathname === "/health" && req.method === "GET") {
      return health_route();
    }
    if (url.pathname === "/user" && req.method === "GET") {
      return user_route();
    }

    // return new Response(
    //   JSON.stringify({ message: "Hello from Bun server! Learning is amazing" }),
    //   { headers: { "Content-Type": "application/json" } }
    // );

    return not_found();

  },  
});
console.log(`Server running on http://localhost:${server.port}`);
// console.log("what is there under server: ", server);
