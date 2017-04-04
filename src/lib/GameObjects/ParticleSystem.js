/**
 * @file JSGame ParticleSystem GameObject.
 * @package jsgame
 * @copyright (c) 2016, Thomas Alrek
 * @author Thomas Alrek <thomas@alrek.no>
 */

'use strict';

import { Vector2 } from '../Components/Vector2';
import { Color } from '../Components/Color';
import { Transform } from '../Components/Transform';
import { GameObject } from '../Class/GameObject';
import { Particle } from './Particle';

/**
 * @class ParticleSystem
 * Creates a new instance of ParticleSystem.
 * <p><i>ParticleSystem is an instance of GameObject</i></p>
 *
 * @constructor
 * @param {options} options An object containing construct options
 * @property {number} count A number representing the number of particles
 * @property {Vector2} speed A Vector2 representing the velocity of the particles
 * @property {Color} color A Color instance representing the particles color
 * @property {boolean} loop If false, this ParticleSystem will not loop
 * @property {String} blendMode CanvasRenderingContext2D.globalCompositeOperation
 * @property {boolean} glow If false, the particles will have an hard edge
 * @property {number} life The maxmimum life of a particle
 * @property {number} radius The initial radius of a particle
 * @property {boolean} radial If true the particles will be emitted spherical
 * @property {Particle[]} particles An array containing all Particles
 */
export default class ParticleSystem{
  constructor(options){
    super(options);
    let self = this;
    this.__extend(GameObject, this, options);
    this.count = 50;
    this.speed = new Vector2({
        x: 2,
        y: 2,
        parent: self
    });
    this.color = new Color({
        r: 255,
        g: 255,
        b: 255,
        parent: self
    });
    this.loop = false;
    this.blendMode = 'lighter';
    this.glow = true;
    this.life = 100;
    this.radius = 10;
    this.radial = true;
    this.particles = [];
    let speed = new Vector2(this.speed);
    let width = this.width;
    let height = this.height;
    this.__construct(this, options);

    function addParticle(index){
        let particle = new Particle({
            transform: new Transform(self.transform),
            speed: new Vector2({
        x: speed.x + Math.random() * speed.x,
        y: speed.y + Math.random() * speed.y
            }),
            radius: self.radius + Math.random() * self.radius,
            life: self.life + Math.random() * self.life,
            color: new Color({
                r: Math.round(Math.random() * self.color.r),
                g: Math.round(Math.random() * self.color.g),
                b: Math.round(Math.random() * self.color.b)
            }),
            parent: self
        });
		if(typeof index !== 'undefined'){
			self.particles[index] = particle;
		}else{
			self.particles.push(particle);
		}
	}
    this.__update = function(JSGameEngine){
		if(self.radial){
			speed.x = (Math.random() * (self.speed.x * 2)) - self.speed.x;
			speed.y = (Math.random() * (self.speed.y * 2)) - self.speed.y;
		}else{
			speed.x = self.speed.x;
			speed.y = self.speed.y;
		}
		if(self.particles.length < self.count){
			for(let i = 0; i < self.count - self.particles.length; i++){
				addParticle();
			}
		}
		if(self.particles.length > self.count){
			for(let i = 0; i < self.particles.length - self.count; i++){
				self.particles.pop();
			}
		}
		let ctx = JSGameEngine.ctx;
		if(self.blendMode){
			ctx.globalCompositeOperation = self.blendMode;
		}
		for(let i = 0; i < self.particles.length; i++){
			let p = self.particles[i];
			ctx.beginPath();
			p.color.alpha = Math.round(p.remainingLife / p.life * self.count) / self.count;
			if(typeof p.color.alpha !== 'number' || isNaN(p.color.alpha)){
				addParticle(i);
				continue;
			}
			let gradient = ctx.createRadialGradient(p.transform.position.x, p.transform.position.y, 0, p.transform.position.x, p.transform.position.y, p.radius);
			gradient.addColorStop(0, "rgba(" + p.color.r + ", " + p.color.g + ", " + p.color.b + ", " + p.color.alpha + ")");
			gradient.addColorStop(0.5, "rgba(" + p.color.r + ", " + p.color.g + ", " + p.color.b + ", " + p.color.alpha + ")");
			if(self.glow){
				gradient.addColorStop(1, "rgba(" + p.color.r + ", " + p.color.g + ", " + p.color.b + ", " + 0 + ")");
			}else{
				gradient.addColorStop(1, "rgba(" + p.color.r + ", " + p.color.g + ", " + p.color.b + ", " + p.color.alpha + ")");
			}
			ctx.fillStyle = gradient;
			ctx.arc(Math.round(p.transform.position.x), Math.round(p.transform.position.y), Math.round(p.radius), Math.PI * 2, false);
			ctx.fill();
			p.remainingLife--;
			p.radius--;
			p.transform.position = p.transform.position.add(p.speed);

			if(p.remainingLife < 0 || p.radius < 0){
				if(self.loop){
					addParticle(i);
				}else{
					self.particles.splice(i, 1);
				}
			}
		}
        self.onUpdate(JSGameEngine);
    };
    this.__init = function(JSGameEngine){};
    this.__fixedUpdate = function(JSGameEngine){
        if(self.width !== width){
            self.radius = self.width / 2;
            width = self.width;
        }
        if(self.height !== height){
            self.radius = self.height / 2;
            height = self.height;
        }
		self.width = self.radius * 2;
		self.height = self.radius * 2;
        self.onFixedUpdate(JSGameEngine);
    };
  }
}
