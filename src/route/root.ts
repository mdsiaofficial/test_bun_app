import { res } from "../utils/res";

export function root() {
    return res({ message: "Hello from Bun server! Learning is amazing" }, 200)
}
