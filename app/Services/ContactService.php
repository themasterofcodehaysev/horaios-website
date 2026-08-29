<?php

namespace App\Services;

use App\Models\ContactMessage;
use App\Models\User;
use App\Notifications\ContactMessageReceived;
use App\Jobs\SendContactMessageNotification;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ContactService
{
    public function getAdminContactMessages(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = ContactMessage::with(['replier'])
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('name', 'like', $term)
                        ->orWhere('email', 'like', $term)
                        ->orWhere('subject', 'like', $term)
                        ->orWhere('message', 'like', $term);
                });
            })
            ->when(!empty($filters['status']), fn($q) => $q->where('status', $filters['status']))
            ->orderBy($filters['sort_by'] ?? 'created_at', $filters['sort_dir'] ?? 'desc');

        return $query->paginate($perPage);
    }

    public function createContactMessage(array $data): ContactMessage
    {
        $data['uuid'] = (string) Str::uuid();
        $data['status'] = 'unread';

        $message = ContactMessage::create($data);

        AuditLogService::log(
            'create',
            'ContactMessage',
            (string) $message->id,
            null,
            $message->only(['id', 'name', 'email', 'subject', 'status']),
            null
        );

        // Queue notification job for admin users about new contact message
        SendContactMessageNotification::dispatch(
            $message->subject,
            $message->name,
            $message->email
        );

        // Create in-app notification
        $adminUsers = User::whereHas('role', function ($query) {
            $query->where('name', 'admin')->orWhere('name', 'super_admin');
        })->get();

        $notificationService = new NotificationService();
        foreach ($adminUsers as $admin) {
            $notificationService->notifyNewContactMessage($admin, $message->subject);
        }

        return $message;
    }

    public function updateContactMessage(ContactMessage $message, array $data, ?User $actingUser = null): ContactMessage
    {
        $oldValues = $message->only(['status', 'admin_notes']);

        if (isset($data['status']) && $data['status'] === 'replied' && $message->status !== 'replied') {
            $data['replied_by'] = $actingUser?->id;
            $data['replied_at'] = now();
        }

        $message->update($data);

        AuditLogService::log(
            'update',
            'ContactMessage',
            (string) $message->id,
            $oldValues,
            $message->only(['status', 'admin_notes']),
            $actingUser?->id
        );

        return $message->fresh(['replier']);
    }

    public function deleteContactMessage(ContactMessage $message, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'ContactMessage',
            (string) $message->id,
            $message->only(['name', 'email', 'subject', 'status']),
            null,
            $actingUser?->id
        );

        $message->delete();
    }

    public function updateStatus(ContactMessage $message, string $status, ?User $actingUser = null): ContactMessage
    {
        return $this->updateContactMessage($message, [
            'status' => $status,
            'replied_by' => $status === 'replied' ? $actingUser?->id : null,
            'replied_at' => $status === 'replied' ? now() : null,
        ], $actingUser);
    }

    public function getStats(): array
    {
        return [
            'total' => ContactMessage::count(),
            'unread' => ContactMessage::where('status', 'unread')->count(),
            'read' => ContactMessage::where('status', 'read')->count(),
            'replied' => ContactMessage::where('status', 'replied')->count(),
            'archived' => ContactMessage::where('status', 'archived')->count(),
        ];
    }
}
