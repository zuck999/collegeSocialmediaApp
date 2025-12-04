import Sidebar from "@/layout";
import { UserRoleUnion } from "@/utils/general";

function index() {
  return <Sidebar userRole={UserRoleUnion.USER}/>
}

export default index;
