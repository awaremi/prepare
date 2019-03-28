#!/usr/bin/env node  
"use strict";
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const fetch = require('node-fetch')

const optionDefinitions = [
    { name: 'platform', alias: 'p', type: String, description: 'Project platform, ie: ng (Angular) or boot (Spring Boot)' },
    { name: 'component', alias: 'c', type: String, description: 'Component type to be generated' },
    { name: 'name', alias: 'n', type: String, description: 'Component name or prefix' },
    { name: 'input', alias: 'i', type: String, typeLabel: '{underline JSON file}', description: 'Configuration / input parameter'},
    { name: 'output', alias: 'o', type: String, typeLabel: '{underline folder}', description: 'Target folder to put generated file/files'},
    { name: 'interactive', alias: 't', type: Boolean, description: 'Interactive mode, input file will be ignored' },
    { name: 'help', alias: 'h', type: Boolean, description: 'Option description' },
  ]

const options = commandLineArgs(optionDefinitions)

const sections = [
  { header: 'Prepare', content: 'Generating skeleton and application component source code files, to help programmer developing databases application'},
  { header: 'Options', optionList: optionDefinitions },
  { header: 'Example', content: 'prepare -p ng -t retrieval -n balance -i definition.json'},
]

const usage = commandLineUsage(sections)

if (options.help) {
  console.log(usage)
  return
}

async function xyz(){

const outcome = await new Promise((outcome) => fetch(`http://localhost:8080/generate/${options.platform}/${options.component}/${options.name}`, 
    {method: 'POST', body: JSON.stringify(options), headers: { 'Content-Type': 'application/json' }})
    .then(res => res.json())
    .then(body => outcome(body)))

console.log(outcome)    
}

xyz()
