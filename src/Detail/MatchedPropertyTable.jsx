import React, { useState, useEffect, useRef } from 'react';
import { Table, Badge, Button, Spinner } from 'react-bootstrap';
import { 
  FaPhone, FaMapMarkerAlt, FaMoneyBillWave, FaHome, 
  FaUser, FaCalendarAlt, FaTrash, FaUndo, FaInfoCircle,
  FaIdBadge, FaUserTag, FaFilePdf,
  FaFileExcel, FaPlay, FaStop
} from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as XLSX from "xlsx";
import { useNavigate } from 'react-router-dom';

// ===== CENTRALIZED COLUMN CONFIGURATION =====
const TABLE_COLUMNS = [
  { key: 'rentId', header: 'Rent ID', exportable: true },
  { key: 'postedBy', header: 'Posted By', exportable: true },
  { key: 'contact', header: 'Contact', exportable: true },
  { key: 'rentalAmount', header: 'Rental Amount', exportable: true },
  { key: 'location', header: 'Location', exportable: true },
  { key: 'type', header: 'Type', exportable: true },
  { key: 'facing', header: 'Facing', exportable: true },
  { key: 'bedrooms', header: 'Bedrooms', exportable: true },
  { key: 'area', header: 'Area', exportable: true },
  { key: 'postedOn', header: 'Posted On', exportable: true },
  { key: 'raId', header: 'RA_ID', exportable: true },
  { key: 'raName', header: 'RA_NAME', exportable: true },
  { key: 'raPhone', header: 'RA PHONE', exportable: true },
  { key: 'raArea', header: 'RA AREA', exportable: true },
  { key: 'raCity', header: 'RA CITY', exportable: true },
  { key: 'status', header: 'Status', exportable: true },
  { key: 'whatsappStatus', header: 'Whatsapp Status', exportable: true },
  { key: 'whatsapp', header: 'Send WhatsApp', exportable: false },
  { key: 'actions', header: 'Action', exportable: false },
  { key: 'viewDetails', header: 'View Details', exportable: false },
];

