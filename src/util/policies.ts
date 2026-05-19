import { Project, TeamMember } from "../types"

//Si el usuario es el manager de un proyecto 
const isManager = (managerId :Project['manager'] , userId: TeamMember['_id'] ) => {
    return managerId === userId
}
export default isManager