import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PostCreator } from '@/Components/UI/PostCreator';  // Importación por defecto
import { FileIcon } from "lucide-react";
import { Card } from "@/Components/UI/card"; // Importación correcta para shadcn
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/UI/avatar"; // Importación completa
import { Button } from "@/Components/UI/button"; // Importación correcta
import { useState } from "react";

// Asegúrate de que Avatar tenga internamente AvatarImage y AvatarFallback exportados o los importas por separado si están aparte

export default function Index({ posts: initialPosts = [] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setRefreshKey(prev => prev + 1);
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
      case "image":
      case "gif":
        return (
          <img
            src={mediaUrl}
            className="mt-3 w-full max-h-96 object-contain border rounded-md"
            alt="Media"
          />
        );
      case "video":
        return (
          <video
            controls
            src={mediaUrl}
            className="mt-3 w-full border rounded-md"
          />
        );
      case "pdf":
        return (
          <div className="mt-3 flex items-center p-3 bg-gray-50 rounded-md border hover:bg-gray-100">
            <FileIcon className="h-5 w-5 text-red-500 mr-3" />
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
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <PostCreator onPostCreated={handlePostCreated} />

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={`${post.id}-${refreshKey}`} className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <img
                      src={post.user?.avatar || '/default-avatar.png'}
                      alt="avatar"
                      className="rounded-full"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{post.user?.name || 'Usuario'}</h3>
                      <span className="text-xs text-gray-500">
                        {post.created_at ? formatDate(post.created_at) : 'Ahora'}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700 whitespace-pre-line">
                      {post.content_text}
                    </p>
                    {renderMedia(post)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12 text-center">
            <p className="text-gray-500">No hay publicaciones aún</p>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
