/*
 * Movies Page — "Midnight Cinema" Design
 * Hero banner with film reel imagery, movie grid, conversation section
 * Requires sign-in for commenting. Content browsing is gated behind auth.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, MessageSquare, ThumbsUp, Clock, Star, Send, AlertTriangle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import AuthGate from "@/components/AuthGate";
import { checkForBannedContent } from "@shared/moderation";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663446311134/WL8BSiczt5oUoe7uMRpz7g/hero-movies-9uS5YgYr74F4yWZrkonKSD.webp";

// Sample movie data
const sampleMovies = [
  {
    id: 1,
    title: "Echoes of Tomorrow",
    genre: "Sci-Fi / Drama",
    duration: "2h 14m",
    rating: 4.7,
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop",
    uploader: "CinemaFan42",
    views: 1243,
  },
  {
    id: 2,
    title: "The Last Frontier",
    genre: "Action / Adventure",
    duration: "1h 58m",
    rating: 4.3,
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=225&fit=crop",
    uploader: "ActionHero",
    views: 892,
  },
  {
    id: 3,
    title: "Midnight Whispers",
    genre: "Horror / Thriller",
    duration: "1h 42m",
    rating: 4.1,
    thumbnail: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=225&fit=crop",
    uploader: "DarkTales",
    views: 2105,
  },
  {
    id: 4,
    title: "Garden of Stars",
    genre: "Romance / Fantasy",
    duration: "2h 01m",
    rating: 4.8,
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=225&fit=crop",
    uploader: "DreamWeaver",
    views: 3421,
  },
  {
    id: 5,
    title: "Code Red",
    genre: "Thriller / Crime",
    duration: "1h 55m",
    rating: 4.0,
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=225&fit=crop",
    uploader: "NightOwl",
    views: 567,
  },
  {
    id: 6,
    title: "Ocean Depths",
    genre: "Documentary",
    duration: "1h 30m",
    rating: 4.5,
    thumbnail: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400&h=225&fit=crop",
    uploader: "NatureFilms",
    views: 1890,
  },
];

const sampleComments = [
  { id: 1, user: "MovieBuff99", text: "Just watched Echoes of Tomorrow — incredible storyline! The twist at the end was mind-blowing.", time: "2 hours ago", likes: 14 },
  { id: 2, user: "CinemaLover", text: "Anyone else think The Last Frontier deserves a sequel? The action scenes were top-notch.", time: "5 hours ago", likes: 8 },
  { id: 3, user: "FilmCritic", text: "Great selection of movies this week. Keep the quality content coming!", time: "1 day ago", likes: 23 },
];

function MoviesContent() {
  const { user } = useAuth();
  const [comments, setComments] = useState(sampleComments);
  const [newComment, setNewComment] = useState("");

  const handleComment = () => {
    if (!newComment.trim()) return;

    // Content policy check using shared moderation module
    const bannedWord = checkForBannedContent(newComment);
    if (bannedWord) {
      toast.error("Your comment violates our community policies and cannot be posted. Repeated violations will result in a permanent ban.", {
        duration: 5000,
      });
      return;
    }

    setComments([
      {
        id: Date.now(),
        user: user?.name || user?.email || "You",
        text: newComment,
        time: "Just now",
        likes: 0,
      },
      ...comments,
    ]);
    setNewComment("");
    toast.success("Comment posted!");
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[340px] md:h-[420px] overflow-hidden film-grain">
        <img
          src={HERO_IMG}
          alt="Movies hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="relative z-10 container h-full flex flex-col justify-end pb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              Movies
            </h1>
            <p className="mt-3 text-lg text-white/80 max-w-xl">
              Discover and watch community-uploaded films. From indie gems to fan favorites — all free, all here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Movie Grid */}
      <section className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Featured Films
          </h2>
          <span className="text-sm text-muted-foreground">{sampleMovies.length} movies available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleMovies.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group bg-card rounded-lg overflow-hidden border border-border/50 hover:border-crimson/30 transition-all duration-300 hover:shadow-lg hover:shadow-crimson/5"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => {
                      toast.info(`Now playing: ${movie.title}`, { duration: 3000 });
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-14 h-14 rounded-full bg-crimson/90 flex items-center justify-center hover:bg-crimson"
                  >
                    <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {movie.duration}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-base group-hover:text-crimson transition-colors">
                  {movie.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{movie.genre}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-gold" fill="oklch(0.75 0.12 80)" />
                    {movie.rating}
                  </span>
                  <span>{movie.views.toLocaleString()} views</span>
                  <span>by {movie.uploader}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Conversation Section */}
      <section className="container pb-12">
        <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
          <div className="p-5 border-b border-border/50 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-crimson" />
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Movie Talk
            </h2>
            <span className="text-xs text-muted-foreground ml-auto">{comments.length} comments</span>
          </div>

          {/* Policy Notice */}
          <div className="mx-5 mt-4 p-3 rounded-md bg-crimson/10 border border-crimson/20 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-crimson mt-0.5 shrink-0" />
            <p className="text-xs text-crimson/80 leading-relaxed">
              <strong>Community Policy:</strong> Content promoting terrorism, pedophilia, rape, or any form of violence/abuse is strictly prohibited. Violators will be permanently banned. Keep conversations respectful.
            </p>
          </div>

          {/* Comment Input */}
          <div className="p-5">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-crimson/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-crimson">
                  {(user?.name || user?.email || "U")[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  placeholder="Share your thoughts about movies..."
                  className="flex-1 bg-secondary/50 border border-border/50 rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 transition-all"
                />
                <Button
                  onClick={handleComment}
                  className="bg-crimson hover:bg-crimson-light text-white px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="px-5 pb-5 space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {comment.user[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{comment.user}</span>
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="text-sm text-foreground/80 mt-1">{comment.text}</p>
                  <button className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-crimson transition-colors">
                    <ThumbsUp className="w-3 h-3" />
                    {comment.likes}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Movies() {
  return (
    <AuthGate message="Sign in with your email to browse and watch movies. Your account helps us keep The Void safe for everyone.">
      <MoviesContent />
    </AuthGate>
  );
}
