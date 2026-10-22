# Cross-platform desktop installers for Introcut (macOS, Linux, Windows recheck) and local AI hardware support — as of 2026-10-22

Scope note: Windows items already researched earlier (Artifact Signing exclusion, SignPath, SmartScreen, Store, FFmpeg LGPL, GitHub 2 GiB limit) are not repeated. Many fetches below were summarised by a fetch tool; quotes are as returned and should be spot-checked ("verify") before being used in public copy.

## 1. macOS distribution: Apple Developer Program, signing, notarisation, Gatekeeper

### Takeaway
Apple's official docs state a fee of USD 99/year for individuals with a legal-age Apple Account with 2FA; the fee waiver explicitly excludes individuals. No official page I could fetch lists Nepal as supported or unsupported, so Nepal enrolment is unconfirmed ("verify" by starting the enrolment flow). The enrolment page says that if the region has no Apple Store Online, you pay with a credit card chargeable in USD. Unsigned/un-notarised apps can still be run by users via System Settings > Privacy & Security > Open Anyway, but the old Control-click Open shortcut was removed in Sequoia (2024 reports). So a zero-budget macOS build is possible but with friction; a notarised build costs USD 99/year with a card.

### Cited Findings
- Fee: "The Apple Developer Program annual fee is 99 USD ... in local currency where available. Prices may vary by region and are listed in local currency during the enrollment process." — [Apple enrollment support](https://developer.apple.com/support/enrollment/)
- Individual requirement: "you'll need an Apple Account with two-factor authentication turned on and be the legal age of majority in your region." Legal name must be used, alias/nickname causes delays. — [Apple: Enroll](https://developer.apple.com/programs/enroll/)
- Payment rules: "If you're paying by credit card and enrolling as an individual, you must use your own credit card ... If you do not, your enrollment will be delayed and you'll be asked for a copy of your government-issued photo identification." And: "If Apple Developer products are not available on your region's Apple Store Online, you'll be presented with a credit card form. Please make your purchase with a credit card that can be charged in USD." — [Apple enrollment support](https://developer.apple.com/support/enrollment/)
- Apple's enrolment pages do not publish a country list. They say only: "Enrollment may not be supported in certain regions, for example due to sanctions or other restrictions." (and "Enrollment in India is only available through the Apple Developer app"). Nepal is not mentioned. — [Apple enrollment support](https://developer.apple.com/support/enrollment/), [Apple help: program enrollment](https://developer.apple.com/help/account/membership/program-enrollment/)
- Fee waiver does NOT apply to a solo developer: eligible are nonprofits, accredited educational institutions, government entities; "Not be an individual, sole proprietor, or single-person business". — [Apple fee waiver](https://developer.apple.com/support/membership-fee-waiver/)
- Apple.com "choose your country/region" Asia-Pacific list did not include Nepal (it also omitted India, so the list may be truncated by the fetch; weak evidence, "verify"; relevant only in that Nepal likely has no Apple Store Online, which triggers the USD credit-card form above). — [Apple choose country](https://www.apple.com/choose-country-region/)
- Nepal-specific reports are anecdotal: a search summary of Apple Developer Forums threads says a Nepal developer's enrolment stayed "Pending" for 4+ days with no support reply, and another user reported the same after trying multiple cards; another thread (undated) from a Nepali developer says Nepali banks don't allow international payment without CVV. I could not open the threads (login redirect). — [forum thread 749344](https://developer.apple.com/forums/thread/749344), [forum thread 674836](https://developer.apple.com/forums/thread/674836)
- Nepal payment side: reports say NRB-permitted USD prepaid cards are capped (USD 500/year in one outlet, up to USD 5,000 if you earn from an online business; developer accounts are named among permitted purchases). Secondary news sources, "verify" with a Nepali bank. — [Nepali Telecom, 2021](https://nepalitelecom.com/2021/03/nrb-international-payment-from-nepal-using-a-prepaid-card.html), [ShareSansar, 2020](https://www.sharesansar.com/newsdetail/international-payment-finally-allowed-in-nepal-nrb-approves-nepalese-equivalent-of-paypal-and-payoneer-2020-12-29)
- Tauri macOS signing: signing needed "to prevent a warning that your application is broken and can not be started, when downloaded from the browser"; needs Apple Developer account (paid $99 for distribution; free account only for testing); "Developer ID Application" certificate for outside-App-Store distribution; "Notarization is required when using a Developer ID Application certificate"; a free account cannot notarise and the app "will still appear unverified"; you also need an Apple device to sign. — [Tauri v2: macOS code signing](https://v2.tauri.app/distribute/sign/macos/)
- Tauri ad-hoc signing: set `signingIdentity` to `-`; useful on Apple Silicon where all apps from the internet must be signed; it does not remove the Gatekeeper prompt, users may need to approve in Privacy & Security. — [Tauri v2: macOS code signing](https://v2.tauri.app/distribute/sign/macos/)
- Tauri distribution page: dmg requires code signing and notarisation; App Store requires code signing. — [Tauri v2: Distribute](https://v2.tauri.app/distribute/)
- Electron: "Enroll in the Apple Developer Program (requires an annual fee)"; also "Squirrel.Mac requires the app to be signed for automatic updates to work at all." So Electron auto-update on macOS needs paid signing too. — [Electron code signing](https://www.electronjs.org/docs/latest/tutorial/code-signing)
- Apple's user flow for unnotarised apps: after the first blocked open, go to System Settings > Privacy & Security, scroll down, click "Open Anyway", confirm; app is then saved as an exception. The page does not mention Control-click. — [Apple Support 102445](https://support.apple.com/en-us/102445)
- Sequoia removed the Control-click bypass; workaround moved to System Settings (2024 coverage). I did not find coverage specific to macOS 26 (Tahoe); assume the same ("verify"). — [9to5Mac, Aug 2024](https://9to5mac.com/2024/08/13/security-bite-apple-finally-making-it-harder-to-override-gatekeeper-is-a-telling-move/), [Cult of Mac](https://www.cultofmac.com/864843/macos-sequoia-removes-handy-shortcut-bypass-gatekeeper-security/)
- Universal binaries: tauri-action's own example builds separate `--target aarch64-apple-darwin` and `--target x86_64-apple-darwin` artifacts; the README page fetched does not mention universal builds. — [tauri-action](https://github.com/tauri-apps/tauri-action)

### Inferences
- A Nepal-based solo developer likely hits the "no Apple Store Online, pay by USD-chargeable credit card in your own name" path. Whether Nepali-issued cards work is unconfirmed; failure modes reported anecdotally are pending enrolments and card declines.
- Zero-budget macOS route: ship an ad-hoc-signed, un-notarised DMG with a clear "Open Anyway" guide, or skip macOS and let Mac users use the web/PWA. Auto-update on Electron/macOS is not possible unsigned; Tauri's updater has its own minisign key (see section 3) and does not itself depend on Apple signing per its docs, but Apple Silicon and Gatekeeper behaviour on updated unsigned bundles is untested ("verify").
- Mac App Store route: I did not research it separately; it requires the same paid membership plus sandboxing, so it is not a zero-cost path.

### Gaps
- No official Apple list of enrolment-eligible countries; Nepal status unconfirmed. Forum threads were behind login.
- No dated user reports for macOS 26 (Tahoe) Gatekeeper behaviour on unsigned apps.
- Mac App Store review/sandbox rules for WebView apps not researched.

## 2. WKWebView (Tauri macOS) vs Chromium: WebCodecs, WebGPU, OPFS — will Introcut's export work?

### Takeaway
In Safari/WebKit 26 WebCodecs is listed as fully supported, WebGPU ships, and AudioEncoder/AudioDecoder were added in 26.0, so a Tauri macOS app on macOS 26 is plausible for WebCodecs MP4 export. But whether the WKWebView embedded in a Tauri app exposes the same features as Safari, and OPFS behaviour in WKWebView, were not verified; test, don't assume. Older macOS (WebKit <26) lacks AudioEncoder, so AAC export would need Mediabunny's AAC polyfill.

### Cited Findings
- Tauri on macOS uses the OS WKWebView, updated only with OS updates, so users on older macOS get older WebKit. On Windows it is WebView2 (Chromium); on Linux WebKitGTK. — [Tauri v2: webview versions](https://v2.tauri.app/reference/webview-versions/)
- caniuse WebCodecs: Safari macOS and iOS "partial" 16.4-18.7, fully supported from 26.0; Chrome from 94; Firefox from 130 (desktop). Page doesn't define what "partial" means. — [caniuse: WebCodecs](https://caniuse.com/webcodecs)
- WebKit's Safari 26.0 feature post: "Safari 26.0 expands support for WebCodecs API by adding AudioEncoder and AudioDecoder." and "WebKit for Safari 26.0 adds support for WebGPU" (macOS, iOS, iPadOS, visionOS); also File System WritableStream API support. OPFS is not discussed in that post. — [WebKit: Safari 26.0 features](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)
- caniuse "native-filesystem-api" (the picker-based File System Access API) shows Safari unsupported; this does not describe OPFS (which is a separate feature) so it does not answer the OPFS question. — [caniuse: File System Access](https://caniuse.com/native-filesystem-api)
- Mediabunny: "In some browsers, AAC encoding is not supported by WebCodecs" and recommends the `@mediabunny/aac-encoder` polyfill; use `canEncode` to feature-test. (Mediabunny is MPL-2.0 per project rules; polyfill licences not checked.) — [Mediabunny: supported formats and codecs](https://mediabunny.dev/guide/supported-formats-and-codecs)
- Apple forum: WebGPU in WKWebView was reported to work once enabled by default on iOS 26 beta (WebKit engineer reply, beta era). — [Apple forums 770862](https://developer.apple.com/forums/thread/770862)
- Searches for "Tauri + WKWebView + WebCodecs" returned no first-hand reports. Third-party comparison articles (2026, low-quality/promotional, conflicting numbers) say WKWebView, WebView2 and WebKitGTK have different bug surfaces, and Electron keeps CSS/JS behaviour predictable. — [search results, e.g. Reintech comparison](https://reintech.io/blog/tauri-vs-electron-rust-desktop-apps)

### Inferences
- Electron bundles Chromium so WebCodecs/OPFS/WebGPU behaviour equals Chrome on every OS; that is the lowest-risk option for an app whose core feature (Canvas renderer + WebCodecs export + OPFS) is browser-feature-dependent. Tauri is safe only on Windows (WebView2) with certainty.
- Practical test: run Introcut's export inside a Tauri macOS build on macOS 26 and on macOS 14/15; check `VideoEncoder.isConfigSupported` for avc1, `AudioEncoder` for mp4a.40.2, OPFS `createSyncAccessHandle`.

### Gaps
- No source confirming VideoEncoder H.264 availability inside WKWebView (vs Safari app) or OPFS support in WKWebView. No macOS 26 WKWebView-specific WebCodecs test reports found.
- Market share of macOS versions among Mac users (how many have macOS 26) not found.

## 3. Linux distribution: packaging, WebKitGTK limits, Electron

### Takeaway
Tauri supports AppImage, .deb, .rpm, Flatpak (via Flathub) and Snap; no code signing is expected on Linux. Tauri on Linux uses WebKitGTK whose WebCodecs support is unconfirmed (only an internal encoder note in a development release), so Electron is likely the practical Linux option for a WebCodecs-dependent app. Flathub explicitly rejects "thin wrappers, and simple web wrappers".

### Cited Findings
- Tauri Linux targets: AppImage, deb, rpm, Flatpak (Flathub), Snap (Snapcraft), AUR. — [Tauri v2: Distribute](https://v2.tauri.app/distribute/)
- Tauri Linux webview is WebKitGTK; docs say it is "very hard to compile accurate information about WebKitGTK on the various distros"; table lists versions 2.20 to 2.36 (Ubuntu 22.04 era). — [Tauri v2: webview versions](https://v2.tauri.app/reference/webview-versions/)
- WebKitGTK 2.52 stable series exists (2.52.2 April 2026, 2.52.4 June 2026; Ubuntu/Oracle packages list 2.52.3). The only WebCodecs item found in release notes: 2.51.92 (Feb 2026) "Support for rotation and mirroring in internal WebCodecs encoder." No release note found that says VideoEncoder is exposed to web content. — [WebKitGTK 2.51.92](https://webkitgtk.org/2026/02/27/webkitgtk2.51.92-released.html), [WebKitGTK 2.52.2](https://webkitgtk.org/2026/04/13/webkitgtk2.52.2-released.html), [WebKitGTK 2.52.4](https://webkitgtk.org/2026/06/02/webkitgtk2.52.4-released.html)
- Tauri's own Linux graphics page documents WebKitGTK/DMABUF renderer problems (blank windows, flicker, mostly NVIDIA) and slow-path canvas/WebGL. — [Tauri v2: Linux graphics issues](https://v2.tauri.app/develop/debug/linux-graphics/)
- Flathub: content must allow redistribution; permissive licences recommended for manifests; app ID must be reverse-DNS tied to a project domain, HTTPS-reachable, may need token at `/.well-known/org.flathub.VerifiedApps.txt`; "Submissions are accepted at the discretion of the reviewers"; "Console software, thin wrappers, and simple web wrappers are rejected". The page mentions no fees and says nothing about Electron/Tauri. — [Flathub requirements](https://docs.flathub.org/docs/for-app-authors/requirements)
- Electron ships its own ffmpeg with proprietary codecs for Linux (a SlackBuilds package describes using a separately provided Electron ffmpeg), but I found no source confirming whether Electron Linux exposes H.264 via WebCodecs `VideoEncoder`. W3C notes AVC support is optional in WebCodecs implementations. — [SlackBuilds vivaldi-altffmpeg](https://slackbuilds.org/repository/15.0/network/vivaldi-altffmpeg/), [W3C AVC registration](https://www.w3.org/TR/2021/WD-webcodecs-avc-codec-registration-20210408)
- Firefox shipped VideoEncoder on Linux in 123 (context only, not Electron). — [Mozilla bug 1749047](https://bugzilla.mozilla.org/show_bug.cgi?id=1749047)
- Linux code signing/auto-update in Electron docs: not covered by the Electron signing page fetched. Tauri updater works on Linux per its platform table (support levels not captured). — [Electron code signing](https://www.electronjs.org/docs/latest/tutorial/code-signing), [Tauri updater](https://v2.tauri.app/plugin/updater/)

### Inferences
- Linux users are 2.84% (Nepal) / 10.45% (India) of desktop traffic (section 5), so Linux is low priority; AppImage from GitHub Releases (no signing, no review) is the cheapest path. Flathub is a later, discretionary effort, and an Electron/Tauri shell around a web app risks the "web wrapper" rejection unless it adds real desktop functionality (local AI engines would help the case, speculation).
- Electron on Linux H.264 WebCodecs encode: unverified, so Introcut should fall back to VP9/AV1 WebM or a bundled FFmpeg (LGPL rules from earlier research) if `avc1` is unsupported.

### Gaps
- Whether WebKitGTK 2.52 exposes `VideoEncoder`, OPFS sync access handles, or WebGPU: not found.
- Snap store rules and AUR not researched. No Electron-on-Linux H.264 WebCodecs evidence.

## 4. One codebase for three platforms: Tauri vs Electron, CI, updates, sizes

### Takeaway
GitHub Actions is free for standard runners on public repos (all three OSes), and tauri-action builds all three and publishes to GitHub Releases with updater JSON. Tauri installers are far smaller but use three different webviews; Electron is bigger but one Chromium. I found no credible first-hand migration case studies.

### Cited Findings
- "GitHub Actions usage is free for self-hosted runners and for public repositories that use standard GitHub-hosted runners." "Larger runners are always charged for, even when used by public repositories." Billing page lists macOS 3/4-core (M1 or Intel) at $0.062/min for private repos. — [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
- GitHub-hosted runners come in Ubuntu, Windows and macOS. Concurrency/macOS limits not found on the page fetched. — [GitHub-hosted runners](https://docs.github.com/en/actions/concepts/runners/github-hosted-runners)
- tauri-action "builds your Tauri application as a native binary for macOS, Linux and Windows", can publish to GitHub Releases, and can upload the updater JSON. — [tauri-action](https://github.com/tauri-apps/tauri-action)
- Tauri updater: static `latest.json` on GitHub Releases is supported; signing with your own key pair is mandatory ("This cannot be disabled"); losing the private key means you cannot publish updates to installed copies; platform keys like `darwin-aarch64`, `windows-x86_64`; requires Rust 1.90+. — [Tauri v2: updater](https://v2.tauri.app/plugin/updater/)
- Sizes (2026 blog benchmarks, low reliability, conflicting): Tauri hello-world about 3 MB vs Electron about 85-96 MB; six-window app 8.6 MB vs 244 MB. Tauri's size excludes a bundled browser. — [search summary of tech-insider / noqta / reintech posts](https://tech-insider.org/tauri-vs-electron-2026/)
- Tauri requires Rust for the backend and slower first builds; Electron has the larger ecosystem and identical DevTools; file permissions, tray, code signing, deep links, crash reporting and auto-update "usually expose the real framework fit faster than hello-world bundle numbers" (opinion, secondary source). — [Reintech](https://reintech.io/blog/tauri-vs-electron-rust-desktop-apps)

### Inferences
- Effort estimates (my judgement, not sourced): Tauri wrap of an existing Vite app is about 0.5-1 day for a Windows build; Electron about the same since it is plain Node/JS. Real cost is per-OS testing and signing, and Tauri's three-webview QA.
- For local AI (Chatterbox is Python/PyTorch), either shell needs a sidecar process or a separately installed engine; Tauri has first-class sidecar docs (not fetched, "verify"); Electron can spawn child processes natively. Installer size for AI is dominated by model weights/Python runtime, not the shell.

### Gaps
- No first-hand Tauri/Electron migration experience reports; no tauri-action universal-binary doc; macOS runner concurrency for public repos not found; no authoritative installer-size numbers (only blog benchmarks).

## 5. Local AI on each OS

### Takeaway
Whisper (whisper.cpp) runs everywhere including Apple Silicon (Metal, Core ML/ANE), CPU, Vulkan (AMD/Intel/NVIDIA) and CUDA. Chatterbox: the repo supports CUDA/CPU in its README; Apple Silicon works via community MPS adaptations and an MLX port, with only one dated vendor benchmark (Chatterbox-Flash, English, M4, RTF 0.67-0.78). For the permissive avatar models, I found no verified Apple Silicon support for InfiniteTalk/MultiTalk/MuseTalk, and only a weights-only MLX checkpoint for EchoMimicV3 with no speed or memory data. Treat Mac avatar support as unproven.

### Cited Findings
- whisper.cpp (MIT): "the inference runs fully on the GPU via Metal" on Apple Silicon; encoder can run on the Apple Neural Engine via Core ML; Vulkan "cross-vendor solution"; CUDA; OpenVINO for Intel; platforms macOS (Intel+Arm), Linux, Windows. — [whisper.cpp](https://github.com/ggml-org/whisper.cpp)
- Chatterbox (MIT): README tested on Python 3.11 on Debian 11; examples use `device="cuda"`; a code comment lists `"cpu" / "mps"`; repo has `example_for_mac.py`; no ROCm mention; every output carries the Perth watermark. Nano variant "targets on-device and CPU inference" and is "3x faster than realtime on 8 CPU cores". — [Chatterbox repo](https://github.com/resemble-ai/chatterbox)
- Chatterbox-Flash (MIT, English tokenizer): "measured on a Mac M4 at the default configuration": MLX RTF 0.778, 4-bit MLX RTF 0.665 (RTF below 1 = faster than real time). Memory not stated. — [chatterbox-flash model card](https://huggingface.co/ResembleAI/chatterbox-flash)
- mlx-audio lists Chatterbox (16 languages) among supported models; I found no published RTF table for it. A community HF Space "Chatterbox-TTS Apple Silicon" claims speedups over CPU of roughly 2.5x (M1) to 3.5x (M4) with no methodology: unverified. — [mlx-audio mirror](https://upd.dev/Blaizzy/mlx-audio), [HF Space](https://huggingface.co/spaces/Jimmi42/chatterbox-tts-apple-silicon/blob/main/APPLE_SILICON_ADAPTATION_SUMMARY.md)
- EchoMimicV3 MLX: community native-MLX checkpoint (Avdpro), 20.7 GB, apache-2.0 with composite licence note; "weights only, needs a compatible EchoMimicV3 implementation"; no memory, speed or benchmark data; used by an "AI2Apps Model Worker". — [Avdpro/EchoMimicV3-MLX](https://huggingface.co/Avdpro/EchoMimicV3-MLX)
- A ComfyUI forum user on a Mac mini M4 reported several lip-sync workflows including the latest InfiniteTalk did not work on Apple Silicon (undated in results). — [ComfyUI forum](https://forum.comfy.org/t/lip-sync-workflow-for-mac-apple-silicon/3919)
- PyTorch MPS: Hugging Face docs say some ops are not implemented on MPS and `PYTORCH_ENABLE_MPS_FALLBACK=1` falls back to CPU. — [HF Transformers docs](https://huggingface.co/docs/transformers/main/en/perf_train_special)
- MuseTalk: only speed figure found is 30+ fps on NVIDIA V100 (third-party summary); no Mac evidence. — [PromptLayer summary](https://www.promptlayer.com/models/musetalk)
- AMD: PyTorch on Windows+Linux ROCm public preview announced 24 Sep 2025 for Radeon 7000/9000 and some Ryzen AI APUs; AMD notes dated 21 Jan 2026 update it to ROCm 7.2 (RX 9070/9070 XT/9060 XT/R9700/7900 XTX listed); docs say the full ROCm stack is not yet supported on Windows. — [AMD blog](https://www.amd.com/en/blogs/2025/the-road-to-rocm-on-radeon-for-windows-and-linux.html), [AMD release notes 7.2](https://www.amd.com/en/resources/support-articles/release-notes/RN-AMDGPU-WINDOWS-PYTORCH-7-2.html)

### Inferences
- Proven: whisper.cpp on Mac/Linux/Windows incl. AMD via Vulkan; Chatterbox-family TTS faster-than-real-time on a current M4 via MLX (English Flash variant).
- Unproven/speculation: original multilingual Chatterbox (needed for Hindi) speed on M1/M2 16 GB; any photo-avatar model on Mac. 20.7 GB weights for EchoMimicV3 MLX suggests 16 GB unified memory is insufficient (my inference; no source states memory use).
- Given 16 GB laptops dominate affordable hardware, local TTS+ASR is the realistic installer value; avatars should stay opt-in on user's own GPU or a HF Space (consistent with project rules).

### Gaps
- No dated benchmarks for Chatterbox (original) on M1/M2/M3; no memory figures for Chatterbox; nothing on InfiniteTalk/MultiTalk/MuseTalk on Mac; AMD support per model not verified; Linux CUDA/ROCm per-model checks not done.

## 6. Hardware survey: desktop OS share, Nepal and India

### Takeaway
Windows dominates desktop traffic in both countries, so Windows is the installer that matters; macOS is about 8% (Nepal) and 7% (India) of desktop, Linux is under 3% in Nepal but 10% in India.

### Cited Findings
- Nepal, desktop OS, September 2026 (StatCounter): Windows 89.03%, macOS 4.85%, OS X 3.08%, Linux 2.84%, Chrome OS 0.21%. — [StatCounter Nepal desktop](https://gs.statcounter.com/os-market-share/desktop/nepal)
- India, desktop OS, September 2026: Windows 82.31%, Linux 10.45%, macOS 4.14%, OS X 2.66%, Chrome OS 0.44%. — [StatCounter India desktop](https://gs.statcounter.com/os-market-share/desktop/india)

### Inferences
- StatCounter lists "macOS" and "OS X" separately (likely user-agent labels for the same platform family), so Apple combined is about 7.9% Nepal, 6.8% India (my sum). India's 10.45% Linux looks high and may include bot/cloud traffic ("verify"). StatCounter counts page views on its network of sites, not creators' laptops, and desktop is only the minority share of web use (earlier finding: 65% mobile in Nepal), so the data is directional only.

### Gaps
- No data on creator-specific laptop specs (RAM/GPU) in Nepal/India; no macOS-version split.

## 7. Recommendation (marked as judgement)

### Takeaway
Windows first; Electron is the safest shell for cross-platform parity (Chromium WebCodecs/OPFS), Tauri is better only if Windows-first and size matters. Do not pay for Apple now; ship Mac and Linux as unsigned or web/PWA fallbacks until Mac demand is shown.

### Inferences (judgement from the cited findings above)
- Order: (1) Windows installer (89% of Nepal desktop traffic); (2) Linux AppImage via GitHub Releases, no signing needed, only if Electron (WebKitGTK unverified); (3) macOS only after users ask, because notarisation needs a USD 99/year membership that Nepal enrolment/payment may block, and Electron auto-update on macOS cannot work unsigned.
- Shell choice: Electron if you want one codebase with identical media APIs on all three OSes and plan to spawn Python/whisper.cpp sidecars; accept ~85-100 MB installers (blog figures). Tauri if Windows-only at first (WebView2 is Chromium, ~3 MB shell) and willing to test macOS/Linux WebKit later.
- Zero-budget signing per OS: Windows: earlier research (unsigned/SmartScreen or SignPath). macOS: ad-hoc sign (`signingIdentity: "-"` in Tauri), document Open Anyway steps. Linux: none required. Tauri updater key is self-generated and free; back it up.
- First 2-day experiment: Day 1 — wrap introcut.app in Electron (and a Tauri build in parallel), GitHub Actions matrix on windows/ubuntu/macos runners (free for public repos), publish unsigned artifacts to a GitHub Release. Day 2 — run an in-app test page on each OS: `VideoEncoder.isConfigSupported({codec:'avc1.42001f',...})`, `AudioEncoder` mp4a.40.2, OPFS `createSyncAccessHandle`, full 30 s export; also whisper.cpp small model and Chatterbox on a 16 GB Mac and a CPU-only Windows laptop with timing (RTF). Decide shell from the pass/fail table.
- Before spending anything: open the Apple Developer enrolment flow with a Nepali account to see whether Nepal is accepted and what payment prompt appears (free to check, costs nothing until payment).

### Gaps
- Effort estimates are judgement, not sourced. Mac App Store, Snap and Microsoft Store (Nepal) routes not fully researched in this pass.
