import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import PageLoader from "@/components/common/PageLoader";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { vendorNavItems } from "@/data/navConfig";

// Keep Public Landing Page eagerly loaded for instant initial render
import AdminLanding from "@/admin/pages/AdminLanding";

// Lazy-load Public Auth & Legal pages
const AdminLogin = lazy(() => import("@/admin/pages/AdminLogin"));
const VendorLogin = lazy(() => import("@/vendor/pages/VendorLogin"));
const VendorRegister = lazy(() => import("@/vendor/pages/VendorRegister"));
const PrivacyPolicy = lazy(() => import("@/common/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/common/pages/TermsOfService"));
const NotFound = lazy(() => import("@/common/pages/NotFound"));
const ComingSoon = lazy(() => import("@/common/pages/ComingSoon"));

// Lazy-load Vendor Dashboard Pages
const VendorDashboard = lazy(() => import("@/vendor/pages/VendorDashboard"));
const VendorProfile = lazy(() => import("@/vendor/pages/VendorProfile"));
const VendorServices = lazy(() => import("@/vendor/pages/VendorServices"));
const VendorProjects = lazy(() => import("@/vendor/pages/VendorProjects"));
const VendorAlbums = lazy(() => import("@/vendor/pages/VendorAlbums"));
const VendorVideos = lazy(() => import("@/vendor/pages/VendorVideos"));
const VendorPackages = lazy(() => import("@/vendor/pages/VendorPackages"));
const VendorInquiries = lazy(() => import("@/vendor/pages/VendorInquiries"));
const VendorTestimonials = lazy(() => import("@/vendor/pages/VendorTestimonials"));

// Lazy-load Admin Dashboard Pages
const AdminDashboard = lazy(() => import("@/admin/pages/AdminDashboard"));
const AdminVendors = lazy(() => import("@/admin/pages/AdminVendors"));
const AdminServices = lazy(() => import("@/admin/pages/AdminServices"));
const AdminPortfolio = lazy(() => import("@/admin/pages/AdminPortfolio"));
const AdminAlbums = lazy(() => import("@/admin/pages/AdminAlbums"));
const AdminVideos = lazy(() => import("@/admin/pages/AdminVideos"));
const AdminPackages = lazy(() => import("@/admin/pages/AdminPackages"));
const AdminInquiries = lazy(() => import("@/admin/pages/AdminInquiries"));
const AdminTestimonials = lazy(() => import("@/admin/pages/AdminTestimonials"));
const AdminSettings = lazy(() => import("@/admin/pages/AdminSettings"));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<AdminLanding />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/vendor/login" element={<VendorLogin />} />
              <Route path="/vendor/register" element={<VendorRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Vendor dashboard */}
              <Route
                path="/vendor/dashboard"
                element={<ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>}
              />
              <Route
                path="/vendor/dashboard/profile"
                element={<ProtectedRoute role="vendor"><VendorProfile /></ProtectedRoute>}
              />
              <Route
                path="/vendor/dashboard/services"
                element={<ProtectedRoute role="vendor"><VendorServices /></ProtectedRoute>}
              />
              <Route
                path="/vendor/dashboard/projects"
                element={<ProtectedRoute role="vendor"><VendorProjects /></ProtectedRoute>}
              />
              <Route
                path="/vendor/dashboard/albums"
                element={<ProtectedRoute role="vendor"><VendorAlbums /></ProtectedRoute>}
              />
              <Route
                path="/vendor/dashboard/videos"
                element={<ProtectedRoute role="vendor"><VendorVideos /></ProtectedRoute>}
              />
              <Route
                path="/vendor/dashboard/packages"
                element={<ProtectedRoute role="vendor"><VendorPackages /></ProtectedRoute>}
              />
              <Route
                path="/vendor/dashboard/inquiries"
                element={<ProtectedRoute role="vendor"><VendorInquiries /></ProtectedRoute>}
              />
              <Route
                path="/vendor/dashboard/testimonials"
                element={<ProtectedRoute role="vendor"><VendorTestimonials /></ProtectedRoute>}
              />
              <Route
                path="/vendor/dashboard/settings"
                element={<ProtectedRoute role="vendor"><ComingSoon title="Settings" role="vendor" navItems={vendorNavItems} /></ProtectedRoute>}
              />

              {/* Admin dashboard */}
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/dashboard/vendors"
                element={<ProtectedRoute role="admin"><AdminVendors /></ProtectedRoute>}
              />
              <Route
                path="/admin/dashboard/services"
                element={<ProtectedRoute role="admin"><AdminServices /></ProtectedRoute>}
              />
              <Route
                path="/admin/dashboard/portfolio"
                element={<ProtectedRoute role="admin"><AdminPortfolio /></ProtectedRoute>}
              />
              <Route
                path="/admin/dashboard/albums"
                element={<ProtectedRoute role="admin"><AdminAlbums /></ProtectedRoute>}
              />
              <Route
                path="/admin/dashboard/videos"
                element={<ProtectedRoute role="admin"><AdminVideos /></ProtectedRoute>}
              />
              <Route
                path="/admin/dashboard/packages"
                element={<ProtectedRoute role="admin"><AdminPackages /></ProtectedRoute>}
              />
              <Route
                path="/admin/dashboard/inquiries"
                element={<ProtectedRoute role="admin"><AdminInquiries /></ProtectedRoute>}
              />
              <Route
                path="/admin/dashboard/testimonials"
                element={<ProtectedRoute role="admin"><AdminTestimonials /></ProtectedRoute>}
              />
              <Route
                path="/admin/dashboard/settings"
                element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>}
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <WhatsAppButton />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
