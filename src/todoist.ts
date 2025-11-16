import { TodoistApi } from "@doist/todoist-api-typescript";
import { getEmojiFromTaskContent } from "./openai";

export async function addEmojiToTodoistTaskTitles() {
  const taskRegex = /^[A-Za-z0-9].+/;

  const apiKey = process.env.TODOIST_API_KEY;

  if (!apiKey) {
    throw new Error("TODOIST_API_KEY is not defined in environment variables");
  }

  const api = new TodoistApi(apiKey);

  const tasks = await api.getTasksByFilter({
    query: "#Inbox"
  });

  for (const task of tasks.results) {
    if (taskRegex.test(task.content)) {
      console.log(`Adding emoji to task: "${task.content}"`);

      const emoji = await getEmojiFromTaskContent(task.content);

      await api.updateTask(task.id, { content: `${emoji} ${task.content}` });
    }
  }
}
