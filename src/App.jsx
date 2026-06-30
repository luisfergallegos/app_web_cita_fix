// Library
import { ToastContainer } from 'react-toastify';
import { createBrowserRouter, RouterProvider, BrowserRouter } from "react-router-dom";

// Layouts
import Main from "./layouts/Main.jsx";
import { ProfileProvider } from "./ProfileContext.jsx";

// Routers
import Home from "./pages/user/Home_user.jsx";
import ViewUpdateUser, { viewUpdateUserLoader } from "./pages/register_user/View_update_user.jsx";
import FindBusiness, { findBusinessLoader } from "./pages/business/Find_business.jsx";
import Notification, { notificationLoader } from "./pages/Notification.jsx";
import RegisterUser, { registerUserLoader } from "./pages/register_user/Register_user.jsx";
import LoginForm, { loginFormLoader } from "./pages/Login";
import SingIn, {loginLoader} from './pages/authenticate/SignIn.jsx';
import Error from "./pages/Error.jsx";
import AddAppoin, { AddAppoinLoader } from './pages/appoinment/Add_appoin.jsx';
import CancelarAppoin, { CancelarAppoinLoader } from './pages/appoinment/Cancel_appoin.jsx';
import AddAppoinBusinesssAnon, { AddAppoinBusinesssAnonLoader } from './pages/appoinment/Add_appoin_business_anon.jsx';
import ViewBusiness, { ViewBusinessLoader } from './pages/business/View_business.jsx';
import DeleteUser, { DeleteUserLoader } from './pages/register_user/Delete_user.jsx';
import Confirmation, { ConfirmationLoader } from './pages/appoinment/Confirmation.jsx';
import AddEvento, { AddEventoLoader } from './pages/evento/add_evento.jsx';
import UpdateEvento, { UpdateEventoLoader } from './pages/evento/update_evento.jsx';
// Actions
import { logoutAction } from "./actions/logout.js";
import Politicas, { PoliticasLoader } from './pages/Politicas.jsx';
import Landing, { LandingLoader } from './pages/Landing.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    // loader: mainLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <LoginForm />,
        loader: loginFormLoader,
        errorElement: <Error />
      },
      {
        path: "login",
        element: <SingIn />,
        loader: loginLoader,
        /* action: findBusinessAction, */
        errorElement: <Error />
      },
      {
        path: "landing",
        element: <Landing />,
        loader: LandingLoader,
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
        path: "home",
        element: <Home />,
        // loader: homeLoader,
      },
      {
        path: "registerUser",
        element: <RegisterUser />,
        loader: registerUserLoader,
        /*action: expensesAction, */
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
        path: "addAppoinBusinessAnon",
        element: <AddAppoinBusinesssAnon />,
        loader: AddAppoinBusinesssAnonLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "addEvent",
        element: <AddEvento />,
        loader: AddEventoLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "updateEvent",
        element: <UpdateEvento />,
        loader: UpdateEventoLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "viewBusiness",
        element: <ViewBusiness />,
        loader: ViewBusinessLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "deleteUser",
        element: <DeleteUser />,
        loader: DeleteUserLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "politica-de-privacidad",
        element: <Politicas />,
        loader: PoliticasLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "confirmation",
        element: <Confirmation />,
        loader: ConfirmationLoader,
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
    <ProfileProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ProfileProvider>
  );
}

export default App;
