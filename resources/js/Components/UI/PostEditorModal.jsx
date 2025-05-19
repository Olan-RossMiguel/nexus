import { FileText, Image, Video, X } from 'lucide-react';
import { useState } from 'react';

export function PostEditorModal({ post, onClose, onSave }) {
    const [content, setContent] = useState(post.content_text);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null); // <-- Añade este estado

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null); // Resetea el error al enviar

        try {
            await onSave({
                ...post,
                content_text: content,
            });
            onClose();
        } catch (error) {
            setError(error.message || 'Error al guardar los cambios'); // Establece el mensaje de error
            console.error('Error al editar:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>

                <h2 className="mb-4 text-xl font-semibold">
                    Editar publicación
                </h2>

                <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows={4}
                        placeholder="Escribe tu actualización aquí..."
                        required
                    />

                    {post.media_url && (
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                            {post.media_type === 'image' && (
                                <Image className="mr-2 h-4 w-4" />
                            )}
                            {post.media_type === 'pdf' && (
                                <FileText className="mr-2 h-4 w-4" />
                            )}
                            {post.media_type === 'video' && (
                                <Video className="mr-2 h-4 w-4" />
                            )}
                            <span>
                                Archivo adjunto:{' '}
                                {post.media_url.split('/').pop()}
                            </span>
                        </div>
                    )}

                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
