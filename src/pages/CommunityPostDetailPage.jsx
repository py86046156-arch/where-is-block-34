import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Send, 
  ShieldAlert,
  Compass
} from 'lucide-react';
import { loadCommunityPosts, saveCommunityPosts } from '../data/communityData';

export default function CommunityPostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(() => loadCommunityPosts());
  const [newComment, setNewComment] = useState('');
  const [reported, setReported] = useState(false);

  const post = useMemo(() => {
    return posts.find(p => p.id === postId) || null;
  }, [posts, postId]);

  const updatePosts = (updatedList) => {
    setPosts(updatedList);
    saveCommunityPosts(updatedList);
  };

  const handleUpvote = () => {
    if (!post) return;
    const updated = posts.map(p => {
      if (p.id === post.id) {
        const hasUpvoted = !p.hasUpvoted;
        return {
          ...p,
          hasUpvoted,
          upvotes: hasUpvoted ? p.upvotes + 1 : p.upvotes - 1,
        };
      }
      return p;
    });
    updatePosts(updated);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    const newCommentObj = {
      id: `c-${Date.now()}`,
      author: "Current Student (You)",
      authorRole: "Student • Campus Member",
      content: newComment.trim(),
      timestamp: "Just now",
    };

    const updated = posts.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          comments: [...p.comments, newCommentObj],
        };
      }
      return p;
    });

    updatePosts(updated);
    setNewComment('');
  };

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <MessageSquare className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#0F172A]">Post Not Found</h2>
        <p className="text-xs text-[#64748B] mt-1">
          This community post may have been removed or does not exist.
        </p>
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-[#635BFF] text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Community Feed</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Back Link */}
      <div>
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#635BFF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Community Feed</span>
        </Link>
      </div>

      {/* Main Post Card */}
      <div className="bg-white rounded-3xl border border-[#E8EAF2] p-6 sm:p-8 shadow-sm space-y-5">
        
        {/* Post Author & Meta */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F3F0FF] text-[#635BFF] font-bold text-sm flex items-center justify-center">
              {post.authorAvatar || post.author.slice(0, 2)}
            </div>
            <div>
              <div className="text-sm font-bold text-[#0F172A]">{post.author}</div>
              <div className="text-xs text-[#64748B]">{post.authorRole}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F3F0FF] text-[#635BFF] border border-[#E0DBFF]">
              {post.category}
            </span>
            <span className="text-xs text-[#94A3B8] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.timestamp}
            </span>
          </div>
        </div>

        {/* Post Title & Content */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug">
            {post.title}
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-3 leading-relaxed whitespace-pre-line">
            {post.body}
          </p>
        </div>

        {/* Location Link Badge */}
        {post.locationId && (
          <div className="p-4 bg-[#FAF9FF] rounded-2xl border border-[#E0DBFF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F3F0FF] text-[#635BFF] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Associated Campus Location</span>
                <div className="text-xs font-bold text-[#0F172A]">{post.locationName}</div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/map?dest=${post.locationId}`)}
              className="px-3 py-1.5 bg-[#635BFF] hover:bg-[#5145E5] text-white text-xs font-semibold rounded-xl flex items-center gap-1 self-start sm:self-auto transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>View Location on Map</span>
            </button>
          </div>
        )}

        {/* Post Footer Actions */}
        <div className="pt-4 border-t border-[#E8EAF2] flex items-center justify-between">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              post.hasUpvoted
                ? 'bg-[#F3F0FF] text-[#635BFF] border border-[#C7BDFF]'
                : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${post.hasUpvoted ? 'fill-[#635BFF]' : ''}`} />
            <span>{post.upvotes} Upvotes</span>
          </button>

          <button
            onClick={() => setReported(true)}
            disabled={reported}
            className="text-xs text-[#94A3B8] hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{reported ? 'Report Submitted' : 'Report Post'}</span>
          </button>
        </div>

      </div>

      {/* Comments Thread Section */}
      <div className="bg-white rounded-3xl border border-[#E8EAF2] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#635BFF]" />
            <span>Discussion & Replies ({post.comments.length})</span>
          </h3>
        </div>

        {/* Existing Comments List */}
        <div className="space-y-3 divide-y divide-slate-100">
          {post.comments.map(c => (
            <div key={c.id} className="pt-3 first:pt-0 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0F172A]">{c.author}</span>
                <span className="text-[#94A3B8]">{c.timestamp}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                {c.content}
              </p>
            </div>
          ))}

          {post.comments.length === 0 && (
            <div className="text-center py-6 text-xs text-[#94A3B8]">
              No replies yet. Be the first to chime in!
            </div>
          )}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="pt-4 border-t border-[#E8EAF2] space-y-3">
          <label className="text-xs font-bold text-[#0F172A] block">Add a Reply</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a helpful response or update..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E8EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#635BFF] hover:bg-[#5145E5] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}
