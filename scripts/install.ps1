[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $projectRoot "pdf-bookmarks"
$guidFolder = "{D8E1B7A2-6C3F-4A90-9E12-7F4B5C8D0A31}"
$pluginsRoot = Join-Path $env:LOCALAPPDATA "ONLYOFFICE\DesktopEditors\data\sdkjs-plugins"
$target = Join-Path $pluginsRoot $guidFolder

if (-not (Test-Path -LiteralPath $source -PathType Container)) {
    throw "Plugin source folder was not found: $source"
}

New-Item -ItemType Directory -Path $pluginsRoot -Force | Out-Null
New-Item -ItemType Directory -Path $target -Force | Out-Null
Copy-Item -Path (Join-Path $source "*") -Destination $target -Recurse -Force

Write-Host "Installed PDF Bookmarks to $target"
Write-Host "Restart ONLYOFFICE Desktop Editors, then open a PDF and select the PDF Bookmarks icon on the Plugins ribbon or left sidebar."
