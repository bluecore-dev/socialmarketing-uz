import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingElements } from "@/components/layout/FloatingElements";
import { AuthProvider } from "@/lib/auth-context";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AnimatePresence, motion } from "framer-motion";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageLoader } from "@/components/ui/PageLoader";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
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
const AdminNotifications = lazy(() => import("@/pages/admin/notifications"));
const AdminTranslations = lazy(() => import("@/pages/admin/translations"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    }
  }
});

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CurtainTransition() {
  const [location] = useLocation();
  const [show, setShow] = useState(false);
  const prevRef = useRef(location);

  useEffect(() => {
    if (location === prevRef.current) return;
    prevRef.current = location;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setShow(true);
    const t = setTimeout(() => setShow(false), 520);
    return () => clearTimeout(t);
  }, [location]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="curtain"
          initial={{ y: "-100%" }}
          animate={{ y: "0%", transition: { duration: 0.26, ease: [0.76, 0, 0.24, 1] } }}
          exit={{ y: "105%", transition: { duration: 0.26, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[200] bg-gradient-to-b from-primary via-secondary to-accent pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}

function PageLoader2() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary"
      />
    </div>
  );
}

function LenisProvider() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
    let rafId: number;

    import("@studio-freight/lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }).catch(() => {});

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return null;
}

function PublicRoutes() {
  const [location] = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<PageLoader2 />}>
          <AnimatePresence mode="sync">
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
                {() => (
                  <PageWrapper>
                    <PrivateRoute><Cabinet /></PrivateRoute>
                  </PageWrapper>
                )}
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
    <Suspense fallback={<PageLoader2 />}>
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
        <Route path="/admin/notifications" component={AdminNotifications} />
        <Route path="/admin/translations" component={AdminTranslations} />
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
            <LenisProvider />
            <PageLoader />
            <ScrollProgressBar />
            <CurtainTransition />
            <CustomCursor />
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
