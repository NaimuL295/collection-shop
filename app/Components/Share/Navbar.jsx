// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Search,
//   Menu,
//   X,
//   ChevronDown,
//   LayoutDashboard,
//   Package,
//   Users,
//   BarChart3,
//   ClipboardList,
//   Ticket,
//   Settings,
//   ShoppingCart,
//   User,
//   Info,
//   Mail
// } from "lucide-react";
// import LogoutButton from "./LogoutButton";

// // 🔹 Mock user hook (replace with your real auth logic later)
// const useUser = () => {
//   return { role: "superadmin", name: "Admin User" }; 
//   return { role: "user", name: "User" }; 
// };

// // 🔹 Admin panel items
// const adminMenuItems = [
//   { href: "/admin", icon: LayoutDashboard, label: "Dashboard Overview", shortLabel: "Dashboard" },
//   { href: "/admin/orders", icon: Package, label: "Orders Management", shortLabel: "Orders" },
//   { href: "/admin/customers", icon: Users, label: "Customers Management", shortLabel: "Customers" },
//   { href: "/admin/analytics", icon: BarChart3, label: "Sales Analytics", shortLabel: "Analytics" },
//   { href: "/inventory-management", icon: ClipboardList, label: "Inventory Management", shortLabel: "Inventory" },
//   { href: "/admin/discounts", icon: Ticket, label: "Discounts & Coupons", shortLabel: "Discounts" },
//   { href: "/admin/settings", icon: Settings, label: "Settings", shortLabel: "Settings" },
//   { href: "/about", icon: Info, label: "About", shortLabel: "About" },
//   { href: "/contact", icon: Mail, label: "Contact", shortLabel: "Contact" },
//   { href: "/my-account", icon: User, label: "My Account", shortLabel: "Account" },
//   { href: "/login", icon: User, label: "My Account", shortLabel: "Account" },
//   { href: "/register", icon: User, label: "My Account", shortLabel: "Account" },
// ];

// // 🔹 Mobile menu items
// const mobileMenuItems = [
//   { href: "/about", label: "About" },
//   { href: "/shop", label: "Shop" },
//   { href: "/cart", label: "Cart", icon: ShoppingCart },
//   { href: "/checkout", label: "Checkout" },
//   { href: "/contact", label: "Contact" },
//   { href: "/my-account", label: "My Account", icon: User },
// ];

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [adminMenuOpen, setAdminMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
  
//   const router = useRouter();
//   const user = useUser();
//   const adminMenuRef = useRef(null);
//   const isSuperAdmin =  "user";
// // === user?.role
//   // 🔹 Close admin dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) {
//         setAdminMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // 🔹 Optional: Close search bar when clicking outside
//   useEffect(() => {
//     const handleOutsideClick = (e) => {
//       if (!e.target.closest("form") && searchOpen) {
//         setSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, [searchOpen]);

//   // 🔹 Handle product search
//   const handleSearch = useCallback((e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;
//     router.push(`api/search?query=${encodeURIComponent(searchQuery)}`);
//     setSearchOpen(false);
//   }, [searchQuery, router]);

//   const closeAllMenus = useCallback(() => {
//     setMenuOpen(false);
//     setAdminMenuOpen(false);
//     setSearchOpen(false);
//   }, []);

//   const handleNavLinkClick = useCallback(() => {
//     closeAllMenus();
//   }, [closeAllMenus]);

//   const toggleAdminMenu = useCallback((e) => {
//     e.stopPropagation();
//     setAdminMenuOpen((prev) => !prev);
//   }, []);

//   return (
//     <nav className="relative bg-white dark:bg-gray-900 shadow-sm">
//       <div className="max-w-7xl flex items-center justify-between mx-auto p-4">
//         {/* 🔹 Brand Logo */}
//         <Link
//           href="/"
//           className="text-2xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
//           onClick={handleNavLinkClick}
//         >
//           XXXXX Fashion
//         </Link>

//         {/* 🔹 Desktop Navigation */}
//         <ul className="hidden md:flex space-x-6 font-medium text-gray-900 dark:text-white items-center">
//           <li>
//             <Link href="#" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
//               Student Package
//             </Link>
//           </li>
//           <li>
//             <Link href="#" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
//               Premium Package
//             </Link>
//           </li>
//           <li>
//             <form onSubmit={handleSearch} className="flex">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors"
//               />
//             </form>
//           </li>

//           {/* 🔹 Admin Dashboard (only for Super Admin) */}
//           {isSuperAdmin && (
//             <li className="relative" ref={adminMenuRef}>
//               <button
//                 onClick={toggleAdminMenu}
//                 className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//                 aria-expanded={adminMenuOpen}
//                 aria-haspopup="true"
//               >
//                 <span>Dashboard</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform ${adminMenuOpen ? "rotate-180" : ""}`} />
//               </button>

//               {adminMenuOpen && (
//                 <div
//                   className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
//                   role="menu"
//                 >
//                   <div className="p-3 border-b border-gray-200 dark:border-gray-600">
//                     <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
//                   </div>
//                   <div className="p-2 space-y-1">
//                     {adminMenuItems.map((item) => {
//                       const Icon = item.icon;
//                       return (
//                         <Link
//                           key={item.href}
//                           href={item.href}
//                           className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
//                           onClick={() => setAdminMenuOpen(false)}
//                           role="menuitem"
//                         >
//                           <Icon className="w-4 h-4" />
//                           <span>{item.label}</span>
//                         </Link>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </li>
//           )}
//         </ul>

//         {/* 🔹 Mobile Icons */}
//         <div className="flex md:hidden items-center space-x-2">
//           <button
//             onClick={() => {
//               setSearchOpen(!searchOpen);
//               setMenuOpen(false);
//             }}
//             className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors"
//             aria-label="Search"
//           >
//             <Search className="w-5 h-5" />
//           </button>

//           <button
//             onClick={() => {
//               setMenuOpen(!menuOpen);
//               setSearchOpen(false);
//             }}
//             className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors"
//             aria-label="Menu"
//             aria-expanded={menuOpen}
//           >
//             {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* 🔹 Mobile Sidebar Menu */}
//         <div
//           className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transform ${
//             menuOpen ? "translate-x-0" : "translate-x-full"
//           } transition-transform duration-300 ease-in-out md:hidden z-50`}
//           role="dialog"
//           aria-modal="true"
//           aria-label="Navigation menu"
//         >
//           <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
//             {isSuperAdmin && (
//               <div className="text-sm">
//                 <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
//               </div>
//             )}
//             <button
//               onClick={() => setMenuOpen(false)}
//               className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition-colors"
//               aria-label="Close menu"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           <ul className="flex flex-col space-y-1 p-4 text-gray-700 dark:text-white">
          

//             {isSuperAdmin && (
//               <>
//                 <li className="  dark:border-gray-700">
//                   <span className="block px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                     Admin Panel
//                   </span>
               
//                 </li>
//                 {adminMenuItems.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <li key={item.href}>
//                       <Link
//                         href={item.href}
//                         onClick={handleNavLinkClick}
//                         className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
//                       >
//                         <Icon className="w-4 h-4" />
//                         <span>{item.shortLabel}</span>
//                       </Link> 
//                     </li>
                     
//                   );
//                 })}
//               </>
//             )}
//           </ul>
//         </div>

//         {/* 🔹 Mobile Search Field */}
//         {searchOpen && (
//           <div className="absolute top-16 left-0 right-0 p-4 md:hidden z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
//             <form onSubmit={handleSearch} className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//               >
//                 <Search className="w-4 h-4" />
//               </button>
//             </form>
          
//           </div>
//         )}
//       </div>

//       {/* 🔹 Overlay when sidebar is open */}
//       {menuOpen && (
//         <div
//           className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
//           onClick={() => setMenuOpen(false)}
//           aria-hidden="true"
//         />
//       )}
     
//     </nav>
//   );
// }

// Fixed Navbar with working search redirect
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  ClipboardList,
  Ticket,
  Settings,
  User,
  Heart,
} from "lucide-react";

