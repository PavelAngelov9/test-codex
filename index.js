#!/usr/bin/env node

/**
 * Test Codex - Main Entry Point
 * 
 * This is the main entry point for the Test Codex project.
 * Add your application logic here.
 */

console.log('🚀 Test Codex is running!');
console.log('📝 Edit this file to add your application logic.');

// Example function
function greet(name = 'World') {
  return `Hello, ${name}!`;
}

// Example usage
console.log(greet());
console.log(greet('Test Codex'));

// Export for potential use in other modules
module.exports = {
  greet
};
