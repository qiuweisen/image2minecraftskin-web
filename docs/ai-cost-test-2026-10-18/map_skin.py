# Quick prototype of plan step "ai-sheet": split halves, bbox, body-proportion crops -> 64x64 Java classic skin
import sys,os,json
from PIL import Image
import numpy as np
def bbox(a):
    nonwhite=(a[:,:,:3].min(axis=2)<235)
    # drop thin vertical divider lines (e.g. black separator): columns whose non-white run covers >90% height and are isolated
    h,w=nonwhite.shape
    colfrac=nonwhite.mean(axis=0)
    for x in range(w):
        if colfrac[x]>0.9 and (x<12 or x>w-13): nonwhite[:,x]=False
    ys,xs=np.where(nonwhite)
    if len(xs)<500: return None
    return xs.min(),ys.min(),xs.max()+1,ys.max()+1
def parts(img,flip_lr=False):
    a=np.asarray(img.convert('RGB'))
    b=bbox(a)
    if b is None: return None,None
    x0,y0,x1,y1=b; H=y1-y0; u=H/32; cx=(x0+x1)/2
    def box(ux0,uy0,uw,uh): return img.crop((int(cx+ux0*u),int(y0+uy0*u),int(cx+(ux0+uw)*u),int(y0+(uy0+uh)*u)))
    P={'head':box(-4,0,8,8),'body':box(-4,8,8,12),
       'vleft_arm':box(-8,8,4,12),'vright_arm':box(4,8,4,12),
       'vleft_leg':box(-4,20,4,12),'vright_leg':box(0,20,4,12)}
    return P,b
def put(skin,im,x,y,w,h): skin.paste(im.convert('RGBA').resize((w,h),Image.BOX),(x,y))
def side(skin,im,col,x,y,w,h):
    a=im.convert('RGBA').resize((max(1,im.width//8),h),Image.BOX)
    c=a.crop((0,0,1,h)) if col=='l' else a.crop((a.width-1,0,a.width,h))
    skin.paste(c.resize((w,h),Image.NEAREST),(x,y))
def topbot(skin,im,row,x,y,w,d):
    a=im.convert('RGBA').resize((w,8),Image.BOX)
    r=a.crop((0,0,w,1)) if row=='t' else a.crop((0,7,w,8))
    skin.paste(r.resize((w,d),Image.NEAREST),(x,y))
def make(path,out):
    img=Image.open(path).convert('RGB'); W,H=img.size
    F,bf=parts(img.crop((0,0,W//2,H))); B,bb=parts(img.crop((W//2,0,W,H)))
    res={'front_bbox':[int(v) for v in bf] if bf else None,'back_bbox':[int(v) for v in bb] if bb else None}
    if not F or not B: res['layout_ok']=False; return res
    hf=bf[3]-bf[1]; hb=bb[3]-bb[1]; res['height_diff']=round(abs(hf-hb)/max(hf,hb),3)
    res['width_ratio_front']=round((bf[2]-bf[0])/(hf/2),2)  # 1.0 == exactly 16u wide (no accessories)
    res['layout_ok']=res['height_diff']<=0.15
    s=Image.new('RGBA',(64,64),(0,0,0,0))
    # front: viewer-left = player's right
    put(s,F['head'],8,8,8,8); put(s,B['head'],24,8,8,8)
    side(s,F['head'],'l',0,8,8,8); side(s,F['head'],'r',16,8,8,8)
    topbot(s,F['head'],'t',8,0,8,8); topbot(s,F['body'],'t',16,0,8,8)
    put(s,F['body'],20,20,8,12); put(s,B['body'],32,20,8,12)
    side(s,F['body'],'l',16,20,4,12); side(s,F['body'],'r',28,20,4,12)
    topbot(s,F['body'],'t',20,16,8,4); topbot(s,F['body'],'b',28,16,8,4)
    # right arm (player) = front viewer-left, back viewer-right
    put(s,F['vleft_arm'],44,20,4,12); put(s,B['vright_arm'],52,20,4,12)
    side(s,F['vleft_arm'],'l',40,20,4,12); side(s,F['vleft_arm'],'r',48,20,4,12)
    topbot(s,F['vleft_arm'],'t',44,16,4,4); topbot(s,F['vleft_arm'],'b',48,16,4,4)
    put(s,F['vright_arm'],36,52,4,12); put(s,B['vleft_arm'],44,52,4,12)
    side(s,F['vright_arm'],'l',32,52,4,12); side(s,F['vright_arm'],'r',40,52,4,12)
    topbot(s,F['vright_arm'],'t',36,48,4,4); topbot(s,F['vright_arm'],'b',40,48,4,4)
    put(s,F['vleft_leg'],4,20,4,12); put(s,B['vright_leg'],12,20,4,12)
    side(s,F['vleft_leg'],'l',0,20,4,12); side(s,F['vleft_leg'],'r',8,20,4,12)
    topbot(s,F['vleft_leg'],'t',4,16,4,4); topbot(s,F['vleft_leg'],'b',8,16,4,4)
    put(s,F['vright_leg'],20,52,4,12); put(s,B['vleft_leg'],28,52,4,12)
    side(s,F['vright_leg'],'l',16,52,4,12); side(s,F['vright_leg'],'r',24,52,4,12)
    topbot(s,F['vright_leg'],'t',20,48,4,4); topbot(s,F['vright_leg'],'b',24,48,4,4)
    s.save(out); res['skin']=out; return res
def preview(skin_path,out):
    s=Image.open(skin_path).convert('RGBA'); k=8
    def fr(back):
        c=Image.new('RGBA',(16,32),(40,40,48,255))
        if not back:
            c.paste(s.crop((8,8,16,16)),(4,0)); c.paste(s.crop((20,20,28,32)),(4,8))
            c.paste(s.crop((44,20,48,32)),(0,8)); c.paste(s.crop((36,52,40,64)),(12,8))
            c.paste(s.crop((4,20,8,32)),(4,20)); c.paste(s.crop((20,52,24,64)),(8,20))
        else:
            c.paste(s.crop((24,8,32,16)),(4,0)); c.paste(s.crop((32,20,40,32)),(4,8))
            c.paste(s.crop((44,52,48,64)),(0,8)); c.paste(s.crop((52,20,56,32)),(12,8))
            c.paste(s.crop((28,52,32,64)),(4,20)); c.paste(s.crop((12,20,16,32)),(8,20))
        return c.resize((16*k,32*k),Image.NEAREST)
    o=Image.new('RGBA',(16*k*2+20,32*k),(40,40,48,255)); o.paste(fr(False),(0,0)); o.paste(fr(True),(16*k+20,0)); o.save(out)
if __name__=='__main__':
    os.makedirs('skins',exist_ok=True); R={}
    for f in sorted(os.listdir('ai')):
        if f.startswith('WRONG'): continue
        n=f.split('__')[0]; r=make('ai/'+f,f'skins/{n}.png')
        if r.get('skin'): preview(r['skin'],f'skins/{n}_preview.png')
        R[n]=r; print(n,r)
    json.dump(R,open('mapping.json','w'),indent=1,default=lambda o: o.item() if hasattr(o,'item') else str(o))
