import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchPropertyInfoAPI, propertyInfoAPI } from '../../../../utility/api';
import numberToWords from '../../../../utility/numberToWords';

const PropertyInfo = () => {
    const { id } = useParams(); // Get project ID from URL
    const navigate = useNavigate(); // For navigation
    const [propertyInfo, setPropertyInfo] = useState({
        totalPlats: '',
        totalShops: '',
        totalOffices: '',
        totalFloors: '',
        engineerName: '',
        architectName: '',
        estimatedCost: '',
    });
    const [isSaved, setIsSaved] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropertyInfo({ ...propertyInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await propertyInfoAPI(id, propertyInfo);
            if (data.success) {
                toast.success(data.status);
                setIsSaved(true);
            }
            else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error saving the property info!', error);
            setIsSaved(false);
        }
    };

    const handleNext = () => {
        navigate(`/projects/${id}/amenities`);
    };

    // Function to fetch basic info
    const fetchPropertyInfo = useCallback(async () => {
        try {
            const { data } = await fetchPropertyInfoAPI(id);
            if (data.success) {
                if (data?.data?.totalShops) {
                    setPropertyInfo(data.data);
                    setIsSaved(true);
                }
            } else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error fetching the property info!', error);
            toast.error('There was an error fetching the property info!');
            setIsSaved(false);
        }
    }, [id]);

    // useEffect to fetch basic info on component mount
    useEffect(() => {
        fetchPropertyInfo();
    }, [id, fetchPropertyInfo]);
    return (
        <div className="px-20 mx-auto p-8 bg-zinc-800 rounded">
            <p className='font-semibold text-zinc-500 '>Step 2 out of 5.</p>
            <h2 className="text-2xl font-bold mb-2">Property Information about the project</h2>
            <form onSubmit={handleSubmit} className='grid sm:grid-cols-2 gap-4'>
                <div className="mb-4">
                    <label className="block ">Total Plats</label>
                    <input
                        type="number"
                        name="totalPlats"
                        value={propertyInfo.totalPlats}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="Enter total plats"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block ">Total Shops</label>
                    <input
                        type="number"
                        name="totalShops"
                        value={propertyInfo.totalShops}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="Enter total shops"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block ">Total Offices</label>
                    <input
                        type="number"
                        name="totalOffices"
                        value={propertyInfo.totalOffices}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="Enter total offices"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block ">Total Floors</label>
                    <input
                        type="number"
                        name="totalFloors"
                        value={propertyInfo.totalFloors}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="Enter total floors"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block ">Engineer Name</label>
                    <input
                        type="text"
                        name="engineerName"
                        value={propertyInfo.engineerName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="Enter engineer name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block ">Architect Name</label>
                    <input
                        type="text"
                        name="architectName"
                        value={propertyInfo.architectName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="Enter architect name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block ">Estimated Cost</label>
                    <input
                        type="number"
                        name="estimatedCost"
                        value={propertyInfo.estimatedCost}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="Enter estimated cost"
                        required
                    />
                    <p className='text-green-500 font-semibold text-sm my-2' >{numberToWords(propertyInfo.estimatedCost)}</p>
                </div>
                <div className="flex justify-between items-center col-span-2">
                    <button
                        type="submit"
                        className={`px-4 font-semibold py-1.5 bg-blue-600 rounded-md flex gap-2 items-center justify-center `}
                    >
                        {isSaved && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-300">
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

export default PropertyInfo;
