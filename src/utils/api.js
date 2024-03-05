import { query } from "@/lib/database";

export const api = async ({ command, values = [] }) => {
  try {
    const response = await query({
      query: command,
      values: values,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
