/*
 * Upload Page — "Midnight Cinema" Design
 * Upload portal with form, community policies, and conversation
 * Requires sign-in via AuthGate.
 */
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload as UploadIcon,
  Film,
  Gamepad2,
  FileVideo,
  Shield,
  AlertTriangle,
  CheckCircle2,
  X,
  MessageSquare,
  ThumbsUp,
  Send,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import AuthGate from "@/components/AuthGate";
import { checkForBannedContent } from "@shared/moderation";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663446311134/WL8BSiczt5oUoe7uMRpz7g/hero-upload-am3WToJ2eVtB4o7zMQnKR8.webp";

const policies = [
  {
    icon: Ban,
    title: "No Terrorism Content",
    description: "Any content promoting, glorifying, or inciting terrorism or extremist violence will result in an immediate permanent ban.",
  },
  {
    icon: Shield,
    title: "No Child Exploitation",
    description: "Any form of pedophilia, child abuse, or child exploitation content is strictly prohibited. Offenders will be reported to authorities and permanently banned.",
  },
  {
    icon: Ban,
    title: "No Sexual Violence",
    description: "Content depicting, promoting, or glorifying rape or sexual assault is absolutely forbidden. Violators face immediate permanent ban.",
  },
  {
    icon: AlertTriangle,
    title: "No Hate Speech",
    description: "Content promoting hatred, discrimination, or violence against individuals or groups based on race, religion, gender, or orientation is not allowed.",
  },
  {
    icon: Shield,
    title: "No Illegal Content",
    description: "Do not upload pirated, stolen, or illegally obtained content. Respect copyright and intellectual property rights.",
  },
  {
    icon: CheckCircle2,
    title: "Community Respect",
    description: "Treat all community members with respect. Harassment, bullying, and threatening behavior will not be tolerated.",
  },
];

const sampleComments = [
  { id: 1, user: "Uploader101", text: "Just uploaded my first short film! Took 6 months to make. Hope you all enjoy it.", time: "30 min ago", likes: 5 },
  { id: 2, user: "GameDev", text: "Is there a file size limit for game uploads? I have a browser game that's about 50MB.", time: "2 hours ago", likes: 3 },
  { id: 3, user: "ContentCreator", text: "Love that this platform is free and community-driven. The policies make me feel safe sharing my work here.", time: "1 day ago", likes: 18 },
];

