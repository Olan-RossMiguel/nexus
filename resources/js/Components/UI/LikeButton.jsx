import { Heart, HeartFilled } from '@/Components/UI/icons';
import { useForm, usePage } from '@inertiajs/react';

export const LikeButton = ({ post }) => {
    const { auth } = usePage().props;
    const { post, processing } = useForm();

    const handleLike = () => {
        post(route('posts.like', post.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Actualización optimista
                post.is_liked = !post.is_liked;
                post.likes_count += post.is_liked ? 1 : -1;
            }
        });
    };

    return (
        <button 
            onClick={handleLike}
            disabled={processing}
            className="flex items-center gap-1 text-gray-500 hover:text-red-500"
        >
            {post.is_liked ? (
                <HeartFilled className="h-5 w-5 text-red-500" />
            ) : (
                <Heart className="h-5 w-5" />
            )}
            <span>{post.likes_count}</span>
        </button>
    );
};