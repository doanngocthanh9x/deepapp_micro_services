import os
import sys
from pathlib import Path

def print_tree(directory, prefix="", max_depth=None, current_depth=0, ignore_dirs=None, ignore_paths=None):
    """
    Print directory tree structure.
    
    Args:
        directory: Root directory path
        prefix: Prefix for formatting tree lines
        max_depth: Maximum depth to traverse (None for unlimited)
        current_depth: Current recursion depth
        ignore_dirs: Set of directory names to ignore
        ignore_paths: List of full paths to ignore
    """
    if ignore_dirs is None:
        ignore_dirs = {'.git', '__pycache__', '.venv', 'venv', 'node_modules', '.env', '.DS_Store','data'}
    
    if ignore_paths is None:
        ignore_paths = []
    
    if max_depth and current_depth >= max_depth:
        return
    
    try:
        entries = sorted(os.listdir(directory))
    except PermissionError:
        return
    
    # Filter ignored directories
    entries = [e for e in entries if e not in ignore_dirs]
    
    for i, entry in enumerate(entries):
        path = os.path.join(directory, entry)
        
        # Skip if path is in ignore list
        if any(os.path.samefile(path, ignore_path) if os.path.exists(ignore_path) else path == ignore_path for ignore_path in ignore_paths):
            continue
        
        is_last = i == len(entries) - 1
        current_prefix = "└── " if is_last else "├── "
        print(f"{prefix}{current_prefix}{entry}")
        
        if os.path.isdir(path):
            next_prefix = prefix + ("    " if is_last else "│   ")
            print_tree(path, next_prefix, max_depth, current_depth + 1, ignore_dirs, ignore_paths)

if __name__ == "__main__":
    root_dir = os.getcwd()
    
    # Danh sách đường dẫn bỏ qua
    ignore_paths = [
        os.path.join(root_dir, "build"),
        os.path.join(root_dir, "dist"),
        os.path.join(root_dir, ".pytest_cache"),
    ]
    
    print(f"📁 {root_dir}\n")
    print_tree(root_dir, max_depth=5, ignore_paths=ignore_paths)
    
    with open("directory_tree.md", "w") as f:
        sys.stdout = f
        print(f"📁 {root_dir}\n")
        print_tree(root_dir, max_depth=5, ignore_paths=ignore_paths)
        sys.stdout = sys.__stdout__
    print("Directory tree saved to directory_tree.md")
