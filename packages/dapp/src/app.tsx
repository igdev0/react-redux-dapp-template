import "./app.css";
import {createBrowserRouter, RouterProvider} from 'react-router';
import SignInScreen from '@features/user/screens/sign-in.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignInScreen/>,
  }
]);

export function App() {
  return (
      <RouterProvider router={router}/>
  );
}
