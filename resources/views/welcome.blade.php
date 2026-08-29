<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Horaios Baptist Church') }}</title>
    <link rel="icon" type="image/png" href="/images/logo.png">
    <link rel="apple-touch-icon" href="/images/logo.png">

    @viteReactRefresh
    @vite(["resources/css/app.css", "resources/js/app.tsx"])
</head>
<body class="antialiased">
    <div id="app"></div>
</body>
</html>
