<?php

namespace App\Services;

use HTMLPurifier;
use HTMLPurifier_Config;
use Illuminate\Support\Facades\File;

class HtmlSanitizerService
{
    protected HTMLPurifier $purifier;

    public function __construct()
    {
        $config = HTMLPurifier_Config::createDefault();
        $this->applyBaseConfig($config);
        $this->configureCachePath($config);

        $this->purifier = new HTMLPurifier($config);
    }

    protected function applyBaseConfig(HTMLPurifier_Config $config): void
    {
        // Allow only safe HTML tags
        $config->set('HTML.Allowed', 'p,a[href|title],strong,em,u,ul,ol,li,h1,h2,h3,h4,h5,h6,br,span,div,blockquote,code,pre');

        // Allow safe attributes
        $config->set('HTML.AllowedAttributes', 'a.href,a.title,*.class,*.id');

        // Allow safe protocols
        $config->set('URI.AllowedSchemes', ['http' => true, 'https' => true, 'mailto' => true]);

        // Disable auto paragraph wrapping
        $config->set('AutoFormat.AutoParagraph', false);

        // Disable remove empty paragraphs
        $config->set('AutoFormat.RemoveEmpty', false);

        // Disable remove spans
        $config->set('AutoFormat.RemoveSpansWithoutAttributes', false);
    }

    protected function configureCachePath(HTMLPurifier_Config $config): void
    {
        $cachePath = storage_path('framework/cache/htmlpurifier');

        try {
            if (!File::isDirectory($cachePath)) {
                File::makeDirectory($cachePath, 0755, true, true);
            }

            if (File::isWritable($cachePath)) {
                $config->set('Cache.SerializerPath', $cachePath);
                return;
            }
        } catch (\Throwable) {
            // Fall through to Null cache if directory cannot be prepared
        }

        // Last-resort fallback: don't cache, but don't crash the request.
        $config->set('Cache.DefinitionImpl', null);
    }

    protected function applySimpleConfig(HTMLPurifier_Config $config): void
    {
        $config->set('HTML.Allowed', 'p,br,strong,em,u,ul,ol,li,h1,h2,h3');
        $config->set('AutoFormat.AutoParagraph', false);
        $config->set('AutoFormat.RemoveEmpty', false);
    }

    public function sanitize(string $html): string
    {
        return $this->purifier->purify($html);
    }

    public function sanitizeSimple(string $html): string
    {
        $config = HTMLPurifier_Config::createDefault();
        $this->applySimpleConfig($config);
        $this->configureCachePath($config);

        $purifier = new HTMLPurifier($config);
        return $purifier->purify($html);
    }
}
