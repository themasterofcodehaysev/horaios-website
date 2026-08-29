<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileSecurityService
{
    protected array $allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'audio/mpeg', 'audio/mp3', 'audio/mp4',
        'video/mp4', 'video/mpeg', 'video/quicktime',
        'audio/wav', 'audio/ogg'
    ];

    protected array $allowedExtensions = [
        'jpg', 'jpeg', 'png', 'gif', 'webp',
        'pdf',
        'doc', 'docx',
        'mp3', 'mp4', 'mpeg', 'wav', 'ogg'
    ];

    protected int $maxFileSize = 10240; // 10MB in KB

    public function validateFile(UploadedFile $file): array
    {
        $errors = [];

        // Check file size
        if ($file->getSize() > $this->maxFileSize * 1024) {
            $errors[] = "File size exceeds maximum allowed size of {$this->maxFileSize}KB";
        }

        // Check extension
        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, $this->allowedExtensions)) {
            $errors[] = "File extension '{$extension}' is not allowed";
        }

        // Check MIME type using magic bytes
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $actualMimeType = finfo_file($finfo, $file->getPathname());
        finfo_close($finfo);

        if (!in_array($actualMimeType, $this->allowedMimeTypes)) {
            $errors[] = "File MIME type '{$actualMimeType}' is not allowed";
        }

        // Check for double extensions
        $filename = $file->getClientOriginalName();
        if (substr_count($filename, '.') > 1) {
            $errors[] = "File has multiple extensions which is not allowed";
        }

        // Check for suspicious characters in filename
        if (preg_match('/[^a-zA-Z0-9._-]/', $filename)) {
            $errors[] = "Filename contains invalid characters";
        }

        return $errors;
    }

    public function generateSecureFilename(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        return Str::uuid() . '.' . $extension;
    }

    public function storeFile(UploadedFile $file, string $directory = 'uploads'): string
    {
        $errors = $this->validateFile($file);
        if (!empty($errors)) {
            throw new \InvalidArgumentException(implode(', ', $errors));
        }

        $filename = $this->generateSecureFilename($file);
        $path = $file->storeAs($directory, $filename, 'public');

        return $path;
    }

    public function deleteFile(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        return false;
    }

    public function generateSignedUrl(string $path, int $expiresIn = 3600): string
    {
        return Storage::disk('public')->temporaryUrl($path, now()->addSeconds($expiresIn));
    }
}
