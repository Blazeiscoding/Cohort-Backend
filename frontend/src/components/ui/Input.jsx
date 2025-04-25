export default function Input({ className = '', ...props }) {
    return (
      <input
        type="text"
        className={`px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        {...props}
      />
    );
  }
  