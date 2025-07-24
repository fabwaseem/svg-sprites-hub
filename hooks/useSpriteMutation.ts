import { useMutation } from "@tanstack/react-query";

export interface SpriteUploadPayload {
  name: string;
  description: string;
  category: string;
  tags: string[];
  icons: { name: string; svg: string }[];
}

export function useSpriteMutation() {
  return useMutation({
    mutationFn: async (payload: SpriteUploadPayload) => {
      const res = await fetch("/api/sprites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to upload sprite");
      return res.json();
    },
  });
}
