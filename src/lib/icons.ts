import { CUSTOM_ICONS, LOGO_CDN, LOGO_SLUGS, LOGO_URLS } from "@/constants/icons";
import { kebabCase, normalize } from "./strings";

/** A Font Awesome icon for services with no logo, or null when a logo exists. */
export const customIcon = (name: string) => CUSTOM_ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? null;

export const logoUrl = (name: string) =>
  LOGO_URLS[normalize(name)] ?? `${LOGO_CDN}/${LOGO_SLUGS[normalize(name)] ?? kebabCase(name)}.svg`;
