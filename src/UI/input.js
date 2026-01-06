// src/ui/Input.jsx
export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  label,
  error = "",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          px-4 py-2 rounded-2xl
          bg-[#EAEAEB]
          text-black
          placeholder-black
          shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
          focus:shadow-[inset_6px_6px_10px_#c5c5c5,inset_-6px_-6px_10px_#ffffff]
          focus:outline-none
          transition-shadow duration-200
          ${error ? "border-red-500" : ""}
        `}
        {...props}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}
