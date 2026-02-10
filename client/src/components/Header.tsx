import { User } from '../App';
import { LogOut, User as UserIcon } from 'lucide-react';
import { auditLog } from '../utils/auditLog';

interface HeaderProps {
  user: User;
  onLogout?: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const handleLogout = () => {
    // Registrar log de logout
    auditLog.register({
      user: user.name,
      department: user.department,
      action: 'LOGOUT_REALIZADO',
      details: `Logout do sistema`
    });
    
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="bg-[#013171] text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <span className="text-[#013171] font-bold text-lg">SEV</span>
          </div>
          <div>
            <h1 className="font-bold text-xl">SEV</h1>
            <p className="text-xs text-blue-200">Sistema de Evidência de Validação</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-blue-200 capitalize">{user.role}</p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={handleLogout}
              className="ml-4 p-2 hover:bg-[#024a9f] rounded transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}