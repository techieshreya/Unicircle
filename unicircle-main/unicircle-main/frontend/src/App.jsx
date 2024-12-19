import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import { MyNavbar } from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Store, { Section1, Section2, Section3 } from "./components/store/Store";

function App() {
  return (
    <>
      <BrowserRouter>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/store" element={<Store />}>
            <Route path="sell" element={<Section1 />} />
            <Route path="buy" element={<Section2 />} />
            <Route path="rent" element={<Section3 />} />
          </Route>
          <Route
            path="*"
            element={
              <h1 className="text-center h-60 m-20 font-dm-serif text-6xl text-gray-800">
                404 Not Found!
              </h1>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
