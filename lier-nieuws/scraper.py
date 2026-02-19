import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import logging
import time
import re
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "nl-BE,nl;q=0.9,en;q=0.8",
}

REQUEST_TIMEOUT = 15


def scrape_source(source):
    """Scrape a single source and return raw page data."""
    url = source["url"]
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        resp.encoding = resp.apparent_encoding or "utf-8"
        return {
            "source": source,
            "html": resp.text,
            "status": "ok",
        }
    except requests.RequestException as e:
        logger.warning(f"Failed to scrape {url}: {e}")
        return {
            "source": source,
            "html": None,
            "status": f"error: {e}",
        }


def extract_page_content(scrape_result):
    """Extract meaningful text content and links from a scraped page."""
    if scrape_result["status"] != "ok" or not scrape_result["html"]:
        return None

    source = scrape_result["source"]
    base_url = source["url"]
    html = scrape_result["html"]

    soup = BeautifulSoup(html, "lxml")

    # Remove script, style, nav, footer elements
    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()

    # Try to find article-like sections
    articles = []

    # Strategy 1: Look for <article> tags
    article_tags = soup.find_all("article")
    if article_tags:
        for art in article_tags[:30]:
            article_data = _extract_article_data(art, base_url)
            if article_data:
                articles.append(article_data)

    # Strategy 2: Look for common news listing patterns
    if not articles:
        for selector in [
            ".news-item", ".post", ".item", ".card", ".article",
            ".teaser", ".overview-item", ".list-item", ".entry",
            "[class*='news']", "[class*='article']", "[class*='bericht']",
        ]:
            items = soup.select(selector)
            if items:
                for item in items[:30]:
                    article_data = _extract_article_data(item, base_url)
                    if article_data:
                        articles.append(article_data)
                break

    # Strategy 3: If still nothing, extract all meaningful text blocks with links
    if not articles:
        main_content = soup.find("main") or soup.find(id="content") or soup.find(class_="content") or soup.body
        if main_content:
            text = main_content.get_text(separator="\n", strip=True)
            # Truncate to avoid huge payloads
            text = text[:5000]
            links = []
            for a in (main_content.find_all("a", href=True) or [])[:30]:
                href = urljoin(base_url, a["href"])
                link_text = a.get_text(strip=True)
                if link_text and len(link_text) > 5:
                    links.append({"url": href, "text": link_text})

            articles.append({
                "title": "",
                "text": text,
                "url": base_url,
                "date": "",
                "links": links,
            })

    return {
        "source": source,
        "articles": articles,
    }


def _extract_article_data(element, base_url):
    """Extract article data from an HTML element."""
    # Find title
    title = ""
    title_el = element.find(["h1", "h2", "h3", "h4", "a"])
    if title_el:
        title = title_el.get_text(strip=True)

    # Find link
    url = base_url
    link_el = element.find("a", href=True)
    if link_el:
        url = urljoin(base_url, link_el["href"])

    # Find date
    date = ""
    date_el = element.find(["time", "[class*='date']", "[class*='datum']"])
    if date_el:
        date = date_el.get("datetime", "") or date_el.get_text(strip=True)
    if not date:
        # Try to find date patterns in text
        text_content = element.get_text()
        date_patterns = [
            r"\d{1,2}[/-]\d{1,2}[/-]\d{2,4}",
            r"\d{1,2}\s+(?:jan|feb|maa|apr|mei|jun|jul|aug|sep|okt|nov|dec)\w*\s+\d{4}",
        ]
        for pattern in date_patterns:
            match = re.search(pattern, text_content, re.IGNORECASE)
            if match:
                date = match.group()
                break

    # Get full text
    text = element.get_text(separator="\n", strip=True)

    if not title and not text:
        return None

    # Truncate text
    text = text[:2000]

    return {
        "title": title,
        "text": text,
        "url": url,
        "date": date,
    }


def scrape_all_sources(sources, progress_callback=None):
    """Scrape all sources and return extracted content."""
    all_content = []
    total = len(sources)

    for i, source in enumerate(sources):
        if progress_callback:
            progress_callback(i + 1, total, source["description"])

        result = scrape_source(source)
        content = extract_page_content(result)
        if content and content["articles"]:
            all_content.append(content)

        # Be polite with rate limiting
        time.sleep(0.5)

    return all_content
