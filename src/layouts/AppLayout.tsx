import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useAuth } from "../hooks/useAuth";
import Spineer from "../components/Spineer";
import SocketManager from "../components/SocketManager";

export default function AppLayout() {
  
  const {data, isError, isLoading, isFetching} = useAuth()

  if(isLoading) return <Spineer />
  
  if(isError && !isFetching) return <Navigate to='/auth/login'/>
  
  if(data) return (
    <div>
        <SocketManager />
        <Sidebar name={data.name} apellido_paterno={data.apellido_paterno} email={data.email} role={data.role} area={data.area} />
        <div className="ml-64">
            <Header />
            <section className="max-w-screen-2xl mx-auto p-5">
              <Outlet />
            </section>
            <Footer/>
        </div>
    </div>
  );
}
