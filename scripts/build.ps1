[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $projectRoot "pdf-bookmarks"
$dist = Join-Path $projectRoot "dist"
$pluginPath = Join-Path $dist "pdf-bookmarks.plugin"

if (-not (Test-Path -LiteralPath $source -PathType Container)) {
    throw "Plugin source folder was not found: $source"
}

New-Item -ItemType Directory -Path $dist -Force | Out-Null
Remove-Item -LiteralPath $pluginPath -Force -ErrorAction SilentlyContinue

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$stream = [System.IO.File]::Open(
    $pluginPath,
    [System.IO.FileMode]::CreateNew,
    [System.IO.FileAccess]::ReadWrite,
    [System.IO.FileShare]::None
)

try {
    $archive = New-Object System.IO.Compression.ZipArchive(
        $stream,
        [System.IO.Compression.ZipArchiveMode]::Create,
        $false
    )

    try {
        Get-ChildItem -LiteralPath $source -File -Recurse |
            Sort-Object FullName |
            ForEach-Object {
                $relativePath = $_.FullName.Substring($source.Length).TrimStart('\', '/').Replace('\', '/')
                [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                    $archive,
                    $_.FullName,
                    $relativePath,
                    [System.IO.Compression.CompressionLevel]::Optimal
                ) | Out-Null
            }
    }
    finally {
        $archive.Dispose()
    }
}
finally {
    $stream.Dispose()
}

Write-Host "Built $pluginPath"
