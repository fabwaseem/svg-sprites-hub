import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Upload, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function UserDropdown() {
  const { data: session } = authClient.useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 rounded-full"
        >
          <Avatar className="w-8 h-8">
            {session?.user?.image ? (
              <AvatarImage
                src={session?.user?.image}
                alt={session?.user?.name || session?.user?.email || "User"}
              />
            ) : (
              <AvatarFallback>
                {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium text-primary">
            {session?.user?.name || session?.user?.email || "User"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-semibold">{session?.user?.name || "User"}</span>
          <span className="text-xs text-muted-foreground truncate">
            {session?.user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <User className="w-4 h-4" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => authClient.signOut()}
          className="text-destructive flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