const EXPORT_COLUMNS = TABLE_COLUMNS.filter(col => col.exportable);
const AUTOMATION_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const MatchedDataTable = () => {
  const [matchedData, setMatchedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingAll, setSendingAll] = useState(false);
  const [message, setMessage] = useState(null);
  const [freeProperties, setFreeProperties] = useState([]);
  const [paidProperties, setPaidProperties] = useState([]);
  const [freeTenants, setFreeTenants] = useState([]);
  const [paidTenants, setPaidTenants] = useState([]);
  const [filters, setFilters] = useState({
    propertyId: '',
    raId: '',
    startDate: '',
    endDate: '',
    ownerPhoneNumber: '',
    raPhoneNumber: '',
    minRentalAmount: '',
    maxRentalAmount: '',
    whatsappStatus: '',
    ownerPlan: '',
    tenantPlan: ''
  });

  // ===== AUTOMATION STATE =====
  const [isAutomationRunning, setIsAutomationRunning] = useState(false);
  const [automationQueue, setAutomationQueue] = useState([]);       // pending pairs
  const [automationCurrentIndex, setAutomationCurrentIndex] = useState(0);
  const [automationSentCount, setAutomationSentCount] = useState(0);
  const [automationFailedCount, setAutomationFailedCount] = useState(0);
  const [automationTotal, setAutomationTotal] = useState(0);
  const [automationCountdown, setAutomationCountdown] = useState(0); // seconds until next send
  const [automationCurrentItem, setAutomationCurrentItem] = useState(null); // currently sending pair

  const automationTimerRef = useRef(null);       // setTimeout for next send
  const countdownIntervalRef = useRef(null);      // setInterval for countdown display
  const isAutomationRunningRef = useRef(false);   // stable ref to avoid stale closure
  const automationQueueRef = useRef([]);          // stable ref for queue
  const automationIndexRef = useRef(0);           // stable ref for index
  // Keep refs in sync with state
  useEffect(() => { isAutomationRunningRef.current = isAutomationRunning; }, [isAutomationRunning]);
  useEffect(() => { automationQueueRef.current = automationQueue; }, [automationQueue]);
  useEffect(() => { automationIndexRef.current = automationCurrentIndex; }, [automationCurrentIndex]);

  const navigate = useNavigate();
  const tableRef = useRef();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(automationTimerRef.current);
      clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const formatPrice = (rentalAmount) => {
    return rentalAmount ? `₹${new Intl.NumberFormat('en-IN').format(rentalAmount)}` : '-';
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-IN') : '-';
  };

  const getPropertyValue = (item, property, columnKey, index) => {
    switch (columnKey) {
      case 'rentId': return property.rentId || '-';
      case 'postedBy': return property.postedBy || '-';
      case 'contact': return property.postedByUser || '-';
      case 'rentalAmount': return property.rentalAmount || '-';
      case 'location': return `${property.city || '-'} / ${property.area || '-'}`;
      case 'type': return property.propertyType || '-';
      case 'facing': return property.facing || '-';
      case 'bedrooms': return property.bedrooms || '-';
      case 'area': return property.totalArea ? `${property.totalArea} ${property.areaUnit || ''}` : '-';
      case 'postedOn': return property.createdAt ? formatDate(property.createdAt) : '-';
      case 'raId': return item.buyerAssistanceCard?.Ra_Id || 'N/A';
      case 'raName': return item.buyerAssistanceCard?.name || 'N/A';
      case 'raPhone': return item.buyerAssistanceCard?.phoneNumber || 'N/A';
      case 'raArea': return item.buyerAssistanceCard?.area || 'N/A';
      case 'raCity': return item.buyerAssistanceCard?.city || 'N/A';
      case 'status': return property.isDeleted ? 'Deleted' : 'Active';
      case 'whatsappStatus': return property.Whatsappstatus || '-';
      default: return '';
    }
  };

  const validateExportData = (headers, rows) => {
    if (headers.length === 0 || rows.length === 0) return false;
    for (let i = 0; i < rows.length; i++) {
      if (Object.keys(rows[i]).length !== headers.length) return false;
    }
    return true;
  };

  // ===== SOFT DELETE / UNDO =====
  const handleSoftDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete-buyer-assistance-rent/${id}`);
      setMessage("Tenant Assistance request deleted successfully.");
      setMatchedData(prev => prev.map(item =>
        item.buyerAssistanceCard._id === id
          ? { ...item, buyerAssistanceCard: { ...item.buyerAssistanceCard, isDeleted: true }, matchedProperties: item.matchedProperties.map(p => ({ ...p, isDeleted: true })) }
          : item
      ));
    } catch { setMessage("Error deleting Tenant Assistance."); }
  };

  const handleUndoDelete = async (id) => {
    if (!window.confirm("Are you sure you want to restore this request?")) return;
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/undo-delete-buyer-assistance-rent/${id}`);
      setMessage("Tenant Assistance request restored successfully.");
      setMatchedData(prev => prev.map(item =>
        item.buyerAssistanceCard._id === id
          ? { ...item, buyerAssistanceCard: { ...item.buyerAssistanceCard, isDeleted: false }, matchedProperties: item.matchedProperties.map(p => ({ ...p, isDeleted: false })) }
          : item
      ));
    } catch { setMessage("Error restoring Tenant Assistance."); }
  };

  // ===== FORMAT PHONE =====
  const formatPhoneNumber = (phone) => {
    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    return cleanPhone.length === 10 ? `91${cleanPhone}` : null;
  };

  const maskPhoneNumber = (phoneNumber) => {
    const cleaned = String(phoneNumber).replace(/\D/g, '');
    if (cleaned.length < 5) return phoneNumber;
    return `${cleaned.substring(0, cleaned.length - 5)}XXXXX`;
  };

  // ===== CORE SEND LOGIC (shared by manual + automation) =====
  const sendWhatsAppPair = async (item, property) => {
    const ownerPhone = property.postedByUser;
    const tenantPhone = item.buyerAssistanceCard.phoneNumber;
    const ownerName = property.postedBy || 'Owner';
    const tenantName = item.buyerAssistanceCard.name || 'Tenant';
    const propertyDetails = `${property.bedrooms} BHK in ${property.city}`;

    if (!ownerPhone || !tenantPhone) throw new Error('Missing phone numbers');

    const formattedOwnerPhone = formatPhoneNumber(ownerPhone);
    const formattedTenantPhone = formatPhoneNumber(tenantPhone);
    if (!formattedOwnerPhone || !formattedTenantPhone) throw new Error('Invalid phone number format');

    const ownerPlan = getOwnerPlan(property.rentId);
    const tenantPlan = getTenantPlan(item.buyerAssistanceCard.Ra_Id);
    const displayTenantPhone = ownerPlan === 'Free' ? maskPhoneNumber(formattedTenantPhone) : formattedTenantPhone;
    const displayOwnerPhone = tenantPlan === 'Free' ? maskPhoneNumber(formattedOwnerPhone) : formattedOwnerPhone;

    const ownerMessage = `🏠 *RENT PONDY - Property Match Alert!*\n\nHello ${ownerName}! 👋\n\nGreat news! 🎉 Your property *(${propertyDetails})* has been successfully matched with a potential tenant who is actively looking to rent.\n\n📞 *Tenant Contact:* ${displayTenantPhone}${ownerPlan === 'Free' ? `\n\n⚠️ To get the full contact details, please contact *RENT PONDY*:\n📱 *8300622013*` : ''}\n\n📲 *Download our APP:*\nhttps://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share\n\n🌐 *Visit our site:*\nhttps://rentpondy.com/\n\nThank you for choosing *RENT PONDY!* 🙏\nWe're here to make renting easier for you! 🌟`;

    const tenantMessage = `🔑 *RENT PONDY - Property Match Found!*\n\nHello ${tenantName}! 👋\n\nExciting news! 🎉 We have found a *perfect property match* for you!\n\n🏡 *Property Details:* ${propertyDetails}\nThis property matches your requirements and is ready for viewing!\n\n👤 *Property Owner:* ${ownerName}\n📞 *Owner Contact:* ${displayOwnerPhone}${tenantPlan === 'Free' ? `\n\n⚠️ To get the full contact details, please contact *RENT PONDY*:\n📱 *8300622013*` : ''}\n\n📲 *Download our APP:*\nhttps://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share\n\n🌐 *Visit our site:*\nhttps://rentpondy.com/\n\nBest regards,\n*RENT PONDY Team* 🏠✨\n_Making your rental journey smooth & easy!`;

    await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, { to: formattedOwnerPhone, message: ownerMessage });
    await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, { to: formattedTenantPhone, message: tenantMessage });

    const updateResponse = await axios.put(
      `${process.env.REACT_APP_API_URL}/update-whatsapp-status-matched-property/${item.buyerAssistanceCard._id}`,
      { rentId: property.rentId, whatsappStatus: 'Send' }
    );

    if (!updateResponse.data.success) throw new Error('Backend status update failed');

    saveWhatsAppStatusToLocalStorage(item.buyerAssistanceCard._id, property.rentId, 'Send');

    const updater = (prevData) => prevData.map(dataItem =>
      dataItem.buyerAssistanceCard._id === item.buyerAssistanceCard._id
        ? { ...dataItem, matchedProperties: dataItem.matchedProperties.map(prop => prop.rentId === property.rentId ? { ...prop, Whatsappstatus: 'Send' } : prop) }
        : dataItem
    );
    setMatchedData(updater);
    setFilteredData(updater);
  };

  // ===== MANUAL SEND =====
  const handleSendWhatsApp = async (item, property) => {
    try {
      await sendWhatsAppPair(item, property);
      setMessage(`WhatsApp messages sent successfully to both ${item.buyerAssistanceCard.name || 'Tenant'} and ${property.postedBy || 'Owner'}!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`Error sending WhatsApp message: ${error.message}`);
    }
  };

  // ===== UNDO WHATSAPP =====
  const handleUndoWhatsApp = async (item, property) => {
    if (!window.confirm('Are you sure you want to undo this WhatsApp status? Status will be reset to "Not Send".')) return;
    try {
      const updateResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-whatsapp-status-matched-property/${item.buyerAssistanceCard._id}`,
        { rentId: property.rentId, whatsappStatus: 'Not Send' }
      );
      if (!updateResponse.data.success) { setMessage(`Error: Undo request failed`); return; }

      saveWhatsAppStatusToLocalStorage(item.buyerAssistanceCard._id, property.rentId, 'Not Send');
      const updater = (prevData) => prevData.map(dataItem =>
        dataItem.buyerAssistanceCard._id === item.buyerAssistanceCard._id
          ? { ...dataItem, matchedProperties: dataItem.matchedProperties.map(prop => prop.rentId === property.rentId ? { ...prop, Whatsappstatus: 'Not Send' } : prop) }
          : dataItem
      );
      setMatchedData(updater);
      setFilteredData(updater);
      setMessage(`WhatsApp status reverted to "Not Send"!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`Error undoing WhatsApp status: ${error.message}`);
    }
  };

  // ===== AUTOMATION: BUILD QUEUE =====
  const buildAutomationQueue = () => {
    const filteredResults = applyFilters();
    const pairs = [];
    filteredResults.forEach(item => {
      item.matchedProperties.forEach(property => {
        // IMPORTANT: Only queue entries where WhatsApp has NOT been sent yet
        if (property.Whatsappstatus !== 'Send') {
          pairs.push({ item, property });
        }
      });
    });
    return pairs;
  };

  // ===== AUTOMATION: START COUNTDOWN DISPLAY =====
  const startCountdown = (seconds) => {
    clearInterval(countdownIntervalRef.current);
    setAutomationCountdown(seconds);
    countdownIntervalRef.current = setInterval(() => {
      setAutomationCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownIntervalRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ===== AUTOMATION: PROCESS NEXT ITEM IN QUEUE =====
  const processNextAutomationItem = async (queue, index, sentCount, failedCount) => {
    if (!isAutomationRunningRef.current) return;
    if (index >= queue.length) {
      // All done
      setIsAutomationRunning(false);
      isAutomationRunningRef.current = false;
      clearInterval(countdownIntervalRef.current);
      setAutomationCurrentItem(null);
      setAutomationCountdown(0);
      setMessage(`✅ Automation complete! Sent: ${sentCount}, Failed: ${failedCount}`);
      return;
    }

    const { item, property } = queue[index];

    // Double-check: skip if already sent (state may have updated)
    if (property.Whatsappstatus === 'Send') {
      setAutomationCurrentIndex(index + 1);
      processNextAutomationItem(queue, index + 1, sentCount, failedCount);
      return;
    }

    setAutomationCurrentItem({ item, property, index });
    setAutomationCurrentIndex(index);

    let newSent = sentCount;
    let newFailed = failedCount;

    try {
      await sendWhatsAppPair(item, property);
      newSent = sentCount + 1;
      setAutomationSentCount(newSent);
      setMessage(`🤖 [Automation] Sent ${newSent}/${queue.length - failedCount} — ${property.postedBy || 'Owner'} & ${item.buyerAssistanceCard.name || 'Tenant'} ✅`);
    } catch (error) {
      newFailed = failedCount + 1;
      setAutomationFailedCount(newFailed);
      setMessage(`🤖 [Automation] Failed for Rent ID: ${property.rentId} — ${error.message}`);
    }

    const nextIndex = index + 1;
    setAutomationCurrentIndex(nextIndex);

    if (nextIndex >= queue.length) {
      // Done after this item
      setTimeout(() => {
        setIsAutomationRunning(false);
        isAutomationRunningRef.current = false;
        clearInterval(countdownIntervalRef.current);
        setAutomationCurrentItem(null);
        setAutomationCountdown(0);
        setMessage(`✅ Automation complete! Sent: ${newSent}, Failed: ${newFailed}`);
      }, 500);
      return;
    }

    // Schedule next with 5-minute interval
    startCountdown(AUTOMATION_INTERVAL_MS / 1000);
    automationTimerRef.current = setTimeout(() => {
      if (isAutomationRunningRef.current) {
        processNextAutomationItem(queue, nextIndex, newSent, newFailed);
      }
    }, AUTOMATION_INTERVAL_MS);
  };

  // ===== AUTOMATION: START =====
  const handleStartAutomation = () => {
    const queue = buildAutomationQueue();
    if (queue.length === 0) {
      setMessage('✅ No pending messages to send. All properties already have WhatsApp sent!');
      return;
    }

    if (!window.confirm(`Start automation? This will send WhatsApp messages to ${queue.length} matched pair(s) with a 5-minute gap between each to avoid spam. Click OK to begin.`)) return;

    // Reset automation state
    setAutomationQueue(queue);
    automationQueueRef.current = queue;
    setAutomationTotal(queue.length);
    setAutomationCurrentIndex(0);
    automationIndexRef.current = 0;
    setAutomationSentCount(0);
    setAutomationFailedCount(0);
    setAutomationCurrentItem(null);
    setIsAutomationRunning(true);
    isAutomationRunningRef.current = true;

    setMessage(`🤖 Automation started! ${queue.length} message pair(s) to send with 5-minute intervals.`);

    // Start immediately with first item
    processNextAutomationItem(queue, 0, 0, 0);
  };

  // ===== AUTOMATION: STOP =====
  const handleStopAutomation = () => {
    if (!window.confirm('Stop automation? Progress so far will be saved. Unsent messages can be sent later.')) return;
    clearTimeout(automationTimerRef.current);
    clearInterval(countdownIntervalRef.current);
    setIsAutomationRunning(false);
    isAutomationRunningRef.current = false;
    setAutomationCurrentItem(null);
    setAutomationCountdown(0);
    setMessage(`⛔ Automation stopped. Sent: ${automationSentCount}, Failed: ${automationFailedCount}, Remaining: ${automationTotal - automationCurrentIndex}`);
  };

  // ===== LOCALSTORAGE HELPERS =====
  const saveWhatsAppStatusToLocalStorage = (baId, rentId, status) => {
    localStorage.setItem(`whatsapp_status_${baId}_${rentId}`, status);
  };

  const getWhatsAppStatusFromLocalStorage = (baId, rentId) => {
    return localStorage.getItem(`whatsapp_status_${baId}_${rentId}`);
  };

  const applyLocalStorageStatusesToData = (data) => {
    return data.map(item => ({
      ...item,
      matchedProperties: item.matchedProperties.map(property => {
        const savedStatus = getWhatsAppStatusFromLocalStorage(item.buyerAssistanceCard._id, property.rentId);
        return savedStatus ? { ...property, Whatsappstatus: savedStatus } : property;
      })
    }));
  };

  useEffect(() => {
    fetchMatchedData();
    fetchOwnerPlanData();
    fetchTenantPlanData();
  }, []);

  const fetchMatchedData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-matched-datas-rent`);
      if (res.data.success) {
        const dataWithStatuses = applyLocalStorageStatusesToData(res.data.data);
        setMatchedData(dataWithStatuses);
        setFilteredData(dataWithStatuses);
      }
    } catch {} finally { setLoading(false); }
  };

  const fetchOwnerPlanData = async () => {
    try {
      const freeRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`);
      const freeProps = [];
      (freeRes.data.data || []).forEach(item => {
        (item.properties || []).forEach(prop => { if (prop.rentId) freeProps.push(String(prop.rentId).trim()); });
      });
      setFreeProperties(freeProps);
    } catch (e) { console.error("Error fetching free properties:", e.message); }

    try {
      const paidRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`);
      const paidProps = [];
      (paidRes.data.data || []).forEach(item => {
        (item.properties || []).forEach(prop => { if (prop.rentId) paidProps.push(String(prop.rentId).trim()); });
      });
      setPaidProperties(paidProps);
    } catch (e) { console.error("Error fetching paid properties:", e.message); }
  };

  const getOwnerPlan = (rentId) => {
    const id = String(rentId).trim();
    if (freeProperties.includes(id)) return 'Free';
    if (paidProperties.includes(id)) return 'Paid';
    return '-';
  };

  const fetchTenantPlanData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/buyer-bills/free-with-assistance-rent`);
      const list = [];
      (res.data.data || []).forEach(item => { if (item.buyerAssistance?.Ra_Id) list.push(String(item.buyerAssistance.Ra_Id).trim()); });
      setFreeTenants(list);
    } catch (e) { console.error("Error fetching free tenants:", e.message); }

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/buyer-bills/non-free-with-assistance-rent`);
      const list = [];
      (res.data.data || []).forEach(item => { if (item.buyerAssistance?.Ra_Id) list.push(String(item.buyerAssistance.Ra_Id).trim()); });
      setPaidTenants(list);
    } catch (e) { console.error("Error fetching paid tenants:", e.message); }
  };

  const getTenantPlan = (raId) => {
    const id = String(raId).trim();
    if (freeTenants.includes(id)) return 'Free';
    if (paidTenants.includes(id)) return 'Paid';
    return '-';
  };

  const applyFilters = () => {
    return filteredData.map(item => {
      const matched = item.matchedProperties.filter(property => {
        const matchesId = filters.propertyId ? (property.rentId && property.rentId.toString().toLowerCase().includes(filters.propertyId.toLowerCase())) : true;
        const matchesRaId = filters.raId ? (item.buyerAssistanceCard?.Ra_Id && item.buyerAssistanceCard.Ra_Id.toString().toLowerCase().includes(filters.raId.toLowerCase())) : true;
        const matchesOwnerPhone = filters.ownerPhoneNumber ? (property.postedByUser && property.postedByUser.toString().toLowerCase().includes(filters.ownerPhoneNumber.toLowerCase())) : true;
        const matchesRaPhone = filters.raPhoneNumber ? (item.buyerAssistanceCard?.phoneNumber && item.buyerAssistanceCard.phoneNumber.toString().toLowerCase().includes(filters.raPhoneNumber.toLowerCase())) : true;
        const createdDate = new Date(property.createdAt);
        const startMatch = filters.startDate ? createdDate >= new Date(filters.startDate + 'T00:00:00') : true;
        const endMatch = filters.endDate ? createdDate <= new Date(filters.endDate + 'T23:59:59') : true;
        const minMatch = filters.minRentalAmount ? property.rentalAmount >= parseFloat(filters.minRentalAmount) : true;
        const maxMatch = filters.maxRentalAmount ? property.rentalAmount <= parseFloat(filters.maxRentalAmount) : true;
        let matchesWhatsappStatus = true;
        if (filters.whatsappStatus) {
          // When filter is explicitly selected, show only items matching that filter
          matchesWhatsappStatus = (property.Whatsappstatus || 'Not Send') === filters.whatsappStatus;
        } else {
          // By default, show only "Not Send" items (unsent messages)
          matchesWhatsappStatus = (property.Whatsappstatus || 'Not Send') === 'Not Send';
        }
        let matchesOwnerPlan = true;
        if (filters.ownerPlan) matchesOwnerPlan = getOwnerPlan(property.rentId) === filters.ownerPlan;
        let matchesTenantPlan = true;
        if (filters.tenantPlan) matchesTenantPlan = getTenantPlan(item.buyerAssistanceCard.Ra_Id) === filters.tenantPlan;
        const ownerPlan = getOwnerPlan(property.rentId);
        const tenantPlan = getTenantPlan(item.buyerAssistanceCard.Ra_Id);
        const excludeInvalidPlans = ownerPlan !== "-" && tenantPlan !== "-";
        return matchesId && matchesRaId && matchesOwnerPhone && matchesRaPhone && startMatch && endMatch && minMatch && maxMatch && matchesWhatsappStatus && matchesOwnerPlan && matchesTenantPlan && excludeInvalidPlans;
      });
      return { ...item, matchedProperties: matched };
    }).filter(item => item.matchedProperties.length > 0);
  };

  const handleResetFilters = () => {
    setFilters({ propertyId: '', raId: '', startDate: '', endDate: '', ownerPhoneNumber: '', raPhoneNumber: '', minRentalAmount: '', maxRentalAmount: '', whatsappStatus: '', ownerPlan: '', tenantPlan: '' });
  };

  const getTotalMatchedPropertiesCount = () => matchedData.reduce((total, item) => {
    return total + item.matchedProperties.filter(p => getOwnerPlan(p.rentId) !== "-" && getTenantPlan(item.buyerAssistanceCard.Ra_Id) !== "-").length;
  }, 0);

  const getFilteredMatchedPropertiesCount = () => applyFilters().reduce((total, item) => total + (item.matchedProperties?.length || 0), 0);

  const getWhatsAppSentCount = () => {
    let count = 0;
    applyFilters().forEach(item => item.matchedProperties?.forEach(p => { if (p.Whatsappstatus === 'Send') count++; }));
    return count;
  };

  const getWhatsAppNotSentCount = () => {
    let count = 0;
    applyFilters().forEach(item => item.matchedProperties?.forEach(p => { if (p.Whatsappstatus !== 'Send') count++; }));
    return count;
  };

  const getFlattenedData = () => {
    const flattened = [];
    applyFilters().forEach(item => item.matchedProperties.forEach(property => flattened.push({ item, property })));
    return flattened;
  };

  const handlePrint = () => {
    const flattenedData = getFlattenedData();
    if (flattenedData.length === 0) { alert('No data to print.'); return; }
    const exportHeaders = EXPORT_COLUMNS.map(col => col.header);
    const exportRows = flattenedData.map(({ item, property }, idx) => {
      const row = {};
      EXPORT_COLUMNS.forEach(col => { row[col.header] = getPropertyValue(item, property, col.key, idx); });
      return row;
    });
    let tableHTML = '<table style="border-collapse:collapse;width:100%;font-size:11px;"><thead><tr>';
    exportHeaders.forEach(h => { tableHTML += `<th style="border:1px solid #000;padding:8px;background:#f0f0f0;">${h}</th>`; });
    tableHTML += '</tr></thead><tbody>';
    exportRows.forEach(row => {
      tableHTML += '<tr>';
      Object.values(row).forEach(v => { tableHTML += `<td style="border:1px solid #000;padding:6px;">${v}</td>`; });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    const w = window.open("", "", "width=1400,height=900");
    w.document.write(`<html><head><title>Matched Property Print</title></head><body><h1>RENT PONDY</h1><h2>Matched Property Export - ${new Date().toLocaleString()}</h2><p>Total: ${exportRows.length}</p>${tableHTML}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const downloadExcel = () => {
    const flattenedData = getFlattenedData();
    if (flattenedData.length === 0) { alert('No data to export.'); return; }
    const exportRows = flattenedData.map(({ item, property }, idx) => {
      const row = {};
      EXPORT_COLUMNS.forEach(col => { row[col.header] = getPropertyValue(item, property, col.key, idx); });
      return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Matched Properties');
    XLSX.writeFile(workbook, `MatchedProperties_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handlePrintPDF = () => {
    const flattenedData = getFlattenedData();
    if (flattenedData.length === 0) { alert('No data to export.'); return; }
    const exportHeaders = EXPORT_COLUMNS.map(col => col.header);
    const exportRows = flattenedData.map(({ item, property }, idx) => {
      const row = {};
      EXPORT_COLUMNS.forEach(col => { row[col.header] = getPropertyValue(item, property, col.key, idx); });
      return row;
    });
    let tableHTML = '<table style="border-collapse:collapse;width:100%;font-size:11px;"><thead><tr>';
    exportHeaders.forEach(h => { tableHTML += `<th style="border:1px solid #000;padding:8px;background:#f0f0f0;">${h}</th>`; });
    tableHTML += '</tr></thead><tbody>';
    exportRows.forEach(row => {
      tableHTML += '<tr>';
      Object.values(row).forEach(v => { tableHTML += `<td style="border:1px solid #000;padding:6px;">${v}</td>`; });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    const w = window.open("", "", "width=1400,height=900");
    w.document.write(`<html><head><title>Matched Property PDF</title></head><body><h1>RENT PONDY</h1><h2>Matched Property PDF Export - ${new Date().toLocaleString()}</h2><p>Total: ${exportRows.length}</p>${tableHTML}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  // ===== AUTOMATION STATUS PANEL =====
  const renderAutomationPanel = () => {
    if (!isAutomationRunning && automationTotal === 0) return null;

    const progressPercent = automationTotal > 0
      ? Math.round(((automationSentCount + automationFailedCount) / automationTotal) * 100)
      : 0;

    const countdownMins = Math.floor(automationCountdown / 60);
    const countdownSecs = automationCountdown % 60;

    return (
      <div style={{
        border: '2px solid #28a745',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        background: isAutomationRunning ? '#f0fff4' : '#f8f9fa',
        boxShadow: '0 2px 8px rgba(40,167,69,0.15)'
      }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 style={{ margin: 0, color: isAutomationRunning ? '#28a745' : '#6c757d' }}>
            🤖 WhatsApp Automation {isAutomationRunning ? '— Running...' : '— Stopped'}
          </h5>
          {isAutomationRunning && (
            <span style={{ fontSize: '13px', color: '#555' }}>
              Progress: {automationSentCount + automationFailedCount} / {automationTotal}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ background: '#dee2e6', borderRadius: '4px', height: '10px', marginBottom: '10px' }}>
          <div style={{
            background: '#28a745',
            height: '10px',
            borderRadius: '4px',
            width: `${progressPercent}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        <div className="d-flex gap-4 flex-wrap" style={{ fontSize: '14px' }}>
          <span>✅ Sent: <strong>{automationSentCount}</strong></span>
          <span>❌ Failed: <strong style={{ color: '#dc3545' }}>{automationFailedCount}</strong></span>
          <span>📋 Total: <strong>{automationTotal}</strong></span>
          <span>⏳ Remaining: <strong>{automationTotal - automationCurrentIndex}</strong></span>
        </div>

        {/* Currently sending */}
        {isAutomationRunning && automationCurrentItem && (
          <div style={{ marginTop: '10px', fontSize: '13px', color: '#333', background: '#fff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cce5cc' }}>
            <strong>📤 Now Sending:</strong> Rent ID <strong>{automationCurrentItem.property.rentId}</strong> —{' '}
            Owner: <strong>{automationCurrentItem.property.postedBy || 'N/A'}</strong> &amp;{' '}
            Tenant: <strong>{automationCurrentItem.item.buyerAssistanceCard?.name || 'N/A'}</strong>
          </div>
        )}

        {/* Countdown timer */}
        {isAutomationRunning && automationCountdown > 0 && (
          <div style={{ marginTop: '10px', fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Spinner animation="border" size="sm" variant="success" />
            <span>
              Next message in: <strong style={{ color: '#28a745', fontSize: '15px' }}>
                {countdownMins > 0 ? `${countdownMins}m ` : ''}{countdownSecs}s
              </strong>
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Matched Tenant Requests & Properties</h2>
        {!isAutomationRunning ? (
          <button
            className="btn btn-success d-flex align-items-center gap-2"
            style={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 18px' }}
            onClick={handleStartAutomation}
            disabled={getWhatsAppNotSentCount() === 0}
            title={getWhatsAppNotSentCount() === 0 ? 'All messages already sent' : `Start automation for ${getWhatsAppNotSentCount()} pending messages`}
          >
            <FaPlay /> Start Automation ({getWhatsAppNotSentCount()} pending)
          </button>
        ) : (
          <button
            className="btn btn-danger d-flex align-items-center gap-2"
            style={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 18px' }}
            onClick={handleStopAutomation}
          >
            <FaStop /> Stop Automation
          </button>
        )}
      </div>

      {message && (
        <div className="alert alert-info" role="alert">{message}</div>
      )}

      {/* AUTOMATION PANEL */}
      {renderAutomationPanel()}

      {/* FILTERS */}
      <div className="mb-4 p-3 border rounded" style={{ boxShadow: '0px 4px 8px rgba(0,0,0,0.2)', backgroundColor: '#fff' }}>
        <div className="d-flex flex-row gap-2 align-items-center flex-wrap">
          <div className="mb-0">
            <label className="form-label fw-bold" style={{ marginBottom: '5px' }}>Search Owner RENT ID</label>
            <input type="text" placeholder="Enter RENT ID" value={filters.propertyId} onChange={e => setFilters({ ...filters, propertyId: e.target.value })} className="form-control" />
          </div>
          <div className="mb-0">
            <label className="form-label fw-bold" style={{ marginBottom: '5px' }}>Search Tenant ID</label>
            <input type="text" placeholder="Enter Tenant ID" value={filters.raId} onChange={e => setFilters({ ...filters, raId: e.target.value })} className="form-control" />
          </div>
          <div className="mb-0">
            <label className="form-label fw-bold" style={{ marginBottom: '5px' }}>Owner Phone Number</label>
            <input type="text" placeholder="Enter Owner Phone" value={filters.ownerPhoneNumber} onChange={e => setFilters({ ...filters, ownerPhoneNumber: e.target.value })} className="form-control" />
          </div>
          <div className="mb-0">
            <label className="form-label fw-bold" style={{ marginBottom: '5px' }}>Tenant Phone Number</label>
            <input type="text" placeholder="Enter Tenant Phone" value={filters.raPhoneNumber} onChange={e => setFilters({ ...filters, raPhoneNumber: e.target.value })} className="form-control" />
          </div>
          <div className="mb-0">
            <label className="form-label fw-bold" style={{ marginBottom: '5px' }}>Min Rental Amount</label>
            <input type="number" placeholder="Min Amount" value={filters.minRentalAmount} onChange={e => setFilters({ ...filters, minRentalAmount: e.target.value })} className="form-control" />
          </div>
          <div className="mb-0">
            <label className="form-label fw-bold" style={{ marginBottom: '5px' }}>Max Rental Amount</label>
            <input type="number" placeholder="Max Amount" value={filters.maxRentalAmount} onChange={e => setFilters({ ...filters, maxRentalAmount: e.target.value })} className="form-control" />
          </div>
          <div className="mb-0">
            <label className="form-label fw-bold" style={{ marginBottom: '5px' }}>From Date</label>
            <input type="date" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} className="form-control" />
          </div>
          <div className="mb-0">
            <label className="form-label fw-bold" style={{ marginBottom: '5px' }}>End Date</label>
            <input type="date" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} className="form-control" />
          </div>
          <div className="mb-0">
            <label className="form-label fw-bold" style={{ marginBottom: '5px' }}>WhatsApp Status</label>
            <select value={filters.whatsappStatus} onChange={e => setFilters({ ...filters, whatsappStatus: e.target.value })} className="form-control">
              <option value="">All</option>
              <option value="Send">Send</option>
              <option value="Not Send">Not Send</option>
            </select>
          </div>
          <div className="mb-0">
            <label className="form-label fw-bold" style={{ marginBottom: '5px' }}>Owner Plan</label>
            <select value={filters.ownerPlan} onChange={e => setFilters({ ...filters, ownerPlan: e.target.value })} className="form-control">
              <option value="">All</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="mb-0">
            <label className="form-label fw-bold" style={{ marginBottom: '5px' }}>Tenant Plan</label>
            <select value={filters.tenantPlan} onChange={e => setFilters({ ...filters, tenantPlan: e.target.value })} className="form-control">
              <option value="">All</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <button onClick={handleResetFilters} className="btn btn-primary" style={{ marginTop: '20px' }}>Reset All</button>
        </div>
      </div>

      {/* STATS + ACTION BUTTONS */}
      <div className="mb-4">
        <div className="d-flex justify-content-start mb-3 gap-2 align-items-center flex-wrap">
          <div style={{ background: '#6c757d', color: 'white', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}>
            Total: {getTotalMatchedPropertiesCount()} Records
          </div>
          <div style={{ background: '#007bff', color: 'white', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}>
            Showing: {getFilteredMatchedPropertiesCount()} Records
          </div>
          <div style={{ background: '#28a745', color: 'white', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}>
            Send: {getWhatsAppSentCount()}
          </div>
          <div style={{ background: '#ffc107', color: 'black', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}>
            Not Send: {getWhatsAppNotSentCount()}
          </div>

          <button className="btn btn-danger" style={{ fontSize: '15px', padding: '6px 10px' }} onClick={handlePrint}>Print</button>
          <button className="btn btn-success" style={{ fontSize: '15px', padding: '6px 10px' }} onClick={downloadExcel}>Download Excel</button>
          <button className="btn btn-warning" style={{ fontSize: '15px', padding: '6px 10px' }} onClick={handlePrintPDF}>Download PDF</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <h3>Get Matched Property Datas</h3>
        <Table striped bordered hover responsive className="table-sm align-middle">
          <thead className="sticky-top">
            <tr>
              <th><FaIdBadge className="me-1" /> Rent ID</th>
              <th><FaUser className="me-1" /> Posted By</th>
              <th><FaPhone className="me-1" /> Owner Contact</th>
              <th><FaMoneyBillWave className="me-1" /> Rental Amount</th>
              <th><FaMapMarkerAlt className="me-1" /> Location</th>
              <th><FaHome className="me-1" /> Type</th>
              <th>Facing</th>
              <th>Bedrooms</th>
              <th>Area</th>
              <th><FaCalendarAlt className="me-1" /> Posted On</th>
              <th><FaIdBadge className="me-1" /> Tenant ID</th>
              <th><FaUserTag className="me-1" /> Posted by</th>
              <th><FaPhone className="me-1" /> Tenant Contact</th>
              <th><FaMapMarkerAlt className="me-1" /> Tenant Area</th>
              <th><FaMapMarkerAlt className="me-1" /> Tenant City</th>
              <th>Owner Plan</th>
              <th>Tenant Plan</th>
              <th>Status</th>
              <th>Whatsapp Status</th>
              <th>Send WhatsApp</th>
              <th>Undo WhatsApp</th>
              <th>Action</th>
              <th>Views Details</th>
            </tr>
          </thead>
          <tbody>
            {applyFilters().map((item, index) => (
              item.matchedProperties.map((property, idx) => {
                // Highlight row if it is the currently-being-processed automation item
                const isCurrentAutomationRow =
                  isAutomationRunning &&
                  automationCurrentItem &&
                  automationCurrentItem.property.rentId === property.rentId &&
                  automationCurrentItem.item.buyerAssistanceCard._id === item.buyerAssistanceCard._id;

                return (
                  <tr
                    key={`${index}-${idx}`}
                    style={isCurrentAutomationRow ? { background: '#d4edda', outline: '2px solid #28a745' } : {}}
                  >
                    <td>
                      {isCurrentAutomationRow && (
                        <Spinner animation="border" size="sm" variant="success" className="me-1" title="Automation sending now" />
                      )}
                      {property.rentId || '-'}
                    </td>
                    <td>{property.postedBy || '-'}</td>
                    <td>{property.postedByUser || '-'}</td>
                    <td className="text-nowrap">{formatPrice(property.rentalAmount)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaMapMarkerAlt className="text-muted me-1" />
                        {property.city || '-'} / {property.area || '-'}
                      </div>
                    </td>
                    <td>{property.propertyType || '-'}</td>
                    <td>{property.facing || '-'}</td>
                    <td>{property.bedrooms || '-'}</td>
                    <td>{property.totalArea ? <span className="text-nowrap">{property.totalArea} {property.areaUnit || ''}</span> : '-'}</td>
                    <td className="text-nowrap"><FaCalendarAlt className="text-muted me-1" />{formatDate(property.createdAt)}</td>
                    <td><Badge bg="secondary">{item.buyerAssistanceCard.Ra_Id || 'N/A'}</Badge></td>
                    <td>{item.buyerAssistanceCard.name || 'N/A'}</td>
                    <td><a href={`tel:${item.buyerAssistanceCard.phoneNumber}`}>{item.buyerAssistanceCard.phoneNumber || 'N/A'}</a></td>
                    <td>{item.buyerAssistanceCard.area || 'N/A'}</td>
                    <td>{item.buyerAssistanceCard.city || 'N/A'}</td>
                    <td>
                      {getOwnerPlan(property.rentId) === 'Free' ? <Badge bg="info">Free</Badge>
                        : getOwnerPlan(property.rentId) === 'Paid' ? <Badge bg="success">Paid</Badge>
                        : <span>{getOwnerPlan(property.rentId)}</span>}
                    </td>
                    <td>
                      {getTenantPlan(item.buyerAssistanceCard.Ra_Id) === 'Free' ? <Badge bg="info">Free</Badge>
                        : getTenantPlan(item.buyerAssistanceCard.Ra_Id) === 'Paid' ? <Badge bg="success">Paid</Badge>
                        : <span>{getTenantPlan(item.buyerAssistanceCard.Ra_Id)}</span>}
                    </td>
                    <td>
                      {property.isDeleted
                        ? <Badge bg="danger" className="d-flex align-items-center"><FaTrash className="me-1" /> Deleted</Badge>
                        : <Badge bg="success" className="d-flex align-items-center"><FaInfoCircle className="me-1" /> Active</Badge>}
                    </td>
                    <td>
                      {property.Whatsappstatus === 'Send'
                        ? <Badge bg="success" className="d-flex align-items-center">✓ Send</Badge>
                        : <Badge bg="warning" className="d-flex align-items-center">✗ Not Send</Badge>}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary" size="sm"
                        onClick={() => handleSendWhatsApp(item, property)}
                        disabled={property.Whatsappstatus === 'Send' || isAutomationRunning}
                        className="d-flex align-items-center"
                        title={isAutomationRunning ? 'Automation is running' : property.Whatsappstatus === 'Send' ? 'Already sent' : 'Send WhatsApp'}
                      >
                        Send WhatsApp
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="outline-warning" size="sm"
                        onClick={() => handleUndoWhatsApp(item, property)}
                        disabled={property.Whatsappstatus !== 'Send' || isAutomationRunning}
                        className="d-flex align-items-center"
                        title={isAutomationRunning ? 'Automation is running' : 'Revert to Not Send'}
                      >
                        Undo WhatsApp
                      </Button>
                    </td>
                    {item?.buyerAssistanceCard && (
                      <td>
                        {!item.buyerAssistanceCard.isDeleted ? (
                          <Button variant="outline-danger" size="sm" onClick={() => handleSoftDelete(item.buyerAssistanceCard._id)} className="d-flex align-items-center">
                            <FaTrash className="me-1" /> Delete
                          </Button>
                        ) : (
                          <Button variant="outline-primary" size="sm" onClick={() => handleUndoDelete(item.buyerAssistanceCard._id)} className="d-flex align-items-center">
                            <FaUndo className="me-1" /> Restore
                          </Button>
                        )}
                      </td>
                    )}
                    <td>
                      <Button
                        variant="" size="sm"
                        style={{ backgroundColor: "#0d94c1", color: "white" }}
                        onClick={() => navigate(`/dashboard/detail`, { state: { rentId: property.rentId, phoneNumber: property.phoneNumber } })}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MatchedDataTable;