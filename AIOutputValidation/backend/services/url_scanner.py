from playwright.sync_api import sync_playwright

def scan_live_url(url: str) -> str:
    """Uses Playwright to extract a 'Structural Blueprint' for audit analysis."""
    blueprint = f"--- AUDIT TARGET URL: {url} ---\n"
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Navigate with 30s timeout
            page.goto(url, wait_until="networkidle", timeout=30000)
            
            # --- EXTRACT STRUCTURAL BLUEPRINT ---
            # 1. Meta & SEO
            title = page.title()
            meta = page.evaluate("() => Array.from(document.querySelectorAll('meta[name], meta[property]')).map(m => m.outerHTML).join('\\n')")
            
            # 2. Semantic Landmark Check
            landmarks = page.evaluate("""() => {
                const tags = ['header', 'main', 'footer', 'nav', 'section', 'article', 'aside', 'h1', 'h2', 'h3'];
                return tags.map(t => `${t.toUpperCase()} count: ${document.querySelectorAll(t).length}`).join(', ');
            }""")
            
            # 3. Accessibility Criticals (Images without alt, Buttons without text)
            a11y_issues = page.evaluate("""() => {
                const imgNoAlt = document.querySelectorAll('img:not([alt])').length;
                const btnNoText = Array.from(document.querySelectorAll('button')).filter(b => !b.innerText.trim() && !b.getAttribute('aria-label')).length;
                const inputNoLabel = Array.from(document.querySelectorAll('input:not([type="hidden"])')).filter(i => {
                    const id = i.getAttribute('id');
                    return !id || !document.querySelector(`label[for="${id}"]`);
                }).length;
                return `Images without Alt: ${imgNoAlt}, Icon-Buttons without labels: ${btnNoText}, Inputs without <label>: ${inputNoLabel}`;
            }""")

            # 4. Content Sample
            body_text = page.locator("body").innerText()
            
            blueprint += f"Page Title: {title}\n"
            blueprint += f"Meta Data:\n{meta}\n\n"
            blueprint += f"Semantic Structure: {landmarks}\n"
            blueprint += f"Accessibility Snapshot: {a11y_issues}\n\n"
            blueprint += f"Content Preview (sample of first 1500 chars):\n{body_text[:1500]}\n"
            
            browser.close()
    except Exception as e:
        blueprint += f"\n[SCAN ERROR]: {str(e)}"
        
    return blueprint
