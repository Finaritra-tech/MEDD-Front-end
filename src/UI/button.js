const variants = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  danger: "bg-danger text-white",
  outline: "border border-gray-300 text-gray-700 bg-[#EAEAEA]",
};

export default function Button({ variant = "primary", children }) {
  return (
    <button
      className={`
        px-4 py-2 rounded-2xl font-medium transition-all duration-200
        shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff] 
        hover:shadow-[8px_8px_15px_#c5c5c5,-8px_-8px_15px_#ffffff] 
        focus:shadow-[8px_8px_15px_#c5c5c5,-8px_-8px_15px_#ffffff] 
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
}
