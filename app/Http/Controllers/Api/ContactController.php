<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Contact\CreateContactMessageRequest;
use App\Http\Requests\Contact\UpdateContactMessageRequest;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use App\Services\ContactService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ContactController extends BaseApiController
{
    public function __construct(protected ContactService $contactService)
    {
    }

    public function store(CreateContactMessageRequest $request): JsonResponse
    {
        try {
            $message = $this->contactService->createContactMessage($request->validated());
            return $this->created(new ContactMessageResource($message), 'Contact message sent successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to send contact message: ' . $e->getMessage(), 500);
        }
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('viewAny', ContactMessage::class);

        $messages = $this->contactService->getAdminContactMessages([
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'sort_by' => $request->input('sort_by'),
            'sort_dir' => $request->input('sort_dir'),
        ], $request->input('per_page', 15));

        return $this->paginated(ContactMessageResource::collection($messages), 'Admin contact messages retrieved');
    }

    public function adminShow(int $id): JsonResponse
    {
        $this->authorize('viewAny', ContactMessage::class);

        $message = ContactMessage::with(['replier'])->findOrFail($id);

        return $this->success(new ContactMessageResource($message), 'Contact message retrieved');
    }

    public function update(UpdateContactMessageRequest $request, int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        $this->authorize('update', $message);

        try {
            $updated = $this->contactService->updateContactMessage($message, $request->validated(), $request->user());
            return $this->success(new ContactMessageResource($updated), 'Contact message updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update contact message: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        $this->authorize('delete', $message);

        try {
            $this->contactService->deleteContactMessage($message, $request->user());
            return $this->noContent('Contact message deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete contact message: ' . $e->getMessage(), 500);
        }
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        $this->authorize('update', $message);

        $request->validate(['status' => 'required|in:unread,read,replied,archived']);

        try {
            $updated = $this->contactService->updateStatus($message, $request->input('status'), $request->user());
            return $this->success(new ContactMessageResource($updated), 'Contact message status updated');
        } catch (Throwable $e) {
            return $this->error('Failed to update status: ' . $e->getMessage(), 500);
        }
    }

    public function stats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', ContactMessage::class);

        $stats = $this->contactService->getStats();

        return $this->success($stats, 'Contact message statistics retrieved');
    }
}
