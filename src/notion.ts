import {
  Client,
  DataSourceObjectResponse,
  PageObjectResponse,
} from "@notionhq/client";
import { getEmojiFromTitle } from "./openai";

export async function getNotionIdeas(): Promise<void> {
  const dataSourceId = await findNotionDataSourceId("Ideen");

  const entries = await getDataSourceEntries(dataSourceId);

  const entriesWithoutIcon = entries.filter((entry) => !entry.icon);

  for (const page of entriesWithoutIcon) {
    const title = getPageTitle(page);

    const emoji = await getEmojiFromTitle(title, "💡");

    console.log(title, emoji);
  }

  console.log(entriesWithoutIcon);
}

async function getDataSourceEntries(
  dataSourceId: string,
): Promise<PageObjectResponse[]> {
  const notion = getNotionClient();

  let next_cursor: string | undefined = undefined;
  let has_more = false;

  const result: PageObjectResponse[] = [];

  do {
    const data = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: has_more ? next_cursor : undefined,
    });

    result.push(...(data.results as PageObjectResponse[]));
    has_more = data.has_more;
    next_cursor = data.next_cursor ?? undefined;
  } while (has_more);

  return result;
}

function getNotionClient(): Client {
  const apiKey = process.env.NOTION_API_KEY;

  if (!apiKey) {
    throw new Error("NOTION_API_KEY is not defined in environment variables");
  }

  return new Client({
    auth: apiKey,
  });
}

async function findNotionDataSourceId(dataSourceName: string): Promise<string> {
  const notion = getNotionClient();

  const result = await notion.search({
    query: dataSourceName,
    filter: { property: "object", value: "data_source" },
  });

  if (result.results.length === 0) {
    throw new Error(`Data source with name "${dataSourceName}" not found`);
  }

  const dataSource = result.results[0] as DataSourceObjectResponse;

  return dataSource.id;
}

function getPageTitle(page: PageObjectResponse): string {
  for (const propName in page.properties) {
    const prop = page.properties[propName];
    if (prop.type === "title") {
      return prop.title.map((t) => t.plain_text).join("");
    }
  }
  return "";
}
