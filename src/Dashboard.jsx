import { useSelector } from 'react-redux';
import { useEffect, useState, lazy, Suspense } from 'react';
import moment from 'moment';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from "./Navbar";

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <div>Loading...</div>
  </div>
);

// Lazy load all components to reduce build memory usage
const LoginReport = lazy(() => import("./LoginReport"));
const AdminReport = lazy(() => import("./AdminReport"));
const Plan = lazy(() => import("./Plan"));
const Statistics = lazy(() => import("./Statistics"));
const AdminNotification = lazy(() => import("./AdminNotification"));
const AddCar = lazy(() => import("./AddCar"));
const AdminLog = lazy(() => import("./AdminLog"));
const AgentCar = lazy(() => import("./AgentCar"));
const AllCar = lazy(() => import("./AllCar"));
const ApprovedCar = lazy(() => import("./ApprovedCar"));
const Area = lazy(() => import("./Places/Area"));
const AssistPayLater = lazy(() => import("./AssistPayLater"));
const AssistPayU = lazy(() => import("./AssistPayU"));
const AssistSubscriber = lazy(() => import("./AssistSubscriber"));
const BaFreeBills = lazy(() => import("./BaFreeBills"));
const BaLoanLead = lazy(() => import("./BaLoanLead"));
const BuyerListInterestTriede = lazy(() => import("./BuyerListInterestTriede"));
const BuyerListInterest = lazy(() => import("./BuyerListInteres"));
const BuyersAssistant = lazy(() => import("./BuyersAssistant"));
const BuyersContacted = lazy(() => import("./BuyersContacted"));
const BuyersFollowUps = lazy(() => import("./BuyersFollowUps"));
const BuyersShortlized = lazy(() => import("./BuyersShortlized"));
const BuyersStatics = lazy(() => import("./BuyersStatics"));
const CallBackForm = lazy(() => import("./CallBackForm"));
const CarFollowUps = lazy(() => import("./CarFollowUps"));
const CarMake = lazy(() => import("./CarMake"));
const CarStatics = lazy(() => import("./CarStatics"));
const City = lazy(() => import("./Places/City"));
const CustomerCar = lazy(() => import("./CustomerCar"));
const DailyUsage = lazy(() => import("./DailyUsage"));
const DealerCar = lazy(() => import("./DealerCar"));
const District = lazy(() => import("./Places/District"));
const DownloadLeads = lazy(() => import("./DownloadLeads"));
const ExpireCar = lazy(() => import("./ExpireCar"));
const ExpiredAssistant = lazy(() => import("./ExpiredAssistant"));
const FreeBills = lazy(() => import("./FreeBills"));
const FreeCar = lazy(() => import("./FreeCar"));
const FreeUserLead = lazy(() => import("./FreeUserLead"));
const Help = lazy(() => import("./Help"));
const HelpLoanLead = lazy(() => import("./HelpLoanLead"));
const InsuranceLead = lazy(() => import("./InsuranceLead"));
const LastViewedCar = lazy(() => import("./LastViewedCar"));
const Limits = lazy(() => import("./Limits"));
const MatchedBuyer = lazy(() => import("./MatchedBuyer"));
const MobileViewLead = lazy(() => import("./MobileViewLead"));
const MyAccount = lazy(() => import("./MyAccount"));
const NewCarLead = lazy(() => import("./NewCarLead"));
const OfferesRaised = lazy(() => import("./OfferesRaised"));
const PaidBills = lazy(() => import("./PaidBills"));
const PaidCar = lazy(() => import("./PaidCar"));
const PayLater = lazy(() => import("./PayLater"));
const PaymentType = lazy(() => import("./PaymentType"));
const PayUMoney = lazy(() => import("./PayUMoney"));
const PendingCar = lazy(() => import("./PendingCar"));
const PhotoRequest = lazy(() => import("./PhotoRequest"));
const PreApprovedCar = lazy(() => import("./PreApprovedCar"));
const Profile = lazy(() => import("./Profile"));
const PucBanner = lazy(() => import("./PucBanner"));
const PucCar = lazy(() => import("./PucCar"));
const PucNumber = lazy(() => import("./PucNumber"));
const RecievedInterest = lazy(() => import("./RecievedInterest"));
const RemovedCar = lazy(() => import("./RemovedCar"));
const ReportedCar = lazy(() => import("./ReportedCar"));
const SearchCar = lazy(() => import("./SearchCar"));
const SearchedData = lazy(() => import("./SearchedData"));
const State = lazy(() => import("./Places/State"));
const Subscriber = lazy(() => import("./Subscriber"));
const TransferAssistant = lazy(() => import("./TransferAssistant"));
const TRansferFollowUps = lazy(() => import("./TRansferFollowUps"));
const TucBanner = lazy(() => import("./TucBanner"));
const UsageStatics = lazy(() => import("./UsageStatics"));
const UserRolls = lazy(() => import("./UserRolls"));
const UsersLog = lazy(() => import("./UsersLog"));
const Roll = lazy(() => import("./Roll"));
const CarModel = lazy(() => import("./CarModel"));
const UserList = lazy(() => import("./Users/UserList"));
const OfficeList = lazy(() => import("./Office/OfficeList"));
const BuyerPlan = lazy(() => import("./BuyerPlans/BuyerPlan"));
const PendingAssistant = lazy(() => import("./PendingAssistant"));
const BaPaidBill = lazy(() => import("./BaPaidBill"));
const AddPlan = lazy(() => import('./PricingPlan/AddPlan'));
const EditProperty = lazy(() => import('./EditProperty'));
const Detail = lazy(() => import('./Detail'));
const AdminSetForm = lazy(() => import('./DataAddAdmin/AdminSetForm'));
const InterestTables = lazy(() => import('./Detail/InterestTables'));
const AddPropertyList = lazy(() => import('./AddPropertyList'));
const FavoriteTables = lazy(() => import('./Detail/FavoriteTables'));
const ContactTables = lazy(() => import('./Detail/ContactTables'));
const SoldOutTables = lazy(() => import('./Detail/SoldOutTables'));
const ReportPropertyTables = lazy(() => import('./Detail/ReportPropertyTables'));
const NeedHelpTables = lazy(() => import('./Detail/NeedHelpTables'));
const FavoriteRemoved = lazy(() => import('./Detail/ShortListRemovedTable'));
const GetBuyerAssistance = lazy(() => import('./GetBuyerAssistance'));
const TextEditor = lazy(() => import('./TextEditer'));
const MatchedPropertyTable = lazy(() => import('./Detail/MatchedPropertyTable'));
const MatchedList = lazy(() => import('./Detail/MatchedList'));
const FeaturedProperty = lazy(() => import('./FeaturedProperty'));
const ViewedProperties = lazy(() => import('./Detail/ViewedProperty'));
const NotificationForm = lazy(() => import('./NotificationSend'));
const ProfileTable = lazy(() => import('./GetUserProfile'));
const GetUserCalledList = lazy(() => import('./GetUserCalledList'));
const DeletedProperties = lazy(() => import('./DeletedProperties'));
const PyProperty = lazy(() => import('./Detail/PyProperty'));
const UserViewsTable = lazy(() => import('./AdminViewsTable'));
const CreateFollowUp = lazy(() => import('./CreateFollowUp'));
const FollowUpGetTable = lazy(() => import('./FollowUpGetTable'));
const DeveloperProperty = lazy(() => import('./DeveloperProperty'));
const CreateBill = lazy(() => import('./CreateBill'));
const GetBillDatas = lazy(() => import('./GetBillDatas'));
const AddBuyerAssistance = lazy(() => import('./AddBuyerAssistance'));
const ViewBuyerAssistance = lazy(() => import('./ViewBuyerAssistance'));
const EditBill = lazy(() => import('./EditBill'));
const PostedByProperty = lazy(() => import('./PostedByProperty'));
const PromotorProperty = lazy(() => import('./PromotorProperty'));
const BuyerAssistanceActive = lazy(() => import('./BuyerAssistanceActive'));
const SetPPCID = lazy(() => import('./SetPPCID'));
const EditBuyerAssistance = lazy(() => import('./EditBuyerAssistance'));
const AddressTable = lazy(() => import('./AddressTable'));
const CreateBuyerFollowUp = lazy(() => import('./CreateBuyerFollowUp'));
const FollowUpBuyerGetTable = lazy(() => import('./FollowUpBuyerGetTable'));
const GetAllPropertyStatics = lazy(() => import('./GetAllPropertyStatics'));
const GetAllBuyerStatics = lazy(() => import('./GetAllBuyerStatics'));
const GetAllUsageStatics = lazy(() => import('./GetAllUsageStatics'));
const WithOutPropertyUser = lazy(() => import('./WithOutPropertyUser'));
const AllViewsDatas = lazy(() => import('./AllViewsDatas'));
const WithOutUserStatics = lazy(() => import('./WithOutStatics'));
const WithoutProperty30DaysUser = lazy(() => import('./Without30days'));
const WithUsersTable = lazy(() => import('./WithAllUser'));
const LoginDirectVerifyUser = lazy(() => import('./LoginDirectVerifyUser'));
const UpLoadImagesGroom = lazy(() => import('./UpLoadImagesGroom'));
const UpLoadImagesBride = lazy(() => import('./UploadImagesBride'));
const DirectLogoutUsers = lazy(() => import('./DirectLogoutUsers'));
const RemovePlanPhoneNumber = lazy(() => import('./RemovePlanPhoneNumber'));
const PaymentPaidFailed = lazy(() => import('./PayuDatas/PaymentPaidFailed'));
const PaymentPaidSuccess = lazy(() => import('./PayuDatas/PaymentPaidSuccess'));
const PaymentPaidPayNow = lazy(() => import('./PayuDatas/PaymentPaidPayNow'));
const PaymentPaidPayLater = lazy(() => import('./PayuDatas/PaymentPaidPayLater'));
const PayuBuyerPaid = lazy(() => import('./PayuBuyerPayments/PayuBuyerPaid'));
const PayuBuyerPayFailed = lazy(() => import('./PayuBuyerPayments/PayuBuyerPayFailed'));
const PayuBuyerPaynow = lazy(() => import('./PayuBuyerPayments/PayuBuyerPaynow'));
const PayuBuyerPaylater = lazy(() => import('./PayuBuyerPayments/PayuBuyerPaylater'));
const AllBillsTable = lazy(() => import('./AllBills'));
const CreateBuyerBill = lazy(() => import('./CreateBuyerBill'));
const EditBuyerBill = lazy(() => import('./EditBuyerBill'));
const AllBuyerBills = lazy(() => import('./AllBuyerBills'));
const GroomImageClickTable = lazy(() => import('./UserClickGroomImages'));
const BrideImageClickTable = lazy(() => import('./UserClickBrideImages'));
const LoginUserDatas = lazy(() => import('./LoginUsersDatas'));
const LoginSeparateUser = lazy(() => import('./LoginSeparateUser'));
const SetOnDemandPrice = lazy(() => import('./ApplyOnDemand'));
const DetailRentAssistance = lazy(() => import('./RentAssistanceDetail'));
const CalledListDatas = lazy(() => import('./Detail/CalledListDatas'));
const PropertyStatusTable = lazy(() => import('./ShowAllProperties'));
const FriendProperty = lazy(() => import('./FriendProperty'));
const TanentProperty = lazy(() => import('./TanentProperty'));
const ContactUsage = lazy(() => import('./ContactUsage'));
const SetPropertyMessage = lazy(() => import('./SetPropertyMessage'));
const BuyerAssistViewsTable = lazy(() => import('./BuyerListUserViewed'));
const SalePropertyViewsUser = lazy(() => import('./SalePropertyViewsUser'));
const AddressRequestsTable = lazy(() => import('./AllAddressRequests'));
const UpLoadImagesAds = lazy(() => import('./UploadAdsImage'));
const UpLoadDetailAds = lazy(() => import('./UploadDetailAds'));
const RentIdStatics = lazy(() => import('./RentIdStatics'));
const DetailDailyReport = lazy(() => import('./DetailDailyReport'));
const PropertyPaymentDailyReport = lazy(() => import('./PropertyPaymentDailyReport'));
const GetAllContactFormDatas = lazy(() => import('./GetAllContactFormDatas'));


