
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
                setFilteredProjects(data.project);
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
        <div className='flex flex-col pt-10 sm:pt-20 h-screen bg-zinc-800 text-white/80 px-20'>
            <div className='flex items-center justify-between gap-2 '>
                <h1 className="text-3xl font-bold py-6">Your Recent Projects</h1>
                <button onClick={initializeProjectAndNavigate} className='py-2 px-4 rounded-md flex items-center justify-center gap-2 bg-zinc-500/30 hover:bg-zinc-500/40 text-white'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new project</button>
            </div>

            <div className='flex items-center justify-center gap-2 py-2 px-4 my-4 bg-zinc-600/20 rounded-xl'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                    placeholder='Search projects...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className='w-full bg-transparent py-2 px-4 outline-none text-white focus:bg-transparent ' />
            </div>
            <table className="min-w-full rounded-md overflow-hidden border border-zinc-400 bg-zinc-700 shadow-2xl">
                <thead>
                    <tr className='bg-zinc-600 text-blue-100'>
                        <th className="px-6 py-3 ">Sr. No.</th>
                        <th className="px-6 py-3 ">Project Title</th>
                        <th className="px-6 py-3 ">Project Address</th>
                        <th className="px-6 py-3 ">Project Type</th>
                        <th className="px-6 py-3 ">RERA Number</th>
                        <th className="px-6 py-3 ">Proposed Completion Date</th>
                        <th className="px-6 py-3 ">View</th>
                        <th className="px-6 py-3 ">Delete</th>
                    </tr>
                </thead>
                <tbody className=" divide-y bg-zinc-700/20 text-zinc-300 divide-zinc-200">
                    {filteredProjects?.map((project, index) => {
                        if (project.basicInfo) {
                            srNo++;
                            return (
                                <tr key={index} className='text-center font-normal'>
                                    <td className="px-6 py-4 whitespace-nowrap">{srNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{project.basicInfo.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{project.basicInfo.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{project.basicInfo.projectType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{project.basicInfo.reraNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap tracking-widest">{new Date(project.basicInfo.dateOfCompletion).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={`/projects/${project._id}/basic-info`} className='text-blue-300'>Open</Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
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
