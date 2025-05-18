import { Avatar } from '@/Components/UI/avatar';
import { Button } from '@/Components/UI/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/Components/UI/dialog';
import { Input } from '@/Components/UI/input';
import axios from 'axios';
import { MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CommentSection({ post, onCommentAdded }) {
    const [isOpen, setIsOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [localCommentsCount, setLocalCommentsCount] = useState(
        post.comments_count || 0,
    ); // Estado local para el contador

    useEffect(() => {
        if (post?.comments) {
            setComments(post.comments);
        }
    }, [post]);

    const commentsCount = post.comments_count || 0;

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(`/posts/${post.id}/comments`, {
                content: newComment,
            });

            if (response.data.success) {
                setComments([...comments, response.data.comment]);
                setNewComment('');
                // Actualiza el contador local
                setLocalCommentsCount((prev) => prev + 1);
                if (onCommentAdded) onCommentAdded();
            }
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
        }
    };

    const isCommentEmpty = !newComment.trim();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderComment = (comment) => {
        return (
            <div key={comment.id} className="mb-4 flex gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                    <img
                        src={
                            comment.user?.profile_picture ||
                            '/images/avatar-default.png'
                        }
                        alt={comment.user?.name || 'Usuario'}
                        className="h-full w-full rounded-full object-cover"
                    />
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold">
                            {comment.user?.name || 'Usuario'}
                        </h4>
                        <span className="text-xs text-gray-500">
                            {formatDate(comment.created_at)}
                        </span>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>

                    {comment.replies?.length > 0 && (
                        <div className="mt-3 border-l-2 border-gray-200 pl-4">
                            {comment.replies.map((reply) => (
                                <div key={reply.id}>{renderComment(reply)}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
            >
                <MessageSquare className="h-5 w-5" />
                <span className="min-w-[20px] text-center text-sm">
                    {localCommentsCount}
                </span>
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            Comentarios ({localCommentsCount})
                        </DialogTitle>
                        <DialogDescription>
                            Comentarios de la publicación
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[400px] overflow-y-auto">
                        {comments.length > 0 ? (
                            comments.map(renderComment)
                        ) : (
                            <p className="py-4 text-center text-gray-500">
                                No hay comentarios aún
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe un comentario..."
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleAddComment()
                            }
                        />
                        <Button
                            onClick={handleAddComment}
                            disabled={isCommentEmpty}
                            className={
                                isCommentEmpty
                                    ? 'cursor-not-allowed opacity-50'
                                    : ''
                            }
                        >
                            Enviar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
