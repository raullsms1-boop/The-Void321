/*
 * Video Games Page — "Midnight Cinema" Design
 * Hero banner with gaming imagery, game grid, conversation section
 * Requires sign-in via AuthGate.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, MessageSquare, ThumbsUp, Star, Users, Send, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import AuthGate from "@/components/AuthGate";
import { checkForBannedContent } from "@shared/moderation";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663446311134/WL8BSiczt5oUoe7uMRpz7g/hero-games-hUR2MZnW5oSMVHB3eZuf3r.webp";

// Sample game data with embeddable browser games
const sampleGames = [
  {
    id: 1,
    title: "2048",
    genre: "Puzzle",
    rating: 4.6,
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
    uploader: "PuzzleMaster",
    players: 5420,
    playUrl: "https://play2048.co/",
    description: "Join the numbers and get to the 2048 tile!",
  },
  {
    id: 2,
    title: "Pac-Man",
    genre: "Arcade / Classic",
    rating: 4.8,
    thumbnail: "https://images.unsplash.com/photo-1579309401389-a2476dddf3d4?w=400&h=400&fit=crop",
    uploader: "RetroGamer",
    players: 8901,
    playUrl: "https://www.google.com/logos/2010/pacman10-i.html",
    description: "The classic arcade game. Eat dots, avoid ghosts!",
  },
  {
    id: 3,
    title: "Chess",
    genre: "Strategy / Board",
    rating: 4.9,
    thumbnail: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=400&fit=crop",
    uploader: "ChessKing",
    players: 3210,
    playUrl: "https://www.chess.com/play/computer",
    description: "Play chess against the computer or challenge friends.",
  },
  {
    id: 4,
    title: "Tetris",
    genre: "Puzzle / Classic",
    rating: 4.7,
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=400&fit=crop",
    uploader: "BlockBuilder",
    players: 6754,
    playUrl: "https://tetris.com/play-tetris",
    description: "Stack blocks and clear lines in this timeless classic.",
  },
  {
    id: 5,
    title: "Wordle",
    genre: "Word / Puzzle",
    rating: 4.5,
    thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&h=400&fit=crop",
    uploader: "WordSmith",
    players: 12340,
    playUrl: "https://www.nytimes.com/games/wordle/index.html",
    description: "Guess the hidden word in six tries.",
  },
  {
    id: 6,
    title: "Snake",
    genre: "Arcade / Classic",
    rating: 4.3,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop",
    uploader: "ArcadeKid",
    players: 4567,
    playUrl: "https://www.google.com/fbx?fbx=snake_arcade",
    description: "Guide the snake, eat food, grow longer. Don't hit yourself!",
  },
];

const sampleComments = [
  { id: 1, user: "GamerPro", text: "2048 is so addictive! I finally hit the 4096 tile today. Anyone else gotten that far?", time: "1 hour ago", likes: 19 },
  { id: 2, user: "RetroFan", text: "Nothing beats classic Pac-Man. The original arcade version is still the best.", time: "3 hours ago", likes: 12 },
  { id: 3, user: "StrategyNerd", text: "Chess community here is awesome. Looking for players to practice with!", time: "6 hours ago", likes: 7 },
];

function VideoGamesContent() {
  const { user } = useAuth();
  const [comments, setComments] = useState(sampleComments);
  const [newComment, setNewComment] = useState("");
  const [playingGame, setPlayingGame] = useState<typeof sampleGames[0] | null>(null);

  const handleComment = () => {
    if (!newComment.trim()) return;

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
          alt="Video Games hero"
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
              Video Games
            </h1>
            <p className="mt-3 text-lg text-white/80 max-w-xl">
              Play community-shared games right in your browser. From classic arcades to modern puzzles — all free.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Game Player Modal */}
      {playingGame && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg border border-border/50 w-full max-w-4xl overflow-hidden"
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5 text-crimson" />
                <h3 className="font-semibold text-foreground">{playingGame.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={playingGame.playUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-crimson flex items-center gap-1 transition-colors"
                >
                  Open in new tab <ExternalLink className="w-3 h-3" />
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPlayingGame(null)}
                  className="text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={playingGame.playUrl}
                className="w-full h-full border-0"
                title={playingGame.title}
                allow="fullscreen"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Games Grid */}
      <section className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Featured Games
          </h2>
          <span className="text-sm text-muted-foreground">{sampleGames.length} games available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleGames.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group bg-card rounded-lg overflow-hidden border border-border/50 hover:border-crimson/30 transition-all duration-300 hover:shadow-lg hover:shadow-crimson/5"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setPlayingGame(game)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-3 rounded-md bg-crimson/90 flex items-center gap-2 hover:bg-crimson text-white font-medium text-sm"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    Play Now
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {game.genre}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-base group-hover:text-crimson transition-colors">
                  {game.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{game.description}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-gold" fill="oklch(0.75 0.12 80)" />
                    {game.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {game.players.toLocaleString()} players
                  </span>
                  <span>by {game.uploader}</span>
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
              Game Chat
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
                  placeholder="Talk about games, share tips, find teammates..."
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

export default function VideoGames() {
  return (
    <AuthGate message="Sign in with your email to browse and play video games. Your account helps us keep The Void safe for everyone.">
      <VideoGamesContent />
    </AuthGate>
  );
}
