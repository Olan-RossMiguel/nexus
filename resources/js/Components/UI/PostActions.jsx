import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function PostActions({ post, onEdit, onDelete }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block">
            {/* Botón de tres puntos - Versión garantizada */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="rounded-full p-1 hover:bg-gray-200 focus:outline-none"
                aria-label="Menú de opciones"
            >
                {/* Versión garantizada de tres puntos */}
                <span className="block text-xl leading-4 text-gray-600">⋯</span>
            </button>

            {/* Menú desplegable */}
            {isOpen && (
                <div
                    className="absolute right-0 z-50 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="py-1">
                        <button
                            onClick={() => {
                                onEdit(post);
                                setIsOpen(false);
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Edit className="mr-2 h-4 w-4 text-blue-600" />
                            Editar publicación
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('¿Eliminar esta publicación?')) {
                                    onDelete(post.id);
                                }
                                setIsOpen(false);
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar publicación
                        </button>
                    </div>
                </div>
            )}

            {/* Fondo para cerrar al hacer clic fuera */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
