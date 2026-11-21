import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { categoryById } from "@/constants/categories";
import { customIcon, logoUrl } from "@/lib/icons";
import type { Service } from "@/types/service";

/** The app's logo, falling back to its category icon when no logo exists. */
export function ServiceIcon({ service }: { service: Service }) {
  const [failed, setFailed] = useState(false);
  const custom = customIcon(service.name);

  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-edge bg-surface-2">
      {custom || failed ? (
        <FontAwesomeIcon icon={custom ?? categoryById(service.categoryId).icon} className="text-lg text-muted" />
      ) : (
        <Image src={logoUrl(service.name)} alt="" width={26} height={26} unoptimized onError={() => setFailed(true)} />
      )}
    </div>
  );
}
