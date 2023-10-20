import { createClient } from "@crystallize/js-api-client";
import { requireValidSession } from "~/server/session";
import { getAvailableLanguages, getItemComponents } from "./read/";

export const getApi = async (request: Request) => {
  const signatureChecked = await requireValidSession(request);
  const cookie = request.headers.get("Cookie") || "";
  const cookiePayload = cookie
    .split(";")
    .map(
      (value: string): [string, string] => value.split("=") as [string, string]
    )
    .reduce((memo: Record<string, any>, value: [string, string]) => {
      memo[decodeURIComponent(value[0]?.trim())] = decodeURIComponent(
        value[1]?.trim()
      );
      return memo;
    }, {});

  const apiClient = createClient({
    tenantId: signatureChecked.tenantId,
    tenantIdentifier: signatureChecked.tenantIdentifier,
    sessionId: cookiePayload["connect.sid"],
  });

  return {
    getAvailableLanguages: async () => getAvailableLanguages(apiClient)(),
    getItemComponents: async (
      ...params: Parameters<ReturnType<typeof getItemComponents>>
    ) => getItemComponents(apiClient)(...params),
  };
};
