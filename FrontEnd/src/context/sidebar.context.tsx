import { createContext, useContext, useState } from "react";

type SidebarContextType = {
	isExpanded: boolean;
	toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isExpanded, setIsExpanded] = useState(() => {
		return window.innerWidth >= 768;
	});

	const toggleSidebar = () => {
		setIsExpanded((prev) => !prev);
	};

	return (
		<SidebarContext.Provider
			value={{
				isExpanded,
				toggleSidebar,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
};
