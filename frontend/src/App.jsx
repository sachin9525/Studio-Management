import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import {
  AdminLanding,
  AdminLogin,
  AdminDashboard,
  AdminInquiries,
  AdminVendors,
  AdminSettings,
} from "@/admin/pages";
import {
  VendorLogin,
  VendorRegister,
  VendorDashboard,
  VendorProfile,
  VendorServices,
  VendorProjects,
  VendorAlbums,
  VendorVideos,
  VendorPackages,
  VendorInquiries,
  VendorTestimonials,
} from "@/vendor/pages";
import ComingSoon from "@/common/pages/ComingSoon";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { vendorNavItems, adminNavItems } from "@/data/navConfig";
function App() {
  return <AuthProvider><BrowserRouter><Routes>
    {
      /* Public routes */
    }
    <Route path="/" element={<AdminLanding />} />
    <Route path="/vendor/login" element={<VendorLogin />} />
    <Route path="/vendor/register" element={<VendorRegister />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    {
      /* Vendor dashboard */
    }
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
    {
      /* Admin dashboard */
    }
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
      element={<ProtectedRoute role="admin"><ComingSoon title="Demo Services" role="admin" navItems={adminNavItems} /></ProtectedRoute>}
    />
    <Route
      path="/admin/dashboard/portfolio"
      element={<ProtectedRoute role="admin"><ComingSoon title="Demo Portfolio" role="admin" navItems={adminNavItems} /></ProtectedRoute>}
    />
    <Route
      path="/admin/dashboard/albums"
      element={<ProtectedRoute role="admin"><ComingSoon title="Demo Albums" role="admin" navItems={adminNavItems} /></ProtectedRoute>}
    />
    <Route
      path="/admin/dashboard/videos"
      element={<ProtectedRoute role="admin"><ComingSoon title="Demo Videos" role="admin" navItems={adminNavItems} /></ProtectedRoute>}
    />
    <Route
      path="/admin/dashboard/packages"
      element={<ProtectedRoute role="admin"><ComingSoon title="Demo Packages" role="admin" navItems={adminNavItems} /></ProtectedRoute>}
    />
    <Route
      path="/admin/dashboard/inquiries"
      element={<ProtectedRoute role="admin"><AdminInquiries /></ProtectedRoute>}
    />
    <Route
      path="/admin/dashboard/testimonials"
      element={<ProtectedRoute role="admin"><ComingSoon title="Testimonials" role="admin" navItems={adminNavItems} /></ProtectedRoute>}
    />
    <Route
      path="/admin/dashboard/settings"
      element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>}
    />
    {
      /* Fallback */
    }
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter></AuthProvider>;
}
var App_default = App;
export {
  App_default as default
};
