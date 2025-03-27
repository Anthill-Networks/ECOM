import Blogs from "../../components/admin/blog"
import Sidebar from "../../components/admin/sidebar"

export default function  BlogsAdminScreen() {
  
    return (
        <>
       <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <Blogs />
      </div>
        </>
)}