 


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';
// import { useSelector } from 'react-redux';
// import { Table } from 'react-bootstrap';


// const allFiles = [
//   "Statistics", "Login Report","Login Verify Directly" , "Direct Logout Users" , "Admin Report" , "Office" , "AddPlan", "BuyerPlan",
//   "State", "District", "City", "Area", "Roll ", "AdminSetForm", "Notification Send", "Admin GetForm",
//   "Get User Profile", "Add Property", "Manage Property", "Text Editer ", "Search Property ",
//   "Approved Property", "PreApproved Property ", "Delete Properties", "Pending Property",
//   "Removed Property", "Expire Property", "PPC Property ", "Feature Property", "Paid Property ",
//   "Free Property",  "Agent Property", " Subscriber", "Free Bills",
//   "Paid Bills", "Pay U Money", "PayLater ", "Assistant Subscribe", "BaFree Bills",
//   "BaPaid Bill", "Assistant Pay U", "Assistant PayLater", "Call Back Form",
//   "Get Buyer Assistant ", "Pending Assistant", "Expired Assistant", "BuyerList Interest",
//   "BuyerList Interest Tried", "Search Data", "Interest Table", "Contact Table",
//   "Help Request Table", "Report Property Table", "SoldOut Table", "ShortList Favorite Table",
//   "Viewed Property Table", "MatchedList Table", "Matched Property Table", "LastViewed Property ",
//   "Offers Raised Table", "PhotoRequest Table", "Download Leads", "Property Statics", "BuyerStatics",
//   "Usage Statics", "Users Log", "Daily Usage", "MyAccount", "Property FllowUp",
//   "Buyer FllowUp", "Transfer FllowUps", "Transfer Assistant", "BaLoan Lead",
//   "Help LoanLead", "Insurance Lead", "New Property Lead", "FreeUser Lead",
//   "Mobile View Lead", "Limits", "PUC Number", "PUC Banner", "TUC Banner","User Roles","Py Property","Payment Type",
//   "ShortList FavoriteRemoved Table","Developer Property","Promotor Property","Owner Property","PostBy Property",
//   "Buyer Active Assistant","Customer Care","Get Buyer Assistances","Apply OnDemad Property","Rent Property Daily Report",
//   "Rent Property Payment DailyReport","Rent Detail DailyReport"
// ];

// const roles = ["admin", "manager", "accountant"];

// const RolesPermissionTable = () => {
//   const [rolePermissions, setRolePermissions] = useState([]);
 

//   useEffect(() => {
//     const savedPermissions = localStorage.getItem("rolePermissions");
//     if (savedPermissions) {
//       setRolePermissions(JSON.parse(savedPermissions));
//     } else {
//       fetchPermissionsFromServer();
//     }
//   }, []);

//   const fetchPermissionsFromServer = () => {
//     axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`)
//       .then(res => {
//         setRolePermissions(res.data);
//         localStorage.setItem("rolePermissions", JSON.stringify(res.data));
//       })
// .catch(() => {})  };

//   const handleCheckboxChange = (role, file) => {
//     const trimmedFile = file.trim();
//     const updated = [...rolePermissions];
//     const roleIndex = updated.findIndex(r => r.role === role);

//     if (roleIndex === -1) {
//       updated.push({ role, viewedFiles: [trimmedFile] });
//     } else {
//       const currentFiles = updated[roleIndex].viewedFiles ?? [];
//       const hasFile = currentFiles.includes(trimmedFile);

//       if (hasFile) {
//         updated[roleIndex].viewedFiles = currentFiles.filter(f => f !== trimmedFile);
//       } else {
//         updated[roleIndex].viewedFiles = [...currentFiles, trimmedFile];
//       }
//     }

//     setRolePermissions(updated);
//     localStorage.setItem("rolePermissions", JSON.stringify(updated));

//     axios.post(`${process.env.REACT_APP_API_URL}/update-role-permissions`, {
//       role,
//       viewedFiles: updated.find(r => r.role === role)?.viewedFiles || []
//     }).catch(() => {});
//   };

//   const isChecked = (role, file) => {
//     const found = rolePermissions.find(r => r.role === role);
//     return found?.viewedFiles?.includes(file.trim());
//   };

