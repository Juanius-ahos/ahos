import { ServicePageLayout } from "../components/ServicePageLayout";
import { SERVICE_PAGES } from "../data/servicePages";

export default function CustomSoftware() {
  return <ServicePageLayout {...SERVICE_PAGES["/custom-software"]} />;
}
