# ⚙️ BELAL BOTX666 MAX — GitHub Actions Setup Guide

## 🔐 GitHub Secrets যোগ করার পদ্ধতি

> **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | কী দেবে | কেন দরকার |
|-------------|---------|-----------|
| `APPSTATE` | `appstate.json` এর পুরো content | Facebook login |
| `KEYS_JSON` | `keys.json` এর পুরো content | GROQ + Gemini keys |
| `GROQ_KEY` | GROQ API key | AI command backup |
| `GEMINI_KEY` | Gemini API key | AI command backup |

### ✅ APPSTATE Secret:
```
appstate.json ফাইল খোলো → সব content copy → APPSTATE secret এ paste করো
```

### ✅ KEYS_JSON Secret (এই format এ দাও):
```json
{
  "GROQ_KEY":    "gsk_xxxxxxxxxx",
  "GROQ_KEY2":   "gsk_xxxxxxxxxx",
  "GROQ_KEY3":   "gsk_xxxxxxxxxx",
  "GROQ_KEY4":   "gsk_xxxxxxxxxx",
  "GEMINI_KEY":  "AIzaSyxxxxxxxxxx",
  "GEMINI_KEY2": "AIzaSyxxxxxxxxxx",
  "GEMINI_KEY3": "AIzaSyxxxxxxxxxx",
  "GEMINI_KEY4": "AIzaSyxxxxxxxxxx",
  "VOICERSS":    "xxxxxxxxxx"
}
```

## 🔄 Bot কীভাবে চলে

- **Manual:** Actions tab → Run workflow → Run
- **Auto:** প্রতি ৬ ঘন্টায় নিজেই restart হয়
- **Crash log:** প্রতিটা run-এ `logs/` folder artifact হিসেবে save হয়

## 📋 নতুন repo-তে copy করলে শুধু Secrets আবার যোগ করলেই হবে।

## ✅ কী কী API protection আছে

| সমস্যা | সমাধান |
|--------|--------|
| GitHub IP block | 8টি User-Agent rotation |
| Rate limit 429 | Auto retry 2s → 5s → 12s + jitter |
| API server down | Multi-source fallback (3টি source) |
| Key expire | GROQ/Gemini KEY1→KEY2→KEY3→KEY4 rotation |
| baseApiUrl fetch বারবার | 30 মিনিট cache |
| Port conflict | Auto next-port detection |
