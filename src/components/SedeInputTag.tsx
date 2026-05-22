import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSedes } from "../api/empresa.api";

interface SedeInputTagProps {
  value: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}

export default function SedeInputTag({ value, onChange, error }: SedeInputTagProps) {
  const { data: sedes } = useQuery({
    queryKey: ["sedes"],
    queryFn: getSedes,
  });

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = sedes?.filter(
    s => s.nombre.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s._id)
  ) ?? [];

  const add = (id: string) => {
    onChange([...value, id]);
    setInputValue("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const remove = (id: string) => {
    onChange(value.filter(v => v !== id));
  };

  const selectedSedes = sedes?.filter(s => value.includes(s._id)) ?? [];

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-brand-primary min-h-[42px]">
        {selectedSedes.map(s => (
          <span
            key={s._id}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-sm rounded-full"
          >
            {s.nombre}
            <button
              type="button"
              onClick={() => remove(s._id)}
              className="hover:text-red-600 leading-none text-sm"
            >
              ✕
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={e => {
            if (e.key === "Enter" && filtered.length > 0) {
              e.preventDefault();
              add(filtered[0]._id);
            }
            if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
              remove(value[value.length - 1]);
            }
          }}
          placeholder={value.length === 0 ? "Buscar sede..." : ""}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
        />
      </div>
      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
          {filtered.map(s => (
            <li
              key={s._id}
              onClick={() => add(s._id)}
              className="px-3 py-2 text-sm hover:bg-brand-primary/10 cursor-pointer transition-colors"
            >
              {s.nombre}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
