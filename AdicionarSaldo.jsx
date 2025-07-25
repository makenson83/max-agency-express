
import { Plus } from "lucide-react";

export default function AdicionarSaldo() {
  return (
    <button className="flex items-center gap-2 bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50">
      <Plus className="w-5 h-5 text-blue-600" />
      Adicionar Saldo
    </button>
  );
}
