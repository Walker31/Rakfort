import { forwardRef, useState } from "react";
import { cn } from "../utils/cn";
import PropTypes from "prop-types";
import { navbarLinks } from "../constant/index";
import { NavLink } from "react-router-dom";

export const Drawer = forwardRef(({ collapsed }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full flex-col overflow-x-hidden",
        "border-r border-purple-200 dark:border-purple-800 dark:text-white",
        "bg-purple-50 dark:bg-[#1a102b] px-0",
        "[transition:_width_300ms,_left_300ms,_background-color_150ms,_border_150ms]",
        "scrollbar-hidden",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      {/* Navigation Links */}
      <div className="flex flex-col gap-y-4 overflow-y-auto p-3 scrollbar-hidden w-full">
        {navbarLinks.map((navbarLink, index) => (
          <nav key={navbarLink.title} className="flex flex-col gap-y-1 w-full">
            {/* Divider */}
            {index !== 0 && (
              <hr className="w-full border-slate-300 dark:border-slate-600 mb-2" />
            )}

            {/* Title (only show if not collapsed) */}
            {!collapsed && (
              <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 px-2">
                {navbarLink.title}
              </p>
            )}

            {/* Links */}
            {navbarLink.links.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    "text-slate-700 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-800",
                    isActive && "bg-purple-200 dark:bg-purple-700 text-white",
                    collapsed ? "justify-center md:w-[45px]" : "w-full"
                  )
                }
              >
                <Icon size={22} className="shrink-0" />
                {!collapsed && (
                  <span className="whitespace-nowrap text-sm font-medium">
                    {label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        ))}
      </div>
    </aside>
  );
});

Drawer.displayName = "Drawer";

Drawer.propTypes = {
  collapsed: PropTypes.bool,
};
