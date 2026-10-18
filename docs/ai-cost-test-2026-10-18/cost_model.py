packs=[(1.99,10),(2.99,15),(4.99,30),(6.99,50),(9.99,100),(4.99,25),(9.99,60)]
scen={'measured':0.025*1.15,'conservative':0.04*1.3}
lines=['# Cost model (KIE Nano Banana 2 1K)','',
'- measured: 5 credits/call x $0.005 = $0.025/call (4/4 task records + balance 776 -> 756), x1.15 calls/skin (15%% assumed layout-redo rate; 0/3 observed) = $%.4f/skin'%scen['measured'],
'- conservative: 8 credits/call ($0.04, the English list price on kie.ai/nano-banana-2) x1.30 calls/skin = $%.4f/skin'%scen['conservative'],
'- Stripe: 2.9% + $0.30; assumes 100% of credits get used (worst case)','',
'| pack | $/skin to user | Stripe fee | net | AI cost (measured) | margin (measured) | AI cost (conservative) | margin (conservative) |','|---|---|---|---|---|---|---|---|']
rows=[]
for p,n in packs:
    fee=p*0.029+0.30; net=p-fee
    cm=n*scen['measured']; cc=n*scen['conservative']
    rows.append((p,n,fee,net,cm,(net-cm)/p,cc,(net-cc)/p))
    lines.append(f'| ${p}/{n} | ${p/n:.3f} | ${fee:.2f} | ${net:.2f} | ${cm:.2f} | {(net-cm)/p*100:.0f}% | ${cc:.2f} | {(net-cc)/p*100:.0f}% |')
lines+=['','Free signup skin: $%.3f (measured) / $%.3f (conservative) per user who uses it.'%(scen['measured'],scen['conservative']),
'If 3%% of users who use the free skin pay: ~33 free skins per paying user = $%.2f / $%.2f carried by each payer.'%(33*scen['measured'],33*scen['conservative'])]
open('cost-model.md','w').write('\n'.join(lines)+'\n'); print('\n'.join(lines))
