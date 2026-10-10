"""HEAD OUT: original 120 BPM / D major / 30-bar score for Outie's six-part edit.
Deterministic additive instruments and authored rhythms. No samples or services.
"""
from array import array
from pathlib import Path
import math, random, struct, wave
SR=44100;N=SR*60;TAU=math.tau;BEAT=.5;BAR=2
left=array('f',[0])*N;right=array('f',[0])*N
rng=random.Random(102626)
def hz(n):return 440*2**((n-69)/12)
def env(t,d,k=4):return min(1,t/.007)*math.exp(-k*t)*min(1,max(0,(d-t)/.035))
def add(at,d,fn,gain,pan=0):
    start=round(at*SR); gl=math.sqrt((1-pan)/2)*gain;gr=math.sqrt((1+pan)/2)*gain
    for j in range(max(0,min(round(d*SR),N-start))):
        v=fn(j/SR,d);left[start+j]+=v*gl;right[start+j]+=v*gr

def piano(n):
    f=hz(n)
    return lambda t,d:env(t,d,2.7)*(math.sin(TAU*f*t)+.34*math.sin(TAU*f*2.001*t)*math.exp(-t*2)+.14*math.sin(TAU*f*3.003*t)*math.exp(-t*4)+.07*math.sin(TAU*f*4.008*t)*math.exp(-t*6))
def pluck(n):
    f=hz(n)
    return lambda t,d:env(t,d,5.2)*sum(math.sin(TAU*f*k*t+.015*k)*math.exp(-t*k*.8)/k**1.5 for k in range(1,7))
def bell(n):
    f=hz(n)
    return lambda t,d:env(t,d,4.3)*(math.sin(TAU*f*t)+.22*math.sin(TAU*f*3.98*t)*math.exp(-t*9))
def bass(n):
    f=hz(n)
    return lambda t,d:env(t,d,2.4)*(math.sin(TAU*f*t)+.23*math.sin(TAU*f*2*t)+.12*math.sin(TAU*f*3*t))
def strings(n,phase):
    f=hz(n)
    return lambda t,d:min(1,t/.35)*min(1,max(0,(d-t)/.5))*(math.sin(TAU*f*t+.009*math.sin(TAU*4.6*t))+math.sin(TAU*f*1.002*t+phase))*.42

def kick(t,d):return (math.sin(TAU*(49*t+3.6*(1-math.exp(-42*t))))*math.exp(-t*17)+rng.uniform(-1,1)*.14*math.exp(-t*180))*min(1,max(0,(d-t)/.02))
def percussion(kind):
    prev=[0.0]
    def sound(t,d):
        n=rng.uniform(-1,1);noise=n-prev[0]*.89;prev[0]=n
        if kind=='clap':e=math.exp(-t*48)+(.75*math.exp(-(t-.014)*55) if t>=.014 else 0)+(.6*math.exp(-(t-.029)*40) if t>=.029 else 0)
        else:e=math.exp(-t*(85 if kind=='hat' else 26))
        return noise*e*min(1,max(0,(d-t)/.01))
    return sound
