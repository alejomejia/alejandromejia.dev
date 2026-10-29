# Production Audit Playbook

How to verify the live site. Use `curl` via Bash for exact status codes,
headers and raw HTML (what non-JS crawlers see). Use WebFetch only for
rendered/summarized reads. Keep request volume polite: sample, don't crawl
thousands of URLs, and add a small delay in loops.

Set once:

```bash
SITE="https://alejandromejia.dev"   # canonical production origin (confirm it), no trailing slash
UA_GOOGLE="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
```

## 1. Host, protocol, redirects

```bash
# Every variant must reach the canonical in ONE 301/308 hop.
for u in "http://example.com" "http://www.example.com" "https://www.example.com" "https://example.com"; do
  echo "== $u"; curl -sI -o /dev/null -w "%{http_code} -> %{redirect_url}\n" "$u/"
done
curl -sIL "$SITE/some-page/" | grep -iE "^(HTTP|location)"     # trailing-slash variant
curl -s -o /dev/null -w "%{http_code}\n" "$SITE/this-page-should-not-exist-$(date +%s)"   # must be 404
```

## 2. robots.txt, sitemap, llms files, IndexNow

```bash
curl -s -D - "$SITE/robots.txt"
curl -s "$SITE/sitemap.xml" | head -50
curl -s "$SITE/sitemap.xml" | grep -o "<loc>[^<]*</loc>" | sed 's/<[^>]*>//g' > /tmp/seo-urls.txt; wc -l /tmp/seo-urls.txt
curl -s -D - "$SITE/llms.txt" | head -60
curl -s "$SITE/llms-full.txt" | head -80
curl -s -o /dev/null -w "%{http_code}\n" "$SITE/indexnow-key.txt"
curl -s -o /dev/null -w "%{http_code}\n" "$SITE/manifest.webmanifest"
```

Check the sitemap for off-origin URLs (e.g. `localhost`, staging host, `http://`),
which means `NEXT_PUBLIC_SERVER_URL` was wrong at build time (P0).

## 3. Per-URL checks (sample up to ~100 sitemap URLs)

```bash
while read -r url; do
  code=$(curl -s -o /tmp/seo-page.html -w "%{http_code}" -A "$UA_GOOGLE" "$url")
  xrobots=$(curl -sI "$url" | grep -i "^x-robots-tag" | tr -d '\r')
  title=$(grep -o "<title>[^<]*</title>" /tmp/seo-page.html | head -1)
  canonical=$(grep -oE '<link[^>]+rel="canonical"[^>]*>' /tmp/seo-page.html | grep -oE 'href="[^"]+"')
  robots=$(grep -oE '<meta[^>]+name="robots"[^>]*>' /tmp/seo-page.html | grep -oE 'content="[^"]+"')
  h1=$(grep -o "<h1" /tmp/seo-page.html | wc -l | tr -d ' ')
  echo "$code | h1=$h1 | $robots | $xrobots | $canonical | $title | $url"
  sleep 0.3
done < <(head -100 /tmp/seo-urls.txt)
```

Flag: non-200, `noindex`, canonical ≠ URL, h1 count ≠ 1, duplicate titles
(`sort | uniq -d` on the title column), missing descriptions.

Deep-dive a representative page of each type (Home, CV, the Work list, a case
study and a chapter, the Writing list, an article, a Craft piece):

```bash
curl -s -A "$UA_GOOGLE" "$SITE/" > /tmp/home.html
grep -oE '<meta[^>]+(name|property)="(description|og:[^"]+|twitter:[^"]+|robots|theme-color|viewport)"[^>]*>' /tmp/home.html
grep -oE '<link[^>]+rel="(canonical|icon|apple-touch-icon|manifest|alternate)"[^>]*>' /tmp/home.html
grep -oE '<html[^>]*>' /tmp/home.html                                  # lang attribute
grep -oE '<(h[1-6])[^>]*>.*?</\1>' /tmp/home.html | sed 's/<[^>]*>//g' | head -40   # outline (approximate)
grep -cE '<main[ >]' /tmp/home.html                                   # must be 1
grep -oE '<img[^>]*>' /tmp/home.html | grep -v 'alt=' | head          # images without alt
```

Extract and validate JSON-LD:

```bash
python3 - <<'EOF'
import re, json
html = open('/tmp/home.html').read()
for block in re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', html, re.S):
    data = json.loads(block)
    nodes = data.get('@graph', [data])
    for n in nodes: print(n.get('@type'), '|', n.get('@id', ''), '|', sorted(n.keys()))
EOF
```

Then ask the user to run Google's Rich Results Test and validator.schema.org
on key URLs. There's no public API. List which URLs to test.

## 4. Raw HTML vs rendered: is content visible without JS?

