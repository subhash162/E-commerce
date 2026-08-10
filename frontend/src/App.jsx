
import './index.css'
import ProductGrid from './features/products/components/ProductGrid';
import { useProducts } from './features/products/hooks/useProducts';
import AppRoutes from './routes/AppRoutes';

export default function App() {
 const {products,loading,error}=useProducts();
  return <AppRoutes />
}
