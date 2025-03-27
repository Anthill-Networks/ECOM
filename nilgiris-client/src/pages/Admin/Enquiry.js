import Blogs from "../../components/admin/blog"
import Responses from "../../components/admin/Responses"
import Sidebar from "../../components/admin/sidebar"

export default function  EnquiryAdminScreen() {
    return (
        <>
       <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <Responses />
      </div>
        </>
)}