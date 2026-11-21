import "server-only";
import type { ServicesResponse } from "@/types/service";
import { PLACEHOLDER_SERVICES } from "./placeholders";

/** Placeholder data only for now: the fake list when SHOW_PLACEHOLDER_SERVICES=true, otherwise nothing. */
export async function getServices(): Promise<ServicesResponse> {
  return { services: process.env.SHOW_PLACEHOLDER_SERVICES === "true" ? PLACEHOLDER_SERVICES : [] };
}
