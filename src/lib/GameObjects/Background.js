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
    let self = this;
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
    this.__construct(this, options);
    let image = new Image();
    let loaded = false;
    let pattern;
    this.__update = function(JSGameEngine){
        let ctx = JSGameEngine.ctx;
        if(self.image !== image.src){
            loaded = false;
            pattern = undefined;
            image.onload = function(){
                self.imageWidth = image.width;
                self.imageHeight = image.height;
                loaded = true;
            };
            image.src = self.image;
        }
        if(!loaded){
            if(self.color.alpha > 0){
                ctx.fillStyle = self.color.toString();
            }
        }else{
            if(pattern === undefined){
                pattern = ctx.createPattern(image, 'repeat');
            }
            ctx.fillStyle = pattern;
        }
        ctx.fillRect(Math.round(self.transform.position.x), Math.round(self.transform.position.y), Math.round(self.width), Math.round(self.height));
        self.onUpdate(JSGameEngine);
    };
    this.__init = function(JSGameEngine){
        image.onload = function(){
            self.imageWidth = image.width;
            self.imageHeight = image.height;
            console.log('loaded');
            loaded = true;
        };
        image.src = self.image;
        self.width = self.width || JSGameEngine.width;
        self.height = self.height || JSGameEngine.height;
    };
  }
}