# Voicings keep the melody bright without crowding a future voiceover.
chords=[(38,[62,66,69,76]),(45,[61,64,69,74]),(47,[62,66,69,73]),(43,[59,62,66,69])]
motif=[(0,74),(.75,78),(1.5,81),(2.5,78),(3.25,76)]
for bar in range(30):
    at=bar*BAR;root,notes=chords[bar%4]
    if bar in [27,29]:root,notes=38,[62,66,69,74]
    intro=bar<2;context=10<=bar<16;control=22<=bar<27;final=bar>=27
    # Voiced piano on syncopated upbeats, with a rolled downbeat.
    for i,n in enumerate(notes):
        add(at+i*.016,1.9,piano(n),.15 if intro or control else .1,(-.55+i*.36))
        if bar>=2:add(at,2.4,strings(n,.4*i),.035 if control else .05,(-.7+i*.46))
    for off in [1.5,3]:
        for i,n in enumerate(notes[1:]):add(at+off*BEAT+i*.01,.5,pluck(n),.055,(-.5+i*.5))
    # Rounded bass + punchy kick: space in the control chapter, momentum elsewhere.
    beats=[0,2.5] if intro or control else [0,1,2,3]
    for b in beats:
        add(at+b*BEAT,.35,kick,.7 if not control else .43)
        add(at+b*BEAT,.42,bass(root),.4)
    if not intro and not control:
        for b in [.75,1.75,2.75,3.5]:add(at+b*BEAT,.2,bass(root+(12 if b==3.5 else 0)),.18)
    if not intro:
        for b in [1,3]:
            add(at+b*BEAT,.22,percussion('clap'),.11 if control else .19)
            add(at+b*BEAT,.12,lambda t,d:math.sin(TAU*187*t)*env(t,d,35),.085)
        for s in range(16 if not control else 8):
            step=.125 if not control else .25
            add(at+s*step+(s%2)*.008,.065,percussion('hat'),.025 if s%2 else .04,(-.6 if s%2 else .6))
        if not control:
            for b in [.5,1.5,2.5,3.5]:add(at+b*BEAT,.13,percussion('open'),.048,.2)
    # Authored call-and-response hook. The quieter middle register leaves speech clear.
    for b,n in motif:
        if control and b>1.5:continue
        note=n-(2 if bar%2 and b!=0 else 0)
        add(at+b*BEAT,.65,pluck(note),.10 if context else .16,math.sin(bar)*.18)
    if context or final:
        for s,k in enumerate([0,1,2,3,2,1,3,2]):
            add(at+s*.25,.55,bell(notes[k]+12),.07 if context else .085,math.sin(s*1.1)*.6)
    if bar in [4,9,15,21,26]:
        for k in range(6):add(at+1.5+k*.075,.09,percussion('clap'),.035+k*.013,(-.4+k*.16))
    if final:
        for i,n in enumerate([74,78,81,86]):add(at+i*.125,1.7,piano(n),.10,-.35+i*.23)
# Little breaths just before the edit points. Quiet reversal swells, not loud impact noise.
for at in [9.4,19.4,31.4,43.4,53.4]:
    def rise(t,d):return rng.uniform(-1,1)*math.sin(math.pi*t/d)**2*.09
    add(at,.58,rise,.35)
# Sonic signature at the end, followed by a ringing major-sixth chord.
for i,n in enumerate([74,78,81,86]):add(55.9+i*.12,1.4,bell(n),.17,-.3+i*.2)
for i,n in enumerate([38,50,62,66,69,74,78]):add(58+i*.012,2,piano(n),.12,(-.3+i*.1))
# Stereo reflections, independent of dry output to avoid feedback buildup.
for delay,gain in [(int(SR*.25),.09),(int(SR*.375),.055)]:
    for i in range(N-1,delay-1,-1):
        left[i]+=right[i-delay]*gain;right[i]+=left[i-delay]*gain
for i in range(N):
    t=i/SR
    duck=.8+.2*min(1,(t%.5)/.13)
    fade=min(1,t/.02,max(0,(60-t)/1.45))
    left[i]=math.tanh(left[i]*1.25)*duck*fade
    right[i]=math.tanh(right[i]*1.25)*duck*fade
peak=max(max(abs(v) for v in left),max(abs(v) for v in right));gain=.89/peak
out=Path(__file__).resolve().parents[1]/'public/audio/outie-forward.wav'
with wave.open(str(out),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
    w.writeframes(b''.join(struct.pack('<hh',round(l*gain*32767),round(r*gain*32767)) for l,r in zip(left,right)))
rms=math.sqrt(sum((l*gain)**2+(r*gain)**2 for l,r in zip(left,right))/(2*N))
print(f'HEAD OUT: 60s / stereo 44.1kHz / 120 BPM / peak .89 / RMS {rms:.3f}')
