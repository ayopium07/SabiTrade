import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Calendar, MessageSquare, ThumbsUp, Repeat2, Share, TrendingUp, Users, Activity } from 'lucide-react';

const timeAgo = (dateStr: string) => {
  const diffInMinutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

export default function PublicProfile() {
  const {
    user,
    communityUsers,
    communityPosts,
    communityComments,
    selectedUserId,
    setView,
    previousView,
    followUser,
    unfollowUser,
    likePost,
    retweetPost,
    viewThread
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'likes'>('posts');
  
  const currentUserId = user ? 'u1' : 'guest';

  if (!selectedUserId) return <div className="text-center p-10 text-text-secondary">Profile not found</div>;

  const profileUser = communityUsers.find(u => u.id === selectedUserId);
  if (!profileUser) return <div className="text-center p-10 text-text-secondary">Profile not found</div>;

  const isOwnProfile = profileUser.id === currentUserId;
  const isFollowing = profileUser.followers.includes(currentUserId);

  const handleBack = () => {
    setView(previousView === 'public-profile' ? 'community' : previousView);
  };

  const toggleFollow = () => {
    if (!user) return;
    if (isFollowing) {
      unfollowUser(profileUser.id, currentUserId);
    } else {
      followUser(profileUser.id, currentUserId);
    }
  };

  // Filter content
  const userPosts = communityPosts.filter(p => p.authorId === profileUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const userReplies = communityComments.filter(c => c.authorId === profileUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const userLikes = communityPosts.filter(p => p.likes.includes(profileUser.id)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const renderInsightCard = (post: any, isLikeView = false, originalAuthor?: any) => {
    const displayAuthor = isLikeView && originalAuthor ? originalAuthor : profileUser;
    const isLiked = post.likes.includes(currentUserId);
    const isRetweeted = post.retweets?.includes(currentUserId);

    return (
      <div 
        key={post.id} 
        onClick={() => viewThread(post.id)}
        className="mb-4 rounded-2xl p-5 border border-brand-primary/10 bg-gradient-to-br from-bg-base/80 to-bg-base/40 backdrop-blur-md shadow-lg hover:shadow-[0_0_20px_rgba(207,163,67,0.1)] transition-all cursor-pointer group"
      >
        {isLikeView && (
          <div className="flex items-center gap-2 text-xs font-bold text-brand-primary mb-3 pl-1">
            <ThumbsUp className="h-3 w-3 fill-brand-primary" />
            <span>{profileUser.name} endorsed this insight</span>
          </div>
        )}
        
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center font-sora text-sm font-extrabold text-bg-base flex-shrink-0 bg-text-primary overflow-hidden shadow-md group-hover:scale-105 transition-transform">
             {displayAuthor.avatar.length > 2 ? <img src={displayAuthor.avatar} className="w-full h-full object-cover" /> : displayAuthor.avatar}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-bold text-text-primary text-base truncate">{displayAuthor.name}</span>
                <span className="text-brand-primary text-xs font-medium px-2 py-0.5 rounded-md bg-brand-primary/10 border border-brand-primary/20 whitespace-nowrap">
                  @{displayAuthor.handle}
                </span>
              </div>
              <span className="text-text-secondary text-xs font-medium whitespace-nowrap ml-2 bg-white/5 px-2 py-1 rounded-lg">
                {timeAgo(post.createdAt)}
              </span>
            </div>
            
            <p className="mt-3 text-[15px] text-text-primary/95 font-medium leading-relaxed whitespace-pre-line font-dm-sans">
              {post.content}
            </p>
            
            {post.tickerTags && post.tickerTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tickerTags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-lg text-xs font-bold text-bg-base bg-brand-primary shadow-sm">
                    ${tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 mt-5 pt-4 border-t border-border/30 text-xs font-bold text-text-secondary">
              <button className="flex items-center gap-2 hover:text-text-primary transition-colors bg-white/5 px-3 py-1.5 rounded-lg">
                <MessageSquare className="h-4 w-4" />
                <span>{post.repliesCount || 0}</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); retweetPost(post.id, currentUserId); }}
                className={`flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg ${isRetweeted ? 'text-gain bg-gain/10' : 'hover:text-gain hover:bg-gain/10 bg-white/5'}`}
              >
                <Repeat2 className={`h-4 w-4 ${isRetweeted ? 'stroke-[3px]' : ''}`} />
                <span>{post.retweets?.length || 0}</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); likePost(post.id, currentUserId); }}
                className={`flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg ${isLiked ? 'text-brand-primary bg-brand-primary/10' : 'hover:text-brand-primary hover:bg-brand-primary/10 bg-white/5'}`}
              >
                <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-brand-primary' : ''}`} />
                <span>{post.likes.length}</span>
              </button>
              <button className="flex items-center justify-center hover:text-[#B275FF] hover:bg-[#B275FF]/10 transition-colors ml-auto bg-white/5 h-8 w-8 rounded-lg">
                <Share className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Navigation */}
      <div className="flex items-center gap-4 border-b border-border/50 pb-4">
        <button onClick={handleBack} className="p-2 rounded-xl hover:bg-bg-base/60 border border-transparent hover:border-border transition-all shadow-sm">
          <ArrowLeft className="h-5 w-5 text-text-primary" />
        </button>
        <h2 className="text-xl font-extrabold text-text-primary font-sora">Trader Profile</h2>
      </div>

      {/* Dashboard Identity Card */}
      <div className="rounded-[2rem] p-6 sm:p-8 border border-brand-primary/20 bg-gradient-to-br from-bg-base/80 to-[#070615] backdrop-blur-xl relative overflow-hidden shadow-[0_0_40px_rgba(207,163,67,0.05)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          {/* Avatar and Primary Actions */}
          <div className="flex flex-col items-center gap-4">
            <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-3xl p-1 border border-brand-primary/30 bg-bg-base shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-text-primary flex items-center justify-center font-sora text-4xl font-extrabold text-bg-base">
                {profileUser.avatar.length > 2 ? (
                  <img src={profileUser.avatar} className="w-full h-full object-cover" />
                ) : (
                  profileUser.avatar
                )}
              </div>
            </div>
            
            {isOwnProfile ? (
              <button className="w-full py-2.5 rounded-xl font-bold text-sm border-2 border-border hover:bg-white/5 transition-colors text-text-primary shadow-sm">
                Edit Settings
              </button>
            ) : (
              <button 
                onClick={toggleFollow}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  isFollowing 
                    ? 'border border-danger/50 text-danger hover:bg-danger/10 bg-bg-base' 
                    : 'bg-brand-primary text-bg-base hover:bg-brand-primary/90'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow Trader'}
              </button>
            )}
          </div>

          {/* User Info and Metrics */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-text-primary font-sora">{profileUser.name}</h1>
                <span className="bg-brand-primary/15 text-brand-primary px-3 py-1 rounded-lg text-sm font-bold border border-brand-primary/30">
                  @{profileUser.handle}
                </span>
              </div>
              <p className="text-base text-text-primary/80 leading-relaxed font-dm-sans max-w-xl">
                {profileUser.bio || "No bio provided."}
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm text-text-secondary font-medium">
                <Calendar className="h-4 w-4" />
                <span>Trading since {profileUser.joinDate}</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center shadow-inner">
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Insights</span>
                </div>
                <span className="text-2xl font-extrabold text-text-primary font-sora">{userPosts.length}</span>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center shadow-inner">
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Followers</span>
                </div>
                <span className="text-2xl font-extrabold text-text-primary font-sora">{profileUser.followers.length}</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center shadow-inner">
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Following</span>
                </div>
                <span className="text-2xl font-extrabold text-text-primary font-sora">{profileUser.following.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex p-1.5 bg-bg-base/60 border border-border/50 rounded-2xl backdrop-blur-md">
        {(['posts', 'replies', 'likes'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-extrabold capitalize transition-all rounded-xl ${
              activeTab === tab 
                ? 'bg-brand-primary text-bg-base shadow-md scale-[1.02]' 
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
          >
            {tab === 'posts' ? 'Market Insights' : tab === 'replies' ? 'Analysis Comments' : 'Endorsements'}
          </button>
        ))}
      </div>

      {/* Content Stream */}
      <div className="min-h-[400px]">
        {activeTab === 'posts' && (
          userPosts.length === 0 ? (
            <div className="rounded-2xl border border-border border-dashed p-12 text-center flex flex-col items-center justify-center">
              <Activity className="h-10 w-10 text-text-secondary/50 mb-3" />
              <p className="text-text-secondary font-bold text-lg">No insights published yet.</p>
              <p className="text-sm text-text-secondary/70 mt-1">This trader hasn't shared any market analysis.</p>
            </div>
          ) : (
            userPosts.map(post => renderInsightCard(post))
          )
        )}

        {activeTab === 'replies' && (
          userReplies.length === 0 ? (
            <div className="rounded-2xl border border-border border-dashed p-12 text-center flex flex-col items-center justify-center">
              <MessageSquare className="h-10 w-10 text-text-secondary/50 mb-3" />
              <p className="text-text-secondary font-bold text-lg">No comments available.</p>
            </div>
          ) : (
            userReplies.map(reply => (
              <div key={reply.id} className="mb-4 rounded-2xl p-5 border border-border/40 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                <div className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-3 flex items-center gap-1.5 bg-white/5 w-fit px-2 py-1 rounded-md">
                  <MessageSquare className="h-3 w-3" />
                  Commentary
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center font-sora text-sm font-extrabold text-bg-base flex-shrink-0 bg-text-primary overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity">
                    {profileUser.avatar.length > 2 ? <img src={profileUser.avatar} className="w-full h-full object-cover" /> : profileUser.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-text-primary">{profileUser.name}</span>
                      <span className="text-text-secondary text-xs">· {timeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="text-[14px] text-text-primary/90 font-medium leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                      {reply.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )
        )}

        {activeTab === 'likes' && (
          userLikes.length === 0 ? (
            <div className="rounded-2xl border border-border border-dashed p-12 text-center flex flex-col items-center justify-center">
              <ThumbsUp className="h-10 w-10 text-text-secondary/50 mb-3" />
              <p className="text-text-secondary font-bold text-lg">No endorsements yet.</p>
            </div>
          ) : (
            userLikes.map(post => {
              const originalAuthor = communityUsers.find(u => u.id === post.authorId);
              if (!originalAuthor) return null;
              return renderInsightCard(post, true, originalAuthor);
            })
          )
        )}
      </div>
    </div>
  );
}
