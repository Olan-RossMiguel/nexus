import { router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export const LikeButton = ({ post }) => {
    console.log('Post data:', post); 
    const { auth } = usePage().props;
    const [isLiked, setIsLiked] = useState(post.is_liked ?? false);
    const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleLike = () => {
        if (post.isOptimistic || typeof post.id === 'string') return;
        if (!auth.user || isProcessing) return;

        // Guardar estado original para posible reversión
        const originalState = { isLiked, likesCount };

        // Optimistic UI update
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        setIsProcessing(true);

        router.post(
            route('posts.like', post.id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    // Sincronizar con la respuesta del servidor
                    if (page.props.flash?.likeStatus) {
                        setIsLiked(page.props.flash.likeStatus.liked);
                        setLikesCount(page.props.flash.likeStatus.likes_count);
                    }
                    setIsProcessing(false);
                },
                onError: (errors) => {
                    // Revertir en caso de error
                    setIsLiked(originalState.isLiked);
                    setLikesCount(originalState.likesCount);
                    setIsProcessing(false);

                    console.error('Error al actualizar like:', errors);
                },
            },
        );
    };

    return (
        <button
            onClick={handleLike}
            disabled={isProcessing || !auth.user}
            className={`flex items-center gap-1 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
            } transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50`}
            aria-label={isLiked ? 'Quitar like' : 'Dar like'}
            title={!auth.user ? 'Inicia sesión para dar like' : ''}
        >
            <Heart
                className="h-5 w-5"
                fill={isLiked ? 'currentColor' : 'none'}
                strokeWidth={isLiked ? 1.5 : 2}
            />
            <span className="min-w-[20px] text-center text-sm">
                {likesCount}
            </span>
        </button>
    );
};