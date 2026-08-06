import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, ShieldAlert } from 'lucide-react';
import { roleService } from '../../services/role.service';
import type { Role, Permission } from '../../types';

export default function RoleEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [errorState, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roleRes, permsRes] = await Promise.all([
          roleService.show(id!),
          roleService.permissions()
        ]);
        
        setRole(roleRes);
        
        let allPerms: Permission[] = [];
        if (Array.isArray(permsRes)) {
          allPerms = permsRes;
        } else if (permsRes && typeof permsRes === 'object') {
          allPerms = Object.values(permsRes).flat();
        }
        setPermissions(allPerms);
        
        const currentPerms = roleRes.permissions?.map((p: Permission) => p.id) || [];
        setSelectedPermissions(currentPerms);
      } catch (err) {
        console.error('Failed to fetch role data', err);
        setErrorState('Failed to load role details.');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const isSuperAdmin = role?.name?.toUpperCase() === 'SUPER_ADMIN';

  const handleTogglePermission = (permId: number) => {
    if (isSuperAdmin) return;
    setSelectedPermissions(prev => 
      prev.includes(permId) 
        ? prev.filter(pId => pId !== permId)
        : [...prev, permId]
    );
  };

  const handleSubmit = async () => {
    if (isSuperAdmin) return;
    setLoading(true);
    try {
      await roleService.updatePermissions(id!, selectedPermissions);
      navigate('/admin/roles');
    } catch (err) {
      console.error('Failed to update permissions', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto py-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-96"></div>
      </div>
    );
  }

  if (errorState || !role) {
    return (
      <div className="max-w-5xl mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-center">
          <p>{errorState || 'Role not found.'}</p>
          <button onClick={() => navigate('/admin/roles')} className="mt-4 text-[#1E366D] hover:underline">
            Back to Roles
          </button>
        </div>
      </div>
    );
  }
  
  // Group permissions by 'group' or fallback to 'General'
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const group = perm.group || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/admin/roles')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Role: {role.display_name || role.name}</h1>
          <p className="text-sm text-gray-500">{role.description || 'Manage permissions for this role'}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isSuperAdmin && (
          <div className="bg-[#1E366D]/10 px-6 py-4 border-b border-[#1E366D]/20 flex items-start gap-3">
            <ShieldAlert className="text-[#1E366D] shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-medium text-[#1E366D]">System Administrator Role</h3>
              <p className="text-sm text-[#1E366D]/80 mt-1">
                This is a core system role. Super Administrators automatically have full access to all permissions. These settings cannot be modified.
              </p>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="space-y-8">
            {Object.entries(groupedPermissions).map(([group, perms]) => (
              <div key={group} className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900 capitalize">{group.replace('_', ' ')}</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {perms.map(perm => {
                    const isChecked = isSuperAdmin || selectedPermissions.includes(perm.id);
                    return (
                      <label 
                        key={perm.id} 
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                          isChecked ? 'bg-[#1E366D]/5 border-[#1E366D]/20' : 'border-transparent hover:bg-gray-50'
                        } ${isSuperAdmin ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isSuperAdmin}
                            onChange={() => handleTogglePermission(perm.id)}
                            className="w-4 h-4 text-[#C8102E] border-gray-300 rounded focus:ring-[#C8102E]"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{perm.display_name || perm.name}</span>
                          <span className="text-xs text-gray-400 mt-0.5 font-mono">{perm.name}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!isSuperAdmin && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/roles')}
                className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#C8102E] hover:bg-[#a00d25] rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {loading ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
