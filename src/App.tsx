import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";

const Index = lazy(() => import("./pages/Index.tsx"));
const MangaDetail = lazy(() => import("./pages/MangaDetail.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const MangaList = lazy(() => import("./pages/admin/MangaList.tsx"));
const MangaForm = lazy(() => import("./pages/admin/MangaForm.tsx"));
const ChapterManager = lazy(() => import("./pages/admin/ChapterManager.tsx"));
const ScanGroups = lazy(() => import("./pages/admin/ScanGroups.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/manga/:slug" element={<MangaDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<MangaList />} />
                  <Route path="manga/:id" element={<MangaForm />} />
                  <Route path="manga/:id/chapters" element={<ChapterManager />} />
                  <Route path="scans" element={<ScanGroups />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