function UploadContent() {
  const { user } = useAuth();
  const [uploadType, setUploadType] = useState<"movie" | "game">("movie");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [comments, setComments] = useState(sampleComments);
  const [newComment, setNewComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleUpload = () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your content.");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }
    if (!agreedToPolicy) {
      toast.error("You must agree to our community policies before uploading.");
      return;
    }

    toast.success(
      `Your ${uploadType === "movie" ? "movie" : "game"} "${title}" has been submitted for review! It will be available once approved.`,
      { duration: 5000 }
    );
    setTitle("");
    setDescription("");
    setGenre("");
    setSelectedFile(null);
    setAgreedToPolicy(false);
  };

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
      { id: Date.now(), user: user?.name || user?.email || "You", text: newComment, time: "Just now", likes: 0 },
      ...comments,
    ]);
    setNewComment("");
    toast.success("Comment posted!");
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[380px] overflow-hidden film-grain">
        <img
          src={HERO_IMG}
          alt="Upload hero"
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
              Upload
            </h1>
            <p className="mt-3 text-lg text-white/80 max-w-xl">
              Share your movies and games with the community. Free uploads, reviewed for safety.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Signed-in user info banner */}
      <div className="container mt-6">
        <div className="bg-secondary/30 border border-border/30 rounded-md p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-crimson/20 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-crimson">
              {(user?.name || user?.email || "U")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm text-foreground font-medium">
              Uploading as <span className="text-crimson">{user?.name || user?.email || "User"}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.email && `Email: ${user.email}`}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Upload Form — Left Column */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg border border-border/50 overflow-hidden"
            >
              <div className="p-5 border-b border-border/50">
                <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                  <UploadIcon className="w-5 h-5 text-crimson" />
                  Upload Content
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  All uploads are free. Content is reviewed before publishing.
                </p>
              </div>

              <div className="p-5 space-y-5">
                {/* Content Type Toggle */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Content Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUploadType("movie")}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                        uploadType === "movie"
                          ? "bg-crimson/15 text-crimson border border-crimson/30"
                          : "bg-secondary/50 text-muted-foreground border border-border/50 hover:text-foreground"
                      }`}
                    >
                      <Film className="w-4 h-4" />
                      Movie
                    </button>
                    <button
                      onClick={() => setUploadType("game")}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                        uploadType === "game"
                          ? "bg-crimson/15 text-crimson border border-crimson/30"
                          : "bg-secondary/50 text-muted-foreground border border-border/50 hover:text-foreground"
                      }`}
                    >
                      <Gamepad2 className="w-4 h-4" />
                      Video Game
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={uploadType === "movie" ? "Enter movie title..." : "Enter game title..."}
                    className="w-full bg-secondary/50 border border-border/50 rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 transition-all"
                  />
                </div>

                {/* Genre */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g., Action, Comedy, Puzzle, RPG..."
                    className="w-full bg-secondary/50 border border-border/50 rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell the community about your content..."
                    rows={4}
                    className="w-full bg-secondary/50 border border-border/50 rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 transition-all resize-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {uploadType === "movie" ? "Video File" : "Game File"}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept={uploadType === "movie" ? "video/*" : ".html,.zip,.rar,.7z"}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-crimson/30 transition-colors group"
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileVideo className="w-8 h-8 text-crimson" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="ml-2 p-1 rounded hover:bg-secondary"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover:text-crimson transition-colors" />
                        <p className="text-sm text-muted-foreground">
                          Click to select a file or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {uploadType === "movie"
                            ? "MP4, AVI, MKV, MOV supported"
                            : "HTML, ZIP, RAR, 7Z supported"}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Policy Agreement */}
                <div className="flex items-start gap-3 p-3 rounded-md bg-secondary/30 border border-border/30">
                  <input
                    type="checkbox"
                    checked={agreedToPolicy}
                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-border accent-crimson"
                  />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    I agree to The Void's community policies. I confirm that my upload does not contain any content related to terrorism, pedophilia, sexual violence, hate speech, or illegal material. I understand that violations will result in a <strong className="text-crimson">permanent ban</strong>.
                  </p>
                </div>

                {/* Submit */}
                <Button
                  onClick={handleUpload}
                  className="w-full bg-crimson hover:bg-crimson-light text-white py-3 text-base font-medium"
                >
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload {uploadType === "movie" ? "Movie" : "Game"}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Policies — Right Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-lg border border-border/50 overflow-hidden sticky top-20"
            >
              <div className="p-5 border-b border-border/50 bg-crimson/5">
                <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-crimson" />
                  Community Policies
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Violations result in permanent ban. No exceptions.
                </p>
              </div>

              <div className="p-5 space-y-4">
                {policies.map((policy, i) => {
                  const Icon = policy.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-md bg-crimson/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-crimson" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{policy.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {policy.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Conversation Section */}
      <section className="container pb-12">
        <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
          <div className="p-5 border-b border-border/50 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-crimson" />
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Upload Discussion
            </h2>
            <span className="text-xs text-muted-foreground ml-auto">{comments.length} comments</span>
          </div>

          {/* Policy Notice */}
          <div className="mx-5 mt-4 p-3 rounded-md bg-crimson/10 border border-crimson/20 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-crimson mt-0.5 shrink-0" />
            <p className="text-xs text-crimson/80 leading-relaxed">
              <strong>Community Policy:</strong> Content promoting terrorism, pedophilia, rape, or any form of violence/abuse is strictly prohibited. Violators will be permanently banned.
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
                  placeholder="Ask questions, share upload tips..."
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

export default function Upload() {
  return (
    <AuthGate message="Sign in with your email to upload movies and games. Your account is linked to all uploads so we can enforce our community policies.">
      <UploadContent />
    </AuthGate>
  );
}
