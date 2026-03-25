import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingElements } from "@/components/layout/FloatingElements";
import { AuthProvider } from "@/lib/auth-context";
import { AnimatePresence, motion } from "framer-motion";
import "@/lib/i18n";

const Home = lazy(() => import("@/pages/home"));
const Services = lazy(() => import("@/pages/services"));
const Cases = lazy(() => import("@/pages/cases"));
const CaseDetail = lazy(() => import("@/pages/case-detail"));
const About = lazy(() => import("@/pages/about"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const Contact = lazy(() => import("@/pages/contact"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const Cabinet = lazy(() => import("@/pages/cabinet"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminLeads = lazy(() => import("@/pages/admin/leads"));
const AdminBlog = lazy(() => import("@/pages/admin/blog"));
const AdminCases = lazy(() => import("@/pages/admin/cases"));
const AdminServices = lazy(() => import("@/pages/admin/services"));
const AdminUsers = lazy(() => import("@/pages/admin/users"));
const AdminBanners = lazy(() => import("@/pages/admin/banners"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    }
  }
});

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = { duration: 0.25 };

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function PublicRoutes() {
  const [location] = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Switch key={location}>
              <Route path="/">
                {() => <PageWrapper><Home /></PageWrapper>}
              </Route>
              <Route path="/services">
                {() => <PageWrapper><Services /></PageWrapper>}
              </Route>
              <Route path="/cases/:slug">
                {() => <PageWrapper><CaseDetail /></PageWrapper>}
              </Route>
              <Route path="/cases">
                {() => <PageWrapper><Cases /></PageWrapper>}
              </Route>
              <Route path="/about">
                {() => <PageWrapper><About /></PageWrapper>}
              </Route>
              <Route path="/blog/:slug">
                {() => <PageWrapper><BlogPost /></PageWrapper>}
              </Route>
              <Route path="/blog">
                {() => <PageWrapper><Blog /></PageWrapper>}
              </Route>
              <Route path="/contact">
                {() => <PageWrapper><Contact /></PageWrapper>}
              </Route>
              <Route path="/cabinet">
                {() => <PageWrapper><Cabinet /></PageWrapper>}
              </Route>
              <Route>
                {() => <PageWrapper><NotFound /></PageWrapper>}
              </Route>
            </Switch>
          </AnimatePresence>
        </Suspense>
      </div>
      <Footer />
      <FloatingElements />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/leads" component={AdminLeads} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/cases" component={AdminCases} />
        <Route path="/admin/services" component={AdminServices} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/banners" component={AdminBanners} />
        <Route component={PublicRoutes} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
