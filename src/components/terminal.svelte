<script>
	// Import everything from the cli.js file
	import * as cli from '../logic/cli.js';

	export let terminalInput = '';
	$: terminalLines = terminalInput.split('\n');
	let selectedLine = -1; // This is the number of lines from the history
	let history = [];

	// Create ref to the textarea
	let textareaRef;

	function moveCursor(event) {
		// Check if the key pressed was not an arrow key
		const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace'];
		if (arrowKeys.includes(event.key) === false) {
			return;
		}

		// Prevent left/right/backspace keys from moving the cursor up or down
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Backspace') {
			const cursorPosition = textareaRef.selectionStart;

			// prevent the backspace key from moving the cursor to the left if the character before is a newline
			if (event.key === 'Backspace') {
				if (terminalInput[cursorPosition - 1] === '\n') {
					event.preventDefault();
				}
			}

			// prevent the cursor from moving to the left if the character before is a newline
			if (event.key === 'ArrowLeft') {
				if (terminalInput[cursorPosition - 1] === '\n') {
					event.preventDefault();
				}
			}

			// prevent the cursor from moving to the right if the character after is a newline
			if (event.key === 'ArrowRight') {
				if (terminalInput[cursorPosition] === '\n') {
					event.preventDefault();
				}
			}

			return;
		}

		// Prevent the default action of the up/down arrow keys
		event.preventDefault();

		// If the up arrow key was pressed increment selectedLine and set the last line of the textarea to the selected command from the history
		// If the down arrow key was pressed decrement selectedLine and set the last line of the textarea to the selected command from the history
		if (event.key === 'ArrowUp') {
			selectedLine = Math.min(history.length - 1, selectedLine + 1);
		} else if (event.key === 'ArrowDown') {
			selectedLine = Math.max(-1, selectedLine - 1);
			// Move cursor to the end of the textarea
			textareaRef.selectionStart = terminalInput.length;
		}

		// Set the value of the textAreas last line to the selected command from the history

		// If the selected line is -1, set the last line of the terminal to an empty string
		// Otherwise Set the last line of the textarea to the history line

		const previousLines = terminalInput.split('\n').slice(0, -1).join('\n');

		if (selectedLine < 0 || selectedLine > history.length - 1) {
			terminalInput = previousLines + '\n';
		} else {
			// Set the last line of the textarea to the negative selected command from the history
			terminalInput = previousLines + '\n' + history[selectedLine];
		}
	}

	function parseCommand(event) {
		// Check if the up or down arrow keys were pressed
		moveCursor(event);

		// Check if event is not the enter key
		if (event.key !== 'Enter') return;

		// Get command as the last line of the textarea
		const mostRecentLine = terminalInput.split('\n').pop() || '';

		// Save the command to the front of the history array
		history.unshift(mostRecentLine);

		// Get arguments as everything after the first word
		const command = mostRecentLine.split(' ')[0];
		const args = mostRecentLine.split(' ').slice(1);

		if (!command) return;

		console.log(command);
		console.log(args);

		// Check if the command is valid
		if (!cli.commands.includes(command)) {
			console.log('Command not found; type "help" for a list of commands.');
			return;
		}

		if (command === 'clear') {
			terminalInput = '';
			return;
		}

		// Run the command
		const response = cli.runCommand(command, args);
		// Add the response to the terminal
		terminalInput += '\n' + JSON.stringify(response);

		return;
	}
</script>

<div class="terminal">
	<!-- Make text area, bind the value to terminalInput call parseCommand on keydown-->
	<textarea
		bind:value={terminalInput}
		on:keydown={(e) => parseCommand(e)}
		autocomplete="off"
		bind:this={textareaRef}
	></textarea>
</div>

<style>
	.terminal {
		background-color: var(--background);
		color: var(--foreground);
		border: 2px solid var(--border);
		width: 100%;
		min-width: 100px;
		min-height: 400px;
	}

	.terminal textarea {
		width: 100%;
		height: 100%;
		background-color: var(--background);
		color: var(--text);
		border: none;
	}
</style>
