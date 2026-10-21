import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  MapPin, 
  ThumbsUp, 
  MessageSquare, 
  Clock, 
  X, 
  AlertCircle, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { loadCommunityPosts, saveCommunityPosts } from '../data/communityData';
import ScrollReveal from '../components/ScrollReveal';

export default function CommunityPage({ nodes = [] }) {
  const [posts, setPosts] = useState(() => loadCommunityPosts());
  const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' | 'recent' | 'Question' | 'Lost & Found' | 'Campus Tip'
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  // Create post form state
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState('Question');
  const [newLocationId, setNewLocationId] = useState('');
  const [formError, setFormError] = useState('');

  // Save changes to localStorage
  const updatePosts = (newPosts) => {
    setPosts(newPosts);
    saveCommunityPosts(newPosts);
  };

  const handleUpvote = (e, postId) => {
    e.stopPropagation();
    const updated = posts.map(p => {
      if (p.id === postId) {
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

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) {
      setFormError('Please provide both a title and details for your post.');
      return;
    }

    const matchedNode = nodes.find(n => n.id === newLocationId);

    const newPostObj = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      body: newBody.trim(),
      category: newCategory,
      author: "Current Student (You)",
      authorRole: "Student • Campus Member",
      authorAvatar: "ME",
      locationId: newLocationId || null,
      locationName: matchedNode ? matchedNode.name : (newLocationId ? newLocationId : "General Campus"),
      upvotes: 1,
      hasUpvoted: true,
      timestamp: "Just now",
      createdAt: Date.now(),
      comments: []
    };

    const updated = [newPostObj, ...posts];
    updatePosts(updated);

    // Reset Form
    setNewTitle('');
    setNewBody('');
    setNewCategory('Question');
    setNewLocationId('');
    setFormError('');
    setShowCreateModal(false);
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Tab filter
      let matchesTab = true;
      if (activeTab === 'recent') {
        matchesTab = true;
      } else if (activeTab === 'for-you') {
        matchesTab = true;
      } else {
        matchesTab = post.category === activeTab;
      }

      // Query filter
      const q = searchQuery.toLowerCase();
      const matchesQuery = !q ||
        post.title.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q) ||
        (post.locationName && post.locationName.toLowerCase().includes(q)) ||
        post.author.toLowerCase().includes(q);

      return matchesTab && matchesQuery;
    }).sort((a, b) => {
      if (activeTab === 'for-you') return b.upvotes - a.upvotes;
      return b.createdAt - a.createdAt;
    });
  }, [posts, activeTab, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Community Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8EAF2]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F0FF] text-xs font-semibold text-[#635BFF] mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Campus Connect</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Campus Community
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-1">
            Questions, lost & found notices, and navigation tips tagged with university locations.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5145E5] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Main Feed + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Community Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Feed Controls Bar: Search & Tabs */}
          <div className="bg-white p-3 rounded-2xl border border-[#E8EAF2] shadow-xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search community posts, questions, or lost items..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E8EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 text-[#0F172A]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
              {[
                { id: 'for-you', label: '🔥 For You' },
                { id: 'recent', label: 'Recent' },
                { id: 'Question', label: 'Questions' },
                { id: 'Lost & Found', label: 'Lost & Found' },
                { id: 'Campus Tip', label: 'Campus Tips' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#635BFF] text-white shadow-xs'
                      : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post, idx) => (
              <ScrollReveal key={post.id} direction="up" delay={Math.min(idx * 40, 200)}>
                <div
                  onClick={() => navigate(`/community/${post.id}`)}
                  className="bg-white rounded-2xl border border-[#E8EAF2] hover:border-[#C7BDFF] p-5 shadow-xs hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Author Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#F3F0FF] text-[#635BFF] font-bold text-xs flex items-center justify-center">
                          {post.authorAvatar || post.author.slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F172A]">{post.author}</div>
                          <div className="text-[11px] text-[#94A3B8]">{post.authorRole}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F3F0FF] text-[#635BFF]">
                          {post.category}
                        </span>
                        <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Post Title & Content */}
                    <h3 className="text-base font-bold text-[#0F172A] hover:text-[#635BFF] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                      {post.body}
                    </p>
                  </div>

                  {/* Location Association & Interactive Footer */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    {post.locationId ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/map?dest=${post.locationId}`);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] hover:bg-[#F3F0FF] px-2.5 py-1 rounded-lg transition-colors border border-[#E0DBFF]"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#635BFF]" />
                        <span>{post.locationName}</span>
                        <span className="text-[10px] text-[#94A3B8] font-normal">• View on Map</span>
                      </button>
                    ) : (
                      <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> General Campus
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleUpvote(e, post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          post.hasUpvoted
                            ? 'bg-[#F3F0FF] text-[#635BFF]'
                            : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                        }`}
                        title="Upvote post"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${post.hasUpvoted ? 'fill-[#635BFF]' : ''}`} />
                        <span>{post.upvotes}</span>
                      </button>

                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.comments.length}</span>
                      </span>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            ))}

            {filteredPosts.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E8EAF2]">
                <Users className="w-10 h-10 text-[#94A3B8] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#0F172A]">No posts found</h4>
                <p className="text-xs text-[#64748B] mt-1">
                  Be the first to create a post in this category!
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Trending & Safety Guidelines Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Trending Campus Topics Card */}
          <div className="bg-white rounded-2xl border border-[#E8EAF2] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#635BFF]" />
              <h3 className="font-bold text-sm text-[#0F172A]">Trending Discussions</h3>
            </div>
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="pt-2">
                <div className="font-semibold text-[#0F172A] hover:text-[#635BFF] cursor-pointer" onClick={() => setSearchQuery('Block 34')}>
                  #Block34 · Mid-Term Exam Seating
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">38 student posts this week</div>
              </div>
              <div className="pt-2">
                <div className="font-semibold text-[#0F172A] hover:text-[#635BFF] cursor-pointer" onClick={() => setSearchQuery('Gate 1')}>
                  #Gate1 · Auto Stand & GT Road
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">24 student posts this week</div>
              </div>
              <div className="pt-2">
                <div className="font-semibold text-[#0F172A] hover:text-[#635BFF] cursor-pointer" onClick={() => setSearchQuery('Library')}>
                  #Block28 · Silent Study Carrels
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">19 student posts this week</div>
              </div>
            </div>
          </div>

          {/* Community Guidelines & Safety Notice */}
          <div className="bg-[#FAF9FF] rounded-2xl border border-[#E0DBFF] p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-[#635BFF]">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="font-bold text-xs uppercase tracking-wider">Campus Safety & Guidelines</h3>
            </div>
            <ul className="text-xs text-[#64748B] space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Always respect student privacy. Never share personal phone numbers or hostel room codes publicly.</li>
              <li>Deposit lost electronics or valuables with university security posts at Block 34 or Gate 1.</li>
              <li>No live real-time location tracking of students is allowed on this platform.</li>
            </ul>
          </div>

          {/* Prototype Storage Notice */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-[#E8EAF2] text-[11px] text-[#64748B] flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-[#94A3B8] flex-shrink-0 mt-0.5" />
            <div>
              <strong>Architecture Note:</strong> Posts are currently synchronized in local prototype storage. Ready for production database REST integration.
            </div>
          </div>

        </div>

      </div>

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8EAF2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8EAF2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F3F0FF] text-[#635BFF] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#0F172A]">Create Campus Post</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1">Post Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lost keys near Gate 1 auto stand..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E8EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E8EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
                >
                  <option value="Question">Question</option>
                  <option value="Campus Tip">Campus Tip</option>
                  <option value="Lost & Found">Lost & Found</option>
                  <option value="Event">Event</option>
                  <option value="General Discussion">General Discussion</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1">
                  Tag with Campus Location (Optional)
                </label>
                <select
                  value={newLocationId}
                  onChange={(e) => setNewLocationId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E8EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
                >
                  <option value="">No location / General Campus</option>
                  {nodes.map(n => (
                    <option key={n.id} value={n.id}>
                      📍 {n.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1">Post Details</label>
                <textarea
                  rows={4}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Provide clear details, landmarks, or specific room numbers..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E8EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8EAF2]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#64748B] text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#635BFF] hover:bg-[#5145E5] text-white text-xs font-semibold rounded-xl shadow-sm"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
