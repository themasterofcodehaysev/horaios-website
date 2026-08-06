import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronDown, ChevronRight, Loader2, Download } from 'lucide-react';
import { auditlogService } from '../../services/auditlog.service';
import { AuditLog } from '../../types';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | string | null>(null);
  
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await auditlogService.list({
        page,
        search,
        date_from: dateFrom,
        date_to: dateTo
      });
      // Handle the case where the response might be structured differently based on common PaginatedResponse types
      const data = response.data || [];
      setLogs(data);
      
      const meta = (response as any).meta || response;
      setPagination({
        current_page: meta.current_page || 1,
        last_page: meta.last_page || 1,
        total: meta.total || data.length
      });
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, dateFrom, dateTo]);

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    
    const headers = ['ID', 'User', 'Action', 'Entity', 'IP Address', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        log.id,
        log.user?.display_name || 'System',
        log.action,
        log.entity,
        log.ip_address,
        log.created_at
      ].map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeColor = (action: string) => {
    const actionLower = (action || '').toLowerCase();
    if (actionLower.includes('login')) return 'bg-blue-50 text-blue-700 border border-blue-200';
    if (actionLower.includes('create')) return 'bg-green-50 text-green-700 border border-green-200';
    if (actionLower.includes('update')) return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (actionLower.includes('delete')) return 'bg-red-50 text-red-700 border border-red-200';
    if (actionLower.includes('password')) return 'bg-purple-50 text-purple-700 border border-purple-200';
    return 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-1">Review system activities and user actions.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={logs.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by action or entity..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-accent-blue focus:border-accent-blue"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-accent-blue focus:border-accent-blue w-full sm:w-auto"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <span className="text-gray-400 text-sm font-medium">to</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-accent-blue focus:border-accent-blue w-full sm:w-auto"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-accent-blue mb-4" />
            <p className="text-sm">Loading audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-base font-medium text-gray-900">No logs found</p>
            <p className="text-sm mt-1">Try adjusting your search or date filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium">
                <tr>
                  <th className="w-10 px-4 py-3.5"></th>
                  <th className="px-4 py-3.5">User</th>
                  <th className="px-4 py-3.5">Action</th>
                  <th className="px-4 py-3.5">Entity</th>
                  <th className="px-4 py-3.5">IP Address</th>
                  <th className="px-4 py-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr 
                      className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                      onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    >
                      <td className="px-4 py-4 text-gray-400">
                        {expandedId === log.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{log.user?.display_name || 'System'}</div>
                        {log.user?.email && <div className="text-xs text-gray-500 mt-0.5">{log.user.email}</div>}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getBadgeColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {log.entity} {log.entity_id ? <span className="text-gray-400 text-xs ml-1">(#{log.entity_id})</span> : ''}
                      </td>
                      <td className="px-4 py-4 text-gray-500 font-mono text-xs">
                        {log.ip_address || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-gray-500 text-xs">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                    {expandedId === log.id && (
                      <tr className="bg-gray-50/30">
                        <td colSpan={6} className="px-6 py-6 border-b-2 border-gray-100 shadow-inner">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {log.old_values && Object.keys(log.old_values).length > 0 && (
                              <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                  Previous Values
                                </h4>
                                <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap font-mono">
                                  {JSON.stringify(log.old_values, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.new_values && Object.keys(log.new_values).length > 0 && (
                              <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                  New Values
                                </h4>
                                <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap font-mono">
                                  {JSON.stringify(log.new_values, null, 2)}
                                </pre>
                              </div>
                            )}
                            {(!log.old_values || Object.keys(log.old_values).length === 0) && 
                             (!log.new_values || Object.keys(log.new_values).length === 0) && (
                              <div className="text-sm text-gray-400 italic py-2">No specific value changes recorded.</div>
                            )}
                          </div>
                          {log.user_agent && (
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2">
                              <span className="text-xs font-semibold text-gray-400 uppercase whitespace-nowrap mt-0.5">User Agent</span>
                              <span className="text-xs text-gray-500 font-mono break-all">{log.user_agent}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {pagination.total > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{pagination.current_page}</span> of <span className="font-medium text-gray-900">{pagination.last_page}</span> 
              <span className="mx-1 text-gray-300">•</span>
              <span className="font-medium text-gray-900">{pagination.total}</span> total
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.current_page <= 1}
                onClick={() => fetchLogs(pagination.current_page - 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={pagination.current_page >= pagination.last_page}
                onClick={() => fetchLogs(pagination.current_page + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
