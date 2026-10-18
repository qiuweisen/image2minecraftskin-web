from PIL import Image,ImageDraw,ImageFont
import json
runs={json.loads(l)['name']:json.loads(l) for l in open('runs.jsonl') if 'note' not in json.loads(l)}
M=json.load(open('mapping.json'))
try: F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
except: F=ImageFont.load_default()
rows=['portrait-selfie','pet','full-body']; RH=420
W=420+430+300+20*4+300
sh=Image.new('RGB',(W,40+RH*len(rows)),'white'); d=ImageDraw.Draw(sh)
for i,t in enumerate(['input photo','AI image (Nano Banana 2, 1K)','64x64 skin (prototype)','front / back preview']):
    d.text(([10,440,880,1200][i],10),t,fill='black',font=F)
for r,n in enumerate(rows):
    y=40+r*RH
    a=Image.open(f'inputs/{n}.jpg'); a.thumbnail((400,380)); sh.paste(a,(10,y))
    b=Image.open(f'ai/{n}__nano-banana-2.png').resize((380,380)); sh.paste(b,(440,y))
    c=Image.open(f'skins/{n}.png').convert('RGBA'); bg=Image.new('RGBA',(64,64),(200,200,200,255)); bg.alpha_composite(c); sh.paste(bg.resize((256,256),Image.NEAREST).convert('RGB'),(880,y))
    p=Image.open(f'skins/{n}_preview.png').convert('RGB'); p.thumbnail((300,380)); sh.paste(p,(1200,y))
    R=runs[n]; m=M[n]
    d.text((880,y+270),f"{R['kie_fields']['creditsConsumed']:.0f} credits = ${R['kie_fields']['creditsConsumed']*0.005:.3f}",fill='black',font=F)
    d.text((880,y+295),f"latency {R['latency_s']}s",fill='black',font=F)
    d.text((880,y+320),f"layout front-L/back-R: {'OK' if m['layout_ok'] else 'FAIL'}",fill='black',font=F)
    d.text((880,y+345),f"height diff {m['height_diff']}, width {m['width_ratio_front']}",fill='black',font=F)
sh.save('comparison-sheet.png'); print(sh.size)
