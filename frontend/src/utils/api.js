class ApiError extends Error {
  constructor(message, status = 500, data = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.isNetworkError = status === 0;
    this.isAuthError = status === 401 || status === 403;
  }
}

let rawBaseUrl = (import.meta.env.VITE_API_URL || "/api").trim().replace(/\/+$/, "");

// Auto-correct legacy gym-admin-backend URL to the official live svml-backend URL
if (rawBaseUrl.includes("gym-admin-backend")) {
  rawBaseUrl = "https://svml-backend.onrender.com";
}

// In production on Vercel, default to the official live backend if not explicitly set
if (
  typeof window !== "undefined" &&
  window.location.hostname.includes("vercel.app") &&
  (!import.meta.env.VITE_API_URL || rawBaseUrl === "/api")
) {
  rawBaseUrl = "https://svml-backend.onrender.com";
}

// Ensure apiBaseUrl always points to the /api endpoint regardless of how VITE_API_URL is configured
const apiBaseUrl = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

/**
 * Resolves static media URLs (e.g. /uploads/...) to full backend URLs in production
 * or relative paths in local Vite proxy mode.
 */
function getMediaUrl(path) {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  const host = apiBaseUrl.replace(/\/api$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${host}${cleanPath}`;
}

async function apiRequest(path, options = {}) {
  const { token, headers, ...requestOptions } = options;
  const isFormData = typeof FormData !== "undefined" && requestOptions.body instanceof FormData;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  let response;

  try {
    response = await fetch(`${apiBaseUrl}${normalizedPath}`, {
      ...requestOptions,
      headers: {
        ...isFormData ? {} : { "Content-Type": "application/json" },
        ...token ? { Authorization: `Bearer ${token}` } : {},
        ...headers
      }
    });
  } catch (err) {
    // User-friendly network failure message
    throw new ApiError(
      "Unable to connect to the server. Please check your internet connection or try again shortly.",
      0,
      { originalError: err?.message }
    );
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Specialized user-friendly error messages based on HTTP status
    let userFriendlyMessage = body.message;

    if (!userFriendlyMessage) {
      if (response.status === 401) {
        userFriendlyMessage = "Your session has expired. Please sign in again.";
      } else if (response.status === 403) {
        userFriendlyMessage = "You do not have permission to perform this action.";
      } else if (response.status === 404) {
        userFriendlyMessage = "The requested information or resource could not be found.";
      } else if (response.status === 413) {
        userFriendlyMessage = "The uploaded file is too large for the server. Please select a smaller file.";
      } else if (response.status === 429) {
        userFriendlyMessage = "Too many requests. Please wait a moment and try again.";
      } else if (response.status >= 500) {
        userFriendlyMessage = "The server encountered an issue. Please try again in a few moments.";
      } else {
        userFriendlyMessage = "Something went wrong. Please try again.";
      }
    }

    // If 401 and an auth token was provided, notify session listeners
    if (response.status === 401 && token) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:session-expired", {
            detail: { message: userFriendlyMessage }
          })
        );
      }
    }

    throw new ApiError(userFriendlyMessage, response.status, body);
  }

  return body;
}

export {
  apiRequest,
  ApiError,
  getMediaUrl
};
