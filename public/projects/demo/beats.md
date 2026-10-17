# demo reel — beat sheet (v2)
Camera: no zoom (pushInPercent 0, cut scale 1). Variety comes from titles, cards and b-roll. Face covers ~55%.

| t (s) | Spoken | Visual | Kind | Spec |
|---|---|---|---|---|
| 0.5-2.7 | "Trump ne apna Fed shift isliye banaya tha" | Title "Trump's pick / wanted lower rates" | title | |
| 3.3-5.3 | "rate badha diye" | Title "Rates up / not down" | title | |
| 5.7-7.9 | "rate 3.75 se 4% kar diya" | Count-up 3.75 -> 4.00% | broll stat | id=rate label="Fed interest rate" from=3.75 to=4 suffix=% decimals=2 |
| 8.3-10.5 | "2013 ke baad se yeh pehla hike" | Card: first hike since 2013 | card swiss/split | id=hike2013 kicker="RATE DECISION" title="*First* hike since 2013" |
| 11.2-13.2 | "12-0 vote se paas huva" | Card: unanimous 12-0 | card minimal/split | id=vote accent=1 kicker="FOMC VOTE" title="*Unanimous*" value=12-0 label=vote |
| 14.5-16.4 | "fedsi banay tha" | Federal Reserve photo | broll image | id=fedphoto src=projects/demo/assets/photos/federal-reserve-eccles.jpg label="The Fed" |
| 23.7-26.7 | "inflation abhi bhi 3.7 par atka hua hai, target hai 2%" | Bar chart: inflation 3.7% vs 2% target | broll chart | id=infl title="Inflation vs target" chartType=bar items="Inflation:3.7;Target:2" unit=% highlight=0 |
| 26.8-27.8 | "target hai 2%" | Title "2% target" (existing) | title | |
| 27.9-29.1 | "Iran tension ke waze se" | Map: Iran highlighted | broll map | id=iran title="Iran tension" regions=Iran pins="Iran:53:32" focus="20,5,80,45" |
| 29.7-31.7 | "Oil bhi 100 dollar tak" | Refinery photo | broll image | id=oil src=projects/demo/assets/photos/oil-refinery.jpg label="Oil · $100" |
| 31.8-36.6 | "dollar strong, Gold pressure mein, crypto dab sakte hai" | Takeaway list card | card editorial/split | id=takeaway accent=3 kicker="WHAT IT MEANS" title="Market *impact*" list="Dollar: strong;Gold: under pressure;Crypto: risk assets may dip" |
| 37.9-40.1 | "tell me in the comments" | Title CTA (existing) | title | |

Dropped: "Gold under pressure" title and "Crypto" keyword card (duplicated by the list card).
Only numbers spoken in the video appear on cards. Card text is verbatim from the transcript.
Regenerate timeline entries: `python scripts/beats_to_timeline.py public/projects/demo --validate` (rewrites `broll` and `cards` only).
