import ProfileForm from "../components/nav-profile/ProfileForm"
import Spineer from "../components/Spineer"
import { useAuth } from "../hooks/useAuth"

export default function Profile() {
    //el perfil tiene que estar autenticado
    const {data, isLoading} = useAuth()

    if(isLoading) return <Spineer />

  if(data) return (
    <ProfileForm data={data} />
  )
}
