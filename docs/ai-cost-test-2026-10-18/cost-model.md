# Cost model (KIE Nano Banana 2 1K)

- measured: 5 credits/call x $0.005 = $0.025/call (4/4 task records + balance 776 -> 756), x1.15 calls/skin (15% assumed layout-redo rate; 0/3 observed) = $0.0287/skin
- conservative: 8 credits/call ($0.04, the English list price on kie.ai/nano-banana-2) x1.30 calls/skin = $0.0520/skin
- Stripe: 2.9% + $0.30; assumes 100% of credits get used (worst case)

| pack | $/skin to user | Stripe fee | net | AI cost (measured) | margin (measured) | AI cost (conservative) | margin (conservative) |
|---|---|---|---|---|---|---|---|
| $1.99/10 | $0.199 | $0.36 | $1.63 | $0.29 | 68% | $0.52 | 56% |
| $2.99/15 | $0.199 | $0.39 | $2.60 | $0.43 | 73% | $0.78 | 61% |
| $4.99/30 | $0.166 | $0.44 | $4.55 | $0.86 | 74% | $1.56 | 60% |
| $6.99/50 | $0.140 | $0.50 | $6.49 | $1.44 | 72% | $2.60 | 56% |
| $9.99/100 | $0.100 | $0.59 | $9.40 | $2.88 | 65% | $5.20 | 42% |
| $4.99/25 | $0.200 | $0.44 | $4.55 | $0.72 | 77% | $1.30 | 65% |
| $9.99/60 | $0.167 | $0.59 | $9.40 | $1.72 | 77% | $3.12 | 63% |

Free signup skin: $0.029 (measured) / $0.052 (conservative) per user who uses it.
If 3% of users who use the free skin pay: ~33 free skins per paying user = $0.95 / $1.72 carried by each payer.
