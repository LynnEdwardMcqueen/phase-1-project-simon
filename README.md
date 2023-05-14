# Simon...ish
- This program mimics the behavior of the old (extremely!) Simon electronic game

## Installation
Go to https://github.com/LynnEdwardMcqueen/phase-1-project-simon.  Fork the project and clone to your local machine.  This program uses a simulated JSON server for its API.  To start the server, you must go to the source directory and run the json-server simulation program as shown below. 

![JSON Server](./src/json%20server.png)

Once the json-server is running, you can run the index.html file and begin execution of the program.  

## Usage
By pushing the start button as shown below, the game issues a sequence of sounded lights and then waits for you to repeat the sequence.  

![Start Game](./src/Simon%20Game%20Start.png) 

Once you successfully repeat the sequence, it adds an additional item to the sequence.  As the sequence becomes longer, the speed increases.  This goes on until either you incorrectly playback the sequence or 2 seconds elapse without a button being pushed.  The failure screen looks as shown below.

![Game Fail](./src/Simon%20Failure.png)

### Configuring the buttons

The game buttons can be configured by clicking as shown below.  Note that the button is active only between games.

![Config Buttons](./src/Simon%20Configure.png)

Once the "Configure Game Buttons" is clicked, the following forms appear.  Your choices are:
- The waveform of the sound generated.
- The color of the button.
- The frequency of the sound (70 - 10000 hz)

Once the desired configurations for an individual game button have been made, the "Button x Update" submit must be clicked for the changes to take effect (x = 1 - 6).

![Config Forms](./src/Simon%20Config%20Forms.png)

## Technical Help
I would like to send a huge shout out to Kirupa Chinnathambi.  His youtube video and source code helped me integrate sound into this web application. This can be found at [Sound Tutorial](https://www.youtube.com/watch?v=PYGGmE9Z7eo)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)


