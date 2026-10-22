#Requires -Version 7
# Kairos screenshots for the site: every entry of kairos-shots.json rendered by a Kairos build (Kairos.exe --render),
# in English and Arabic, on a hidden Windows desktop of its own (Kairos's tools\run-hidden.ps1 -OwnDesktop), then
# WebP at 1600 px and 800 px into public\media\kairos\<lang>\ (cut to the entry's crop: the part of a tall page that
# shows the feature), and the pictures' sizes into src\data\shot-sizes.json. Nothing shows on screen or makes a sound.
#   kairos-media.ps1 -Exe <Kairos.exe of a release build> -Work <scratch folder> -KairosRepo <Kairos checkout> [-Only status,mixer]
param(
    [Parameter(Mandatory)][string]$Exe,
    [Parameter(Mandatory)][string]$Work,
    [Parameter(Mandatory)][string]$KairosRepo,
    [string[]]$Only = @()
)
$ErrorActionPreference = 'Stop'
$site = Split-Path $PSScriptRoot -Parent
$shots = Get-Content (Join-Path $PSScriptRoot 'kairos-shots.json') -Raw | ConvertFrom-Json
$run = Join-Path $KairosRepo 'tools\run-hidden.ps1'
$sizesFile = Join-Path $site 'src\data\shot-sizes.json'
$sizes = if (Test-Path $sizesFile) { Get-Content $sizesFile -Raw | ConvertFrom-Json -AsHashtable } else { @{} }

# Never the running Kairos: a pipe of this run's own, made-up VALORANT clips (the editor and Share open a real one), no sound.
$env:KAIROS_PIPE = "KairosSiteShots$PID"
$env:KAIROS_RENDER_SAMPLES = Join-Path $KairosRepo 'brag-output\work\samples-val'
$clips = Join-Path $KairosRepo 'brag-output\work\samples-val\VALORANT'
$env:SDL_AUDIO_DRIVER = 'dummy'

foreach ($lang in 'en', 'ar') {
    $out = Join-Path $site "public\media\kairos\$lang"
    New-Item -ItemType Directory -Force $out | Out-Null
    foreach ($shot in $shots) {
        if ($Only -and $shot.name -notin $Only) { continue }
        $data = Join-Path $Work "data-$lang-$($shot.name)"
        Remove-Item -Recurse -Force $data -ErrorAction SilentlyContinue
        New-Item -ItemType Directory -Force $data | Out-Null
        $env:KAIROS_RENDER_CLIP = Join-Path $clips ($shot.clip ?? 'VALORANT 2026-10-18 17-14-05.mp4')
        $png = Join-Path $Work "$($shot.name)-$lang.png"
        $arguments = @('--render', $shot.page, $png, $lang) + @($shot.state | Where-Object { $_ })
        & $run -Exe $Exe -Arguments $arguments -Out (Join-Path $Work "$($shot.name)-$lang.log") -DataDir $data -TimeoutSec 180 -OwnDesktop
        if (-not (Test-Path $png)) { throw "no picture for $($shot.name) ($lang)" }
        $crop = if ($shot.crop) { "crop=iw:$($shot.crop.h):0:$($shot.crop.y)," } else { '' }
        foreach ($width in 1600, 800) {
            $suffix = if ($width -eq 800) { '-800' } else { '' }
            & ffmpeg -hide_banner -loglevel error -y -i $png -vf "${crop}scale=${width}:-2:flags=lanczos" -c:v libwebp -quality 86 (Join-Path $out "$($shot.name)$suffix.webp")
        }
        $size = (& ffprobe -v error -show_entries stream=width,height -of csv=p=0 (Join-Path $out "$($shot.name).webp")).Trim() -split ','
        $sizes["kairos/$($shot.name)"] = @([int]$size[0], [int]$size[1])
        Write-Output "$lang $($shot.name) ok $($size -join 'x')"
    }
}

$sorted = [ordered]@{}
$sizes.Keys | Sort-Object | ForEach-Object { $sorted[$_] = $sizes[$_] }
$sorted | ConvertTo-Json | Set-Content $sizesFile -Encoding utf8NoBOM
