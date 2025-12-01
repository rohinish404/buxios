import buxios from "@/index.ts";

const api = buxios.create({
  baseURL: "https://dummyjson.com/",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

api.addRequestInterceptors(
  function (config) {
    console.log("intercepting the request...", config);
    return config;
  },
  function (err) {
    return Promise.reject(err);
  },
);

api.addResponseInterceptors(
  function (response) {
    console.log("response recieved", response.status);
    return response;
  },
  function (err) {
    return Promise.reject(err);
  },
);

async function main() {
  const response = await api.get("/todos");
  const data = await response.json();
  console.log(data);
}
main();
