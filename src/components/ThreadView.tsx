import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MessageSquare, ThumbsUp, Repeat2, Share, ArrowLeft, Activity, FileText } from 'lucide-react';

const timeAgo = (dateStr: string) => {
  const diffInMinutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

export default function ThreadView() {
  const [replyText, setReplyText] = useState('');
  
  const {
    user,
    communityPosts,
    communityUsers,
    communityComments,
    selectedPostId,
    setView,
    previousView,
    addComment,
    likePost,
    retweetPost,
    viewProfile
  } = useAppStore();

  const currentUserId = user ? 'u1' : 'guest';

  if (!selectedPostId) return <div className="text-center p-10 text-text-secondary">Insight not found</div>;

  const post = communityPosts.find(p => p.id === selectedPostId);
  if (!post) return <div className="text-center p-10 text-text-secondary">Insight not found</div>;

  const author = communityUsers.find(u => u.id === post.authorId);
  const replies = communityComments.filter(c => c.postId === post.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const isLiked = post.likes.includes(currentUserId);
  const isRetweeted = post.retweets.includes(currentUserId);

  const handleBack = () => {
    setView(previousView === 'post-thread' ? 'community' : previousView);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !user) return;
    addComment(post.id, replyText.trim(), currentUserId);
    setReplyText('');
  };

  const handleUserClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    viewProfile(userId);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-8">
      {/* Header Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-border/50 transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-text-primary" />
          </button>
          <div className="flex items-center gap-2 text-brand-primary">
            <FileText className="h-5 w-5" />
            <h2 className="text-xl font-extrabold text-text-primary font-sora">Market Insight Details</h2>
          </div>
        </div>
      </div>

      {/* Main Analysis Document (Original Post) */}
      <div className="rounded-[2rem] p-6 sm:p-8 border-2 border-brand-primary/20 bg-gradient-to-b from-bg-base to-bg-base/80 backdrop-blur-xl relative overflow-hidden shadow-[0_10px_40px_rgba(207,163,67,0.08)]">
        {/* Decorative corner */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-[40px] pointer-events-none" />
        
        {/* Author Header */}
        <div className="relative flex items-center justify-between mb-8 z-10 bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-4">
            <div 
              className="h-14 w-14 rounded-xl flex items-center justify-center font-sora text-lg font-extrabold text-bg-base flex-shrink-0 bg-text-primary overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform"
              onClick={(e) => author && handleUserClick(author.id, e)}
            >
               {author?.avatar.length! > 2 ? <img src={author?.avatar} className="w-full h-full object-cover" /> : author?.avatar}
            </div>
            <div 
              className="cursor-pointer group/author"
              onClick={(e) => author && handleUserClick(author.id, e)}
            >
              <h3 className="text-lg font-extrabold text-text-primary font-sora group-hover/author:text-brand-primary transition-colors">
                {author?.name}
              </h3>
              <p className="text-brand-primary text-sm font-medium">@{author?.handle}</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Published</div>
            <div className="text-sm font-medium text-text-primary bg-bg-base px-3 py-1.5 rounded-lg border border-border">
              {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 mb-8">
          <p className="text-[17px] sm:text-[19px] text-text-primary font-medium leading-relaxed font-dm-sans whitespace-pre-line tracking-tight">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        {post.tickerTags && post.tickerTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 relative z-10">
            {post.tickerTags.map(tag => (
              <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-l-4 border-brand-primary bg-brand-primary/5 shadow-sm">
                <Activity className="h-3.5 w-3.5 text-brand-primary" />
                <span className="text-xs font-bold text-text-primary">${tag}</span>
              </div>
            ))}
          </div>
        )}

        {/* Metrics & Actions Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-border/40">
          <div className="flex items-center gap-6 text-sm font-bold text-text-primary font-dm-sans bg-white/5 px-4 py-2 rounded-xl">
            <div className="flex flex-col items-center"><span className="text-brand-primary text-lg">{post.retweets.length}</span> <span className="text-text-secondary text-[10px] uppercase tracking-wider">Shares</span></div>
            <div className="w-px h-8 bg-border/50"></div>
            <div className="flex flex-col items-center"><span className="text-brand-primary text-lg">{post.likes.length}</span> <span className="text-text-secondary text-[10px] uppercase tracking-wider">Endorsements</span></div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => retweetPost(post.id, currentUserId)}
              className={`flex items-center justify-center h-10 w-10 rounded-xl transition-all shadow-sm ${isRetweeted ? 'bg-gain text-bg-base' : 'bg-bg-base border border-border text-text-primary hover:border-gain hover:text-gain'}`}
              title="Retweet Insight"
            >
              <Repeat2 className={`h-5 w-5 ${isRetweeted ? 'stroke-[3px]' : ''}`} />
            </button>

            <button
              onClick={() => likePost(post.id, currentUserId)}
              className={`flex items-center justify-center h-10 w-10 rounded-xl transition-all shadow-sm ${isLiked ? 'bg-brand-primary text-bg-base' : 'bg-bg-base border border-border text-text-primary hover:border-brand-primary hover:text-brand-primary'}`}
              title="Endorse Insight"
            >
              <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-bg-base' : ''}`} />
            </button>

            <button className="flex items-center justify-center h-10 w-10 rounded-xl bg-bg-base border border-border text-text-primary hover:border-[#B275FF] hover:text-[#B275FF] transition-all shadow-sm">
              <Share className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Notes / Comments Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-text-secondary" />
          <h3 className="text-lg font-bold text-text-primary font-sora">Analyst Notes</h3>
          <div className="flex-1 h-px bg-border/50"></div>
          <span className="text-xs font-bold text-text-secondary bg-white/5 px-2 py-1 rounded-lg">{replies.length} entries</span>
        </div>

        {/* Note Input */}
        <div className="rounded-2xl p-1 bg-gradient-to-r from-brand-primary/20 to-transparent">
          <div className="rounded-xl p-4 bg-bg-base border border-border shadow-inner">
            <form onSubmit={handleAddReply} className="flex flex-col gap-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Add your analysis or commentary..."
                rows={replyText ? 3 : 2}
                className="w-full bg-transparent border-none text-[15px] text-text-primary placeholder:text-text-secondary/50 focus:ring-0 resize-none font-medium font-dm-sans pt-1"
                style={{ outline: 'none', boxShadow: 'none' }}
              />
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md flex items-center justify-center font-sora text-[10px] font-extrabold text-bg-base bg-brand-primary">
                    {user?.name?.slice(0, 2).toUpperCase() || 'ME'}
                  </div>
                  <span className="text-xs font-bold text-text-secondary">Posting as {user?.name || 'Guest'}</span>
                </div>
                <button
                  type="submit"
                  disabled={!replyText.trim() || !user}
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-text-primary text-bg-base hover:bg-white/90 disabled:opacity-30 transition-all shadow-md"
                >
                  Publish Note
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Notes Stream */}
        <div className="space-y-4 pt-2">
          {replies.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-border rounded-2xl bg-white/[0.01]">
              <p className="text-text-secondary font-medium">No analyst notes yet. Add the first insight.</p>
            </div>
          ) : (
            replies.map(reply => {
              const replyAuthor = communityUsers.find(u => u.id === reply.authorId);
              return (
                <div key={reply.id} className="flex flex-col sm:flex-row gap-4 p-5 border border-border/40 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-2xl">
                  {/* Author Block */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:w-48 flex-shrink-0">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center font-sora text-sm font-extrabold text-bg-base bg-text-primary cursor-pointer overflow-hidden shadow-sm hover:scale-105 transition-transform"
                      onClick={(e) => replyAuthor && handleUserClick(replyAuthor.id, e)}
                    >
                      {replyAuthor?.avatar.length! > 2 ? <img src={replyAuthor?.avatar} className="w-full h-full object-cover" /> : replyAuthor?.avatar}
                    </div>
                    <div>
                      <div 
                        className="font-bold text-text-primary text-sm hover:text-brand-primary cursor-pointer transition-colors"
                        onClick={(e) => replyAuthor && handleUserClick(replyAuthor.id, e)}
                      >
                        {replyAuthor?.name}
                      </div>
                      <div className="text-[10px] text-text-secondary font-medium bg-white/5 px-2 py-0.5 rounded mt-1 w-fit">
                        {timeAgo(reply.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Note Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <p className="text-[14px] text-text-primary/95 font-medium font-dm-sans leading-relaxed whitespace-pre-line mb-3">
                      {reply.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs font-bold text-text-secondary mt-auto pt-3 border-t border-border/20">
                      <button className="flex items-center gap-1.5 hover:text-brand-primary transition-colors bg-white/5 px-2 py-1 rounded-md">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{reply.likes.length} Helpful</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
