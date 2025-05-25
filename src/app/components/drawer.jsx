import { forwardRef } from "react";
import { cn } from "../utils/cn";
import logo from '../assets/logo-panda.jpg'
import PropTypes from "prop-types";
import { navbarLinks } from '../constant/index';
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Search } from "@mui/icons-material";


export const Drawer = forwardRef(({collapsed, }, ref) => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <aside ref={ref}
        className={cn(
            "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white",
            "[transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)]",
            "dark:border-slate-700 dark:bg-slate-900 scrollbar-hidden",
            collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
            collapsed ? "max-md:-left-full" : "max-md:left-0",

          )}> 
            <div className="flex flex-col gap-3 p-3">
                <div className="flex gap-x-3">
                    <img src={logo} alt="Logo" className="w-8 h-8"/>
                </div>
                <div className="relative w-full">
    {!collapsed ? (
        <div className="relative">
            <Search 
                size={20} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-white"
            />
            <input 
                type="text" 
                placeholder="Search..." 
                className="w-full p-2 pl-10 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    ) : (
        <button className="p-2">
            <Search size={22} className="text-slate-600 dark:text-white" />
        </button>
    )}
</div>

            </div>
            <div className="flex w-flex flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scollbar-width:_thin] scrollbar-hidden">
            {navbarLinks.map((navbarLink,index) => (
    <nav key={navbarLink.title} className={cn("sidebar-group", collapsed && "md:items-center")}>
        {/* Horizontal Line - Always Visible */}
        {index !== 0 && <hr className="w-full border-slate-300 dark:border-slate-600 mb-2 block" />}


        {/* Section Title */}
        <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>

        {/* Links */}
        {navbarLink.links.map(({ label, path, icon: Icon }) => (
            <NavLink key={label} to={path} className={cn("sidebar-item", collapsed && "md:w-[45px]")}>
                <Icon size={22} className="flex-shrink-0" />
                {!collapsed && <p className="whitespace-nowrap">{label}</p>}
            </NavLink>
        ))}

    </nav>
))}

            </div>
        </aside>
    );
});

Drawer.displayName= 'Sidebar';
Drawer.propTypes ={
    collapsed: PropTypes.bool
}

