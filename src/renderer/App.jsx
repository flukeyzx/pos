import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/theme-context";
import { AuthProvider } from "./context/auth-context";
import { routes } from "./routes/index.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="pos-ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} {...route} />
              ))}
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
