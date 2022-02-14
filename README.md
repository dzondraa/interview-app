# Interview management software solution
- Client application based on React and JavaScript
- Resource service based on C# ASP.NET
- Live interview service based on Node.js and Sockets.io (Web sockets mostly) 

## System design map
![image](https://user-images.githubusercontent.com/52199590/153779723-1efc7ac0-9c96-4136-9e57-c299617cd462.png)


<img src="https://miro.medium.com/max/812/0*xAADmPJN52Yy6XJV.jpg" height="40"> <img src="https://image.pngaaa.com/930/2507930-middle.png" height="40">

## Auth
- Google 0Auth 2.0 
- Own JWT token service

<img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-logos-vector-eps-cdr-svg-download-10.png" height="30"> <img src="https://jwt.io/img/logo-asset.svg" height="30">

## Storage
- File system
- MongoDB
<img src="https://www.cloudsavvyit.com/p/uploads/2021/07/f5932bc2.jpg?width=1198&trim=1,1&bg-color=000&pad=1,1" height="50">

## Applicaiton health (Sentry)
- Load metrics
- Performance metrics
- Unhandled excaptions 
- Traces
<img src="https://vectorlogoseek.com/wp-content/uploads/2020/02/sentry-io-vector-logo.png" height="50">

## Hoe to run
- Please use `devinit.sh` script to start all the services
- Client application
- Live interview service (Node.js & Socket.io)
- Resource service (ASP.NET API including Business logic)
- RabbitMQ node (Message broker)
<img src="https://raw.githubusercontent.com/aKumoSolutions/Bash-Scripting/master/img/bash.jpg" height="30">
