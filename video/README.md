# Outie videos

Two editable 60-second, 1920 × 1080 Remotion compositions at 30 fps:

- **OutiePromo**: nine-chapter brand film with beat-aligned kinetic typography, dimensional app captures, contextual motion graphics, a widget close-up, and an original uplifting score.
- **OutieDemo**: the original caption-led product walkthrough, preserved without audio.

Run from this folder:

    npm ci
    npm run dev

Open OutiePromo in Studio. Individual scenes are registered for independent editing. Run `npm run typecheck` to validate source. Use Studio’s Render control to export the reviewed composition as H.264 MP4.

## Promotional sequence

| Time | Scene |
| --- | --- |
| 0–5.63 s | Halfway out. Keys still in. |
| 5.63–9.37 s | Meet Outie |
| 9.37–16.87 s | Personal essentials and routines |
| 16.87–26.23 s | Context inputs and actual local AI demonstration |
| 26.23–33.73 s | Illustrated departure reminder |
| 33.73–39.37 s | One tap, one less reminder |
| 39.37–46.87 s | Home Screen and Lock Screen widgets |
| 46.87–52.5 s | Less backtracking. More getting there. |
| 52.5–60 s | Head out. Less left behind. |

Important timing is authored as integer frames, aligning 32 musical bars at 128 BPM to the 30 fps timeline within one frame. All animations are driven by Remotion frames; no CSS animation clocks are used.

Captures in `public/captures` are actual simulator captures. The departure graphic and its reminder are labelled illustrated examples using sample context. Model compatibility and permissions are disclosed in relevant scenes. The promo does not present screenshots as a recorded physical departure. The widget close-up crops the actual captured widget rather than rebuilding its displayed data.

## Original soundtrack

`python3 scripts/make_score.py` regenerates two synchronized 60-second stereo PCM stems at 44.1 kHz:

- `public/audio/outie-uplift.wav`: an authored D-major arrangement at 128 BPM. Piano-like plucks, glass arpeggios, warm pads, a syncopated bass groove, tight drums, a halftime bridge, and a final tonic resolution.
- `public/audio/outie-motion-fx.wav`: a recurring three-note reminder signature and transition sweeps at the visual cues.

Both stems are deterministic synthesis with no sampled songs, external recordings, or API calls. Music and effects have independent volume controls on their Audio nodes. Their composition volumes preserve output headroom; starts and tails are faded to avoid clicks. The film uses music and on-screen copy without narration.

Outie's icon and Satoshi fonts are reused from the mobile app; the font licence is retained in `public/fonts`. Solar paths are reused from the app's bundled Solar set ([Solar / Iconify](https://icon-sets.iconify.design/solar/), CC BY 4.0). The key, wallet and umbrella drawings are custom SVG illustrations for the video.

The first promotional version was backed up outside the project during this revision. Its unused audio and animation helpers were removed from the active video source.

## Validation

TypeScript passes. Representative 1920 × 1080 frames and transition boundary frames were rendered and visually inspected. PCM duration, stereo format, peak and RMS levels were checked. Studio metadata confirms 1800 frames at 30 fps, 1920 × 1080, with no runtime error overlay. The composition remains an interactive Studio preview; a full MP4 export has not been made in this design pass.
