import { Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/context/sidebar.context";
import SideBar from "./sidebar.layout";
import Header from "./header.layout";
import { UserRoleUnion } from "@/utils/general";
import React from "react";


const LayoutContent: React.FC<{ userRole: UserRoleUnion }> = ({ userRole }) => {

    return (
        <div className="min-h-screen flex flex-col">
            <Header className="bg-white border h-[60px]" />

            <div className="flex flex-1">
                <SideBar
                    userRole={userRole}
                    className="hidden bg-white md:block "
                />

                <main className="flex-1 bg-zinc-100 p-4">
                    <Outlet />
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
