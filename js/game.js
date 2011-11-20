function getTimer ( milisec, callback) {
	var c=0;
	var t;
	var timerIsOn=0;
	var callback = callback;
	
	timedCount = function(){
		callback();
		t=setTimeout("timedCount()",milisec);
	};
	
	return {
		start : function(){
			if (!timerIsOn){
				timer_is_on=1;
				timedCount();
			}
		},
		stop : function(){
			clearTimeout(t);
			timerIsOn=0;	
		}
	};
}

$(document).ready(function (){
	 var WIDTH = 800,
        HEIGHT = 600,
        GAMEPLANWIDTH = 400,
        GAMEPLANX = 200,
        GAMEPLANHEIGHT = 600,
        GAMEPLANY = 0,
        MAXPLATFORMDISTANCE = 200;
    Crafty.init(WIDTH, HEIGHT);

	Crafty.load( ["img/beny.png", "img/wall.png", "img/wall_left.png", "img/wall_right.png", "img/spike.png"], function(){
		Crafty.sprite(50, "img/beny.png", { beny: [0, 0]});
		Crafty.sprite(50, "img/wall.png", { wall: [0, 0]});
		Crafty.sprite(50, "img/wall_left.png", {wallLeft: [0,0]});
		Crafty.sprite(50, "img/wall_right.png", {wallRight: [0,0]});
		Crafty.sprite(50, "img/spike.png", {spike: [0,0]});
		Crafty.sprite(50, "img/platform.png", {platform: [0,0,1,0.5]});
		Crafty.sprite(50, "img/platformleft.png", {platformLeft: [0,0,1,0.5]});
		Crafty.sprite(50, "img/platformdouble.png", {platformDouble: [0,0,2,0.5]});
		Crafty.sprite(50, "img/platformtripple.png", {platformTripple: [0,0,3,0.5]});
		
		Crafty.scene("main");
	});
	
	Crafty.scene("main", function() {
		Crafty.background("#000");
		var nothing = 0,
		 	wall = 1,
		 	wallLeft = 2,
		 	wallRight = 3,
		 	spike = 4,
		 	i = 0,
		 	j =0,
		 	pSingleWidth = 50,
		 	pDoubleWidth = 100,
		 	pTrippleWidth = 150,
		 	platformSpeed = 1,
		 	bgObject,
		 	player;
		
		var counter = 0;
		var score = Crafty.e("2D, DOM, Text")
			.text("Score: 0")
			.attr({x: Crafty.viewport.width - 100, y: 100, w: 200, h:50})
			.css({color: "#FFF"});
			
		var timer = getTimer(1000, function(){
			counter += 1;
			score.text("Score: " + counter);
			if ( counter % 15 == 0 ){
				platformSpeed += 1;
			}	
		});
		
		timer.start()
		
		var gameBoard = [
			[ wall, wall, wall, wallLeft, spike, spike, spike, spike, spike, spike, spike, spike, wallRight, wall, wall, wall],
			[ wall, wall, wall, wallLeft, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, wallRight, wall, wall, wall],
			[ wall, wall, wall, wallLeft, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, wallRight, wall, wall, wall],
			[ wall, wall, wall, wallLeft, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, wallRight, wall, wall, wall],
			[ wall, wall, wall, wallLeft, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, wallRight, wall, wall, wall],
			[ wall, wall, wall, wallLeft, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, wallRight, wall, wall, wall],
			[ wall, wall, wall, wallLeft, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, wallRight, wall, wall, wall],
			[ wall, wall, wall, wallLeft, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, wallRight, wall, wall, wall],
			[ wall, wall, wall, wallLeft, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, wallRight, wall, wall, wall],
			[ wall, wall, wall, wallLeft, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, wallRight, wall, wall, wall],
			[ wall, wall, wall, wallLeft, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, wallRight, wall, wall, wall],
			[ wall, wall, wall, wallLeft, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, wallRight, wall, wall, wall]		
		];
	
		
		Crafty.c("GameBackgroundObject", {
			init : function(){
				this.addComponent("2D, Canvas");
				this.size = 50;	
			},
			make: function(x, y){
				this.attr({
					x : (x * this.size),
					y : (y * this.size)	
				});	
			}
		});
	    
		Crafty.c("PlatformObject", {
			init : function(){
				this.addComponent("2D, Canvas, Collision, floor")
				this.h = 25;
				this.yspeed = platformSpeed;
				this.bind("EnterFrame", function(){
					this.move('n', this.yspeed);
					if ( this._y < -this.h ){
						switch ( Crafty.randRange(0, 2) ){
							case 0:
								Crafty.e("PlatformSingleObject").make( Crafty.randRange(GAMEPLANX, GAMEPLANX+GAMEPLANWIDTH-pSingleWidth), Crafty.viewport.height );
							break;
							case 1:
								Crafty.e("PlatformDoubleObject").make( Crafty.randRange(GAMEPLANX, GAMEPLANX+GAMEPLANWIDTH-pDoubleWidth), Crafty.viewport.height);
							break;
							case 2:
								Crafty.e("PlatformTrippleObject").make( Crafty.randRange(GAMEPLANX, GAMEPLANX+GAMEPLANWIDTH-pTrippleWidth), Crafty.viewport.height );
							break;
						}
						this.destroy();
					}
					this.yspeed = platformSpeed;
				});
		
			},  
			make: function(x, y){
				this.attr({
					x : x,
					y : y,	
				});			
			},
			speedUp : function(d){
				this.yspeed += d;
			}	
		});
		
		Crafty.c("PlatformSingleObject", {
			init : function(){
				this.addComponent("PlatformObject, platform")
				this.w = pSingleWidth;
			}
		});
		
		Crafty.c("PlatformDoubleObject", {
			init : function(){
				this.addComponent("PlatformObject, platformDouble")
				this.w = pDoubleWidth;
			}
		});
		
		Crafty.c("PlatformTrippleObject", {
			init : function(){
				this.addComponent("PlatformObject, platformTripple")
				this.w = pTrippleWidth;
			}
		});

		for ( i = 0; i<gameBoard.length; ++i){
			bgObject = gameBoard[i];
			for ( j = 0; j<bgObject.length; ++j){
				switch( bgObject[j] ){
					case spike:
						Crafty.e("GameBackgroundObject").addComponent("spike").make(j, i);
					break;
					case wall:
						Crafty.e("GameBackgroundObject").addComponent("wall").make(j, i);
					break;
					case wallLeft:
						Crafty.e("GameBackgroundObject").addComponent("wallLeft, Collision").make(j, i);
					break;	
					case wallRight:
						Crafty.e("GameBackgroundObject").addComponent("wallRight, Collision").make(j, i);
					break;					
				}
			}	
		}
		
		Crafty.e("PlatformDoubleObject").make( GAMEPLANX+50, GAMEPLANHEIGHT/2);
		
		player = Crafty.e("2D, Canvas, Controls, Collision, Twoway, Gravity, beny")
			.attr({
				size : 50,
			 	x : GAMEPLANX+50,
			 	y : GAMEPLANHEIGHT/2 - 100
			})
			.twoway(7, -1)
			.gravity("floor")
			.collision()
			.onHit("wallRight", function() {
				this.x = GAMEPLANX + GAMEPLANWIDTH - this.size;
			})
			.collision().onHit("wallLeft", function() {
				this.x = GAMEPLANX;
			})
			.collision().onHit("PlatformObject", function(e){
				this.isOnPlatform = true;
				this.yspeed = e[0].obj.yspeed;
			}, function(){
				this.isOnPlatform = false;
			})
			.collision().onHit("spike", function(){
				timer.stop();
				Crafty.scene("main");
				counter = 0;
			})
			.bind("EnterFrame", function (){
				if ( this.isOnPlatform ){
					this.move('n', this.yspeed);
				}
				if ( this._y > Crafty.viewport.height ){
					timer.stop();
					Crafty.scene("main");
					counter = 0;	
				}
			});
		
		j = GAMEPLANHEIGHT/2 + 150;
		for ( i = 0; i < 4; i++){
			switch ( Crafty.randRange(0, 2) ){
				case 0:
					Crafty.e("PlatformSingleObject").make( Crafty.randRange(GAMEPLANX, GAMEPLANX+GAMEPLANWIDTH-pSingleWidth), j)
				break;
				case 1:
					Crafty.e("PlatformDoubleObject").make( Crafty.randRange(GAMEPLANX, GAMEPLANX+GAMEPLANWIDTH-pDoubleWidth), j);
				break;
				case 2:
					Crafty.e("PlatformTrippleObject").make( Crafty.randRange(GAMEPLANX, GAMEPLANX+GAMEPLANWIDTH-pTrippleWidth), j);
				break;
			}
			j = j + 100;	
		}
		
	});
	
});
