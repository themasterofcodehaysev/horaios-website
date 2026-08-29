import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Key, ChevronRight } from 'lucide-react';
import { roleService } from '../../services/role.service';
import { Role } from '../../types';

export default function RolesListPage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await roleService.list();
        setRoles(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Failed to fetch roles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500">Manage system roles and their access levels</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-48">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : roles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No roles found</h3>
          <p className="mt-1 text-gray-500">There are no roles configured in the system yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const isSystem = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role.name?.toUpperCase());
            return (
              <div
                key={role.id}
                onClick={() => navigate(`/admin/roles/${role.id}/edit`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-navy transition-colors">
                    {role.display_name || role.name}
                  </h3>
                  {isSystem && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-navy/10 text-primary-navy">
                      System Role
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mb-6 flex-grow">
                  {role.description || 'No description provided for this role.'}
                </p>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex gap-4">
                    <div className="flex items-center text-sm text-gray-600 gap-1.5">
                      <Users size={16} className="text-gray-400" />
                      <span>{role.users_count || 0}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-1.5">
                      <Key size={16} className="text-gray-400" />
                      <span>{role.permissions?.length || 0}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-primary-red transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
