"""Place the supplied Haven recording against the reviewed 60-second film.

Source ranges are seconds in the original recording, measured with local
word timestamps and silence detection. Only pauses are inserted; speech is
neither time-stretched nor rewritten. Requires the bundled Remotion FFmpeg.
"""
import os
from pathlib import Path
import subprocess
import tempfile
import wave
from array import array

ROOT = Path(__file__).resolve().parents[1]
BIN = ROOT / 'node_modules/@remotion/compositor-darwin-arm64'
CUES = [
    (0.00, 1.30, 0.40, 'This is Outie'),
    (1.30, 5.28, 2.80, 'Hackathon, Makati, one PM'),
    (5.28, 7.42, 6.90, 'Charger joke'),
    (7.42, 8.32, 10.40, 'Save Home'),
    (8.32, 11.22, 12.70, 'Choose essentials'),
    (11.22, 14.80, 15.70, 'Setup and backlog'),
    (14.80, 18.50, 20.20, 'Calendar context'),
    (18.50, 24.78, 24.65, 'Supported iPhones and AI reasons'),
    (24.78, 31.75, 32.25, 'Reminder preview'),
    (31.75, 35.75, 39.35, 'Code and laptop joke'),
    (35.75, 38.72, 44.20, 'On-device AI'),
    (38.72, 42.30, 48.15, 'Saved essentials and editing'),
    (42.50, 44.72, 51.73, 'Pause and choice'),
    (44.72, 49.084, 54.20, 'Outie sign-off'),
]

def main():
    env = {**os.environ, 'DYLD_LIBRARY_PATH': str(BIN)}
    with tempfile.TemporaryDirectory(prefix='outie-voice-') as temp:
        normalized = Path(temp) / 'normalized.wav'
        subprocess.run([str(BIN/'ffmpeg'), '-y', '-v', 'error', '-i',
            str(ROOT/'public/audio/outie-haven-original.mp3'), '-af',
            'loudnorm=I=-17:TP=-2:LRA=7', '-ac', '1', '-ar', '48000',
            str(normalized)], env=env, check=True)
        with wave.open(str(normalized)) as source:
            rate=source.getframerate()
            samples=array('h', source.readframes(source.getnframes()))
        output=array('h', [0])*(60*rate)
        previous_end=0
        for start,end,destination,label in CUES:
            clip=samples[round(start*rate):round(end*rate)]
            offset=round(destination*rate)
            assert offset>=previous_end, f'Overlapping narration: {label}'
            assert offset+len(clip)<=len(output), f'Narration past ending: {label}'
            # Tiny boundary fades avoid clicks without affecting spoken pacing.
            fade=round(.004*rate)
            for i in range(min(fade,len(clip)//2)):
                clip[i]=round(clip[i]*i/fade)
                clip[-i-1]=round(clip[-i-1]*i/fade)
            output[offset:offset+len(clip)]=clip
            previous_end=offset+len(clip)
            print(f'{destination:05.2f}–{previous_end/rate:05.2f} {label}')
        target=ROOT/'public/audio/outie-haven-aligned.wav'
        with wave.open(str(target),'wb') as dest:
            dest.setnchannels(1);dest.setsampwidth(2);dest.setframerate(rate)
            dest.writeframes(output.tobytes())
        print(target)

if __name__=='__main__':main()
