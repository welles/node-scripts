import { TodoistApi } from "@doist/todoist-api-typescript";

const apiKey = process.env.TODOIST_API_KEY;

if (!apiKey) {
  throw new Error("TODOIST_API_KEY is not defined in environment variables");
}

const api = new TodoistApi(apiKey);

const tasks = await api.getTasks({});

console.log(tasks);
