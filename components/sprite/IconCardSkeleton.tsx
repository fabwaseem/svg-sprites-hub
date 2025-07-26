import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function IconCardSkeleton() {
  return (
    <Card className="aspect-square border-border/50 bg-card/50 backdrop-blur-sm">
      <Skeleton className="w-full h-full rounded-lg" />
    </Card>
  );
}
