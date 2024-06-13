
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjectByIdAPI } from '../../../utility/api';
import { toast } from 'sonner';
import SmartLoader from '../../reusable/SmartLoader';
import filePath from '../../../utility/filePath';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const { data } = await fetchProjectByIdAPI(id);
                if (data.success) {
                    setProject(data.project);
                    console.log(data);
                }
                else {
                    toast.error(data.status);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
            setLoading(false);
        };
        fetchProject();
    }, [id]);

    const renderTable = (attributes) => {
        return (
            <table className="w-full table-auto mb-4 border-collapse border border-gray-200 rounded-md overflow-hidden">
                <thead>
                    <tr className="bg-zinc-600 info">
                        <th className="border px-4 py-2  text-left">Sr No</th>
                        <th className="border px-4 py-2  text-left">Attribute Name</th>
                        <th className="border px-4 py-2  text-left">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {attributes.map((attribute, index) => (
                        <tr key={index} className={'bg-zinc-600/40 info'}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{attribute.name}</td>
                            <td className="border px-4 py-2">{attribute.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="container mx-auto p-4 capitalize">
            {loading && <SmartLoader />}
            {!loading && <>
                <h1 className="text-xl text-violet-200 sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 mt-4">{project.basicInfo.name}</h1>
                <section className="mb-12">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Basic Information</h2>
                    {renderTable([
                        { name: 'Name', value: project.basicInfo.name },
                        { name: 'State', value: project.basicInfo.state },
                        { name: 'Address', value: project.basicInfo.address },
                        { name: 'Date of Completion', value: new Date(project.basicInfo.dateOfCompletion).toLocaleDateString() },
                        { name: 'Project Type', value: project.basicInfo.projectType },
                        { name: 'City', value: project.basicInfo.city },
                        { name: 'Land Status', value: project.basicInfo.landStatus },
                        { name: 'RERA Number', value: project.basicInfo.reraNumber },
                    ])}
                    <Link to={`/projects/${id}/basic-info`} className="updateButton">Update Basic Info</Link>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Property Information</h2>
                    {renderTable([
                        { name: 'Total Plots', value: project.propertyInfo.totalPlats },
                        { name: 'Total Shops', value: project.propertyInfo.totalShops },
                        { name: 'Total Offices', value: project.propertyInfo.totalOffices },
                        { name: 'Total Floors', value: project.propertyInfo.totalFloors },
                        { name: 'Engineer Name', value: project.propertyInfo.engineerName },
                        { name: 'Architect Name', value: project.propertyInfo.architectName },
                        { name: 'Estimated Cost', value: project.propertyInfo.estimatedCost },
                    ])}
                    <Link to={`/projects/${id}/property-info`} className="updateButton">Update Property Info</Link>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Amenities</h2>
                    <table className="w-full table-auto mb-4 border-collapse border border-gray-200 rounded-md overflow-hidden">
                        <thead>
                            <tr className="bg-zinc-600 info">
                                <th className="border px-4 py-2  text-left">Sr No</th>
                                <th className="border px-4 py-2  text-left">Amenity Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project.amenities.map((attribute, index) => (
                                <tr key={index} className={'bg-zinc-600/40 info'}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{attribute.split("_").join(" ")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Link to={`/projects/${id}/amenities`} className="updateButton">Update Amenities</Link>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Gallery</h2>
                    <h3 className="text-xl font-semibold mb-2">Site Elevations</h3>
                    <ul className="mb-4">
                        {project.gallery.siteElevations.map((file, index) => (
                            <div key={index} className='flex py-2 px-3 bg-zinc-700 rounded-md mb-1.5 items-center justify-between'>
                                <div className='flex items-center justify-center gap-2'>
                                    <span>{index + 1}</span>
                                    <h2>{file}</h2>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    {!file.name && <a href={`${filePath}/${file}`}
                                        download
                                        target='_blank'
                                        className='shadow-none py-1.5 px-2 text-sm bg-green-800 rounded-md'>View</a>}
                                </div>
                            </div>
                        ))}
                    </ul>
                    <h3 className="text-xl font-semibold mb-2">Site Images</h3>
                    <ul className="mb-4">
                        {project.gallery.siteImages.map((file, index) => (
                            <div key={index} className='flex py-2 px-3 bg-zinc-700 rounded-md mb-1.5 items-center justify-between'>
                                <div className='flex items-center justify-center gap-2'>
                                    <span>{index + 1}</span>
                                    <h2>{file}</h2>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    {!file.name && <a href={`${filePath}/${file}`}
                                        download
                                        target='_blank'
                                        className='shadow-none py-1.5 px-2 text-sm bg-green-800 rounded-md'>View</a>}
                                </div>
                            </div>
                        ))}
                    </ul>
                    <h3 className="text-xl fmb-1ont-semibold mb-2">Site Brochures</h3>
                    <ul className="mb-4">
                        {project.gallery.siteBrochore.map((file, index) => (
                            <div key={index} className='flex py-2 px-3 bg-zinc-700 rounded-md mb-1.5 items-center justify-between'>
                                <div className='flex items-center justify-center gap-2'>
                                    <span>{index + 1}</span>
                                    <h2>{file}</h2>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    {!file.name && <a href={`${filePath}/${file}`}
                                        download
                                        target='_blank'
                                        className='shadow-none py-1.5 px-2 text-sm bg-green-800 rounded-md'>View</a>}
                                </div>
                            </div>
                        ))}
                    </ul>
                    <Link to={`/projects/${id}/gallery`} className="updateButton">Update Gallery</Link>
                </section>

                <section className="mb-12">

                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Documents</h2>

                    <table className="w-full table-auto mb-4 border-collapse border border-gray-200 rounded-md overflow-hidden">
                        <thead>
                            <tr className="bg-zinc-600 info">
                                <th className="border px-4 py-2  text-left">Sr No</th>
                                <th className="border px-4 py-2  text-left">Document Title</th>
                                <th className="border px-4 py-2  text-left">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project.documents.map((doc, index) => (
                                <tr key={index} className={'bg-zinc-600/40 info'}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{doc.title}</td>
                                    <td className="border px-4 py-2"><a href={`${filePath}/${doc.filename}`} target="_blank" rel="noopener noreferrer" className="shadow-none py-1.5 px-2 text-sm bg-green-800 rounded-md">View</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Link to={`/projects/${id}/documents`} className="updateButton">Update Documents</Link>
                </section>
            </>}
        </div>
    );
};

export default ProjectDetails;

