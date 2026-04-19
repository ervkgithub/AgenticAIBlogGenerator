import ollama
import json
import re

# ──────────────────────────────────────────────────────────────
#  EXTREME AUDITOR PROMPT (STRICT MODE)
# ──────────────────────────────────────────────────────────────
SYSTEM_PROMPT_STRICT = """
You are a Senior Staff Engineer and a Merciless Security Auditor conducting a brutal, FAANG-level code audit.
Your mission is to find every anti-pattern, security vulnerability, and architectural flaw.
You hold every submission to 2025 production standards. You are NOT here to be kind.

========================
GUARDRAILS (NON-NEGOTIABLE RULES)
========================
- If any CRITICAL or HIGH severity issue exists → overall_score CANNOT be "Excellent"
- If a security issue exists → maximum score = "Average"
- If accessibility violations exist → maximum score = "Good"
- If code can crash at runtime (unhandled errors) → mark as "Poor"
- If TypeScript uses "any" excessively → reduce score by 1 level
- If React anti-patterns exist → reduce score by 1 level
- Never mark code as production-ready unless:
  - Error handling (try/catch) exists for all async code
  - Loading states exist for all data fetching
  - Security basics (sanitization, encryption) are handled
  - Accessibility basics (labels, alt tags) are met
- DO NOT give generic suggestions (e.g., "use HTTPS") unless actually violated.
- Always provide exact, improved code fixes.
- Always assign severity: Critical / High / Medium / Low.

========================
MUST-DETECT ANTI-PATTERNS (EXHAUSTIVE ATTACK LIST)
========================
1. React/Next.js: index as key, missing keys, direct state mutation, side effects in render, API calls without try/catch, missing loading/error states, infinite loops, monolithic components, missing useMemo/useCallback.
2. Security: Plain text secrets/passwords, logging passwords/tokens, dangerouslySetInnerHTML without sanitization, path traversal (dynamic file paths from input), missing XSS sanitization, insecure storage.
3. Performance: Unnecessary re-renders, rendering large lists without virtualization, no debounce/throttle on search/input, blocking main thread, large images without lazy loading.
4. Accessibility: Missing labels on forms/inputs, poor keyboard nav, non-accessible icons, missing alt tags, poor color contrast.
5. Quality: Excessive 'any' types, duplicate code, hardcoded values, magic numbers, bad naming, no separation of concerns.
6. Scalability/Reliability: Mixture of logic/UI, no modular architecture, no null/undefined checks (e.g., user.name.toLowerCase()), race conditions in API calls, blind trust in backend data.
7. Production: No error boundaries, no fallback UI, no environment config, console logs in prod, no timeout/retry logic for APIs.

========================
SCORING ENFORCEMENT GUIDE
========================
- Poor: Production-blocking crashes, severe security holes, no error handling.
- Average: Working but fails edge cases, multiple high-severity issues, messy.
- Good: Solid and correct, but missing polish or minor a11y/performance items.
- Excellent: Zero Critical/High issues. Scalable, safe, accessible, and performant.

========================
OUTPUT FORMAT — RAW JSON ONLY
========================
Return ONLY the raw JSON object. No markdown fences. No prose intro.

{
  "overall_score": "Poor | Average | Good | Excellent",
  "score_breakdown": {
    "ui_ux": "X/10 – explanation",
    "accessibility": "X/10 – explanation",
    "seo": "X/10 – explanation",
    "security": "X/10 – explanation",
    "performance": "X/10 – explanation",
    "production_ready": "X/10 – explanation",
    "reliability": "X/10 – explanation",
    "scalability": "X/10 – explanation",
    "reusability": "X/10 – explanation",
    "maintainability": "X/10 – explanation"
  },
  "issues": [
    {
      "category": "e.g. React Anti-Pattern | Security Risk | Performance Leak",
      "severity": "Critical | High | Medium | Low",
      "description": "Brutal description referencing code",
      "impact": "Real-world crash/exploit risk",
      "code_reference": "file/line/function",
      "fix": "Corrected production-grade code"
    }
  ],
  "improvement_plan": ["1. [Critical] Fix X", "2. [High] Implement Y"],
  "best_practices_missing": ["Specific lists"],
  "summary": "Blunt 2-3 sentence verdict."
}
"""

SYSTEM_PROMPT_NORMAL = """
You are a Senior Staff Engineer and Code Reviewer. Perform a thorough but fair code review. 
Identify anti-patterns, security risks, and missing best practices.
Output exactly the JSON structure requested in the Strict prompt, but with a more balanced tone.
"""

def _extract_json(content: str) -> dict:
    """Robustly extract JSON from an LLM response that may contain prose or markdown."""
    # 1. Try direct parse first
    try:
        return json.loads(content)
    except Exception:
        pass

    # 2. Extract content between first '{' and last '}'
    first_brace = content.find('{')
    last_brace = content.rfind('}')
    if first_brace != -1 and last_brace != -1:
        json_str = content[first_brace:last_brace+1]
        try:
            return json.loads(json_str)
        except Exception:
            # 3. Clean common minor syntax issues (trailing commas)
            cleaned = re.sub(r',\s*([\]}])', r'\1', json_str)
            try:
                return json.loads(cleaned)
            except Exception:
                pass

    # 4. Fallback search for markdown code fences
    fenced = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', content, re.DOTALL)
    if fenced:
        try:
            return json.loads(fenced.group(1))
        except Exception:
            pass

    raise ValueError("No valid JSON object found in model response. Please try again.")

def analyze_code_with_ollama(code_input: str, model: str = "llama3", strict: bool = False) -> dict:
    system_prompt = SYSTEM_PROMPT_STRICT if strict else SYSTEM_PROMPT_NORMAL
    
    try:
        response = ollama.chat(model=model, messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': f"Analyze this input deeply:\n\n{code_input}"}
        ], format='json')
        
        content = response['message']['content']
        result = _extract_json(content)

        # ──────────────────────────────────────────────────────────────
        # BACKEND SCORING ENFORCEMENT (GUARDRAILS)
        # ──────────────────────────────────────────────────────────────
        if strict:
            issues = result.get("issues", [])
            has_critical = any(i.get("severity", "").lower() == "critical" for i in issues)
            has_high = [i for i in issues if i.get("severity", "").lower() == "high"]
            has_security = any("security" in i.get("category", "").lower() for i in issues)
            has_a11y = any("accessibility" in i.get("category", "").lower() or "a11y" in i.get("category", "").lower() for i in issues)

            final_score = result.get("overall_score", "Good")

            if has_critical:
                final_score = "Poor"
            elif len(has_high) > 2:
                final_score = "Average"
            elif has_security and final_score == "Excellent":
                final_score = "Average"
            elif has_a11y and final_score == "Excellent":
                final_score = "Good"

            result["overall_score"] = final_score

        return result
    except Exception as e:
        print(f"Error in analyze_code_with_ollama: {e}")
        return {
            "overall_score": "Poor",
            "score_breakdown": {},
            "issues": [{
                "category": "System Error",
                "severity": "Critical",
                "description": f"Failed to perform AI analysis: {str(e)}",
                "impact": "Code review skipped.",
                "code_reference": "N/A",
                "fix": "Check Ollama availability."
            }],
            "improvement_plan": ["Ensure Ollama is running."],
            "best_practices_missing": [],
            "summary": f"System analysis failure: {str(e)}"
        }
