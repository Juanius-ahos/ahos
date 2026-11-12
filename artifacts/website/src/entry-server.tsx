import { renderToString } from "react-dom/server";
import App from "./App";

export { routes, site, services, caseStudies, projects, faqCategories, homeFaq, pricing, routeFor, money, process } from "./site.config";

export function render(path: string) {
  return renderToString(<App ssrPath={path} />);
}
