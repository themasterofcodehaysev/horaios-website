<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    protected ?User $targetUser = null;

    protected function getTargetUser(): ?User
    {
        if ($this->targetUser !== null) {
            return $this->targetUser;
        }

        $param = $this->route('uuid') ?? $this->route('user');

        if ($param instanceof User) {
            return $this->targetUser = $param;
        }

        if (is_string($param)) {
            return $this->targetUser = User::where('uuid', $param)->orWhere('id', $param)->first();
        }

        return null;
    }

    public function authorize(): bool
    {
        $target = $this->getTargetUser();

        return $target ? $this->user()->can('update', $target) : true;
    }

    public function rules(): array
    {
        $userId = $this->getTargetUser()?->id;

        return [
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => ['nullable', 'string', Password::defaults()],
            'role_id' => ['sometimes', 'required', 'exists:roles,id'],
            'status' => ['sometimes', 'required', 'string', 'in:active,inactive,locked'],
        ];
    }
}
