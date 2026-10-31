import numpy as np,json,wave
segs=json.load(open('segs.json'));D=segs[-1]['B'];sr=44100;t=np.arange(int(D*sr))/sr
def n(m):return 440*2**((m-69)/12)
chords=[[57,60,64,67],[53,57,60,64],[48,52,55,59],[55,59,62,64]]  # Am7 Fmaj7 Cmaj7 G6
bar=4.0;out=np.zeros_like(t)
for k in range(int(D/bar)+1):
    c=chords[k%4];s=int(k*bar*sr);e=min(len(t),int((k+1)*bar*sr+sr));tt=t[s:e]-k*bar
    env=np.minimum(1,tt/1.2)*np.exp(-np.maximum(0,tt-bar)*3)
    pad=sum(np.sin(2*np.pi*n(m)*tt)+.5*np.sin(2*np.pi*n(m)*1.003*tt) for m in c)/len(c)
    sub=np.sin(2*np.pi*n(c[0]-12)*tt)*.6
    out[s:e]+=(pad*.22+sub*.18)*env
    for j in range(8):  # soft arpeggio, 8th notes
        st=k*bar+j*.5;i0=int(st*sr)
        if i0>=len(t):break
        m=c[[0,2,1,3,2,1,3,2][j]]+12;L=min(len(t)-i0,int(1.2*sr));x=np.arange(L)/sr
        out[i0:i0+L]+=np.sin(2*np.pi*n(m)*x)*np.exp(-x*4)*.10*(1+.4*np.sin(2*np.pi*n(m)*2*x))
# gentle lowpass + fades
k=np.ones(12)/12;out=np.convolve(out,k,'same')
out*=np.minimum(1,t/1.5)*np.minimum(1,(D-t)/2.5)
out=out/np.max(np.abs(out))*.6
w=wave.open('music.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((out*32767).astype(np.int16).tobytes());w.close();print('music',D)
