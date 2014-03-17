wzrdschool
==========

A webgl based sidescroller rpg/puzzle/action/platformer game with a fantasy theme where spells are code and the world is your API.


##Humble beginnings

The current state of the game is mostly that I'm teaching myself how to write a game using the low level primitives of WebGL without using a game engine or anything. Long term this may change if there are significant advantages. I think the game is unique enough to warrant its own engine, potentially, and given that it is 2D, it's a lot simpler.

## To get it running

Right now you actually have to use grunt to build and run. (although its pretty easy)

1. Install node
2. Clone the repo
3. Open the project directory
4. run `grunt devserver` -- this starts a mini-server to run the app
5. open the browser to localhost:8889

If you want to be able to edit the app and see the changes, run `grunt watch`, and the typescript will recompile automatically on save.
