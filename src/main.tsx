
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { toast } from "sonner";

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  toast.error(`An unexpected error occurred: ${event.error?.message || 'Unknown error'}`);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  toast.error(`Promise error: ${event.reason?.message || 'Unknown error'}`);
});

// Create root and render app
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
