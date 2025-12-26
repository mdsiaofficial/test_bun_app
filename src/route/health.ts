import { res } from "../utils/res";

export function health_route() {

    const data = {
        status: "ok",
        timestamp: Date.now(),
    }

    // ! customize
    return res(data, 200);

    // ! traditional response
    // return new Response(
    //     JSON.stringify({
    //         status: "ok",
    //         timestamp: Date.now(),
    //     }),
    //     {
    //         headers: { "Content-Type": "application/json" },
    //     }
    // );

}