const routes = [
  { path: "/loginreport", element: <LoginReport /> }, 
  { path: "/adminreport", element: <AdminReport /> },
  { path: "/plan", element: <AddPlan /> },
  { path: "/buyerplan", element: <BuyerPlan /> },
  { path: "/statistics", element: <Statistics /> },
  { path: "/admin-notification", element: <AdminNotification /> },
  { path: "/add-car", element: <AddCar /> },
  { path: "/adminlog", element: <AdminLog /> },
  { path: "/agent-car", element: <AgentCar /> },
  { path: "/all-car", element: <AllCar /> },
  { path: "/approved-car", element: <ApprovedCar /> },
  { path: "/assist-pay-later", element: <AssistPayLater /> },
  { path: "/assist-payu-money", element: <AssistPayU /> },
  { path: "/assist-subscriber", element: <AssistSubscriber /> },
  { path: "/ba-free-bills", element: <BaFreeBills /> },
  { path: "/ba-loan-lead", element: <BaLoanLead /> },
  { path: "/buyerlist-interest", element: <BuyerListInterest /> },
  { path: "/buyers-assistant", element: <BuyersAssistant /> },
  { path: "/buyers-contacted", element: <BuyersContacted /> },
  { path: "/buyers-follow-ups", element: <BuyersFollowUps /> },
  { path: "/buyers-shortlisted", element: <BuyersShortlized /> },
  { path: "/buyers-statics", element: <BuyersStatics /> },
  { path: "/callback-form", element: <CallBackForm /> },
  { path: "/car-follow-ups", element: <CarFollowUps /> },
  { path: "/car-make", element: <CarMake /> },
  { path: "/carstatics", element: <CarStatics /> },
  { path: "/city", element: <City /> },
  { path: "/customer-car", element: <CustomerCar /> },
  { path: "/daily-usage", element: <DailyUsage /> },
  { path: "/dealer-car", element: <DealerCar /> },
  { path: "/district", element: <District /> },
  { path: "/downloadleads", element: <DownloadLeads /> },
  { path: "/expire-car", element: <ExpireCar /> },
  { path: "/expired-assistant", element: <ExpiredAssistant /> },
  { path: "/free-bills", element: <FreeBills /> },
  { path: "/free-car", element: <FreeCar /> },
  { path: "/free-user-lead", element: <FreeUserLead /> },
  { path: "/help", element: <Help /> },
  { path: "/help-loan-lead", element: <HelpLoanLead /> },
  { path: "/insurance-lead", element: <InsuranceLead /> },
  { path: "/last-viewed-property", element: <LastViewedCar /> },
  { path: "/limits", element: <Limits /> },
  { path: "/matched-buyer", element: <MatchedBuyer /> },
  { path: "/mobile-view-lead", element: <MobileViewLead /> },
  { path: "/my-account", element: <MyAccount /> },
  { path: "/new-car-lead", element: <NewCarLead /> },
  { path: "/offers-raised", element: <OfferesRaised /> },
  { path: "/paid-bills", element: <PaidBills /> },
  { path: "/paid-car", element: <PaidCar /> },
  { path: "/pay-later", element: <PayLater /> },
  { path: "/paymenttype", element: <PaymentType /> },
  { path: "/pay-u-money", element: <PayUMoney /> },
  { path: "/pending-car", element: <PendingCar /> },
  { path: "/photo-request", element: <PhotoRequest /> },
  { path: "/profile", element: <Profile /> },
  { path: "/puc-banner", element: <PucBanner /> },
  { path: "/puc-car", element: <PucCar /> },
  { path: "/puc-number", element: <PucNumber /> },
  { path: "/received-interest", element: <RecievedInterest /> },
  { path: "/removed-car", element: <RemovedCar /> },
  { path: "/reported-cars", element: <ReportedCar /> },
  { path: "/searchcar", element: <SearchCar /> },
  { path: "/searched-data", element: <SearchedData /> },
  { path: "/daily-report-rent", element: <Subscriber /> },
  { path: "/transfer-assistant", element: <TransferAssistant /> },
  { path: "/transfer-follow-ups", element: <TRansferFollowUps /> },
  { path: "/tuc-banner", element: <TucBanner /> },
  { path: "/usage-statics", element: <UsageStatics /> },
  { path: "/user-rolls", element: <UserRolls /> },
  { path: "/users", element: <UserList /> },
  { path: "/user-log", element: <UsersLog /> },
  { path: "/office", element: <OfficeList /> },
  { path: "/rolls", element: <Roll /> },
  { path: "/car-model", element: <CarModel /> },
  { path: "/pending-assistant", element: <PendingAssistant /> },
  { path: "/buyers-list-interest-tried", element: <BuyerListInterestTriede /> },
  { path: "/ba-paid-bills", element: <BaPaidBill /> },
  { path: "/preapproved-car", element: <PreApprovedCar /> },
  { path: "/area", element: <Area /> },
  { path: "/state", element: <State /> },
  { path: "/edit-property", element: <EditProperty /> },
  { path: "/detail", element: <Detail /> },
  { path: "/set-property", element: <AdminSetForm /> },
  { path: "/interest-table", element: <InterestTables /> },
  { path: "/favorite-table", element: <FavoriteTables /> },
  { path: "/needhelp-table", element: <NeedHelpTables /> },
  { path: "/contact-table", element: <ContactTables /> },
  { path: "/soldout-table", element: <SoldOutTables /> },
  { path: "/report-property-table", element: <ReportPropertyTables /> },
  { path: "/property-list", element: <AddPropertyList /> },
  { path: "/get-buyer-assistance", element: <GetBuyerAssistance /> },
  { path: "/text-editor", element: <TextEditor /> },
  { path: "/get-matched-properties", element: <MatchedPropertyTable /> },
  { path: "/matched-property-list", element: <MatchedList /> },
  { path: "/feature-property", element: <FeaturedProperty /> },
  { path: "/viewed-property", element: <ViewedProperties /> },
  { path: "/notification-send", element: <NotificationForm /> },
  { path: "/profile-table", element: <ProfileTable /> },
  { path: "/user-call-list", element: <GetUserCalledList /> },
  { path: "/deleted-properties", element: <DeletedProperties /> },
  { path: "/py-properties", element: <PyProperty /> },
  { path: "/featured-properties", element: <FeaturedProperty /> },
  { path: "/admin-views", element: <UserViewsTable /> },
  { path: "/create-followup", element: <CreateFollowUp /> },
  { path: "/favorite-removed", element: <FavoriteRemoved /> },
  { path: "/developer-property", element: <DeveloperProperty /> },
  { path: "/followup-list", element: <FollowUpGetTable /> },
  { path: "/create-bill", element: <CreateBill /> },
  { path: "/bill-datas", element: <GetBillDatas /> },
  { path: "/add-buyer-assistance", element: <AddBuyerAssistance /> },
  { path: "/view-buyer-assistance", element: <ViewBuyerAssistance /> },
  { path: "/edit-bill/:rentId", element: <EditBill /> },
  { path: "/postby-property", element: <PostedByProperty /> },
  { path: "/promotor-property", element: <PromotorProperty /> },
  { path: "/active-buyer-assistant", element: <BuyerAssistanceActive /> },
  { path: "/set-rentId", element: <SetPPCID /> },
  { path: "/edit-buyer-assistance", element: <EditBuyerAssistance /> },
  { path: "/fetch-all-address", element: <AddressTable /> },
  { path: "/create-followup-buyer", element: <CreateBuyerFollowUp /> },
  { path: "/followup-list-buyer", element: <FollowUpBuyerGetTable /> },
  { path: "/all-property-statics", element: <GetAllPropertyStatics /> },
  { path: "/all-buyer-statics", element: <GetAllBuyerStatics /> },
  { path: "/all-usage-statics", element: <GetAllUsageStatics /> },
  { path: "/without-property-user", element: <WithOutPropertyUser /> },
  { path: "/all-views-datas", element: <AllViewsDatas /> },
  { path: "/without-all-statics", element: <WithOutUserStatics /> },
  { path: "/without-30-days-user", element: <WithoutProperty30DaysUser /> },
  { path: "/all-user-datas", element: <WithUsersTable /> },
  { path: "/login-direct-user", element: <LoginDirectVerifyUser /> },
  { path: "/upload-images-groom", element: <UpLoadImagesGroom /> },
  { path: "/upload-images-bride", element: <UpLoadImagesBride /> },
  { path: "/upload-images-ads", element: <UpLoadImagesAds /> },
  { path: "/upload-images-ads-detail", element: <UpLoadDetailAds /> },
  { path: "/rentid-statics", element: <RentIdStatics /> },
  { path: "/logout-direct-user", element: <DirectLogoutUsers /> },
  { path: "/remove-plan-phone", element: <RemovePlanPhoneNumber /> },
  { path: "/payment-failed", element: <PaymentPaidFailed /> },
  { path: "/payment-success", element: <PaymentPaidSuccess /> },
  { path: "/payment-paynow", element: <PaymentPaidPayNow /> },
  { path: "/payment-paylater", element: <PaymentPaidPayLater /> },
  { path: "/payment-failed-buyer", element: <PayuBuyerPayFailed /> },
  { path: "/payment-success-buyer", element: <PayuBuyerPaid /> },
  { path: "/payment-paynow-buyer", element: <PayuBuyerPaynow /> },
  { path: "/payment-paylater-buyer", element: <PayuBuyerPaylater /> },
  { path: "/all-bills", element: <AllBillsTable /> },
  { path: "/buyer-create-bill", element: <CreateBuyerBill /> },
  { path: "/detail-rent-assis", element: <DetailRentAssistance /> },
  { path: "/edit-buyer-bill/:ba_id", element: <EditBuyerBill /> },
  { path: "/all-buyer-bills", element: <AllBuyerBills /> },
  { path: "/groom-click-datas", element: <GroomImageClickTable /> },
  { path: "/bride-click-datas", element: <BrideImageClickTable /> },
  { path: "/login-user-datas", element: <LoginUserDatas /> },
  { path: "/separate-login-user", element: <LoginSeparateUser /> },
  { path: "/apply-on-demand", element: <SetOnDemandPrice /> },
  { path: "/called-list-datas", element: <CalledListDatas /> },
  { path: "/get-all-property-datas", element: <PropertyStatusTable /> },
  { path: "/friend-property", element: <FriendProperty /> },
  { path: "/tanent-property", element: <TanentProperty /> },
  { path: "/contact-usage", element: <ContactUsage /> },
  { path: "/set-property-message", element: <SetPropertyMessage /> },
  { path: "/get-all-buyerlist-viewed", element: <BuyerAssistViewsTable /> },
  { path: "/with-all-user", element: <WithUsersTable /> },
  { path: "/sale-property", element: <SalePropertyViewsUser /> },
  { path: "/get-all-address-request", element: <AddressRequestsTable /> },
  { path: "/detail-daily-report", element: <DetailDailyReport /> },
  { path: "/property-payment-daily-report", element: <PropertyPaymentDailyReport /> },
  { path: "/contact-form-datas", element: <GetAllContactFormDatas /> },
];


const Dashboard = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="p-2" style={{ background: "#F0F2F5" }}>
      <div className="dashboard-container">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="main-content" style={{ background: "#F0F2F5" }}>
          <Navbar toggleSidebar={toggleSidebar} />

          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
