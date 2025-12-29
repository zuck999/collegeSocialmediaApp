import { Outlet } from "@tanstack/react-router";
import type React from "react";
import { SidebarProvider } from "@/context/sidebar.context";
import type { UserRoleUnion } from "@/utils/general";
import Header from "./header.layout";
import SideBar from "./sidebar.layout";

const LayoutContent: React.FC<{ userRole: UserRoleUnion }> = ({ userRole }) => {
	return (
<div className="h-screen flex flex-col">
	{/* Header */}
	<div className="h-[60px] bg-white border-b shrink-0 flex items-center">
		<Header />
	</div>

	{/* Content area */}
	<div className="flex-1 flex min-h-0">
		{/* Sidebar */}
		<aside className="hidden md:flex w-[250px] lg:w-[280px] border-r shrink-0 overflow-auto">
			<SideBar userRole={userRole} />
		</aside>

		{/* Main content */}
		<main className="flex-1 bg-zinc-100 overflow-auto">
			<div className="p-4">
				<Outlet />
			</div>
		</main>
	</div>
</div>
	);
};

const Layout: React.FC<{ userRole: UserRoleUnion }> = ({ userRole }) => {
	return (
		<SidebarProvider>
			<LayoutContent userRole={userRole} />
		</SidebarProvider>
	);
};

export default Layout;