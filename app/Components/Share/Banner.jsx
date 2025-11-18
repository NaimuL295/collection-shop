"use client"
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Banner() {
  const banners = [
    {
      id: 1,
      title: "Summer Sale",
      description: "Up to 50% off on all items",
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=800",
      buttonText: "Shop Now",
      bgColor: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "New Collection",
      description: "Discover the latest trends",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      buttonText: "Explore",
      bgColor: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "Free Shipping",
      description: "On orders over $50",
      image: "https://images.unsplash.com/photo-1607082352121-fa243f3dde32?w=800",
      buttonText: "Learn More",
      bgColor: "from-orange-500 to-red-600"
    },
    {
      id: 4,
      title: "Limited Time Offer",
      description: "Don't miss out on exclusive deals",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
      buttonText: "Buy Now",
      bgColor: "from-pink-500 to-rose-600"
    },
    {
      id: 5,
      title: "Premium Quality",
      description: "Experience the best in class",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800",
      buttonText: "Discover",
      bgColor: "from-indigo-500 to-blue-600"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        effect={'fade'}
        loop={true}
        modules={[Autoplay, Pagination, EffectFade]} // Removed Navigation
        className="mySwiper relative rounded-xl shadow-2xl overflow-hidden"
        style={{
          height: '400px'
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={`relative w-full h-full bg-gradient-to-r${banner.bgColor}`}>
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.image})` }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-8">
                <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
                  {banner.title}
                </h2>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-lg">
                  {banner.description}
                </p>
                <button className="bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                  {banner.buttonText}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Pagination */}
        {/* <div className="swiper-pagination bottom-6"></div> ! */}
      </Swiper>

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">Shop to explore our offers</p>
      </div>
    </div>
  );
}