import {
  LayoutDashboard,
  Film,
  Users,
  Mail,
  Settings,
  Camera,
  Package,
  Heart,
  Folder,
  Star,
  Briefcase,
  LayoutGrid
} from "lucide-react";
const vendorNavItems = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, path: "/vendor/dashboard" },
  { label: "Studio Profile", icon: <Camera className="w-4 h-4" />, path: "/vendor/dashboard/profile" },
  { label: "Services", icon: <Briefcase className="w-4 h-4" />, path: "/vendor/dashboard/services" },
  { label: "Wedding Projects", icon: <Heart className="w-4 h-4" />, path: "/vendor/dashboard/projects" },
  { label: "Albums", icon: <Folder className="w-4 h-4" />, path: "/vendor/dashboard/albums" },
  { label: "Videos", icon: <Film className="w-4 h-4" />, path: "/vendor/dashboard/videos" },
  { label: "Packages", icon: <Package className="w-4 h-4" />, path: "/vendor/dashboard/packages" },
  { label: "Inquiries", icon: <Mail className="w-4 h-4" />, path: "/vendor/dashboard/inquiries" },
  { label: "Testimonials", icon: <Star className="w-4 h-4" />, path: "/vendor/dashboard/testimonials" },
  { label: "Settings", icon: <Settings className="w-4 h-4" />, path: "/vendor/dashboard/settings" }
];
const adminNavItems = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, path: "/admin/dashboard" },
  { label: "Vendors", icon: <Users className="w-4 h-4" />, path: "/admin/dashboard/vendors" },
  { label: "Services", icon: <Briefcase className="w-4 h-4" />, path: "/admin/dashboard/services" },
  { label: "Portfolio", icon: <LayoutGrid className="w-4 h-4" />, path: "/admin/dashboard/portfolio" },
  { label: "Albums", icon: <Folder className="w-4 h-4" />, path: "/admin/dashboard/albums" },
  { label: "Videos", icon: <Film className="w-4 h-4" />, path: "/admin/dashboard/videos" },
  { label: "Packages", icon: <Package className="w-4 h-4" />, path: "/admin/dashboard/packages" },
  { label: "Inquiries", icon: <Mail className="w-4 h-4" />, path: "/admin/dashboard/inquiries" },
  { label: "Testimonials", icon: <Star className="w-4 h-4" />, path: "/admin/dashboard/testimonials" },
  { label: "Settings", icon: <Settings className="w-4 h-4" />, path: "/admin/dashboard/settings" }
];
export {
  adminNavItems,
  vendorNavItems
};
