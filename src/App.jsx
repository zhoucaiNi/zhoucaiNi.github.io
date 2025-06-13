import "./App.css";
import InfiniteCanvas from "./components/InfinateCanvas";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="w-full h-screen">
        <InfiniteCanvas />
      </div>
    </ThemeProvider>
  );
}

export default App;
