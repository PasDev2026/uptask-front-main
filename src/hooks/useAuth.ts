import { useQuery } from "@tanstack/react-query";
import { getUserApi } from "../api/auth.api";


export const useAuth = () => {
    
    const {data, isError, isLoading} = useQuery({
            queryKey: ['user'], 
            queryFn: getUserApi,
            retry: 1,
            refetchOnWindowFocus: false
        })

    return {data, isError, isLoading}
}