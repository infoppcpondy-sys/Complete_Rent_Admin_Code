import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from "./Navbar";
import ProtectedRoute from './ProtectedRoute';

import LoginReport from "./LoginReport";
import AdminReport from "./AdminReport";
import Plan from "./Plan";
import Statistics from "./Statistics";
import AdminNotification from "./AdminNotification";
import AddCar from "./AddCar";
import AdminLog from "./AdminLog";
import AgentCar from "./AgentCar";
import AllCar from "./AllCar";
import ApprovedCar from "./ApprovedCar";
import Area from "./Places/Area";
import AssistPayLater from "./AssistPayLater";
import AssistPayU from "./AssistPayU";
import AssistSubscriber from "./AssistSubscriber";
import BaFreeBills from "./BaFreeBills";
import BaLoanLead from "./BaLoanLead";
import BuyerListInterestTriede from "./BuyerListInterestTriede";
import BuyerListInterest from "./BuyerListInteres";
import BuyersAssistant from "./BuyersAssistant";
import BuyersContacted from "./BuyersContacted";
import BuyersFollowUps from "./BuyersFollowUps";
import BuyersShortlized from "./BuyersShortlized";
import BuyersStatics from "./BuyersStatics";
import CallBackForm from "./CallBackForm";
import CarFollowUps from "./CarFollowUps";
import CarMake from "./CarMake";
import CarStatics from "./CarStatics";
import City from "./Places/City";
import CustomerCar from "./CustomerCar";
import DailyUsage from "./DailyUsage";
import DealerCar from "./DealerCar";
import District from "./Places/District";
import DownloadLeads from "./DownloadLeads";
import ExpireCar from "./ExpireCar";
import ExpiredAssistant from "./ExpiredAssistant";
import FreeBills from "./FreeBills";
import FreeCar from "./FreeCar";
import FreeUserLead from "./FreeUserLead";
import Help from "./Help";
import HelpLoanLead from "./HelpLoanLead";
import InsuranceLead from "./InsuranceLead";
import LastViewedCar from "./LastViewedCar";
import Limits from "./Limits";
import MatchedBuyer from "./MatchedBuyer";
import MobileViewLead from "./MobileViewLead";
import MyAccount from "./MyAccount";
import NewCarLead from "./NewCarLead";
import OfferesRaised from "./OfferesRaised";
import PaidBills from "./PaidBills";
import PaidCar from "./PaidCar";
import PayLater from "./PayLater";
import PaymentType from "./PaymentType";
import PayUMoney from "./PayUMoney";
import PendingCar from "./PendingCar";
import PhotoRequest from "./PhotoRequest";
import PreApprovedCar from "./PreApprovedCar";
import Profile from "./Profile";
import PucBanner from "./PucBanner";
import PucCar from "./PucCar";
import PucNumber from "./PucNumber";
import RecievedInterest from "./RecievedInterest";
import RemovedCar from "./RemovedCar";
import ReportedCar from "./ReportedCar";
import SearchCar from "./SearchCar";
import SearchedData from "./SearchedData";
import State from "./Places/State";
import Subscriber from "./Subscriber";
import TransferAssistant from "./TransferAssistant";
import TRansferFollowUps from "./TRansferFollowUps";
import TucBanner from "./TucBanner";
import UsageStatics from "./UsageStatics";
import UserRolls from "./UserRolls";
import UsersLog from "./UsersLog";
import Roll from "./Roll";
import CarModel from "./CarModel";
import UserList from "./Users/UserList";
import OfficeList from "./Office/OfficeList";
import BuyerPlan from "./BuyerPlans/BuyerPlan";
import PendingAssistant from "./PendingAssistant";
import BaPaidBill from "./BaPaidBill";
import AddPlan from './PricingPlan/AddPlan';
import EditProperty from './EditProperty';
import Detail from './Detail';
import AdminSetForm from './DataAddAdmin/AdminSetForm';
import InterestTables from './Detail/InterestTables';
import AddPropertyList from './AddPropertyList';
import FavoriteTables from './Detail/FavoriteTables';
import ContactTables from './Detail/ContactTables';
import SoldOutTables from './Detail/SoldOutTables';
import ReportPropertyTables from './Detail/ReportPropertyTables';
import NeedHelpTables from './Detail/NeedHelpTables';
import FavoriteRemoved from './Detail/ShortListRemovedTable';
import GetBuyerAssistance from './GetBuyerAssistance';
import TextEditor from './TextEditer';
import MatchedPropertyTable from './Detail/MatchedPropertyTable';
import MatchedList from './Detail/MatchedList';
import FeaturedProperty from './FeaturedProperty';
import ViewedProperties from './Detail/ViewedProperty';
import NotificationForm from './NotificationSend';
import ProfileTable from './GetUserProfile';
import GetUserCalledList from './GetUserCalledList';
import DeletedProperties from './DeletedProperties';
import PyProperty from './Detail/PyProperty';
import UserViewsTable from './AdminViewsTable';
import CreateFollowUp from './CreateFollowUp';
import FollowUpGetTable from './FollowUpGetTable';
import DeveloperProperty from './DeveloperProperty';
import CreateBill from './CreateBill';
import GetBillDatas from './GetBillDatas';
import AddBuyerAssistance from './AddBuyerAssistance';
import ViewBuyerAssistance from './ViewBuyerAssistance';
import EditBill from './EditBill';
import PostedByProperty from './PostedByProperty';
import PromotorProperty from './PromotorProperty';
import BuyerAssistanceActive from './BuyerAssistanceActive';
import SetPPCID from './SetPPCID';
import EditBuyerAssistance from './EditBuyerAssistance';
import AddressTable from './AddressTable';
import CreateBuyerFollowUp from './CreateBuyerFollowUp';
import FollowUpBuyerGetTable from './FollowUpBuyerGetTable';
import GetAllPropertyStatics from './GetAllPropertyStatics';
import GetAllBuyerStatics from './GetAllBuyerStatics';
import GetAllUsageStatics from './GetAllUsageStatics';
import WithOutPropertyUser from './WithOutPropertyUser';
import AllViewsDatas from './AllViewsDatas';
import WithOutUserStatics from './WithOutStatics';
import WithoutProperty30DaysUser from './Without30days';
import WithUsersTable from './WithAllUser';
import LoginDirectVerifyUser from './LoginDirectVerifyUser';
import UpLoadImagesGroom from './UpLoadImagesGroom';
import UpLoadImagesBride from './UploadImagesBride';
import DirectLogoutUsers from './DirectLogoutUsers';
import RemovePlanPhoneNumber from './RemovePlanPhoneNumber';
import PaymentPaidFailed from './PayuDatas/PaymentPaidFailed';
import PaymentPaidSuccess from './PayuDatas/PaymentPaidSuccess';
import PaymentPaidPayNow from './PayuDatas/PaymentPaidPayNow';
import PaymentPaidPayLater from './PayuDatas/PaymentPaidPayLater';
import PayuBuyerPaid from './PayuBuyerPayments/PayuBuyerPaid';
import PayuBuyerPayFailed from './PayuBuyerPayments/PayuBuyerPayFailed';
import PayuBuyerPaynow from './PayuBuyerPayments/PayuBuyerPaynow';
import PayuBuyerPaylater from './PayuBuyerPayments/PayuBuyerPaylater';
import AllBillsTable from './AllBills';
import CreateBuyerBill from './CreateBuyerBill';
import EditBuyerBill from './EditBuyerBill';
import AllBuyerBills from './AllBuyerBills';
import GroomImageClickTable from './UserClickGroomImages';
import BrideImageClickTable from './UserClickBrideImages';
import LoginUserDatas from './LoginUsersDatas';
import LoginSeparateUser from './LoginSeparateUser';
import SetOnDemandPrice from './ApplyOnDemand';
import DetailRentAssistance from './RentAssistanceDetail';
import CalledListDatas from './Detail/CalledListDatas';
import PropertyStatusTable from './ShowAllProperties';
import FriendProperty from './FriendProperty';
import TanentProperty from './TanentProperty';
import ContactUsage from './ContactUsage';
import SetPropertyMessage from './SetPropertyMessage';
import BuyerAssistViewsTable from './BuyerListUserViewed';
import SalePropertyViewsUser from './SalePropertyViewsUser';
import AddressRequestsTable from './AllAddressRequests';
import UpLoadImagesAds from './UploadAdsImage';
import UpLoadDetailAds from './UploadDetailAds';
import RentIdStatics from './RentIdStatics';
import DetailDailyReport from './DetailDailyReport';
import PropertyPaymentDailyReport from './PropertyPaymentDailyReport';
import GetAllContactFormDatas from './GetAllContactFormDatas';
import OwnerTenantMenu from './Tomenu.jsx';
// import AddPropertyFormMarketing from './AddPropertyFormMarketing';
import RemovedTenant from './RemovedTenant';
import ExclusiveLocation from './605010';
import BulkWhatsapp from './BulkWhatsapp';
import SingleSendMessage from './SingleSendMessage';
import SearchPincode from './SearchPincode';

