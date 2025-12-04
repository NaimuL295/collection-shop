// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useRef, useMemo } from "react";

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
//   ShoppingBag,
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
//   { href: "/checkout", label: "Checkout", icon: ShoppingBag },
// ];

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [adminMenuOpen, setAdminMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

//   const router = useRouter();
//   const adminMenuRef = useRef(null);
//   const mobileMenuRef = useRef(null);

//   const { user, loading } = useAuth();

//   // Memoize user roles to prevent unnecessary re-renders
//   const { isAdmin, isUser } = useMemo(() => ({
//     isAdmin: user?.role === "admin",
//     isUser: user?.role === "user",
//   }), [user?.role]);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) {
//         setAdminMenuOpen(false);
//       }
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && menuOpen) {
//         setMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen]);

//   // Close mobile menu when route changes
//   useEffect(() => {
//     const handleRouteChange = () => {
//       setMenuOpen(false);
//       setMobileSearchOpen(false);
//     };

//     router.events?.on('routeChangeComplete', handleRouteChange);
//     return () => {
//       router.events?.off('routeChangeComplete', handleRouteChange);
//     };
//   }, [router]);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;
//     router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
//     setSearchQuery("");
//     setMobileSearchOpen(false);
//   };

//   const handleMobileSearchToggle = () => {
//     setMobileSearchOpen(!mobileSearchOpen);
//     setMenuOpen(false);
//   };

//   // Show loading state
//   if (loading) {
//     return (
//       <nav className="shadow-sm bg-white sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
//           <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
//           <div className="hidden md:flex space-x-4">
//             <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
//             <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   return (
//     <nav className="shadow-sm bg-white sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
//         {/* Logo */}
//         <Link 
//           href="/" 
//           className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
//         >
//           XXXXX Fashion
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center space-x-6 font-medium">
//           {/* Admin Dashboard Menu */}
//           {isAdmin && (
//             <div className="relative" ref={adminMenuRef}>
//               <button
//                 onClick={() => setAdminMenuOpen(!adminMenuOpen)}
//                 className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-1 hover:bg-blue-700 transition-colors"
//                 aria-expanded={adminMenuOpen}
//                 aria-haspopup="true"
//                 aria-label="Admin dashboard menu"
//               >
//                 <span>Dashboard</span>
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform ${
//                     adminMenuOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {adminMenuOpen && (
//                 <div className="absolute w-56 right-0 bg-white shadow-lg border rounded-lg mt-2 py-2 z-50">
//                   {adminMenuItems.map((item) => {
//                     const Icon = item.icon;
//                     return (
//                       <Link
//                         key={item.href}
//                         href={item.href}
//                         onClick={() => setAdminMenuOpen(false)}
//                         className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
//                       >
//                         <Icon className="w-4 h-4" />
//                         <span>{item.label}</span>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* User Menu */}
//           {isUser && (
//             <div className="flex items-center space-x-6">
//               {userMenuItems.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className="flex items-center gap-2 hover:text-blue-600 text-gray-700 transition-colors"
//                   >
//                     <Icon className="w-4 h-4" />
//                     <span>{item.label}</span>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}

//           {/* Logout Button */}
//           {user && <LogoutButton />}

//           {/* Search Form */}
//           <form
//             onSubmit={handleSearchSubmit}
//             className="flex items-center border border-gray-300 px-3 py-2 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
//           >
//             <input
//               type="text"
//               className="outline-none w-48"
//               placeholder="Search products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               aria-label="Search products"
//             />
//             <button 
//               type="submit" 
//               className="text-gray-500 hover:text-blue-600 transition-colors"
//               aria-label="Submit search"
//             >
//               <Search className="w-5 h-5" />
//             </button>
//           </form>
//         </div>

//         {/* Mobile Menu Buttons */}
//         <div className="md:hidden flex items-center gap-4">
//           <button
//             onClick={handleMobileSearchToggle}
//             className="text-gray-700 hover:text-blue-600 transition-colors"
//             aria-label="Toggle search"
//           >
//             <Search className="w-6 h-6" />
//           </button>
//           <button 
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="text-gray-700 hover:text-blue-600 transition-colors"
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Search Bar */}
//       {mobileSearchOpen && (
//         <div className="md:hidden border-t border-gray-200 bg-white p-4">
//           <form onSubmit={handleSearchSubmit} className="flex">
//             <input
//               type="text"
//               className="flex-1 border border-gray-300 px-3 py-2 rounded-l-lg outline-none focus:border-blue-500"
//               placeholder="Search products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               autoFocus
//             />
//             <button 
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
//             >
//               <Search className="w-5 h-5" />
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div 
//           className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
//           onClick={() => setMenuOpen(false)}
//         >
//           <div 
//             ref={mobileMenuRef}
//             className="fixed right-0 top-0 w-64 h-full bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
//               <button 
//                 onClick={() => setMenuOpen(false)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 aria-label="Close menu"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Menu Items */}
//             <ul className="space-y-2">
//               {/* Admin Menu Items */}
//               {isAdmin && (
//                 <li className="border-b border-gray-200 pb-4">
//                   <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
//                     Admin Dashboard
//                   </h3>
//                   <ul className="space-y-1">
//                     {adminMenuItems.map((item) => {
//                       const Icon = item.icon;
//                       return (
//                         <li key={item.href}>
//                           <Link
//                             href={item.href}
//                             onClick={() => setMenuOpen(false)}
//                             className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
//                           >
//                             <Icon className="w-4 h-4" />
//                             <span>{item.label}</span>
//                           </Link>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </li>
//               )}

//               {/* User Menu Items */}
//               {isUser && (
//                 <li className="border-b border-gray-200 pb-4">
//                   <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
//                     My Account
//                   </h3>
//                   <ul className="space-y-1">
//                     {userMenuItems.map((item) => {
//                       const Icon = item.icon;
//                       return (
//                         <li key={item.href}>
//                           <Link
//                             href={item.href}
//                             onClick={() => setMenuOpen(false)}
//                             className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
//                           >
//                             <Icon className="w-4 h-4" />
//                             <span>{item.label}</span>
//                           </Link>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </li>
//               )}

//               {/* Logout Button */}
//               {user && (
//                 <li className="pt-4">
//                   <LogoutButton mobile />
//                 </li>
//               )}
//             </ul>
//           </div>
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


import LogoutButton from "./LogoutButton";
import { useAuth } from "@/app/hooks/useAuth";


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
  { href: "/checkout", label: "Cart", icon: ShoppingBag },
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
console.log(user);

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
