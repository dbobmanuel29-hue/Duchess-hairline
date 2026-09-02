import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import { routes, business } from './config/business';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import WhatsAppButton from './components/WhatsAppButton';
import InquiryPrompt from './components/InquiryPrompt';
import AdminInquiryActions from './components/AdminInquiryActions';
import SeoHead from './components/SeoHead';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductPage from './pages/ProductPage';
import About from './pages/About';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import ClientRequest from './pages/ClientRequest';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Security from './pages/Security';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Profile from './pages/Profile';

function ScrollToTop(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0)},[pathname]);return null}
function ShopRedirect(){const[params]=useSearchParams();const query=params.toString();return <Navigate to={query?`${routes.collection}?${query}`:routes.collection} replace/>}

const STATIC_SEO: Record<string,{title:string;description:string}> = {
  [routes.about]: { title: `About ${business.name} — Premium Wigs in Port Harcourt`, description: `Learn about Duchess Hairline, a Port Harcourt wig destination offering curated wigs and hair pieces with WhatsApp ordering and local pickup or delivery.` },
  [routes.reviews]: { title: `Customer Reviews — ${business.name}`, description: `Read customer feedback and reviews about Duchess Hairline wigs, service and shopping experience in Port Harcourt.` },
  [routes.contact]: { title: `Contact ${business.name} — Order Wigs in Port Harcourt`, description: `Contact Duchess Hairline in Port Harcourt for wig availability, pricing, delivery, pickup and personalised recommendations.` },
  [routes.terms]: { title: `Terms & Conditions — ${business.name}`, description: `Read the terms and conditions for shopping and enquiries with Duchess Hairline.` },
  [routes.privacy]: { title: `Privacy Policy — ${business.name}`, description: `Read the Duchess Hairline privacy policy and learn how customer information is handled.` },
  [routes.security]: { title: `Security — ${business.name}`, description: `Learn about security and safe ordering practices when shopping with Duchess Hairline.` },
};
function RouteSeo(){
  const { pathname } = useLocation();
  if (pathname === routes.home || pathname === routes.collection || pathname.startsWith('/product/')) return null;
  const seo = STATIC_SEO[pathname];
  return <SeoHead title={seo?.title ?? `Page Not Found — ${business.name}`} description={seo?.description ?? `The page you requested could not be found on ${business.name}.`} />;
}

export default function App(){
  return <BrowserRouter><ScrollToTop/><Routes><Route path="/admin" element={<><Admin/><AdminInquiryActions/></>}/><Route path="/login" element={<Login/>}/><Route path="/profile" element={<Profile/>}/><Route path="*" element={<PublicApp/>}/></Routes></BrowserRouter>;
}
function PublicApp(){
  const location=useLocation();
  const showInquiryPrompt=location.pathname===routes.contact;
  return <div className="min-h-screen bg-warm-white flex flex-col"><RouteSeo/><Header/><div className="flex-1"><Routes><Route path={routes.home} element={<Home/>}/><Route path={routes.collection} element={<Collection/>}/><Route path="/product/:id" element={<ProductPage/>}/><Route path={routes.about} element={<About/>}/><Route path={routes.reviews} element={<Reviews/>}/><Route path={routes.contact} element={<Contact/>}/><Route path="/request" element={<ClientRequest/>}/><Route path={routes.terms} element={<Terms/>}/><Route path={routes.privacy} element={<Privacy/>}/><Route path={routes.security} element={<Security/>}/><Route path="/shop" element={<ShopRedirect/>}/><Route path="*" element={<NotFound/>}/></Routes>{showInquiryPrompt&&<InquiryPrompt/>}</div><Footer/><WhatsAppButton/><MobileNav/></div>;
}
