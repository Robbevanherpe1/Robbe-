#! /bin/bash
#
# git-helper.sh - a script to help with common git tasks and best practices.
#
# author: Robbe Van Herpe <Robbe.vanherpe@student.hogent.be>

#------------------------------------------------------------------------------
# Shell settings
#------------------------------------------------------------------------------

# -e: Exits the script immediately if any command returns a non-zero status.
# -u: Treats unset variables as an error and exits immediately.
# -o pipefail: Ensures the script exits with an error if any command in a pipeline fails.

#testing :  shellcheck --severity=error git-helper.sh, bash -n git-helper.sh

set -euo pipefail

#------------------------------------------------------------------------------
# Variables
#------------------------------------------------------------------------------
LOG_DATE_FORMAT="%Y/%m/%d"

#------------------------------------------------------------------------------
# Main function
#------------------------------------------------------------------------------

main() {
  case "${1:-}" in
    help) usage exit 0 ;;
    check) check_niveau "${2:-.}" ;;
    log) show_history "${2:-}" ;;
    stats) stats "${2:-}" ;;
    undo) undo_last_commit ;;
    sync) sync ;;
    *) usage ;;
  esac
}

#------------------------------------------------------------------------------
# Helper functions
#------------------------------------------------------------------------------

# Usage: is_git_repo DIR
#  Predicate that checks if the specified DIR contains a Git repository.
#  This function does not produce output, but only returns the appropriate
#  exit code.
is_git_repo() {
  git -C "$1" rev-parse --is-inside-work-tree > /dev/null 2>&1
}

# Controleerd of check command argumenten heeft
check_niveau(){
    if [ -z "$1" ]; then
        check_basic_settings
    else
        check_repo "$1"
    fi
}

# Usage: check_basic_settings
#  Check if the basic git settings are configured
check_basic_settings() {
  for setting in user.name user.email push.default; do
    if ! git config --global "$setting" > /dev/null; then
      echo "Git $setting not set. Set it using 'git config --global $setting <value>'" >&2
    fi
  done
}


check_basic_settings() {
  for setting in user.name user.email push.default; do
    if ! git config --global "$setting" > /dev/null; then
      echo "Git $setting not set. Set it using 'git config --global $setting <value>'" >&2
    fi
  done
}

# Usage: check_repo DIR
#  Perform some checks on the specified DIR that should contain a Git
#  repository.
check_repo() {
  local dir="$1"
  if ! is_git_repo "$dir"; then
    echo "Directory $dir is not a Git repository." >&2
    exit 1
  fi

  # Check for required files
  for file in README.md .gitignore .gitattributes; do
    if [[ ! -f "$dir/$file" ]]; then
      echo "Missing $file in $dir." >&2
    fi
  done

  # Check for remotes
  if ! git -C "$dir" remote > /dev/null 2>&1; then
    echo "No remotes configured for repository in $dir." >&2
  fi

  # Check for non-executable shell scripts
  find "$dir" -name '*.sh' -not -perm -u+x | while read -r script; do
    echo "Script $script is not executable. Grant execute permission to file owner [y/N]?"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
      chmod +x "$script"
      git -C "$dir" add "$script"
      git -C "$dir" commit -m "Make scripts executable"
      echo "Committed changes for $script."
    fi
  done

  # Check for unsupported file types
  find "$dir" \( -name '*.docx' -o -name '*.xls' -o -name '*.iso' -o -name '*.elf' \) | while read -r file; do
    echo "Found unsupported file type: '$file'" >&2
  done
}

# Usage: show_history [DIR]
#  Show git log in the specified DIR or in the current directory if none was
#  specified.
show_history() {
  local dir="${1:-.}"
  git -C "$dir" log --pretty=format:"%s | %an | %ad" --date=format:"$LOG_DATE_FORMAT"
}

# Usage: stats [DIR]
#  Show the number of commits and the number of contributors in the specified
#  DIR or in the current directory if none was specified.
stats() {
  local dir="${1:-.}"
  local commits=$(git -C "$dir" rev-list --count HEAD)
  local contributors=$(git -C "$dir" shortlog -sn | wc -l)
  echo "$commits commits by $contributors contributors"
}

# Usage: undo_last_commit
#  Undo the last commit but keep local changes in the working directory.
undo_last_commit() {
  local last_commit_msg=$(git log -1 --pretty=%B)
  git reset --soft HEAD~1
  echo "Undo of last commit \"$last_commit_msg\" successful."
}

# Usage: sync
#  Sync the currently checked out branch in the local repository with the
#  remote repository by performing:
#
#  - git stash if there are local changes
#  - git pull --rebase
#  - git push
#  - git push all labels (tags)
#  - git stash pop if there were local changes
sync() {
  local stash_needed=0
  if ! git diff --quiet || ! git diff --cached --quiet; then
    stash_needed=1
    git stash
    echo "Local changes stashed."
  fi

  git pull --rebase || {
    echo "Merge conflicts detected. Resolve them first."
    git status
    exit 1
  }

  git push
  git push --tags

  if [[ $stash_needed -eq 1 ]]; then
    git stash pop
    echo "Local changes unstashed."
  fi
}

# Usage: usage
#   Print usage message
usage() {
  cat <<EOF
Usage: ./git-helper.sh COMMAND [ARGUMENTS]...

Commands:
  help      Display this help message.
  check     Verify Git settings or repository structure.
  check DIR check basic git user configuration and check DIR for deviations of standard git practices
  log       display a brief overview of the git log of the PWD
  stats     display some brief stats about the PWD repository
  undo      undo last commit from git working tree while preserving local changes.
  sync      sync local branch with remote
EOF
  exit 0
}

main "$@"



#lists all branches in the repository

#list) list_branches "${2:-.}" ;;

#list_branches() {
#  local dir="${1:-.}"
#  if ! is_git_repo "$dir"; then
#    echo "Directory $dir is not a Git repository." >&2
#    exit 1
#  fi
#  git -C "$dir" branch -a
#}


# stats show error when empty repo

#stats() {
#  local dir="${1:-.}"
#  if ! git -C "$dir" log --oneline > /dev/null 2>&1; then
#    echo "Repository is empty." >&2
#    exit 1
#  fi
#  local commits=$(git -C "$dir" rev-list --count HEAD)
#  local contributors=$(git -C "$dir" shortlog -sn | wc -l)
#  echo "$commits commits by $contributors contributors"
#}

# if command short needed

#main() {
#  case "${1:-}" in
#    h | he | help) usage exit 0 ;;
#    c| ch | check) check_niveau "${2:-.}" ;;
#    l| lo | log) show_history "${2:-}" ;;
#    st | stats) stats "${2:-}" ;;
#    u | un | undo) undo_last_commit ;;
#    sy| sync) sync ;;
#    s) echo "do u mean sync or status give full command" >&2
#    *) usage ;;
#  esac
#}