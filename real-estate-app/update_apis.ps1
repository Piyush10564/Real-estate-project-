# PowerShell script to update all axios calls to use api utility
# Run this in the frontend/src directory

$files = Get-ChildItem -Recurse -Include "*.js" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    $content -match "axios\." -and $content -match "localhost:8000"
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # Replace axios import with api import
    $content = $content -replace "import axios from 'axios';", "import api from '../utils/api';"

    # Replace axios.get calls
    $content = $content -replace "axios\.get\('http://localhost:8000", "api.get('"

    # Replace axios.post calls
    $content = $content -replace "axios\.post\('http://localhost:8000", "api.post('"

    # Replace axios.put calls
    $content = $content -replace "axios\.put\('http://localhost:8000", "api.put('"

    # Replace axios.delete calls
    $content = $content -replace "axios\.delete\('http://localhost:8000", "api.delete('"

    # Remove /api/ prefix since it's now in baseURL
    $content = $content -replace "'/api/", "'"

    Set-Content $file.FullName $content
    Write-Host "Updated: $($file.Name)"
}

Write-Host "All axios calls updated!"