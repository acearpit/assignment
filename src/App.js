import { Navigate, Route, Routes } from "react-router";
import Styles from "./App.module.css";
import { Events } from "./Events";

function App() {
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.headings}>
        <h1>EVENTS & NEWS</h1>
        <h3>Learn, Compete & Grow</h3>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/events?event_category=ALL_EVENTS&event_sub_category=Upcoming&page=1" />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </div>
  );
}

export default App;
