import buxios from "@/index.ts";

const api = buxios.create({
  baseURL: "http://localhost:3000",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

async function main() {
  const response = await api.get("/todos");
  const data = await response.json();
  console.log(data);
}
