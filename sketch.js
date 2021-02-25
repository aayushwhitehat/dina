var PLAY = 1;
var END = 0;
var gameState = PLAY;

var dino, dinof,dinotouch,dinoti;
var ground, invisibleGround, groundImage,background,backgroundi;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  dinof = loadAnimation("dino 1.png","dino 2.png","dino 3.png","dino 4.png","dino 5.png","dino 6.png");
  
  groundImage = loadImage("ground2.png");
  
  dinoti=loadAnimation("dino 7.png");
  
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  
  
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  backgroundi=loadImage("background.jpg");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  background = createSprite(0,0,windowWidth,windowHeight);
  background.addImage(backgroundi);
  background.scale=3
  
  var message = "This is a message";
 console.log(message)
  
  dino = createSprite(50,height-150,20,50);
  dino.addAnimation("flying", dinof);
  dino.addAnimation("touch", dinoti);
  

  dino.scale = 0.5;
  
  ground = createSprite(200,400,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround =                               createSprite(200,400,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  

  
  dino.setCollider("rectangle",10,0,450,190);
  dino.debug = false;

  score = 0;
  
}

function draw() {
  
 
  
 background.velocityX = -3 
   if (background.x < 0){
      background.x = background.width/2;
    }  

  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score +                                 Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& dino.y >= 100) {
        dino.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    dino.velocityY = dino.velocityY + 0.8
  
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(dino)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      ground.velocityX = 0;
      dino.velocityY = 0
      dino.changeAnimation("touch",dinoti);
     background.velocityX=0;
     
      
    obstaclesGroup.setLifetimeEach(-1);
    
     
     obstaclesGroup.setVelocityXEach(0);
        
   }
  
 
  //stop trex from falling down
  dino.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
  fill("white") 
  text("Score: "+ score, 500,50);

  var survivalTime=Math.ceil(frameCount/frameRate());
  text("Survival Time: "+ survivalTime,350,50)
}


function reset(){
  gameState=PLAY;
   
  gameOver.visible=false;
  restart.visible=false;

  obstaclesGroup.destroyEach();
  
  
  dino.changeAnimation("flying",dinof);
  
  score=0;
  
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,385,10,40);
   obstacle.velocityX = -(6 + score/100);
   
   obstacle1.scale=0.02;
   obstacle2.scale=0.01;
   obstacle3.scale=0.02;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
              
        
      case 2: obstacle.addImage(obstacle2);
              break;
              
              
      case 3: obstacle.addImage(obstacle3);
              break;
              
        
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }


                                 
}

