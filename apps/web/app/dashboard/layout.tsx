import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Home, ScanLine, Edit3, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "@/components/logout-button";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Auto-create user in database if they don't exist
  try {
    const user = await currentUser();
    if (user) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!existingUser) {
        // Validate email exists
        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) {
          console.error("User has no email address");
          redirect("/sign-in");
        }

        await db.insert(users).values({
          id: userId,
          clerkUserId: userId,
          email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
          imageUrl: user.imageUrl || null,
        });
        console.log(`✅ User auto-created: ${userId}`);
      }
    }
  } catch (error) {
    // Log error but don't crash the page
    console.error("Failed to auto-create user:", error);
    // User can still access dashboard, will be created on next visit
  }

  return (
    <SidebarProvider>
      <Sidebar className="bg-[#F4EDEB] border-r">
        <SidebarHeader className="border-b h-16 flex items-center px-4 py-0">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/web-logo.png"
              alt="Billo"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard">
                      <Home className="size-4" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/scan-receipt">
                      <ScanLine className="size-4" />
                      <span>Scan Receipt</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/manual">
                      <Edit3 className="size-4" />
                      <span>Manual Entry</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/groups">
                      <Users className="size-4" />
                      <span>Groups</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center justify-between">
            <UserButton />
            <LogoutButton />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-[#F4EDEB]">
        <header className="flex h-16 items-center gap-4 border-b px-6 bg-[#F4EDEB]">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
