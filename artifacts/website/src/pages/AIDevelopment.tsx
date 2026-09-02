import { ServicePageLayout } from "../components/ServicePageLayout";
import { SERVICE_PAGES } from "../data/servicePages";

export default function AIDevelopment() {
  return <ServicePageLayout {...SERVICE_PAGES["/ai-development"]} />;
}
