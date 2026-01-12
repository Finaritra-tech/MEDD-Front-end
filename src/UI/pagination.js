export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

      {/* Bouton précédent */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-xl font-medium
          ${
            currentPage === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:scale-105"
          }
          bg-[#EAEAEA]
          shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]
          transition`}
      >
        ◀
      </button>

      {/* Numéros */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl font-semibold transition
            ${
              currentPage === page
                ? "text-white bg-[#1D91A5] shadow-inner"
                : "bg-[#EAEAEA] hover:scale-105"
            }
            shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]`}
        >
          {page}
        </button>
      ))}

      {/* Bouton suivant */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-xl font-medium
          ${
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:scale-105"
          }
          bg-[#EAEAEA]
          shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]
          transition`}
      >
        ▶
      </button>

    </div>
  );
}
