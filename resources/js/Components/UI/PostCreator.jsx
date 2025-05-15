import { useForm, usePage } from '@inertiajs/react';
import {
    FileIcon,
    FileTextIcon,
    FileVideo2Icon,
    ImageIcon,
    XIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { Card } from './card';
import { Textarea } from './textarea';

export const PostCreator = ({ onPostCreated }) => {
    const { auth } = usePage().props; // <<--- Aquí obtenemos al usuario autenticado
    const fileInputRef = useRef(null);
    const [mediaPreview, setMediaPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        content_text: '',
        media_url: null,
        media_type: null,
    });

    const getMediaType = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        const mimeType = file.type;

        if (mimeType.startsWith('image/')) {
            return mimeType.includes('gif') ? 'gif' : 'image';
        }

        switch (extension) {
            case 'pdf':
                return 'pdf';
            case 'mp4':
            case 'mov':
                return 'video';
            default:
                return 'file';
        }
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert('El archivo no puede exceder los 10MB');
            return;
        }

        setData({
            ...data,
            media_url: file,
            media_type: getMediaType(file),
        });

        if (file.type.startsWith('image/')) {
            setMediaPreview(URL.createObjectURL(file));
        } else {
            setMediaPreview(null);
        }
    };

    const removeMedia = () => {
        if (mediaPreview) URL.revokeObjectURL(mediaPreview);
        setData({ ...data, media_url: null, media_type: null });
        setMediaPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handlePostSubmit = (e) => {
        e.preventDefault();

        if (!data.content_text.trim() && !data.media_url) {
            alert('Debes agregar contenido o un archivo');
            return;
        }

        const formData = new FormData();
        formData.append('content_text', data.content_text);
        if (data.media_url) {
            formData.append('media_url', data.media_url);
        }

        const tempId = Date.now().toString(36);

        post(route('posts.store'), {
            data: formData,
            preserveScroll: true,
            forceFormData: true,

            onBefore: () => {
                if (onPostCreated) {
                    onPostCreated({
                        id: tempId,
                        content_text: data.content_text,
                        created_at: new Date().toISOString(),
                        user: auth.user, // <<--- Usamos el usuario autenticado
                        isOptimistic: true,
                        media_url: data.media_url
                            ? {
                                  preview: mediaPreview,
                                  type: getMediaType(data.media_url),
                              }
                            : null,
                    });
                }
            },

            // Cambia el onSuccess para incluir el ID real si viene del servidor
            onSuccess: (response) => {
                reset();
                setData({
                    content_text: '', // Limpia el texto
                    media_url: null, // Limpia el archivo
                    media_type: null, // Limpia el tipo
                });
                setMediaPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';

                if (onPostCreated) {
                    onPostCreated({
                        action: 'update',
                        tempId,
                        updates: {
                            isOptimistic: false,
                            id: response.props?.flash?.newPost?.id || null, // Añade el ID real si existe
                        },
                    });
                }
            },

            onError: () => {
                console.error('Error al publicar');
                if (onPostCreated) {
                    onPostCreated({ action: 'remove', tempId });
                }
            },

            onFinish: () => {
                if (data.media_url) {
                    URL.revokeObjectURL(mediaPreview);
                }
            },
        });
    };

    return (
        <Card className="mb-6 shadow-sm">
            <div className="p-4">
                <form onSubmit={handlePostSubmit}>
                    <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={
                                    auth.user.avatar_url ||
                                    '/default-avatar.png'
                                } // Muestra el avatar del usuario
                                alt={auth.user.name}
                            />
                            <AvatarFallback>
                                {auth.user.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-3">
                            <Textarea
                                placeholder="Comparte tus hallazgos científicos..."
                                className="min-h-[100px] text-gray-700"
                                value={data.content_text}
                                onChange={(e) =>
                                    setData('content_text', e.target.value)
                                }
                                disabled={processing}
                            />

                            <div className="flex items-center gap-2 border-t pt-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleMediaChange}
                                    accept="image/*,video/*,.pdf"
                                    className="hidden"
                                    id="media-upload"
                                    disabled={processing}
                                />

                                <label
                                    htmlFor="media-upload"
                                    className={`cursor-pointer rounded-full p-2 ${
                                        processing
                                            ? 'opacity-50'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <FileIcon className="h-5 w-5 text-gray-500" />
                                </label>

                                <label
                                    htmlFor="media-upload"
                                    className={`cursor-pointer rounded-full p-2 ${
                                        processing
                                            ? 'opacity-50'
                                            : 'hover:bg-blue-50'
                                    }`}
                                    onClick={() =>
                                        document
                                            .getElementById('media-upload')
                                            .setAttribute('accept', 'image/*')
                                    }
                                >
                                    <ImageIcon className="h-5 w-5 text-blue-500" />
                                </label>

                                <label
                                    htmlFor="media-upload"
                                    className={`cursor-pointer rounded-full p-2 ${
                                        processing
                                            ? 'opacity-50'
                                            : 'hover:bg-red-50'
                                    }`}
                                    onClick={() =>
                                        document
                                            .getElementById('media-upload')
                                            .setAttribute('accept', 'video/*')
                                    }
                                >
                                    <FileVideo2Icon className="h-5 w-5 text-red-500" />
                                </label>

                                <label
                                    htmlFor="media-upload"
                                    className={`cursor-pointer rounded-full p-2 ${
                                        processing
                                            ? 'opacity-50'
                                            : 'hover:bg-green-50'
                                    }`}
                                    onClick={() =>
                                        document
                                            .getElementById('media-upload')
                                            .setAttribute('accept', '.pdf')
                                    }
                                >
                                    <FileTextIcon className="h-5 w-5 text-green-500" />
                                </label>
                            </div>

                            {mediaPreview && (
                                <div className="relative mt-2">
                                    <img
                                        src={mediaPreview}
                                        className="max-h-60 w-full rounded-md border object-contain"
                                        alt="Vista previa"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeMedia}
                                        className="absolute right-2 top-2 rounded-full bg-white/80 p-1 shadow hover:bg-white"
                                        disabled={processing}
                                    >
                                        <XIcon className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            )}

                            {data.media_url && !mediaPreview && (
                                <div className="mt-2 flex items-center justify-between rounded-md border bg-gray-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <FileIcon className="h-5 w-5 text-gray-500" />
                                        <span className="max-w-xs truncate text-sm">
                                            {data.media_url.name}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeMedia}
                                        disabled={processing}
                                    >
                                        <XIcon className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="bg-blue-600 px-6 text-white hover:bg-blue-700"
                                    disabled={
                                        (!data.content_text.trim() &&
                                            !data.media_url) ||
                                        processing
                                    }
                                >
                                    {processing ? 'Publicando...' : 'Publicar'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Card>
    );
};
