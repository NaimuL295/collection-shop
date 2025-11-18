// import React from 'react'

// export default function PackageType() {
//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h2 className="text-2xl font-bold text-center mb-6">Choose Package</h2>
      
//       <div className="flex flex-col sm:flex-row gap-4 justify-center">
//         <div className="flex-1 border border-blue-300 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors">
//           <h3 className="text-lg font-semibold text-blue-600">Student Package</h3>
//         </div>
        
//         <div className="flex-1 border border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
//           <h3 className="text-lg font-semibold text-gray-800">Premium Package</h3>
//         </div>
//       </div>
//     </div>
//   )
// }

import React from 'react'
import Link from 'next/link'

export default function PackageType() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Choose Package</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/student-package" 
          className="flex-1   rounded-lg p-4 text-center cursor-pointer  transition-colors block"
        >
          <h3 className="text-4xl font-semibold">Student Package</h3>
          <p className="text-sm opacity-90 mt-2">Perfect for students</p>
        </Link>
        
        <Link 
          href="/premium-package" 
          className="flex-1 bg-gray-800 text-white rounded-lg p-4 text-center cursor-pointer hover:bg-gray-700 transition-colors block"
        >
          <h3 className="text-4xl font-semibold">Premium Package</h3>
          <p className="text-sm opacity-90 mt-2">Full access features</p>
        </Link>
      </div>
    </div>
  )
}