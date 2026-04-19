import git
import os
import shutil
import tempfile
from .file_handler import process_directory

def scan_repository(repo_url: str) -> str:
    """Clones a remote repo temporarily and reads its content."""
    temp_dir = tempfile.mkdtemp()
    extracted_string = ""
    try:
        print(f"Cloning {repo_url} into {temp_dir}...")
        git.Repo.clone_from(repo_url, temp_dir, depth=1)
        
        # In a real heavy system we'd use GitPython to walk files or just filesystem
        extracted_string = process_directory(temp_dir)
        
    except Exception as e:
        print(f"Failed to scan repo {repo_url}: {e}")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
    
    return extracted_string
