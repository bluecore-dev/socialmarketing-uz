import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingElements } from "@/components/layout/FloatingElements";
import { AuthProvider } from "@/lib/auth-context";
import "@/lib/i18n";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Cases from "@/pages/cases";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Cabinet from "@/pages/cabinet";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminLeads from "@/pages/admin/leads";
import AdminBlog from "@/pages/admin/blog";
import AdminCases from "@/pages/admin/cases";
import AdminServices from "@/pages/admin/services";
import AdminUsers from "@/pages/admin/users";
import AdminBanners from "@/pages/admin/banners";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    }
  }
});

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/cases" component={AdminCases} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/banners" component={AdminBanners} />
      <Route>
        {() => (
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/services" component={Services} />
                <Route path="/cases" component={Cases} />
                <Route path="/about" component={About} />
                <Route path="/blog/:slug" component={BlogPost} />
                <Route path="/blog" component={Blog} />
                <Route path="/contact" component={Contact} />
                <Route path="/cabinet" component={Cabinet} />
                <Route component={NotFound} />
              </Switch>
            </div>
            <Footer />
            <FloatingElements />
          </div>
        )}
      </Route>
    </Switch>
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
