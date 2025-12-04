import Sidebar from "@/layout";
import { UserRoleUnion } from "@/utils/general";

function index() {
	return <Sidebar userRole={UserRoleUnion.ADMIN} />;
}

export default index;
