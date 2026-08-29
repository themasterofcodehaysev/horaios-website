<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class UploadMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('media.manage');
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'max:10240', // max 10MB
                'mimes:jpeg,png,gif,webp,pdf,doc,docx,mp3,mp4,mpeg,wav,ogg',
                'mimetypes:image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,audio/mpeg,audio/mp3,audio/mp4,video/mp4,video/mpeg,video/quicktime,audio/wav,audio/ogg'
            ],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $file = $this->file('file');
            if ($file) {
                // Additional file content validation using magic bytes
                $allowedMimeTypes = [
                    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'audio/mpeg', 'audio/mp3', 'audio/mp4',
                    'video/mp4', 'video/mpeg', 'video/quicktime',
                    'audio/wav', 'audio/ogg'
                ];
                
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $actualMimeType = finfo_file($finfo, $file->getPathname());
                finfo_close($finfo);
                
                if (!in_array($actualMimeType, $allowedMimeTypes)) {
                    $validator->errors()->add('file', 'Invalid file type. Allowed types: images, PDF, documents, audio, and video files.');
                }
            }
        });
    }
}
