import { useActionStore } from "../store/actionStore";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CommentsSection({ videoId }) {
  const { comments, getVideoComments, postComment, commentLoading, error } = useActionStore();
  const [newComment, setNewComment] = useState("");
  const router = useRouter();
  useEffect(() => {
    getVideoComments(videoId);
    console.log(error);
  }, [videoId]);

  


  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments ({comments?.totaldocs || 0})</h3>
      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          if (newComment.trim()) {
            await postComment(videoId, newComment);
            getVideoComments(videoId);
            setNewComment('');
          }
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
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
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
            <div key={comment._id} className="border-b pb-4">
              <div className="flex items-start gap-3">
                <img 
                  onClick={() => router.push(`/c/${comment.userDetails[0]?.username}`)}
                  src={comment.userDetails[0]?.avatar} 
                  alt={comment.userDetails[0]?.username}
                  className="w-10 h-10 rounded-full hover:cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold hover:cursor-pointer hover:text-emerald-500" onClick={() => router.push(`/c/${comment.userDetails[0]?.username}`)}>
                      {comment.userDetails[0]?.username}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1">{comment.content}</p>
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