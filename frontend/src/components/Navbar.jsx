import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);


  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.removeItem("token");

    setToken("");
    setCartItems({});
    setProfileOpen(false);
    setVisible(false);

    navigate("/login");
  };

  // ---------------- NAVLINK STYLE ----------------
  const navLinkStyle = ({ isActive }) =>
    `relative flex flex-col items-center gap-1 transition-all duration-300
     ${isActive ? "text-black" : "text-gray-700 hover:text-black"}`;

  return (
    <div className="relative flex items-center justify-between py-5 font-medium">
      {/* ================= LOGO ================= */}
      <Link
        to="/"
        className="transition-transform duration-300 hover:scale-[1.02]"
      >
        <img src={assets.logo} className="w-36 sm:w-36" alt="Forever" />
      </Link>

      {/* ================= DESKTOP NAVIGATION ================= */}
      <ul className="hidden sm:flex items-center gap-5 text-sm">
        <NavLink to="/" className={navLinkStyle}>
          {({ isActive }) => (
            <>
              <p>HOME</p>

              <span
                className={`h-[1.5px] bg-black transition-all duration-300 ${
                  isActive ? "w-1/2" : "w-0"
                }`}
              ></span>
            </>
          )}
        </NavLink>

        <NavLink to="/collection" className={navLinkStyle}>
          {({ isActive }) => (
            <>
              <p>COLLECTION</p>

              <span
                className={`h-[1.5px] bg-black transition-all duration-300 ${
                  isActive ? "w-1/2" : "w-0"
                }`}
              ></span>
            </>
          )}
        </NavLink>

        <NavLink to="/about" className={navLinkStyle}>
          {({ isActive }) => (
            <>
              <p>ABOUT</p>

              <span
                className={`h-[1.5px] bg-black transition-all duration-300 ${
                  isActive ? "w-1/2" : "w-0"
                }`}
              ></span>
            </>
          )}
        </NavLink>

        <NavLink to="/contact" className={navLinkStyle}>
          {({ isActive }) => (
            <>
              <p>CONTACT</p>

              <span
                className={`h-[1.5px] bg-black transition-all duration-300 ${
                  isActive ? "w-1/2" : "w-0"
                }`}
              ></span>
            </>
          )}
        </NavLink>
      </ul>

      {/* ================= RIGHT SIDE ICONS ================= */}
      <div className="flex items-center gap-5 sm:gap-6">
        {/* SEARCH */}
        <button
          type="button"
          onClick={() => setShowSearch(true)}
          className="group"
          aria-label="Search"
        >
          <img
            src={assets.search_icon}
            className="w-5 cursor-pointer transition-all duration-300 group-hover:scale-110"
            alt="Search"
          />
        </button>

        {/* ================= PROFILE ================= */}
        <div
          className="relative"
          onMouseEnter={() => token && setProfileOpen(true)}
          onMouseLeave={() => token && setProfileOpen(false)}
        >
          {/* PROFILE ICON */}
          <button
            type="button"
            onClick={() => {
              if (token) {
                setProfileOpen((prev) => !prev);
              } else {
                navigate("/login");
              }
            }}
            className="group"
            aria-label="Profile"
          >
            <img
              src={assets.profile_icon}
              className={`w-5 cursor-pointer transition-all duration-300
                ${profileOpen ? "scale-110" : "group-hover:scale-110"}`}
              alt="Profile"
            />
          </button>

          {/* PROFILE DROPDOWN */}
          {token && (
            <div
              className={`absolute right-0 top-full z-50 pt-3 transition-all duration-200 ${
                profileOpen
                  ? "visible opacity-100 translate-y-0"
                  : "invisible opacity-0 -translate-y-2"
              }`}
            >
              <div className="w-44 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                {/* PROFILE HEADER */}
                <div className="border-b border-gray-100 px-5 py-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    My Account
                  </p>
                </div>

                {/* MY PROFILE */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center px-5 py-3 text-left text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:pl-6 hover:text-black"
                >
                  My Profile
                </button>

                {/* ORDERS */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/orders");
                  }}
                  className="flex w-full items-center px-5 py-3 text-left text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:pl-6 hover:text-black"
                >
                  Orders
                </button>

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center border-t border-gray-100 px-5 py-3 text-left text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:pl-6 hover:text-black"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= CART ================= */}
        <Link to="/cart" className="group relative" aria-label="Shopping Cart">
          <img
            src={assets.cart_icon}
            className="w-5 min-w-5 transition-all duration-300 group-hover:scale-110"
            alt="Cart"
          />

          {/* CART COUNT */}
          {getCartCount() > 0 && (
            <span
              className="absolute -right-2 -bottom-2 flex h-4 min-w-4
              items-center justify-center rounded-full bg-black px-1
              text-[8px] leading-none text-white transition-all duration-300
              group-hover:scale-110"
            >
              {getCartCount()}
            </span>
          )}
        </Link>

        {/* ================= MOBILE MENU ICON ================= */}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="sm:hidden"
          aria-label="Open menu"
        >
          <img
            src={assets.menu_icon}
            className="w-5 cursor-pointer transition-transform duration-300 hover:scale-110"
            alt="Menu"
          />
        </button>
      </div>

      {/* ================================================= */}
      {/* MOBILE SIDEBAR */}
      {/* ================================================= */}

      <div
        className={`fixed inset-0 z-[100] bg-white transition-all duration-300 sm:hidden ${
          visible
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0"
        }`}
      >
        {/* MOBILE HEADER */}
        <div className="flex items-center justify-between border-b px-5 py-5">
          <Link to="/" onClick={() => setVisible(false)}>
            <img src={assets.logo} className="w-32" alt="Forever" />
          </Link>

          <button
            type="button"
            onClick={() => setVisible(false)}
            className="text-2xl font-light text-gray-600 transition-transform duration-300 hover:rotate-90 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        <div className="flex flex-col px-5 py-6">
          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) =>
              `border-b py-4 text-sm transition-all duration-300 ${
                isActive
                  ? "pl-2 text-black"
                  : "text-gray-600 hover:pl-2 hover:text-black"
              }`
            }
            to="/"
          >
            HOME
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) =>
              `border-b py-4 text-sm transition-all duration-300 ${
                isActive
                  ? "pl-2 text-black"
                  : "text-gray-600 hover:pl-2 hover:text-black"
              }`
            }
            to="/collection"
          >
            COLLECTION
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) =>
              `border-b py-4 text-sm transition-all duration-300 ${
                isActive
                  ? "pl-2 text-black"
                  : "text-gray-600 hover:pl-2 hover:text-black"
              }`
            }
            to="/about"
          >
            ABOUT
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) =>
              `border-b py-4 text-sm transition-all duration-300 ${
                isActive
                  ? "pl-2 text-black"
                  : "text-gray-600 hover:pl-2 hover:text-black"
              }`
            }
            to="/contact"
          >
            CONTACT
          </NavLink>

          {/* MOBILE ACCOUNT OPTIONS */}
          {token && (
            <div className="mt-6 border-t pt-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-gray-400">
                My Account
              </p>

              <button
                type="button"
                onClick={() => {
                  setVisible(false);
                  navigate("/profile");
                }}
                className="block w-full border-b py-3 text-left text-sm text-gray-600 transition-all hover:pl-2 hover:text-black"
              >
                My Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setVisible(false);
                  navigate("/orders");
                }}
                className="block w-full border-b py-3 text-left text-sm text-gray-600 transition-all hover:pl-2 hover:text-black"
              >
                Orders
              </button>

              <button
                type="button"
                onClick={logout}
                className="block w-full py-3 text-left text-sm text-gray-600 transition-all hover:pl-2 hover:text-black"
              >
                Logout
              </button>
            </div>
          )}

          {/* LOGIN FOR MOBILE */}
          {!token && (
            <button
              type="button"
              onClick={() => {
                setVisible(false);
                navigate("/login");
              }}
              className="mt-6 border border-black px-5 py-3 text-sm transition-all duration-300 hover:bg-black hover:text-white"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