// ── permissionKey must exactly match the key in ALL_FILES inside UserRolls.jsx ──
const routes = [
  { path: "/loginreport",                 element: <LoginReport />,               permissionKey: "Login Report" },
  { path: "/adminreport",                 element: <AdminReport />,               permissionKey: "Admin Report" },
  { path: "/plan",                        element: <AddPlan />,                   permissionKey: "AddPlan" },
  { path: "/buyerplan",                   element: <BuyerPlan />,                 permissionKey: "BuyerPlan" },
  { path: "/statistics",                  element: <Statistics />,                permissionKey: "Statistics" },
  { path: "/admin-notification",          element: <AdminNotification />,         permissionKey: "Admin Notification" },
  { path: "/add-car",                     element: <AddCar />,                    permissionKey: "Add Property" },
  { path: "/adminlog",                    element: <AdminLog />,                  permissionKey: "AdminLog" },
  { path: "/agent-car",                   element: <AgentCar />,                  permissionKey: "Agent Property" },
  { path: "/all-car",                     element: <AllCar />,                    permissionKey: null },
  { path: "/approved-car",               element: <ApprovedCar />,               permissionKey: "Approved Property" },
  { path: "/assist-pay-later",            element: <AssistPayLater />,            permissionKey: null },
  { path: "/assist-payu-money",           element: <AssistPayU />,               permissionKey: null },
  { path: "/assist-subscriber",           element: <AssistSubscriber />,          permissionKey: "Tenant Assist Payment Daily" },
  { path: "/ba-free-bills",              element: <BaFreeBills />,               permissionKey: "BaFree Bills" },
  { path: "/ba-loan-lead",               element: <BaLoanLead />,                permissionKey: null },
  { path: "/buyerlist-interest",          element: <BuyerListInterest />,         permissionKey: "BuyerList Interest" },
  { path: "/buyers-assistant",            element: <BuyersAssistant />,           permissionKey: null },
  { path: "/buyers-contacted",            element: <BuyersContacted />,           permissionKey: null },
  { path: "/buyers-follow-ups",           element: <BuyersFollowUps />,           permissionKey: "Buyer FllowUp" },
  { path: "/buyers-shortlisted",          element: <BuyersShortlized />,          permissionKey: null },
  { path: "/buyers-statics",              element: <BuyersStatics />,             permissionKey: "BuyerStatics" },
  { path: "/callback-form",              element: <CallBackForm />,               permissionKey: null },
  { path: "/car-follow-ups",             element: <CarFollowUps />,               permissionKey: "Property FllowUp" },
  { path: "/car-make",                   element: <CarMake />,                    permissionKey: null },
  { path: "/carstatics",                 element: <CarStatics />,                 permissionKey: "Property Statics" },
  { path: "/city",                       element: <City />,                       permissionKey: "City" },
  { path: "/customer-car",               element: <CustomerCar />,               permissionKey: "Customer Care" },
  { path: "/daily-usage",                element: <DailyUsage />,                 permissionKey: "Daily Usage" },
  { path: "/dealer-car",                 element: <DealerCar />,                  permissionKey: "Owner Property" },
  { path: "/district",                   element: <District />,                   permissionKey: "District" },
  { path: "/downloadleads",              element: <DownloadLeads />,              permissionKey: null },
  { path: "/expire-car",                 element: <ExpireCar />,                  permissionKey: "Expire Property" },
  { path: "/expired-assistant",          element: <ExpiredAssistant />,           permissionKey: "Expired Assistant" },
  { path: "/free-bills",                 element: <FreeBills />,                  permissionKey: "Free Bills" },
  { path: "/free-car",                   element: <FreeCar />,                    permissionKey: "Free Property" },
  { path: "/free-user-lead",             element: <FreeUserLead />,               permissionKey: "FreeUser Lead" },
  { path: "/help",                       element: <Help />,                       permissionKey: null },
  { path: "/help-loan-lead",             element: <HelpLoanLead />,               permissionKey: "Help LoanLead" },
  { path: "/insurance-lead",             element: <InsuranceLead />,              permissionKey: null },
  { path: "/last-viewed-property",       element: <LastViewedCar />,              permissionKey: "LastViewed Property" },
  { path: "/limits",                     element: <Limits />,                     permissionKey: "Limits" },
  { path: "/matched-buyer",              element: <MatchedBuyer />,               permissionKey: null },
  { path: "/mobile-view-lead",           element: <MobileViewLead />,             permissionKey: null },
  { path: "/my-account",                 element: <MyAccount />,                  permissionKey: "MyAccount" },
  { path: "/new-car-lead",               element: <NewCarLead />,                 permissionKey: "New Property Lead" },
  { path: "/offers-raised",              element: <OfferesRaised />,              permissionKey: "Offers Raised Table" },
  { path: "/paid-bills",                 element: <PaidBills />,                  permissionKey: "Paid Bills" },
  { path: "/paid-car",                   element: <PaidCar />,                    permissionKey: "Paid Property" },
  { path: "/pay-later",                  element: <PayLater />,                   permissionKey: null },
  { path: "/paymenttype",                element: <PaymentType />,                permissionKey: "Payment Type" },
  { path: "/pay-u-money",                element: <PayUMoney />,                  permissionKey: null },
  { path: "/pending-car",                element: <PendingCar />,                 permissionKey: "Pending Property" },
  { path: "/photo-request",              element: <PhotoRequest />,               permissionKey: "PhotoRequest Table" },
  { path: "/profile",                    element: <Profile />,                    permissionKey: "Profile" },
  { path: "/puc-banner",                 element: <PucBanner />,                  permissionKey: null },
  { path: "/puc-car",                    element: <PucCar />,                     permissionKey: "RP All Property" },
  { path: "/puc-number",                 element: <PucNumber />,                  permissionKey: null },
  { path: "/received-interest",          element: <RecievedInterest />,           permissionKey: null },
  { path: "/removed-car",               element: <RemovedCar />,                 permissionKey: "Removed Property" },
  { path: "/reported-cars",              element: <ReportedCar />,                permissionKey: null },
  { path: "/searchcar",                  element: <SearchCar />,                  permissionKey: "Search Property" },
  { path: "/searched-data",              element: <SearchedData />,               permissionKey: "Search Data" },
  { path: "/daily-report-rent",          element: <Subscriber />,                 permissionKey: "Rent Property Daily Report" },
  { path: "/transfer-assistant",         element: <TransferAssistant />,          permissionKey: "Transfer Assistant" },
  { path: "/transfer-follow-ups",        element: <TRansferFollowUps />,          permissionKey: "Transfer FllowUps" },
  { path: "/tuc-banner",                 element: <TucBanner />,                  permissionKey: null },
  { path: "/usage-statics",              element: <UsageStatics />,               permissionKey: "Usage Statics" },
  { path: "/user-rolls",                 element: <UserRolls />,                  permissionKey: "User Roles" },
  { path: "/users",                      element: <UserList />,                   permissionKey: "Users" },
  { path: "/user-log",                   element: <UsersLog />,                   permissionKey: "Users Log" },
  { path: "/office",                     element: <OfficeList />,                 permissionKey: "Office" },
  { path: "/rolls",                      element: <Roll />,                       permissionKey: "Roll" },
  { path: "/car-model",                  element: <CarModel />,                   permissionKey: null },
  { path: "/pending-assistant",          element: <PendingAssistant />,           permissionKey: "Pending Assistant" },
  { path: "/buyers-list-interest-tried", element: <BuyerListInterestTriede />,    permissionKey: null },
  { path: "/ba-paid-bills",             element: <BaPaidBill />,                 permissionKey: "BaPaid Bill" },
  { path: "/preapproved-car",            element: <PreApprovedCar />,             permissionKey: "PreApproved Property" },
  { path: "/area",                       element: <Area />,                       permissionKey: "Area" },
  { path: "/state",                      element: <State />,                      permissionKey: "State" },
  { path: "/edit-property",             element: <EditProperty />,               permissionKey: null },
  { path: "/detail",                    element: <Detail />,                     permissionKey: null },
  { path: "/set-property",              element: <AdminSetForm />,               permissionKey: "AdminSetForm" },
  { path: "/interest-table",            element: <InterestTables />,             permissionKey: "Interest Table" },
  { path: "/favorite-table",            element: <FavoriteTables />,             permissionKey: "ShortList Favorite Table" },
  { path: "/needhelp-table",            element: <NeedHelpTables />,             permissionKey: "Help Request Table" },
  { path: "/contact-table",             element: <ContactTables />,              permissionKey: "Contact Table" },
  { path: "/soldout-table",             element: <SoldOutTables />,              permissionKey: "SoldOut Table" },
  { path: "/report-property-table",     element: <ReportPropertyTables />,       permissionKey: "Report Property Table" },
  { path: "/property-list",             element: <AddPropertyList />,            permissionKey: "Manage Property" },
  { path: "/get-buyer-assistance",       element: <GetBuyerAssistance />,         permissionKey: "Get Buyer Assistances" },
  { path: "/text-editor",               element: <TextEditor />,                  permissionKey: "Text Editer" },
  { path: "/get-matched-properties",    element: <MatchedPropertyTable />,       permissionKey: "Matched Property Table" },
  { path: "/matched-property-list",     element: <MatchedList />,                permissionKey: null },
  { path: "/feature-property",          element: <FeaturedProperty />,           permissionKey: "Feature Property" },
  { path: "/viewed-property",           element: <ViewedProperties />,           permissionKey: "Viewed Property Table" },
  { path: "/notification-send",         element: <NotificationForm />,           permissionKey: "Notification Send" },
  { path: "/profile-table",             element: <ProfileTable />,               permissionKey: "Get User Profile" },
  { path: "/user-call-list",            element: <GetUserCalledList />,           permissionKey: null },
  { path: "/deleted-properties",        element: <DeletedProperties />,          permissionKey: "Delete Properties" },
  { path: "/py-properties",             element: <PyProperty />,                  permissionKey: "Py Property" },
  { path: "/featured-properties",       element: <FeaturedProperty />,           permissionKey: "Feature Property" },
  { path: "/admin-views",               element: <UserViewsTable />,             permissionKey: "Admin Views Table" },
  { path: "/create-followup",           element: <CreateFollowUp />,             permissionKey: null },
  { path: "/favorite-removed",          element: <FavoriteRemoved />,            permissionKey: "ShortList FavoriteRemoved Table" },
  { path: "/developer-property",        element: <DeveloperProperty />,          permissionKey: "Developer Property" },
  { path: "/followup-list",             element: <FollowUpGetTable />,            permissionKey: "All Property FollowUp" },
  { path: "/create-bill",               element: <CreateBill />,                 permissionKey: null },
  { path: "/bill-datas",                element: <GetBillDatas />,               permissionKey: null },
  { path: "/add-buyer-assistance",      element: <AddBuyerAssistance />,         permissionKey: "Add Buyer Assistance" },
  { path: "/view-buyer-assistance",     element: <ViewBuyerAssistance />,        permissionKey: null },
  { path: "/edit-bill/:rentId",         element: <EditBill />,                   permissionKey: null },
  { path: "/postby-property",           element: <PostedByProperty />,           permissionKey: "PostBy Property" },
  { path: "/promotor-property",         element: <PromotorProperty />,           permissionKey: "Promotor Property" },
  { path: "/active-buyer-assistant",    element: <BuyerAssistanceActive />,      permissionKey: "Buyer Active Assistant" },
  { path: "/set-rentId",                element: <SetPPCID />,                   permissionKey: "Set RentId" },
  { path: "/edit-buyer-assistance",     element: <EditBuyerAssistance />,        permissionKey: null },
  { path: "/fetch-all-address",         element: <AddressTable />,               permissionKey: "Fetch All Address" },
  { path: "/create-followup-buyer",     element: <CreateBuyerFollowUp />,        permissionKey: null },
  { path: "/followup-list-buyer",       element: <FollowUpBuyerGetTable />,      permissionKey: null },
  { path: "/all-property-statics",      element: <GetAllPropertyStatics />,      permissionKey: null },
  { path: "/all-buyer-statics",         element: <GetAllBuyerStatics />,         permissionKey: null },
  { path: "/all-usage-statics",         element: <GetAllUsageStatics />,         permissionKey: null },
  { path: "/without-property-user",     element: <WithOutPropertyUser />,        permissionKey: "Without Property User" },
  { path: "/all-views-datas",           element: <AllViewsDatas />,              permissionKey: "All Views Datas" },
  { path: "/without-all-statics",       element: <WithOutUserStatics />,         permissionKey: "Without All Statics" },
  { path: "/without-30-days-user",      element: <WithoutProperty30DaysUser />,  permissionKey: "Without 30 Days User" },
  { path: "/all-user-datas",            element: <WithUsersTable />,             permissionKey: null },
  { path: "/login-direct-user",         element: <LoginDirectVerifyUser />,      permissionKey: "Login Verify Directly" },
  { path: "/upload-images-groom",       element: <UpLoadImagesGroom />,          permissionKey: "Upload Groom" },
  { path: "/upload-images-bride",       element: <UpLoadImagesBride />,          permissionKey: "Upload Bride" },
  { path: "/upload-images-ads",         element: <UpLoadImagesAds />,            permissionKey: "Upload Ads Images" },
  { path: "/upload-images-ads-detail",  element: <UpLoadDetailAds />,            permissionKey: "Upload Detail Ads Images" },
  { path: "/rentid-statics",            element: <RentIdStatics />,              permissionKey: "RentId Statics" },
  { path: "/logout-direct-user",        element: <DirectLogoutUsers />,          permissionKey: null },
  { path: "/remove-plan-phone",         element: <RemovePlanPhoneNumber />,      permissionKey: null },
  { path: "/payment-failed",            element: <PaymentPaidFailed />,          permissionKey: "Payment Failed" },
  { path: "/payment-success",           element: <PaymentPaidSuccess />,         permissionKey: "Payment Success" },
  { path: "/payment-paynow",            element: <PaymentPaidPayNow />,          permissionKey: "Payment PayNow" },
  { path: "/payment-paylater",          element: <PaymentPaidPayLater />,        permissionKey: "Payment PayLater" },
  { path: "/payment-failed-buyer",      element: <PayuBuyerPayFailed />,         permissionKey: "Buyer Payment Failed" },
  { path: "/payment-success-buyer",     element: <PayuBuyerPaid />,              permissionKey: "Buyer Payment Success" },
  { path: "/payment-paynow-buyer",      element: <PayuBuyerPaynow />,            permissionKey: "Buyer Payment PayNow" },
  { path: "/payment-paylater-buyer",    element: <PayuBuyerPaylater />,          permissionKey: "Buyer Payment PayLater" },
  { path: "/all-bills",                 element: <AllBillsTable />,              permissionKey: "All Bills" },
  { path: "/buyer-create-bill",         element: <CreateBuyerBill />,            permissionKey: null },
  { path: "/detail-rent-assis",         element: <DetailRentAssistance />,       permissionKey: null },
  { path: "/edit-buyer-bill/:ba_id",    element: <EditBuyerBill />,              permissionKey: null },
  { path: "/all-buyer-bills",           element: <AllBuyerBills />,              permissionKey: "All Buyer Bills" },
  { path: "/groom-click-datas",         element: <GroomImageClickTable />,       permissionKey: "Groom Click Datas" },
  { path: "/bride-click-datas",         element: <BrideImageClickTable />,       permissionKey: "Bride Click Datas" },
  { path: "/login-user-datas",          element: <LoginUserDatas />,             permissionKey: "Login Users Datas" },
  { path: "/separate-login-user",       element: <LoginSeparateUser />,          permissionKey: "Login Separate User" },
  { path: "/apply-on-demand",           element: <SetOnDemandPrice />,           permissionKey: "Apply OnDemad Property" },
  { path: "/called-list-datas",         element: <CalledListDatas />,            permissionKey: "Called List" },
  { path: "/get-all-property-datas",    element: <PropertyStatusTable />,        permissionKey: "Get All Property Datas" },
  { path: "/friend-property",           element: <FriendProperty />,             permissionKey: null },
  { path: "/tanent-property",           element: <TanentProperty />,             permissionKey: null },
  { path: "/contact-usage",             element: <ContactUsage />,               permissionKey: "Contact Usage" },
  { path: "/set-property-message",      element: <SetPropertyMessage />,         permissionKey: "Set Property Message" },
  { path: "/get-all-buyerlist-viewed",  element: <BuyerAssistViewsTable />,      permissionKey: "Buyer Assistant Viewed" },
  { path: "/with-all-user",             element: <WithUsersTable />,             permissionKey: null },
  { path: "/sale-property",             element: <SalePropertyViewsUser />,      permissionKey: null },
  { path: "/get-all-address-request",   element: <AddressRequestsTable />,       permissionKey: "Address Request" },
  { path: "/detail-daily-report",       element: <DetailDailyReport />,          permissionKey: "Rent Detail DailyReport" },
  { path: "/property-payment-daily-report", element: <PropertyPaymentDailyReport />, permissionKey: "Rent Property Payment DailyReport" },
  { path: "/contact-form-datas",        element: <GetAllContactFormDatas />,     permissionKey: "Contact Form Datas" },
  { path: "/owner-tenant-menu",         element: <OwnerTenantMenu />,            permissionKey: null },
  // { path: "/add-property-marketing",    element: <AddPropertyFormMarketing />,   permissionKey: "Add Property Marketing" },
  { path: "/removed-tenant",            element: <RemovedTenant />,              permissionKey: "Removed Tenant" },
  { path: "/exclusive-location",        element: <ExclusiveLocation />,          permissionKey: "Exclusive Location" },
  { path: "/bulk-whatsapp",             element: <BulkWhatsapp />,               permissionKey: "Bulk Whatsapp" },
  { path: "/single-send-whatsapp",      element: <SingleSendMessage />,          permissionKey: "Single Whatsapp" },
  { path: "/search-pincode",            element: <SearchPincode />,              permissionKey: "Search Pincode" },
];

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const adminName = localStorage.getItem('adminName');
    const adminRole = localStorage.getItem('adminRole');
    const otpVerified = localStorage.getItem('otpVerified');

    if (!isAuthenticated || isAuthenticated !== 'true' ||
        !adminName || !adminRole ||
        !otpVerified || otpVerified !== 'true') {
      localStorage.clear();
      window.location.href = '/process/admin';
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="p-2" style={{ background: "#F0F2F5" }}>
      <div className="dashboard-container">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="main-content" style={{ background: "#F0F2F5" }}>
          <Navbar toggleSidebar={toggleSidebar} />
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute
                    element={route.element}
                    permissionKey={route.permissionKey}
                  />
                }
              />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;