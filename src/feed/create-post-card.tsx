import { ImagePlus, Sparkles, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FanPulseActions } from "@/hooks/use-fanpulse";
import type { TeamKey, UserProfile } from "@/utils/types";

const mediaPresets = [
  "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
];

export function CreatePostCard({
  currentUser,
  actions,
}: {
  currentUser: UserProfile;
  actions: FanPulseActions;
}) {
  const [caption, setCaption] = useState("");
  const [matchTag, setMatchTag] = useState("RCB vs MI");
  const [mediaUrl, setMediaUrl] = useState(mediaPresets[0]);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  const handleSubmit = async () => {
    if (!caption.trim()) {
      toast.error("Give your moment a caption first.");
      return;
    }

    await actions.createPost.mutateAsync({
      userId: currentUser.id,
      caption,
      mediaUrl,
      mediaType,
      matchTag,
      team: currentUser.team as TeamKey,
    });

    setCaption("");
    toast.success("Post launched into the feed.");
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Drop your fan moment</CardTitle>
            <CardDescription>Images, videos, captions, and match tags.</CardDescription>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 p-3">
            <Sparkles className="h-5 w-5 text-[hsl(var(--theme-accent-soft))]" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="The crowd just erupted after that six..."
        />
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input value={matchTag} onChange={(event) => setMatchTag(event.target.value)} />
          <Input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} />
          <div className="flex gap-2">
            <Button
              variant={mediaType === "image" ? "default" : "secondary"}
              size="icon"
              onClick={() => setMediaType("image")}
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
            <Button
              variant={mediaType === "video" ? "default" : "secondary"}
              size="icon"
              onClick={() => setMediaType("video")}
            >
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {mediaPresets.map((preset) => (
            <button
              key={preset}
              className={`overflow-hidden rounded-3xl border transition ${
                mediaUrl === preset
                  ? "border-[hsl(var(--theme-accent))]"
                  : "border-white/10 hover:border-white/25"
              }`}
              onClick={() => setMediaUrl(preset)}
            >
              <img src={preset} alt="Preset" className="h-28 w-full object-cover" />
            </button>
          ))}
        </div>
        <Button className="w-full" onClick={handleSubmit}>
          Post to Feed
        </Button>
      </CardContent>
    </Card>
  );
}
