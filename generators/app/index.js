var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = class extends yeoman {
    
    promptUser(){
        var done = this.async();
 
        // have Yeoman greet the user
        console.log(this.yeoman);
 
        var prompts = [{
            name: 'appName',
            message: 'What is your app\'s name ?'
        },{
            type: 'confirm',
            name: 'addDemoSection',
            message: 'Would you like to generate a demo section ?',
            default: true
        }];
 
        this.prompt(prompts, function (props) {
            this.appName = props.appName;
            this.addDemoSection = props.addDemoSection;
   
            done();
        }.bind(this));

    }

};