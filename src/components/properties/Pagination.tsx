import { useNavigate, useSearchParams } from "react-router-dom";

export default function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    navigate(`/properties?${params.toString()}`, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex flex-col items-center gap-3">
      <p className="text-sm text-neutral-500">Page {currentPage} of {totalPages}</p>
      <div className="flex items-center gap-1">
      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed">
        Prev
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-neutral-400">...</span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              p === currentPage ? "bg-primary/90 text-white" : "border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed">
        Next
      </button>
      </div>
    </nav>
  );
}
