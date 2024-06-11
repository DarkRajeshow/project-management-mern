import { useCallback, useEffect, useState } from 'react';
import { deleteFileByNameAPI, fetchGalleryAPI, galleryAPI } from '../../../../utility/api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import filePath from '../../../../utility/filePath';

const Gallary = () => {
    const [siteElevations, setSiteElevations] = useState([]);
    const [siteImages, setSiteImages] = useState([]);
    const [siteBrochore, setsiteBrochore] = useState([]);
    const navigate = useNavigate(); // For navigation
    const { id } = useParams(); // Get project ID from URL
    const [isSaved, setIsSaved] = useState(false);


    const handleFileChange = (e, setFiles) => {
        setFiles((oldFiles) => {
            console.log(oldFiles);
            return [...oldFiles, ...e.target.files]
        });
    };

    const handleDrop = (e, setFiles) => {
        e.preventDefault();
        const selectedFiles = Array.from(e.dataTransfer.files);
        setFiles(selectedFiles);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleClick = (inputId) => {
        document.getElementById(inputId).click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        siteElevations.forEach(file => {
            if (file.name) {
                formData.append('siteElevations', file);
            }
        });

        siteImages.forEach(file => {
            if (file.name) {
                formData.append('siteImages', file);
            }
        });

        siteBrochore.forEach(file => {
            if (file.name) {
                formData.append('siteBrochore', file);
            }
        });

        if (siteElevations.length === 0 || siteImages.length === 0 || siteBrochore.length === 0) {
            toast.warning("Must upload at least one file to all the categories.")
            setIsSaved(false);
            return;
        }

        try {
            const { data } = await galleryAPI(id, formData);
            if (data.success) {
                toast.success(data.status);
                setIsSaved(true);
                await fetchGallery();
            }
            else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            toast.error("There was an error uploading the gallery files!");
            setIsSaved(false);
            console.error('There was an error uploading the gallery files!', error);
        }
    };

    const handleNext = () => {
        navigate(`/projects/${id}/documents`);
    };

    // Function to fetch basic info
    const fetchGallery = useCallback(async () => {
        try {
            const { data } = await fetchGalleryAPI(id);
            if (data.success) {
                if (data?.data?.siteImages.length > 0 || data?.data?.siteBrochore.length > 0 || data?.data?.siteElevations.length > 0) {
                    setSiteElevations(data?.data?.siteElevations);
                    setSiteImages(data?.data?.siteImages);
                    setsiteBrochore(data?.data?.siteBrochore);
                    if (data?.data?.siteElevations.length > 0 && data.data?.siteImages.length > 0 && data.data?.siteBrochore.length > 0) {
                        setIsSaved(true);
                    }
                }
                else {
                    setIsSaved(false);
                }
            } else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error fetching the basic info!', error);
            toast.error('There was an error fetching the basic info!');
            setIsSaved(false);
        }
    }, [id]);


    const deleteFileByName = async (type, filename) => {
        try {
            const { data } = await deleteFileByNameAPI(id, type, filename);
            console.log(data);
            if (data.success) {
                toast.success(data.status);
                await fetchGallery();
            }
            else {
                toast.error(data.status);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

    // useEffect to fetch basic info on component mount
    useEffect(() => {
        fetchGallery();
    }, [id, fetchGallery]);


    return (
        <main className='px-4 sm:px-10 md:px-14 lg:px-20 my-10'>
            <div>
                <p className='font-semibold text-zinc-500 '>Step 4 out of 5.</p>
                <h2 className="text-2xl font-bold sm:mb-2">Gallary file of project</h2>
            </div>
            <form onSubmit={handleSubmit} className="py-2 sm:py-8 sm:grid grid-cols-2 gap-5 " >
                {/* Site Elevations Upload */}
                <div className='rounded-md mt-4 mb-6'>
                    <label className="block text-lg sm:text-xl font-semibold sm:py-3">
                        Upload Site Elevation Here
                    </label>
                    <div className='mb-4'>
                        {siteElevations.map((file, index) => (
                            <div key={index} className='flex py-1 sm:py-2 px-3 bg-zinc-700 rounded-md mb-1.5 items-center justify-between'>
                                <div className='flex items-center justify-center gap-2'>
                                    <span>{index + 1}</span>
                                    <h2>{file.name ? file.name : file}</h2>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    {!file.name && <a href={`${filePath}/${file}`}
                                        download
                                        target='_blank'
                                        className='shadow-none py-1.5 px-2 text-sm bg-green-700 rounded-md'>View</a>}
                                    <button type='button' onClick={() => {
                                        if (!file.name) {
                                            deleteFileByName('siteElevations', file);
                                            return;
                                        }
                                        const updatedElevations = [...siteElevations];
                                        updatedElevations.splice(index, 1);
                                        setSiteElevations(updatedElevations)
                                    }} className='shadow-none py-1.5 px-2 text-sm bg-red-700 rounded-md'>{!file.name ? "Delete" : "Remove"}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <input
                        id='siteElevation'
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e, setSiteElevations)}
                        className="hidden"
                    />
                    <div
                        onClick={() => handleClick('siteElevation')}
                        onDrop={(e) => { handleDrop(e, setSiteElevations) }}
                        onDragOver={handleDragOver}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded mt-1 cursor-pointer flex items-center justify-center h-72"
                    >
                        <span className='sm:text-lg w-60 mx-auto text-center'>Drag and drop files here or click to upload</span>
                    </div>
                </div>

                {/* Site Images Upload */}
                <div className=' rounded-md mt-4 mb-6'>
                    <label className="block text-lg sm:text-xl font-semibold sm:py-3">
                        Upload Site Images Here
                    </label>

                    <div className='mb-4'>
                        {siteImages.map((file, index) => (
                            <div key={index} className='flex py-2 px-3 bg-zinc-700 rounded-md mb-1.5 items-center justify-between'>
                                <div className='flex items-center justify-center gap-2'>
                                    <span>{index + 1}</span>
                                    <h2>{file.name ? file.name : file}</h2>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    {!file.name && <a href={`${filePath}/${file}`}
                                        download
                                        target='_blank'
                                        className='shadow-none py-1.5 px-2 text-sm bg-green-700 rounded-md'>View</a>}
                                    <button type='button' onClick={() => {
                                        if (!file.name) {
                                            deleteFileByName('siteImages', file);
                                            return;
                                        }
                                        const updatedImages = [...siteImages];
                                        updatedImages.splice(index, 1);
                                        setSiteImages(updatedImages);
                                    }} className='shadow-none py-1.5 px-2 text-sm bg-red-700 rounded-md'>{!file.name ? "Delete" : "Remove"}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <input
                        id='siteImages'
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e, setSiteImages)}
                        className="hidden"
                    />
                    <div
                        onClick={() => handleClick('siteImages')}
                        onDrop={(e) => { handleDrop(e, setSiteImages) }}
                        onDragOver={handleDragOver}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded mt-1 cursor-pointer flex items-center justify-center h-72"
                    >
                        <span className='sm:text-lg w-60 mx-auto text-center'>Drag and drop files here or click to upload</span>
                    </div>
                </div>

                {/* Site Brochures Upload */}
                <div className=' rounded-md col-span-3 mt-4 mb-6'>
                    <label className="block text-lg sm:text-xl font-semibold sm:py-3">
                        Upload Site Brochures Here
                    </label>

                    <div className='mb-4'>
                        {siteBrochore.map((file, index) => (
                            <div key={index} className='flex py-2 px-3 bg-zinc-700 rounded-md mb-1.5 items-center justify-between'>
                                <div className='flex items-center justify-center gap-2'>
                                    <span>{index + 1}</span>
                                    <h2>{file.name ? file.name : file}</h2>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    {!file.name && <a href={`${filePath}/${file}`}
                                        download
                                        target='_blank'
                                        className='shadow-none py-1.5 px-2 text-sm bg-green-700 rounded-md'>View</a>}
                                    <button type='button' onClick={() => {
                                        if (!file.name) {
                                            deleteFileByName('siteBrochore', file);
                                            return;
                                        }
                                        const updatedBrochures = [...siteBrochore];
                                        updatedBrochures.splice(index, 1);
                                        setsiteBrochore(updatedBrochures)
                                    }} className='shadow-none py-1.5 px-2 text-sm bg-red-700 rounded-md'>{!file.name ? "Delete" : "Remove"}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <input
                        id='siteBrochore'
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e, setsiteBrochore)}
                        className="hidden"
                    />
                    <div
                        onClick={() => handleClick('siteBrochore')}
                        onDrop={(e) => { handleDrop(e, setsiteBrochore) }}
                        onDragOver={handleDragOver}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded mt-1 cursor-pointer flex items-center justify-center h-72"
                    >
                        <span className='sm:text-lg w-60 mx-auto text-center'>Drag and drop files here or click to upload</span>
                    </div>
                </div>

                <div className="flex justify-between items-center col-span-2">
                    <Link
                        to={`/projects/${id}/amenities`}
                        className={`px-2 sm:px-4 sm:font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center text-sm sm:text-base bg-zinc-700 hover:bg-zinc-600 `}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
                        </svg>
                        Previous
                    </Link>
                    <div className='flex items-center justify-center gap-4'>
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
                </div>
            </form>

        </main >
    );
};

export default Gallary;
