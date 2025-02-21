import { Routes, Route, BrowserRouter } from "react-router-dom";
import { routes } from "../utils/routes";
import { Home } from "@pages/home/Home";
import { Signup } from "@pages/auth/Signup";
import { Login } from "@pages/auth/Login";
import { Matches } from "@pages/matchs/Matches";
import { Browse } from "@pages/browse/Browse";
import { Notifications } from "@pages/notifications/Notifications";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { ChatPage } from "@pages/chat/Chat";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { theme } from "@components/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider, ProtectedRoute } from "@utils/authContext";
import { SnackbarProvider } from "notistack";
import { PayloadProvider } from "@/utils/payloadProvider";
import { Insights } from "@/pages/insights/Insights";
export const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <PayloadProvider>
              <SnackbarProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path={routes.REGISTER} element={<Signup />} />
                  <Route path={routes.LOGIN} element={<Login />} />

                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path={routes.MATCHES} element={<Matches />} />
                    <Route path={routes.BROWSE} element={<Browse />} />
                    <Route path={routes.ME} element={<ProfilePage />} />
                    <Route path={routes.CHAT} element={<ChatPage />} />
                    <Route path={routes.INSIGHTS} element={<Insights />} />
                    <Route
                      path={routes.NOTIFICATIONS}
                      element={<Notifications />}
                    />
                  </Route>
                </Routes>
              </SnackbarProvider>
            </PayloadProvider>
          </ThemeProvider>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
};
