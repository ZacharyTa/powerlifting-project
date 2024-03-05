import { query } from "@/lib/database";

export const api = async ({ command, values = [] }) => {
  const response = await query({
    query: command,
    values: values,
  });
  return response;
};
