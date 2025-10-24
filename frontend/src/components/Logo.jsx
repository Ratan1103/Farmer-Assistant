import { Leaf } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
        <Leaf className="w-7 h-7 text-white" />
      </div>
      <span className="text-2xl font-bold text-green-700">Farmer Assistant</span>
    </div>
  );
}
