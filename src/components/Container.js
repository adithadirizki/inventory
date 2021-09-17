import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Container = ({ children, location }) => {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  }, [location]);

  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar show={showSidebar} onShown={(show) => setShowSidebar(show)} />
        <div
          className={`fixed ${
            !showSidebar ? "hidden" : "lg:hidden"
          } top-0 right-0 w-full h-screen z-20`}
          style={{ backgroundColor: "#00000050" }}
          onClick={() => setShowSidebar(false)}></div>

        {/* Content */}
        <div
          className={`${
            showSidebar ? "translate-x-0" : "-translate-x-1/5"
          } w-full ${showSidebar ? "lg:ml-64" : "ml-0"}`}
          style={{
            transition: "margin-left .5s ease-in-out",
          }}>
          <Navbar
            onToggleClick={(status) =>
              setShowSidebar(status === "open" ? true : false)
            }
          />
          <div className="w-full p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Container;
