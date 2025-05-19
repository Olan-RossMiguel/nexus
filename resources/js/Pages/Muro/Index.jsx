import { Avatar } from '@/Components/UI/avatar';
import { Card } from '@/Components/UI/card';
import { CommentSection } from '@/Components/UI/CommentSection';
import { LikeButton } from '@/Components/UI/LikeButton';
import { PostActions } from '@/Components/UI/PostActions';
import { PostCreator } from '@/Components/UI/PostCreator';
import { PostEditorModal } from '@/Components/UI/PostEditorModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { FileIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const DEFAULT_AVATAR =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjODg4IiBmb250LXNpemU9IjQwIj5VPC90ZXh0Pjwvc3ZnPg==';

export default function Index({ posts: initialPosts = [] }) {
    const { user } = usePage().props;
    const [posts, setPosts] = useState(initialPosts);
    const [isConnected, setIsConnected] = useState(false);
    const echoInstance = useRef(window.Echo);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        if (!echoInstance.current) {
            console.error('Echo no está disponible');
            return;
        }

        const channel = echoInstance.current.channel('public-posts');

        const handleNewPost = (data) => {
            const newPost = data.post;
            setPosts((prev) => {
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
                        tempId: undefined,
                        user: newPost.user ||
                            updatedPosts[existingIndex].user ||
                            authUser || { id: null },
                    };
                    return updatedPosts;
                }

                return [
                    {
                        ...newPost,
                        user: newPost.user || authUser || { id: null },
                    },
                    ...prev,
                ];
            });
        };

        channel.listen('.new.post', handleNewPost).error(console.error);

        const handleConnected = () => setIsConnected(true);
        const handleDisconnected = () => setIsConnected(false);

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
    }, [user]);

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
                              user: newPostOrAction.updates.user ||
                                  post.user ||
                                  authUser || { id: null },
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
                user: newPostOrAction.user || authUser || { id: null },
                isOptimistic: true,
            };
            setPosts((prev) => [completePost, ...prev]);
        }
    };

    const handleSaveEdit = async (updatedPost) => {
        try {
            const response = await axios.put(
                `/posts/${updatedPost.id}`,
                {
                    content_text: updatedPost.content_text,
                },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            );

            // Actualiza el estado local
            setPosts(
                posts.map((p) =>
                    p.id === updatedPost.id
                        ? { ...p, content_text: updatedPost.content_text }
                        : p,
                ),
            );

            setEditingPost(null);
        } catch (error) {
            console.error('Error detallado:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });

            alert(error.response?.data?.message || 'Error al guardar cambios');
        }
    };

    const handleEditPost = (post) => {
        console.log('Editando post:', post.id); // Para debug
        setEditingPost(post); // Abre el modal de edición
    };

    const handleDeletePost = async (postId) => {
        if (!confirm('¿Eliminar esta publicación permanentemente?')) return;

        try {
            // Opción 1: Usando axios (funcional)
            const response = await axios.delete(`/posts/${postId}`);

            if (response.data.success) {
                setPosts(posts.filter((post) => post.id !== postId));
            } else {
                throw new Error(response.data.message || 'Error al eliminar');
            }

            /* 
            // Opción 2: Usando Inertia (alternativa)
            router.delete(`/posts/${postId}`, {
                onSuccess: () => setPosts(posts.filter(post => post.id !== postId)),
                preserveScroll: true
            });
            */
        } catch (error) {
            console.error('Error al eliminar:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            alert(
                'Error al eliminar: ' +
                    (error.response?.data?.message || error.message),
            );
        }
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
        if (!dateString) return 'Enviando...';
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
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
                                            alt={post.user?.name || 'Avatar'}
                                            onError={(e) => {
                                                e.target.src = DEFAULT_AVATAR;
                                                e.target.alt =
                                                    'Avatar por defecto';
                                            }}
                                        />
                                    </Avatar>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">
                                                {post.user?.name || 'Usuario'}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(
                                                        post.created_at,
                                                    )}
                                                </span>

                                                <div className="ml-2">
                                                    {console.log(
                                                        'Render PostActions for:',
                                                        post.id,
                                                    )}
                                                    {String(post.user?.id) ===
                                                        String(user?.id) && (
                                                        <div className="relative ml-2">
                                                            {/* Debug visual */}

                                                            <PostActions
                                                                post={post}
                                                                onEdit={
                                                                    handleEditPost
                                                                }
                                                                onDelete={
                                                                    handleDeletePost
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

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
                                <div className="mt-3 flex gap-4 border-t pt-3">
                                    <LikeButton post={post} />
                                    <CommentSection post={post} />
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
            {editingPost && (
                <PostEditorModal
                    post={editingPost}
                    onClose={() => setEditingPost(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </AuthenticatedLayout>
    );
}
