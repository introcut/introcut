# Platform policy, legal and ethical risks of automated / AI-generated / faceless short videos (as of 22 Oct 2026)

Scope: research for Introcut product design (not legal advice; a lawyer is needed where flagged). Many pages changed in 2025-2026 and will change again; dates are given per claim. Evidence grades: [OFFICIAL] = read on the platform/government page by the researcher; [PRESS] = reputable outlet or law-firm note read via fetch/search; [BLOG] = vendor/agency blog, treat as weak; [ANECDOTE] = creator or opinion. Several official pages (Google Flow help, Kling terms, TikTok help-centre AI page, Copyright Office PDF) could not be read; those claims are marked "verify".

## 1. YouTube: inauthentic content (YPP), altered/synthetic disclosure, Shorts

### Takeaway
Since 15 July 2025 YouTube's YPP policy ("Generic or Repetitive Content", formerly "repetitious content") demonetises channels whose videos look templated or mass-produced; AI use itself is explicitly still eligible. Realistic AI content must be disclosed with the creator's "AI use" toggle, and since 27 May 2026 YouTube labels undisclosed photorealistic AI itself and puts the label directly on Shorts. Labels do not affect monetisation; repeated non-disclosure can.

### Cited Findings
- YPP page, section on generic/repetitive (inauthentic) content: channels cannot monetise content that "looks template-made or feels repetitive across several videos"; each video should add creative, educational or other value. Date of update: 15 July 2025, described as a minor clarification, reused-content policy unchanged. [OFFICIAL, fetched via summariser; exact wording should be re-read] — [YouTube channel monetization policies](https://support.google.com/youtube/answer/1311392)
- Listed as NOT eligible (lists are non-exhaustive): similar content with little educational value/commentary/narrative; "characters put in the same situation over and over again with the same outcome"; "image slideshows, templated storylines, or scrolling text with minimal or no narrative, commentary, or educational value"; "AI-generated content made with generic or unoriginal templates giving the impression of mass production". — [YouTube channel monetization policies](https://support.google.com/youtube/answer/1311392)
- Listed as eligible: same intro/outro when "the bulk of your content is different"; series/channels with a recurring format or characters where each video has its own storyline, focus or concept. — [YouTube channel monetization policies](https://support.google.com/youtube/answer/1311392)
- YouTube's Creator Liaison Rene Ritchie (reported 13 July 2025): rename was to make clear the policy covers mass-produced/repetitive content; penalised examples are narrative stories with only superficial differences and slideshows with the same narration; "channels that use AI in their content remain eligible for monetization" provided realistic altered/synthetic content is disclosed; reused content stays eligible with significant original commentary, modification, educational or entertainment value. [PRESS, paraphrase not direct quote] — [Social Media Today, July 2025](https://www.socialmediatoday.com/news/youtube-clarifies-monetization-update-inauthentic-repeated-content/752892/)
- Press coverage disagrees on impact: some say nothing changes for most creators, others say recycled-format/commentary/clip channels could be hit hard. [PRESS summary] — [Mediaweek, July 2025](https://www.mediaweek.com.au/?p=242629)
- How "original value" is assessed: no public rubric found. The policy language is qualitative (narrative, commentary, educational value, distinct storyline per video). Third-party claim that YouTube now reviews whole channels rather than single videos, and that flagged patterns include overposting, faceless compilations without commentary, templated clones, AI slideshows. [BLOG, weak] — [AIR Media-Tech, 2026](https://air.io/en/news-air/how-youtube-treats-ai-in-2026-new-update)
- Disclosure page: creators must disclose realistic AI-generated/altered content via the "AI use" setting in YouTube Studio. Required cases: a real person saying/doing something they did not; altered footage of a real event/place; a realistic scene that never happened; generated music as main focus. Exempt: clearly non-realistic/animated/fantasy content; minor aesthetic edits (filters, background blur, captions, upscaling, audio repair); idea generation, script or thumbnail help; "cloning your own voice for voiceovers"; gameplay. [OFFICIAL, via summariser] — [YouTube altered or synthetic content disclosure](https://support.google.com/youtube/answer/14328491)
- Labelling mechanics: "Yes" triggers a label; for music or photorealistic content the label may be on the player, otherwise in the expanded description. YouTube may add labels automatically for content made with its own GenAI tools, with C2PA metadata, or detected as AI; creators can usually change a mistaken label except for YouTube-AI-tool content, C2PA-tagged content, or manually reviewed labels. Disclosure "doesn't limit a video's audience or affect monetization eligibility." Creators who repeatedly do not disclose may get labels applied manually or face penalties incl. removal or YPP suspension. [OFFICIAL, via summariser] — [YouTube altered or synthetic content disclosure](https://support.google.com/youtube/answer/14328491)
- 2026 change (27 May 2026): YouTube began auto-labelling videos with "significant photorealistic AI"; the policy itself is unchanged (creators should still disclose). Shorts: the label appears directly on the video (overlay); long-form: below the player; unrealistic/animated/lightly altered content keeps description-only labels. C2PA metadata indicating full AI generation gives a permanent label; creators can dispute misidentified labels but not for YouTube-tool content (Veo, Dream Screen). YouTube says labels do not affect recommendation or monetisation. [PRESS] — [TechCrunch, 27 May 2026](https://techcrunch.com/2026/05/27/youtube-will-now-automatically-label-ai-videos/); corroborated by [ChannelNews](https://www.channelnews.com.au/youtube-cracks-down-on-undisclosed-ai-videos-with-automatic-labelling-system/)
- YouTube CEO Neal Mohan's 2026 letter says YouTube is building on anti-spam/anti-clickbait systems to reduce "low quality AI content". [PRESS, secondhand] — [Tubefilter, 29 Jan 2026](https://tubefilter.com/2026/01/29/youtube-ai-slop-channel-crackdown-bans/)
- Likeness: YouTube lets people request removal of AI content simulating an identifiable person's face or voice via the privacy process; a likeness-detection tool exists for creators (linked to a Nov 2025 update). [BLOG/PRESS, weak] — [Minimatters, 2026](https://minimatters.com/youtube-ai-content-labeling-update-in-may-2026/); [AIR Media-Tech](https://air.io/en/news-air/how-youtube-treats-ai-in-2026-new-update)
- Upload API: videos uploaded via `videos.insert` from unverified API projects created after 28 July 2020 are locked to private until the project passes a compliance audit; `youtube.upload` is a restricted scope needing audit. [PRESS/BLOG summary of Google notice] — [Ayrshare explainer](https://www.ayrshare.com/solutions/google-api-error-403-unverified-app-how-to-fix-the-audit-pipeline/)
- The disclosure page, as read, contains no Shorts-specific rule beyond the label placement above. [OFFICIAL] — [YouTube disclosure page](https://support.google.com/youtube/answer/14328491)

### Inferences
- A ~30 s explainer with a unique script, topic and angle per video, using the user's own voice/narration, sits on the "eligible" side; the same layout + same narration style + swapped topic text ("template with a slot") sits on the penalised side. The risk is cross-video similarity across a channel, not a single video.
- Because C2PA-tagged files and Veo/Flow outputs get permanent auto-labels on YouTube, Introcut users who import Veo clips should expect a label regardless of their toggle; the label itself is not penalised.
- AI-written script/hashtags/titles and cloning your own voice are explicitly exempt from the disclosure toggle; realistic AI visuals (incl. imported Veo/Kling clips depicting realistic scenes) are in scope.

### Gaps
- Official YouTube text for Shorts-specific monetisation and for any 2026 edit to the inauthentic-content wording could not be read; no 2026 rewording found, but the page was read through a summariser (verify exact current text).
- No public detail on how originality is scored (signals, thresholds, volume). Numeric rules like "under 10 uploads a day" are blog advice, not YouTube policy.
- Whether YPP is available/eligible for Nepal creators was not researched (verify in YouTube eligibility page).
- YouTube's own May 2026 blog post and Neal Mohan letter not read directly.

## 2. TikTok: AIGC labels, C2PA, Creator Rewards, automated posting

### Takeaway
TikTok requires creators to label AI-generated or significantly edited content that looks realistic, auto-labels C2PA-tagged files, and may remove, restrict or label unlabelled realistic AIGC. Unoriginal/reused material is ineligible for For You, and automation designed to bypass its systems is prohibited. Creator Rewards specifics (length, originality) could not be confirmed from an official page.

### Cited Findings
- TikTok Community Guidelines "Integrity and Authenticity" (update released 25 Aug 2026, effective 24 Sep 2026): creators must label AI-generated or significantly edited content showing realistic scenes or people; unlabelled realistic AIGC may be removed, restricted or labelled depending on harm; labelling does not make misleading-on-public-importance or harmful-to-individuals content acceptable. [OFFICIAL, via summariser; public figures and minors sections were not in the excerpt returned] — [TikTok Community Guidelines](https://www.tiktok.com/community-guidelines/en/integrity-authenticity)
- Same page: post only content you created or have rights to share; IP-violating content is removed; "unoriginal or reused material without anything new" is ineligible for the For You feed; fake engagement and automation: "automation tools, scripts, or other methods designed to bypass TikTok's systems are strictly prohibited". [OFFICIAL, via summariser] — [TikTok Community Guidelines](https://www.tiktok.com/community-guidelines/en/integrity-authenticity)
- 24 Nov 2025 newsroom: C2PA Content Credentials used to detect/label AIGC (labels can be lost on re-upload/edit elsewhere); new invisible watermark that "only TikTok can read" added to content from TikTok's AI tools and C2PA-tagged uploads; a Manage Topics slider lets users see less/more AI content; TikTok says >1.3 billion videos have been labelled. [PRESS summary of the newsroom post; I did not read the post itself] — [TikTok newsroom, 24 Nov 2025](https://newsroom.tiktok.com/more-ways-to-spot-shape-and-understand-ai-generated-content?lang=en-GB), see also [eWeek](https://www.eweek.com/de/news/tiktok-ai-transparency/)
- Content Posting API rules: unaudited clients can only post private (SELF_ONLY), are capped at 5 posting users per 24 h, and the posting account must be private; content must not be sent until the user expressly consents; user must see a preview and pick privacy (no default) and interaction settings manually; apps must not add promotional watermarks/logos to creators' content; commercial-content disclosure toggle is required for branded content. The fetched guidelines do not address AI labelling. [OFFICIAL, via summariser] — [TikTok Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines)
- Creator Rewards: third-party blogs cite 10,000 followers, 100,000 views in 30 days, videos at least 1 minute, 18+; one blog says labelled AI content is not disqualified. No official source found and no source found saying originality or AI is explicitly tested. [BLOG, weak] — [MessengerBot summary](https://messengerbot.app/tiktok-creator-rewards-program-2026-how-to-qualify-and-earn/)
- Nepal context: Nepal banned TikTok in Nov 2023 and lifted the ban Aug 2024 after conditions (platforms must register with a government Social Media Management Unit, open a liaison office, pay taxes, obey local law). [PRESS] — [Kathmandu Post, 22 Aug 2024](https://kathmandupost.com/national/2024/08/22/government-lifts-ban-on-tiktok); [SCMP](https://www.scmp.com/news/asia/south-asia/article/3275545/nepal-lifts-tiktok-ban-imposed-disrupting-social-harmony)

### Inferences
- Because the TikTok Creator Rewards length rule (1 min+) is blog-sourced, Introcut's 30 s default should not promise TikTok Creator Rewards eligibility.
- A tool that bulk-submits via API as an unaudited app can only post private, 5 users max; bulk auto-posting is both technically blocked and policy-hostile. Manual download-and-upload keeps the user as the poster.
- AI-written captions/scripts are reported (by blogs) as exempt from labelling; the rule targets realistic media.

### Gaps
- TikTok help-centre AI-generated content page returned empty; its exact wording (what counts as "significant editing", label tool name) is unverified.
- Official Creator Rewards eligibility page not read; no official statement on AI/originality for monetisation found.
- TikTok rules on minors/public figures in AIGC not obtained (verify in full Community Guidelines).
- Claim from marketing sites that all synthetic media of real private individuals is banned even if labelled: unverified.

## 3. Instagram / Meta: AI info labels, C2PA/IPTC, Reels originality

### Takeaway
Meta labels AI content ("AI info") from industry-standard signals or creator disclosure; in 2026 it began penalising unlabelled AI-persona profiles. Originality enforcement (reduced reach for reposters/duplicates) is documented clearly for Facebook (July 2025) and reported, with less sourcing, for Instagram Reels.

### Cited Findings
- Meta's approach page (first published 5 Apr 2024; page updated 23 Oct 2025): the "AI info" label (renamed from "Made with AI" on 1 July 2024) is applied when Meta detects "industry standard AI image indicators" or people disclose AI-generated uploads; label for AI-edited-only content moved into the post menu (12 Sep 2024). The page does not name C2PA/IPTC explicitly or describe creator penalties; false/altered content rated by fact-checkers is demoted. [OFFICIAL, via summariser] — [Meta, Our approach to labeling AI-generated content](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/)
- Instagram "AI-generated profile" label: optional "AI creator" label launched May 2026; renamed and enforced from 31 Aug 2026 for accounts that "feature an AI-generated person"; unlabelled accounts face reduced reach / non-recommendable posts (also limiting monetisation); creators using AI tools while appearing as themselves do not need it. Start date and appeals not stated in the source. [PRESS] — [MediaPost, 31 Aug 2026](https://mediapost.com/publications/article/417580/instagram-limits-reach-for-creator-profiles-withou.html); [Techwyse](https://www.techwyse.com/?p=78112)
- Meta (14 Jul 2025, Facebook): accounts repeatedly reusing others' videos/photos/text lose monetisation access for a period and get reduced distribution on everything; duplicate videos get reduced distribution; remixing, reactions, commentary and trends allowed; ~10 million impersonator profiles removed that year. [PRESS quoting Meta] — [Search Engine Journal, July 2025](https://www.searchenginejournal.com/meta-follows-youtube-in-crackdown-on-unoriginal-content/551096/); [Bitdefender](https://www.bitdefender.com/en-us/blog/hotforsecurity/facebooks-crackdown-on-reposted-content-what-creators-need-to-know)
- Instagram Reels: reported that Instagram stops recommending Reels from accounts that share unoriginal content 10+ times in 30 days and swaps reposted Reels for the original in recommendations. Undated in the retrieved snippet. [PRESS, weak dating] — [Nasdaq article](https://www.nasdaq.com/articles/instagram-updates-its-reels-algorithm-to-prioritize-original-content)

### Inferences
- Introcut's output (original script + own assets) is not "reposting"; the Instagram risk is near-duplicate videos across an account and, for avatar/AI-persona channels, the new AI-generated profile label.
- Faceless voiceover + code-rendered visuals does not feature an "AI-generated person", so the profile label should not apply unless Introcut's avatar feature is used; when it is, the user must be told to apply the label.

### Gaps
- Instagram-specific official originality policy (help centre/Mosseri posts) not read; the 10-in-30-days number is from one secondary article.
- Meta's stance on C2PA/IPTC specifically comes from earlier 2024 coverage not re-fetched.

## 4. Watermarks and provenance (SynthID, C2PA, visible marks, re-encoding)

### Takeaway
Google's generative outputs carry an invisible SynthID watermark and C2PA credentials; since 14 Aug 2026 Gemini/Flow users can switch off the visible badge, but the toggle is not available in countries requiring visible watermarks and press says Flow creators in India see a watermark. Re-encoding often strips C2PA metadata but not pixel watermarks; platforms detect via both. Removing marks is prohibited/harmful and Introcut should keep not doing it.

### Cited Findings
- 14 Aug 2026: Google added Settings > Media Watermark in Gemini and Flow to hide the visible badge on images (Nano Banana), video and music; "invisible SynthID watermarks and C2PA metadata are still being used"; the toggle will not appear in countries legally requiring visible watermarks; no country list published; Flow's help page already shows watermark restrictions, and creators in India, South Korea and Vietnam see a watermark (article's reading). Tiers not discussed. [PRESS, secondary to Google's announcement] — [Search Engine Journal, 17 Aug 2026](https://searchenginejournal.com/google-lets-you-turn-off-visible-watermarks-in-gemini/586145)
- Google open-sourced "Credentio", a C++ library to validate C2PA credentials locally. [PRESS] — [AI Weekly](https://aiweekly.co/alerts/google-lets-gemini-flow-users-turn-off-visible-ai-watermarks)
- TikTok: C2PA labels "may be removed when content is reuploaded or edited elsewhere", hence the invisible watermark layer. [PRESS on TikTok newsroom] — [eWeek](https://www.eweek.com/de/news/tiktok-ai-transparency/)
- YouTube: C2PA-tagged or YouTube-tool (Veo, Dream Screen) content gets permanent labels. — [TechCrunch, 27 May 2026](https://techcrunch.com/2026/05/27/youtube-will-now-automatically-label-ai-videos/)
- India's rules (see section 5) say platforms must not enable users to modify, suppress or remove provenance markers on synthetic content. — [Hogan Lovells, 13 Feb 2026](https://www.hlc.com/en/publications/india-introduces-mandatory-labelling-for-ai-and-3hour-takedown-for-illegal-content)
- TikTok API guidelines: apps must not add promotional watermarks/logos to creators' content. — [TikTok Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines)

### Inferences
- A browser re-encode (WebCodecs/Mediabunny) of a Veo clip will likely drop the file-level C2PA manifest unless Introcut re-attaches it; SynthID (in pixels/audio) can survive mild re-encoding but robustness to heavy edits is not guaranteed by anything I could source (verify). So detection on the platform side may still flag the clip; the creator's honest toggle is the safe path.
- Design stance: do not strip metadata deliberately; where possible preserve/forward C2PA from imported clips and, ideally, write Introcut's own "AI-assisted" content credential (C2PA signing is optional future work; licence check needed per CLAUDE.md).
- Users in India/Nepal-adjacent flows may find visible marks on Flow clips cannot be toggled off; cropping them out would count as watermark removal, so Introcut should warn against cropping/covering them.

### Gaps
- No primary Google page read for Veo/Flow SynthID/C2PA or free-tier visible-watermark rules (Flow help page fetched did not cover it).
- No empirical source on SynthID/C2PA survival through H.264 re-encode or platform transcoding.
- Whether C2PA Content Credentials writing from browser JS is licence-compatible (c2pa-js is MIT/Apache per project; verify) not checked.

## 5. Legal and ToS

### Takeaway
Pure AI output has weak or no copyright protection in the US; the human-made script, selection/arrangement and edits are protectable. Free-tier output terms (Flow, Kling) could not be confirmed from official pages and several sources say Kling free output is non-commercial. India has notified synthetic-media labelling rules (Feb 2026) with further stricter drafts; Nepal has no AI-specific law (verify). EU AI Act Art. 50 applies from 2 Aug 2026 with a short watermarking grace for legacy generators.

### Cited Findings
**Copyright of AI outputs**
- US Copyright Office, Part 2 (29 Jan 2025): "given current generally available technology, prompts alone do not provide sufficient human control to make users of an AI system the authors of the output"; wholly AI output is not protected; human selection, coordination, arrangement, and perceptible human-authored inputs/modifications can be protected; no new sui generis right recommended. [PRESS/legal summaries; the PDF itself could not be read] — [IPWatchdog, 29 Jan 2025](https://ipwatchdog.com/2025/01/29/part-two-copyright-office-ai-report-says-creative-prompting-doesnt-constitute-authorship/); [Copyright Alliance summary](https://copyrightalliance.org/ai-report-part-2-copyrightability/)
- Nepal: scholarly sources say Nepal's Copyright Act 2059 (2002) has no provisions on AI-generated works, leaving authorship/ownership unclear; one policy profile adds no text-and-data-mining exception. [ACADEMIC/secondary] — [NepJOL, AI and Copyright Law in Nepal](https://nepjol.info/index.php/fwje/article/view/83288); [UNGOVR profile](https://law.ungovr.org/ai/np)
- India: no source on Indian copyright treatment of AI outputs was retrieved (see Gaps).

**Free-tier terms (Flow, Kling)**
- Flow free tier: a developer-forum question asks whether free Flow output may be used commercially under preview terms and has no official answer; secondary sites report ~50 daily credits and 720p caps for free and note paid plans "typically" permit commercial use as an inference, not a quoted term. [FORUM/BLOG, weak] — [Google AI forum thread](https://discuss.ai.google.dev/t/inquiry-about-commercial-use-of-videos-generated-via-google-labs-flow-free-tier-for-a-contest/169174); [Workalizer](https://workalizer.com/insights/gemini/commercial-use-of-google-flow-whisk-ai-videos-what-google-workspace-users-need-to-know)
- Kling: several third-party sources say free-tier output carries a watermark and is restricted from commercial use, paid tiers allow commercial use and watermark removal (Standard is the lowest tier cited), upgrading does not necessarily retro-licence free outputs, and Kling/Kuaishou gets a broad non-exclusive sublicensable licence to user content. Tiers change often. [BLOG, weak; official Kling ToS not read] — [CometAPI](https://www.cometapi.com/are-kling-videos-private/); [Atlas Cloud pricing guide](https://www.atlascloud.ai/blog/guides/kling-ai-pricing)

**Music**
- Royalty-free is a payment term, not Content ID immunity; even licensed or Creative Commons/public-domain tracks can receive claims (reference files wrongly registered, or non-exclusive composer deals); a claim can redirect or block revenue or block a Short but is not a strike. [BLOG, library vendors with an interest] — [Foxi Music](https://www.foximusic.com/blog/is-royalty-free-music-copyright/), [Tunepocket](https://www.tunepocket.com/resolve-youtube-copyright-claims/); no YouTube page on the CC0 false-claim case was found.

**Voice/likeness and minors**
- India's Delhi High Court issued a run of interim personality-rights orders in 2026 against AI deepfakes and voice cloning (Jubin Nautiyal, 19 Feb; Kajol, 20 Feb, 72-hour takedown; Ramdev, Feb; Allu Arjun, Apr; Yuvraj Singh, Aug 2026); mostly interim, order texts not read. [PRESS/OECD incident summaries] — [OECD.AI, Kajol](https://oecd.ai/en/incidents/2026-02-20-e043); [Storyboard18](https://www.storyboard18.com/digital/delhi-high-court-grants-interim-protection-to-kajols-personality-rights-orders-takedown-of-ai-deepfakes-90744.htm)
- YouTube lets individuals request removal of AI content simulating their face/voice; its disclosure policy exempts cloning your own voice. — [Minimatters](https://minimatters.com/youtube-ai-content-labeling-update-in-may-2026/); [YouTube disclosure page](https://support.google.com/youtube/answer/14328491)
- India's tool-provider duties include preventing CSAM, non-consensual intimate imagery, false documents and similar prohibited SGI. — [Hogan Lovells](https://www.hlc.com/en/publications/india-introduces-mandatory-labelling-for-ai-and-3hour-takedown-for-illegal-content)
- Minors: no platform-specific minors-in-AI-content rules were retrieved (TikTok excerpt silent).

**India IT Rules**
- MeitY notified amendments to the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 on 10 Feb 2026, effective 20 Feb 2026: defines "synthetically generated information" (SGI; AI-created audio/visual content that appears real and authentic; excludes good-faith editing, compression, noise reduction, templates/educational material not creating false records); permitted SGI must be prominently labelled with permanent metadata/provenance markers (incl. unique identifiers); platforms must not let anyone remove them; significant social media intermediaries (5M+ Indian users) must require users to declare whether content is SGI and verify declarations technically; takedown of government/court orders cut from 36 h to 3 h; penalties are via IT Act/other laws, amounts not stated. [LAW-FIRM NOTE, 13 Feb 2026] — [Hogan Lovells](https://www.hlc.com/en/publications/india-introduces-mandatory-labelling-for-ai-and-3hour-takedown-for-illegal-content); corroborated by [All India Radio, 10 Feb 2026](https://www.newsonair.gov.in/government-sets-3-hour-deadline-for-social-media-platforms-to-take-down-ai-generated-deepfake-content)
- Further draft (notice 21 Apr 2026; comments to 7 May 2026) would require a continuous, clearly visible label for the whole duration, cover voice cloning and face-swaps, require platform detection models, and make ministry advisories binding via a new Rule 3(4). Status (as of 16 Jun 2026 article) proposed only; I found no confirmation it was finalised. [LAW-FIRM NOTE] — [Mondaq, 16 Jun 2026](https://www.mondaq.com/india/new-technology/1801930/india-tightens-oversight-on-ai-generated-content-under-it-rules)
- Conflicting/ambiguous: an Aug 2026 report describes the proposals as "draft amendments" endorsed by a parliamentary committee that recommended licensing AI creators (not law). It seems to refer to a different layer (Act-level) from the Feb Rules, but I could not reconcile it. [PRESS] — [The Week, 6 Aug 2026](https://www.theweek.in/news/india/2026/08/06/deepfake-ai-misinformation-law-meity-it-act.html)

**Nepal**
- Electronic Transactions Act 2063: Section 47 (publication of illegal electronic material) reportedly carries up to NPR 100,000 and/or 5 years; one source describes §47 differently (computer fraud) so the section content and penalties need checking against the statute. The Social Media Bill (with deepfake-related clauses) was moved for withdrawal on 6 Feb 2026; an IT and Cyber Security Bill to replace the ETA had not been enacted as of April 2026 per a law-blog note; Election Commission guidelines are described as outdated for generative AI. [LAW-BLOG/PRESS, none quote the statute] — [Lawalpine](https://lawalpine.com/blog/electronic-transaction-act-nepal); [Tribune India](https://www.tribuneindia.com/news/world/nepals-social-media-bill-proposes-stringent-measures-to-control-spread-of-fake-news/amp); [Meatechwatch, Jan 2026](https://meatechwatch.com/2026/01/26/ai-deepfakes-threaten-nepals-upcoming-march-5th-election/)

**EU AI Act Art. 50**
- Providers (50(1)-(2)) must make synthetic outputs machine-detectable; deployers (50(4)) must disclose deepfakes (artificially generated/manipulated image, audio, video, text), with carve-outs for evidently artistic/satirical works and human-edited text with editorial responsibility. Duties apply from 2 Aug 2026; the Digital Omnibus gave only a transitional window to 2 Dec 2026 for Art. 50(2) marking by generators already on the market before 2 Aug 2026; Code of Practice finalised June 2026, interoperable watermark detection by 2 Feb 2027; fines up to EUR 15M or 3% of turnover. Adoption status/dates differ between secondary sources: verify against the Official Journal. [SECONDARY, Cloud Security Alliance note] — [CSA research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-article50-watermarking-deadline/); [Usercentrics](https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/)

### Inferences
- Introcut users own (at most) the human layers: script, edit, selection/arrangement, voice recorded by them; they cannot assume exclusive rights in raw AI visuals, so a user cannot stop others reusing identical AI clips and should not warrant "original copyrighted work" in exported metadata.
- Imported free-tier Kling/Flow clips are the single biggest unresolved licensing risk; Introcut should ask the user to confirm commercial-use rights per clip and warn that Kling free-tier outputs are reported as non-commercial.
- Under India's rules the platform (not the end user) carries the formal labelling duty, but users will be asked to declare SGI; Introcut's per-project checklist should map to that declaration. Content with realistic AI person depictions has the highest legal exposure; faceless, non-realistic/code-rendered visuals have the lowest.
- If Introcut ships in the EU and counts as a provider of a generative system, Art. 50(2) marking may apply; whether a script-to-video assembler with third-party generators qualifies is a legal question (lawyer needed).
- Voice cloning: the safe lines are the user's own voice with recorded consent (already in CLAUDE.md) and never celebrity/real-person voices; Indian personality-rights case law is moving quickly against this.

### Gaps
- Official Google Flow/Veo and Kling ToS pages not read; ownership and commercial terms for free tiers are unverified.
- No source retrieved on Indian copyright law for AI works, or Nepal-specific deepfake or labelling obligations beyond general ETA/bill reporting. Nepal statutory texts not read (verify; local lawyer needed).
- US Copyright Office PDF text not readable by the tool; later court decisions (post early 2025) not checked.
- Final status of India's April 2026 draft; whether the Feb 2026 label rules require a specific label size/position (not found).
- Music: no official YouTube/Meta statement on CC0 music Content ID behaviour; CC0 does not remove the risk of false claims per vendor blogs only.
- Minors/real-person depiction rules for each platform not obtained.

## 6. Practical design guidance (derived; no new citations beyond those above)

### Takeaway
Build disclosure into the export flow and bias the product toward per-video originality and user-in-the-loop posting. Do not build bulk or unattended posting, and do not market "channel in a box" volume.

### Cited Findings
- Platform requirements Introcut must be compatible with: YouTube "AI use" toggle and auto-labels; TikTok AIGC label and no-automation rule; Instagram AI info plus AI-generated profile label; India SGI declarations. — see sections 1-3 and 5.
- Non-AI-generated aspects exempt from YouTube's toggle: script help, ideas, captions, own-voice cloning. — [YouTube disclosure page](https://support.google.com/youtube/answer/14328491)

### Inferences (recommended features)
1. Export disclosure panel, per project, auto-filled from the project JSON: lists which assets are AI-generated, which are realistic (people/places/events), whether a cloned voice is used, whether any real person is depicted, which imported clips came from Flow/Kling/Wan (and the user's confirmation of their licence). Output: a plain-language "toggle these platform settings" card for YouTube (AI use = Yes/No with reason), TikTok (AI-generated content label), Instagram (AI info / AI-generated profile if an avatar), and India (SGI declaration).
2. Export reminder text (draft): "This video contains AI-generated or AI-altered content. Turn on the AI/altered-content label on YouTube, TikTok and Instagram if any visuals or voices look realistic. Do not remove watermarks or credits from the source clips. You are responsible for rights to any music, faces, voices and clips you added." Keep wording conservative; not legal advice.
3. Default to preserve, never strip: keep C2PA/credential metadata where technically possible; warn if re-encoding drops it; add an Introcut "AI-assisted" credential as future work; block crop/cover-up features targeted at watermarks, and show a warning when a clip appears to have a visible AI mark.
4. Variety guard: compute a cross-project similarity score (template id, caption style, voice, shot pattern, script structure) over the user's recent exports and warn when the last N videos on a channel look templated; force at least one user-supplied differentiator per project (own voice, own screen recording, personal angle, specific facts/sources). Rotate layouts/styles; do not ship a single fixed template as the default for batch use.
5. Encourage original narration: prompt for the user's own voice or a clearly TTS-labelled voice; discourage the same synthetic voice + stock visuals + generic script loop (the pattern press describes as penalised).
6. Rights checklist: music from CC0/licensed with the source recorded; ID of the track in project JSON; warning that Content ID claims can still happen and how to dispute; avoid unlicensed brand/celebrity names, faces and voices.
7. Real-person and minors guard: no cloning of anyone other than the user (consent phrase retained); refuse or warn on prompts depicting named real people or minors in realistic AI scenes; no fake news-style or political/election realistic content (Nepal March 2026 election deepfakes; India 3-hour takedown regime).
8. Automation limits: no bulk or scheduled auto-upload, no multi-account posting, no cloned-variant generation for spraying; if a posting integration is ever added, require explicit per-video user consent and preview (TikTok API already mandates this and private-only for unaudited apps; YouTube API uploads from unverified projects are private until audited).
9. Keep title/description/hashtag generator non-deceptive: no "real footage" claims on synthetic content, no unsubstantiated claims; include a disclosure line option in description.
10. Surface a "policies change often" notice with a last-reviewed date and link to the official pages; keep policy text in a config file (not hard-coded) so updates ship without code changes.

### Gaps
- Needs a lawyer: C2PA signing/claim wording, EU Art. 50 provider status, voice-clone consent flow validity in India/Nepal, and liability disclaimers.

## 7. Evidence on faceless AI channels (2025-2026)

### Takeaway
There is reliable reporting of YouTube removing/demonetising large AI "slop" channels in Jan 2026 and of advertiser pressure, but no independent data on the share of legitimate faceless channels affected; claims of "thousands" of faceless channels purged and of precise reinstatement timelines are unverified.

### Cited Findings
- Jan 2026: Kapwing report (cited by Tubefilter, 29 Jan 2026) that at least 18 AI-slop channels were deleted or hidden, including CuentosFacianantes (1.2B+ views) and Imperio de Jesus; other slop channels still appeared in Tubefilter's Top 50; advertisers and Hollywood studios pressured YouTube in 2025; critics note past moderation sometimes harmed legitimate creators. Kapwing sells AI video tools, so note the interest. [PRESS] — [Tubefilter, 29 Jan 2026](https://tubefilter.com/2026/01/29/youtube-ai-slop-channel-crackdown-bans/)
- Other coverage describes a sweep of 16 channels, ~4.7B views, ~35M subscribers, ~USD 10M annual ad revenue; figures vary by outlet. [PRESS/aggregator] — [HackerNoon](https://hackernoon.com/youtubes-ai-slop-crackdown-cant-tell-a-directed-ai-film-from-a-bot-farm); [Boing Boing, 28 Jan 2026](https://boingboing.net/2026/01/28/slop.html)
- A Kapwing analysis cited by press found about 21% of the first 500 videos recommended to a new account were low-quality AI content. [PRESS citing vendor] — [Let's Data Science](https://letsdatascience.com/news/youtube-cracks-down-on-faceless-creators-monetization-e3bb5892)
- Opinion: critics argue YouTube uses an on-camera human face as a rough proxy for mass production, risking misclassification of directed AI/animated work. [ANECDOTE/OPINION] — [HackerNoon](https://hackernoon.com/youtubes-ai-slop-crackdown-cant-tell-a-directed-ai-film-from-a-bot-farm)
- Vendor/agency claims that YouTube reviews entire channels and suspends monetisation for overposting/templated faceless channels; appeal-time claims are the author's advice. [BLOG] — [AIR Media-Tech](https://air.io/en/news-air/how-youtube-treats-ai-in-2026-new-update); [Invideo blog](https://invideo.io/blog/youtube-kills-ai-faceless-channels/)
- Meta: 14 July 2025 announcement of 10M impersonator profiles removed and 500k accounts actioned for spam/fake engagement. [PRESS quoting Meta] — [Bitdefender](https://www.bitdefender.com/en-us/blog/hotforsecurity/facebooks-crackdown-on-reposted-content-what-creators-need-to-know)

### Inferences
- Enforcement targets channel-level patterns (volume, sameness, no added value) and the most egregious channels first; low-volume faceless channels with distinct stories are not shown to be targeted by reliable outlets, but false positives are plausible and appeal paths are slow (anecdotal).

### Gaps
- No reliable independent count of faceless channels demonetised or reinstated; no Nepal- or India-specific enforcement reporting found; TikTok and Instagram faceless-channel enforcement examples not found.
- Reports of individual creators' demonetisation (Reddit/Twitter) were not searched or verified; treat any such claim as anecdotal.

## Source reliability and access notes
- Read through a summarising fetch tool (not raw page): YouTube help pages (1311392, 14328491), TikTok Community Guidelines, TikTok API guidelines, Meta approach page; re-read exact wording before quoting in product copy.
- Not readable: TikTok help-centre AI page, Google Flow help page (no relevant content), Copyright Office PDF, Kling and Google Flow official ToS.
- Some secondary sources are marketing blogs; they are flagged and should not be used as authority.
- Policies flagged as changing often: YouTube labelling (changed May 2026), TikTok guidelines (new version effective 24 Sep 2026), Instagram AI-profile label (31 Aug 2026), Google watermark toggle (14 Aug 2026), India draft rules (April 2026 draft pending), EU Omnibus dates (2 Dec 2026, 2 Feb 2027), Kling/Flow plan terms.
