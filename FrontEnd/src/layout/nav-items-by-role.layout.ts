import { UserRoleUnion } from "@/utils/general";
import {routes} from "./routes";
import {BookDashed, Home, type LucideIcon ,SquarePlus,User} from "lucide-react";

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
    // {
    //     icon: BookDashed,
    //     name: "dashbord",
    //     subItems: [
    //         {
    //             name: "Profile",
    //             path: routes.user.profile,
    //             icon: User,
    //         }
    //     ],
    // },
    {
        name:"Home",
        path:routes.user.profile,
        icon:Home
    },
    {
        name:"Profile",
        path:routes.user.profile,
        icon:User
    },
    {
        icon: SquarePlus,
        name: "post",
        path: routes.user.post,
    }
]

export const adminNaveItems:NavItem[] = [
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
    }
]


export const navItemsByRole: Record<UserRoleUnion, NavItem[]> = {
    [UserRoleUnion.USER]: userNavItems,
    [UserRoleUnion.ADMIN]: adminNaveItems,
};

