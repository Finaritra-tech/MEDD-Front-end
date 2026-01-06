// src/ui/Title.jsx
export default function Title({ level = 1, children, className = "" }) {
  // Définition des variantes Tailwind pour chaque niveau
  const sizeClasses = {
    1: "text-4xl font-bold",   // h1
    2: "text-3xl font-semibold", // h2
    3: "text-2xl font-semibold", // h3
    4: "text-xl font-medium",   // h4
    5: "text-lg font-medium",   // h5
    6: "text-base font-medium", // h6
  };

  const Tag = `h${level}`; // génère h1, h2, ...

  return (
    <Tag className={`${sizeClasses[level]} text-gray-900 dark:text-white ${className}`}>
      {children}
    </Tag>
  );
}
