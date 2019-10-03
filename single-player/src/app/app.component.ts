import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  
  	@ViewChild('canvas', {static:false})
  	canvas : ElementRef;

	private canvasElement: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	
	private user;
	private computer;
	private net;
	private ball;

	ngAfterViewInit()
	{
		this.canvasElement = this.canvas.nativeElement;
		this.ctx = this.canvasElement.getContext('2d');

		this.user = {
			x : 0,
			y : (this.canvasElement.height - 100)/2,
			width : 10,
			height : 100,
			score : 0,
			color : "#FFF"
		}
	
		this.computer = {
			x : this.canvasElement.width-10,
			y : (this.canvasElement.height - 100)/2,
			width : 10,
			height : 100,
			score : 0,
			color : "#FFF"
		}
	
		this.net = {
			x : (this.canvasElement.width - 2)/2,
			y : 0,
			height : 10,
			width : 2,
			color  : "#FFF"
		}
	
		this.ball = {
			x : this.canvasElement.width/2,
			y : this.canvasElement.height/2,
			radius : 10,
			velocityX : 5,
			velocityY : 5,
			speed : 7,
			color : "#FFF"
		}
		
		let framePerSecond = 50;
		let loop = setInterval(() => {this.render(); this.update()},1000/framePerSecond);
		
	}

	@HostListener('document:mousemove', ['$event']) 
	getMousePos(e)
	{
		let rect = this.canvasElement.getBoundingClientRect();
    	this.user.y = e.clientY - rect.top - this.user.height/2;
	}

	collision(b, p)
	{
		p.top    = p.y;
		p.bottom = p.y + p.height;
		p.left   = p.x;
		p.right  = p.x + p.width;

		b.top = b.y - b.radius;
		b.bottom = b.y + b.radius;
		b.left = b.x - b.radius;
		b.right = b.x + b.radius;

		return (b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom);
	}

	game()
	{
		console.log(this.collision(this.ball, this.user));
	}

	update()
	{
		if(this.ball.x - this.ball.radius < 0 )
		{
			this.computer.score++;
			this.resetBall();
		}
		else if(this.ball.x + this.ball.radius > this.canvasElement.width)
		{
			this.user.score++;
			this.resetBall();
		}

		this.ball.x += this.ball.velocityX;
		this.ball.y += this.ball.velocityY;

		this.computer.y += ((this.ball.y - (this.computer.y + this.computer.height/2)))*0.1;
		if(this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > this.canvasElement.height)
		{
			this.ball.velocityY = -this.ball.velocityY;
		}

		let player = (this.ball.x < this.canvasElement.width/2)? this.user : this.computer;
		if(this.collision(this.ball, player))
		{
			let collidePoint = (this.ball.y - (player.y + player.height/2));
			collidePoint = collidePoint / (player.height/2);

			let angleRad = (Math.PI/4) * collidePoint;
			let direction = (this.ball.x + this.ball.radius < this.canvasElement.width/2) ? 1 : -1;
			
			this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
			this.ball.velocityY = this.ball.speed * Math.sin(angleRad);

			this.ball.speed += 0.1;
		}

	}

	drawRect(x, y, w, h, color)
	{
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x,y,w,h);
	}

	drawArc(x, y, r, color)
	{
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, Math.PI*2, true);
		this.ctx.closePath();
		this.ctx.fill();
	}

	drawText(text, x, y)
	{
		this.ctx.fillStyle = "#FFF";
		this.ctx.font = "50px fantasy";
		this.ctx.fillText(text, x, y);
	}

	drawNet()
	{
		for(let i=0; i<= this.canvasElement.height; i=i+15)
		{
			this.drawRect(this.net.x, this.net.y + i, this.net.width, this.net.height, this.net.color);
		}
	}

	resetBall()
	{
		this.ball.x = this.canvasElement.width/2;
		this.ball.y = this.canvasElement.height/2;
		this.ball.speed = 5;
		this.ball.velocityX = -this.ball.velocityX;
	}

	render()
	{
		// clear canvas
		this.drawRect(0, 0, this.canvasElement.width, this.canvasElement.height, "#000");

		// player 1
		this.drawRect(this.user.x, this.user.y, this.user.width, this.user.height, this.user.color); // bat
		this.drawText(this.user.score, this.canvasElement.width/4, this.canvasElement.height/5); // score

		// net & ball
		this.drawNet();
		this.drawArc(this.ball.x, this.ball.y, this.ball.radius, this.ball.color);

		// player 2
		this.drawRect(this.computer.x, this.computer.y, this.computer.width, this.computer.height, this.computer.color); // bat
		this.drawText(this.computer.score, 3*this.canvasElement.width/4, this.canvasElement.height/5); // score
	}
  

}
