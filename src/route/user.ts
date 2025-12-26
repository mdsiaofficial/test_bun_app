import { res } from "../utils/res";

const users = [
  { id: 1, name: "Ashiq" },
  { id: 2, name: "Bun User" },
];


export function user_route() {

  return res(users, 201)
}
