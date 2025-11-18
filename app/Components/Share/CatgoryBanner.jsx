// "use client"
// import React from 'react'
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";

// export default function CategoryBanner() {
//   const categories = [
//     {
//       id: 1,
//       name: "Electronics",
//       icon: "📱",
//       color: "bg-blue-500"
//     },
//     {
//       id: 2,
//       name: "Fashion",
//       icon: "👕",
//       color: "bg-pink-500"
//     },
//     {
//       id: 3,
//       name: "Home",
//       icon: "🏠",
//       color: "bg-green-500"
//     },
//     {
//       id: 4,
//       name: "Sports",
//       icon: "⚽",
//       color: "bg-orange-500"
//     },
//     {
//       id: 5,
//       name: "Beauty",
//       icon: "💄",
//       color: "bg-purple-500"
//     },
//     {
//       id: 6,
//       name: "Books",
//       icon: "📚",
//       color: "bg-yellow-500"
//     },
//     {
//       id: 7,
//       name: "Toys",
//       icon: "🧸",
//       color: "bg-red-500"
//     },
//     {
//       id: 8,
//       name: "Automotive",
//       icon: "🚗",
//       color: "bg-gray-500"
//     }
//   ];

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold text-center mb-8">Browse Categories</h2>
      
//       <Swiper
//         slidesPerView={2}
//         spaceBetween={10}
//         autoplay={{
//           delay: 2500,
//           disableOnInteraction: false,
//         }}
//         breakpoints={{
//           480: {
//             slidesPerView: 3,
//             spaceBetween: 15,
//           },
//           640: {
//             slidesPerView: 4,
//             spaceBetween: 20,
//           },
//           768: {
//             slidesPerView: 5,
//             spaceBetween: 20,
//           },
//           1024: {
//             slidesPerView: 6,
//             spaceBetween: 25,
//           },
//         }}
//         modules={[Autoplay]}
//       >
//         {categories.map((category) => (
//           <SwiperSlide key={category.id}>
//             <div className="group text-center cursor-pointer">
//               <div className={`w-20 h-20 mx-auto rounded-2xl ${category.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
//                 {category.icon}
//               </div>
//               <p className="mt-3 font-medium text-gray-700 group-hover:text-gray-900">
//                 {category.name}
//               </p>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   )
// }

"use client"
import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from 'next/image';

export default function CategoryBanner() {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Home & Garden",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    },
    {
      id: 4,
      name: "Sports",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
    },
    {
      id: 5,
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop",
    },
    {
      id: 6,
      name: "Books",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2> */}
      
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          480: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 25,
          },
        }}
        modules={[Autoplay]}
        className="category-swiper"
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <div className="group text-center cursor-pointer">
              <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {category.name}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}