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
import { Edit, MessageSquare, Reply, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function CommentSection({ post, onCommentAdded }) {
    const [isOpen, setIsOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [localCommentsCount, setLocalCommentsCount] = useState(
        post.comments_count || 0,
    );
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (post?.comments) {
            setComments(post.comments);
        }
    }, [post]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, replyingTo]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const payload = {
                content: newComment,
                parent_comment_id: replyingTo?.id || null,
            };

            const response = await axios.post(
                `/posts/${post.id}/comments`,
                payload,
            );

            if (response.data.success) {
                const newCommentData = response.data.comment;

                if (replyingTo) {
                    // Actualizar el comentario padre para incluir la respuesta
                    setComments((prev) =>
                        prev.map((comment) => {
                            if (comment.id === replyingTo.id) {
                                return {
                                    ...comment,
                                    replies: [
                                        ...(comment.replies || []),
                                        newCommentData,
                                    ],
                                };
                            }
                            return comment;
                        }),
                    );
                } else {
                    // Añadir nuevo comentario principal
                    setComments([...comments, newCommentData]);
                }

                setNewComment('');
                setReplyingTo(null);
                setLocalCommentsCount((prev) => prev + 1);
                onCommentAdded?.();
            }
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
        }
    };

    const handleReply = (comment) => {
        setReplyingTo(comment);
        setEditingComment(null);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleEdit = (comment) => {
        setEditingComment(comment);
        setEditContent(comment.content);
        setReplyingTo(null);
    };

    const handleUpdateComment = async () => {
        if (!editContent.trim() || !editingComment) return;

        try {
            const response = await axios.put(`/comments/${editingComment.id}`, {
                content: editContent,
            });

            if (response.data.success) {
                setComments((prev) =>
                    prev.map((comment) => {
                        if (comment.id === editingComment.id) {
                            return { ...comment, content: editContent };
                        }

                        // Buscar en respuestas también
                        if (
                            comment.replies?.some(
                                (reply) => reply.id === editingComment.id,
                            )
                        ) {
                            return {
                                ...comment,
                                replies: comment.replies.map((reply) =>
                                    reply.id === editingComment.id
                                        ? { ...reply, content: editContent }
                                        : reply,
                                ),
                            };
                        }

                        return comment;
                    }),
                );

                setEditingComment(null);
                setEditContent('');
            }
        } catch (error) {
            console.error('Error al actualizar el comentario:', error);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este comentario?'))
            return;

        try {
            const response = await axios.delete(`/comments/${commentId}`);

            if (response.data.success) {
                setComments((prev) => {
                    // Eliminar comentario principal
                    const filtered = prev.filter((c) => c.id !== commentId);

                    // Eliminar comentario de las respuestas si está ahí
                    return filtered.map((comment) => ({
                        ...comment,
                        replies:
                            comment.replies?.filter(
                                (reply) => reply.id !== commentId,
                            ) || [],
                    }));
                });

                setLocalCommentsCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error al eliminar el comentario:', error);
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

    const renderCommentActions = (comment, isReply = false) => {
        // Verificación más robusta del usuario
        const currentUserId = window.authUser?.id;
        const commentUserId = comment.user?.id;
        
        console.log('Comparación de usuarios:', {
            currentUserId,
            commentUserId,
            match: currentUserId === commentUserId
        });
    
        const isCurrentUserComment = currentUserId === commentUserId;
    
        return (
            <div className={`mt-1 flex gap-2 ${isReply ? 'ml-14' : ''}`}>
                <button
                    onClick={() => handleReply(comment)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500"
                >
                    <Reply className="h-3 w-3" />
                    Responder
                </button>
    
                {isCurrentUserComment && (
                    <>
                        <button
                            onClick={() => handleEdit(comment)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-yellow-500"
                        >
                            <Edit className="h-3 w-3" />
                            Editar
                        </button>
                        <button
                            onClick={() => handleDelete(comment.id)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
                        >
                            <Trash2 className="h-3 w-3" />
                            Eliminar
                        </button>
                    </>
                )}
            </div>
        );
    };

    const renderComment = (comment, isReply = false) => {
        if (editingComment?.id === comment.id) {
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
                        <div className="mt-2 flex gap-2">
                            <Input
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="flex-1"
                            />
                            <Button onClick={handleUpdateComment}>
                                Guardar
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setEditingComment(null)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

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

                    {renderCommentActions(comment, isReply)}

                    {comment.replies?.length > 0 && (
                        <div className="mt-3 border-l-2 border-gray-200 pl-4">
                            {comment.replies.map((reply) => (
                                <div key={reply.id}>
                                    {renderComment(reply, true)}
                                </div>
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

            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setReplyingTo(null);
                        setEditingComment(null);
                    }
                    setIsOpen(open);
                }}
            >
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
                            comments.map((comment) => renderComment(comment))
                        ) : (
                            <p className="py-4 text-center text-gray-500">
                                No hay comentarios aún
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        {replyingTo && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>
                                    Respondiendo a{' '}
                                    {replyingTo.user?.name || 'Usuario'}
                                </span>
                                <button
                                    onClick={() => setReplyingTo(null)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Input
                                ref={inputRef}
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
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
