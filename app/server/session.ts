import type { CrystallizeSignature } from "@crystallize/js-api-client";
import { redirect } from "@remix-run/node";
import decodeCrystallizeSignature from "./decodeCrystallizeSignature";

export const requireValidSession = async (request: Request) => {
  const url = new URL(request.url);
  const signature = url.searchParams.get("crystallizeSignature") || "";
  const signaturePayload: CrystallizeSignature | null =
    signature.length > 0
      ? decodeCrystallizeSignature(signature, request.headers.get("Host")!)
      : null;

  if (!signaturePayload) {
    throw redirect("/invalid");
  }

  return signaturePayload;
};
