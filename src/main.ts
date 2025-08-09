import "./style.css";
import { setupCounter } from "./counter.ts";

// Initialize the counter functionality
setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
