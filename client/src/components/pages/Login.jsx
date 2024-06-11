// src/components/Login.js
import { useContext, useState } from 'react';
import { toast } from 'sonner';
import { UserContext } from '../../context/UserContext';
import { loginAPI } from '../../utility/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        mobileNumber: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.mobileNumber) newErrors.mobileNumber = 'Login ID is required';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const { data } = await loginAPI(formData);
                if (data.success) {
                    toast.success(data.status);
                    setUser(data.user);
                    navigate('/')
                }
                else {
                    toast.error(data.status);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-800">
            <div className="bg-zinc-700/20 px-8 py-10 rounded shadow-md w-full max-w-sm sm:max-w-md">
                <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
                <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                    <div className="mb-4">
                        <label className="block text-zinc-300 py-2">Login ID (Mobile number)</label>
                        <input
                            type="number"
                            name="mobileNumber"
                            placeholder='e.g. mobile number'
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            className="w-full p-2 outline-none rounded-sm bg-zinc-700/20 focus:bg-zinc-700 mt-1"
                        />
                        {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-zinc-300 py-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder='e.g. pass@123'
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 outline-none rounded-sm bg-zinc-700/20 focus:bg-zinc-700  mt-1"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-900 font-semibold text-white rounded mt-4 hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
