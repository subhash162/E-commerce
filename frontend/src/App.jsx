
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import './index.css'
import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  )
}
