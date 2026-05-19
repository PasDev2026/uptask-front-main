import { useQuery } from "@tanstack/react-query";
import { getSedes } from "../api/empresa.api";
import { Empresa } from "../types/empresa";

interface SedeSelectorProps {
  value: string;
  onChange: (sedeId: string) => void;
  className?: string;
}

export default function SedeSelector({ value, onChange, className = "" }: SedeSelectorProps) {
  const { data: sedes, isLoading, isError } = useQuery({
    queryKey: ["sedes"],
    queryFn: getSedes,
  });

  if (isLoading) return <div className="text-gray-400 text-sm">Cargando sedes...</div>;
  if (isError) return <div className="text-red-500 text-sm">Error al cargar sedes</div>;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 ${className}`}
    >
      <option value="">Seleccionar sede</option>
      {sedes?.map((sede: Empresa) => (
        <option key={sede._id} value={sede._id}>
          {sede.nombre}
        </option>
      ))}
    </select>
  );
}
