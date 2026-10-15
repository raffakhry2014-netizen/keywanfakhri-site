"""Send all sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver …) after each deploy."""
import json, re, urllib.request
HOST = "keywanfakhri.com"
KEY = "00fb47ea89f4b72e4bccae9a6c2c2695"
xml = urllib.request.urlopen(f"https://{HOST}/sitemap.xml", timeout=30).read().decode()
urls = sorted(set(re.findall(r"<loc>([^<]+)</loc>", xml)))
body = json.dumps({"host": HOST, "key": KEY, "keyLocation": f"https://{HOST}/{KEY}.txt", "urlList": urls}).encode()
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body, headers={"Content-Type": "application/json; charset=utf-8"})
with urllib.request.urlopen(req, timeout=30) as r:
    print("IndexNow", r.status, "-", len(urls), "URLs")
