/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com', // ✅ add this for Cloudinary images
    ],
  },
};

export default nextConfig;
