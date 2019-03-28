#!/usr/bin/env node  
"use strict";
const commandLineArgs = require('command-line-args')
const fetch = require('node-fetch');

const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'src', type: String, multiple: true, defaultOption: true },
    { name: 'timeout', alias: 't', type: Number }
  ]

const options = commandLineArgs(optionDefinitions)

fetch('http://localhost:8080/test')
    .then(res => res.text())
    .then(body => console.log(body));

