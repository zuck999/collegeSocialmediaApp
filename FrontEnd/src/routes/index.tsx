// import { routes } from "@/layout/routes";
import { createFileRoute, Outlet } from "@tanstack/react-router";
// import { UserRoleUnion } from "@/utils/general";
// import { useAccessTokenData, useIsLoggedIn } from "@/store/authStorev2";
// import { routes } from "@/layout/routes";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	// const isLoggedIn = useIsLoggedIn();
	// const accessTokenData = useAccessTokenData();
	// const navigate = useNavigate();

	// TODO: Replace with real authentication/role detection logic.
	// For now, redirect logged-in users to the user home page.
	// navigate({ to: routes.user.home });
	// navigate({ to: routes.user.home })
	return <Outlet/>
}
