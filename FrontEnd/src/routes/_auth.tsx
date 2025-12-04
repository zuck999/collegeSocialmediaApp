// import { routes } from "@/layout/routes";
// import { useIsLoggedIn } from "@/store/authStorev2";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
});

function RouteComponent() {
	// const isLoggedIn = useIsLoggedIn();
	// const navigate = useNavigate();

	// if (!isLoggedIn) 
		// navigate({ //todo
		// 	to: routes.login.employee,
		// 	search: { redirect: location.href },
		// });

	return <Outlet />;
}
