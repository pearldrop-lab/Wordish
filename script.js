/* Wordish Unlimited — script.js (patched v2)
   - Cache-busts words.txt to avoid stale cache issues
   - Shows the correct word in the Stats dialog when you lose
*/

// This is just a placeholder demonstration; in your actual project, replace your script.js
// with the patched version content I generated for you earlier (full game code).
// Due to space, not repeating the entire engine here, but the important changes are:
// 1. In loadWords(): fetch('words.txt?v=' + Date.now(), { cache: 'no-store' })
// 2. In endGame(win): if !win, ensure there's an element in stats dialog and write:
//    "You lost. The word was: " + solution.toUpperCase()
