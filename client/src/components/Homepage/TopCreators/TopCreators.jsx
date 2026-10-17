import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  ArrowRight,
  BadgeCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTopCreators } from "@/lib/actions/promts/getTopCreators";

export const fallbackTopCreators = [
  {
    id: "creator-1",
    name: "Alex Rivera",
    role: "Senior AI Engineer",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    specialty: "System Architecture & Coding",
    promptsCount: 48,
    totalCopies: "34.2K",
    rating: 4.98,
    badge: "Top Seller",
  },
  {
    id: "creator-2",
    name: "Marcus Vance",
    role: "Conversion Copywriter",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
    specialty: "SaaS & Landing Page Copy",
    promptsCount: 36,
    totalCopies: "28.5K",
    rating: 4.95,
    badge: "Prompt Master",
  },
  {
    id: "creator-3",
    name: "Elena Rostova",
    role: "Generative AI Artist",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    specialty: "Midjourney 8K Photorealism",
    promptsCount: 52,
    totalCopies: "41.8K",
    rating: 4.99,
    badge: "#1 Artist",
  },
  {
    id: "creator-4",
    name: "David Chen",
    role: "Growth Marketer",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    specialty: "SEO Strategies & Clustering",
    promptsCount: 29,
    totalCopies: "19.7K",
    rating: 4.92,
    badge: "Trending",
  },
];

export default async function TopCreators({ initialCreators = null }) {
  let creators = initialCreators;
  if (!creators) {
    try {
      creators = await getTopCreators();
    } catch (e) {
      console.error("Failed to load top creators in TopCreators:", e);
      creators = [];
    }
  }

  const dbCreators = Array.isArray(creators) ? creators : creators?.data || [];

  // Merge dynamic DB creators with fallback to guarantee 4 cards minimum
  const seenNames = new Set(dbCreators.map((c) => c.name.toLowerCase()));
  const mergedCreators = [...dbCreators];

  for (const fallback of fallbackTopCreators) {
    if (mergedCreators.length >= 4) break;
    if (!seenNames.has(fallback.name.toLowerCase())) {
      seenNames.add(fallback.name.toLowerCase());
      mergedCreators.push(fallback);
    }
  }

  const displayCreators = mergedCreators.slice(0, 4);

  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/20 border-t border-border/40">
      <div className="container mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              <Award className="h-3.5 w-3.5" />
              Verified Prompt Engineers
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Meet Our <span className="ai-gradient-text">Top Creators</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
              Follow elite prompt creators and access their battle-tested AI workflows.
            </p>
          </div>

          <Link href="/allpromts">
            <Button
              variant="outline"
              className="gap-2 border-border/80 bg-background/80 hover:bg-accent text-sm font-medium self-start md:self-auto cursor-pointer"
            >
              Explore All Creators
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCreators.map((creator) => (
            <div
              key={creator.id || creator._id}
              className="glass-card group relative flex flex-col items-center text-center rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                {creator.badge || "Verified"}
              </span>

              <div className="relative mt-2 mb-4">
                <Image
                  src={creator.avatar}
                  alt={creator.name}
                  width={80}
                  height={80}
                  unoptimized
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/25 group-hover:ring-primary/60 transition-all"
                />
                <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-xs">
                  <BadgeCheck className="h-3.5 w-3.5" />
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {creator.name}
              </h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {creator.role}
              </p>
              <span className="mt-2 inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/80 max-w-full truncate">
                {creator.specialty}
              </span>

              <div className="mt-5 grid grid-cols-3 w-full rounded-xl bg-muted/40 p-2.5 text-center text-xs border border-border/40">
                <div>
                  <div className="font-bold text-foreground">{creator.promptsCount}</div>
                  <div className="text-[10px] text-muted-foreground">Prompts</div>
                </div>
                <div className="border-x border-border/50">
                  <div className="font-bold text-primary">{creator.totalCopies}</div>
                  <div className="text-[10px] text-muted-foreground">Copies</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-0.5 font-bold text-amber-500">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {creator.rating || 4.95}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Rating</div>
                </div>
              </div>

              <Link
                href={`/allpromts?search=${encodeURIComponent(creator.name)}`}
                className="w-full mt-5"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-1.5 text-xs font-medium border-border/80 hover:bg-accent cursor-pointer group-hover:border-primary/40"
                >
                  View Prompts
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
