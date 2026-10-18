import os,sys,json,time,base64,urllib.request
KEY=os.environ['KIE_API_KEY']
H={'Authorization':'Bearer '+KEY,'Content-Type':'application/json'}
def req(url,data=None):
    r=urllib.request.Request(url,data=json.dumps(data).encode() if data else None,headers=H,method='POST' if data else 'GET')
    return json.loads(urllib.request.urlopen(r,timeout=120).read())
def balance(): return req('https://api.kie.ai/api/v1/chat/credit')['data']
PROMPT=open('prompt.txt').read().strip()
PET=open('prompt_pet.txt').read().strip()
name,model,kind=sys.argv[1],sys.argv[2],sys.argv[3]
inp='inputs/'+name+'.jpg'
b64='data:image/jpeg;base64,'+base64.b64encode(open(inp,'rb').read()).decode()
b0=balance()
up=req('https://kieai.redpandaai.co/api/file-base64-upload',{'base64Data':b64,'uploadPath':'images/i2m-cost-test','fileName':name+'.jpg'})
url=up['data'].get('downloadUrl') or up['data'].get('fileUrl')
b1=balance()
prompt=PROMPT+(' '+PET if kind=='pet' else '')
t0=time.time()
c=req('https://api.kie.ai/api/v1/jobs/createTask',{'model':model,'input':{'prompt':prompt,'image_input':[url],'aspect_ratio':'1:1','resolution':'1K','output_format':'png'}})
tid=(c.get('data') or {}).get('taskId')
print('create',c.get('code'),c.get('msg'),tid,flush=True)
while True:
    time.sleep(4)
    d=req('https://api.kie.ai/api/v1/jobs/recordInfo?taskId='+tid)['data']
    st=(d.get('state') or '').lower()
    if st in('success','fail','failed'): break
    if time.time()-t0>600: st='timeout';break
lat=time.time()-t0
out=None
if st=='success':
    u=json.loads(d['resultJson'])['resultUrls'][0]
    out=f'ai/{name}__{model}.png'; os.makedirs('ai',exist_ok=True)
    urllib.request.urlretrieve(u,out)
time.sleep(3)
b2=balance()
rec={'name':name,'model':model,'kind':kind,'taskId':tid,'state':st,'latency_s':round(lat,1),'bal_before':b0,'bal_after_upload':b1,'bal_after':b2,'credits_charged':b0-b2,
     'kie_fields':{k:d.get(k) for k in d if k not in('resultJson','param')},'failMsg':d.get('failMsg'),'out':out}
print(json.dumps(rec,ensure_ascii=False))
open('runs.jsonl','a').write(json.dumps(rec,ensure_ascii=False)+'\n')