AI crawlers (GPTBot, ClaudeBot, PerplexityBot…) generally don't execute JS.
Compare visible text from `curl` with what a user sees (WebFetch or the
user's browser). Key copy, prices, FAQs, contact info and internal links must
be in the curl output:

```bash
python3 - <<'EOF'
import re, html as h
raw = open('/tmp/home.html').read()
raw = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', raw, flags=re.S)
text = re.sub(r'\s+', ' ', h.unescape(re.sub(r'<[^>]+>', ' ', raw))).strip()
print(len(text.split()), 'words in raw HTML'); print(text[:1500])
EOF
```

## 5. AI bots and WAF/CDN blocking (critical for GEO)

robots.txt can allow a bot while Cloudflare (or another WAF) still blocks it.
Test with real user agents. A 403, 503, "Just a moment…" or a challenge page
means blocked:

```bash
for ua in "GPTBot/1.1" "OAI-SearchBot/1.0" "ChatGPT-User/1.0" "ClaudeBot/1.0" "Claude-User/1.0" \
          "Claude-SearchBot/1.0" "PerplexityBot/1.0" "Perplexity-User/1.0" "Google-Extended" \
          "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" "$UA_GOOGLE"; do
  r=$(curl -s -o /tmp/ua.html -w "%{http_code}" -A "Mozilla/5.0 (compatible; $ua)" "$SITE/")
  echo "$r $(grep -c -iE 'just a moment|cf-challenge|captcha|access denied' /tmp/ua.html) $ua"
done
```

Caveat: some WAFs verify bots by IP, so a spoofed UA can be blocked while the
real bot is allowed, or the reverse. Report a block as "likely". Then ask the
user to check Cloudflare → Security → Bots / AI Crawl Control ("Block AI bots",
"AI Labyrinth", managed robots.txt) or the equivalent on their host.

Also check whether the CDN rewrites robots.txt (Cloudflare "managed robots.txt"
can prepend rules). Compare the served robots.txt with the code in `src/app/robots.ts`.

## 6. Performance: PageSpeed Insights API (no key needed for light use)

```bash
for strategy in mobile desktop; do
  curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=$SITE/&strategy=$strategy&category=performance&category=seo&category=accessibility&category=best-practices" > /tmp/psi-$strategy.json
  python3 - "$strategy" <<'EOF'
import json, sys
s = sys.argv[1]; d = json.load(open(f'/tmp/psi-{s}.json'))
if 'error' in d: print(s, 'PSI error:', d['error'].get('message')); sys.exit()
cats = d['lighthouseResult']['categories']
print(s, {k: round(v['score']*100) for k, v in cats.items()})
field = d.get('loadingExperience', {}).get('metrics', {})
for k in ['LARGEST_CONTENTFUL_PAINT_MS','INTERACTION_TO_NEXT_PAINT','CUMULATIVE_LAYOUT_SHIFT_SCORE']:
    if k in field: print('  field', k, field[k]['percentile'], field[k]['category'])
audits = d['lighthouseResult']['audits']
for a in audits.values():
    if a.get('score') is not None and a['score'] < 0.9 and a.get('details', {}).get('type') == 'opportunity':
        print('  opp:', a['title'], a.get('displayValue', ''))
EOF
done
```

Run it on home, one content page and one post at least. If rate-limited, say
so and ask the user for a PSI API key or a Lighthouse report.

## 7. Headers, security, caching

```bash
curl -sI "$SITE/" | grep -iE "^(strict-transport|content-security|x-content-type|referrer-policy|permissions-policy|x-frame|cache-control|content-encoding|server|x-robots-tag)"
curl -sI --http2 "$SITE/" | head -1
# a hashed static asset and a media file should have long-lived caching
```

## 8. Links and images

Collect internal links from sampled pages and check their status (HEAD, then
GET on 405). Report 4xx/5xx and redirecting internal links (links should point
to final URLs). Check that OG images and media URLs return 200 with image
content types.

## 9. Things only the user can provide

Ask for these, and say exactly what you'd do with them. Don't block the audit on them:
- Google Search Console: coverage/indexing report, Core Web Vitals report, top queries (impressions, CTR, position) export.
- Bing Webmaster Tools: same, plus IndexNow status.
- The profile URLs (LinkedIn, GitHub, others) and their current headlines and bios, to check entity consistency.
- Permission status for each client or employer name the site might show.
- CDN/WAF bot settings screenshots.
- Analytics: AI referral traffic, top landing pages, conversions.
- Extra target roles, markets or companies beyond hiring-playbook.md.

## 10. Competitive & SERP / AI-answer check (WebSearch)

For the name queries and 3–5 target queries from hiring-playbook.md (e.g.
"design engineer Spain", "UX engineer design systems", "senior frontend
developer React remote Europe"):
- WebSearch the query. Note who ranks, the content formats that win (lists,
  job boards, directories, LinkedIn profiles), and whether the site or its
  profiles appear.
- Note which sources AI answers would plausibly cite: profiles, directories,
  community lists, other portfolios. Recommend concrete content or off-site actions to
  earn inclusion.
