

// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useRef } from "react";

// import {
//   Search,
//   Menu,
//   X,
//   ChevronDown,
//   Package,
//   Users,
//   BarChart3,
//   ClipboardList,
//   User,
//   Heart,
//   icons,
// } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import LogoutButton from "./LogoutButton";

// // Admin Menu
// const adminMenuItems = [
//   { href: "/orders", icon: Package, label: "Orders" },
//   { href: "/customers", icon: Users, label: "Customers" },
//   { href: "/analytics", icon: BarChart3, label: "Analytics" },
//   { href: "/inventory-management", icon: ClipboardList, label: "Inventory" },
// ];

// // User Menu
// const userMenuItems = [
//   { href: "/wishlist", label: "Wishlist", icon: Heart },
//   { href: "/my-account", label: "My Account", icon: User },
//    { href: "/checkout", label: "Checkout"  ,icon:User   },
// ];

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [adminMenuOpen, setAdminMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const router = useRouter();
//   const adminMenuRef = useRef(null);

//   const { user } = useAuth();

//   // ✔ Only 2 roles
//   const isAdmin = user?.role === "admin";
//   const isUser = user?.role === "user";

//   // Close admin dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) {
//         setAdminMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;
//     router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
//   };

//   return (
//     <nav className="shadow-sm bg-white sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
//         <Link href="/" className="text-2xl font-bold">XXXXX Fashion</Link>

//         {/* Desktop Menu */}
//         <ul className="hidden md:flex items-center space-x-6 font-medium">

//           {/* Admin Dashboard Menu */}
//           {isAdmin && (
//             <li className="relative" ref={adminMenuRef}>
//               <button
//                 onClick={() => setAdminMenuOpen(!adminMenuOpen)}
//                 className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-1"
//               >
//                 <span>Dashboard</span>
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform ${
//                     adminMenuOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {adminMenuOpen && (
//                 <div className="absolute w-56 right-0 bg-white shadow-lg border rounded-lg mt-2">
//                   {adminMenuItems.map((item) => {
//                     const Icon = item.icon;
//                     return (
//                       <Link
//                         key={item.href}
//                         href={item.href}
//                         onClick={() => setAdminMenuOpen(false)}
//                         className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
//                       >
//                         <Icon className="w-4 h-4" />
//                         <span>{item.label}</span>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               )}
//             </li>
//           )}

//           {/* User Menu */}
//           {isUser &&
//             userMenuItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <li key={item.href}>
//                   <Link
//                     href={item.href}
//                     className="flex items-center gap-1 hover:text-blue-600"
//                   >
//                     <Icon className="w-4 h-4" />
//                     {item.label}
//                   </Link>
//                 </li>
//               );
//             })}
//                         <LogoutButton />
//           {/* ❌ Login Removed (Guest not allowed) */}

//           {/* Search */}
//           <form
//             onSubmit={handleSearchSubmit}
//             className="flex items-center border px-3 py-1 rounded-lg"
//           >
//             <input
//               type="text"
//               className="outline-none"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <button type="submit">
//               <Search className="w-5 h-5" />
//             </button>
//           </form>
//         </ul>

//         {/* Mobile Menu Buttons */}
//         <div className="md:hidden flex items-center gap-4">
//           <button>
//             <Search className="w-6 h-6" />
//           </button>
//           <button onClick={() => setMenuOpen(!menuOpen)}>
//             {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden fixed right-0 top-0 w-64 h-full bg-white shadow-lg p-4 z-50">
//           <button className="mb-4" onClick={() => setMenuOpen(false)}>
//             <X />
//           </button>

//           <ul className="space-y-2">

//             {isAdmin &&
//               adminMenuItems.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <li key={item.href}>
//                     <Link
//                       href={item.href}
//                       onClick={() => setMenuOpen(false)}
//                       className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
//                     >
//                       <Icon className="w-4 h-4" /> {item.label}
//                     </Link>
//                   </li>
//                 );
//               })}

//             {isUser &&
//               userMenuItems.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <li key={item.href}>
//                     <Link
//                       href={item.href}
//                       onClick={() => setMenuOpen(false)}
//                       className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
//                     >
//                       <Icon className="w-4 h-4" /> {item.label}
//                     </Link>
//                   </li>
//                 );
//               })}
//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// }

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import {
  Search,
  Menu,
  X,
  ChevronDown,
  Package,
  Users,
  BarChart3,
  ClipboardList,
  User,
  Heart,
  ShoppingBag,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import LogoutButton from "./LogoutButton";

// Admin Menu
const adminMenuItems = [
  { href: "/orders", icon: Package, label: "Orders" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/inventory-management", icon: ClipboardList, label: "Inventory" },
];

// User Menu
const userMenuItems = [
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/my-account", label: "My Account", icon: User },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
  const adminMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  const isGuest = !user;

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close admin dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) {
        setAdminMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && e.target.closest('button')?.ariaLabel !== 'Toggle menu') {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" 
        : "bg-white border-b border-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold  hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            XXXXX Fashion
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Admin Dashboard */}
            {isAdmin && (
              <div className="relative" ref={adminMenuRef}>
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                >
                  <span className="font-medium">Dashboard</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      adminMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {adminMenuOpen && (
                  <div className="absolute w-56 right-0 bg-white shadow-xl border border-gray-200 rounded-xl mt-3 py-2 backdrop-blur-sm">
                    {adminMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {isUser && (
              <div className="flex items-center space-x-4">
                {userMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group"
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Guest Links */}
            {isGuest && (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Logout */}
            {user && (
              <div className="ml-2">
                <LogoutButton />
              </div>
            )}

            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center border border-gray-300 px-4 py-2 rounded-xl hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all"
            >
              <input
                type="text"
                className="outline-none bg-transparent w-48 placeholder-gray-400"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="md:hidden flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                className="w-32 border-b border-gray-300 px-2 py-1 outline-none placeholder-gray-400"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="p-1">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </form>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="absolute right-0 top-0 w-80 h-full bg-white shadow-xl p-6 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-1">
              {isAdmin && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                    Admin Dashboard
                  </h3>
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl transition-all mb-1"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {isUser && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                    My Account
                  </h3>
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl transition-all mb-1"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Guest Links */}
              {isGuest && (
                <div className="space-y-2 mb-6">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium border border-gray-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Logout */}
              {user && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <LogoutButton mobile />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
