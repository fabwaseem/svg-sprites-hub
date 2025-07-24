import { Sparkles } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="w-16 h-16 flex items-center justify-center mb-6 animate-spin-slow">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </span>
      </div>
      <p className="text-lg font-semibold text-primary mb-2">Loading...</p>
      <p className="text-muted-foreground">
        Please wait while we check your session.
      </p>
    </div>
  );
}
