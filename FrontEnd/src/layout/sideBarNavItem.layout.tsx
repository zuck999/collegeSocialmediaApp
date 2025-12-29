import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./navItemsRole.layout";

const sidebarNavItemVariants = cva(
	"mb-2 flex w-full items-center gap-3 rounded-md px-4 py-2 font-semibold",
	{
		variants: {
			variant: {
				default: "text-foreground",
				active: "bg-zinc-200 text-zync-200",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

type SidebarNavItemProps = VariantProps<typeof sidebarNavItemVariants> & {
	item: NavItem;
	isOpen: boolean;
	onToggle: () => void;
	onNavigate: (path: string) => void;
	activeSubItemName: string;
	onSubItemClick: (path: string) => void;
};

const SidebarNavItem = ({
	item,
	isOpen,
	onToggle,
	onNavigate,
	activeSubItemName,
	onSubItemClick,
	variant,
}: SidebarNavItemProps) => {
	const subMenuRef = useRef<HTMLUListElement | null>(null);

	const subMenuHeight = isOpen
		? `${subMenuRef.current?.scrollHeight}px`
		: "0px";

	if (item.subItems) {
		return (
			<li>
				<button
					type="button"
					onClick={onToggle}
					className={cn(sidebarNavItemVariants({ variant }), "justify-between")}
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
						{item.subItems.map(
							(subItem: import("./navItemsRole.layout").SubNavItem) => {
								const isSubItemActive = activeSubItemName === subItem.name;
								return (
									<li key={subItem.name}>
										<button
											type="button"
											onClick={() => onSubItemClick(subItem.path)}
											className={cn(
												"flex w-full items-center gap-3 font-semibold text-left",
												isSubItemActive && "text-primary",
											)}
										>
											<subItem.icon size={20} />
											<span>{subItem.name}</span>
										</button>
									</li>
								);
							},
						)}
					</ul>
				</div>
			</li>
		);
	}

	return (
		<li>
			<button
				type="button"
				onClick={() => item.path && onNavigate(item.path)}
				className={cn(sidebarNavItemVariants({ variant }))}
			>
				<item.icon size={20} />
				<span>{item.name}</span>
			</button>
		</li>
	);
};

export default SidebarNavItem;
