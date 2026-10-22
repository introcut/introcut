# Introcut: web app vs Windows desktop app vs local-helper hybrid (as of 2026-10-22)

Notes conventions: "Cited Findings" were seen in a fetched primary page unless I say "(search snippet)", which means I only saw a search-result summary of that page, not the page itself. "Inferences" are my reasoning or estimates, not sourced facts. Anything unverified is marked "verify".

## 1. Frameworks: Tauri v2 vs Electron vs others, and how much of the existing React app can be reused

### Takeaway
Tauri v2 (Windows: WebView2) is the lowest-change, smallest-download way to wrap the existing Vite/React app, and its sidecar feature can ship FFmpeg or a Python/ONNX binary. Electron costs 10 to 30 times more download size but removes the "which Chromium does the user have" variable. I found no source confirming WebCodecs H.264 encode inside Tauri/WebView2 (a test is needed).

### Cited Findings
- Tauri is licensed "Apache-2.0, MIT"; the repo says "MIT or MIT/Apache 2.0 where applicable"; it uses "WebView2 on Windows"; about 112k GitHub stars — [tauri-apps/tauri](https://github.com/tauri-apps/tauri)
- Tauri sidecars: external executables listed in `bundle.externalBin`, each needing a copy named with a `-$TARGET_TRIPLE` suffix; started from Rust or JS (shell plugin); stdin/stdout streaming; arguments constrained by capability regexes. The page says nothing about FFmpeg or binary size and only notes that Python CLIs/API servers can be bundled with tools such as pyinstaller — [Tauri v2 sidecar docs](https://v2.tauri.app/develop/sidecar/)
- Tauri's Windows installer handles WebView2 in five modes: `downloadBootstrapper` (default, ~0 MB added), `embedBootstrapper` (~1.8 MB), `offlineInstaller` (~127 MB), `fixedRuntime` (~180 MB), `skip`. Windows 10 (April 2018 update or later) and Windows 11 include WebView2. `.msi` uses WiX v3 and builds only on Windows; NSIS `-setup.exe` can cross-compile — [Tauri Windows installer docs](https://v2.tauri.app/distribute/windows-installer/)
- Tauri updater: updates must be signed and "This cannot be disabled"; this is a separate key pair from OS code signing (public key in `tauri.conf.json`, private key via `TAURI_SIGNING_PRIVATE_KEY`); losing the private key means you cannot update existing installs; a static `latest.json` can be hosted on GitHub Releases and Tauri Action can generate it — [Tauri updater plugin docs](https://v2.tauri.app/plugin/updater/)
- WebView2 Runtime "generally provides the same web platform capabilities and update release cadence as the Stable channel of the Microsoft Edge browser"; Evergreen runtime is included with Windows 11; "The vast majority of Windows 10 devices have the WebView2 Runtime installed already"; the bootstrapper is about 2 MB; Fixed Version binaries are "over 250 MB" — [Microsoft Learn, WebView2 distribution (updated 2026-10-02)](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/distribution)
- Size comparisons (search snippet, sources disagree, treat as indicative): one benchmark 323 MB Electron vs 57 MB Tauri; another installer 8.6 MB Tauri 2 vs 244 MB Electron — [vanja.io](https://vanja.io/tauri-2-new-default/), [noqta.tn](https://noqta.tn/blog/tauri-2-desktop-apps-rust-web-technologies-2026), [betterstack](https://betterstack.com/community/guides/scaling-nodejs/tauri-vs-electron-vs-deno-vs-electrobun.md)
- Electron ships a full Chromium with each app (search snippet) — [levminer.com](https://www.levminer.com/blog/tauri-vs-electron). The Electron performance page I fetched does not state a license or size ([Electron docs](https://www.electronjs.org/docs/latest/tutorial/performance)); Electron's MIT licence is from my own knowledge: verify on its LICENSE file.
- Buzz (open-source Whisper desktop app) is MIT, ships unsigned (users click "More info" then "Run anyway"), is distributed via SourceForge/PyPI, supports CUDA, Apple Silicon and Vulkan for whisper.cpp "on most GPUs, including integrated GPUs" — [chidiwilliams/buzz](https://github.com/chidiwilliams/buzz)
- ComfyUI Desktop: official docs list NVIDIA GPU as the hardware requirement and about 15 GB disk for the install itself, models extra; Pinokio's own install size is not published and its wiki says apps/models can reach 100 GB (min 50 GB for most apps); Pinokio downloads Node.js/Conda/Python as needed (search snippet) — [ComfyUI docs](https://docs.comfy.org/installation/desktop/windows), [Pinokio wiki](https://github.com/6Morpheus6/pinokio-wiki)

### Inferences
- Because WebView2 follows Edge Stable, WebCodecs, WebGPU and OPFS should behave like Chrome/Edge of the same Chromium version, so the existing Canvas 2D + WebCodecs + Mediabunny code should run unchanged inside a Tauri window. This is an inference (no source found); the 1-day test is to call `VideoEncoder.isConfigSupported()` for avc1 and mp4a/AAC inside a Tauri build on a Windows 10 machine and a Windows 11 machine.
- Code reuse ranking (estimate): Tauri or Electron (about 90 to 95% of src/ reused; add a thin native layer) > Hybrid helper (100% of UI reused, helper is new code) > native rewrite (WPF/WinUI/Qt: near 0%). Wails/Neutralino use the same system WebView2, so they give no advantage over Tauri for this team; I did not research them separately (gap).
- Tauri's Rust requirement is mild if the Rust side stays a thin shell that spawns sidecars; a solo developer who only knows TypeScript can use Electron's Node main process at the cost of about 150 to 300 MB download (estimate from the cited size comparisons).
- Windows 10 machines are the risk for Tauri: if WebView2 is missing, the installer must bootstrap it (needs internet, ~2 MB bootstrapper; offline mode adds ~127 MB).

### Gaps
- No primary source on WebCodecs `VideoEncoder`/H.264/AAC working inside WebView2 or Tauri. Needs a hands-on test.
- No source for WebView2 Runtime's current Chromium major version (the release-notes page content was not returned).
- Install sizes/friction for Stability Matrix, Jan, Handbrake, Shotcut, Kdenlive, OpenShot, Clipchamp, Descript were not researched in this pass.
- Wails, Neutralino, NW.js, PWA-install not researched with sources.

## 2. Running AI locally from a desktop app: runtimes, licences, hardware budgets

### Takeaway
All the runtime layers (ONNX Runtime/DirectML, whisper.cpp, llama.cpp, Vulkan/OpenVINO paths) are MIT-style and can run on CPU or any DX12/Vulkan GPU, so captions (Whisper) and small TTS (Kokoro) are realistic on 8 GB laptops. Avatars and voice cloning are the hard part: practical models want NVIDIA CUDA and several have non-commercial licences or weights.

### Cited Findings
- DirectML: "DirectML is in maintenance mode"; no new features, only security/compliance fixes; recommends Windows ML on newer Windows 11; requires a DirectX 12 device (AMD GCN 1st gen+, Intel Haswell HD Graphics+, NVIDIA Kepler+); repo is MIT — [microsoft/DirectML](https://github.com/microsoft/DirectML). Microsoft Learn calls it "sustained engineering" and says Windows ML is where new work goes (search snippet) — [Microsoft Learn DirectML](https://learn.microsoft.com/lt-lt/windows/ai/directml/dml-min-app)
- whisper.cpp: MIT; backends Vulkan ("cross-vendor"), CUDA (cuBLAS), OpenVINO encoder (Intel CPUs and GPUs); approximate memory: tiny 75 MiB disk / ~273 MB RAM, base 142 MiB / ~388 MB, small 466 MiB / ~852 MB; supports integer quantization — [ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp)
- The only whisper.cpp benchmark thread I found is on a 2010 Intel i5-460M; I did not read its numbers — [whisper.cpp discussion 3752](https://github.com/ggml-org/whisper.cpp/discussions/3752). Third-party blogs claim "small" is roughly 6x real time on a modern CPU (unverified setup, search snippet) — [openwhispr](https://openwhispr.com/blog/whisper-model-sizes-explained)
- Kokoro-82M: Apache-licensed weights, 82M parameters, 8 languages / 54 voices in v1.0 (page does not name languages, so Hindi/Nepali not confirmed) — [hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M). No laptop CPU real-time factor found; an Android-emulator CPU-only run gave RTF 0.58 (1.9 s audio in 1,075 ms), with an odd "~1.2 GB INT8" size claim (search snippet, treat with caution) — [soniqo benchmarks](https://soniqo.audio/benchmarks/android)
- Chatterbox (voice cloning): MIT; Turbo 350M params English-only, Nano 110M English-only (reported "3x realtime on 8 CPU cores"), Multilingual 500M with 23 languages including Hindi (Hindi has a dedicated finetune), Nepali not listed; no VRAM figures in the README; every output is watermarked with Resemble's Perth neural watermark; tested on Python 3.11 — [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox)
- XTTS-v2: licensed under Coqui Public Model License (CPML); 17 languages including Hindi; the model card does not state whether commercial use is allowed or give VRAM — [coqui/XTTS-v2](https://huggingface.co/coqui/XTTS-v2)
- LivePortrait: Windows supported through a one-click installer / `run_windows.bat`; README warns newer CUDA versions (12.4, 12.6) "may lead to unknown issues" and suggests CUDA 11.8; animals mode "ONLY tested on Linux and Windows with NVIDIA GPU"; no ms/frame figures on the main page (they are in a separate speed.md) — [KwaiVGI/LivePortrait](https://github.com/KwaiVGI/LivePortrait). Third parties say the code and weights are MIT but the default InsightFace buffalo_l detector is non-commercial; the Kijai ComfyUI README says switching to the MediaPipe detector makes everything MIT/Apache (search snippet, secondary) — [ComfyUI-LivePortraitKJ](https://github.com/kijai/ComfyUI-LivePortraitKJ); InsightFace's own pip page says pretrained models are "non-commercial research purposes only" (search snippet) — [pypi insightface](https://pypi.org/project/insightface/)
- Lip-sync licences (secondary, one blog, conflicts between sources): Wav2Lip not cleared for commercial use; SadTalker reported Apache-2.0 by one blog and MIT by vendor pages; MuseTalk reported as MIT with dependency caveats; LatentSync reported Apache-2.0 — [creativeainews](https://www.creativeainews.com/articles/open-source-lip-sync-licenses-commercial-use-2026/)
- Steam survey September 2026: VRAM 16 GB 27.21%, 8 GB 26.71%, 12 GB 13.06%, 24 GB 5.50%, 4 GB 5.13%, 6 GB 5.12%; RAM 32 GB 42.22%, 16 GB 37.82%, 8 GB 6.47%; RTX 3050 2.77%, GTX 1650 2.10%, Intel Iris Xe 1.50% — [Steam Hardware Survey](https://store.steampowered.com/hwsurvey/)
- Buzz uses Vulkan whisper.cpp on integrated GPUs and CUDA on NVIDIA (see section 1 source).

### Inferences
- CPU-only, 8 GB RAM, feasible (estimate): Whisper base/small via whisper.cpp (under 1 GB RAM per the cited table), Kokoro TTS, RNNoise, Real-ESRGAN/RIFE through ncnn-Vulkan (I did not source these two; verify licences and speed), FFmpeg editing. These are also what an in-browser build can mostly do already (WASM/WebGPU), so desktop adds speed and larger models, not new capability, for this tier.
- NVIDIA-required tier (estimate): LivePortrait-style avatars, XTTS/Chatterbox cloning at usable speed, any diffusion-based talking head. Models are CUDA/PyTorch-first, so a sidecar bundles Python + torch (multi-GB; the 2 to 3 GB figure for CUDA wheels in the brief is not independently verified here).
- Licence screen for the "MIT app" rule (verify each LICENSE file): usable: Kokoro (Apache), Chatterbox (MIT, but forced watermark; watermarking is compatible with the "AI-generated" reminder rule), whisper.cpp, DirectML, ONNX Runtime; problem: XTTS-v2 (CPML), Wav2Lip, LivePortrait with InsightFace weights, F5-TTS weights (not researched, verify).
- Using a 4 GB VRAM floor, only about 5% of Steam users (global, gamers) have exactly 4 GB; 8 GB or more is about 73% of that population. Steam skews toward gamers and has no India/Nepal breakdown, so this overstates the target market (estimate).

### Gaps
- No dated benchmarks found for RTX 3050/1650/2050 4 GB running LivePortrait, Chatterbox or XTTS; the search returned none. Any claim of "runs on 4 GB" must be treated as unverified until tested.
- No iGPU benchmark data for Whisper/Kokoro found beyond Buzz's claim of Vulkan support.
- llama.cpp, OpenVINO (Intel iGPU) details, PyTorch wheel sizes, Windows ML specifics, RNNoise/Real-ESRGAN/RIFE licences were not fetched.

## 3. Native video pipeline: FFmpeg, hardware encoders, codec licensing

### Takeaway
An MIT app can bundle or download an LGPL FFmpeg build (dynamic linking, source offer, notices) and must avoid libx264/libx265 and fdk-aac; H.264 would then come from hardware encoders (NVENC/QSV/AMF) or OpenH264. Patent exposure for H.264/AAC is a real but unquantified risk for commercial products; FFmpeg's own page says private use has "remarkably little reason to be concerned".

### Cited Findings
- FFmpeg is LGPL 2.1 or later but optional parts are GPL: "If those parts get used the GPL applies to all of FFmpeg." LGPL checklist: compile without `--enable-gpl` and `--enable-nonfree`, no GPL libraries "notably libx264", dynamic linking (DLLs), ship matching source, mention FFmpeg's LGPLv2.1 licence in website/about box/EULA, do not rename DLLs to obfuscate. FFmpeg is not offered under other terms even for payment — [FFmpeg legal](https://ffmpeg.org/legal.html)
- Patents: FFmpeg authors "don't know" whether it uses patented algorithms and aren't lawyers; for MPEG-4 conformance "may require use of an invention covered by patent rights"; many countries do not recognize algorithm patents; private personal use has "remarkably little reason to be concerned"; for commercial products patent owners may seek fees and MPEG LA is named as "vigilant and diligent" — [FFmpeg legal](https://ffmpeg.org/legal.html)
- BtbN FFmpeg-Builds (repo MIT): `gpl` variant includes GPL-only deps; `lgpl` variant omits "most prominently libx264 and libx265"; `nonfree` adds fdk-aac; shared variants exist for dynamic linking; Windows builds target Windows 7+ with UCRT, minimum supported Windows 10 22H2; the page does not say whether NVENC/QSV/AMF are in LGPL builds — [BtbN/FFmpeg-Builds](https://github.com/BtbN/FFmpeg-Builds)
- OpenH264 (Cisco): BSD-2-Clause; the README says nothing about patent/royalty cover — [cisco/openh264](https://github.com/cisco/openh264)
- Chrome's WebCodecs bug tracker has a Windows AMD hardware HEVC encoder flagging issue (Mediabunny-related list, search snippet) — [Remotion/Mediabunny WebCodecs bugs](https://convert.remotion.dev/docs/mediabunny/webcodecs-bugs)

### Inferences
- Speed: the web build already hits about 70 fps on flat scenes (from the brief), and Chrome's WebCodecs on Windows uses Media Foundation hardware encoders, so a native FFmpeg NVENC path is unlikely to beat it by a large factor for simple 9:16 30 s clips; the real native gains are HEVC/ProRes/MKV decode of arbitrary user footage, no tab memory cap, and AAC without browser quirks. This is my estimate; no benchmark was found. Test before committing.
- Safest legal shape: LGPL shared FFmpeg downloaded at first run (not bundled) + hardware encoders; fallback to OpenH264 or to the browser's WebCodecs inside the WebView. Whether NVENC/QSV/AMF can be enabled in an LGPL build: my understanding is yes (they use external headers, no `--enable-nonfree` needed), but the FFmpeg wiki page (HWAccelIntro) was blocked by an Anubis check, so verify.
- H.264/AAC patent licensing: I found no authoritative current statement on MPEG LA/Via LA terms for a free open-source app that does not distribute encoders. Mark verify; relying on OS/hardware encoders pushes the licence obligation to the OS/GPU vendor (inference).

### Gaps
- FFmpeg HWAccelIntro licence notes for NVENC/AMF/QSV (page blocked).
- No measured WebCodecs vs FFmpeg+NVENC/QSV throughput on 2026 hardware.
- Current H.264/AAC patent pool terms for open-source distribution.

## 4. Hybrid option: optional local "Introcut Engine" helper on localhost

### Takeaway
Since Chrome 142 (Oct 2025) a public HTTPS site can reach localhost only after a user permission prompt (Local Network Access), so the hybrid works in Chrome/Edge with one extra click, works in Firefox, and is unreliable in Safari. It reuses 100% of the web UI but you now own an installer, a signed local server and a security model, so it is not simpler than a Tauri shell.

### Cited Findings
- LNA: loopback (127.0.0.0/8) is treated as local; public-site requests to it need the LNA permission; Chrome developer blog (update dated 2025-09-29) says the prompt launches in Chrome 142; covers fetch(), subresources and subframe navigations; LNA replaces the earlier Private Network Access preflight design (gating is a user permission, not a header); requests are exempt from mixed-content checks when Chrome knows in advance the target is local (private IP literals, `.local`, or fetch with `targetAddressSpace: "local"`), and the article's examples don't explicitly cover 127.0.0.1; WebSocket connections were not yet gated in Chrome 138; Service/Shared Workers need prior permission — [Chrome for Developers, Local Network Access](https://developer.chrome.com/blog/local-network-access)
- Secondary: enforced in Chromium browsers (Edge, Brave, Opera too) since 142, released 2025-10-28; a denied prompt makes fetch reject with a network error; from Chrome 145 the site setting split into `loopback-network` ("Apps on device") and `local-network`; enterprise policies can pre-allow origins — [Dynamsoft FAQ](https://dynamsoft.com/web-twain/docs/faq/chromium-142-local-network-access-issue.html) (search snippet), [OpenReplay](https://blog.openreplay.com/chrome-local-network-access-lna-permission/) (search snippet)
- Firefox localhost mixed-content blocking fixed in Firefox 55 (and `http://localhost` not treated as mixed content from Firefox 84); Safari/WebKit still rejects requests to localhost from https pages, with a WebKit bug reporting a Safari 18 beta regression (community reports, search snippet) — [Mozilla bug 1370861](https://bugzilla.mozilla.org/show_bug.cgi?id=1370861), [WebKit bug 173161](https://bugs.webkit.org/show_bug.cgi?id=173161)

### Inferences
- Target users are mostly on Chrome/Edge on Windows (assumption; no browser-share data for Nepal fetched), so Safari failure matters mainly for Mac/iOS users who are outside a Windows-focused plan anyway.
- Helper security checklist (my design, based on how Ollama-style servers work; I could not fetch the Ollama FAQ, so the precedent is unverified): bind to 127.0.0.1 only; random per-install token in an Authorization header; strict Origin allowlist (only introcut.app); no wildcard CORS; reject DNS-rebinding by checking Host header; file access limited to a user-chosen folder; UI shows connect/permission state.
- Complexity (estimate): the helper needs the same installer, signing and update work as a desktop app, plus pairing UX and LNA permission handling, plus the web UI must handle "helper missing/old version" states. Benefit over Tauri: users can keep using the hosted site and updates to the UI are instant; cost: three moving parts (site, helper, models) and Chrome policy risk (LNA rules have already changed twice: 138 flag, 142 prompt, 145 split).

### Gaps
- Ollama/Jupyter/local TTS server precedents (OLLAMA_ORIGINS etc.) not verified; the FAQ URL returned 404.
- Whether LNA prompt appears for WebSocket in current Chrome stable not confirmed from a primary source.
- Behavior on Windows 10 Edge/Chrome versions (older Chromium) not covered.

## 5. Distribution on Windows with zero money: signing, SmartScreen, stores, updates, hosting

### Takeaway
Do not count on Microsoft's Artifact Signing: for individuals, Public Trust is limited to the US and Canada. SignPath Foundation free signing for OSI-licensed projects and the free Microsoft Store (MSIX, Microsoft signs) are the realistic zero-cost routes; unsigned installs work but show SmartScreen warnings.

### Cited Findings
- Artifact Signing (formerly Trusted Signing): "Public Trust certificates are available to organizations in the United States, Canada, the European Union, the United Kingdom, Australia, New Zealand, Japan, South Korea, Singapore, Switzerland, Norway, and Israel. Individual developers must be located in the United States or Canada. These geographic restrictions do not apply to Private Trust certificates." Individual validation uses the Azure billing account (type Individual) and government ID via AU10TIX; Private identity validation "is only for Organizations". Page updated 2026-10-08. Nepal is not listed. Pricing is selected as a Basic/Premium SKU on an Azure subscription (so an Azure account, usually requiring a payment card, is needed; verify) — [Microsoft Learn, Artifact Signing quickstart](https://learn.microsoft.com/azure/artifact-signing/quickstart)
- SignPath Foundation terms: OSI-approved licence "without commercial dual-licensing for all components"; "actively maintained"; "already released in the form that should be signed"; described on its download page; binaries "built from source code in a verifiable way"; "Every release needs manual approval for signing"; MFA for all team members; SignPath Foundation is the publisher shown on the certificate; home page must carry a code signing policy with "Free code signing provided by" credit; Foundation may pause/end the subscription "without prior notice" and revoke certificates "effective immediately or retroactively"; no fees stated; code of conduct still draft — [SignPath Foundation terms](https://signpath.org/terms)
- Microsoft Store: individual developer registration is free, no credit card, "nearly 200 markets" (Nepal not named, verify); Store signs packaged apps for free; Win32 apps allowed; free hosting/signing/updates tied to MSIX packaging. May 2026 post says company registration is also free — [Windows Developer Blog 2025-09-10](https://blogs.windows.com/windowsdeveloper/2025/09/10/free-developer-registration-for-individual-developers-on-microsoft-store/), [Windows Developer Blog 2026-05-07 (search snippet)](https://blogs.windows.com/windowsdeveloper/2026/05/07/publish-to-microsoft-store-as-a-company-now-with-free-registration-and-faster-onboarding/)
- SmartScreen: unsigned files must build reputation per new version starting from zero; signing does not guarantee instant pass; no public reputation threshold; users can click "More info" then "Run anyway"; Store installs avoid the warning (search snippet) — [Microsoft Learn, SmartScreen reputation](https://learn.microsoft.com/et-ee/windows/apps/package-and-deploy/smartscreen-reputation), [OpenScreen PR](https://github.com/getopenscreen/openscreen/pull/285/files)
- GitHub Releases: each asset must be smaller than 2 GiB, up to 1,000 assets per release, "no limit on the total size of a release, nor bandwidth usage" — [GitHub Docs](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
- Updates: Tauri updater with `latest.json` on GitHub Releases (see section 1). Buzz ships unsigned and still has a user base (see section 1).

### Inferences
- Ranking for a Nepal-based solo dev at zero cost: (1) Microsoft Store MSIX if Nepal is an eligible market and the free registration holds (verify); (2) SignPath Foundation after the project has a public release, an MIT licence and CI-built artifacts (note: the terms exclude commercial dual-licensing, which fits MIT; the "Foundation is the publisher" name on the certificate is a trade-off); (3) unsigned GitHub Release/winget with checksums and a README explaining the SmartScreen click-through.
- A Windows Smart App Control mode (if enabled on some Windows 11 machines) can block unsigned apps entirely; I did not source this: verify. It would make "unsigned" unacceptable for some users.
- Antivirus false positives on unsigned, freshly built Tauri/PyInstaller binaries are plausible but I found no source quantifying it (gap); submitting to Microsoft Defender's false-positive portal is the usual fix.
- Model hosting: Hugging Face first-run downloads are the standard route (no source fetched on HF terms/bandwidth; verify). Keep the installer small (Tauri) and download FFmpeg and models later, so each GitHub asset stays well below 2 GiB.

### Gaps
- Whether Nepal is among the Microsoft Store individual markets; Azure account card requirement for Nepal; winget/Scoop/Chocolatey submission rules and moderation delays; Smart App Control behavior; AV false-positive rates; Hugging Face download limits.

## 6. Hardware and OS reality in Nepal/India

### Takeaway
Nepal browsing traffic is about two-thirds mobile; desktop is about 34 to 43% depending on month. Of desktop Windows, about 61% Windows 11 and 39% Windows 10 (StatCounter Sept 2026), so a Windows-only desktop app addresses a minority of Nepal's traffic. There is no good data on RAM/GPU in the target market, and retail guides suggest 8 GB RAM, Core i3/i5 or Ryzen 3/5, integrated graphics is the norm.

### Cited Findings
- Nepal September 2026: mobile 65.11%, desktop 34.4%, tablet 0.49% — [StatCounter, Nepal platform share](https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/nepal). Snippets for other months: August 2026 desktop 42.57% / mobile 57.43%; June 2026 desktop 37.61% / mobile 62.39%; Windows as an OS about 28.8% vs Android 46.6% (August 2026) — [StatCounter Nepal OS share (search snippet)](https://gs.statcounter.com/os-market-share/desktop-mobile-tablet-console/nepal)
- Nepal desktop Windows versions, September 2026: Windows 11 60.88%, Windows 10 39%, Windows 7 0.08% — [StatCounter Nepal Windows versions](https://gs.statcounter.com/windows-version-market-share/desktop/nepal)
- Steam Hardware Survey September 2026 (global gamers, no India/Nepal breakdown): Windows 11 71.34%, Windows 10 23.61%; VRAM and RAM distributions as listed in section 2 — [Steam Hardware Survey](https://store.steampowered.com/hwsurvey/)
- Retail buying guides for Nepal students: Core i3/i5 or Ryzen 3/5, 8 GB RAM as the "sweet spot", 256 to 512 GB SSD, Acer Aspire, Lenovo IdeaPad, HP, Asus VivoBook, Dell; some sources low reliability, no formal survey (search snippet) — [Gadgetbyte Nepal](https://gadgetbytenepal.com/best-laptop-for-students-nepal/), [Nepali Telecom](https://www.nepalitelecom.com/best-laptops-in-nepal)
- Windows 10: end of support was 2025-10-14; consumer ESU originally to 2026-10-13, reportedly extended to 2027-10-12 per a June 2026 Microsoft update (secondary reporting, verify) — [Pureinfotech](https://pureinfotech.com/windows-10-esu-extended-2027-microsoft-update/), [TechRepublic ESU](https://www.techrepublic.com/article/news-windows-10-esu-cheat-sheet/)

### Inferences (estimates, not data)
- Share of Introcut's likely audience that could run a 4 GB-VRAM CUDA model: only laptops with an entry NVIDIA dGPU (GTX 1650/RTX 3050 class) qualify. Retail guides point to mostly integrated graphics at the budget tier, so my rough guess is 10 to 20% of Nepali Windows laptop users, with no source; treat as a hypothesis to test with an in-app opt-in survey or hardware probe (WebGPU adapter info exposes some of this already).
- Realistic split: roughly one third of Nepal web traffic is desktop; only the Windows subset of that can use a Windows app; of those, a minority have an NVIDIA GPU. So the "GPU avatar for everyone" story reaches single-digit to low-teens percent of total users; CPU-friendly features (captions, TTS, export) reach all Windows desktop users.
- Mobile-first audience: dropping Android/iOS (PWA) for a Windows-only app cuts off the majority of Nepal traffic. Keep the web app as the primary product.

### Gaps
- No India-specific StatCounter or Steam data fetched; no Nepal laptop-spec survey; no data on the share of Nepali laptops with NVIDIA GPUs or 8 GB RAM.
- StatCounter measures web visits, not device ownership.

## 7. Effort, maintenance and costs (estimates)

### Takeaway
A Tauri shell around the existing app is about 3 to 6 working days for a basic installable build; adding a downloadable FFmpeg sidecar and update/signing pipeline brings it to about 2 to 4 weeks; a Python/CUDA avatar sidecar adds weeks and the largest support burden. All of these numbers are my estimates, not sourced.

### Cited Findings
- Tauri requires separate sidecar binaries per target triple, installer building for MSI only on Windows, and a mandatory updater signing key whose loss blocks updates — see section 1 sources ([sidecar](https://v2.tauri.app/develop/sidecar/), [installer](https://v2.tauri.app/distribute/windows-installer/), [updater](https://v2.tauri.app/plugin/updater/)).
- Every SignPath release needs manual approval and MFA (see section 5) — [SignPath terms](https://signpath.org/terms)
- ComfyUI Desktop needs about 15 GB disk and NVIDIA GPU; Pinokio apps can need 50 to 100 GB (see section 1) — [ComfyUI docs](https://docs.comfy.org/installation/desktop/windows), [Pinokio wiki](https://github.com/6Morpheus6/pinokio-wiki)

### Inferences (estimates, no source)
- Wrap the app in Tauri (scaffold, point at `dist`, fix paths, file dialogs, OPFS vs native FS decision, Google sign-in redirect handling inside a webview): 3 to 6 days. Google Identity Services may not work inside a webview origin like `tauri://localhost` without configuration; verify, since it could force an external-browser OAuth flow (extra 2 to 4 days).
- Add FFmpeg sidecar (download-on-first-run, progress UI, LGPL notices, export via native path): 5 to 10 days.
- Add auto-update + CI release pipeline + store/SignPath onboarding: 4 to 8 days, plus waiting time.
- Add a Python/CUDA avatar or cloning sidecar (model downloader, GPU detection, queue, error handling, VRAM checks, cancellation): 3 to 6 weeks, plus ongoing breakage from CUDA/driver/torch versions.
- Testing matrix: Windows 10 vs 11, WebView2 present vs absent, NVIDIA vs AMD vs Intel iGPU, 8 GB vs 16 GB RAM, with/without admin rights, installer vs MSIX: far more than a web app's browser matrix. A solo developer can only cover this with a small volunteer tester pool.
- Ongoing cost: no money cost if GitHub Releases + free signing are used, but a continuing time cost for each Chromium/WebView2, CUDA, FFmpeg and model update; support issues (drivers, antivirus, SmartScreen) land on the developer.
- Staying web-only plus free cloud GPU (user's own Hugging Face Space, as already allowed by the hard rules) avoids the installer and signing problem but moves the problem to cold starts, quotas and privacy; not researched in this pass.

### Gaps
- No empirical numbers; all effort figures above are judgment calls to be validated by the first experiment.
- Cloud/free GPU alternatives (HF Spaces ZeroGPU, Colab, Kaggle) not researched here.

## 8. Verdict: which route for V1, what each unlocks, smallest first experiment

### Takeaway
Recommendation: keep the web app as the product for V1; add a Tauri-based Windows build only as an optional "Introcut for Windows" in a later milestone, starting with a small experiment that proves WebCodecs and a CPU sidecar work. Defer GPU avatar and voice cloning to an opt-in Engine, because they are the features that need NVIDIA, carry licence risk, and reach the fewest users.

### Cited Findings
- Minimum facts supporting this: Windows desktop is a minority of Nepal traffic (mobile 65.11% in September 2026) — [StatCounter](https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/nepal); Artifact Signing is not open to Nepal-based individuals for Public Trust — [Microsoft Learn](https://learn.microsoft.com/azure/artifact-signing/quickstart); SignPath Foundation and Microsoft Store routes are free but conditional — [SignPath](https://signpath.org/terms), [Windows Developer Blog](https://blogs.windows.com/windowsdeveloper/2025/09/10/free-developer-registration-for-individual-developers-on-microsoft-store/); LNA now requires a permission prompt for web-to-localhost — [Chrome for Developers](https://developer.chrome.com/blog/local-network-access)

### Inferences
- Route comparison (judgment):
  - Web only: zero install, covers mobile and all desktops; unlocks captions via WASM/WebGPU, TTS via kokoro-js, export. Does not unlock GPU avatar or cloning. Cost: none beyond today.
  - Web + local helper (Engine): reuses the hosted UI; unlocks GPU features for Chrome/Edge Windows users with NVIDIA; adds LNA prompt, token pairing, installer/signing, and three-part support. Medium effort, medium security surface.
  - Windows app (Tauri): best UX for large files and native FFmpeg, one installer, offline models; loses Android/iOS/Mac reach and adds signing/AV/SmartScreen friction; two release channels to maintain.
  - Defer: lowest risk; V1 stays within hard rules; honest limits ("avatar not in V1").
- Suggested path: (1) V1 ships web-only with CPU-friendly local AI (Whisper, Kokoro TTS) and "bring your own clips" as the main story. (2) Experiment 1 (about 1 to 2 days, near zero cost): build a Tauri v2 shell with no sidecar; verify on one Windows 10 and one Windows 11 low-end laptop that `VideoEncoder.isConfigSupported` for H.264/AAC works, OPFS works, Google sign-in works, install size is under about 15 MB, and measure export fps against the browser. (3) Experiment 2 (about 3 to 5 days): add an LGPL FFmpeg sidecar downloaded at first run to export one 30 s clip via NVENC/QSV/AMF vs WebCodecs, and record timing and failure modes on the owner's 8 GB machine. (4) Experiment 3 (only if 1 and 2 pass): local voice via a Python-free route first (Kokoro ONNX sidecar or whisper.cpp binary), not cloning; evaluate Chatterbox on a 4 GB card and record the real VRAM and speed before promising anything.
- What each unlocks: Windows app/Engine with CPU sidecars -> offline TTS, offline Whisper alignment, HEVC/any-codec import, big-file export. NVIDIA tier -> voice cloning (Chatterbox/other MIT) and avatars (only after licence-clean models are chosen; LivePortrait needs a non-InsightFace detector path, verify).
- Mac/Linux exclusion: a Tauri build would target Windows only at first (Tauri itself is cross-platform, so macOS/Linux builds are possible later); the web app remains the cross-platform path, so exclusion is a limit of the desktop channel, not of the product.
- The owner's "web is hard for heavy AI" concern is valid for avatars and cloning, but those are also the hardest for desktop (CUDA, driver, licence, size). A desktop app mostly removes memory and codec limits; it does not by itself make avatars feasible on 8 GB laptops without NVIDIA graphics.

### Gaps
- Unverified items that gate the verdict: WebCodecs in WebView2, Google sign-in inside Tauri, Nepal eligibility for Microsoft Store, 4 GB-VRAM benchmarks for the avatar/clone models, current H.264/AAC licensing exposure, iGPU performance of Whisper/Kokoro.
