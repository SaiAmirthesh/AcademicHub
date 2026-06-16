import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Global fetch interceptor to automatically pass cookie credentials for cross-origin backend calls
const originalFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  let url = "";
  if (typeof input === "string") {
    url = input;
  } else if (input instanceof URL) {
    url = input.href;
  } else if (input && typeof input === "object" && "url" in input) {
    url = (input as any).url;
  }

  const isBackend = url.startsWith("http://localhost:3000");

  if (input instanceof Request) {
    if (isBackend) {
      try {
        const clonedRequest = input.clone();
        const newRequest = new Request(clonedRequest, {
          credentials: input.credentials === "omit" ? "omit" : "include",
        });
        return originalFetch(newRequest);
      } catch (err) {
        console.error("Error in fetch interceptor:", err);
      }
    }
    return originalFetch(input);
  }

  if (isBackend) {
    init = init || {};
    init.credentials = init.credentials || "include";
  }

  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
