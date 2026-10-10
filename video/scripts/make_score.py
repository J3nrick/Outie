"""Outie's original 60-second promotional score. 128 BPM, 32 bars, D major.
Pure deterministic synthesis: no copyrighted recordings, external samples, or API calls.
"""
from array import array
from pathlib import Path
import math, random, struct, wave

SR=44100
SECONDS=60
BPM=128
BEAT=60/BPM
BAR=BEAT*4
TAU=math.tau
N=SR*SECONDS
music_l=array('f',[0.0])*N
music_r=array('f',[0.0])*N
fx_l=array('f',[0.0])*N
fx_r=array('f',[0.0])*N
rng=random.Random(761)

def add(start,duration,fn,vol=1,pan=0,fx=False):
    first=round(start*SR)
    left,right=(fx_l,fx_r) if fx else (music_l,music_r)
    gl=math.sqrt((1-pan)/2);gr=math.sqrt((1+pan)/2)
    for j in range(max(0,min(round(duration*SR),N-first))):
        t=j/SR
        value=fn(t,duration)*vol
        left[first+j]+=value*gl
        right[first+j]+=value*gr

def freq(midi): return 440*2**((midi-69)/12)
def envelope(t,d,decay,attack=.006):
    return min(1,t/attack)*math.exp(-t*decay)*min(1,max(0,(d-t)/.04))
def piano(midi,decay=2.3):
    hz=freq(midi)
    return lambda t,d: envelope(t,d,decay)*(math.sin(TAU*hz*t)+.35*math.sin(TAU*hz*2.001*t)*math.exp(-t*3)+.14*math.sin(TAU*hz*3.003*t)*math.exp(-t*5)+.045*math.sin(TAU*hz*4.009*t)*math.exp(-t*8))
def glass(midi):
    hz=freq(midi)
    return lambda t,d: envelope(t,d,6.3)*(math.sin(TAU*hz*t)+.25*math.sin(TAU*hz*2*t)+.15*math.sin(TAU*hz*3.99*t)*math.exp(-t*10))
def bass(midi):
    hz=freq(midi)
    return lambda t,d: envelope(t,d,3.2,.012)*(math.sin(TAU*hz*t)+.2*math.sin(TAU*hz*2*t)+.09*math.sin(TAU*hz*3*t))
def pad(midi,detune):
    hz=freq(midi)
    return lambda t,d: min(1,t/.35)*min(1,max(0,(d-t)/.65))*(math.sin(TAU*hz*t)+.25*math.sin(TAU*hz*1.002*t+detune)+.08*math.sin(TAU*hz*2*t))
def kick(t,d):
    phase=TAU*(48*t+3.7*(1-math.exp(-t*38)))
    return math.sin(phase)*math.exp(-t*17)+rng.uniform(-1,1)*math.exp(-t*170)*.15

def noise_note(decay,kind='hat'):
    last=[0.0]
    def sound(t,d):
        n=rng.uniform(-1,1)
        hp=n-last[0]*.82
        last[0]=n
        env=math.exp(-t*decay)
        if kind=='clap':
            env=(math.exp(-t*45)+.8*math.exp(-max(0,t-.012)*60)*(t>=.012)+.7*math.exp(-max(0,t-.027)*45)*(t>=.027))*.45
        return hp*env*min(1,max(0,(d-t)/.008))
    return sound

