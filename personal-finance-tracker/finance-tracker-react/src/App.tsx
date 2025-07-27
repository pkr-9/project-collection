import { useEffect } from "react";
import { useAppDispatch } from "./hooks/reduxHooks";
import { loadUserFromToken } from "./store/slices/authSlice";
import AppRoutes from "./routes/routes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  return (
    <>
      <Header />
      <AppRoutes />;
      <Footer />
    </>
  );
}
