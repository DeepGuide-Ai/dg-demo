# DeepGuide CLI (dg) with Taskly Demo

> This is an example project that shows how to use **DeepGuide CLI (dg)** to create self-testing documentation for a project.

## 🎯 Overview

**Taskly** is a simple task management CLI tool that demonstrates typical CLI patterns:
- Interactive commands (`init`, `add`, `list`, `complete`, `remove`)
- Command-line arguments and flags (`--priority=high`)

Use `dg` to create:
- ✅ **Self-testing documentation** with SVG 
- 🎬 **Interactive terminal recordings** (asciinema)
- 📝 **Copy-pasteable code** that actually work
- 🔄 **CI/CD** - demos break when CLI changes

## 🚀 Quick Start

### 1. **Setup & Doctor Check**

```bash
# Check system dependencies
dg doctor

# Expected output: ✅ All systems ready
```

### 2. **Initialize DG Project** 

```bash
# Project is already initialized with:
ls .dg/
# → casts/     (terminal recordings)
# → config.json (DG configuration)
```

### 3. **Test the Demo CLI**

```bash
# Test Taskly CLI functionality
npm test                    # Shows help
npm run demo               # Runs init demo
./cli.js --help           # Direct CLI usage
```

## 📹 Recording Demos

### Interactive Recording

```bash
# Start interactive recording session
dg capture

# You'll be prompted for:
# - Demo title (e.g., "Quickstart Guide")
# - Commands to record
```

### Example Recording Session

**Demo: "Getting Started with Taskly"**

Commands to record:
```bash
# Start recording with `dg capture`

# 1. Show help
./cli.js help

# 2. Initialize a workspace  
./cli.js init my-project

# 3. Add some tasks
./cli.js add "Buy groceries" --priority=high
./cli.js add "Write documentation" --priority=medium
./cli.js add "Deploy to production" --priority=low

# 4. List all tasks
./cli.js list

# 5. Complete a task
./cli.js complete 1

# 6. Show completed tasks
./cli.js list --completed

# 7. Show pending tasks
./cli.js list --pending

# Press Ctrl+D to end recording
```

## 📋 List & Manage Demos

```bash
# Show all demos
dg list

# Expected output:
No.  Name             SVG    Validation  Title                     Updated
----------------------------------------------------------------
1    getting-started  ❌     Auto       Complete Taskly workflow  2024-03-20
```

## ✅ Validation & Testing

### Manual Validation

```bash
# Validate all demos work
dg validate

# Expected output:
# ✅ getting-started: All commands executed successfully
# 📊 1/1 demos passed
```

### CI Integration

GitHub action is automatically added to `.github/workflows/test.yml`:

```yaml
name: Test Documentation
on: [push, pull_request]

jobs:
  validate-demos:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      
      # Install DG CLI
      - run: npm install -g @DeepGuide-Ai/dg
      
      # Install system dependencies
      - run: |
          sudo apt-get update
          sudo apt-get install -y asciinema
      
      # Validate demos
      - run: dg validate
```

### Benefits Over Traditional Docs

| Traditional | With DeepGuide |
|------------|----------------|
| 🚫 Static code blocks | ✅ Interactive recordings |
| 🚫 Screenshots go stale | ✅ Live recordings |
| 🚫 Copy-paste errors | ✅ Tested commands |
| 🚫 Manual maintenance | ✅ CI validation |

## 🐛 Troubleshooting

### Common Issues

**🔧 "asciinema not found"**
```bash
# macOS
brew install asciinema

# Ubuntu/Debian  
sudo apt install asciinema
```

**🔧 "Invalid terminal dimensions"**
```bash
# Resize terminal to standard size
resize -s 24 80

# Or ignore warning (doesn't affect output)
```
