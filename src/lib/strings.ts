/** Lowercase letters and digits only, for loose lookups: "Proxmox VE" -> "proxmoxve". */
export const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/** "Proxmox VE" -> "proxmox-ve" */
export const kebabCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
