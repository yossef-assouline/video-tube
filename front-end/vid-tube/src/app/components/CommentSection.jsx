import { useActionStore } from "../store/actionStore";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import LikeButton from "./LikeButton";

export default function CommentSection({ videoId }) {
  const {
    comments,
    getVideoComments,
    postComment,
    commentLoading,
    error,
    deleteComment,
    updateComment,
    toggleCommentLike,
  } = useActionStore();
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    getVideoComments(videoId);
  }, [videoId]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">
        Comments ({comments?.totaldocs || 0})
      </h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (newComment.trim()) {
            await postComment(videoId, newComment);
            getVideoComments(videoId);
            setNewComment("");
          }
          toast.success("Comment added successfully");
        }}
        className="mb-6"
      >
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Add a comment..."
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          maxLength={100}
          minLength={1}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={commentLoading || !newComment.trim()}
            className={`px-4 py-2 rounded-lg transition ${
              !newComment.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
          >
            {commentLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments?.videoComments?.length > 0 ? (
          comments.videoComments.map((comment) => (
            <div key={comment._id} className="border-b pb-4 group relative">
              <div className="flex items-start gap-3">
                <img
                  onClick={() =>
                    router.push(`/c/${comment.userDetails[0]?.username}`)
                  }
                  src={comment.userDetails[0]?.avatar}
                  alt={comment.userDetails[0]?.username}
                  className="w-10 h-10 rounded-full hover:cursor-pointer"
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold hover:cursor-pointer hover:text-emerald-500"
                        onClick={() =>
                          router.push(`/c/${comment.userDetails[0]?.username}`)
                        }
                      >
                        {comment.userDetails[0]?.username}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {user?._id === comment.owner && (
                      <div className="hidden group-hover:flex items-center gap-2 absolute right-2 top-0 bg-white px-2 py-1 rounded-lg shadow-sm">
                        {editingCommentId === comment._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditedContent("");
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={async () => {
                                setEditingCommentId(null);
                                await updateComment(comment._id, editedContent);
                                getVideoComments(videoId);
                                if (!commentLoading) {
                                  toast.success("Comment updated successfully");
                                }
                              }}
                              className="text-emerald-500 hover:text-emerald-600"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingCommentId(comment._id);
                                setEditedContent(comment.content);
                              }}
                              className="text-gray-500 hover:text-emerald-500"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={async () => {
                                await deleteComment(comment._id);
                                getVideoComments(videoId);
                                toast.success("Comment deleted successfully");
                              }}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment._id ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      rows="2"
                    />
                  ) : (
                    <>
                      <p className="mt-1">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <LikeButton
                          initialLikes={comment.likes || 0}
                          isInitiallyLiked={comment.isLiked}
                          onLike={() => {
                            toggleCommentLike(comment._id);                    
                          }}
                          size="small"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No comments yet</p>
        )}
      </div>
    </div>
  );
}
