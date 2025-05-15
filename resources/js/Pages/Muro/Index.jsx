// ... imports
import { Avatar } from '@/Components/UI/avatar';
import { Card } from '@/Components/UI/card';
import { PostCreator } from '@/Components/UI/PostCreator';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import { FileIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Index({ posts: initialPosts = [] }) {
    const { user } = usePage().props;
    const [posts, setPosts] = useState(initialPosts);
    const [isConnected, setIsConnected] = useState(false);
    const echoInstance = useRef(window.Echo);

    useEffect(() => {
        if (!echoInstance.current) {
            console.error('Echo no está disponible');
            return;
        }

        const channel = echoInstance.current.channel('public-posts');

        const handleNewPost = (data) => {
            const newPost = data.post;
            setPosts((prev) => {
                // Busca coincidencia por tempId O por id
                const existingIndex = prev.findIndex(
                    (p) =>
                        p.tempId === newPost.tempId ||
                        (p.id && newPost.id && p.id === newPost.id),
                );

                if (existingIndex > -1) {
                    const updatedPosts = [...prev];
                    updatedPosts[existingIndex] = {
                        ...newPost,
                        isOptimistic: false,
                        tempId: undefined, // Eliminamos el tempId
                    };
                    return updatedPosts;
                }

                return [newPost, ...prev];
            });
            console.log('Nuevo post recibido:', newPost);
        };

        channel.listen('.new.post', handleNewPost).error((error) => {
            console.error('Error de conexión al canal:', error);
        });

        const handleConnected = () => {
            setIsConnected(true);
            console.log('Conectado a Pusher');
        };

        const handleDisconnected = () => {
            setIsConnected(false);
            console.warn('Desconectado de Pusher');
        };

        echoInstance.current.connector.pusher.connection.bind(
            'connected',
            handleConnected,
        );
        echoInstance.current.connector.pusher.connection.bind(
            'disconnected',
            handleDisconnected,
        );

        return () => {
            channel.stopListening('.new.post', handleNewPost);
            echoInstance.current?.leave('public-posts');
            echoInstance.current?.connector.pusher.connection.unbind(
                'connected',
                handleConnected,
            );
            echoInstance.current?.connector.pusher.connection.unbind(
                'disconnected',
                handleDisconnected,
            );
        };
    }, []);

    // ✅ Versión final de handlePostCreated
    const handlePostCreated = (newPostOrAction) => {
        if (newPostOrAction.action === 'remove') {
            setPosts((prev) =>
                prev.filter((p) => p.tempId !== newPostOrAction.tempId),
            );
        } else if (newPostOrAction.action === 'update') {
            setPosts((prev) =>
                prev.map((post) =>
                    post.tempId === newPostOrAction.tempId
                        ? {
                              ...post,
                              ...newPostOrAction.updates,
                              isOptimistic: false,
                              ...(newPostOrAction.updates.id && {
                                  id: newPostOrAction.updates.id,
                                  tempId: undefined,
                              }),
                          }
                        : post,
                ),
            );
        } else {
            const completePost = {
                ...newPostOrAction,
                user: newPostOrAction.user || user,
                isOptimistic: true,
            };
            setPosts((prev) => [completePost, ...prev]);
        }
        console.log('Acción en post:', newPostOrAction);
    };

    const getMediaUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const parts = path.split('/');
        const filename = parts.pop();
        const userId = parts.pop();
        return `/private/media/${userId}/${filename}`;
    };

    const renderMedia = (post) => {
        if (!post.media_url) return null;
        const mediaUrl = getMediaUrl(post.media_url);

        switch (post.media_type) {
            case 'image':
            case 'gif':
                return (
                    <img
                        src={mediaUrl}
                        className="mt-3 max-h-96 w-full rounded-md border object-contain"
                        alt="Contenido multimedia"
                        onError={(e) => (e.target.style.display = 'none')}
                    />
                );
            case 'video':
                return (
                    <video
                        controls
                        src={mediaUrl}
                        className="mt-3 w-full rounded-md border"
                    />
                );
            case 'pdf':
                return (
                    <div className="mt-3 flex items-center rounded-md border bg-gray-50 p-3 hover:bg-gray-100">
                        <FileIcon className="mr-3 h-5 w-5 text-red-500" />
                        <a
                            href={mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            Ver documento
                        </a>
                    </div>
                );
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="mx-auto max-w-4xl space-y-6 p-4">
                {!isConnected && (
                    <div className="rounded bg-yellow-100 p-2 text-sm text-yellow-800">
                        Conectando a actualizaciones en tiempo real...
                    </div>
                )}

                <PostCreator onPostCreated={handlePostCreated} />

                {posts.length > 0 ? (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <Card
                                key={post.id || `temp-${post.tempId}`}
                                className={`p-4 ${post.isOptimistic && !post.id ? 'opacity-75' : ''}`}
                            >
                                <div className="flex items-start space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <img
                                            src={
                                                post.user?.profile_picture ||
                                                '/images/default-avatar.png'
                                            }
                                            alt="Avatar"
                                            onError={(e) => {
                                                e.target.src =
                                                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjODg4IiBmb250LXNpemU9IjQwIj5VPC90ZXh0Pjwvc3ZnPg==';
                                                e.target.alt =
                                                    'Avatar por defecto';
                                            }}
                                        />
                                    </Avatar>
                                    
                                    <div className="min-w-0 flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold">
                                                {post.user?.name || 'Usuario'}
                                            </h3>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(post.created_at) ||
                                                    'Enviando...'}
                                            </span>
                                        </div>

                                        {/* TEXTO DEL POST - SOLUCIÓN APLICADA */}
                                        <div className="mt-1 w-full">
                                            <p className="overflow-x-hidden whitespace-pre-wrap break-words text-gray-700">
                                                {post.content_text}
                                            </p>
                                        </div>

                                        {renderMedia(post)}
                                        {post.isOptimistic && !post.id && (
                                            <div className="mt-2 text-xs italic text-gray-500">
                                                Publicando...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="py-12 text-center">
                        <p className="text-gray-500">
                            No hay publicaciones aún
                        </p>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
