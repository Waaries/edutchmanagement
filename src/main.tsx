
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the root and render the app
const renderApp = () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
};

// Render the app
renderApp();
