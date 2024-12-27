import * as sgf from '@sabaki/sgf'
import * as GameTree from '@sabaki/immutable-gametree'
import * as tenuki from './tenuki.js'

async function downloadSGFFile(url) {
    try {
        // Fetch the file contents from the URL
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch the file: ${response.status} ${response.statusText}`);
        }

        // Get the file contents as text
        const fileContents = await response.text();

        // Pass the file contents to your SGF parser module
        // Replace `parseSGF` with your actual module's parse function
        const parsedData = sgf.parse(fileContents);

        // Return or process the parsed data as needed
        return parsedData;
    } catch (error) {
        console.error("Error downloading or parsing the SGF file:", error);
        throw error;
    }
}

// Example usage:
// Replace 'yourPublicURL' with the URL of the SGF file
const yourPublicURL = "./public/2016.03.10-Lee_Sedol-AlphaGo.sgf";

downloadSGFFile(yourPublicURL).then(parsedData => {
    let getId = (id => () => id++)(0)
    let gameTrees = parsedData.map(rootNode => {
        return new GameTree({getId, root: rootNode})
    })
    const rootTree = gameTrees[0]

    var boardElement = document.querySelector(".tenuki-board");
    var game = new tenuki.Game({ 
        element: boardElement,
        boardSize: 19,
        _hooks: {}  // disable user interaction
    });

    let list = [...rootTree.listNodes()]
    
    list.forEach(node => {
        const positions = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        let x, y = -1;
        if (node.data.B) {
            x = positions.indexOf(node.data.B[0][0]);
            y = positions.indexOf(node.data.B[0][1]);
            
        } else if (node.data.W) {
            
            x = positions.indexOf(node.data.W[0][0]);
            y = positions.indexOf(node.data.W[0][1]);

        }
        if (x > -1 && y > -1) {
            game.playAt(x, y)
        }
    })


}).catch(error => {
    console.error("An error occurred:", error);
});
