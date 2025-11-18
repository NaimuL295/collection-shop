export default function ContactPage() {
  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-2">
        📍 Address: 123 E-commerce Street, Your City, Your Country
      </p>
      <p className="mb-2">
        📧 Email: <a href="mailto:support@yourstore.com" className="text-blue-600 underline">support@yourstore.com</a>
      </p>
      <p className="mb-2">
        📞 Phone: <a href="tel:+1234567890" className="text-blue-600 underline">+1 234 567 890</a>
      </p>
      <p className="mt-4 text-gray-600">
        Our customer support is available 24/7 to help you with your orders.
      </p>
    </div>
  );
}