//   const handleSelectAll = (checked) => {
//     const trimmedFiles = allFiles.map(f => f.trim());
//     const updated = [...rolePermissions];
//     const roleIndex = updated.findIndex(r => r.role === "admin");

//     if (roleIndex === -1) {
//       updated.push({ role: "admin", viewedFiles: checked ? trimmedFiles : [] });
//     } else {
//       updated[roleIndex].viewedFiles = checked ? trimmedFiles : [];
//     }

//     setRolePermissions(updated);
//     localStorage.setItem("rolePermissions", JSON.stringify(updated));

//     axios.post(`${process.env.REACT_APP_API_URL}/update-role-permissions`, {
//       role: "admin",
//       viewedFiles: checked ? trimmedFiles : []
//     }).catch(() => {});
//   };

//   const isAllSelected = () => {
//     const adminPermissions = rolePermissions.find(r => r.role === "admin");
//     return adminPermissions?.viewedFiles?.length === allFiles.length;
//   };


//   return (
//     <div className="p-4 overflow-x-auto">
//       <h2 className="text-lg font-bold mb-4">Roles & Permissions (Files Access)</h2>
//       <Table striped bordered hover responsive className="table-sm align-middle">
//       <thead className="sticky-top">
//           <tr>
//             <th className="border px-4 py-2 text-left">Files/Pages</th>
//             {roles.map(role => (
//               <th key={role} className="border px-4 py-2 text-center capitalize">
//                 {role === "admin" ? (
//                   <div>
//                     <div>{role}</div>
//                     <input
//                       type="checkbox"
//                       checked={isAllSelected()}
//                       onChange={(e) => handleSelectAll(e.target.checked)}
//                     />
//                     <div className="text-xs text-gray-500">Select All</div>
//                   </div>
//                 ) : role}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {allFiles.map((file, idx) => (
//             <tr key={idx} className="even:bg-gray-50">
//               <td className="border px-4 py-2">{file}</td>
//               {roles.map(role => (
//                 <td key={role} className="border px-4 py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={isChecked(role, file)}
//                     onChange={() => handleCheckboxChange(role, file)}
//                   />
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <button
//         onClick={() => {
//           fetchPermissionsFromServer();
//           localStorage.removeItem("rolePermissions");
//         }}
//         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
//       >
//         Refresh from Server
//       </button>
//     </div>
//   );
// };

// export default RolesPermissionTable;







import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';

const allFiles = [
  "Statistics", "Login Report", "Login Verify Directly", "Direct Logout Users", "Admin Report", "Office", "AddPlan", "BuyerPlan",
  "State", "District", "City", "Area", "AdminSetForm", "Notification Send", "Admin GetForm",
  "Get User Profile", "Add Property", "Manage Property", "Text Editer ", "Search Property ",
  "Approved Property", "PreApproved Property ", "Delete Properties", "Pending Property",
  "Removed Property", "Expire Property", "PPC Property ", "Feature Property", "Paid Property ",
  "Free Property", "Agent Property", " Subscriber", "Free Bills",
  "Paid Bills", "Pay U Money", "PayLater ", "Assistant Subscribe", "BaFree Bills",
  "BaPaid Bill", "Assistant Pay U", "Assistant PayLater", "Call Back Form",
  "Get Buyer Assistant ", "Pending Assistant", "Expired Assistant", "BuyerList Interest",
  "BuyerList Interest Tried", "Search Data", "Interest Table", "Contact Table",
  "Help Request Table", "Report Property Table", "SoldOut Table", "ShortList Favorite Table",
  "Viewed Property Table", "MatchedList Table", "Matched Property Table", "LastViewed Property ",
  "Offers Raised Table", "PhotoRequest Table", "Download Leads", "Property Statics", "BuyerStatics",
  "Usage Statics", "Users Log", "Daily Usage", "MyAccount", "Property FllowUp",
  "Buyer FllowUp", "Transfer FllowUps", "Transfer Assistant", "BaLoan Lead",
  "Help LoanLead", "Insurance Lead", "New Property Lead", "FreeUser Lead",
  "Mobile View Lead", "Limits", "PUC Number", "PUC Banner", "TUC Banner", "User Roles", "Py Property", "Payment Type",
  "ShortList FavoriteRemoved Table", "Developer Property", "Promotor Property", "Owner Property", "PostBy Property",
  "Buyer Active Assistant", "Customer Care", "Get Buyer Assistances", "Apply OnDemad Property", "Rent Property Daily Report",
  "Rent Property Payment DailyReport", "Rent Detail DailyReport"
];

