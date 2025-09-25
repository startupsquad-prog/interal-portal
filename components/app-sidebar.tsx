// "use client"

// import * as React from "react"
// import {
//   IconCamera,
//   IconChartBar,
//   IconDashboard,
//   IconDatabase,
//   IconFileAi,
//   IconFileDescription,
//   IconFileWord,
//   IconFolder,
//   IconHelp,
//   IconInnerShadowTop,
//   IconListDetails,
//   IconReport,
//   IconSearch,
//   IconSettings,
//   IconUsers,
// } from "@tabler/icons-react"

// // import { NavDocuments } from "@/components/nav-documents"
// import { NavMain } from "@/components/nav-main"
// // import { NavSecondary } from "@/components/nav-secondary"
// import { NavUser } from "@/components/nav-user"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   navMain: [
//     {
//       title: "Home",
//       url: "#",
//       icon: IconDashboard,
//     },
//     {
//       title: "Leads",
//       url: "/leads",
//       icon: IconListDetails,
//     },
//     {
//       title: "Scheduled Appointment",
//       url: "#",
//       icon: IconChartBar,
//     },
//     {
//       title: "Configure Auto Assignment",
//       url: "#",
//       icon: IconFolder,
//     },
//     // {
//     //   title: "Team",
//     //   url: "#",
//     //   icon: IconUsers,
//     // },
//   ],
//   // navClouds: [
//   //   {
//   //     title: "Capture",
//   //     icon: IconCamera,
//   //     isActive: true,
//   //     url: "#",
//   //     items: [
//   //       {
//   //         title: "Active Proposals",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Archived",
//   //         url: "#",
//   //       },
//   //     ],
//   //   },
//   //   {
//   //     title: "Proposal",
//   //     icon: IconFileDescription,
//   //     url: "#",
//   //     items: [
//   //       {
//   //         title: "Active Proposals",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Archived",
//   //         url: "#",
//   //       },
//   //     ],
//   //   },
//   //   {
//   //     title: "Prompts",
//   //     icon: IconFileAi,
//   //     url: "#",
//   //     items: [
//   //       {
//   //         title: "Active Proposals",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Archived",
//   //         url: "#",
//   //       },
//   //     ],
//   //   },
//   // ],
//   // navSecondary: [
//   //   {
//   //     title: "Settings",
//   //     url: "#",
//   //     icon: IconSettings,
//   //   },
//   //   {
//   //     title: "Get Help",
//   //     url: "#",
//   //     icon: IconHelp,
//   //   },
//   //   {
//   //     title: "Search",
//   //     url: "#",
//   //     icon: IconSearch,
//   //   },
//   // ],
//   // documents: [
//   //   {
//   //     name: "Data Library",
//   //     url: "#",
//   //     icon: IconDatabase,
//   //   },
//   //   {
//   //     name: "Reports",
//   //     url: "#",
//   //     icon: IconReport,
//   //   },
//   //   {
//   //     name: "Word Assistant",
//   //     url: "#",
//   //     icon: IconFileWord,
//   //   },
//   // ],
// }

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="offcanvas" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               asChild
//               className="data-[slot=sidebar-menu-button]:!p-1.5"
//             >
//               <a href="#">
//                 <IconInnerShadowTop className="!size-5" />
//                 <span className="text-base font-semibold">Acme Inc.</span>
//               </a>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={data.navMain} />
//         {/* <NavDocuments items={data.documents} />
//         <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//     </Sidebar>
//   )
// }
"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard/home",
      icon: IconDashboard,
    },
    {
      title: "Leads",
      url: "/dashboard/leads",
      icon: IconListDetails,
    },
    {
      title: "Scheduled Appointment",
      url: "/appointments",
      icon: IconChartBar,
    },
    {
      title: "Configure Auto Assignment",
      url: "/auto-assignment",
      icon: IconFolder,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Startup Squad</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
