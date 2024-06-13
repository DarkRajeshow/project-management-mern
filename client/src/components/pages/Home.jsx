import { useCallback, useEffect, useState } from 'react';
import { deleteProjectsAPI, fetchProjectsAPI, initializeProjectAPI } from '../../utility/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const getProjects = async () => {
        try {
            const { data } = await fetchProjectsAPI();
            console.log(data);
            if (data.success) {
                setProjects(data.projects);
                setFilteredProjects(data.projects);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getProjects();
    }, []);


    const handleSearchChange = useCallback(() => {
        const tempFilteredProjects = projects.filter(project =>
            project.basicInfo && project.basicInfo.name.toLowerCase().includes(search.toLowerCase())
        );
        console.log(tempFilteredProjects);
        setFilteredProjects(tempFilteredProjects);
    }, [projects, search])


    useEffect(() => {
        handleSearchChange();
    }, [search, handleSearchChange])

    const initializeProjectAndNavigate = async () => {
        if (location.pathname.includes("/projects")) {
            return;
        }
        const { data } = await initializeProjectAPI();
        if (data.success) {
            toast.success(data.status)
            navigate(`/projects/${data.id}/basic-info`);
            return;
        }
        else {
            toast.error(data.status);
        }
    }

    const handleDelete = async (projectId) => {
        try {
            const { data } = await deleteProjectsAPI(projectId);
            console.log(data);
            if (data.success) {
                toast.success(data.status);
                await getProjects();
            }
            else {
                toast.error(data.status);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

    let srNo = 0;

    return (
        <div className='flex flex-col pt-10 h-screen bg-zinc-800 text-white/80 px-4 sm:px-8 md:px-12 lg:px-20'>
            <div className='flex items-center justify-between gap-0.5 sm:gap-2 '>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-6">Your Recent Projects</h1>
                <button onClick={initializeProjectAndNavigate} className='py-1 sm:py-2 px-2 sm:px-4 rounded-md flex items-center justify-center gap-2 bg-zinc-500/30 hover:bg-zinc-500/40 text-white text-xs sm:text-base'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 sm:size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Project
                </button>
            </div>

            <div className='flex items-center justify-center gap-1 sm:gap-2 py-1 sm:py-1 md:py-2 px-4 mb-3 sm:my-4 bg-zinc-600/20 rounded-xl'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                    placeholder='Search projects...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className='w-full bg-transparent py-1 sm:py-2 px-2 sm:px-4 outline-none text-white focus:bg-transparent' />
            </div>
            <table className="w-full rounded-md overflow-hidden border border-zinc-400 bg-zinc-700 shadow-2xl">
                <thead>
                    <tr className='bg-zinc-600 text-blue-100'>
                        <th className="">Sr. No.</th>
                        <th className="">Project Title</th>
                        <th className="hidden md:table-cell  ">Project Address</th>
                        <th className="hidden xl:table-cell  ">RERA Number</th>
                        <th className="hidden xl:table-cell  ">Proposed Completion Date</th>
                        <th className=" ">View</th>
                        <th className=" ">Update</th>
                        <th className=" ">Delete</th>
                    </tr>
                </thead>
                <tbody className="divide-y bg-zinc-700/20 text-zinc-300 divide-zinc-200">
                    {filteredProjects?.map((project, index) => {
                        if (project.basicInfo) {
                            srNo++;
                            return (
                                <tr key={index} className='text-center font-normal'>
                                    <td className="px-2 sm:px-6 py-4">{srNo}</td>
                                    <td className="px-2 sm:px-6 py-4">{project.basicInfo.name}</td>
                                    <td className="hidden md:table-cell px-2 sm:px-6 py-4">{project.basicInfo.address}</td>
                                    <td className="hidden xl:table-cell px-2 sm:px-6 py-4">{project.basicInfo.reraNumber}</td>
                                    <td className="hidden xl:table-cell px-2 sm:px-6 py-4 tracking-widest">{new Date(project.basicInfo.dateOfCompletion).toLocaleDateString()}</td>
                                    <td className="px-2 sm:px-6 py-4">
                                        <Link to={`/projects/${project._id}`} className='text-blue-300'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mx-auto">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                        </Link>
                                    </td>
                                    <td className="px-2 sm:px-6 py-4">
                                        <Link to={`/projects/${project._id}/basic-info`} className='text-blue-300'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mx-auto">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                            </svg>
                                        </Link>
                                    </td>
                                    <td className="px-2 sm:px-6 py-4">
                                        <button onClick={handleDelete.bind(this, project._id)} className='shadow-none text-red-300'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        }
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Home;
