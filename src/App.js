import Contexts from "./Contexts";
import SquareGrid from "./Square Grid Box/SquareGrid";
import { Route, Routes } from "react-router-dom";
import HowToPlay from "./AboutGame/HowToPlay";
import VerticallyCenteredModal from "./StartDialog/index";
import NewNavbar2 from "./NewNavbar/AboutNavbar";
import NewNavbar from "./NewNavbar/NewNavbar";
import Auth from "./Auth/index";
import "./App.css"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Contexts>
              <NewNavbar />
              <VerticallyCenteredModal />
              <SquareGrid />
            </Contexts>
          }
        />
        <Route
          path="/aboutgame"
          element={
            <Contexts>
              <NewNavbar2 />
              <HowToPlay />
            </Contexts>
          }
        />
        <Route
          path="/signIn"
          element={
            <Contexts>
              <Auth />
            </Contexts>
          }
        />
      </Routes>
    </div>
  );
}
export default App;
