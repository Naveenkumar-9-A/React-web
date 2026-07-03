# Quick Start - OpenAI Enrichment Setup

## ⚡ 3-Step Setup

### Step 1: Install OpenAI Package
```bash
cd aorboweb
pip install openai
```

### Step 2: Add API Key to .env
Edit `aorboweb/.env`:
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

**Get API key from**: https://platform.openai.com/account/api-keys

### Step 3: Test It
```bash
py manage.py shell
from treks_app.ai_enrichment import enrich_destination_with_ai
result = enrich_destination_with_ai("Talakona Falls")
print(result)
```

## 🎯 Test Search

### Search Database Trek
```
Type: "Coorg"
Result: Existing trek card (from database)
```

### Search OpenStreetMap with Enrichment
```
Type: "Talakona Falls"
Result: Destination card with AI enrichment:
- AI Summary
- Activities
- Travel Tips
- Difficulty
- Best Season
- And more...
```

## 📊 What You Get

For destinations NOT in database, OpenAI generates:
- ✅ Smart summary (2-3 sentences)
- ✅ Activities (5+ recommended)
- ✅ Travel tips (4+ practical tips)
- ✅ Difficulty level (Easy/Moderate/Difficult)
- ✅ Best time to visit (seasonal)
- ✅ Altitude information
- ✅ Distance from major city
- ✅ Accommodation options
- ✅ Local cuisine suggestions

## 💾 Caching

- **Duration**: 7 days per destination
- **First request**: 2-4 seconds (API call)
- **Cached requests**: <100ms
- **Cost**: <1¢ per destination
- **Monthly**: ~$0.50-$1.00 with caching

## ❌ If API Fails

System automatically falls back to rule-based enrichment:
- Detects destination type (falls, mountains, beaches, etc.)
- Assigns appropriate activities
- Provides sensible defaults
- **No errors shown to users**

## 🧪 Verification

### Check API Connection
```bash
py manage.py shell
>>> from treks_app.ai_enrichment import get_openai_client
>>> client = get_openai_client()
>>> print("Connected:", client is not None)
```

### Check Caching
```bash
# After first search for "Talakona Falls"
py manage.py shell
>>> from django.core.cache import cache
>>> cache.get("destination_enrichment_talakona_falls")
# Should return enrichment data if cached
```

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not found" | Add `OPENAI_API_KEY` to `.env` and restart Django |
| Timeout errors | Increase `max_tokens` or check API status |
| Generic fallback data | Check OpenAI API status or credits |
| Cache not working | Run `cache.clear()` or restart Django |

## 📱 Test on Frontend

### Search Bar Example
```
1. Click search input
2. Type: "Talakona Falls"
3. Wait for results
4. See destination card with:
   - Map marker
   - Detailed info
   - Travel tips
   - Activities
   - Best season
   - View on Map button
```

## 🚀 Production Deployment

```bash
# 1. Install package
pip install openai

# 2. Set environment variable
export OPENAI_API_KEY="sk-proj-..."

# 3. Test connection
py manage.py shell
from treks_app.ai_enrichment import get_openai_client
print(get_openai_client())

# 4. Monitor usage
# Go to: https://platform.openai.com/account/usage
```

## ✅ Verification Checklist

- [ ] OpenAI package installed
- [ ] API key added to `.env`
- [ ] Django restarted
- [ ] Search "Coorg" → Trek card shows
- [ ] Search "Talakona Falls" → Destination card shows
- [ ] Travel tips displayed
- [ ] Caching working
- [ ] Fallback works (disable API key test)
- [ ] No console errors
- [ ] Mobile responsive

## 📞 Support

- **Setup Guide**: `OPENAI_ENRICHMENT_GUIDE.md`
- **Full Docs**: `IMPLEMENTATION_SUMMARY.md`
- **Deliverables**: `DELIVERABLES.md`

---

**Status**: Ready to Deploy ✨
**Setup Time**: 5 minutes
**Cost**: <$1/month

