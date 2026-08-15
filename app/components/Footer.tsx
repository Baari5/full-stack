export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white px-4 py-4 mt-8">
      <p>Internet Movies Rental Company (IMR)</p>
      <p>Contact: support@imr.com | Phone: (555) 123-4567</p>
      <p>© {new Date().getFullYear()} IMR. All rights reserved.</p>
    </footer>
  );
}