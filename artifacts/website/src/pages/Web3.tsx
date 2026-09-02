import { ServicePageLayout } from "../components/ServicePageLayout";
import { SERVICE_PAGES } from "../data/servicePages";

export default function Web3() {
  return <ServicePageLayout {...SERVICE_PAGES["/web3"]} />;
}
