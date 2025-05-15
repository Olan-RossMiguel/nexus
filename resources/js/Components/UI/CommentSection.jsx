import { useForm, usePage } from '@inertiajs/react';
import { Avatar } from './avatar';

export const CommentSection = ({ post }) => {
    const { auth } = usePage().props;
    const { data, setData, post: submitComment, processing } = useForm({
        content: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        submitComment(route('posts.comment', post.id), {
            preserveScroll: true,
            onSuccess: () => setData('content', '')
        };
    };

    return (
        <div className="mt-3 border-t pt-3">
            <div className="max-h-40 overflow-y-auto space-y-3 mb-3">
                {post.comments?.map(comment => (
                    <div key={comment.id} className="flex gap-2">
                        <Avatar className="h-8 w-8" src={comment.user.profile_picture} />
                        <div className="bg-gray-100 rounded-lg p-2 flex-1">
                            <p className="font-medium">{comment.user.name}</p>
                            <p>{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Avatar className="h-8 w-8" src={auth.user.profile_picture} />
                <input
                    type="text"
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="flex-1 border rounded-full px-4 py-1 text-sm"
                    disabled={processing}
                />
            </form>
        </div>
    );
};