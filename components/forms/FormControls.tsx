
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, FolderPlusIcon } from '../icons/IconComponents';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 ${props.className || ''}`}
    />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        rows={4}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
     <select
        {...props}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    >
        {props.children}
    </select>
);

export const FormField: React.FC<{ label: string; id: string; children: React.ReactNode }> = ({ label, id, children }) => (
    <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);

// Novo Componente: Select Pesquisável e Criável
interface Option {
    id: number | string;
    nome: string;
}

interface CreatableSelectProps {
    id: string;
    value: string | number;
    options: Option[];
    onChange: (value: string | number) => void;
    onCreate: (newItemName: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const CreatableSelect: React.FC<CreatableSelectProps> = ({ id, value, options, onChange, onCreate, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Encontra o nome do item selecionado para exibir
    const selectedItem = options.find(opt => String(opt.id) === String(value));
    
    // Atualiza o termo de busca quando o valor muda externamente
    useEffect(() => {
        if (selectedItem) {
            setSearchTerm(selectedItem.nome);
        } else if (!value) {
            setSearchTerm('');
        }
    }, [value, selectedItem]);

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Se fechou e não selecionou nada válido, reseta o texto para o valor atual ou vazio
                if (selectedItem) {
                    setSearchTerm(selectedItem.nome);
                } else {
                    setSearchTerm('');
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedItem]);

    const filteredOptions = options.filter(opt => 
        opt.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (opt: Option) => {
        onChange(opt.id);
        setSearchTerm(opt.nome);
        setIsOpen(false);
    };

    const handleCreate = () => {
        if (searchTerm.trim()) {
            onCreate(searchTerm.trim());
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    id={id}
                    placeholder={placeholder || "Selecione ou digite..."}
                    value={searchTerm}
                    disabled={disabled}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                        // Se o usuário limpar o campo, limpa o valor selecionado
                        if (e.target.value === '') {
                            onChange('');
                        }
                    }}
                    onFocus={() => !disabled && setIsOpen(true)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none mt-1">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </div>
            </div>

            {isOpen && !disabled && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                            <li
                                key={opt.id}
                                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-100 text-gray-900"
                                onClick={() => handleSelect(opt)}
                            >
                                <span className={`block truncate ${String(value) === String(opt.id) ? 'font-semibold' : 'font-normal'}`}>
                                    {opt.nome}
                                </span>
                            </li>
                        ))
                    ) : null}

                    {/* Opção de Criar Novo se não houver match exato */}
                    {searchTerm && !filteredOptions.find(o => o.nome.toLowerCase() === searchTerm.toLowerCase()) && (
                        <li
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 bg-green-50 text-green-700 hover:bg-green-100 border-t border-gray-100"
                            onClick={handleCreate}
                        >
                            <div className="flex items-center font-medium">
                                <FolderPlusIcon className="w-4 h-4 mr-2" />
                                Adicionar "{searchTerm}"
                            </div>
                        </li>
                    )}
                    
                    {filteredOptions.length === 0 && !searchTerm && (
                        <li className="text-gray-500 cursor-default select-none relative py-2 pl-3 pr-9">
                            Digite para buscar...
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};
