You have only one input box to interact with the sketch book. Your commands will be inserted as a new line on the sketchbox. Updating or removing lines from the text editor is possible with modifier commands.

### Modifier commands

`/save`  
Shows save dialog of the sketch and updates the snapshot.

`/fork`  
Clones the current sketch and prompts for new title and description.

`/help`  
Toggles help dialog.

`/LINE_NO SOME_CODE`  
Updates a line with new command.

`+LINE_NO SOME_CODE`  
Inserts the command as a new line above the specified line number.

`-LINE_NO`  
Removes the line.

### Stochastic modelling

Probabilistic helper functions. Currently bases the Math.random function.

`rollDice() // alias: dice`  
Rolls a dice and returns the value.

`flipCoin(times = 1) // alias: coin`  
Flip N coins and returns true if all coins are tail, or vice versa

`random(min = 0, max = 1)`  
Returns a random value between specified min and max values.

### Self-modification functions

These functions modifies the program run-time.

`removeLine(lineNo)`  
Removes the line.

`searchAndReplace(find, replace)`  
Finds a value and replaces with new one.

`toggleComment(lineNo)`  
Makes comment-out or uncomment a line.

`changeLine(lineNo, newLine)`  
Updates the specificed line with new one.

`duplicateLine(lineNo)`  
Duplicates the specified line to below.

`getLine(lineNo)`  
Returns the specified line as a string.

### State manipulators

These functions allows you to read/write a state out of the animation loop.

`get(key)`  
Returns a value from store.

`set(key, value)`  
Stores a value with a key.

`setup(key, value)`  
Sets the key once &mdash; in first animation frame.

### Drawing and animation loop

Most of the drawing functions are same with HTML5 Canvas API.

`moveTo(x, y)`  
`lineTo(x, y)`  
`rect(x, y, width, height)`  
`circle(x, y, radius)`  
`rotate(angle)`  
`translate(x, y)`  
`pushMatrix() // Saves current transform matrix.`  
`popMatrix() // Restores the latest transform matrix.`  
`clear() // Clears all the canvas.`  
`stroke(style) // Sets stroke style.`  
`fill(style) //  Sets fill style.` 

Injected locals to the scope:

`tick // current animation frame.`  
`canvas // the html element instance of canvas`  
`context // 2d context from the canvas`  
