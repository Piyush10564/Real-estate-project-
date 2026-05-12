$body = @{
    firstName = 'Test'
    lastName = 'User'
    email = 'testuser+livecheck@gmail.com'
    password = 'Test1234'
    userType = 'buyer'
}
$json = $body | ConvertTo-Json
Write-Host "JSON payload: $json"
$uri = 'https://propify-vi62.onrender.com/api/auth/register'
try {
    $response = Invoke-WebRequest -Uri $uri -Method Post -Body $json -ContentType 'application/json' -UseBasicParsing
    Write-Host "Status:" $response.StatusCode
    Write-Host $response.Content
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response -ne $null) {
        $respStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($respStream)
        $content = $reader.ReadToEnd()
        Write-Host "Response body: $content"
    }
}
