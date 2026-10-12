import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Layout from "./layouts";
import Sidebar from "./layouts/Sidebar.jsx";
import {
  PrimaryOffcanvasButton
} from "./layouts/index.jsx";
import Brand from "./layouts/Brand.jsx";
import Home from "./pages/Home.jsx";
import Surah from "./pages/Surah.jsx";
import Ayah from "./pages/Ayah.jsx";
import Editor from "./pages/Editor.jsx";
import TajwidSettings from "./pages/TajwidSettings.jsx";
import FAQ from "./pages/Faq.jsx";
import Testimoni from "./pages/Testimoni.jsx";
import SplashScreen from "./pages/SplashScreen.jsx";

import useAndroidBackButton from "./hooks/useAndroidBackButton.jsx";

function App() {
  useAndroidBackButton();
  const [showGuide, setShowGuide] = useState(true);

  if (showGuide) {
    return <SplashScreen onFinish={() => setShowGuide(false)} />;
  }

  return (
    <Routes>
      <Route
        element={
          <>
            <header className="py-2 mb-4 position-sticky top-0 bg-body d-sm-none z-3">
              <div className="container">
                <div className="row">
                  <div className="col-12 d-flex align-items-center justify-content-between">
                    <Brand />
                    <PrimaryOffcanvasButton className="btn-dark rounded-pill text-nowrap text-uppercase">
                      <i className="bi bi-list me-2"></i>
                      Menu
                    </PrimaryOffcanvasButton>
                  </div>
                </div>
              </div>
            </header>
            <Layout
              primarySidebarContent={<Sidebar />}
            />
          </>
        }
      >
        <Route
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />

        <Route
          path="/quran"
          element={<Surah/>}
        />

        <Route path="/surahs/:nomor" element={<Ayah />} />

        <Route
          path="/tajwid"
          element={<Editor/>}
        />

        <Route path="/settings/tajwid" element={<TajwidSettings />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/testimoni" element={<Testimoni />} />
      </Route>
    </Routes>
  );
}

export default App;