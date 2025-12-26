import { useLocation, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useAuthActions } from "@/context/auth";
import { cn } from "@/lib/utils";
import type { UserRoleUnion } from "@/utils/general";
import SidebarNavItem from "./sideBarNavItem.layout";
import { navItemsByRole, type SubNavItem } from "./navItemsRole.layout";

const SideBar = ({
	className,
	userRole,
}: React.ComponentProps<"aside"> & { userRole: UserRoleUnion }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
	const { logout } = useAuthActions();

	const navItems = navItemsByRole[userRole];

	useEffect(() => {
		const activeItemIndex = navItems.findIndex(
			(nav) =>
				nav.path === location.pathname ||
				nav.subItems?.some((sub) => sub.path === location.pathname),
		);
		if (activeItemIndex !== -1) {
			setOpenSubMenuIndex(activeItemIndex);
		}
	}, [location.pathname, navItems]);

	const handleSubMenuToggle = (index: number) =>
		setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);

	const handleNavigate = (path: string) => {
		navigate({ to: path });
	};

	const getActiveSubItemName = (
		subItems?: SubNavItem[] | undefined,
	): string => {
		const activeSubItem = subItems?.find(
			(sub) => location.pathname === sub.path,
		);
		return activeSubItem?.name ?? "";
	};

	return (
		<aside
			className={cn(
				"fixed inset-y-0 left-0 z-40  w-64 overflow-y-auto bg-sidebar px-4 py-15 transition-all duration-300 ease-in-out lg:translate-x-0",
				className,
			)}
		>
			<nav className="flex h-full flex-col justify-between">
				<ul className="flex w-full flex-col gap-2">
					{navItems.map((nav, index) => {
						const hasSubItems = !!nav.subItems;
						const hasActiveSubItem = nav.subItems?.some(
							(sub) => location.pathname === sub.path,
						);

						const isActive = hasSubItems
							? (hasActiveSubItem ?? false)
							: location.pathname === nav.path;

						return (
							<SidebarNavItem
								key={nav.name}
								item={nav}
								isOpen={openSubMenuIndex === index}
								onToggle={() => handleSubMenuToggle(index)}
								variant={isActive ? "active" : "default"}
								onNavigate={handleNavigate}
								activeSubItemName={getActiveSubItemName(nav.subItems)}
								onSubItemClick={handleNavigate}
							/>
						);
					})}
				</ul>

				<div className="flex flex-col gap-2">
					<button
						type="button"
						className="ml-3 flex items-center gap-2 font-semibold text-destructive"
						onClick={logout}
					>
						<LogOut size={20} />
						<div>Logout</div>
					</button>
				</div>
			</nav>
		</aside>
	);
};

export default SideBar;
