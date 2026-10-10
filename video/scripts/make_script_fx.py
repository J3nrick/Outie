"""Original quiet UI chimes, cable sweeps, and scene cues for the six-part script."""
from array import array
from pathlib import Path
import math, random, struct, wave
sr=44100
left=array('f',[0.0])*(sr*60);right=array('f',[0.0])*(sr*60)
rng=random.Random(41)
def tone(at,hz,duration=.26,level=.08,pan=0):
    for j in range(int(sr*duration)):
        i=round(at*sr)+j
        if i>=len(left): break
        t=j/sr
        v=(math.sin(math.tau*hz*t)+.18*math.sin(math.tau*hz*2*t))*math.exp(-t*17)*min(1,t/.005)*min(1,(duration-t)/.02)*level
        left[i]+=v*math.sqrt((1-pan)/2);right[i]+=v*math.sqrt((1+pan)/2)
for at in [0.15,3.15,6.7,10,11.8,13.5,13.75,14,14.25,20,24.8,26.5,32,35.5,39.2,40.65,44,48.5,51.25,52.2,54,55.9]:
    tone(at,587.33,pan=-.2);tone(at+.065,880,level=.055,pan=.2)
for at in [9.48,19.48,31.48,43.48,53.48]:
    for j in range(int(.48*sr)):
        t=j/sr; i=round(at*sr)+j
        v=rng.uniform(-1,1)*.022*math.sin(math.pi*t/.48)**2
        left[i]+=v;right[i]+=v*.8
for j,hz in enumerate([587.33,739.99,880]):tone(56.1+j*.12,hz,.8,.07)
peak=max(max(abs(v) for v in left),max(abs(v) for v in right))
path=Path(__file__).resolve().parents[1]/'public/audio/outie-script-fx.wav'
with wave.open(str(path),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr)
    w.writeframes(b''.join(struct.pack('<hh',round(l*32767),round(r*32767)) for l,r in zip(left,right)))
print(f'Script sound cues: 60s stereo; peak {peak:.3f}')
