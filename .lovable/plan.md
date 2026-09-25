# গেমপ্লে পরিবর্তন — ধাপে ধাপে পরিকল্পনা

প্লেয়ার, ব্যাকগ্রাউন্ড, সব শত্রু আর সব বসের চেহারা আগের মতোই থাকবে। শুধু খেলার নিয়ম আর লেভেল সাজানো বদলাবে। প্রতিটা ধাপ শেষ হলে আপনি ফোনে খেলে দেখবেন, তারপর পরের ধাপ।

## একটা বিরোধ — আগে ঠিক করতে হবে
আগের মেসেজে বলেছিলেন "লেভেল ১–৩০ তে ২টা wave, পরে ৩টা, প্রতি লেভেলে বস"। নতুন ফাইলে বলা আছে "লেভেল ১–৫ তে ৪টা wave … ৪১–৫০ তে ৯টা wave + বস"। এই পরিকল্পনা **নতুন ফাইল অনুযায়ী** ধরা হয়েছে। আগেরটা রাখতে চাইলে বলবেন।

## ধাপ ১ — Battle Skills (লেভেলের ভেতরের সাময়িক আপগ্রেড)
- কয়েকটা wave শেষে খেলা থেমে যাবে, স্ক্রিনশটের মতো "Battle Skills" পাতা আসবে: ৩টা কার্ড, প্রতিটায় নাম, hexagon আইকন, তারা (লেভেল)।
- একটা বেছে নিলে খেলা আবার চলবে। লেভেল শেষ হলে সব রিসেট হবে।
- স্কিল: Damage +20/30%, Fire Rate +20/40%, +1/+2 Projectile, Crit Chance, Crit Damage, Movement Speed, Damage Reduction, Max HP, Life Steal, Projectile Size, Projectile Speed, Piercing, Homing, Explosive, Chain Lightning — একটার ওপর আরেকটা যোগ হবে।
- আপনার পাঠানো আইকন শিট কেটে প্রতিটা স্কিলে সরাসরি বসানো হবে।
- উপরে নেওয়া স্কিলগুলোর ছোট আইকনের সারি দেখাবে।

## ধাপ ২ — Weapon Evolution + প্লেয়ারের শুরুর মান
- শুরু: 80 HP, Damage 10, 4 গুলি/সেকেন্ড, 1 গুলি, Crit 5% / 150%।
- স্কিল নিতে নিতে অস্ত্র বড় হবে: 1 → 2 → 3 → 5 গুলি → Spread → Spread+Piercing → +Homing।
- যুদ্ধের মাঝে HP নিজে থেকে বাড়বে না (শুধু Health পাওয়ার-আপ / Life Steal)।

## ধাপ ৩ — লেভেল ও wave সাজানো (৫০ লেভেল)
- ১–৫: ৪ wave, ৬–১০: ৫, ১১–২০: ৬, ২১–৩০: ৭, ৩১–৪০: ৮, ৪১–৫০: ৯ — প্রতিটার শেষে বস।
- শত্রু ধীরে ধীরে পরিচয়: প্রথমে Scout/Drone/Swarmer/Miner, ৩–৫ এ Turret/Orbiter/Raider/Sentinel, ৬–১০ এ Phantom/Cruiser, ১১+ এ Bomber/Laser/Sniper/Healer/Jammer/Teleporter, ২১+ এ Shielder/Splitter মিশ্রণ।
- ফাইলের ফর্মেশনগুলো (৫ Scout V, 2 Drone + 3 Scout, 1 Healer + elite ইত্যাদি), একসাথে না — ধাপে ধাপে আসবে।
- বস আসার আগে লাল "Tough Enemy Incoming!" সতর্কবার্তা (স্ক্রিনশটের মতো, নিজস্ব ডিজাইনে)।
- উপরে "Wave 3/5" দেখাবে।

## ধাপ ৪ — শত্রুর কাজ
প্রত্যেক শত্রুর নিজস্ব আচরণ: Swarmer zigzag, Miner 3-way গুলি, Turret স্থির, Orbiter ঘুরে গুলি, Raider spread, Sentinel burst, Phantom/Teleporter জায়গা বদল, Shielder আগে ঢাল, Splitter ভেঙে ছোট drone, Healer আশেপাশে heal, Jammer সাময়িক পাওয়ার-আপ বন্ধ, Sniper ধীর কিন্তু ভারী গুলি।

## ধাপ ৫ — বস
- বস-লেভেল বরাদ্দ: ৫ Inferno Core, ১০ Frost Colossus … ৫০ Ancient Entity; মাঝের লেভেলে আগের বসের দুর্বল রূপ।
- HP: ৫→5,000, ১০→8,000 … ৫০→100,000 (এক জায়গায় সহজে বদলানো যাবে)।
- ৩টা phase (100–70%, 70–40%, 40–0%): গতি বাড়ে, নতুন আক্রমণ, শেষে minion ডাকে।
- প্রত্যেক বসের ফাইলে লেখা নিজস্ব আক্রমণ।

## ধাপ ৬ — পাওয়ার-আপ, কয়েন, লেভেল শেষ/ফেল
- পাওয়ার-আপ: Damage Boost, Rapid Fire, Double/Triple Shot, Shield, Health, Bomb, Piercing, Homing, Explosive — elite থেকে বেশি পড়বে।
- কয়েন ফাইলের তালিকা অনুযায়ী (Scout 2 … Teleporter 25), বস লেভেল অনুযায়ী বেশি।
- Level Complete → স্কোর, কয়েন, সেভ, পরের লেভেল খোলা। Level Failed → Retry / Revive (বর্তমান wave থেকে)।
- স্থায়ী আপগ্রেড (দোকান) যেমন আছে থাকবে।

## যা বদলাবে না
শত্রু/বস/প্লেয়ারের ছবি, ব্যাকগ্রাউন্ড, দোকান, লগইন, অ্যাড, সেভ, পারফরম্যান্স সেটিংস।

## Technical details
- সব কাজ `public/game/index.html` এর গেম লুপে; wave/level টেবিল ও বস HP আলাদা config অবজেক্টে।
- আইকন শিট (8×4 গ্রিড) কেটে `public/game/icons/skills/*.png` এ রাখা হবে।
- পারফরম্যান্স: বিদ্যমান FX tier / শত্রু সংখ্যা ক্যাপ মানা হবে।
