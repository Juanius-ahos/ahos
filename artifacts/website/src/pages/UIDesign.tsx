import { ServicePageLayout } from "../components/ServicePageLayout";
import { SERVICE_PAGES } from "../data/servicePages";

export default function UIDesign() {
  return <ServicePageLayout {...SERVICE_PAGES["/ui-ux-design"]} />;
}
