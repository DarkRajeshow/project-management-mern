import axios from 'axios';

const api = axios.create({
  withCredentials: true,
});

const apiRequest = async (method, url, data, options) => {
  try {
    const response = await api({
      method,
      url,
      data,
      options
    });
    return response;
  } catch (error) {
    throw new Error(error.response.data.message || 'Something went wrong');
  }
};

export const loginAPI = async (userCredentials) => {
  return apiRequest('post', "/api/user/login", userCredentials, { withCredentials: true });
};


export const registerAPI = async (userCredentials) => {
  return apiRequest('post', "/api/user/register", userCredentials, { withCredentials: true });
};

export const getUserAPI = async () => {
  return apiRequest('get', "/api/user");
};

export const logoutAPI = async () => {
  return apiRequest('post', "/api/user/logout");
};

export const initializeProjectAPI = async () => {
  return apiRequest('post', "/api/projects/new");
};

export const basicInfoAPI = async (id, basicInfo) => {
  return apiRequest('patch', `/api/projects/${id}/basic-info`, basicInfo);
};

export const propertyInfoAPI = async (id, propertyInfo) => {
  return apiRequest('patch', `/api/projects/${id}/property-info`, propertyInfo);
};

export const amenitiesAPI = async (id, amenities) => {
  return apiRequest('patch', `/api/projects/${id}/amenities`, amenities);
};

export const galleryAPI = async (id, gallaryfiles) => {
  return apiRequest('patch', `/api/projects/${id}/gallery`, gallaryfiles);
};

export const documentsAPI = async (id, documents) => {
  return apiRequest('patch', `/api/projects/${id}/documents`, documents);
};


export const deleteDocumentAPI = async (projectId, documentId) => {
  return apiRequest('delete', `/api/projects/${projectId}/documents/${documentId}`);
}

export const deleteFileByNameAPI = async (projectId, type, filename) => {
  return apiRequest('delete', `/api/projects/${projectId}/gallery/${type}/${filename}`);
}

export const fetchProjectByIdAPI = async (projectId) => {
  return apiRequest('get', `/api/projects/${projectId}`);
}

export const fetchProjectsAPI = async () => {
  return apiRequest('get', `/api/user/projects`);
}

export const fetchBasicInfoAPI = async (id) => {
  return apiRequest('get', `/api/projects/${id}/basic-info`);
}

export const fetchPropertyInfoAPI = async (id) => {
  return apiRequest('get', `/api/projects/${id}/property-info`);
}

export const fetchAmenitiesAPI = async (id) => {
  return apiRequest('get', `/api/projects/${id}/amenities`);
}

export const fetchGalleryAPI = async (id) => {
  return apiRequest('get', `/api/projects/${id}/gallery`);
}

export const fetchDocumentsAPI = async (id) => {
  return apiRequest('get', `/api/projects/${id}/documents`);
}

export const deleteProjectsAPI = async (projectId) => {
  return apiRequest('delete', `/api/projects/${projectId}`);
}

export const getUserIdAPI = async () => {
  return apiRequest('get', `/api/user/id`);
}

export default api;

// { headers: { Authorization: `Bearer ${token}}}