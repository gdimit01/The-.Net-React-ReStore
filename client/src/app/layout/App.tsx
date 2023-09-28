import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  GlobalStyles,
} from "@mui/material";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if (buyerId) {
      agent.Basket.get()
        .then((basket) => dispatch(setBasket(basket)))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if (loading) return <LoadingComponent message="Initialising app..." />;

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <GlobalStyles
        styles={(theme: { palette: { mode: string } }) => ({
          body: {
            backgroundColor: theme.palette.mode === "dark" ? "#333" : "#faf3e0",
            color: theme.palette.mode === "dark" ? "#faf3e0" : "#5c4f40",
          },
          ".product-price": {
            color: theme.palette.mode === "dark" ? "#faf3e0" : "#a67c52",
          },
          ".title-header": {
            color: theme.palette.mode === "dark" ? "#333" : "#d4b996",
          },
          "#header, .custom-appbar.custom-appbar": {
            backgroundColor: theme.palette.mode === "dark" ? "#333" : "#a67c52",
          },
          ".header-nav a": {
            color: theme.palette.mode === "dark" ? "#faf3e0" : "#333", // This needs to be updated
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#555" : "#d4b996",
            },
          },
          "#main": {
            backgroundColor: theme.palette.mode === "dark" ? "#555" : "#f7e9d7",
          },
          "#shopify-section-template": {
            backgroundColor: theme.palette.mode === "dark" ? "#444" : "#eed9b7",
          },
          "#shopify-section-template a": {
            color: theme.palette.mode === "dark" ? "#faf3e0" : "#a67c52",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#555" : "#d4b996",
            },
          },
        })}
      />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <div className="container">
        {/* Your header component and sections ... */}
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;
