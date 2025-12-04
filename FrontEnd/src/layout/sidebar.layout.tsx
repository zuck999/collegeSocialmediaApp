import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { ChevronDownIcon, LogOut } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { routes } from "./routes";
import { NavItem, navItemsByRole } from "./nav-items-by-role.layout";
import { UserRoleUnion } from "@/utils/general";

type SidebarNavItemProps = {
	item: NavItem;
	isOpen: boolean;
	onToggle: () => void;
	isActive: boolean;
	onNavigate: (path: string) => void;
	activeSubItemName: string;
	onSubItemClick: (path: string) => void;
};

const SidebarNavItem = ({
	item,
	isOpen,
	onToggle,
	isActive,
	onNavigate,
	activeSubItemName,
	onSubItemClick,
}: SidebarNavItemProps) => {
	const subMenuRef = useRef<HTMLUListElement | null>(null);
	const itemClasses = cn(
		"flex w-full items-center gap-3 rounded-md px-4 py-2 font-semibold mb-2",
		isActive && "bg-primary text-primary-foreground",
	);

	const subMenuHeight = isOpen
		? `${subMenuRef.current?.scrollHeight}px`
		: "0px";

	return (
		<li>
			{item.subItems ? (
				<>
					<button
						type="button"
						onClick={onToggle}
						className={cn(itemClasses, "justify-between")}
					>
						<div className="flex items-center gap-3">
							<item.icon size={20} />
							{item.name}
						</div>
						<ChevronDownIcon
							className={cn(
								"transition-transform duration-200",
								isOpen && "rotate-180",
							)}
							size={20}
						/>
					</button>
					<div
						className="overflow-hidden transition-all duration-300"
						style={{ height: subMenuHeight }}
					>
						<ul
							ref={subMenuRef}
							className="relative ml-6 space-y-4 pl-4 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-xl before:bg-gray-300"
						>
							{item.subItems.map((subItem) => {
								const isSubItemActive = activeSubItemName === subItem.name;
								return (
									<li
										key={subItem.name}
										onClick={() => onSubItemClick(subItem.path as string)}
										className={cn(
											"flex cursor-pointer items-center gap-3 font-semibold",
											isSubItemActive && "text-primary",
										)}
									>
										<subItem.icon size={20} />
										<span>{subItem.name}</span>
									</li>
								);
							})}
						</ul>
					</div>
				</>
			) : (
				<button
					type="button"
					onClick={() => item.path && onNavigate(item.path as string)}
					className={itemClasses}
				>
					<item.icon size={20} />
					<span>{item.name}</span>
				</button>
			)}
		</li>
	);
};

const SideBar = ({
	className,
	userRole,
}: React.ComponentProps<"aside"> & { userRole: UserRoleUnion }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
	// const { logout } = useAuthActions();//todo

	const navItems = navItemsByRole[userRole];

	const isPathActive = (path: string | undefined): boolean => {
		if (!path) return false;
		return location.pathname === path;
	};

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

	const getActiveSubItemName = (subItems: NavItem["subItems"]): string => {
		const activeSubItem = subItems?.find((sub) =>
			isPathActive(sub.path as string),
		);
		return activeSubItem?.name || "";
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
							: isPathActive(nav.path as string);

						return (
							<SidebarNavItem
								key={nav.name}
								item={nav}
								isOpen={openSubMenuIndex === index}
								onToggle={() => handleSubMenuToggle(index)}
								isActive={isActive}
								onNavigate={handleNavigate}
								activeSubItemName={getActiveSubItemName(nav.subItems)}
								onSubItemClick={(path) => {
									handleNavigate(path);
								}}
							/>
						);
					})}
				</ul>

				<div className="flex flex-col gap-2">
					<button
						type="button"
						className="ml-3 flex items-center gap-2 font-semibold text-destructive"
						onClick={() => {
							// LogOut;todo
							navigate({ to: routes.login });
						}}
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