// Mock User
const useUser = () => {
  return { role: "superadmin", name: "Regular User" };
};

const adminMenuItems = [
  // { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/orders", icon: Package, label: "Orders" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/inventory-management", icon: ClipboardList, label: "Inventory" },
  // { href: "/admin/discounts", icon: Ticket, label: "Discounts" },
  // { href: "/admin/settings", icon: Settings, label: "Settings" },
];

const userMenuItems = [
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/my-account", label: "My Account", icon: User },
  { href: "/register", label: "My Account", icon: User },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const user = useUser();
  const adminMenuRef = useRef(null);

  const isSuperAdmin = user?.role === "superadmin";
  const isUser = user?.role === "user";

  // Close admin menu outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) {
        setAdminMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchOpen(false);
  };

  return (
    <nav className="shadow-sm border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">XXXXX Fashion</Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6 font-medium">
          {isSuperAdmin && (
            <li className="relative" ref={adminMenuRef}>
              <button
                onClick={() => setAdminMenuOpen((prev) => !prev)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-1"
              >
                <span>Dashboard</span>
                <ChevronDown className={`w-4 h-4 ${adminMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {adminMenuOpen && (
                <div className="absolute w-56 right-0 bg-white shadow-lg border rounded-lg mt-2">
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </li>
          )}

          {/* User Menu */}
          {isUser && (
            <>
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link href={item.href} className="flex items-center gap-1 hover:text-blue-600">
                      {Icon && <Icon className="w-4 h-4" />} {item.label}
                    </Link>
                  </li>
                );
              })}
            </>
          )}

          {/* Desktop search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center border px-3 py-1 rounded-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="outline-none"
            />
            <button type="submit"><Search className="w-5 h-5" /></button>
          </form>
        </ul>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setSearchOpen((prev) => !prev)}>
            <Search className="w-6 h-6" />
          </button>
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="p-4 md:hidden border-t bg-white">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-2 bg-blue-600 text-white rounded-lg"><Search /></button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed right-0 top-0 w-64 h-full bg-white shadow-lg z-50 p-4">
          <button className="mb-4" onClick={() => setMenuOpen(false)}><X /></button>

          <ul className="space-y-2">
            {isSuperAdmin && adminMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Icon className="w-4 h-4" /> {item.label}
                  </Link>
                </li>
              );
            })}

            {isUser && userMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    {Icon && <Icon className="w-4 h-4" />} {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}