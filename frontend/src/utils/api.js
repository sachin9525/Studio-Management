const apiBaseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
async function apiRequest(path, options = {}) {
  const { token, headers, ...requestOptions } = options;
  const isFormData = typeof FormData !== "undefined" && requestOptions.body instanceof FormData;
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...requestOptions,
      headers: {
        ...isFormData ? {} : { "Content-Type": "application/json" },
        ...token ? { Authorization: `Bearer ${token}` } : {},
        ...headers
      }
    });
  } catch {
    throw new Error("Cannot reach the backend. Start the backend server and check VITE_API_URL.");
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || "Request failed. Please try again.");
  }
  return body;
}
export {
  apiRequest
};
