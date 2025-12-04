import { routes } from "@/layout/routes";
// import { UserRoleUnion } from "@/utils/general";
// import { useAccessTokenData, useIsLoggedIn } from "@/store/authStorev2";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	// const isLoggedIn = useIsLoggedIn();
	// const accessTokenData = useAccessTokenData();
	const navigate = useNavigate();

	if (true) {
		switch ("USER") {
			case "USER":
				navigate({ to: routes.user.home });
				break;

			// case "ADMIN"://todo
			// 	navigate({ to: routes.admin.add });
			// 	break;
		}
	} else {
		navigate({ to: routes.login });
	}
}
