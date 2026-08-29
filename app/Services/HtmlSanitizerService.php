<?php

namespace App\Services;

use HTMLPurifier;
use HTMLPurifier_Config;

class HtmlSanitizerService
{
    protected HTMLPurifier $purifier;

    public function __construct()
    {
        $config = HTMLPurifier_Config::createDefault();
        
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
        
        // Preserve line breaks
        $config->set('AutoFormat.RemoveEmpty', false);
        
        $this->purifier = new HTMLPurifier($config);
    }

    public function sanitize(string $html): string
    {
        return $this->purifier->purify($html);
    }

    public function sanitizeSimple(string $html): string
    {
        // Simple sanitization for less critical fields
        $config = HTMLPurifier_Config::createDefault();
        $config->set('HTML.Allowed', 'p,br,strong,em,u,ul,ol,li,h1,h2,h3');
        $config->set('AutoFormat.AutoParagraph', false);
        $config->set('AutoFormat.RemoveEmpty', false);
        
        $purifier = new HTMLPurifier($config);
        return $purifier->purify($html);
    }
}
