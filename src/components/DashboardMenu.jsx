// src/components/DashboardMenu.jsx
import React from "react";
import { LayoutDashboard, Star, BarChart2, Rss, User } from "lucide-react";


export default function DashboardMenu({ currentSection, setSection }) {
  const menuItems = [
    { id: "explore", label: "Explorar empleos", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "recommended", label: "Recomendados", icon: <Star className="w-4 h-4" /> },
    { id: "stats", label: "Estadísticas", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "sources", label: "Fuentes activas", icon: <Rss className="w-4 h-4" /> },
    { id: "profile", label: "Perfil", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-gray-900 p-3 rounded border border-gray-800">
      <div className="text-sm text-gray-400 mb-2">Menú del Dashboard</div>
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded text-left ${
              currentSection === item.id ? "bg-gray-800 text-gray-100" : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
