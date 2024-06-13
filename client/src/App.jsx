import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import { Toaster } from 'sonner';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import BasicInfoForm from './components/pages/project/new/BasicInfo';
import Amenities from './components/pages/project/new/Amenities';
import PropertyInfo from './components/pages/project/new/PropertyInfo';
import Gallary from './components/pages/project/new/Gallary';
import Documents from './components/pages/project/new/Documents';
import Protected from './components/special/Protected';
import Project from './components/pages/project/Project';

function App() {
  return (
    <main className='bg-zinc-800 h-screen text-zinc-200'>
      <Router>
        <Toaster richColors position="top-center" theme='dark' />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<Protected Component={Project} />} />
          <Route path="/projects/:id/basic-info" element={<Protected Component={BasicInfoForm} />} />
          <Route path="/projects/:id/property-info" element={<Protected Component={PropertyInfo} />} />
          <Route path="/projects/:id/amenities" element={<Protected Component={Amenities} />} />
          <Route path="/projects/:id/gallery" element={<Protected Component={Gallary} />} />
          <Route path="/projects/:id/documents" element={<Protected Component={Documents} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;