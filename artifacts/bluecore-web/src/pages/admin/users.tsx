import { AdminLayout } from "./layout";
import { useGetUsers } from "@workspace/api-client-react";
import { Users, UserCheck, UserX, Shield, Clock } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isBlocked?: boolean;
  createdAt: string;
}

interface UsersResponse {
  users: User[];
  total?: number;
}

export default function AdminUsers() {
  const usersQuery = useGetUsers({ limit: "50" });
  const data = usersQuery.data as UsersResponse | undefined;
  const users: User[] = data?.users || [];

  const roleColor: Record<string, string> = {
    admin: "bg-red-500/20 text-red-400",
    manager: "bg-purple-500/20 text-purple-400",
    user: "bg-gray-700 text-gray-400",
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Foydalanuvchilar</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} ta foydalanuvchi</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Foydalanuvchi</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Telefon</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Holat</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ro'yxatdan o'tgan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {usersQuery.isLoading ? (
                Array.from({length: 5}).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-4"><div className="h-8 bg-gray-800 animate-pulse rounded-lg" /></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-16 text-center text-gray-600"><Users className="w-10 h-10 mx-auto mb-3" /><p className="font-medium">Foydalanuvchilar yo'q</p></td></tr>
              ) : users.map((u: User) => (
                <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {u.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-gray-400">{u.phone || '—'}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-xs font-semibold ${roleColor[u.role] || roleColor.user}`}>
                      <Shield className="w-3 h-3" />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      {u.isBlocked ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-lg">
                          <UserX className="w-3 h-3" /> Bloklangan
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-lg">
                          <UserCheck className="w-3 h-3" /> Faol
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(u.createdAt).toLocaleDateString('uz')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
