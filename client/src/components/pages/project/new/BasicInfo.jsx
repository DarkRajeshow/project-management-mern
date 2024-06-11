import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { basicInfoAPI, fetchBasicInfoAPI, fetchProjectsAPI } from '../../../../utility/api';
import { toast } from 'sonner';
import { fetchCities, fetchStates } from '../../../../utility/cityStateApi';

const BasicInfoForm = () => {
    const { id } = useParams(); // Get project ID from URL
    const navigate = useNavigate(); // For navigation
    const [validationError, setValidationError] = useState(false);

    const [projects, setProjects] = useState([]);
    const [basicInfo, setBasicInfo] = useState({
        name: '',
        state: '',
        address: '',
        dateOfCompletion: '',
        projectType: '',
        city: '',
        landStatus: '',
        reraNumber: '',
    });
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo({ ...basicInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await basicInfoAPI(id, basicInfo);
            if (data.success) {
                toast.success(data.status);
                setIsSaved(true);
            }
            else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error saving the basic info!', error);
            setIsSaved(false);
        }
    };

    const handleNext = () => {
        navigate(`/projects/${id}/property-info`);
    };


    useEffect(() => {
        const getProjects = async () => {
            try {
                const { data } = await fetchProjectsAPI();
                console.log(data);
                if (data.success) {
                    setProjects(data.projects);
                }
            } catch (err) {
                console.log(err);
            }
        };

        getProjects();
    }, []);

    // Function to fetch basic info
    const fetchBasicInfo = useCallback(async () => {
        try {
            const { data } = await fetchBasicInfoAPI(id);
            if (data.success) {
                if (data?.data?.name) {
                    setBasicInfo(data.data);
                    setIsSaved(true);
                }
            } else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error fetching the basic info!', error);
            setIsSaved(false);
        }
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isProjectNameUnique = useCallback((newName) => {
        if (projects) {
            return !projects.some(project => {
                if (project.basicInfo) {
                    return project.basicInfo.name === newName && id !== project._id;
                }
            });
        }
        return true;
    }, [projects, id])


    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Fetch states on component mount
    useEffect(() => {
        const getStates = async () => {
            try {
                const statesData = await fetchStates();
                setStates(statesData);
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };

        getStates();
    }, []);

    // Fetch cities based on selected state
    useEffect(() => {
        if (basicInfo.state) {
            const getCities = async () => {
                try {
                    const citiesData = await fetchCities(basicInfo.state);
                    setCities(citiesData);
                } catch (error) {
                    console.error('Error fetching cities:', error);
                }
            };

            getCities();
        } else {
            setCities([]);
        }
    }, [basicInfo.state]);


    // useEffect to fetch basic info on component mount
    useEffect(() => {
        fetchBasicInfo();
    }, [id, fetchBasicInfo]);

    useEffect(() => {
        if (!isProjectNameUnique(basicInfo.name)) {
            setValidationError(true);
        }
        else {
            setValidationError(false);
        }
    }, [basicInfo.name, isProjectNameUnique])
    return (
        <div className="px-4 sm:px-10 md:px-14 lg:px-20 mx-auto p-8 bg-zinc-800 shadow-md rounded">
            <p className='sm:font-semibold text-zinc-500 '>Step 1 out of 5.</p>
            <h2 className="text-xl sm:text-2xl font-semibold sm:font-bold mb-2">Basic Information about the project</h2>
            <form onSubmit={handleSubmit} className="sm:grid sm:grid-cols-2 gap-4">
                <div>
                    <div className="mb-4">
                        <label className="block">Project Name</label>
                        {validationError && <p className='my-1 text-red-400'>{`The title '${basicInfo.name}' is already taken by your earlier projects.`}</p>}

                        <input
                            type="text"
                            name="name"
                            value={basicInfo.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            placeholder="Enter project name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">State</label>
                        <select
                            name="state"
                            value={basicInfo.state}
                            onChange={handleChange}
                            className="w-full p-2 outline-none rounded bg-zinc-700/20 focus:bg-zinc-700 mt-1"
                        >
                            <option value="">Select State</option>
                            {states.map((state) => (
                                <option key={state.id} value={state.state_name}>
                                    {state.state_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={basicInfo.address}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            placeholder="Enter address"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Date of Completion</label>
                        <input
                            type="date"
                            name="dateOfCompletion"
                            value={formatDate(basicInfo.dateOfCompletion)}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            placeholder="Enter date of completion"
                            required
                        />
                    </div>
                </div>
                <div>
                    <div className="mb-4">
                        <label className="block">Project Type</label>
                        <select
                            name="projectType"
                            value={basicInfo.projectType}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="open plot">Open Plot</option>
                            <option value="res + comm">Res + Comm</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block">City</label>
                        <select
                            name="city"
                            value={basicInfo.city}
                            onChange={handleChange}
                            className="w-full p-2 outline-none rounded bg-zinc-700/20 focus:bg-zinc-700 mt-1"
                            disabled={!basicInfo.state}
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.city_name}>
                                    {city.city_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block">Land Status</label>
                        <select
                            name="landStatus"
                            value={basicInfo.landStatus}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="available">Available</option>
                            <option value="sold">Sold</option>
                            <option value="under contract">Under Contract</option>
                            <option value="pending approval">Pending Approval</option>
                            <option value="not available">Not Available</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block">RERA Number</label>
                        <input
                            type="text"
                            name="reraNumber"
                            value={basicInfo.reraNumber}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            placeholder="Enter RERA number"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center col-span-2">
                    <button
                        type="submit"
                        className={`px-2 sm:px-4 sm:font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center text-sm sm:text-base ${validationError ? 'bg-zinc-600' : ' bg-blue-600'}`}
                        disabled={validationError}
                    >
                        {isSaved && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                        </svg>}
                        Save
                    </button>
                    <button
                        type="button"
                        disabled={!isSaved}
                        onClick={handleNext}
                        className={`px-2 sm:px-4 sm:font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center text-sm sm:text-base ${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-zinc-600'}`}
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BasicInfoForm;
