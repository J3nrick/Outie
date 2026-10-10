"""Mix the current narration and score, reusing the unchanged rendered visuals."""
import os, subprocess, tempfile, wave
from array import array
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BUILD=ROOT.parent/'build'
BIN=ROOT/'node_modules/@remotion/compositor-darwin-arm64'
ENV={**os.environ,'DYLD_LIBRARY_PATH':str(BIN)}
def ffmpeg(*args):subprocess.run([str(BIN/'ffmpeg'),'-y','-v','error',*map(str,args)],env=ENV,check=True)
def read(path):
 with wave.open(str(path)) as w:return array('h',w.readframes(w.getnframes()))
with tempfile.TemporaryDirectory(prefix='outie-mix-') as temp:
 temp=Path(temp)
 for name in ['outie-forward','outie-script-fx']:
  ffmpeg('-i',ROOT/f'public/audio/{name}.wav','-ar','48000','-ac','2',temp/f'{name}.wav')
 music=read(temp/'outie-forward.wav');fx=read(temp/'outie-script-fx.wav')
 voice=read(ROOT/'public/audio/outie-haven-aligned.wav')
 out=array('h',[0])*(60*48000*2);peak=0
 for frame in range(60*48000):
  t=frame/48000
  envelope=max(0,min(1,t/.6,(60-t)/1.3))
  for channel in range(2):
   i=frame*2+channel
   sample=round(music[i]*.164*envelope+fx[i]*.7+voice[frame])
   peak=max(peak,abs(sample))
   assert -32768<=sample<=32767,'Mix would clip'
   out[i]=sample
 target=BUILD/'Outie-Promo-Voiceover-Mix.wav'
 with wave.open(str(target),'wb') as w:
  w.setnchannels(2);w.setsampwidth(2);w.setframerate(48000);w.writeframes(out.tobytes())
 print(f'Mix peak: {peak/32768:.4f}',flush=True)
 ffmpeg('-i',BUILD/'Outie-Promo-60s.mp4','-i',target,'-map','0:v:0','-map','1:a:0',
        '-c:v','copy','-c:a','aac','-b:a','320k','-t','60','-movflags','+faststart',
        BUILD/'Outie-Promo-60s-Voiceover.mp4')
 print(BUILD/'Outie-Promo-60s-Voiceover.mp4')
