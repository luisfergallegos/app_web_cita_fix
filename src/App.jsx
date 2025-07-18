// Library
import { ToastContainer } from 'react-toastify';
import { createBrowserRouter, RouterProvider, BrowserRouter } from "react-router-dom";

// Layouts
import Main, { mainLoader } from "./layouts/Main.jsx";




// Routers
import Home, { homeLoader } from "./pages/Home.jsx";
import ViewUpdateUser, { viewUpdateUserLoader } from "./pages/register_user/View_update_user.jsx";
import ViewUpdateBusiness, { viewUpdateBusinessLoader } from "./pages/register_business/View_update_business.jsx";
import FindBusiness, { findBusinessLoader } from "./pages/business/Find_business.jsx";
import Notification, { notificationLoader } from "./pages/Notification.jsx";
import RegisterUser from "./pages/register_user/Register_user.jsx";
import LoginForm, { loginFormLoader } from "./pages/Login";
import Error from "./pages/Error.jsx";
import AddAppoin, { AddAppoinLoader } from './pages/appoinment/Add_appoin.jsx';
import CancelarAppoin, { CancelarAppoinLoader } from './pages/appoinment/Cancel_appoin.jsx';
import HomeBusiness, { HomeBusinessLoader } from './pages/business/Home_business.jsx';
import RegisterBusiness, { registerBusinessLoader } from './pages/register_business/Register_business.jsx';
import FindUser, { findUserLoader } from './pages/register_user/Find_user.jsx';
import AddAppoinBusinesss, { AddAppoinBusinesssLoader } from './pages/appoinment/Add_appoin_business.jsx';
import AddAppoinBusinesssAnon, { AddAppoinBusinesssAnonLoader } from './pages/appoinment/Add_appoin_business_anon.jsx';
import UpdateAppoinBusiness, { UpdateAppoinLoader } from './pages/appoinment/Update_appoin_business.jsx';

// Actions
import { logoutAction } from "./actions/logout.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: mainLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <LoginForm />,
        loader: loginFormLoader,
        errorElement: <Error />
      },
      {
        path: "home",
        element: <Home />,
        loader: homeLoader,
        errorElement: <Error />
      },
      {
        path: "registerUser",
        element: <RegisterUser />,
        /*loader: registerUserLoader,
        action: expensesAction, */
        errorElement: <Error />
      },

      {
        path: "viewUpdateUser",
        element: <ViewUpdateUser />,
        loader: viewUpdateUserLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "findUser",
        element: <FindUser />,
        loader: findUserLoader,
        /* action: findBusinessAction, */
        errorElement: <Error />
      },

      {
        path: "findBusiness",
        element: <FindBusiness />,
        loader: findBusinessLoader,
        /* action: findBusinessAction, */
        errorElement: <Error />
      },

      {
        path: "homeBusiness",
        element: <HomeBusiness />,
        loader: HomeBusinessLoader,
        /* action: findBusinessAction, */
        errorElement: <Error />
      },

      {
        path: "viewUpdateBusiness",
        element: <ViewUpdateBusiness />,
        loader: viewUpdateBusinessLoader,
        /* action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "registerBusiness",
        element: <RegisterBusiness />,
        loader: registerBusinessLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },

      {
        path: "notification",
        element: <Notification />,
        loader: notificationLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "addAppoin",
        element: <AddAppoin />,
        loader: AddAppoinLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
       {
        path: "cancelAppoin/:id",
        element: <CancelarAppoin />,
        loader: CancelarAppoinLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "addAppoinBusiness",
        element: <AddAppoinBusinesss />,
        loader: AddAppoinBusinesssLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "addAppoinBusinessAnon",
        element: <AddAppoinBusinesssAnon />,
        loader: AddAppoinBusinesssAnonLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "updateAppoinBusiness/:id",
        element: <UpdateAppoinBusiness />,
        loader: UpdateAppoinLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "logout",
        action: logoutAction
      },

    ]
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App;
