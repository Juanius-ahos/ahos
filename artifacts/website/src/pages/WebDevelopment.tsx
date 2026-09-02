import { ServicePageLayout } from "../components/ServicePageLayout";
import { SERVICE_PAGES } from "../data/servicePages";

export default function WebDevelopment() {
  return <ServicePageLayout {...SERVICE_PAGES["/web-development"]} />;
}
