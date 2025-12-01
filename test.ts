import buxios from "@/index.ts";

const api = buxios.create({
  baseURL: "https://dummyjson.com/",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

async function main() {
  const response = await api.get("/todos", {
    timeout: 5,
  });
  const data = await response.json();
  console.log(data);
}
main();
