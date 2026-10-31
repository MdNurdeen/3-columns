import json,subprocess
anim=[(0,5),(5,10.5),(10.5,18.5),(18.5,25.5),(25.5,32),(32,35)]
segs=[];A=0
for i,(a,b) in enumerate(anim,1):
    d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'vo/en_US-ryan-high-{i}.wav']))
    L=max(b-a,d+1.0) if i<6 else max(b-a+.5,d+1.2)
    segs.append(dict(a=a,b=b,A=A,B=A+L,vo=A+0.35));A+=L
json.dump(segs,open('segs.json','w'));print(json.dumps(segs,indent=0),'\nTOTAL',A)
