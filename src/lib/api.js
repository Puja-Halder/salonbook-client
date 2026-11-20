
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getServices = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.set("search", params.search);
  if (params.category) queryParams.set("category", params.category);
  if (params.page) queryParams.set("page", params.page);
  if (params.limit) queryParams.set("limit", params.limit);

  const query = queryParams.toString();

  const response = await fetch(
    `${API_BASE_URL}/api/services${query ? `?${query}` : ""}`,
    { cache: "no-store" }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load services.");
  }

  return result;
};

export const getAllServicesForAdmin = async (token) => {
  return authenticatedRequest(
    "/api/services/admin/all?limit=50",
    token
  );
};

export const getServiceById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load service.");
  }

  return result;
};

export const getServiceCategories = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/services/categories`,
    { cache: "no-store" }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load service categories.");
  }

  return result;
};

const authenticatedRequest = async (endpoint, token, options = {}) => {
  if (!token) {
    throw new Error("Authentication token is missing. Please sign in again.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
};

export const createService = async (serviceData, token) => {
  return authenticatedRequest("/api/services", token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });
};

export const updateService = async (id, serviceData, token) => {
  return authenticatedRequest(`/api/services/${id}`, token, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });
};

export const deactivateService = async (id, token) => {
  return authenticatedRequest(`/api/services/${id}`, token, {
    method: "DELETE",
  });
};

export const reactivateService = async (id, token) => {
  return authenticatedRequest(`/api/services/${id}/activate`, token, {
    method: "PATCH",
  });
};

export const permanentlyDeleteService = async (id, token) => {
  return authenticatedRequest(`/api/services/${id}/permanent`, token, {
    method: "DELETE",
  });
};

export const uploadServiceImage = async (image) => {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Image upload failed.");
  }

  return result;
};

export const createAppointment = async (appointmentData, token) => {
  return authenticatedRequest("/api/appointments", token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });
};
