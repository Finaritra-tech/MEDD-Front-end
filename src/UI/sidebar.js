import { useState } from "react";
import { NavLink } from "react-router-dom";


export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bouton menu mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50
          bg-[#EAEAEA] p-2 rounded-xl
          shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]"
      >
        {/* Icon menu */}
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
       className={` mt-8 ml-4
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
          <span className="font-bold text-lg text-gray-800">Dashboard</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          <SidebarItem icon={<ChartIcon />} label="Tableau de bord" to="/Direction/dashboard-chef" />
          <SidebarItem icon={<BriefcaseIcon />} label="Assigner" to="/Missions/direct" />
          <SidebarItem icon={<UsersIcon />} label="Missions" to="/tri" />
          <SidebarItem icon={<UsersIcon />} label="Agents" to="/add-agent" />
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

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
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

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3v18m4-12v12m4-6v6M3 21h18" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a6 6 0 100 12 6 6 0 000-12z" />
    </svg>
  );
}
