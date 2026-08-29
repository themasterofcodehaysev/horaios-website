<?php echo '<?xml version="1.0" encoding="UTF-8"?>' ?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>{{ route('sitemap.main') }}</loc>
        <lastmod>{{ now()->toIso8601String() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.sermons') }}</loc>
        <lastmod>{{ now()->toIso8601String() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.songs') }}</loc>
        <lastmod>{{ now()->toIso8601String() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.blog') }}</loc>
        <lastmod>{{ now()->toIso8601String() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.events') }}</loc>
        <lastmod>{{ now()->toIso8601String() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.ministries') }}</loc>
        <lastmod>{{ now()->toIso8601String() }}</lastmod>
    </sitemap>
</sitemapindex>
