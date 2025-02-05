#!/bin/bash
# extract_repo_info.sh
# ================================================
# Description:
#   This script extracts key repository details to provide context 
#   for AI tools like ChatGPT about the project I'm working on.
#   It collects information such as README, CHANGELOG, Git commit
#   history, directory structures, dependency files, and additional
#   highlighted files specified in a fileMap JSON file.
#
#   Use this script to quickly refresh context when interacting
#   with AI assistants, making it easier to maintain continuity.
#
# Usage:
#   ./extract_repo_info.sh [--mainDirectory <dir>] [--maxLength <number_of_lines>] [--fileMap <json_file>]
#
# Flags:
#   -m, --mainDirectory   Specify a main directory (e.g., src) to show its file structure.
#   -l, --maxLength       Limit the number of lines output from text files (e.g., README, CHANGELOG).
#   -f, --fileMap         Provide a JSON file mapping with structure:
#                         [
#                           {
#                             "path": "filePath",
#                             "description": "The description for the file"
#                           }
#                         ]
#
# Ensure the script has execute permissions: chmod +x extract_repo_info.sh
# ================================================

# -------------------------
# Parse command-line flags
# -------------------------
MAIN_DIRECTORY=""
MAX_LINES=0  # 0 means no limit
FILE_MAP_FILE=""

while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -m|--mainDirectory)
            MAIN_DIRECTORY="$2"
            shift # past flag
            shift # past value
            ;;
        -l|--maxLength)
            MAX_LINES="$2"
            shift
            shift
            ;;
        -f|--fileMap)
            FILE_MAP_FILE="$2"
            shift
            shift
            ;;
        *)
            # unknown option
            shift
            ;;
    esac
done

# -------------------------
# Set up IGNORED_DIRS for file structure display.
# Initially ignoring common directories.
IGNORED_DIRS=".git|node_modules|dist|build"

# Extend IGNORED_DIRS with entries from .gitignore, if present.
if [ -f ".gitignore" ]; then
    # Exclude comments and empty lines, then join patterns with '|'
    extra=$(grep -vE '^\s*(#|$)' .gitignore | tr '\n' '|' | sed 's/|$//')
    if [ -n "$extra" ]; then
         IGNORED_DIRS="$IGNORED_DIRS|$extra"
    fi
fi

# -------------------------
# Function: display_file
# Displays the file content (limited by MAX_LINES if set) with a header.
# -------------------------
display_file() {
    local file="$1"
    local header="$2"
    echo "===== $header: $file ====="
    if [ -f "$file" ]; then
        if [ "$MAX_LINES" -gt 0 ]; then
            head -n "$MAX_LINES" "$file"
            echo "... (limited to $MAX_LINES lines)"
        else
            cat "$file"
        fi
        echo -e "\n"
    else
        echo "$file not found"
        echo ""
    fi
}

# -------------------------
# 1. Display README file (check common names).
# -------------------------
if [ -f "README.md" ]; then
    display_file "README.md" "Project Overview (README.md)"
elif [ -f "README.txt" ]; then
    display_file "README.txt" "Project Overview (README.txt)"
elif [ -f "README" ]; then
    display_file "README" "Project Overview (README)"
else
    echo "No README file found."
fi

# -------------------------
# 2. Display CHANGELOG file.
# -------------------------
if [ -f "CHANGELOG.md" ]; then
    display_file "CHANGELOG.md" "Changelog (CHANGELOG.md)"
elif [ -f "CHANGELOG" ]; then
    display_file "CHANGELOG" "Changelog (CHANGELOG)"
else
    echo "No CHANGELOG file found."
fi

# -------------------------
# 3. Display Git commit history (latest 10 commits).
# -------------------------
echo "===== Git Commit History (Latest 10 commits) ====="
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    git log --oneline -n 10 || echo "Error retrieving git log."
else
    echo "Not a Git repository."
fi
echo ""

# -------------------------
# 4. Display Directory Structure for the main directory (if provided).
# -------------------------
if [ -n "$MAIN_DIRECTORY" ]; then
    echo "===== File Structure for Main Directory: $MAIN_DIRECTORY ====="
    if [ -d "$MAIN_DIRECTORY" ]; then
        if command -v tree >/dev/null 2>&1; then
            # Use tree with ignored directories (-I)
            tree -L 2 -I "$IGNORED_DIRS" "$MAIN_DIRECTORY" || echo "Error running tree command."
        else
            # Fallback: list directories and files using find, ignoring common directories.
            find "$MAIN_DIRECTORY" -maxdepth 2 \( -path "$MAIN_DIRECTORY/.git" -o -path "$MAIN_DIRECTORY/node_modules" -o -path "$MAIN_DIRECTORY/dist" -o -path "$MAIN_DIRECTORY/build" \) -prune -o -print | sort || echo "Error running find command."
        fi
    else
        echo "Directory '$MAIN_DIRECTORY' not found."
    fi
    echo ""
fi

# -------------------------
# 5. Display Directory Structure for the repository root.
# -------------------------
echo "===== Repository Root File Structure (Depth: 2) ====="
if command -v tree >/dev/null 2>&1; then
    tree -L 2 -I "$IGNORED_DIRS" . || echo "Error running tree command."
else
    # Fallback: list files and directories using find, ignoring specified directories.
    find . -maxdepth 2 \( -path "./.git" -o -path "./node_modules" -o -path "./dist" -o -path "./build" \) -prune -o -print | sort || echo "Error running find command."
fi
echo ""

# -------------------------
# 6. Display Dependency/Configuration Files.
# -------------------------
echo "===== Dependency/Configuration Files ====="
display_file "package.json" "Node.js Dependencies (package.json)"
display_file "requirements.txt" "Python Dependencies (requirements.txt)"

# -------------------------
# 7. Process File Map for Highlighted Files (if provided)
# -------------------------
if [ -n "$FILE_MAP_FILE" ]; then
    echo "===== Highlighted Files from File Map ====="
    if [ ! -f "$FILE_MAP_FILE" ]; then
        echo "File map '$FILE_MAP_FILE' not found."
    else
        # Check if jq is available for JSON parsing.
        if ! command -v jq &> /dev/null; then
            echo "Error: 'jq' is required to parse the file map. Please install jq."
        else
            # Read the JSON array and iterate over its objects.
            num_items=$(jq length "$FILE_MAP_FILE")
            for (( i=0; i<num_items; i++ )); do
                file_path=$(jq -r ".[$i].path" "$FILE_MAP_FILE")
                description=$(jq -r ".[$i].description" "$FILE_MAP_FILE")
                echo "----- $description: $file_path -----"
                if [ -f "$file_path" ]; then
                    if [ "$MAX_LINES" -gt 0 ]; then
                        head -n "$MAX_LINES" "$file_path"
                        echo "... (limited to $MAX_LINES lines)"
                    else
                        cat "$file_path"
                    fi
                else
                    echo "File '$file_path' not found."
                fi
                echo ""
            done
        fi
    fi
fi

echo "Repository extraction complete."