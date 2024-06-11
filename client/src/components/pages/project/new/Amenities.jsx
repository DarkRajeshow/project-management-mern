import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { amenitiesAPI, fetchAmenitiesAPI } from '../../../../utility/api';

const Amenities = () => {
    const { id } = useParams(); // Get project ID from URL
    const navigate = useNavigate(); // For navigation
    const [amenities, setAmenities] = useState(['']);
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await amenitiesAPI(id, amenities);
            if (data.success) {
                toast.success(data.status);
                setIsSaved(true);
            }
            else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error saving the amenities!', error);
            setIsSaved(false);
        }
    };

    const handleNext = () => {
        navigate(`/projects/${id}/gallery`);
    };


    const amenityOptions = [
        { label: 'CCTV Camera\'s', value: 'cctv' },
        { label: 'Septic Tank', value: 'septic_tank' },
        { label: 'Society Office', value: 'society_office' },
        { label: 'Borewell', value: 'borewell' },
        { label: 'Lifts', value: 'lifts' },
        { label: 'Trace Garden', value: 'trace_garden' },
        { label: 'Drainage Line', value: 'drainage_line' },
        { label: 'Clubhouse', value: 'clubhouse' },
        { label: 'Rain Water Harvesting', value: 'rain_water_harvesting' },
        { label: 'Fire Filter System', value: 'fire_filter_system' },
    ];

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setAmenities([...amenities, value]);
        } else {
            setAmenities(amenities.filter((item) => item !== value));
        }
    };

    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        setAmenities(checked ? amenityOptions.map((option) => option.value) : []);
    };

    const fetchInitialAmenities = useCallback(async () => {
        try {
            const { data } = await fetchAmenitiesAPI(id);
            if (data.success) {
                if (data?.data?.length > 0) {
                    setAmenities(data.data);
                    setIsSaved(true);
                }
            } else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error fetching the amenities!', error);
            toast.error('There was an error fetching the amenities!');
            setIsSaved(false);
        }
    }, [id]);

    // useEffect to fetch basic info on component mount
    useEffect(() => {
        fetchInitialAmenities();
    }, [id, fetchInitialAmenities]);

    return (
        <div className="container mx-auto p-4">
            <p className='font-semibold text-zinc-500 '>Step 3 out of 5.</p>
            <h2 className="text-2xl font-bold mb-4">Amenities for the project</h2>
            <div className={`flex gap-3 mb-6 mt-2 py-3 px-4 rounded-md items-center ${amenities.length === amenityOptions.length ? 'bg-zinc-600/50' : 'bg-zinc-700/40'}`} >
                <input
                    type="checkbox"
                    id="selectAll"
                    className="mr-2 w-20 "
                    hidden
                    onChange={handleSelectAll}
                />
                <div className='w-10'>
                    <label htmlFor={'selectAll'} className="w-6 h-6 p-1 rounded mr-2 flex-shrink-0 flex items-center justify-center bg-zinc-600 outline-none text-green-300 cursor-default">
                        {(amenities.length === amenityOptions.length) && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        )}
                    </label>
                </div>
                <label htmlFor="selectAll" className='text-lg font-semibold cursor-pointer w-full'>Select All</label>
            </div>
            <form onSubmit={handleSubmit} className='grid sm:grid-cols-2 gap-6'>
                <div>
                    {amenityOptions.slice(0, 5).map((option) => (
                        <div key={option.value} className={`grid grid-cols-4 gap-3 mb-2 py-3 px-4 rounded-md items-center ${amenities.includes(option.value) ? 'bg-zinc-600/50' : 'bg-zinc-700/40'}`}>
                            <input
                                type="checkbox"
                                id={option.value}
                                name={option.value}
                                value={option.value}
                                checked={amenities.includes(option.value)}
                                onChange={handleCheckboxChange}
                                hidden
                                className="w-5 h-5 mx-auto text-zinc-600 checked:bg-green-500 "
                            />

                            <label htmlFor={option.value} className="w-6 h-6 p-1 rounded mr-2 flex-shrink-0 flex items-center justify-center bg-zinc-600 outline-none text-green-300 cursor-default">
                                {amenities.includes(option.value) && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                )}
                            </label>
                            <label className='col-span-3 text-lg font-semibold cursor-pointer' htmlFor={option.value}>{option.label}</label>
                        </div>
                    ))}
                </div>
                <div>
                    {amenityOptions.slice(5).map((option) => (
                        <div key={option.value} className={`grid grid-cols-4 gap-3 mb-2 py-3 px-4 rounded-md items-center ${amenities.includes(option.value) ? 'bg-zinc-600/50' : 'bg-zinc-700/40'}`}>
                            <input
                                type="checkbox"
                                id={option.value}
                                name={option.value}
                                value={option.value}
                                checked={amenities.includes(option.value)}
                                onChange={handleCheckboxChange}
                                hidden
                                className="w-5 h-5 mx-auto text-zinc-600 checked:bg-green-500 "
                            />
                            <label htmlFor={option.value} className="w-6 h-6 p-1 rounded mr-2 flex-shrink-0 flex items-center justify-center bg-zinc-600 outline-none text-green-300 cursor-default">
                                {amenities.includes(option.value) && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                )}
                            </label>
                            <label className='col-span-3 text-lg font-semibold cursor-pointer' htmlFor={option.value}>{option.label}</label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center col-span-2">
                    <button
                        type="submit"
                        className={`px-4 font-semibold py-1.5 bg-blue-600 rounded-md flex gap-2 items-center justify-center `}
                    >
                        {isSaved && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                        </svg>}
                        Save
                    </button>
                    <button
                        type="button"
                        disabled={!isSaved}
                        onClick={handleNext}
                        className={`px-4 font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center ${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-zinc-600'}`}
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Amenities;
