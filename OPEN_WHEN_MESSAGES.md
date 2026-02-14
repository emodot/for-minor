# Open When – Messages for Special Moments

Use this as a reference when adding rows to the **open_when** table in Supabase (Table Editor → **open_when** → Insert row).

**Columns:** `title` (card label), `content` (message body), `unlock_date` (YYYY-MM-DD — the card unlocks on or after this date).

---

## Message ideas + sample content

Copy or adapt the content below. Set **unlock_date** to when you want the card to unlock (e.g. Valentine’s Day, anniversary, or a fixed date like today so it’s already open).

---

### Open when you miss me

**Unlock date idea:** Any date (e.g. today), or leave for “whenever you need it.”

**Content:**

Hi. If you’re reading this, you’re missing me — and I want you to know I’m missing you too.

Wherever I am, I’m thinking about you. Your laugh, the way you say my name, the way you make ordinary moments feel like the best part of the day. So don’t feel like you’re missing me alone. We’re in it together, and we’ll be in the same place again soon.

Until then, save this message and come back to it whenever you need a little proof that you’re loved.

I love you.

---

### Open when you need a hug

**Unlock date idea:** Any date.

**Content:**

Consider this a long-distance hug.

I can’t be there to wrap my arms around you right now, but I want you to feel held. You matter. You’re allowed to have hard days, and you’re allowed to need comfort. I’m always in your corner.

Whenever you’re ready, we’ll hug for real. Until then, I’m sending you the biggest one I can from here.

---

### Open when you’re stressed

**Unlock date idea:** Any date.

**Content:**

Pause for a second. Breathe.

You’re doing enough. You don’t have to fix everything today. It’s okay to rest, to say no, or to just be instead of do.

I’m proud of you — not for how much you get done, but for who you are. So be kind to yourself the way you’d be kind to someone you love. Because you are loved.

I’m here. We’ll figure it out together.

---

### Open when it’s our anniversary

**Unlock date idea:** Your anniversary (e.g. 2025-02-14 or whatever date you two use).

**Content:**

Happy anniversary.

Every day with you feels like something to celebrate, but today especially I want you to know: choosing you is one of the best decisions I’ve ever made. I’m grateful for every laugh, every quiet moment, and every “see you soon.”

Here’s to us — and to all the anniversaries we’ll get to share.

I love you.

---

### Open when it’s Valentine’s Day

**Unlock date idea:** 2025-02-14 (or the next Valentine’s Day).

**Content:**

Happy Valentine’s Day.

You’re my favorite person to celebrate. Not just today — every day. So today is just an excuse to say it again: you’re loved, you’re chosen, and you make my life better.

Thank you for being you. Thank you for being mine.

---

### Open when you need a reason to smile

**Unlock date idea:** Any date.

**Content:**

Reasons you make *me* smile:

You get excited about small things. You remember what matters to me. You’re the person I want to tell first when something good happens. You’re kind even when you’re tired. You’re the one I want to build a life with.

So if you needed a reason to smile today: you’re someone’s reason. You’re mine.

---

### Open when you can’t sleep

**Unlock date idea:** Any date.

**Content:**

It’s late. Your mind is busy. I get it.

You’re safe. You’re loved. You don’t have to solve everything tonight. Try to let your body rest even if your thoughts are still running — one breath at a time.

I’m thinking of you. Tomorrow will be a little easier. And I’ll be here when you wake up.

Goodnight. Sleep well.

---

### Open when you’re proud of yourself

**Unlock date idea:** Any date.

**Content:**

You did something that made you proud — and I want you to know I’m proud of you too.

You work hard. You care. You show up. So when you feel that little spark of “I did it,” hold on to it. You deserve to feel good about yourself.

Celebrate today. I’m celebrating you.

---

### Open when you need to hear “I love you”

**Unlock date idea:** Any date.

**Content:**

I love you.

Not because of what you do or how you look or what you achieve. I love you for who you are. For your heart, your mind, the way you see the world, and the way you make mine brighter.

So whenever you need to hear it: I love you. I’m not going anywhere.

---

## How to add in Supabase

1. Go to **Table Editor** → **open_when**.
2. Click **Insert row**.
3. Fill in:
   - **title** — Short label (e.g. “Open when you miss me”). This is what shows on the card.
   - **content** — The full message (paste or type the text above, or your own).
   - **unlock_date** — Date in **YYYY-MM-DD** (e.g. `2025-02-14`). The card becomes clickable on or after this date.
4. Save.

Use one row per message. You can add as many as you like and change the order later in the app (they’re ordered by `unlock_date`).
