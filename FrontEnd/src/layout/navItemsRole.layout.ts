import type { LucideIcon } from "lucide-react";
import { BookDashed, Home, SquarePlus, User } from "lucide-react";
import { UserRoleUnion } from "@/utils/general";
import { routes } from "./routes";

export interface SubNavItem {
	name: string;
	path: string;
	icon: LucideIcon;
}

type NavigationLink =
	| {
			name: string;
			path: string;
			icon: LucideIcon;
			subItems?: never;
	  }
	| {
			name: string;
			path?: never;
			icon: LucideIcon;
			subItems: SubNavItem[];
	  };

export type NavItem = NavigationLink;

export const userNavItems: NavItem[] = [
	{
		icon: BookDashed,
		name: "Dashboard",
		subItems: [
			{
				name: "Profile",
				path: routes.user.profile,
				icon: User,
			},
		],
	},
	{
		name: "index",
		path: routes.user.index,
		icon: Home,
	},
	{
		name: "Home",
		path: routes.user.home,
		icon: Home,
	},
	{
		icon: SquarePlus,
		name: "post",
		path: routes.user.post,
	},
];

export const adminNavItems: NavItem[] = [
	{
		icon: BookDashed,
		name: "Dashboard",
		subItems: [
			{
				name: "Students",
				path: routes.admin.students,
				icon: User,
			},
		],
	},
];

export const navItemsByRole: Record<UserRoleUnion, NavItem[]> = {
	[UserRoleUnion.USER]: userNavItems,
	[UserRoleUnion.ADMIN]: adminNavItems,
};
