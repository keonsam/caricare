import { ReactNode, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/Register';

type Props = {
  element: ReactNode;
  role?: UserRole;
  verifyInfo?: boolean;
};

export default function ProtectedRoute({
  element,
  role,
  verifyInfo = true,
}: Props) {
  const { isLogIn, user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogIn()) {
      navigate('/');
      return;
    }

    if (role && user.role !== role) {
      navigate('/dashboard');
      return;
    }

    if (verifyInfo && !user.info.id) {
      navigate('/profile');
      return;
    }
  }, [isLogIn, user.role, role, navigate, verifyInfo, user.info]);

  return element;
}
