# 🚀 O-SOUL E-Commerce - Vercel Deployment Guide

Aapka Frontend (Vite/React) aur Backend (Node/Express) dono Vercel par deploy hone ke liye tayar hain. Dono folders (`client` aur `server`) me pehle se hi `vercel.json` configured hai.

Hum is project ko **dono projects alag-alag deploy** karenge (ek Frontend ke liye aur ek Backend ke liye). Yeh Vercel par monorepo deploy karne ka sabse reliable aur clean tarika hai.

---

## 🛠️ Step 1: GitHub par Code Push Karein
Sabse pehle aapka sara code GitHub repository par push hona chahiye.
1. GitHub par ek new repository banayein (agar pehle se nahi bani hai).
2. Apne terminal me commands run karein:
   ```bash
   git add .
   git commit -m "Configure deployment and Vercel settings"
   git push origin main
   ```

---

## 🖥️ Step 2: Backend (Server) ko Deploy Karein
Pehle hum API/Server deploy karenge taaki hume backend ka URL mil sake, jise hum frontend me use karenge.

1. **Vercel Dashboard** ([vercel.com](https://vercel.com/)) par jayein aur **Add New > Project** par click karein.
2. Apni GitHub repository ko import karein.
3. **Configure Project** screen par niche diye gaye settings set karein:
   - **Project Name**: `osou-backend` (ya jo aap chahein)
   - **Framework Preset**: `Other` (Vercel automatic detect kar lega)
   - **Root Directory**: `server` (Edit button par click karke `server` folder select karein aur continue karein)
4. **Environment Variables** section ko expand karein aur `.env` se saari keys copy karke add karein:
   - `MONGO_URL` = `mongodb+srv://osoulbottoms_db_user:mj0wJ3FfVTOhWOXC@cluster0.fpdzugb.mongodb.net/`
   - `JWT_SECRET` = `o_soul`
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = `admin123`
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USER` = `osoulbottoms@gmail.com`
   - `SMTP_PASS` = `ufjb uxbe oolc vzlw`
   - `MAIL_FROM` = `O'Soul <osoulbottoms@gmail.com>`
   - `PRIVATE_KEY` = `6ehBQWP1yLvONGDilgx4`
   - `PUBLIC_KEY` = `gG0HupOZhPBS1N89yfV6`
   - `COLUDNARY_CLOUD_NAME` = `j9onzkmj`
   - `COLUDNARY_API_KEY` = `138964635684728`
   - `COLUDNARY_API_SECRET` = `tR45zrV6oTj-9k6breDEdlos-cE`
   - `RAZORPAY_KEY_ID` = `rzp_live_RjYQCA2GbsCFaU`
   - `RAZORPAY_KEY_SECRET` = `rM3FBhnE8E00YbEm4s6RDfhG`
   - `CLIENT_URL` = *(Yeh aapke deployed Frontend ka URL hoga, isse aap deployment ke baad update kar sakte hain. Abhi ke liye temporary blank chhod sakte hain ya bad me update kar sakte hain)*
5. **Deploy** button par click karein.
6. Deployment complete hone ke baad, aapko backend ka ek URL milega (jaise: `https://osou-backend.vercel.app`).
   > 📝 Note: Aapka real API path `https://osou-backend.vercel.app/api` hoga.

---

## 🎨 Step 3: Frontend (Client) ko Deploy Karein
Ab hum frontend React app ko deploy karenge.

1. Vercel Dashboard par wapas jayein aur firse **Add New > Project** par click karein.
2. Usi same GitHub repository ko select/import karein.
3. **Configure Project** screen par niche diye gaye settings set karein:
   - **Project Name**: `osou` (ya aapka branding name)
   - **Framework Preset**: `Vite` (Vercel auto-detect kar lega)
   - **Root Directory**: `client` (Edit button par click karke `client` folder select karein)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables** add karein:
   - `VITE_API_URL` = `https://<YOUR-BACKEND-SUBDOMAIN>.vercel.app/api` (Jo backend deploy hone par URL mila tha, use `/api` ke sath yaha daalein. Jaise: `https://osou-backend.vercel.app/api`)
   - `VITE_RAZORPAY_KEY_ID` = `rzp_live_RjYQCA2GbsCFaU`
5. **Deploy** button par click karein.
6. Frontend successfully deploy ho jayega aur aapko iska domain mil jayega (jaise: `https://osou-frontend.vercel.app`).

---

## 🔄 Step 4: CORS / CLIENT_URL Sync (Final Step)
CORS errors ko rokne ke liye, hume backend ko batana hoga ki frontend ka exact domain kya hai.

1. Apne Vercel Dashboard me **Backend Project (`osou-backend`)** par jayein.
2. **Settings > Environment Variables** me jayein.
3. Yaha `CLIENT_URL` ki value ko update karke apne deployed Frontend ka URL daal dein (e.g., `https://osou-frontend.vercel.app`).
4. **Save** karein.
5. Project ko **Redeploy** karein (Deployments tab me jakar latest deploy par click karke Redeploy karein) ya backend project ko dobara push/trigger karein taaki updated env variables load ho jayein.

---

## ✅ Deployment verification Checklist
- [ ] Kya homepage load ho raha hai?
- [ ] Kya products database se fetch ho kar aa rahe hain? (Network panel check karein backend requests ke liye)
- [ ] Kya login aur signup correctly work kar rahe hain?
- [ ] Razorpay payment gateway integration properly test ho raha hai?