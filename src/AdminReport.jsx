import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';

const TABS = [
  { key: 'actions', label: "Yesterday's Actions" },
  { key: 'login', label: "Yesterday's Login" },
  { key: 'property', label: "Yesterday's Property" },
  { key: 'status', label: 'Property Status' },
  { key: 'payments', label: 'Payments' },
  { key: 'followups', label: 'Follow-ups' },
];

const tabStyle = (active) => ({
  padding: '10px 18px',
  cursor: 'pointer',
  border: 'none',
  borderBottom: active ? '2.5px solid #0d6efd' : '2.5px solid transparent',
  background: 'transparent',
  color: active ? '#0d6efd' : '#495057',
  fontWeight: active ? 600 : 400,
  fontSize: '14px',
  whiteSpace: 'nowrap',
  transition: 'color 0.15s',
});

const tabNavStyle = {
  display: 'flex',
  overflowX: 'auto',
  borderBottom: '1px solid #dee2e6',
  marginBottom: '20px',
  gap: '4px',
  scrollbarWidth: 'none',
};

const SectionHeader = ({ title }) => (
  <tr>
    <td colSpan="3" className="fw-bold text-center" style={{ backgroundColor: '#e9ecef' }}>{title}</td>
  </tr>
);

const AdminReport = () => {
  const [activeTab, setActiveTab] = useState('actions');

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

  const [yesterdayActions, setYesterdayActions] = useState({
    contactViewed: 0,
    favoriteList: 0,
    photoRequest: 0,
    addressRequests: 0,
    offerRaised: 0,
    viewedProperties: 0,
    sendInterest: 0,
    calledList: 0,
  });

  const [yesterdayLogin, setYesterdayLogin] = useState({
    totalLogin: 0,
    reported: 0,
    unreported: 0,
    owner: 0,
    tenant: 0,
    visitor: 0,
    conversionPaid: 0,
    conversionFree: 0,
    conversionPending: 0,
  });

  const [yesterdayProperty, setYesterdayProperty] = useState({
    totalCreated: 0,
    freeProperty: 0,
    paidProperty: 0,
    tenantTotal: 0,
    tenantFree: 0,
    tenantPaid: 0,
  });

  const [propertyStatusCounts, setPropertyStatusCounts] = useState({
    preApproved: 0,
    pending: 0,
    deleted: 0,
    expired: 0,
    tenantPending: 0,
    tenantDeleted: 0,
  });

  const [loginReportCounts, setLoginReportCounts] = useState({
    totalUnreported: 0,
    totalConversionPending: 0,
  });

  const [followupCounts, setFollowupCounts] = useState({
    propertyFollowups: 0,
    tenantFollowups: 0,
  });

  const [paymentCounts, setPaymentCounts] = useState({
    propPayFailed: 0,
    propPayNow: 0,
    propPayLater: 0,
    tenantPayFailed: 0,
    tenantPayNow: 0,
    tenantPayLater: 0,
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

  const fetchYesterdayActions = useCallback(async () => {
    const yesterdayStart = moment().subtract(1, 'days').startOf('day');
    const yesterdayEnd = moment().subtract(1, 'days').endOf('day');

    const isYesterday = (dateStr) => {
      const date = moment(dateStr);
      return date.isBetween(yesterdayStart, yesterdayEnd, undefined, '[]');
    };

    try {
      const [contactRes, favoriteRes, photoRes, addressRes, offersRes, viewedRes, interestRes, calledRes, loginUsersRes, approvedRes, freePlansRes, paidPlansRes, baActiveRes, allBuyerBillsRes, baFreeRes, baPaidRes, payuBuyerRes, preApprovedRes, allPropsRes, pendingRes, deletedRes, expiredRes, pendingBARes, allBARes, propPayFailedRes, propPayNowRes, propPayLaterRes, tenantPayFailedRes, tenantPayNowRes, tenantPayLaterRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/get-all-contact-requests`),
        axios.get(`${process.env.REACT_APP_API_URL}/get-all-favorite-requests`),
        axios.get(`${process.env.REACT_APP_API_URL}/all-photo-requests`),
        axios.get(`${process.env.REACT_APP_API_URL}/get-address-requests-all`),
        axios.get(`${process.env.REACT_APP_API_URL}/all-offers`),
        axios.get(`${process.env.REACT_APP_API_URL}/user-get-all-last-views`),
        axios.get(`${process.env.REACT_APP_API_URL}/get-all-sendinterest`),
        axios.get(`${process.env.REACT_APP_API_URL}/get-all-contact-sent-properties`),
        axios.get(`${process.env.REACT_APP_API_URL}/user/alls`),
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-datas-all-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`),
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`),
        axios.get(`${process.env.REACT_APP_API_URL}/raActive-buyerAssistance-all-plans-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/buyer-bills-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/buyer-bills/free-with-assistance-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/buyer-bills/non-free-with-assistance-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/payments-with-plan/paid-buyer`),
        axios.get(`${process.env.REACT_APP_API_URL}/properties/pre-approved-all-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-alls-datas-all`),
        axios.get(`${process.env.REACT_APP_API_URL}/properties/pending-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/properties/deleted-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/all-expired-properties`),
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-buyerAssistance-pending-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-buyer-assistance-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/payments/pay-failed`),
        axios.get(`${process.env.REACT_APP_API_URL}/payments/pay-now`),
        axios.get(`${process.env.REACT_APP_API_URL}/payments/pay-later`),
        axios.get(`${process.env.REACT_APP_API_URL}/payments-with-plan/pay-failed-buyer`),
        axios.get(`${process.env.REACT_APP_API_URL}/payments-with-plan/pay-now-buyer`),
        axios.get(`${process.env.REACT_APP_API_URL}/payments-with-plan/pay-later-buyer`),
      ]);

      const contactData = contactRes.data.contactRequestsData || [];
      const favoriteData = favoriteRes.data.favoriteRequestsData || [];
      const photoData = Array.isArray(photoRes.data) ? photoRes.data : [];
      const addressData = addressRes.data.requests || [];
      const offersData = offersRes.data.offers || [];
      const viewedData = Array.isArray(viewedRes.data) ? viewedRes.data : [];
      const interestData = interestRes.data.interestRequestsData || [];
      const calledData = calledRes.data.success ? (calledRes.data.properties || []) : [];
      const allUsersRaw = (loginUsersRes.data?.data && Array.isArray(loginUsersRes.data.data)) ? loginUsersRes.data.data : [];

      const userMap = new Map();
      allUsersRaw.forEach((u) => {
        const phone = u.phone || '';
        if (!phone) return;
        const existing = userMap.get(phone);
        if (!existing) { userMap.set(phone, u); return; }
        const pri = (s) => (s === 'verified' ? 2 : s === 'pending' ? 1 : 0);
        if (pri(u.otpStatus) > pri(existing.otpStatus)) { userMap.set(phone, u); return; }
        if (pri(u.otpStatus) === pri(existing.otpStatus)) {
          const ed = existing.loginDate ? new Date(existing.loginDate) : null;
          const cd = u.loginDate ? new Date(u.loginDate) : null;
          if ((!ed && cd) || (ed && cd && cd > ed)) userMap.set(phone, u);
        }
      });
      const allUsers = Array.from(userMap.values());

      const totalUnreported = allUsers.filter(u => !u.remarks || (u.remarks !== 'seller' && u.remarks !== 'buyer' && u.remarks !== 'visitor')).length;
      const totalConversionPending = allUsers.filter(u => !u.conversionStatus || u.conversionStatus === 'pending').length;
      setLoginReportCounts({ totalUnreported, totalConversionPending });

      const yesterdayUsers = allUsers.filter(item => isYesterday(item.loginDate));
      const reported = yesterdayUsers.filter(u => u.remarks === 'seller' || u.remarks === 'buyer' || u.remarks === 'visitor');
      const unreported = yesterdayUsers.filter(u => !u.remarks || (u.remarks !== 'seller' && u.remarks !== 'buyer' && u.remarks !== 'visitor'));

      setYesterdayLogin({
        totalLogin: yesterdayUsers.length,
        reported: reported.length,
        unreported: unreported.length,
        owner: yesterdayUsers.filter(u => u.remarks === 'seller').length,
        tenant: yesterdayUsers.filter(u => u.remarks === 'buyer').length,
        visitor: yesterdayUsers.filter(u => u.remarks === 'visitor').length,
        conversionPaid: yesterdayUsers.filter(u => u.conversionStatus === 'paid').length,
        conversionFree: yesterdayUsers.filter(u => u.conversionStatus === 'free').length,
        conversionPending: yesterdayUsers.filter(u => !u.conversionStatus || u.conversionStatus === 'pending').length,
      });

      const approvedData = Array.isArray(approvedRes.data?.users) ? approvedRes.data.users : [];
      const freePlansData = Array.isArray(freePlansRes.data?.data) ? freePlansRes.data.data : [];
      const paidPlansData = Array.isArray(paidPlansRes.data?.data) ? paidPlansRes.data.data : [];

      const freeRentIds = new Set();
      freePlansData.forEach(item => {
        if (Array.isArray(item.properties)) {
          item.properties.forEach(p => { if (p.rentId) freeRentIds.add(p.rentId); });
        }
      });
      const paidRentIds = new Set();
      paidPlansData.forEach(item => {
        if (Array.isArray(item.properties)) {
          item.properties.forEach(p => { if (p.rentId) paidRentIds.add(p.rentId); });
        }
      });

      const yesterdayApproved = approvedData.filter(item => isYesterday(item.createdAt));
      const yesterdayFreeProps = yesterdayApproved.filter(item => freeRentIds.has(item.rentId) && !paidRentIds.has(item.rentId));
      const yesterdayPaidProps = yesterdayApproved.filter(item => paidRentIds.has(item.rentId));

      const baActiveData = baActiveRes.data?.data || [];
      const allBuyerBills = allBuyerBillsRes.data?.data || [];

      const baFreeIds = new Set((baFreeRes.data.data || []).map(item => item.buyerAssistance?.Ra_Id).filter(Boolean));
      const baPaidIds = new Set((baPaidRes.data.data || []).map(item => item.buyerAssistance?.Ra_Id).filter(Boolean));

      const payuBuyerData = payuBuyerRes.data.data || [];
      payuBuyerData.forEach(p => {
        if (p.Ra_Id) baPaidIds.add(p.Ra_Id);
      });

      allBuyerBills.forEach(bill => {
        const raId = bill.Ra_Id;
        if (raId && !baFreeIds.has(raId) && !baPaidIds.has(raId)) {
          if (bill.paymentType?.toLowerCase() === 'free') baFreeIds.add(raId);
          else baPaidIds.add(raId);
        }
      });

      const yesterdayBA = baActiveData.filter(item => {
        if (item.isDeleted) return false;
        return isYesterday(item.createdAt) || isYesterday(item.planDetails?.planCreatedAt) || isYesterday(item.updatedAt);
      });
      const yesterdayBAFree = yesterdayBA.filter(item => baFreeIds.has(item.Ra_Id) && !baPaidIds.has(item.Ra_Id));
      const yesterdayBAPaid = yesterdayBA.filter(item => baPaidIds.has(item.Ra_Id));

      setYesterdayProperty({
        totalCreated: yesterdayApproved.length,
        freeProperty: yesterdayFreeProps.length,
        paidProperty: yesterdayPaidProps.length,
        tenantTotal: yesterdayBA.length,
        tenantFree: yesterdayBAFree.length,
        tenantPaid: yesterdayBAPaid.length,
      });

      const preApprovedUsers = preApprovedRes.data.users || [];
      const allPropsData = allPropsRes.data.users || [];
      const expiredFromAll = allPropsData.filter(p => p.status === 'expired');
      const mergedPreApproved = new Map();
      preApprovedUsers.forEach(p => mergedPreApproved.set(p.rentId, p));
      expiredFromAll.forEach(p => { if (!mergedPreApproved.has(p.rentId)) mergedPreApproved.set(p.rentId, p); });

      const pendingUsers = pendingRes.data.users || [];
      const deletedData = deletedRes.data.data || [];
      const deletedUsers = deletedData.filter(p => p.status === 'delete');
      const expiredPlans = expiredRes.data.expiredPlans || [];

      const pendingBAData = pendingBARes.data?.data || [];
      const pendingBAActive = pendingBAData.filter(item => !item.isDeleted);
      const allBAData = allBARes.data?.data || [];
      const deletedBA = allBAData.filter(item => item.isDeleted === true);

      setPropertyStatusCounts({
        preApproved: mergedPreApproved.size,
        pending: pendingUsers.length,
        deleted: deletedUsers.length,
        expired: expiredPlans.length,
        tenantPending: pendingBAActive.length,
        tenantDeleted: deletedBA.length,
      });

      const propPayFailedData = propPayFailedRes.data.payments || propPayFailedRes.data.data || [];
      const propPayNowData = propPayNowRes.data.payments || propPayNowRes.data.data || [];
      const propPayLaterData = propPayLaterRes.data.payments || propPayLaterRes.data.data || [];
      const tenantPayFailedData = tenantPayFailedRes.data.data || [];
      const tenantPayNowData = tenantPayNowRes.data.data || [];
      const tenantPayLaterData = tenantPayLaterRes.data.data || [];

      setPaymentCounts({
        propPayFailed: propPayFailedData.filter(p => p.payustatususer !== 'paid').length,
        propPayNow: propPayNowData.filter(p => p.payustatususer !== 'paid').length,
        propPayLater: propPayLaterData.filter(p => p.payustatususer !== 'paid').length,
        tenantPayFailed: tenantPayFailedData.length,
        tenantPayNow: tenantPayNowData.length,
        tenantPayLater: tenantPayLaterData.length,
      });

      setYesterdayActions({
        contactViewed: contactData.reduce((sum, item) => sum + (item.contactRequestedUserPhoneNumbers || []).filter(r => isYesterday(r.date)).length, 0),
        favoriteList: favoriteData.filter(item => isYesterday(item.updatedAt || item.createdAt)).length,
        photoRequest: photoData.filter(item => isYesterday(item.createdAt)).length,
        addressRequests: addressData.filter(item => isYesterday(item.createdAt)).length,
        offerRaised: offersData.filter(item => isYesterday(item.createdAt)).length,
        viewedProperties: viewedData.filter(item => isYesterday(item.createdAt || item.viewedAt)).length,
        sendInterest: interestData.filter(item => isYesterday(item.createdAt)).length,
        calledList: calledData.filter(item => isYesterday(item.contactedAt)).length,
      });
    } catch (error) {
      console.error("Error fetching yesterday's action data:", error);
    }
  }, []);

  const fetchFollowupCounts = useCallback(async () => {
    try {
      const [propRes, tenantRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/followup-list`),
        axios.get(`${process.env.REACT_APP_API_URL}/followup-list-buyer`),
      ]);
      const propData = Array.isArray(propRes.data?.data) ? propRes.data.data : [];
      const tenantData = Array.isArray(tenantRes.data?.data) ? tenantRes.data.data : [];
      setFollowupCounts({
        propertyFollowups: propData.length,
        tenantFollowups: tenantData.length,
      });
    } catch (error) {
      console.error("Error fetching follow-up counts:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchYesterdayActions();
    fetchFollowupCounts();
  }, [fetchYesterdayActions, fetchFollowupCounts]);

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

  const yesterday = moment().subtract(1, 'days').format('DD-MM-YYYY');

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-3">
        <h2 className="mb-1">Rent Pondy Overall Report - Admin</h2>
        <p className="text-muted mb-0">
          Welcome, <strong>{adminName || "Admin"}</strong>
          <span className="ms-3 badge bg-light text-secondary border" style={{ fontSize: '12px' }}>
            Data for: {yesterday}
          </span>
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={tabNavStyle}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            style={tabStyle(activeTab === tab.key)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>

        {/* Tab 1: Yesterday's Actions */}
        {activeTab === 'actions' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Action Summary — {yesterday}
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>TOTAL ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>CONTACT VIEWED</td><td>{yesterdayActions.contactViewed}</td></tr>
                <tr><td>2</td><td>FAVORITE LIST</td><td>{yesterdayActions.favoriteList}</td></tr>
                <tr><td>3</td><td>PHOTO REQUEST</td><td>{yesterdayActions.photoRequest}</td></tr>
                <tr><td>4</td><td>ADDRESS REQUESTS</td><td>{yesterdayActions.addressRequests}</td></tr>
                <tr><td>5</td><td>OFFER RAISED</td><td>{yesterdayActions.offerRaised}</td></tr>
                <tr><td>6</td><td>VIEWED PROPERTIES</td><td>{yesterdayActions.viewedProperties}</td></tr>
                <tr><td>7</td><td>SEND INTEREST</td><td>{yesterdayActions.sendInterest}</td></tr>
                <tr><td>8</td><td>CALLED LIST</td><td>{yesterdayActions.calledList}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Tab 2: Yesterday's Login */}
        {activeTab === 'login' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Login Summary — {yesterday}
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>COUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>TOTAL LOGIN</td><td>{yesterdayLogin.totalLogin}</td></tr>
                <tr><td>2</td><td>REPORTED</td><td>{yesterdayLogin.reported}</td></tr>
                <tr><td>3</td><td>UNREPORTED</td><td>{yesterdayLogin.unreported}</td></tr>
                <SectionHeader title="REPORTED BREAKDOWN" />
                <tr><td>4</td><td>OWNER</td><td>{yesterdayLogin.owner}</td></tr>
                <tr><td>5</td><td>TENANT</td><td>{yesterdayLogin.tenant}</td></tr>
                <tr><td>6</td><td>VISITOR</td><td>{yesterdayLogin.visitor}</td></tr>
                <SectionHeader title="CONVERSION BREAKDOWN" />
                <tr><td>7</td><td>PAID</td><td>{yesterdayLogin.conversionPaid}</td></tr>
                <tr><td>8</td><td>FREE</td><td>{yesterdayLogin.conversionFree}</td></tr>
                <tr><td>9</td><td>PENDING</td><td>{yesterdayLogin.conversionPending}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Tab 3: Yesterday's Property */}
        {activeTab === 'property' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Property & Tenant Management (Approved) — {yesterday}
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>COUNT</th>
                </tr>
              </thead>
              <tbody>
                <SectionHeader title="PROPERTY" />
                <tr><td>1</td><td>NO. OF PROPERTY CREATED</td><td>{yesterdayProperty.totalCreated}</td></tr>
                <tr><td>2</td><td>FREE PROPERTY</td><td>{yesterdayProperty.freeProperty}</td></tr>
                <tr><td>3</td><td>PAID PROPERTY</td><td>{yesterdayProperty.paidProperty}</td></tr>
                <SectionHeader title="TENANT" />
                <tr><td>4</td><td>NO. OF TENANT ASSISTANCE CREATED</td><td>{yesterdayProperty.tenantTotal}</td></tr>
                <tr><td>5</td><td>FREE TENANT ASSISTANCE</td><td>{yesterdayProperty.tenantFree}</td></tr>
                <tr><td>6</td><td>PAID TENANT ASSISTANCE</td><td>{yesterdayProperty.tenantPaid}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Tab 4: Property Status */}
        {activeTab === 'status' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Property Status Summary (Total Count)
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>TOTAL COUNT</th>
                </tr>
              </thead>
              <tbody>
                <SectionHeader title="PROPERTY" />
                <tr><td>1</td><td>PRE-APPROVED</td><td>{propertyStatusCounts.preApproved}</td></tr>
                <tr><td>2</td><td>PENDING</td><td>{propertyStatusCounts.pending}</td></tr>
                <tr><td>3</td><td>DELETED</td><td>{propertyStatusCounts.deleted}</td></tr>
                <tr><td>4</td><td>EXPIRED</td><td>{propertyStatusCounts.expired}</td></tr>
                <SectionHeader title="TENANT" />
                <tr><td>5</td><td>PENDING TENANT ASSISTANCE</td><td>{propertyStatusCounts.tenantPending}</td></tr>
                <tr><td>6</td><td>DELETED TENANT ASSISTANCE</td><td>{propertyStatusCounts.tenantDeleted}</td></tr>
                <SectionHeader title="LOGIN REPORT" />
                <tr><td>7</td><td>UNREPORTED</td><td>{loginReportCounts.totalUnreported}</td></tr>
                <tr><td>8</td><td>CONVERSION PENDING</td><td>{loginReportCounts.totalConversionPending}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Tab 5: Payments */}
        {activeTab === 'payments' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Payment Management (Total Count)
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>TOTAL COUNT</th>
                </tr>
              </thead>
              <tbody>
                <SectionHeader title="PROPERTY PAYMENT MANAGEMENT" />
                <tr><td>1</td><td>PAY FAILED</td><td>{paymentCounts.propPayFailed}</td></tr>
                <tr><td>2</td><td>PAY NOW</td><td>{paymentCounts.propPayNow}</td></tr>
                <tr><td>3</td><td>PAY LATER</td><td>{paymentCounts.propPayLater}</td></tr>
                <SectionHeader title="TENANT PAYMENT MANAGEMENT" />
                <tr><td>4</td><td>PAY FAILED</td><td>{paymentCounts.tenantPayFailed}</td></tr>
                <tr><td>5</td><td>PAY NOW</td><td>{paymentCounts.tenantPayNow}</td></tr>
                <tr><td>6</td><td>PAY LATER</td><td>{paymentCounts.tenantPayLater}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Tab 6: Follow-ups */}
        {activeTab === 'followups' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Follow-up Data (Total Count)
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>TOTAL COUNT</th>
                </tr>
              </thead>
              <tbody>
                <SectionHeader title="PROPERTY" />
                <tr><td>1</td><td>PROPERTY FOLLOW-UPS</td><td>{followupCounts.propertyFollowups}</td></tr>
                <SectionHeader title="TENANT" />
                <tr><td>2</td><td>TENANT FOLLOW-UPS</td><td>{followupCounts.tenantFollowups}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminReport;