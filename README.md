# Simon...ish
- This program mimics the behavior of the old (extremely!) Simon electronic game
## Game Overview
By pushing the start button as shown below, the game issues a sequence of sounded lights and then waits for you to repeat the sequence.  

![Start Game](./src/Simon%20Game%20Start.png) 

Once you successfully repeat the sequence, it adds an additional item to the sequence.  As the sequence becomes longer, the speed of the sequence increases.  This goes on until either you incorrectly playback the sequence or 2 seconds elapse without a button being pushed.  The failure screen looks as shown below.

![Game Fail](./src/Simon%20Failure.png)

### Configuring the buttons

The game buttons can be configured by clicking as shown below.  Note that the button is active only between games.

![Config Buttons](./src/Simon%20Configure.png)

Once the "Configure Game Buttons" is clicked, the following forms appear.  Your choices are:
- The waveform of the sound generated.
- The color of the button.
- The frequency of the sound (70 - 10000 hz)

![Config Forms](./src/Simon%20Config%20Forms.png)

### Running the Game
This program is invoked by running index.html.  This game uses a simulated API.  Prior to running index.html, you must run the server simulation program.  To successfully execute the program, you must invoke the json server as shown below:

![JSON Server](./src/json%20server.png)

After the server simulator is running, you can successfully run index.html and play the game.  Good luck!

