import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function SpriteCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card>
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between ">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-6 w-32 mt-4 rounded" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="bg-gradient-to-br from-muted/50 to-muted/80 rounded-xl p-6 mb-4 min-h-[140px] flex items-center justify-center relative overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-4 relative z-10">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="size-8 rounded-lg" />
              ))}
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-12 rounded" />
            ))}
          </div>
        </CardContent>
        <CardFooter className="gap-3 relative z-10">
          <Skeleton className="h-9 flex-1 rounded" />
          <Skeleton className="h-9 flex-1 rounded" />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
