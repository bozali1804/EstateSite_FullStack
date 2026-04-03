import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Sale from "./pages/Sale";
import Rent from "./pages/Rent";
import Land from "./pages/Land";
import Office from "./pages/Office";
import AddListing from "./pages/AddListing";
import Login from "./pages/Login";
import PropertyDetail from "./pages/PropertyDetail";
import IlanVer from "./pages/IlanVer";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/land" element={<Land />} />
          <Route path="/office" element={<Office />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ilan-ver" element={<IlanVer />} />
          <Route path="/search" element={<SearchResults />} />
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

      <Footer />
    </div>
  );
}

export default App;
