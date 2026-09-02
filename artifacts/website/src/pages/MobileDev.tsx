import { ServicePageLayout } from "../components/ServicePageLayout";
import { SERVICE_PAGES } from "../data/servicePages";

export default function MobileDev() {
  return <ServicePageLayout {...SERVICE_PAGES["/mobile-app-development"]} />;
}
