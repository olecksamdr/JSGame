/**
 * @file JSGame Background GameObject.
 * @package jsgame
 * @copyright (c) 2016, Thomas Alrek
 * @author Thomas Alrek <thomas@alrek.no>
 */

'use strict';

import { GameObject } from '../Class/GameObject';
import { Color } from '../Components/Color';

/**
 * @class Background
 * Creates a new instance of Background.
 * <p><i>Background is an instance of GameObject</i></p>
 *
 * @constructor
 * @param {options} options An object containing construct options
 */
export default class Background extends GameObject{
  constructor(options) {
    super(options);
    this.color = new Color({
        r: 0,
        g: 0,
        b: 0,
        alpha: 0,
        parent: this
    });
    this.image = '';
    this.imageWidth = 0;
    this.imageHeight = 0;
    let image = new Image();
    let loaded = false;
    let pattern;
    this.__update = JSGameEngine => {
        let ctx = JSGameEngine.ctx;
        if(this.image !== image.src){
            loaded = false;
            pattern = undefined;
            image.onload = function(){
                this.imageWidth = image.width;
                this.imageHeight = image.height;
                loaded = true;
            };
            image.src = this.image;
        }
        if(!loaded){
            if(this.color.alpha > 0){
                ctx.fillStyle = this.color.toString();
            }
        }else{
            if(pattern === undefined){
                pattern = ctx.createPattern(image, 'repeat');
            }
            ctx.fillStyle = pattern;
        }
        ctx.fillRect(Math.round(this.transform.position.x), Math.round(this.transform.position.y), Math.round(this.width), Math.round(this.height));
        this.onUpdate(JSGameEngine);
    };
    this.__init = JSGameEngine => {
        image.onload = () => {
            this.imageWidth = image.width;
            this.imageHeight = image.height;
            console.log('loaded');
            loaded = true;
        };
        image.src = this.image;
        this.width = this.width || JSGameEngine.width;
        this.height = this.height || JSGameEngine.height;
    };
  }
}
