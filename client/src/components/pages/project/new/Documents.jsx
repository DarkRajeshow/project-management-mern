import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteDocumentAPI, documentsAPI, fetchDocumentsAPI } from '../../../../utility/api';
import { toast } from 'sonner';
import filePath from '../../../../utility/filePath';

const Documents = () => {

    const [documents, setDocuments] = useState([]);
    const [fileTitle, setFileTitle] = useState('');
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [isSaved, setIsSaved] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    const handleFileChange = (e) => {
        setDocuments([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        documents.forEach(file => formData.append('documents', file));
        formData.append('fileTitle', fileTitle);

        if (documents.length === 0) {
            toast.warning("Add file to upload.")
            return;
        }

        try {
            const { data } = await documentsAPI(id, formData);
            if (data.success) {
                toast.success(data.status);
                setDocuments([]);
                setIsSaved(true);
                await fetchDocuments();
            } else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            toast.error("There was an error uploading the gallery files!");
            setIsSaved(false);
            console.error('There was an error uploading the gallery files!', error);
        }
    };

    const fetchDocuments = useCallback(async () => {
        try {
            const { data } = await fetchDocumentsAPI(id);
            if (data?.documents?.length > 0) {
                setUploadedDocuments(data?.documents);
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            setIsSaved(false);
        }
    }, [id]);

    const deleteDocumentByName = async (documentId) => {
        try {
            const { data } = await deleteDocumentAPI(id, documentId);
            if (data.success) {
                toast.success(data.status);
                await fetchDocuments();
                if (uploadedDocuments.length === 0) {
                    setIsSaved(false);
                }
            } else {
                toast.error(data.status);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

    useEffect(() => {
        fetchDocuments();
    }, [id, fetchDocuments]);

    const handleComplete = () => {
        if (isSaved) {
            navigate(`/`);
        } else {
            toast.warning("Upload document to complete process.")
        }
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

    return (
        <div className="p-6 sm:mx-10 lg:mx-20 rounded-xl shadow-md space-y-4">
            <p className='text-sm sm:text-base font-semibold text-zinc-500'>Step 5 out of 5 (Last Step).</p>
            <h2 className="text-xl sm:text-2xl font-semibold sm:font-bold mb-2 sm:mb-4">Upload Documents of the project</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <label className="block font-medium text-base sm:text-lg">
                        Document Title
                    </label>
                    <input
                        type="text"
                        required
                        value={fileTitle}
                        placeholder='Enter the document title...'
                        onChange={(e) => setFileTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className='rounded-md'>
                    <label className="block pt-2 text-base sm:text-lg">
                        Upload Document here
                    </label>
                    <div className='mb-4'>
                        {documents && documents.map((file, index) => (
                            <div key={index} className='flex py-2 px-3 bg-zinc-700 rounded-md mb-1.5 items-center justify-between'>
                                <div className='flex items-center justify-center gap-2'>
                                    <span>{index + 1}</span>
                                    <h2>{file.name}</h2>
                                </div>
                                <button type='button' onClick={() => {
                                    const updatedDocuments = [...documents];
                                    updatedDocuments.splice(index, 1);
                                    setDocuments(updatedDocuments);
                                }} className='shadow-none py-1.5 px-2 text-sm bg-red-700 rounded-md'>Remove</button>
                            </div>
                        ))}
                    </div>
                    <input
                        id='documents'
                        type="file"
                        multiple
                        required
                        onChange={(e) => handleFileChange(e)}
                        className="hidden"
                    />
                    <div
                        onClick={() => handleClick('documents')}
                        onDrop={(e) => { handleDrop(e, setDocuments) }}
                        onDragOver={handleDragOver}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer flex items-center justify-center min-h-72"
                    >
                        <span className='sm:text-lg w-60 mx-auto text-center'>Drag and drop files here or click to upload</span>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-1 px-2 sm:py-2 sm:px-4 border border-transparent rounded-md text-white bg-yellow-600 sm:font-semibold hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                    Upload
                </button>
            </form>
            <div className='pt-10 pb-5'>
                <h3 className="text-lg font-semibold">Uploaded Documents</h3>
                <table className="min-w-full mt-4 rounded-md overflow-hidden border border-zinc-200">
                    <thead>
                        <tr className='bg-zinc-600'>
                            <th className="px-3 py-3 sm:px-6">Sr. No.</th>
                            <th className="px-3 py-3 sm:px-6">Document Title</th>
                            <th className="px-3 py-3 sm:px-6">Download</th>
                            <th className="px-3 py-3 sm:px-6">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="bg-zinc-600/40">
                        {uploadedDocuments.map((document, index) => (
                            <tr key={index}>
                                <td className="px-3 py-4 sm:px-6">{index + 1}</td>
                                <td className="px-3 py-4 sm:px-6">{document.title}</td>
                                <td className="px-3 py-4 sm:px-6 text-center">
                                    <a
                                        href={`${filePath}/${document.filename}`}
                                        download
                                        target='_blank'
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mx-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                        </svg>
                                    </a>
                                </td>
                                <td className="px-3 py-4 sm:px-6 text-center">
                                    <button
                                        className="text-red-600 hover:text-red-900 shadow-none"
                                        onClick={deleteDocumentByName.bind(this, document.filename)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center col-span-2">
                <Link
                    to={`/projects/${id}/gallery`}
                    className={`px-2 sm:px-4 sm:font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center text-sm sm:text-base bg-zinc-700 hover:bg-zinc-600 `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
                    </svg>
                    Previous
                </Link>
                <div className='gap-4 sm:w-60 flex items-center justify-center'>
                    <button
                        type="button"
                        onClick={handleComplete}
                        disabled={!isSaved}
                        className="flex items-center justify-center gap-1.5 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base w-full bg-green-600 text-white rounded sm:font-semibold"
                    >
                        Complete

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>

                    </button>
                </div>
            </div>
        </div>
    );
};

export default Documents;
