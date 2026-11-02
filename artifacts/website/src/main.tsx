import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./pages/home.css";
import "./components/film/film.css";

createRoot(document.getElementById("root")!).render(<App />);
