# Outie videos

Two editable 60-second, 1920 × 1080 Remotion compositions at 30 fps:

- **OutiePromo**: the user's six-part hackathon narration script, with animated product walkthroughs, a charger-cable visual thread, dimensional phones, actual model-status capture, and original music.
- **OutieDemo**: the original product walkthrough, preserved without audio.

Run `npm ci` and `npm run dev` from this folder. Open OutiePromo in Studio. Each of its six scenes has an independent composition in Script-scenes. Run `npm run typecheck` to validate source. Studio's Render control exports the reviewed composition.

## Six-part edit

| Time | Story |
| --- | --- |
| 0–10 s | Welcome, Today, AppBuilders PH Hackathon in Makati at 1 PM; the charger joke |
| 10–20 s | Save Home; keys, wallet, laptop, charger; the backlog joke |
| 20–32 s | Connected Calendar, sample event, refresh, local AI and reviewable reasons |
| 32–44 s | Reminder preview and reasons; code committed versus laptop packed |
| 44–54 s | Actual captured model readiness, saved essentials, editing and pause |
| 54–60 s | Today reminder, icon and “Head out. Less left behind.” |

The recorded narration and integration notes are in `VOICEOVER_SCRIPT.md`. The supplied Haven Sands ElevenLabs recording is now included. Its 49.084-second source is placed across the film using local word timestamps and silence boundaries, with no speech time-stretching. The original recording is preserved. Six scene boundaries follow the supplied schedule exactly; source edits are frame-driven, with no CSS animation clocks.

## Visuals and provenance

The hackathon walkthrough uses illustrated app screens based on the current app and clearly labelled sample context. Example ID/notebook suggestions illustrate the script; they are not presented as the output of a new hackathon inference call. The Settings model-status screen is an actual iPhone simulator capture from this revision, showing “On-device model ready.” Its close-up crops the captured image. Other actual captures remain for OutieDemo. The film does not claim a recorded physical departure.

Outie's icon and Satoshi fonts are reused from the app; the font licence remains in `public/fonts`. Solar icon paths are from the bundled app set ([Solar / Iconify](https://icon-sets.iconify.design/solar/), CC BY 4.0). Key, wallet, laptop, cable, and charger illustrations are authored SVG/CSS.

## Audio

The active score is **Head Out**, an original 120 BPM, D-major, 30-bar composition. Its musical chapters follow the six-part script exactly. A plucked call-and-response hook, syncopated piano, rounded bass, layered claps and shakers, stereo strings, and a quieter control chapter lead into the final major-chord release. `python3 scripts/make_forward_score.py` regenerates `public/audio/outie-forward.wav`.

`python3 scripts/make_script_fx.py` regenerates quiet chimes and transitions aligned to the script. Both are deterministic synthesis without sampled songs or external recordings. Music uses a base volume of 0.82. A non-empty `voiceoverSrc` applies a 0.20 narration multiplier (effective music level 0.164); effects use 0.7. Narration is normalized toward −17 LUFS with a −2 dBTP ceiling before alignment. Run `python3 scripts/align_haven_voiceover.py` to regenerate the aligned narration. `OutiePromo` defaults to `audio/outie-haven-aligned.wav`.

## Validation

TypeScript passes. Twelve Full HD frames of this revision were rendered and visually reviewed, including the charger, Calendar flow, alternate phone layout, reminder close-up, and finale. The new score and cue track are both 60-second stereo PCM at 44.1 kHz. Their combined music-only peak is below full scale at the authored gains. The previous edit is backed up outside the active source. The music-only MP4 and a separate narrated MP4 have been exported. The narrated export reuses the unchanged H.264 visual stream and adds a newly mixed stereo AAC track. It is exactly 60 seconds, 1920 × 1080, 30 fps, and 1,800 frames. The PCM mix peak is 0.9034 (below clipping). `python3 scripts/mix_haven_export.py` reproduces this audio export from `../build/Outie-Promo-60s.mp4`; a full Remotion render uses the same source gains and aligned narration. TypeScript passes after integration.
