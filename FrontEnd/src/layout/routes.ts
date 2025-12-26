export const routes = {
	login: "/login",
	admin: {
		dash: {
			item1: "/admin/item1",
			item2: "/admin/item2",
		},
		students: "/admin/students",
		events: "/admin/events",
		add: "/admin/add",
	},
	user: {
		index:"user",
		home: "/user/home",
		profile: "/user/profile",
		message: "/user/message",
		post: "/user/post",
		accounts: "/user/accounts",
	},
} as const;
