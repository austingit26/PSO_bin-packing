import { Route, Routes } from "react-router-dom";
import "./App.css";
import AddBinSize from "./components/AddBinSize";
import AddItem from "./components/AddItem";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import ResultingBins from "./components/ResultingBins";

export default function App() {
  return (
    <div className="flex flex-col bg-neutral-100 dark:bg-neutral-800 dark:text-slate-100 min-h-screen min-w-screen">
      <Nav />
      <main className="flex-grow flex justify-center items-center">
        <Routes>
          <Route path="/" element={<AddBinSize />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/resulting-bins" element={<ResultingBins />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
