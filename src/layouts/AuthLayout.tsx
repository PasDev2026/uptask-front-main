import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-[450px]">
        <img
            src="/in planner.png"
            className="h-14 mx-auto"
            alt="Flowbite Logo"
          />
    
          <div className="mt-10">
            <Outlet />
          </div>

          
        </div>
      </div>
    </>
  );
}
