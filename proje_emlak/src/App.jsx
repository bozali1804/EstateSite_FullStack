import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Sale from "./pages/Sale";
import Rent from "./pages/Rent";
import Land from "./pages/Land";
import Office from "./pages/Office";
import AddListing from "./pages/AddListing";
import Login from "./pages/Login";
import PropertyDetail from "./pages/PropertyDetail";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/land" element={<Land />} />
          <Route path="/office" element={<Office />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/add-listing"
            element={
              <ProtectedRoute>
                <AddListing />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
