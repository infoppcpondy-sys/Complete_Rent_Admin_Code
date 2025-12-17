 


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';

const AdminReport = () => {
  const [reportData, setReportData] = useState({
    webLogin: 0,
    appLogin: 0,
    totalLogin: 0,
    totalReported: 0,
    totalHelp: 0,
    totalContact: 0,
    propertyCounts: {
      total: 0,
      complete: 0,
      incomplete: 0,
      active: 0,
    }
  });

  const fetchData = async () => {
    try {
      const loginRes = await axios.get(`${process.env.REACT_APP_API_URL}/user/login-mode-counts-rent`);
      const { webLoginCount, appLoginCount } = loginRes.data;

      const reportWeb = await axios.get(`${process.env.REACT_APP_API_URL}/property-reports-count-rent?loginMode=web`);
      const reportApp = await axios.get(`${process.env.REACT_APP_API_URL}/property-reports-count-rent?loginMode=app`);

      const helpRes = await axios.get(`${process.env.REACT_APP_API_URL}/total-help-request-count-rent`);
      const contactRes = await axios.get(`${process.env.REACT_APP_API_URL}/total-contact-count-rent`);

      const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/properties/status-counts-rent`);
      const { totalCount, counts } = statusRes.data;

      setReportData({
        webLogin: webLoginCount,
        appLogin: appLoginCount,
        totalLogin: webLoginCount + appLoginCount,
        totalReported: (reportWeb.data.totalReportedProperties || 0) + (reportApp.data.totalReportedProperties || 0),
        totalHelp: helpRes.data.totalHelpRequests || 0,
        totalContact: contactRes.data.totalContactCount || 0,
        propertyCounts: {
          total: totalCount || 0,
          complete: counts.complete || 0,
          incomplete: counts.incomplete || 0,
          active: counts.active || 0,
        }
      });
    } catch (error) {
      console.error("Error fetching admin report data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  const [allowedRoles, setAllowedRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileName = "Admin Report";

  useEffect(() => {
    if (reduxAdminName) localStorage.setItem("adminName", reduxAdminName);
    if (reduxAdminRole) localStorage.setItem("adminRole", reduxAdminRole);
  }, [reduxAdminName, reduxAdminRole]);

  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
          userName: adminName,
          role: adminRole,
          viewedFile: fileName,
          viewTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
      } catch (err) {
        console.error("Error recording view:", err);
      }
    };
    if (adminName && adminRole) recordDashboardView();
  }, [adminName, adminRole]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`);
        const rolePermissions = res.data.find((perm) => perm.role === adminRole);
        const viewed = rolePermissions?.viewedFiles?.map(f => f.trim()) || [];
        setAllowedRoles(viewed);
      } catch (err) {
        console.error("Error fetching role permissions:", err);
      } finally {
        setLoading(false);
      }
    };
    if (adminRole) fetchPermissions();
  }, [adminRole]);

  if (loading) return <p>Loading...</p>;

  if (!allowedRoles.includes(fileName)) {
    return (
      <div className="text-center text-danger fw-bold mt-4">
        Only admin is allowed to view this file.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Rent Properties | Admin</h2>
      <p>Welcome to your Dashboard, <strong>{adminName || "Admin"}</strong>!</p>

      {/* Login, Report, Help, Contact Table */}
      <Table striped bordered hover responsive className="table-sm align-middle">
        <thead className="sticky-top">
          <tr>
            <th>SL NO</th>
            <th>DESCRIPTION</th>
            <th>APP</th>
            <th>WEB</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>NO. OF LOGIN</td>
            <td>{reportData.appLogin}</td>
            <td>{reportData.webLogin}</td>
            <td>{reportData.totalLogin}</td>
          </tr>
          <tr>
            <td>2</td>
            <td>NO. OF REPORTED</td>
            <td>N/A</td>
            <td>{reportData.totalReported}</td>
            <td>{reportData.totalReported}</td>
          </tr>
          <tr>
            <td>3</td>
            <td>NO. OF HELP REQUIRED</td>
            <td>N/A</td>
            <td>{reportData.totalHelp}</td>
            <td>{reportData.totalHelp}</td>
          </tr>
          <tr>
            <td>4</td>
            <td>NO. OF CONTACT FORM</td>
            <td>N/A</td>
            <td>{reportData.totalContact}</td>
            <td>{reportData.totalContact}</td>
          </tr>
        </tbody>
      </Table>

      {/* New Property Status Table */}
      <h4 className="mt-5">Property Status Count Summary</h4>
      <Table striped bordered hover responsive className="table-sm align-middle">
        <thead>
          <tr>
            <th>SL NO</th>
            <th>STATUS</th>
            <th>COUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>COMPLETE</td>
            <td>{reportData.propertyCounts.complete}</td>
          </tr>
          <tr>
            <td>2</td>
            <td>INCOMPLETE</td>
            <td>{reportData.propertyCounts.incomplete}</td>
          </tr>
          <tr>
            <td>3</td>
            <td>ACTIVE</td>
            <td>{reportData.propertyCounts.active}</td>
          </tr>
          <tr>
            <td>4</td>
            <td>TOTAL PROPERTIES</td>
            <td>{reportData.propertyCounts.total}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default AdminReport;
