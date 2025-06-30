#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Simple task storage in user's home directory
const TASKS_FILE = path.join(os.homedir(), '.taskly-tasks.json');

// Load tasks from file
function loadTasks() {
  try {
    if (fs.existsSync(TASKS_FILE)) {
      return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('❌ Error loading tasks:', error.message);
  }
  return [];
}

// Save tasks to file
function saveTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('❌ Error saving tasks:', error.message);
  }
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format task for display
function formatTask(task, index) {
  const status = task.completed ? '✅' : '📋';
  const priority = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';
  return `${index + 1}. ${status} ${priority} ${task.title}`;
}

// Commands
const commands = {
  add: (args) => {
    if (args.length === 0) {
      console.error('❌ Usage: taskly add <task-title> [--priority=high|medium|low]');
      process.exit(1);
    }
    
    const title = args.filter(arg => !arg.startsWith('--')).join(' ');
    const priorityArg = args.find(arg => arg.startsWith('--priority='));
    const priority = priorityArg ? priorityArg.split('=')[1] : 'low';
    
    if (!['high', 'medium', 'low'].includes(priority)) {
      console.error('❌ Priority must be: high, medium, or low');
      process.exit(1);
    }
    
    const tasks = loadTasks();
    const newTask = {
      id: generateId(),
      title,
      priority,
      completed: false,
      created: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks(tasks);
    
    console.log('✅ Task added successfully!');
    console.log(`📋 "${title}" (${priority} priority)`);
  },

  list: (args) => {
    const tasks = loadTasks();
    
    if (tasks.length === 0) {
      console.log('📋 No tasks found. Add some with "taskly add <task>"');
      return;
    }
    
    const filter = args.includes('--completed') ? 'completed' : 
                   args.includes('--pending') ? 'pending' : 'all';
    
    let filteredTasks = tasks;
    if (filter === 'completed') {
      filteredTasks = tasks.filter(t => t.completed);
    } else if (filter === 'pending') {
      filteredTasks = tasks.filter(t => !t.completed);
    }
    
    console.log(`📋 Tasks (${filter}):`);
    console.log('');
    
    if (filteredTasks.length === 0) {
      console.log(`No ${filter} tasks found.`);
      return;
    }
    
    filteredTasks.forEach((task, index) => {
      console.log(formatTask(task, index));
    });
    
    console.log('');
    console.log(`Total: ${filteredTasks.length} task(s)`);
  },

  complete: (args) => {
    if (args.length === 0) {
      console.error('❌ Usage: taskly complete <task-number>');
      process.exit(1);
    }
    
    const taskNumber = parseInt(args[0]);
    const tasks = loadTasks();
    
    if (isNaN(taskNumber) || taskNumber < 1 || taskNumber > tasks.length) {
      console.error(`❌ Invalid task number. Use 1-${tasks.length}`);
      process.exit(1);
    }
    
    const task = tasks[taskNumber - 1];
    if (task.completed) {
      console.log('ℹ️  Task is already completed!');
      return;
    }
    
    task.completed = true;
    task.completedAt = new Date().toISOString();
    saveTasks(tasks);
    
    console.log('✅ Task completed!');
    console.log(`📋 "${task.title}"`);
  },

  remove: (args) => {
    if (args.length === 0) {
      console.error('❌ Usage: taskly remove <task-number>');
      process.exit(1);
    }
    
    const taskNumber = parseInt(args[0]);
    const tasks = loadTasks();
    
    if (isNaN(taskNumber) || taskNumber < 1 || taskNumber > tasks.length) {
      console.error(`❌ Invalid task number. Use 1-${tasks.length}`);
      process.exit(1);
    }
    
    const removedTask = tasks.splice(taskNumber - 1, 1)[0];
    saveTasks(tasks);
    
    console.log('🗑️  Task removed!');
    console.log(`📋 "${removedTask.title}"`);
  },

  init: (args) => {
    const projectName = args[0] || 'my-tasks';
    console.log('🚀 Initializing Taskly workspace...');
    console.log(`📁 Project: ${projectName}`);
    console.log('');
    
    // Simulate some setup
    setTimeout(() => {
      console.log('✅ Created task storage');
      console.log('✅ Set up configuration');
      console.log('✅ Ready to go!');
      console.log('');
      console.log('🎉 Taskly initialized successfully!');
      console.log('');
      console.log('Next steps:');
      console.log('  taskly add "Complete project setup"');
      console.log('  taskly list');
      console.log('  taskly complete 1');
    }, 1000);
  },

  help: () => {
    console.log('📋 Taskly - Simple Task Management');
    console.log('');
    console.log('Usage:');
    console.log('  taskly <command> [options]');
    console.log('');
    console.log('Commands:');
    console.log('  init [project-name]     Initialize new task workspace');
    console.log('  add <title> [--priority=high|medium|low]   Add new task');
    console.log('  list [--completed|--pending]              List tasks');
    console.log('  complete <number>       Mark task as completed');
    console.log('  remove <number>         Remove task');
    console.log('  help                    Show this help');
    console.log('');
    console.log('Examples:');
    console.log('  taskly init my-project');
    console.log('  taskly add "Buy groceries" --priority=high');
    console.log('  taskly list --pending');
    console.log('  taskly complete 1');
    console.log('');
    console.log('📚 Documentation: https://github.com/deepguide-ai/dg-demo');
  }
};

// Main CLI logic
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const commandArgs = args.slice(1);
  
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    commands.help();
    return;
  }
  
  if (command === '--version' || command === '-v') {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    console.log(`taskly v${pkg.version}`);
    return;
  }
  
  if (commands[command]) {
    commands[command](commandArgs);
  } else {
    console.error(`❌ Unknown command: ${command}`);
    console.log('Run "taskly help" for available commands.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 