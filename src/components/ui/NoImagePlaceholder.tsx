import { Home } from "lucide-react";

export default function NoImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-neutral-100 ${className}`}>
      <Home className="h-12 w-12 text-neutral-300" />
      <p className="mt-2 text-xs text-neutral-400">No image available</p>
    </div>
  );
}
