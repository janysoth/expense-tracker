import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import SignUpPage from './pages/SignUpPage';
import TransactionPage from './pages/TransactionPage';
import Header from './components/ui/Header';
import { useQuery } from '@apollo/client';
import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query';
import { Toaster } from 'react-hot-toast';

function App() {
  const { loading, data } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) return null;

  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="transaction/:id" element={<TransactionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
