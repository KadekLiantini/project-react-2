import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PokeProject from "../src/components/test";
import PokemonDetail from "../src/components/PokemonDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PokeProject />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
