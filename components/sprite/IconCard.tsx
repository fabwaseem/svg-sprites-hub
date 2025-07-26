"use client";

import { Icon } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { IconPreviewModal } from "./IconPreviewModal";

interface IconCardProps {
  icon: Icon;
}

export function IconCard({ icon }: IconCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <Card
        className="group aspect-square hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm cursor-pointer select-none"
        onClick={handleCardClick}
      >
        {/* Icon Preview - Full Card */}
        <div
          className="w-full h-full flex items-center justify-center p-6 pointer-events-none"
          onClick={handleCardClick}
        >
          <div
            className="w-16 h-16 flex items-center justify-center text-foreground transition-transform group-hover:scale-110 pointer-events-none"
            dangerouslySetInnerHTML={{ __html: icon.svg }}
            style={{ pointerEvents: "none" }}
          />
        </div>
      </Card>

      <IconPreviewModal
        icon={icon}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
