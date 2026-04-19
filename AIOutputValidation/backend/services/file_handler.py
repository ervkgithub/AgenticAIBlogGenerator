import os
import pathlib

def extract_file_content(file_path: str) -> str:
    """Read the content of a single file safely."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"Skipping binary/unreadable file {file_path}: {e}")
        return ""

def process_directory(dir_path: str) -> str:
    """Concatenate code from a directory for AI understanding."""
    output = []
    # Simplified chunking/reading
    for root, _, files in os.walk(dir_path):
        for name in files:
            file_path = os.path.join(root, name)
            content = extract_file_content(file_path)
            if content:
                output.append(f"--- FILE: {name} ---\n{content}\n")
    return "\n".join(output)
