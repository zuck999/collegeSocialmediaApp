import {routes} from "./routes";
import {BookDashed, type LucideIcon ,SquarePlus,User} from "lucide-react";

interface SubNavItem {
    name: string;
    path: string;
    icon: LucideIcon;
}

export interface NavItem {
    icon: LucideIcon;
    name: string;
    path?: string;
    subItems?: SubNavItem[];
}

export const userNavItems: NavItem[] = [
    {
        icon: BookDashed,
        name: "dashbord",
        subItems: [
            {
                name: "Profile",
                path: routes.user.profile,
                icon: User,
            }
        ],
    },
    {
        icon: SquarePlus,
        name: "post",
        path: routes.user.post,
    }
]