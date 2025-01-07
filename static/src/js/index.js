import * as sgf from '@sabaki/sgf'
import * as GameTree from '@sabaki/immutable-gametree'
import * as tenuki from './tenuki.js'

const tempoSlider = document.getElementById("tempo_slider");
const sgfUrlInput = document.getElementById("sgf_url");
const playButton = document.getElementById("play_button");

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

const sgfNodeDataToXYCoordinates = (nodeData) => {
    const positions = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    let x, y = -1;
    if (nodeData.B) {
        y = positions.indexOf(nodeData.B[0][0]);
        x = positions.indexOf(nodeData.B[0][1]);
    } else if (nodeData.W) {
        y = positions.indexOf(nodeData.W[0][0]);
        x = positions.indexOf(nodeData.W[0][1]);
    }
    return [x, y]
}


const playSGF = (sgfUrl) => {

    downloadSGFFile(sgfUrl).then(parsedData => {
        let getId = (id => () => id++)(0)
        let gameTrees = parsedData.map(rootNode => {
            return new GameTree({getId, root: rootNode})
        })
        const rootTree = gameTrees[0]
    
        var boardElement = document.querySelector(".tenuki-board");
        boardElement.innerHTML = "";
        var game = new tenuki.Game({ 
            element: boardElement,
            boardSize: 19,
            _hooks: {
                hoverValue: function() {}, // need to define empty hoverValue hook to avoid JS error
            }  // disable user interaction
        });
    
        let list = [...rootTree.listNodes()]
        
        let currentNode = 0;
        const intervalTime = 50;
        let interval = undefined;
    
        // Every intervalTime milliseconds, play the next move
        // Time should be adjustable in real-time using a slider
    
        const tempoToMilliseconds = (tempo) => {
            // Return querter note length in milliseconds
            return 60000 / tempo / 4;
        }
    
        const playNextMove = () => {
            const node = list[currentNode];
            const [x, y] = sgfNodeDataToXYCoordinates(node.data);
            if (x > -1 && y > -1) {
                game.playAt(x, y)
            }
            currentNode++;
            if (currentNode >= list.length) {
                clearInterval(interval);
            } else {
                interval = setTimeout(playNextMove, tempoToMilliseconds(tempoSlider.value));
            }
        }
        interval = setTimeout(playNextMove, tempoToMilliseconds(tempoSlider.value));

    }).catch(error => {
        console.error("An error occurred:", error);
    });

}

playSGF(sgfUrlInput.value);

playButton.addEventListener("click", () => {
    playSGF(sgfUrlInput.value);
});