const RolesPermissionTable = () => {
  const [rolePermissions, setRolePermissions] = useState([]);
  const [roles, setRoles] = useState([]); // State to store roles from API
  const [loading, setLoading] = useState(false);

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/roll-all-rent`);
        // Extract rollType from each role object and convert to lowercase for consistency
        const roleTypes = response.data.map(role => role.rollType.toLowerCase());
        setRoles(roleTypes);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const savedPermissions = localStorage.getItem("rolePermissions");
    if (savedPermissions) {
      setRolePermissions(JSON.parse(savedPermissions));
    } else {
      fetchPermissionsFromServer();
    }
  }, []);

  const fetchPermissionsFromServer = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`)
      .then(res => {
        setRolePermissions(res.data);
        localStorage.setItem("rolePermissions", JSON.stringify(res.data));
      })
      .catch(() => {});
  };

  const handleCheckboxChange = (role, file) => {
    const trimmedFile = file.trim();
    const updated = [...rolePermissions];
    const roleIndex = updated.findIndex(r => r.role === role);

    if (roleIndex === -1) {
      updated.push({ role, viewedFiles: [trimmedFile] });
    } else {
      const currentFiles = updated[roleIndex].viewedFiles ?? [];
      const hasFile = currentFiles.includes(trimmedFile);

      if (hasFile) {
        updated[roleIndex].viewedFiles = currentFiles.filter(f => f !== trimmedFile);
      } else {
        updated[roleIndex].viewedFiles = [...currentFiles, trimmedFile];
      }
    }

    setRolePermissions(updated);
    localStorage.setItem("rolePermissions", JSON.stringify(updated));

    axios.post(`${process.env.REACT_APP_API_URL}/update-role-permissions`, {
      role,
      viewedFiles: updated.find(r => r.role === role)?.viewedFiles || []
    }).catch(() => {});
  };

  const isChecked = (role, file) => {
    const found = rolePermissions.find(r => r.role === role);
    return found?.viewedFiles?.includes(file.trim());
  };

  const handleSelectAll = (checked) => {
    const trimmedFiles = allFiles.map(f => f.trim());
    const updated = [...rolePermissions];
    const roleIndex = updated.findIndex(r => r.role === "admin");

    if (roleIndex === -1) {
      updated.push({ role: "admin", viewedFiles: checked ? trimmedFiles : [] });
    } else {
      updated[roleIndex].viewedFiles = checked ? trimmedFiles : [];
    }

    setRolePermissions(updated);
    localStorage.setItem("rolePermissions", JSON.stringify(updated));

    axios.post(`${process.env.REACT_APP_API_URL}/update-role-permissions`, {
      role: "admin",
      viewedFiles: checked ? trimmedFiles : []
    }).catch(() => {});
  };

  const isAllSelected = () => {
    const adminPermissions = rolePermissions.find(r => r.role === "admin");
    return adminPermissions?.viewedFiles?.length === allFiles.length;
  };

  // Show loading state while fetching roles
  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Roles & Permissions (Files Access)</h2>
        <div className="text-center">Loading roles...</div>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-lg font-bold mb-4">Roles & Permissions (Files Access)</h2>
      <Table striped bordered hover responsive className="table-sm align-middle">
        <thead className="sticky-top">
          <tr>
            <th className="border px-4 py-2 text-left">Files/Pages</th>
            {roles.map(role => (
              <th key={role} className="border px-4 py-2 text-center capitalize">
                {role === "admin" ? (
                  <div>
                    <div>{role}</div>
                    <input
                      type="checkbox"
                      checked={isAllSelected()}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <div className="text-xs text-gray-500">Select All</div>
                  </div>
                ) : (
                  role
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFiles.map((file, idx) => (
            <tr key={idx} className="even:bg-gray-50">
              <td className="border px-4 py-2">{file}</td>
              {roles.map(role => (
                <td key={role} className="border px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={isChecked(role, file)}
                    onChange={() => handleCheckboxChange(role, file)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <button
        onClick={() => {
          fetchPermissionsFromServer();
          localStorage.removeItem("rolePermissions");
        }}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Refresh from Server
      </button>
    </div>
  );
};

export default RolesPermissionTable;