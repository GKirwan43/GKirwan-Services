import { ServicesView } from "@/components/services/ServicesView";

// The shell renders instantly; the service list loads client-side from /api/services.
export default function Page() {
  return <ServicesView />;
}
