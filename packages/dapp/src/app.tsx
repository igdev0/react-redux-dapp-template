import "./app.css";
import {createBrowserRouter, RouterProvider} from 'react-router';
import CounterScreen from '@features/counter/screens';

const router = createBrowserRouter([
  {
    path: "/",
    element: <CounterScreen/>,
  }
]);

export function App() {
  return (
      <RouterProvider router={router}/>
  );
}
