"use client";

import { useState } from "react";
import { Product, Review } from "@/data/products";
import StarRating from "@/components/ui/StarRating";
import { CheckCircle2, User, Send } from "lucide-react";
import { useStore } from "@/lib/store";

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews);
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const showToast = useStore((state) => state.showToast);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      date: new Date().toISOString().split("T")[0],
      comment: newComment,
      verified: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewAuthor("");
    setNewComment("");
    showToast("Review submitted successfully!", "success");
  };

  return (
    <div className="mt-16 rounded-3xl bg-cyber-glass border border-cyber-border/60 overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-zinc-200 bg-cyber-card/60 overflow-x-auto">
        <button
          onClick={() => setActiveTab("desc")}
          className={`px-8 py-5 text-sm font-heading font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "desc"
              ? "border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10"
              : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          Detailed Description
        </button>
        <button
          onClick={() => setActiveTab("specs")}
          className={`px-8 py-5 text-sm font-heading font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "specs"
              ? "border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10"
              : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          Technical Specifications ({product.specs.length})
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-8 py-5 text-sm font-heading font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "reviews"
              ? "border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10"
              : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          Customer Reviews ({reviewsList.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-8 sm:p-10">
        {/* Description Tab */}
        {activeTab === "desc" && (
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-xl text-zinc-900">
              Engineering & Performance Highlights
            </h3>
            <p className="text-zinc-600 leading-relaxed text-base">
              {product.fullDescription}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {product.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-cyber-card/60 border border-zinc-200"
                >
                  <span className="text-cyber-cyan text-lg font-bold">⚡</span>
                  <span className="text-sm font-semibold text-zinc-700">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specs" && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-xl text-zinc-900 mb-6">
              Full Technical Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specs.map((spec, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 rounded-2xl bg-cyber-card/60 border border-zinc-200"
                >
                  <span className="text-xs font-bold text-cyber-muted uppercase tracking-wider">
                    {spec.name}
                  </span>
                  <span className="text-sm font-semibold text-zinc-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-200">
              <div>
                <h3 className="font-heading font-bold text-xl text-zinc-900">Verified Customer Ratings</h3>
                <div className="mt-1">
                  <StarRating rating={product.rating} count={reviewsList.length} size="md" />
                </div>
              </div>
            </div>

            {/* Review Form */}
            <form
              onSubmit={handleAddReview}
              className="p-6 rounded-2xl bg-cyber-card/60 border border-zinc-200 space-y-4"
            >
              <h4 className="font-heading font-bold text-base text-zinc-900">Write a Review</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan"
                  required
                />
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan"
                >
                  <option value={5}>5 Stars - Phenomenal</option>
                  <option value={4}>4 Stars - Great</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>

              <textarea
                rows={3}
                placeholder="Share your technical evaluation and user experience..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-4 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan"
                required
              />

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-cyan text-white font-bold text-sm shadow-cyan-glow/30 hover:shadow-cyan-glow"
              >
                <Send className="w-4 h-4" />
                <span>Submit Review</span>
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-zinc-100/40 border border-zinc-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-heading font-bold text-sm text-zinc-900">
                          {rev.author}
                        </span>
                        {rev.verified && (
                          <span className="ml-2 text-[10px] font-bold text-cyber-cyan inline-flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-cyber-muted">{rev.date}</span>
                  </div>

                  <StarRating rating={rev.rating} />

                  <p className="text-sm text-zinc-600">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
