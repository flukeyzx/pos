import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { ThemeProvider } from "./context/theme-context";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "./components/ui/sonner.jsx";
import { routes } from "./routes/index.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  return useRoutes(routes);
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="pos-ui-theme">
        <AuthProvider>
          <Router>
            <AppRoutes />
            <Toaster expand={false} richColors duration={4000} />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
