import { useState } from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../composants/logout";

export default function Usidebar() {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Supprime tokens côté client et appelle /logout/ si tu le souhaites
    window.location.href = "/"; // Redirection après déconnexion
  };

  return (
    <>
      {/* Bouton menu mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50
          bg-[#EAEAEA] p-2 rounded-xl
          shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`mt-8 ml-4
          fixed top-16 left-0 z-40
          h-[calc(100vh-4rem)]
          w-64
          bg-[#EAEAEA]
          p-6
          transition-transform duration-300
          shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff]
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          rounded-xl
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <span className="font-bold text-lg text-gray-800">MEDD</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          <SidebarItem icon={<HomeIcon />} label="Accueil" to="/Agents/dashboard-agent" />
          <SidebarItem icon={<BriefcaseIcon />} label="Missions" to="/Missions/classique" />
          
          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl
                       bg-[#EAEAEA] text-gray-700 shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff]
                       hover:shadow-[8px_8px_12px_#c5c5c5,-8px_-8px_12px_#ffffff]
                       font-medium"
          >
            <LogOut /> Déconnexion
          </button>
        </nav>
      </aside>
    </>
  );
}

/* ====== Item ====== */
function SidebarItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl
        font-medium transition
        ${
          isActive
            ? "bg-[#EAEAEA] text-gray-900 shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]"
            : "bg-[#EAEAEA] text-gray-700 shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff]"
        }
        hover:shadow-[8px_8px_12px_#c5c5c5,-8px_-8px_12px_#ffffff]
      `}
    >
      <span>{icon}</span>
      {label}
    </NavLink>
  );
}

/* ====== Icons ====== */
function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h4m10-11v10a1 1 0 01-1 1h-4" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m-9 4h12l1 10H5l1-10z" />
    </svg>
  );
}

function LogOut() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
