import os
import pathlib

# Blacklist of directories and files to skip during scanning
BLACKLIST_DIRS = {
    'node_modules', '.git', '.next', '__pycache__', 'venv', 
    'env', 'dist', 'build', '.vscode', '.github', 'target'
}
BLACKLIST_FILES = {
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 
    '.gitignore', '.env', '.DS_Store', 'favicon.ico'
}
# Priority extensions for code analysis
PRIORITY_EXTENSIONS = {
    '.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.c', '.cpp', '.php'
}

MAX_TOTAL_CHARS = 30000  # Token safety limit for Llama3 context

def extract_file_content(file_path: str) -> str:
    """Read the content of a single file safely, checking for binaries."""
    try:
        # Basic check to avoid reading very large files or binaries
        if os.path.getsize(file_path) > 500000: # 500kb limit per file
            return "[FILE TOO LARGE TO SCAN]"
            
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return "" # Skip binaries or unreadable files

def process_directory(dir_path: str, limit_chars: int = MAX_TOTAL_CHARS) -> str:
    """Concatenate priority source files from a directory with token budgeting."""
    output = []
    current_chars = 0
    
    for root, dirs, files in os.walk(dir_path):
        # Prune blacklisted directories in-place
        dirs[:] = [d for d in dirs if d not in BLACKLIST_DIRS]
        
        for name in files:
            if name in BLACKLIST_FILES:
                continue
                
            file_path = os.path.join(root, name)
            extension = pathlib.Path(name).suffix.lower()
            
            # Focus on source code files
            if extension in PRIORITY_EXTENSIONS:
                content = extract_file_content(file_path)
                if content:
                    file_header = f"--- FILE: {os.path.relpath(file_path, dir_path)} ---\n"
                    combined = file_header + content + "\n\n"
                    
                    # Budgeting check
                    if current_chars + len(combined) > limit_chars:
                        output.append(f"--- [TRUNCATED DUE TO CONTEXT LIMIT] ---")
                        return "\n".join(output)
                    
                    output.append(combined)
                    current_chars += len(combined)
                    
    return "\n".join(output)