# D / Bm / G / A. Chord voicings leave space for the notification motif.
chords=[(50,[62,66,69,73]),(47,[59,62,66,69]),(43,[55,59,62,66]),(45,[57,61,64,69])]
melody=[74,78,81,83,81,78,76,78,74,78,81,85,83,81,78,76]
for bar in range(32):
    at=bar*BAR
    root,voicing=chords[bar%4]
    if bar==31: root,voicing=50,[62,66,69,74]
    # Intro and breakdown use more air; the final four bars return with the full motif.
    intro=bar<3
    bridge=25<=bar<28
    context=9<=bar<14
    piano_gain=.13 if intro or bridge else .10
    for k,m in enumerate(voicing):
        add(at+k*.024,BAR*1.2,piano(m),piano_gain,(-.45+k*.3))
        if bar>=3:
            add(at,BAR*1.15,pad(m,bar*.3),.037 if context else .05,(-.65+k*.43))
    if not intro and not bridge:
        for beat in range(4):
            t=at+beat*BEAT
            add(t,.34,kick,.66 if not context else .43)
            add(t,.39,bass(root),.40)
            if beat%2:
                add(t,.19,noise_note(28,'clap'),.15)
                add(t,.15,lambda u,d: math.sin(TAU*190*u)*math.exp(-u*28),.07)
            add(t+BEAT*.5,.16,noise_note(21),.055,-.18)
        for step in range(16):
            # A swung sixteenth shaker, alternating stereo positions.
            t=at+step*BEAT/4+(BEAT*.04 if step%2 else 0)
            add(t,.06,noise_note(78),.025 if step%2 else .038,(-.5 if step%2 else .5))
        for offset in [.75,1.5,2.75,3.5]:
            add(at+offset*BEAT,BEAT*.4,bass(root+12),.14)
    elif bridge:
        # Half-time claps open up the aspirational typography bridge.
        add(at+BEAT,.23,noise_note(22,'clap'),.12)
        add(at+BEAT*3,.23,noise_note(22,'clap'),.12)
    else:
        add(at+BEAT,.10,noise_note(35,'clap'),.035)
        add(at+BEAT*3,.10,noise_note(35,'clap'),.035)
    # Small arpeggios supply motion between the larger feature moments.
    for step in range(8):
        m=voicing[[0,1,2,3,2,1,3,2][step]]+12
        add(at+step*BEAT*.5,.6,glass(m),.085 if context else .11,math.sin(step*1.4)*.48)
    if 5<=bar<9 or 14<=bar<25 or bar>=28:
        # An authored two-bar melody with a dotted response, not a stock music loop.
        notes=melody[(bar%2)*8:(bar%2+1)*8]
        for step,m in enumerate(notes):
            if step in [3,7] and bar%2==0: continue
            add(at+step*BEAT*.5,BEAT*.9,piano(m,3.6),.17,math.sin(bar*.8)*.15)
    if bar in [2,4,8,13,17,20,24,27]:
        # Compact fill and breath before the next edit.
        for k in range(4):
            add(at+BEAT*3+k*BEAT*.25,.11,noise_note(38,'clap'),.045+k*.014,(-.3+k*.2))

# The final chord is a tonic major resolution, allowed to ring rather than cut off.
for m in [50,62,66,69,74,78]:
    add(58.15,1.85,piano(m,1.3),.13,(m%3-1)*.28)

# Frame-exact sound design. The same three-note reminder signature returns across the film.
for at in [2.05,5.633,9.367,16.867,26.233,29.983,33.733,35.333,39.367,46.867,52.5,54.6]:
    for j,m in enumerate([86,90,93]):
        add(at+j*.047,.62,glass(m),.08,(-.25+j*.25),True)
for at in [5.1,8.9,16.35,25.73,33.23,38.87,46.36,51.95]:
    last=[0.0]
    def sweep(t,d):
        n=rng.uniform(-1,1);hp=n-last[0]*.75;last[0]=n
        e=math.sin(math.pi*t/d)**2
        return (hp*.25+math.sin(TAU*(160*t+1100*t*t))*.13)*e
    add(at,.52,sweep,.14,-.1,True)
# Reverb-like multi-tap reflections: short, quiet, and wider than the dry centre.
for delay,gain in [(int(SR*.1875),.13),(int(SR*.28125),.09),(int(SR*.375),.045)]:
    for i in range(N-1,delay-1,-1):
        music_l[i]+=music_r[i-delay]*gain
        music_r[i]+=music_l[i-delay]*gain

# Mild pumping follows the drums; gentle saturation controls peaks, without hard clipping.
for i in range(N):
    t=i/SR
    b=int(t/BAR)
    if 3<=b<25 or b>=28:
        phase=t%BEAT
        duck=.77+.23*min(1,phase/.13)
        music_l[i]*=duck;music_r[i]*=duck

folder=Path(__file__).resolve().parents[1]/'public/audio'
folder.mkdir(exist_ok=True)
def write(name,left,right,target,fade_start):
    # Softly saturate, normalise, and preserve a smooth ending.
    peak=max(max(abs(math.tanh(x*1.1)) for x in left),max(abs(math.tanh(x*1.1)) for x in right)) or 1
    gain=target/peak
    rms=0.0
    with wave.open(str(folder/name),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
        out=bytearray()
        for i,(l,r) in enumerate(zip(left,right)):
            t=i/SR
            fade=min(1,t/.012,max(0,(60-t)/(60-fade_start)))
            l=math.tanh(l*1.1)*gain*fade;r=math.tanh(r*1.1)*gain*fade
            out.extend(struct.pack('<hh',round(l*32767),round(r*32767)))
            rms+=(l*l+r*r)*.5
        w.writeframes(out)
    print(f'{name}: 60.0s stereo PCM / peak {target:.2f} / RMS {math.sqrt(rms/N):.3f}')
write('outie-uplift.wav',music_l,music_r,.83,58.5)
write('outie-motion-fx.wav',fx_l,fx_r,.42,59.1)
print('Original D-major score: 128 BPM, 32 bars, 60 seconds; separate music and motion FX stems.')
