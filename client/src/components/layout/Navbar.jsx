import { useCallback, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { getUserAPI, initializeProjectAPI, logoutAPI } from '../../utility/api';
import { toast } from 'sonner';

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);

    const location = useLocation();
    const navigate = useNavigate();

    const fetchLoggedUser = useCallback(async () => {
        try {
            const { data } = await getUserAPI();
            if (data.success) {
                setUser(data.user);
            }
            else {
                setUser({});
            }
        } catch (error) {
            console.log(error);
        }
    }, [setUser])

    useEffect(() => {
        fetchLoggedUser();
    }, [location.pathname, fetchLoggedUser]);
    const isAuthenticated = user.name ? true : false;


    const initializeProjectAndNavigate = async () => {
        if(location.pathname.includes("/projects")){
            return;
        }
        const { data } = await initializeProjectAPI();
        if (data.success) {
            toast.success(data.status)
            navigate(`/projects/${data.id}/basic-info`);
            return;
        }
        else{
            toast.error(data.status);
        }
    }

    return (
        <nav className="bg-zinc-800 backdrop-blur-md border-b-2 border-b-white/40">
            <div className="sm:text-base text-sm  container mx-auto px-4 py-5 font-semibold">
                <div className="flex justify-between items-center text-sm sm:text-base">
                    <div className="flex space-x-4 ">
                        <Link to="/" className={`text-white hover:text-blue-200 ${location.pathname == '/' && 'border-b-2 border-b-white'}`}>
                            Home
                        </Link>
                        <button onClick={initializeProjectAndNavigate} className={`text-white hover:text-blue-200 shadow-none ${location.pathname.includes("/projects") && 'border-b-2 border-b-white '}`}>
                            New project
                        </button>
                    </div>
                    <div className="flex space-x-4">
                        {isAuthenticated ? (
                            <>
                                <p className="hidden sm:flex text-white items-center justify-center gap-0.5 sm:gap-1 bg-zinc-100/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md  transition-all cursor-pointer shadow-[1px_1px_0_0] shadow-white hover:shadow-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 sm:size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    <span className='font-normal'> {user.name}</span>
                                </p>
                                <button className="bg-red-300 text-black px-2 py-1 text-xs sm:text-sm rounded-md " onClick={async () => {
                                    await logoutAPI();
                                    setUser([])
                                }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={`bg-blue-300 text-black py-1 px-2 text-xs sm:text-sm rounded-md`}>
                                    Login
                                </Link>
                                <Link to="/register" className={`bg-blue-300 text-black px-2 py-1 text-xs sm:text-sm rounded-md`}>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
