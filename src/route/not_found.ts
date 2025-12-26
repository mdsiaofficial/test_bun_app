export function not_found() {
  return new Response(
    JSON.stringify({ error: "Route not found" }),
    { status: 404, headers: { "Content-Type": "application/json" } }
  );
}
