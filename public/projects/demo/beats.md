# demo reel — beat sheet (from scratch: natural, balance of photos + motion graphics)

Feel: a creator talking to camera. Real photos when he names a THING; a motion graphic only when he says a NUMBER
the viewer must remember (4%, 12-0, 3.7 vs 2). No headline titles, no colored washes, no zooms.
Graphics sit in the top zone over a darkened photo of the same subject, so photos and graphics read as one language.

Rules:
- Numbers -> top-zone graphic that moves on the spoken number (ticker, vote seats, gauge). Max 3 in the reel.
- A photo only when a concrete thing is named (the Fed, the Senate, groceries/inflation, Iran, oil, dollar, gold, crypto).
- Photos go FULL-BLEED: the face cuts out entirely while a photo is up (no split screens), captions keep running.
  Numbers stay as top-zone graphics over the face, because his delivery sells those lines. Face-free ~10s of 41s.
- 1.8-4s per photo, cut on the spoken noun; face-only between beats.
- No text behind the subject. Captions: plain rail, accent color on the key words only.
- Sound (timeline.json `sfx`, CC0, 10-15 dB under the voice): soft whoosh into each photo/graphic, a tick when a number lands,
  one tick per vote seat, a soft pop on the 12-0 / +0.25 / 2% moments. Felt, not heard.
- Captions: transcription typos fixed (Warsh, Trump, Fed chief, Senate, favour, wajah...), lines break on commas, never split a name,
  and back-to-back lines hard-switch instead of crossfading.
- Camera: three quiet cuts on sentence starts (scale 1.0/1.03), 2% slow push.

| t (s) | Spoken | Visual | Kind | Spec |
|---|---|---|---|---|
| 0.0-4.7 | "Trump ne apna Fed isliye banaya tha taki rate ghate, phir bhi us bande ne rate badha diye" | Face only. The hook is his delivery | face | |
| 4.9-8.0 | "kal Fed ne apna interest rate 3.75 se 4% kar diya" | Rate ticker over the Fed seal photo: 3.75% rolls to 4.00% on "4%" (6.86), line steps up, +0.25 chip | broll ticker | id=rate label="FED INTEREST RATE" from=3.75 to=4 decimals=2 suffix=% stepAt=1.96 chip="+0.25" line=step bg=projects/demo/assets/photos/fed-seal.jpg |
| 8.0-10.0 | "2013 ke baad se yeh pehla hike tha" | Face | face | |
| 10.0-13.1 | "sab iske favour mein the, 12-0 vote se paas" | Vote seats fill one by one, "12-0 UNANIMOUS" lands on "12-0" (11.5) | broll votes | id=vote yes=12 no=0 label="FED BOARD VOTE" verdict="UNANIMOUS" resultAt=1.5 |
| 13.2-16.2 | "yahi banda, Kevin Warsh" (he holds up his phone with Warsh's photo, 13.2-13.6) | Lands WITH the phone reveal, not after it. Name card in the top zone (clear of the face): red bar, name wipes in, role above | broll lowerThird | id=warsh-lt title="Kevin Warsh" sub="Trump's Fed pick" tone=neutral placement=top |
| 18.4-20.6 | "lekin usne Senate ko yeh wala kiya tha" | FULL-BLEED: US Capitol at dusk (Pexels). Face out, hard cut in and back | broll montage | id=senate shots="projects/demo/assets/photos/capitol-dusk.jpg" |
| 20.6-23.7 | "kal usne wahi kiya" | Face | face | |
| 23.7-27.3 | "inflation abhi bhi 3.7 par atka hua hai, target hai 2%" | Inflation bar over the supermarket price-tag photo: fills to 3.7% on "3.7" and strains there; 2% target drops in on "2%" (26.7) | broll gauge | id=infl label="INFLATION" value=3.7 target=2 max=5 unit=% valueAt=1.0 targetAt=3.0 bg=projects/demo/assets/photos/grocery-prices.jpg |
| 27.8-31.4 | "Iran tension ke wajah se Oil bhi 100 dollar tak" | FULL-BLEED: Tehran at night -> oil pumpjack at sunset (cut on "Oil", 29.6) | broll montage | id=iran-oil shots="projects/demo/assets/photos/tehran-night.jpg;projects/demo/assets/photos/oil-pumpjack-sunset.jpg@58% 50%" |
| 32.3-36.5 | "dollar strong... Gold pressure... crypto" | FULL-BLEED: dollar bills -> gold bars -> bitcoin, a hard cut on each word | broll montage | id=markets shots="projects/demo/assets/photos/dollar-bills.jpg@45% 50%;projects/demo/assets/photos/gold-bars-stack.jpg;projects/demo/assets/photos/bitcoin-coin.jpg@37% 50%" |
| 36.5-end | "tum log kya sochte ho... comments" | Face, clean ending | face | |

Photos: Pexels License (free commercial use), entries in assets/manifest.json.
Fact check: "first hike since 2013" is as spoken; the real Fed hiked in 2015-18 and 2022-23, so verify before publishing.
