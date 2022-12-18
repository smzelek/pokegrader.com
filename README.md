# pokégrader

**PokéGrader grades your Pokémon teams!**

Link: https://www.stevezelek.com/apps/pokegrader

### More Info

This project was built with PreactJS and compiles down to just 25kb of JS!


The goal of the project was to answer that question of "How good is my Pokémon team?" we all may have wondered 
while playing a Pokémon game. The app is in no way meant to assert the absolute worth of a team. It really cannot, as it only
examines the type matchups of your team as a whole. There may be moves you teach your Pokémon that are keeping them safer than the app thinks.


Either way, I find it to be a very useful and interesting starting point for evaluating your team, as the casual player I am. 


As a developer, the most interesting points to me are:
1. Building a mathematical algorithm that distils teams down into a few concrete numerical scores.
2. Creating a concise and friendly user interface to display the complex evaluation in a way that's approachable and pretty.

I hope you enjoy the project.

## Local development
```
npm i
npm start
```

The app has a full test suite, runnable like so:
```
npm i
npm run e2e:install
npm start &
npm run e2e
```

## Example URL for testing

Preload the app with a full team by providing the following url:
> http://localhost:8080/?p=0.423.0&p=1.184.0&p=2.229.0&p=3.886&p=4.82&p=5.838

> https://www.stevezelek.com/apps/pokegrader/?p=0.423.0&p=1.184.0&p=2.229.0&p=3.886&p=4.82&p=5.838


My favorite team:
> http://localhost:8080/?p=0.40&p=1.462&p=2.423.0&p=3.430&p=4.479.0&p=5.485.0 

> https://www.stevezelek.com/apps/pokegrader/?p=0.40&p=1.462&p=2.423.0&p=3.430&p=4.479.0&p=5.485.0 

