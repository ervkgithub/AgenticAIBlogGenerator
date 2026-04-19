from playwright.sync_api import sync_playwright

def scan_live_url(url: str) -> str:
    """Uses Playwright to extract DOM info for architectural UI/UX analysis."""
    extracted_data = f"--- TARGET URL: {url} ---\n"
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Navigate and wait for network to be idle
            page.goto(url, wait_until="networkidle")
            
            # Extract basic text info and meta tags
            title = page.title()
            meta_tags = page.evaluate("() => Array.from(document.querySelectorAll('meta')).map(m => m.outerHTML)")
            body_text = page.locator("body").innerText()
            
            extracted_data += f"Title: {title}\n"
            extracted_data += f"Meta Tags:\n{chr(10).join(meta_tags)}\n\n"
            extracted_data += f"Body Preview (first 2000 chars):\n{body_text[:2000]}\n"
            
            browser.close()
    except Exception as e:
        extracted_data += f"\nError scanning URL: {str(e)}"
        
    return extracted_data
