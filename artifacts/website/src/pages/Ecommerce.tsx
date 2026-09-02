import { ServicePageLayout } from "../components/ServicePageLayout";
import { SERVICE_PAGES } from "../data/servicePages";

export default function Ecommerce() {
  return <ServicePageLayout {...SERVICE_PAGES["/ecommerce-development"]} />;
}
