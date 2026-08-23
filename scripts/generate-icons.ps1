[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$resourcesRoot = Join-Path $projectRoot "pdf-bookmarks\resources"
$sizes = [ordered]@{
    "" = 28
    "@1.25x" = 35
    "@1.5x" = 42
    "@1.75x" = 49
    "@2x" = 56
}

$themes = @{
    light = @{
        Fill = "#2F73D9"
        Border = "#174F9E"
        Mark = "#FFFFFF"
    }
    dark = @{
        Fill = "#8EB8FF"
        Border = "#F3F7FF"
        Mark = "#102A52"
    }
}

foreach ($themeName in $themes.Keys) {
    $theme = $themes[$themeName]
    $themePath = Join-Path $resourcesRoot $themeName
    New-Item -ItemType Directory -Path $themePath -Force | Out-Null

    foreach ($entry in $sizes.GetEnumerator()) {
        $suffix = $entry.Key
        $size = [int]$entry.Value
        $scale = $size / 28.0
        $bitmap = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $fillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($theme.Fill))
        $borderPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml($theme.Border), (1.35 * $scale))
        $markPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml($theme.Mark), (2.15 * $scale))

        try {
            $graphics.Clear([System.Drawing.Color]::Transparent)
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $borderPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
            $markPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
            $markPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

            $path.StartFigure()
            $path.AddBezier((7 * $scale), (5 * $scale), (7 * $scale), (3.35 * $scale), (8.35 * $scale), (2 * $scale), (10 * $scale), (2 * $scale))
            $path.AddLine((10 * $scale), (2 * $scale), (18 * $scale), (2 * $scale))
            $path.AddBezier((18 * $scale), (2 * $scale), (19.65 * $scale), (2 * $scale), (21 * $scale), (3.35 * $scale), (21 * $scale), (5 * $scale))
            $path.AddLine((21 * $scale), (5 * $scale), (21 * $scale), (26 * $scale))
            $path.AddLine((21 * $scale), (26 * $scale), (14 * $scale), (21.25 * $scale))
            $path.AddLine((14 * $scale), (21.25 * $scale), (7 * $scale), (26 * $scale))
            $path.CloseFigure()

            $graphics.FillPath($fillBrush, $path)
            $graphics.DrawPath($borderPen, $path)
            $graphics.DrawLine($markPen, (14 * $scale), (7 * $scale), (14 * $scale), (16 * $scale))
            $graphics.DrawLine($markPen, (10 * $scale), (11.5 * $scale), (18 * $scale), (11.5 * $scale))

            $outputPath = Join-Path $themePath ("icon{0}.png" -f $suffix)
            $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        }
        finally {
            $markPen.Dispose()
            $borderPen.Dispose()
            $fillBrush.Dispose()
            $path.Dispose()
            $graphics.Dispose()
            $bitmap.Dispose()
        }
    }
}

$storeIcons = Join-Path $resourcesRoot "store\icons"
New-Item -ItemType Directory -Path $storeIcons -Force | Out-Null
Copy-Item -Path (Join-Path $resourcesRoot "light\icon*.png") -Destination $storeIcons -Force
Copy-Item -LiteralPath (Join-Path $resourcesRoot "light\icon.svg") -Destination $storeIcons -Force

Write-Host "Generated multi-scale editor and marketplace bookmark icons in $resourcesRoot"
